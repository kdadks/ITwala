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

      console.log('[Pricing API] GET request - courseId:', courseId);

      if (!courseId) {
        return res.status(400).json({ error: 'Course ID is required' });
      }

      if (!supabaseAdmin) {
        console.error('[Pricing API] supabaseAdmin is not initialized - check SUPABASE_SERVICE_ROLE_KEY');
        return res.status(500).json({
          error: 'Server configuration error',
          details: 'Supabase admin client not configured'
        });
      }

      console.log('[Pricing API] Querying course_pricing table for courseId:', courseId);

      const { data, error } = await supabaseAdmin
        .from('course_pricing')
        .select('*')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('country_code');

      console.log('[Pricing API] Query result:', { data, error });

      if (error) {
        console.error('[Pricing API] Database error:', error);
        throw error;
      }

      console.log('[Pricing API] Returning pricing data:', data);
      return res.status(200).json({ pricing: data || [] });
    } catch (error: any) {
      console.error('[Pricing API] Error fetching pricing:', error);
      return res.status(500).json({
        error: 'Failed to fetch pricing data',
        details: error.message || error.toString()
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { courseId, pricingData } = req.body;

      if (!courseId || !pricingData) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (!supabaseAdmin) {
        return res.status(500).json({
          error: 'Server configuration error',
          details: 'Supabase admin client not configured'
        });
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

      if (!supabaseAdmin) {
        return res.status(500).json({
          error: 'Server configuration error',
          details: 'Supabase admin client not configured'
        });
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
