import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { slug } = req.query;

  if (!slug || typeof slug !== 'string') {
    return res.status(400).json({ error: 'Course slug is required' });
  }

  try {
    const { data: course, error } = await supabase
      .from('courses')
      .select(`
        id,
        slug,
        title,
        description,
        price,
        original_price,
        image,
        category,
        level,
        duration,
        status,
        students,
        enrollment_status,
        rating,
        rating_count,
        resources,
        published_date,
        enrollments,
        learning_outcomes,
        requirements,
        modules,
        reviews,
        instructor,
        faqs,
        tags,
        thumbnail,
        schedule,
        language,
        certification_included,
        fees_discussed_post_enrollment
      `)
      .eq('slug', slug)
      .eq('status', 'published')
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Course not found' });
      }
      console.error('Error fetching course:', error);
      return res.status(500).json({ error: 'Failed to fetch course' });
    }

    // Transform data to match frontend expectations
    const transformedCourse = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      description: course.description,
      price: course.price,
      originalPrice: course.original_price,
      image: course.image,
      category: course.category,
      level: course.level,
      duration: course.duration,
      status: course.status,
      students: course.students,
      enrollmentStatus: course.enrollment_status,
      rating: course.rating,
      ratingCount: course.rating_count,
      resources: course.resources,
      publishedDate: course.published_date,
      enrollments: course.enrollments,
      learningOutcomes: course.learning_outcomes,
      requirements: course.requirements,
      modules: course.modules,
      reviews: course.reviews,
      instructor: course.instructor,
      faqs: course.faqs,
      tags: course.tags,
      thumbnail: course.thumbnail,
      schedule: course.schedule,
      language: course.language,
      certificationIncluded: course.certification_included,
      feesDiscussedPostEnrollment: course.fees_discussed_post_enrollment
    };

    res.status(200).json({ course: transformedCourse });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}