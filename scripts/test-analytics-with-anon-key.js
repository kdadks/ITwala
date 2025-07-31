const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Test the same configuration that AnalyticsTracker will use
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce'
    }
  }
);

async function testAnalyticsTracking() {
  try {
    console.log('🧪 Testing analytics tracking with anon key...');
    
    const testSessionId = 'test_analytics_' + Date.now();
    
    // Test page_views insert (this should work)
    console.log('1. Testing page_views insert...');
    const { data: pageViewData, error: pageViewError } = await supabase
      .from('page_views')
      .insert({
        user_id: null,
        session_id: testSessionId,
        page_url: '/test',
        page_title: 'Test Page',
        referrer: null,
        user_agent: 'Test Agent',
        country: 'Unknown',
        device_type: 'desktop',
        browser: 'Chrome',
        created_at: new Date().toISOString()
      })
      .select();
    
    if (pageViewError) {
      console.log('❌ Page view insert failed:', pageViewError);
    } else {
      console.log('✅ Page view insert successful');
    }
    
    // Test user_sessions insert
    console.log('\n2. Testing user_sessions insert...');
    const { data: sessionData, error: sessionError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId,
        user_id: null,
        user_agent: 'Test Agent',
        first_page: '/test',
        last_page: '/test',
        total_pages: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (sessionError) {
      console.log('❌ User session insert failed:', sessionError);
      
      if (sessionError.code === '401' || sessionError.code === '42501') {
        console.log('\n🔍 Still getting auth/RLS errors. Let me check the configuration...');
        
        // Check if anon key has proper permissions
        const { data: testSelect, error: selectError } = await supabase
          .from('user_sessions')
          .select('*')
          .limit(1);
        
        if (selectError) {
          console.log('❌ Even SELECT fails:', selectError);
          console.log('\n📝 The anon key might not have proper permissions.');
          console.log('In Supabase Dashboard, check:');
          console.log('1. Authentication > Settings > API Keys');
          console.log('2. Make sure anon key is active');
          console.log('3. SQL Editor - verify RLS policies allow anon access');
        } else {
          console.log('✅ SELECT works, so it\'s an INSERT permission issue');
        }
      }
    } else {
      console.log('✅ User session insert successful:', sessionData);
      
      // Clean up test records
      console.log('\n3. Cleaning up test data...');
      await Promise.all([
        supabase.from('page_views').delete().eq('session_id', testSessionId),
        supabase.from('user_sessions').delete().eq('session_id', testSessionId)
      ]);
      console.log('✅ Test data cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
}

testAnalyticsTracking();
