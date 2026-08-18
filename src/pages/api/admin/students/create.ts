import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { createTransport } from 'nodemailer';
import { getCountryIsoCode, getStateIsoCode } from '@/utils/locationData';
import { sanitizeText } from '@/utils/sanitize';
import { studentCreateSchema } from '@/utils/validation';

// Builds a fallback student ID when the RPC is unavailable, e.g. GLOBAL-NA-2026-07-0123
function buildFallbackStudentId(countryCode: string, stateCode: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${countryCode}-${stateCode}-${year}-${month}-${random}`;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Create Supabase client for the request to verify admin
    const supabase = createPagesServerClient({ req, res });

    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return res.status(401).json({
        error: 'Authentication required',
        requiresAuth: true
      });
    }

    // Verify user is admin
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const validated = studentCreateSchema.parse(req.body);
    const {
      full_name,
      email,
      password,
      phone,
      date_of_birth,
      parent_name,
      highest_qualification,
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode,
      courseIds = []
    } = validated;

    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Admin client not configured'
      });
    }

    const tempPassword = password;
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        full_name,
        role: 'student'
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }

      return res.status(400).json({
        error: 'Failed to create user account'
      });
    }

    if (!authData.user) {
      return res.status(500).json({ error: 'Failed to create user account' });
    }

    const userId = authData.user.id;

    // Always generate a student ID. Use the supplied country/state when available,
    // otherwise fall back to generic codes so every student still gets an ID.
    let studentId = null;

    const countryCode = country ? getCountryIsoCode(country) : 'GLOBAL';
    const stateCode = country && state ? getStateIsoCode(state, countryCode) : 'NA';

    try {
      const { data: studentIdResult, error: studentIdError } = await supabaseAdmin.rpc('generate_student_id', {
        country_code: countryCode,
        state_code: stateCode
      });

      if (studentIdError) {
        studentId = buildFallbackStudentId(countryCode, stateCode);
      } else {
        studentId = studentIdResult;
      }
    } catch (rpcError) {
      studentId = buildFallbackStudentId(countryCode, stateCode);
    }

    // Create profile using admin client
    const profileData: any = {
      id: userId,
      full_name,
      email,
      role: 'student',
      phone: phone || null,
      date_of_birth: date_of_birth || null,
      parent_name: parent_name || null,
      highest_qualification: highest_qualification || null,
      address_line1: address_line1 || null,
      address_line2: address_line2 || null,
      city: city || null,
      state: state || null,
      country: country || null,
      pincode: pincode || null,
      student_id: studentId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { error: profileCreateError } = await supabaseAdmin
      .from('profiles')
      .insert(profileData);

    if (profileCreateError) {
      await supabaseAdmin.auth.admin.deleteUser(userId);

      return res.status(500).json({
        error: 'Failed to create student profile. Please try again.'
      });
    }

    // Enroll student in selected courses
    const enrollments = [];
    if (courseIds && courseIds.length > 0) {
      for (const courseId of courseIds) {
        try {
          const { data: enrollment, error: enrollmentError } = await supabaseAdmin
            .from('enrollments')
            .insert({
              user_id: userId,
              course_id: courseId,
              status: 'active',
              progress: 0,
              enrolled_at: new Date().toISOString()
            })
            .select('id, course:courses(id, title)')
            .single();

          if (!enrollmentError && enrollment) {
            enrollments.push(enrollment);
          }
        } catch (enrollError) {
        }
      }
    }

    // Send email notification with login credentials
    try {
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const safeFullName = sanitizeText(full_name);
      const safeEmail = sanitizeText(email);
      const safeStudentId = studentId ? sanitizeText(studentId) : '';

      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'support@it-wala.com',
        to: email,
        subject: 'Welcome to ITwala Academy - Your Account Details',
        html: `
          <h2>Welcome to ITwala Academy!</h2>
          <p>Dear ${safeFullName},</p>
          <p>Your student account has been created by our admin team. Here are your login details:</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${safeEmail}</p>
            ${safeStudentId ? `<p><strong>Student ID:</strong> ${safeStudentId}</p>` : ''}
          </div>

          <p><strong>Important:</strong> Please use the password you set during account creation. If you need to reset your password, use the "Forgot Password" option on the login page.</p>

          <p>You can log in to the student portal at: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://it-wala.com'}/auth">Student Login</a></p>

          ${enrollments.length > 0 ? `
            <h3>Your Enrolled Courses:</h3>
            <ul>
              ${enrollments.map(e => `<li>${sanitizeText(e.course.title)}</li>`).join('')}
            </ul>
          ` : ''}

          <p>If you have any questions, please contact us at support@it-wala.com or call +91 7982303199.</p>

          <p>Best regards,<br>ITwala Academy Team</p>
        `,
      });

      // Send notification to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'support@it-wala.com',
        to: 'support@it-wala.com',
        subject: `New Student Created: ${safeFullName}`,
        html: `
          <h2>New Student Account Created</h2>
          <p>A new student account has been created by ${session.user.email}</p>

          <h3>Student Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${safeFullName}</li>
            <li><strong>Email:</strong> ${safeEmail}</li>
            ${safeStudentId ? `<li><strong>Student ID:</strong> ${safeStudentId}</li>` : ''}
            ${phone ? `<li><strong>Phone:</strong> ${sanitizeText(phone)}</li>` : ''}
            ${date_of_birth ? `<li><strong>Date of Birth:</strong> ${sanitizeText(date_of_birth)}</li>` : ''}
            ${parent_name ? `<li><strong>Parent Name:</strong> ${sanitizeText(parent_name)}</li>` : ''}
            ${highest_qualification ? `<li><strong>Highest Qualification:</strong> ${sanitizeText(highest_qualification)}</li>` : ''}
            ${city ? `<li><strong>City:</strong> ${sanitizeText(city)}</li>` : ''}
            ${state ? `<li><strong>State:</strong> ${sanitizeText(state)}</li>` : ''}
            ${country ? `<li><strong>Country:</strong> ${sanitizeText(country)}</li>` : ''}
          </ul>

          ${enrollments.length > 0 ? `
            <h3>Enrolled Courses:</h3>
            <ul>
              ${enrollments.map(e => `<li>${sanitizeText(e.course.title)}</li>`).join('')}
            </ul>
          ` : '<p>No courses enrolled yet.</p>'}

          <p>Created at: ${new Date().toLocaleString()}</p>
        `,
      });

      // Don't fail the student creation if email fails
    } catch (emailError) {
      // Email sending failed, but continue with student creation
    }

    return res.status(201).json({
      message: 'Student created successfully',
      student: {
        id: userId,
        full_name,
        email,
        student_id: studentId,
        enrollments: enrollments.map(e => ({
          course_id: e.course.id,
          course_title: e.course.title
        }))
      }
    });

  } catch (error: any) {
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      error: 'Failed to create student',
      ...(isDev && { details: error.message })
    });
  }
}
