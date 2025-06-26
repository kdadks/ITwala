import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { courseId, userDetails } = req.body;

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

    // Update user profile with additional details if provided
    if (userDetails) {
      // Build address string from individual components
      const addressParts = [
        userDetails.addressLine1,
        userDetails.addressLine2,
        userDetails.city,
        userDetails.state,
        userDetails.pincode,
        userDetails.country || 'India'
      ].filter(Boolean);
      
      const fullAddress = addressParts.length > 0 ? addressParts.join(', ') : null;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: userDetails.name || session.user.user_metadata?.full_name,
          phone: userDetails.phone,
          address: fullAddress,
          highest_qualification: userDetails.highestQualification,
          has_laptop: userDetails.hasLaptop
        })
        .eq('id', userId);

      if (profileError) {
        console.error('Profile update error:', profileError);
        // Don't fail enrollment if profile update fails
      }
    }

    // Create enrollment record
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

    // The database trigger will automatically assign the 'student' role
    // But let's also verify the user's profile was updated
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    // Send enrollment notification email
    try {
      const notificationResponse = await fetch(`${req.headers.origin}/api/enrollment/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          courseId,
          name: userDetails?.name || session.user.user_metadata?.full_name || session.user.email,
          email: session.user.email,
          phone: userDetails?.phone
        }),
      });

      if (!notificationResponse.ok) {
        console.error('Failed to send enrollment notification');
      }
    } catch (emailError) {
      console.error('Email notification error:', emailError);
      // Don't fail enrollment if email fails
    }

    return res.status(200).json({
      message: 'Successfully enrolled in the course',
      enrollment,
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