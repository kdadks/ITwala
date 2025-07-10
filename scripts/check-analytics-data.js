const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '../.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkAnalyticsData() {
  console.log('Checking analytics data...\n');
  
  // Check analytics_data table
  const { data, error, count } = await supabase
    .from('analytics_data')
    .select('*', { count: 'exact' })
    .order('date', { ascending: false })
    .limit(5);
    
  console.log('Total records in analytics_data:', count || 0);
  
  if (data && data.length > 0) {
    console.log('\nLatest analytics data:');
    data.forEach(record => {
      console.log(`\nDate: ${record.date}`);
      console.log(`  Page Views: ${record.page_views}`);
      console.log(`  Unique Visitors: ${record.unique_visitors}`);
      console.log(`  Avg Time: ${record.total_time} minutes`);
      console.log(`  Bounce Rate: ${record.bounce_rate}%`);
      if (record.top_pages && record.top_pages.length > 0) {
        console.log(`  Top Pages:`);
        record.top_pages.slice(0, 3).forEach(page => {
          console.log(`    - ${page.page}: ${page.views} views`);
        });
      }
    });
  }
  
  // Also check if sample data was added
  const { data: sampleCheck } = await supabase
    .from('analytics_data')
    .select('*')
    .like('top_pages', '%/courses%')
    .limit(1);
    
  if (sampleCheck && sampleCheck.length > 0) {
    console.log('\n⚠️  Note: Sample data detected in analytics_data table');
  }
  
  if (error) console.log('Error:', error.message);
}

checkAnalyticsData().catch(console.error);