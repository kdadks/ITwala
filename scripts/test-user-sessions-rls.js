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

async function testUserSessionsRLS() {
  try {
    console.log('🧪 Testing user_sessions table access...');
    
    // Test basic select
    console.log('1. Testing SELECT...');
    const { data: selectData, error: selectError } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.log('❌ SELECT failed:', selectError);
    } else {
      console.log('✅ SELECT works, found', selectData?.length || 0, 'records');
    }
    
    // Test insert with service role
    console.log('\n2. Testing INSERT with service role...');
    const testSessionId = 'test_rls_' + Date.now();
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId,
        user_id: null,
        user_agent: 'Test Agent',
        first_page: '/test',
        last_page: '/test',
        total_pages: 1
      })
      .select();
    
    if (insertError) {
      console.log('❌ INSERT failed:', insertError);
      
      if (insertError.code === '42501') {
        console.log('\n🔧 RLS Policy Issue Detected!');
        console.log('The user_sessions table has restrictive RLS policies.');
        console.log('\nSQL commands to fix:');
        console.log('='.repeat(50));
        console.log(`
-- Go to Supabase Dashboard > SQL Editor and run:

-- 1. Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE tablename = 'user_sessions';

-- 2. Drop restrictive policies if needed
DROP POLICY IF EXISTS "Users can view own sessions" ON user_sessions;
DROP POLICY IF EXISTS "Users can insert own sessions" ON user_sessions;

-- 3. Create permissive policy for analytics
CREATE POLICY "Allow analytics tracking" ON user_sessions
FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- 4. Alternative: Disable RLS entirely for analytics table
-- ALTER TABLE user_sessions DISABLE ROW LEVEL SECURITY;
        `);
        console.log('='.repeat(50));
      }
      
    } else {
      console.log('✅ INSERT works with service role:', insertData);
      
      // Clean up
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', testSessionId);
      console.log('✅ Test record cleaned up');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testUserSessionsRLS();
