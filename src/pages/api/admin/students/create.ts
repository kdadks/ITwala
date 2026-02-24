import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { createTransport } from 'nodemailer';
import { getCountryIsoCode, getStateIsoCode } from '@/utils/locationData';

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

    // Extract form data
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
    } = req.body;

    // Validate required fields
    if (!full_name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate password length
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if admin client is available
    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.'
      });
    }

    // Create auth user using Supabase Admin API
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
      console.error('Auth user creation error:', authError);

      // Handle specific errors
      if (authError.message.includes('already registered')) {
        return res.status(409).json({ error: 'A user with this email already exists' });
      }

      return res.status(400).json({
        error: authError.message || 'Failed to create user account'
      });
    }

    if (!authData.user) {
      return res.status(500).json({ error: 'Failed to create user account' });
    }

    const userId = authData.user.id;

    // Generate student ID if country and state are provided
    let studentId = null;
    if (country && state) {
      const countryCode = getCountryIsoCode(country);
      const stateCode = getStateIsoCode(state, countryCode);

      try {
        const { data: studentIdResult, error: studentIdError } = await supabaseAdmin.rpc('generate_student_id', {
          country_code: countryCode,
          state_code: stateCode
        });

        if (studentIdError) {
          console.error('Error generating student ID:', studentIdError);
          // Generate a fallback student ID
          const now = new Date();
          const year = now.getFullYear();
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
          studentId = `${countryCode}-${stateCode}-${year}-${month}-${random}`;
        } else {
          studentId = studentIdResult;
        }
      } catch (rpcError) {
        console.error('RPC error generating student ID:', rpcError);
        // Generate a fallback student ID
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const random = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
        studentId = `${countryCode}-${stateCode}-${year}-${month}-${random}`;
      }
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
      console.error('Profile creation error:', profileCreateError);

      // If profile creation fails, delete the auth user
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
          } else {
            console.error(`Failed to enroll in course ${courseId}:`, enrollmentError);
          }
        } catch (enrollError) {
          console.error(`Error enrolling in course ${courseId}:`, enrollError);
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

      // Send email to student with login credentials
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'sales@it-wala.com',
        to: email,
        subject: 'Welcome to ITwala Academy - Your Account Details',
        html: `
          <h2>Welcome to ITwala Academy!</h2>
          <p>Dear ${full_name},</p>
          <p>Your student account has been created by our admin team. Here are your login credentials:</p>

          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Password:</strong> ${password}</p>
            ${studentId ? `<p><strong>Student ID:</strong> ${studentId}</p>` : ''}
          </div>

          <p><strong>Important:</strong> Please keep these credentials secure and change your password after your first login.</p>

          <p>You can log in to the student portal at: <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://it-wala.com'}/auth">Student Login</a></p>

          ${enrollments.length > 0 ? `
            <h3>Your Enrolled Courses:</h3>
            <ul>
              ${enrollments.map(e => `<li>${e.course.title}</li>`).join('')}
            </ul>
          ` : ''}

          <p>If you have any questions, please contact us at sales@it-wala.com or call +91 7982303199.</p>

          <p>Best regards,<br>ITwala Academy Team</p>
        `,
      });

      // Send notification to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'sales@it-wala.com',
        to: 'sales@it-wala.com',
        subject: `New Student Created: ${full_name}`,
        html: `
          <h2>New Student Account Created</h2>
          <p>A new student account has been created by ${session.user.email}</p>

          <h3>Student Details:</h3>
          <ul>
            <li><strong>Name:</strong> ${full_name}</li>
            <li><strong>Email:</strong> ${email}</li>
            ${studentId ? `<li><strong>Student ID:</strong> ${studentId}</li>` : ''}
            ${phone ? `<li><strong>Phone:</strong> ${phone}</li>` : ''}
            ${date_of_birth ? `<li><strong>Date of Birth:</strong> ${date_of_birth}</li>` : ''}
            ${parent_name ? `<li><strong>Parent Name:</strong> ${parent_name}</li>` : ''}
            ${highest_qualification ? `<li><strong>Highest Qualification:</strong> ${highest_qualification}</li>` : ''}
            ${city ? `<li><strong>City:</strong> ${city}</li>` : ''}
            ${state ? `<li><strong>State:</strong> ${state}</li>` : ''}
            ${country ? `<li><strong>Country:</strong> ${country}</li>` : ''}
          </ul>

          ${enrollments.length > 0 ? `
            <h3>Enrolled Courses:</h3>
            <ul>
              ${enrollments.map(e => `<li>${e.course.title}</li>`).join('')}
            </ul>
          ` : '<p>No courses enrolled yet.</p>'}

          <p>Created at: ${new Date().toLocaleString()}</p>
        `,
      });

      console.log('✅ Student account emails sent successfully');
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError);
      // Don't fail the student creation if email fails
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
    console.error('Student creation error:', error);
    return res.status(500).json({
      error: 'Failed to create student',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
