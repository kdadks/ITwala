import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Admin client not available' });
  }

  try {
    const {
      title,
      slug,
      description,
      category,
      image,
      price,
      original_price,
      level,
      duration,
      status,
      learning_outcomes,
      requirements,
      tags,
      language,
      certification_included,
      fees_discussed_post_enrollment,
      modules
    } = req.body;

    // First, verify the course exists
    const { data: existingCourse, error: checkError } = await supabaseAdmin
      .from('courses')
      .select('id, title, slug')
      .eq('id', id)
      .single();

    if (checkError || !existingCourse) {
      return res.status(404).json({ 
        error: `Course with ID ${id} not found. Error: ${checkError?.message}` 
      });
    }

    // Update the course
    const { data, error } = await supabaseAdmin
      .from('courses')
      .update({
        title,
        slug,
        description,
        category,
        image,
        price: Number(price),
        original_price: Number(original_price),
        level,
        duration,
        status,
        learning_outcomes,
        requirements,
        tags,
        language,
        certification_included,
        fees_discussed_post_enrollment,
        modules,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Update error:', error);
      return res.status(500).json({ error: error.message });
    }

    if (!data || data.length === 0) {
      return res.status(500).json({ error: 'No course was updated' });
    }

    res.status(200).json({ 
      message: 'Course updated successfully', 
      course: data[0] 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}