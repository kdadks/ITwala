// Netlify Scheduled Function for Analytics Aggregation
// This function runs daily at 2 AM UTC to aggregate analytics data
// Configuration is in netlify.toml

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

exports.handler = async (event, context) => {
  console.log('🕐 Scheduled analytics aggregation started');

  // Verify this is a scheduled function call (not a manual HTTP request)
  if (event.httpMethod && event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Check if Supabase credentials are available
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase environment variables');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Missing Supabase configuration' })
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get yesterday's date for aggregation
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const targetDate = yesterday.toISOString().split('T')[0];

    console.log(`📊 Aggregating analytics for ${targetDate}...`);

    // Call the aggregation function
    const { error } = await supabase.rpc('aggregate_daily_analytics', {
      target_date: targetDate
    });

    if (error) {
      console.error('❌ Aggregation error:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Failed to aggregate analytics',
          details: error.message,
          date: targetDate
        })
      };
    }

    // Verify the aggregation
    const { data: analytics, error: fetchError } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('date', targetDate)
      .single();

    if (fetchError) {
      console.error('❌ Fetch error:', fetchError);
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Aggregation completed but failed to verify',
          details: fetchError.message,
          date: targetDate
        })
      };
    }

    console.log('✅ Analytics aggregated successfully:', {
      date: targetDate,
      page_views: analytics.page_views,
      unique_visitors: analytics.unique_visitors,
      countries: analytics.countries?.length || 0
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: 'Analytics aggregation completed',
        date: targetDate,
        analytics: {
          page_views: analytics.page_views,
          unique_visitors: analytics.unique_visitors,
          total_time: analytics.total_time,
          bounce_rate: analytics.bounce_rate,
          countries_tracked: analytics.countries?.length || 0
        }
      })
    };

  } catch (error) {
    console.error('💥 Unexpected error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Internal server error',
        details: error.message
      })
    };
  }
};
