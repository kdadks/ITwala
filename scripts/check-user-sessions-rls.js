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

async function checkRLSPolicies() {
  try {
    console.log('🔍 Checking RLS policies for user_sessions table...');
    
    // Check if RLS is enabled
    const { data: rlsStatus, error: rlsError } = await supabase
      .rpc('check_rls_status', { table_name: 'user_sessions' })
      .catch(() => null);
    
    // Alternative approach - try to query policies directly
    console.log('Checking RLS policies using service role...');
    
    // Use raw SQL to check policies
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'user_sessions')
      .catch(() => null);
    
    if (policies) {
      console.log('Found policies:', policies);
    } else {
      console.log('Could not fetch policies directly');
    }
    
    // Try to test insert with service role
    console.log('\n🧪 Testing insert with service role...');
    const testSessionId = 'test_rls_' + Date.now();
    
    const { data: insertResult, error: insertError } = await supabase
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
    
    if (insertError) {
      console.log('❌ Insert failed even with service role:', insertError);
      
      console.log('\n📝 SQL to fix RLS policies:');
      console.log('='.repeat(60));
      console.log(`
-- Enable RLS on user_sessions table
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Allow anonymous session tracking" ON user_sessions;
DROP POLICY IF EXISTS "Allow authenticated session tracking" ON user_sessions;
DROP POLICY IF EXISTS "Allow public session inserts" ON user_sessions;

-- Create policy to allow anonymous session tracking
CREATE POLICY "Allow anonymous session tracking" ON user_sessions
FOR ALL 
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Or if you want more restrictive policies:
-- CREATE POLICY "Allow session inserts" ON user_sessions
-- FOR INSERT 
-- TO anon, authenticated
-- WITH CHECK (true);

-- CREATE POLICY "Allow session updates" ON user_sessions
-- FOR UPDATE 
-- TO anon, authenticated
-- USING (true)
-- WITH CHECK (true);

-- CREATE POLICY "Allow session selects" ON user_sessions
-- FOR SELECT 
-- TO anon, authenticated
-- USING (true);

-- Verify the policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'user_sessions';
      `);
      console.log('='.repeat(60));
      
    } else {
      console.log('✅ Insert successful with service role:', insertResult);
      
      // Clean up test record
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', testSessionId);
      
      console.log('The issue might be with the client-side authentication context.');
    }
    
  } catch (error) {
    console.error('❌ Error checking RLS:', error);
  }
}

checkRLSPolicies();
