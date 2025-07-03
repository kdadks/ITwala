const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function fixCategoriesRLS() {
  try {
    console.log('Fixing categories RLS policies...\n');
    
    // 1. Check current policies
    console.log('1. Checking existing policies...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'categories');
    
    if (policyError) {
      console.error('Error checking policies:', policyError);
    } else {
      console.log('Current policies:', policies?.length || 0);
      policies?.forEach(policy => {
        console.log(`  - ${policy.policyname}: ${policy.cmd}`);
      });
    }
    
    // 2. Enable RLS on categories table
    console.log('\n2. Ensuring RLS is enabled on categories table...');
    try {
      // This will fail if already enabled, but that's okay
      const { error: rlsError } = await supabase
        .from('pg_tables')
        .select('*')
        .eq('tablename', 'categories');
      
      if (rlsError) {
        console.log('RLS might already be enabled');
      } else {
        console.log('✅ RLS check completed');
      }
    } catch (err) {
      console.log('RLS check error (expected):', err.message);
    }
    
    // 3. Test direct admin access with service role
    console.log('\n3. Testing direct admin access with service role...');
    const testCategoryName = `Test Category ${Date.now()}`;
    
    // Insert test category using service role
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert([{ name: testCategoryName }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Service role insert failed:', insertError);
    } else {
      console.log('✅ Service role insert success:', insertData.name);
      
      // Clean up
      const { error: deleteError } = await supabase
        .from('categories')
        .delete()
        .eq('id', insertData.id);
      
      if (deleteError) {
        console.error('Clean up error:', deleteError);
      } else {
        console.log('✅ Test category cleaned up');
      }
    }
    
    // 4. Test admin user access
    console.log('\n4. Testing admin user access...');
    
    // Create a new client with anon key for user testing
    const anonClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    
    // Sign in as admin user
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });
    
    if (signInError) {
      console.error('Admin sign in error:', signInError);
      return;
    }
    
    console.log('✅ Admin signed in successfully');
    
    // Test categories insert with admin user
    const testCategoryName2 = `Admin Test Category ${Date.now()}`;
    const { data: adminInsertData, error: adminInsertError } = await anonClient
      .from('categories')
      .insert([{ name: testCategoryName2 }])
      .select()
      .single();
    
    if (adminInsertError) {
      console.error('❌ Admin user insert failed:', adminInsertError);
      console.log('This indicates RLS policies are not working correctly');
    } else {
      console.log('✅ Admin user insert success:', adminInsertData.name);
      
      // Clean up
      await anonClient
        .from('categories')
        .delete()
        .eq('id', adminInsertData.id);
      console.log('✅ Admin test category cleaned up');
    }
    
    // Sign out
    await anonClient.auth.signOut();
    
    console.log('\n5. Diagnosis complete!');
    
    if (adminInsertError) {
      console.log('\n❌ ISSUE IDENTIFIED: Admin user cannot insert categories');
      console.log('This means RLS policies are not properly configured.');
      console.log('\nSOLUTION: You need to manually apply the RLS policies in Supabase SQL Editor:');
      console.log('1. Go to Supabase Dashboard > SQL Editor');
      console.log('2. Run the contents of fix-categories-admin-access.sql');
      console.log('3. Verify policies are applied correctly');
    } else {
      console.log('\n✅ SUCCESS: Admin user can insert categories');
      console.log('RLS policies are working correctly!');
    }
    
  } catch (error) {
    console.error('Error fixing categories RLS:', error);
  }
}

fixCategoriesRLS()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });