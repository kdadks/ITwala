import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { validateCountry, SUPPORTED_COUNTRIES } from '@/utils/countryDetection';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { courseId, country: rawCountry } = req.query;

    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    // Cookie is authoritative: it was set by middleware from trusted infra headers.
    // Query param is only used when no cookie exists, and must be valid.
    const cookieCountry = req.cookies.user_country;
    const validatedQuery = validateCountry(rawCountry as string | undefined);
    const hasQueryCountry = rawCountry !== undefined;
    const countryCode = cookieCountry || validatedQuery || 'IN';

    // Reject explicitly provided but invalid query params to prevent manipulation
    if (hasQueryCountry && !validatedQuery && !cookieCountry) {
      return res.status(400).json({ error: 'Invalid country code' });
    }

    // Final safety: ensure resolved country is supported
    if (!SUPPORTED_COUNTRIES[countryCode]) {
      return res.status(400).json({ error: 'Invalid country code' });
    }

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

    // courses.price is stored in full units (e.g. 2999 for ₹2,999)
    // course_pricing.price is in smallest unit (paise/cents).
    // Multiply by 100 so the display logic (÷100) yields the correct value.
    return res.status(200).json({
      pricing: {
        price: courseData.price * 100,
        originalPrice: courseData.original_price ? courseData.original_price * 100 : undefined,
        currency: 'INR',
        symbol: '₹',
      }
    });

  } catch (error: unknown) {
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
