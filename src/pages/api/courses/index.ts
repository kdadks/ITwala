import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      category, 
      level, 
      minPrice, 
      maxPrice, 
      search, 
      sortBy = 'popular',
      limit,
      offset = 0 
    } = req.query;

    let query = supabase
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
        instructor,
        tags,
        fees_discussed_post_enrollment,
        thumbnail
      `)
      .eq('status', 'published');

    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (level && level !== 'all') {
      query = query.or(`level.eq.${level},level.ilike.%${level}%`);
    }

    if (minPrice) {
      query = query.gte('price', parseInt(minPrice as string));
    }

    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice as string));
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'newest':
        query = query.order('published_date', { ascending: false });
        break;
      case 'popular':
      default:
        query = query.order('enrollments', { ascending: false });
        break;
    }

    // Apply pagination
    if (limit) {
      query = query.range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1);
    }

    const { data: courses, error } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }

    // Transform data to match frontend expectations
    const transformedCourses = courses?.map(course => ({
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
      instructor: course.instructor,
      tags: course.tags,
      feesDiscussedPostEnrollment: course.fees_discussed_post_enrollment,
      thumbnail: course.thumbnail
    })) || [];

    res.status(200).json({ courses: transformedCourses });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}