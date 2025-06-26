import { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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

    // Create the course
    const { data, error } = await supabaseAdmin
      .from('courses')
      .insert([
        {
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
          // Default values for other fields
          students: 0,
          enrollment_status: 'Open',
          rating: 0,
          rating_count: 0,
          resources: 0,
          enrollments: 0,
          published_date: status === 'published' ? new Date().toISOString().split('T')[0] : null,
          reviews: [],
          instructor: null,
          faqs: [],
          thumbnail: null,
          schedule: null
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Create error:', error);
      return res.status(500).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Course created successfully', 
      course: data 
    });

  } catch (error: any) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}