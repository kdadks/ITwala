const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testAnalyticsSetup() {
  console.log('🧪 Testing Analytics Setup...\n');

  // Test 1: Check if tables exist
  console.log('1️⃣ Checking if tables exist...');
  try {
    const { count: pageViewsCount, error: pvError } = await supabase
      .from('page_views')
      .select('*', { count: 'exact', head: true });

    const { count: analyticsCount, error: adError } = await supabase
      .from('analytics_data')
      .select('*', { count: 'exact', head: true });

    const { count: sessionsCount, error: usError } = await supabase
      .from('user_sessions')
      .select('*', { count: 'exact', head: true });

    if (pvError || adError || usError) {
      console.error('❌ Error accessing tables:', pvError || adError || usError);
      return false;
    }

    console.log(`   ✅ page_views table exists (${pageViewsCount || 0} records)`);
    console.log(`   ✅ analytics_data table exists (${analyticsCount || 0} records)`);
    console.log(`   ✅ user_sessions table exists (${sessionsCount || 0} records)\n`);
  } catch (error) {
    console.error('❌ Failed to check tables:', error.message);
    return false;
  }

  // Test 2: Check if countries column exists in analytics_data
  console.log('2️⃣ Checking if countries column exists...');
  try {
    const { data, error } = await supabase
      .from('analytics_data')
      .select('countries')
      .limit(1);

    if (error) {
      console.log(`   ⚠️ Countries column might not exist yet. Run: supabase/add-countries-to-analytics-data.sql`);
    } else {
      console.log('   ✅ Countries column exists\n');
    }
  } catch (error) {
    console.log(`   ⚠️ Countries column check failed: ${error.message}\n`);
  }

  // Test 3: Check page_views for country data
  console.log('3️⃣ Checking recent page views with country data...');
  try {
    const { data, error } = await supabase
      .from('page_views')
      .select('country, page_url, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (error) {
      console.error('   ❌ Error fetching page views:', error.message);
    } else if (data.length === 0) {
      console.log('   ⚠️ No page views found yet. Visit your site to generate data.');
    } else {
      console.log('   ✅ Recent page views:');
      data.forEach(pv => {
        console.log(`      - ${pv.page_url} from ${pv.country || 'Unknown'} at ${new Date(pv.created_at).toLocaleString()}`);
      });
      console.log('');
    }
  } catch (error) {
    console.error('   ❌ Failed to check page views:', error.message);
  }

  // Test 4: Test aggregation function
  console.log('4️⃣ Testing aggregation function...');
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split('T')[0];

    console.log(`   Running aggregation for ${dateStr}...`);

    const { error } = await supabase.rpc('aggregate_daily_analytics', {
      target_date: dateStr
    });

    if (error) {
      console.error('   ❌ Aggregation failed:', error.message);
      return false;
    }

    // Check if data was created
    const { data: analytics, error: fetchError } = await supabase
      .from('analytics_data')
      .select('*')
      .eq('date', dateStr)
      .single();

    if (fetchError) {
      console.log('   ⚠️ Aggregation ran but no data found. This is normal if there are no page views for yesterday.');
    } else {
      console.log('   ✅ Aggregation successful!');
      console.log(`      - Page Views: ${analytics.page_views}`);
      console.log(`      - Unique Visitors: ${analytics.unique_visitors}`);
      console.log(`      - Avg Time: ${analytics.total_time} minutes`);
      console.log(`      - Bounce Rate: ${analytics.bounce_rate}%`);

      if (analytics.countries && analytics.countries.length > 0) {
        console.log('      - Top Countries:', analytics.countries.slice(0, 3).map(c => c.country).join(', '));
      }
    }
    console.log('');
  } catch (error) {
    console.error('   ❌ Aggregation test failed:', error.message);
    return false;
  }

  // Test 5: Check environment variables
  console.log('5️⃣ Checking environment variables...');
  const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasAnonKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const hasServiceKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;
  const hasCronSecret = !!process.env.ANALYTICS_CRON_SECRET;

  console.log(`   ${hasUrl ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_URL`);
  console.log(`   ${hasAnonKey ? '✅' : '❌'} NEXT_PUBLIC_SUPABASE_ANON_KEY`);
  console.log(`   ${hasServiceKey ? '✅' : '❌'} SUPABASE_SERVICE_ROLE_KEY`);
  console.log(`   ${hasCronSecret ? '✅' : '❌'} ANALYTICS_CRON_SECRET`);
  console.log('');

  // Summary
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Analytics Setup Test Complete!\n');

  if (!hasCronSecret) {
    console.log('⚠️  Next Steps:');
    console.log('   1. Add ANALYTICS_CRON_SECRET to .env.local (already done locally)');
    console.log('   2. Add ANALYTICS_CRON_SECRET to Vercel environment variables');
  }

  console.log('\n📝 To complete setup:');
  console.log('   1. Run SQL: supabase/add-countries-to-analytics-data.sql in Supabase Dashboard');
  console.log('   2. Deploy to Vercel (cron jobs require deployment)');
  console.log('   3. Add ANALYTICS_CRON_SECRET to Vercel env vars');
  console.log('   4. Visit your site to generate page views');
  console.log('   5. Run: node scripts/run-analytics-aggregation.js');
  console.log('   6. Check admin dashboard at /admin/analytics\n');

  return true;
}

testAnalyticsSetup().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
});
