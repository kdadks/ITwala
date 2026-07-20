import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!['POST', 'DELETE'].includes(req.method || '')) {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Student ID is required' });
  }

  const courseId = req.body?.courseId;

  if (!courseId || typeof courseId !== 'string') {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    // Verify admin session
    const supabase = createPagesServerClient({ req, res });
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session?.user) {
      return res.status(401).json({
        error: 'Authentication required',
        requiresAuth: true
      });
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profileError || profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    if (!supabaseAdmin) {
      return res.status(500).json({
        error: 'Admin client not configured. Please set SUPABASE_SERVICE_ROLE_KEY environment variable.'
      });
    }

    // Verify the student exists
    const { data: student, error: studentError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('id', id)
      .single();

    if (studentError || !student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    // Verify the course exists
    const { data: course, error: courseError } = await supabaseAdmin
      .from('courses')
      .select('id, title')
      .eq('id', courseId)
      .single();

    if (courseError || !course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (req.method === 'DELETE') {
      const { error } = await supabaseAdmin
        .from('enrollments')
        .delete()
        .eq('user_id', id)
        .eq('course_id', courseId);

      if (error) {
        console.error('Error removing enrollment:', error);
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ message: 'Enrollment removed successfully' });
    }

    // POST: enroll the student in the course
    const { data: enrollment, error: enrollError } = await supabaseAdmin
      .from('enrollments')
      .insert({
        user_id: id,
        course_id: courseId,
        status: 'active',
        progress: 0,
        enrolled_at: new Date().toISOString()
      })
      .select('id, status, course:courses(id, title)')
      .single();

    if (enrollError) {
      console.error('Error creating enrollment:', enrollError);
      if (enrollError.message.includes('duplicate') || enrollError.code === '23505') {
        return res.status(409).json({ error: 'Student is already enrolled in this course' });
      }
      return res.status(500).json({ error: enrollError.message });
    }

    return res.status(201).json({
      message: 'Student enrolled successfully',
      enrollment
    });

  } catch (error: any) {
    console.error('Enrollment API error:', error);
    return res.status(500).json({
      error: 'Failed to process request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
