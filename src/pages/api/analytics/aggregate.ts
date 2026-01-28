import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Optional: Add authentication or API key check
    const authHeader = req.headers.authorization;
    const expectedKey = process.env.ANALYTICS_CRON_SECRET || 'change-me-in-production';

    // Allow requests without auth header if ANALYTICS_CRON_SECRET is not set (for testing)
    if (expectedKey !== 'change-me-in-production' && authHeader !== `Bearer ${expectedKey}`) {
      console.error('Authentication failed:', {
        hasAuthHeader: !!authHeader,
        authHeaderFormat: authHeader ? authHeader.substring(0, 10) + '...' : 'none',
        expectedFormat: 'Bearer [secret]',
        secretConfigured: expectedKey !== 'change-me-in-production'
      });
      return res.status(401).json({
        error: 'Unauthorized',
        debug: {
          hasAuthHeader: !!authHeader,
          expectedFormat: 'Bearer [SECRET_KEY]'
        }
      });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the target date from request body or use yesterday
    const targetDate = req.body.target_date || (() => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return yesterday.toISOString().split('T')[0];
    })();

    console.log(`Aggregating analytics for ${targetDate}...`);

    // Call the aggregation function
    const { error } = await supabase.rpc('aggregate_daily_analytics', {
      target_date: targetDate
    });

    if (error) {
      console.error('Aggregation error:', error);
      return res.status(500).json({
        error: 'Failed to aggregate analytics',
        details: error.message
      });
    }

    // Verify the aggregation
    const { data: analytics, error: fetchError } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('date', targetDate)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(500).json({
        error: 'Aggregation completed but failed to verify',
        details: fetchError.message
      });
    }

    console.log('✅ Analytics aggregated successfully:', analytics);

    return res.status(200).json({
      success: true,
      date: targetDate,
      analytics: {
        page_views: analytics.page_views,
        unique_visitors: analytics.unique_visitors,
        total_time: analytics.total_time,
        bounce_rate: analytics.bounce_rate,
      }
    });

  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
}
