const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

async function analyzeCountryData() {
  try {
    console.log('🌍 Analyzing country data in analytics...');
    
    // Get recent page views with country information
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    
    const { data: pageViews, error: pageViewError } = await supabase
      .from('page_views')
      .select('country, device_type, browser, page_url, created_at')
      .gte('created_at', oneHourAgo)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (pageViewError) {
      console.log('❌ Error fetching page views:', pageViewError);
      return;
    }
    
    console.log(`\n📊 Found ${pageViews.length} recent page views:`);
    
    // Count countries
    const countryCount = {};
    pageViews.forEach(pv => {
      const country = pv.country || 'Unknown';
      countryCount[country] = (countryCount[country] || 0) + 1;
    });
    
    console.log('\n🌍 Country distribution:');
    Object.entries(countryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([country, count]) => {
        const percentage = ((count / pageViews.length) * 100).toFixed(1);
        console.log(`   ${country}: ${count} visits (${percentage}%)`);
      });
    
    // Show recent entries with countries
    console.log('\n📋 Recent page views with country data:');
    pageViews.slice(0, 10).forEach((pv, index) => {
      const country = pv.country || 'Unknown';
      const time = new Date(pv.created_at).toLocaleTimeString();
      console.log(`   ${index + 1}. ${pv.page_url} - ${country} (${pv.device_type}) [${time}]`);
    });
    
    // Check if improvement is working
    const unknownCount = countryCount['Unknown'] || 0;
    const knownCount = pageViews.length - unknownCount;
    const successRate = ((knownCount / pageViews.length) * 100).toFixed(1);
    
    console.log(`\n📈 Country detection success rate: ${successRate}% (${knownCount}/${pageViews.length})`);
    
    if (successRate < 50) {
      console.log('⚠️ Still high "Unknown" rate. The improvements may need time to take effect.');
      console.log('Try refreshing the browser page to trigger new analytics with improved detection.');
    } else {
      console.log('✅ Good country detection rate! The improvements are working.');
    }
    
  } catch (error) {
    console.error('❌ Error analyzing country data:', error);
  }
}

analyzeCountryData();
