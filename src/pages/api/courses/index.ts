import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = { USD: '$', GBP: '£', EUR: '€', INR: '₹' };
  return symbols[currency] || '₹';
}

const DEFAULT_LIMIT = 24;

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
      offset = 0,
      country = 'IN',
    } = req.query;

    const pageLimit = limit ? parseInt(limit as string) : DEFAULT_LIMIT;
    const pageOffset = parseInt(offset as string);

    // List-view projection — omits large/unused fields (instructor JSON, tags, resources)
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
        rating,
        rating_count,
        published_date,
        enrollments,
        fees_discussed_post_enrollment,
        thumbnail
      `)
      .eq('status', 'published');

    // Filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (level && level !== 'all') {
      query = query.ilike('level', `%${level}%`);
    }

    if (minPrice) {
      query = query.gte('price', parseInt(minPrice as string));
    }

    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice as string));
    }

    // Full-text search via generated search_vector column (see migrations/001_course_performance_indexes.sql).
    // Falls back to title-only ilike when the column is not yet present.
    if (search) {
      query = query.textSearch('search_vector', search as string, {
        type: 'websearch',
        config: 'english',
      });
    }

    // Sorting
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

    // Pagination — always applied
    query = query.range(pageOffset, pageOffset + pageLimit - 1);

    const { data: courses, error } = await query;

    if (error) {
      console.error('Error fetching courses:', error);
      return res.status(500).json({ error: 'Failed to fetch courses' });
    }

    const courseIds = (courses || []).map(c => c.id);

    const pricingMap: Record<string, { price: number; originalPrice?: number; currency: string; symbol: string }> = {};
    if (courseIds.length > 0) {
      const { data: pricingRows } = await supabase
        .from('course_pricing')
        .select('course_id, price, original_price, currency')
        .in('course_id', courseIds)
        .eq('country_code', country as string)
        .eq('is_active', true);

      for (const row of pricingRows || []) {
        pricingMap[row.course_id] = {
          price: row.price,
          originalPrice: row.original_price ?? undefined,
          currency: row.currency,
          symbol: getCurrencySymbol(row.currency),
        };
      }
    }

    const transformedCourses = (courses || []).map(course => {
      const pricing = pricingMap[course.id] ?? {
        price: course.price * 100,
        originalPrice: course.original_price ? course.original_price * 100 : undefined,
        currency: 'INR',
        symbol: '₹',
      };
      return {
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
        rating: course.rating,
        ratingCount: course.rating_count,
        publishedDate: course.published_date,
        enrollments: course.enrollments,
        feesDiscussedPostEnrollment: course.fees_discussed_post_enrollment,
        thumbnail: course.thumbnail,
        pricing,
      };
    });

    const hasMore = transformedCourses.length === pageLimit;

    // Allow CDN/browser to cache filtered results briefly
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ courses: transformedCourses, hasMore });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
