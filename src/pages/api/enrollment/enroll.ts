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
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { courseId, userDetails, directEnrollment } = req.body;

    if (!courseId) {
      return res.status(400).json({ message: 'Course ID is required' });
    }

    // Create Supabase client for the request
    const supabase = createPagesServerClient({ req, res });
    
    // Get the current user session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return res.status(401).json({
        message: 'Authentication required',
        requiresAuth: true
      });
    }

    const userId = session.user.id;

    // Check if user is already enrolled
    const { data: existingEnrollment, error: checkError } = await supabase
      .from('enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows returned
      throw checkError;
    }

    if (existingEnrollment) {
      return res.status(409).json({ message: 'Already enrolled in this course' });
    }

    // Get course details
    const { data: course, error: courseError } = await supabase
      .from('courses')
      .select('id, title, description, price')
      .eq('id', courseId)
      .single();

    if (courseError) {
      throw new Error(`Course not found: ${courseError.message}`);
    }

    // For direct enrollment, get existing profile info (including student_id)
    let profileData = null;
    if (directEnrollment) {
      const { data: existingProfile, error: profileFetchError } = await supabase
        .from('profiles')
        .select('full_name, phone, address_line1, address_line2, city, state, country, pincode, highest_qualification, degree_name, has_laptop, student_id')
        .eq('id', userId)
        .single();

      if (profileFetchError) {
        console.error('Error fetching existing profile:', profileFetchError);
        return res.status(400).json({ message: 'Unable to fetch profile for direct enrollment' });
      }
      
      profileData = existingProfile;
    } else {
      // For form-based enrollment, also fetch profile to check student_id
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('student_id, country, state')
        .eq('id', userId)
        .single();
      
      profileData = existingProfile;
    }

    // Update user profile with additional details if provided (for form-based enrollment)
    if (userDetails && !directEnrollment) {
      try {
        // Build address string from individual components for backward compatibility
        const addressParts = [
          userDetails.addressLine1,
          userDetails.addressLine2,
          userDetails.city,
          userDetails.state,
          userDetails.pincode,
          userDetails.country || 'India'
        ].filter(Boolean);
        
        const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : '';

        // Use the new database function for profile updates
        const { data: updateResult, error: profileError } = await supabase.rpc('update_profile_direct', {
          profile_updates: {
            full_name: userDetails.name || session.user.user_metadata?.full_name || '',
            phone: userDetails.phone || '',
            date_of_birth: userDetails.dateOfBirth || '',
            address: fullAddress,
            address_line1: userDetails.addressLine1 || '',
            address_line2: userDetails.addressLine2 || '',
            city: userDetails.city || '',
            state: userDetails.state || '',
            country: userDetails.country || 'India',
            pincode: userDetails.pincode || '',
            highest_qualification: userDetails.highestQualification || '',
            degree_name: userDetails.degreeName || '',
            has_laptop: userDetails.hasLaptop || false
          }
        });

        if (profileError) {
          console.error('Profile update error:', profileError);
          // Don't fail enrollment if profile update fails, but log the issue
          console.warn('Profile update failed during enrollment, but enrollment will continue');
        } else {
          console.log('Profile updated successfully during enrollment:', updateResult);
        }
      } catch (profileUpdateError) {
        console.error('Unexpected error during profile update:', profileUpdateError);
        // Don't fail enrollment if profile update fails
      }
    }

    // Get country and state for student ID generation
    let countryName = 'India';
    let stateName = '';
    
    if (directEnrollment && profileData) {
      countryName = profileData.country || 'India';
      stateName = profileData.state || '';
    } else if (userDetails) {
      countryName = userDetails.country || 'India';
      stateName = userDetails.state || '';
    }

    // Generate student ID only if profile doesn't already have one (1:1 with student)
    let studentId = profileData?.student_id || null;
    
    if (!studentId) {
      // Get ISO codes for student ID
      const countryCode = getCountryIsoCode(countryName);
      const stateCode = getStateIsoCode(stateName, countryCode);

      try {
        const { data: studentIdResult, error: studentIdError } = await supabase.rpc('generate_student_id', {
          country_code: countryCode,
          state_code: stateCode
        });

        if (studentIdError) {
          console.error('Error generating student ID:', studentIdError);
          // Generate a fallback student ID if database function fails
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

      // Update profile with student ID (1:1 relationship)
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ student_id: studentId })
        .eq('id', userId);

      if (profileUpdateError) {
        console.error('Error updating profile with student ID:', profileUpdateError);
      } else {
        console.log('Student ID assigned to profile:', studentId);
      }
    } else {
      console.log('Using existing student ID from profile:', studentId);
    }

    // Create enrollment record (student_id is now on profile, not enrollment)
    const { data: enrollment, error: enrollmentError } = await supabase
      .from('enrollments')
      .insert({
        user_id: userId,
        course_id: courseId,
        status: 'active',
        progress: 0,
        enrolled_at: new Date().toISOString()
      })
      .select()
      .single();

    if (enrollmentError) {
      if (enrollmentError.code === '23505') { // Unique violation
        return res.status(409).json({ message: 'Already enrolled in this course' });
      }
      throw enrollmentError;
    }

    // Ensure the user gets the student role (if they don't already have admin or instructor)
    let updatedProfile = null;
    try {
      const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();

      // If user doesn't have admin or instructor role, update to student
      if (currentProfile && !['admin', 'instructor'].includes(currentProfile.role)) {
        const { data: roleUpdateResult } = await supabase.rpc('update_profile_direct', {
          profile_updates: {
            role: 'student'
          }
        });
        
        console.log('Role updated to student:', roleUpdateResult);
      }

      // Get updated profile
      const { data: finalProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      updatedProfile = finalProfile;
    } catch (roleError) {
      console.error('Error updating user role:', roleError);
      // Default to student if role update fails
      updatedProfile = { role: 'student' };
    }

    // Send enrollment notification email directly
    try {
      console.log('Sending enrollment notification emails...');
      
      // Create a transporter using SMTP
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      const studentName = directEnrollment
        ? (profileData?.full_name || session.user.user_metadata?.full_name || session.user.email)
        : (userDetails?.name || session.user.user_metadata?.full_name || session.user.email);
      const studentEmail = session.user.email;
      const studentPhone = directEnrollment
        ? profileData?.phone
        : userDetails?.phone;

      console.log('Sending email to admin...');
      // Send email to admin
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'sales@it-wala.com',
        to: 'sales@it-wala.com',
        subject: `New Course Enrollment: ${course.title}`,
        html: `
          <h2>New Course Enrollment</h2>
          <p><strong>Student ID:</strong> ${studentId}</p>
          <p><strong>Course:</strong> ${course.title}</p>
          <p><strong>Student Name:</strong> ${studentName}</p>
          <p><strong>Student Email:</strong> ${studentEmail}</p>
          <p><strong>Student Phone:</strong> ${studentPhone || 'Not provided'}</p>
          <p><strong>Country:</strong> ${countryName}</p>
          <p><strong>State:</strong> ${stateName || 'Not provided'}</p>
          <p><strong>Course Price:</strong> ₹${course.price}</p>
          <p><strong>Enrollment Date:</strong> ${new Date().toLocaleString()}</p>
        `,
      });

      console.log('Sending confirmation email to student...');
      // Send confirmation email to student
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'sales@it-wala.com',
        to: studentEmail,
        subject: `Enrollment Confirmation: ${course.title}`,
        html: `
          <h2>Enrollment Confirmation</h2>
          <p>Dear ${studentName},</p>
          <p>Thank you for enrolling in <strong>${course.title}</strong>.</p>
          <p><strong>Your Student ID: ${studentId}</strong></p>
          <p><em>Please save this Student ID for future reference.</em></p>
          ${directEnrollment ? '<p><em>You have been enrolled using your existing profile information for a faster enrollment process.</em></p>' : ''}
          <p>${course.description}</p>
          <p>Our team will contact you shortly with further details about the course schedule and payment options.</p>
          <p>If you have any questions, please contact us at sales@it-wala.com or call +91 7982303199.</p>
          <p>Best regards,<br>ITwala Academy Team</p>
        `,
      });

      console.log('✅ Enrollment notification emails sent successfully');
    } catch (emailError) {
      console.error('❌ Email notification error:', emailError);
      
      // More detailed error logging
      if (emailError.code === 'EAUTH') {
        console.error('Authentication error - check SMTP_USER and SMTP_PASS');
      } else if (emailError.code === 'ESOCKET') {
        console.error('Socket error - check SMTP host and port');
      } else if (emailError.code === 'EENVELOPE') {
        console.error('Envelope error - check from/to email addresses');
      }
      
      // Don't fail enrollment if email fails
    }

    return res.status(200).json({
      message: 'Successfully enrolled in the course',
      enrollment,
      studentId: studentId,
      userRole: updatedProfile?.role || 'student',
      course: {
        id: course.id,
        title: course.title
      }
    });

  } catch (error: any) {
    console.error('Enrollment error:', error);
    return res.status(500).json({
      message: 'Failed to enroll in the course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}