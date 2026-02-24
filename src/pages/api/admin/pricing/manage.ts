import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';
import { supabaseAdmin } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res });

  // Verify admin authentication
  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session?.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'GET') {
    try {
      const { courseId } = req.query;

      if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
      }

      const { data, error } = await supabaseAdmin
        .from('course_pricing')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('country_code');

      if (error) throw error;

      return res.status(200).json({ pricing: data || [] });
    } catch (error: any) {
      console.error('Error fetching pricing:', error);
      return res.status(500).json({ error: 'Failed to fetch pricing data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { courseId, pricingData } = req.body;

      if (!courseId || !pricingData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Validate pricing data
      const { country_code, currency, price, original_price } = pricingData;

      if (!country_code || !currency || price === undefined) {
        return res.status(400).json({ error: 'Invalid pricing data' });
      }

      // Upsert pricing
      const { data, error } = await supabaseAdmin
        .from('course_pricing')
        .upsert({
          course_id: courseId,
          country_code,
          currency,
          price,
          original_price: original_price || null,
          is_active: true,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'course_id,country_code'
        })
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({ pricing: data, message: 'Pricing updated successfully' });
    } catch (error: any) {
      console.error('Error saving pricing:', error);
      return res.status(500).json({ error: 'Failed to save pricing data' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { pricingId } = req.body;

      if (!pricingId) {
        return res.status(400).json({ error: 'Pricing ID is required' });
      }

      const { error } = await supabaseAdmin
        .from('course_pricing')
        .delete()
        .eq('id', pricingId);

      if (error) throw error;

      return res.status(200).json({ message: 'Pricing deleted successfully' });
    } catch (error: any) {
      console.error('Error deleting pricing:', error);
      return res.status(500).json({ error: 'Failed to delete pricing' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
