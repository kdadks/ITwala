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

async function checkRecentAnalytics() {
  try {
    console.log('📊 Checking recent analytics data...');
    
    // Get recent page views (last 10 minutes)
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    
    const { data: recentPageViews, error: pageViewError } = await supabase
      .from('page_views')
      .select('*')
      .gte('created_at', tenMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (pageViewError) {
      console.log('❌ Error fetching page views:', pageViewError);
    } else {
      console.log(`✅ Found ${recentPageViews.length} recent page views:`);
      recentPageViews.forEach((pv, index) => {
        console.log(`  ${index + 1}. ${pv.page_url} - ${pv.device_type} (${pv.created_at})`);
      });
    }
    
    // Get recent user sessions (last 10 minutes)
    const { data: recentSessions, error: sessionError } = await supabase
      .from('user_sessions')
      .select('*')
      .gte('created_at', tenMinutesAgo)
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (sessionError) {
      console.log('❌ Error fetching sessions:', sessionError);
    } else {
      console.log(`\n✅ Found ${recentSessions.length} recent sessions:`);
      recentSessions.forEach((session, index) => {
        console.log(`  ${index + 1}. Session ${session.session_id} - ${session.total_pages} pages (${session.created_at})`);
      });
    }
    
    if (recentPageViews.length === 0 && recentSessions.length === 0) {
      console.log('\n📝 No recent analytics data found.');
      console.log('Visit http://localhost:3000 in your browser to generate analytics data.');
    } else {
      console.log('\n🎉 Analytics tracking is working correctly!');
    }
    
  } catch (error) {
    console.error('❌ Error checking analytics:', error);
  }
}

checkRecentAnalytics();
