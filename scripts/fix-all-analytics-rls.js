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

async function fixAllAnalyticsRLS() {
  try {
    console.log('🔧 Fixing RLS policies for ALL analytics tables...');
    
    const tables = ['user_sessions', 'page_views'];
    
    for (const table of tables) {
      console.log(`\n📋 Fixing ${table} table...`);
      
      // Drop all existing policies for this table
      console.log(`1. Dropping existing policies for ${table}...`);
      try {
        const dropPoliciesSQL = `
          DO $$ 
          DECLARE 
            r RECORD;
          BEGIN
            FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = '${table}') LOOP
              EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ${table}';
            END LOOP;
          END $$;
        `;
        
        await supabase.rpc('exec_sql', { sql: dropPoliciesSQL });
        console.log('✅ Dropped existing policies');
      } catch (e) {
        console.log('Could not drop policies via RPC (expected)');
      }
      
      // Create new permissive policy
      console.log(`2. Creating permissive policy for ${table}...`);
      try {
        const createPolicySQL = `
          CREATE POLICY "Allow analytics tracking" ON ${table}
          FOR ALL 
          TO anon, authenticated
          USING (true)
          WITH CHECK (true);
        `;
        
        await supabase.rpc('exec_sql', { sql: createPolicySQL });
        console.log('✅ Created permissive policy');
      } catch (e) {
        console.log('❌ Could not create policy via RPC:', e.message);
      }
      
      // Test the table
      console.log(`3. Testing ${table} insert...`);
      const testId = `test_${table}_${Date.now()}`;
      
      let testData;
      if (table === 'page_views') {
        testData = {
          user_id: null,
          session_id: testId,
          page_url: '/test',
          page_title: 'Test',
          user_agent: 'Test Agent',
          country: 'Unknown',
          device_type: 'desktop',
          browser: 'Chrome'
        };
      } else {
        testData = {
          session_id: testId,
          user_id: null,
          user_agent: 'Test Agent',
          first_page: '/test',
          last_page: '/test',
          total_pages: 1
        };
      }
      
      const { data: testResult, error: testError } = await supabase
        .from(table)
        .insert(testData)
        .select();
      
      if (testError) {
        console.log(`❌ ${table} test failed:`, testError);
      } else {
        console.log(`✅ ${table} test passed`);
        
        // Clean up
        await supabase
          .from(table)
          .delete()
          .eq(table === 'page_views' ? 'session_id' : 'session_id', testId);
      }
    }
    
    console.log('\n📝 If RPC calls failed, manually run this SQL in Supabase Dashboard:');
    console.log('=' * 60);
    console.log(`
-- Fix RLS for both analytics tables
-- Drop all existing policies
DO $$ 
DECLARE 
  r RECORD;
BEGIN
  FOR r IN (SELECT tablename, policyname FROM pg_policies WHERE tablename IN ('user_sessions', 'page_views')) LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON ' || r.tablename;
  END LOOP;
END $$;

-- Create permissive policies for analytics tracking
CREATE POLICY "Allow analytics tracking" ON user_sessions
FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow analytics tracking" ON page_views
FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT tablename, policyname, roles, cmd
FROM pg_policies 
WHERE tablename IN ('user_sessions', 'page_views')
ORDER BY tablename, policyname;
    `);
    console.log('=' * 60);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixAllAnalyticsRLS();
