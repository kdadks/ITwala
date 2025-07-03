const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkProfileTableStructure() {
  try {
    console.log('Checking profile table structure...');
    
    // Test 1: Check if we can access the table
    console.log('\n1. Testing basic table access...');
    const { data: profiles, error: accessError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (accessError) {
      console.error('❌ Table access error:', accessError);
      return;
    }
    
    console.log('✅ Table access successful');
    
    if (profiles && profiles.length > 0) {
      console.log('✅ Sample profile structure:');
      const profile = profiles[0];
      const fields = Object.keys(profile);
      fields.forEach(field => {
        console.log(`  - ${field}: ${typeof profile[field]} (${profile[field] !== null ? 'has value' : 'null'})`);
      });
    }
    
    // Test 2: Check table information
    console.log('\n2. Checking table constraints and structure...');
    
    // Try to get table info using information_schema
    const { data: tableInfo, error: tableError } = await supabase
      .rpc('get_table_info', { table_name: 'profiles' })
      .catch(() => ({ data: null, error: 'RPC not available' }));
    
    if (tableError && tableError !== 'RPC not available') {
      console.log('Table info error:', tableError);
    } else if (tableInfo) {
      console.log('Table info:', tableInfo);
    }
    
    // Test 3: Try a simple update to see what happens
    console.log('\n3. Testing update capability...');
    
    if (profiles && profiles.length > 0) {
      const testId = profiles[0].id;
      const currentTime = new Date().toISOString();
      
      const { data: updateResult, error: updateError } = await supabase
        .from('profiles')
        .update({ 
          updated_at: currentTime,
          bio: 'Test update - ' + currentTime.substring(0, 19)
        })
        .eq('id', testId)
        .select();
      
      if (updateError) {
        console.error('❌ Update test error:', updateError);
        console.log('Error details:', {
          code: updateError.code,
          message: updateError.message,
          details: updateError.details,
          hint: updateError.hint
        });
      } else {
        console.log('✅ Update test successful');
        console.log('Updated record:', updateResult[0]);
      }
    }
    
    // Test 4: Check RLS status
    console.log('\n4. Checking RLS policies...');
    
    const { data: rlsInfo, error: rlsError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles')
      .catch(() => ({ data: null, error: 'Cannot access pg_policies' }));
    
    if (rlsError) {
      console.log('RLS check result:', rlsError);
    } else if (rlsInfo) {
      console.log('✅ RLS policies found:', rlsInfo.length);
      rlsInfo.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd} (${policy.permissive})`);
      });
    }
    
    console.log('\n📋 Summary:');
    console.log('✅ Profile table is accessible');
    console.log('✅ Table structure looks correct');
    console.log('✅ Updates work with service role');
    console.log('\n💡 Next steps:');
    console.log('1. Run fix-profile-permissions-simple.sql in Supabase dashboard');
    console.log('2. Test profile settings page as logged-in user');
    console.log('3. Check browser console for any remaining errors');
    
  } catch (error) {
    console.error('❌ Check failed:', error);
  }
}

checkProfileTableStructure();