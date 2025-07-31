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

async function executeAnalyticsRLSFix() {
  try {
    console.log('🔧 Executing complete analytics RLS fix...');
    
    // Step 1: Check current policies
    console.log('\n1. Checking current RLS policies...');
    try {
      const { data: currentPolicies } = await supabase
        .rpc('exec_sql', {
          sql: `
            SELECT tablename, policyname, roles, cmd
            FROM pg_policies 
            WHERE tablename IN ('user_sessions', 'page_views')
            ORDER BY tablename, policyname;
          `
        });
      
      if (currentPolicies && currentPolicies.length > 0) {
        console.log('Current policies found:', currentPolicies);
      } else {
        console.log('No existing policies found');
      }
    } catch (e) {
      console.log('Could not check current policies (proceeding anyway)');
    }
    
    // Step 2: Drop ALL existing policies
    console.log('\n2. Dropping all existing policies...');
    const dropPoliciesSQL = `
      DO $$ 
      DECLARE 
        r RECORD;
      BEGIN
        -- Drop all policies for user_sessions
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'user_sessions') LOOP
          EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON user_sessions';
        END LOOP;
        
        -- Drop all policies for page_views
        FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'page_views') LOOP
          EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON page_views';
        END LOOP;
      END $$;
    `;
    
    await supabase.rpc('exec_sql', { sql: dropPoliciesSQL });
    console.log('✅ Dropped all existing policies');
    
    // Step 3: Ensure RLS is enabled
    console.log('\n3. Ensuring RLS is enabled...');
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;' 
    });
    await supabase.rpc('exec_sql', { 
      sql: 'ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;' 
    });
    console.log('✅ RLS enabled on both tables');
    
    // Step 4: Create completely open policies
    console.log('\n4. Creating permissive analytics policies...');
    
    // Policy for user_sessions
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "analytics_full_access" ON user_sessions
        FOR ALL 
        TO anon, authenticated, service_role
        USING (true)
        WITH CHECK (true);
      `
    });
    console.log('✅ Created user_sessions policy');
    
    // Policy for page_views
    await supabase.rpc('exec_sql', {
      sql: `
        CREATE POLICY "analytics_full_access" ON page_views
        FOR ALL 
        TO anon, authenticated, service_role
        USING (true)
        WITH CHECK (true);
      `
    });
    console.log('✅ Created page_views policy');
    
    // Step 5: Verify policies were created
    console.log('\n5. Verifying new policies...');
    const { data: newPolicies } = await supabase
      .rpc('exec_sql', {
        sql: `
          SELECT tablename, policyname, permissive, roles, cmd
          FROM pg_policies 
          WHERE tablename IN ('user_sessions', 'page_views')
          ORDER BY tablename, policyname;
        `
      });
    
    if (newPolicies && newPolicies.length > 0) {
      console.log('✅ New policies created:', newPolicies);
    } else {
      console.log('⚠️ No policies found after creation');
    }
    
    // Step 6: Test analytics with anon key
    console.log('\n6. Testing analytics with anon key...');
    
    // Create anon client for testing
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    const testSessionId = 'test_fixed_' + Date.now();
    
    // Test page_views insert
    const { data: pageViewResult, error: pageViewError } = await anonClient
      .from('page_views')
      .insert({
        user_id: null,
        session_id: testSessionId,
        page_url: '/test-fix',
        page_title: 'Test Fix',
        user_agent: 'Test Agent',
        country: 'Unknown',
        device_type: 'desktop',
        browser: 'Chrome'
      })
      .select();
    
    if (pageViewError) {
      console.log('❌ Page views test failed:', pageViewError);
    } else {
      console.log('✅ Page views test passed!');
    }
    
    // Test user_sessions insert
    const { data: sessionResult, error: sessionError } = await anonClient
      .from('user_sessions')
      .insert({
        session_id: testSessionId,
        user_id: null,
        user_agent: 'Test Agent',
        first_page: '/test-fix',
        last_page: '/test-fix',
        total_pages: 1
      })
      .select();
    
    if (sessionError) {
      console.log('❌ User sessions test failed:', sessionError);
    } else {
      console.log('✅ User sessions test passed!');
    }
    
    // Clean up test data
    if (!pageViewError && !sessionError) {
      await Promise.all([
        supabase.from('page_views').delete().eq('session_id', testSessionId),
        supabase.from('user_sessions').delete().eq('session_id', testSessionId)
      ]);
      console.log('✅ Test data cleaned up');
      
      console.log('\n🎉 Analytics tracking is now fully functional!');
      console.log('The AnalyticsTracker component should work without errors.');
    }
    
  } catch (error) {
    console.error('❌ Error executing RLS fix:', error);
    
    console.log('\n⚠️ If the automated fix failed, please run this SQL manually in Supabase Dashboard:');
    console.log('=' * 50);
    console.log(`
-- Manual Analytics RLS Fix
-- Go to Supabase Dashboard > SQL Editor and run:

-- Drop all existing policies
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('user_sessions', 'page_views')) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
  END LOOP;
END $$;

-- Enable RLS
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

-- Create permissive policies
CREATE POLICY "analytics_full_access" ON user_sessions
FOR ALL TO anon, authenticated, service_role
USING (true) WITH CHECK (true);

CREATE POLICY "analytics_full_access" ON page_views
FOR ALL TO anon, authenticated, service_role
USING (true) WITH CHECK (true);
    `);
    console.log('=' * 50);
  }
}

executeAnalyticsRLSFix();
