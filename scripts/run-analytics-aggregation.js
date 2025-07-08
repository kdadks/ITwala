const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runDailyAggregation() {
  try {
    console.log('Running daily analytics aggregation...');
    
    // Get yesterday's date
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];
    
    console.log(`Aggregating data for ${dateStr}...`);
    
    // Call the aggregation function
    const { error } = await supabase.rpc('aggregate_daily_analytics', {
      target_date: dateStr
    });
    
    if (error) {
      console.error('Error running aggregation:', error);
      process.exit(1);
    }
    
    console.log('✅ Daily analytics aggregation completed successfully!');
    
    // Verify the data was created
    const { data: analytics, error: fetchError } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('date', dateStr)
      .single();
    
    if (fetchError) {
      console.error('Error fetching aggregated data:', fetchError);
    } else {
      console.log('📊 Aggregated data:', {
        date: analytics.date,
        page_views: analytics.page_views,
        unique_visitors: analytics.unique_visitors,
        avg_time: analytics.total_time + ' minutes',
        bounce_rate: analytics.bounce_rate + '%'
      });
    }
    
  } catch (error) {
    console.error('Error in analytics aggregation:', error);
    process.exit(1);
  }
}

// Run aggregation for multiple days if needed
async function backfillAnalytics(days = 7) {
  try {
    console.log(`Backfilling analytics data for the last ${days} days...`);
    
    for (let i = 1; i <= days; i++) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);
      const dateStr = targetDate.toISOString().split('T')[0];
      
      console.log(`Processing ${dateStr}...`);
      
      const { error } = await supabase.rpc('aggregate_daily_analytics', {
        target_date: dateStr
      });
      
      if (error) {
        console.error(`Error processing ${dateStr}:`, error);
      } else {
        console.log(`✅ Completed ${dateStr}`);
      }
      
      // Small delay to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log('🎉 Backfill completed!');
    
  } catch (error) {
    console.error('Error in backfill:', error);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'backfill') {
  const days = parseInt(process.argv[3]) || 7;
  backfillAnalytics(days);
} else {
  runDailyAggregation();
}

module.exports = { runDailyAggregation, backfillAnalytics };