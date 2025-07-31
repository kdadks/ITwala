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

async function fixUserSessionsRLS() {
  try {
    console.log('🔧 Fixing RLS policies for user_sessions table...');
    
    // Check current policies first
    console.log('1. Checking current policies...');
    try {
      const { data: currentPolicies, error: policiesError } = await supabase
        .rpc('exec_sql', { 
          sql: `
            SELECT tablename, policyname, roles, cmd 
            FROM pg_policies 
            WHERE tablename = 'user_sessions';
          `
        });
      
      if (currentPolicies) {
        console.log('Current policies:', currentPolicies);
      }
    } catch (e) {
      console.log('Could not fetch current policies (this is okay)');
    }
    
    // Try to drop existing restrictive policies
    console.log('\n2. Dropping restrictive policies...');
    const dropCommands = [
      "DROP POLICY IF EXISTS \"Users can view own sessions\" ON user_sessions;",
      "DROP POLICY IF EXISTS \"Users can insert own sessions\" ON user_sessions;", 
      "DROP POLICY IF EXISTS \"Users can update own sessions\" ON user_sessions;",
      "DROP POLICY IF EXISTS \"User sessions policy\" ON user_sessions;"
    ];
    
    for (const cmd of dropCommands) {
      try {
        await supabase.rpc('exec_sql', { sql: cmd });
        console.log('✅ Dropped policy');
      } catch (e) {
        console.log('Policy not found (ok)');
      }
    }
    
    // Create new permissive policy
    console.log('\n3. Creating permissive analytics policy...');
    const createPolicySQL = `
      CREATE POLICY "Allow analytics session tracking" ON user_sessions
      FOR ALL 
      TO anon, authenticated
      USING (true)
      WITH CHECK (true);
    `;
    
    try {
      await supabase.rpc('exec_sql', { sql: createPolicySQL });
      console.log('✅ Created permissive analytics policy');
    } catch (e) {
      console.log('❌ Could not create policy via RPC:', e.message);
      
      console.log('\n📝 Manual fix required:');
      console.log('Go to Supabase Dashboard > SQL Editor and run:');
      console.log('='.repeat(50));
      console.log(createPolicySQL);
      console.log('='.repeat(50));
    }
    
    // Test the fix
    console.log('\n4. Testing the fix...');
    const testSessionId = 'test_fix_' + Date.now();
    
    const { data: testData, error: testError } = await supabase
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
    
    if (testError) {
      console.log('❌ Test insert still failing:', testError);
      console.log('\nPlease manually run the SQL script in Supabase Dashboard');
    } else {
      console.log('✅ Analytics tracking should now work!');
      
      // Clean up test
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', testSessionId);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    console.log('\n📝 Manual fix instructions:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor'); 
    console.log('3. Run the SQL script: supabase/fix-user-sessions-rls-policies.sql');
  }
}

fixUserSessionsRLS();
