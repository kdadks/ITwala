import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { courseId, country } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const countryCode = (country as string) || 'IN';

    // Try to get country-specific pricing
    const { data: pricingData, error: pricingError } = await supabase
      .from('course_pricing')
      .select('*')
      .eq('course_id', courseId)
      .eq('country_code', countryCode)
      .eq('is_active', true)
      .single();

    if (!pricingError && pricingData) {
      return res.status(200).json({
        pricing: {
          price: pricingData.price,
          originalPrice: pricingData.original_price,
          currency: pricingData.currency,
          symbol: getCurrencySymbol(pricingData.currency),
        }
      });
    }

    // Fallback to course default pricing (INR)
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('price, original_price')
      .eq('id', courseId)
      .single();

    if (courseError || !courseData) {
      return res.status(404).json({ error: 'Course not found' });
    }

    return res.status(200).json({
      pricing: {
        price: courseData.price,
        originalPrice: courseData.original_price,
        currency: 'INR',
        symbol: '₹',
      }
    });

  } catch (error: any) {
    console.error('Error fetching pricing:', error);
    return res.status(500).json({ error: 'Failed to fetch pricing' });
  }
}

function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'GBP': '£',
    'EUR': '€',
    'INR': '₹',
  };
  return symbols[currency] || '₹';
}
