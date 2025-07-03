const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAdminAuth() {
  const adminEmail = 'admin@itwala.com';
  
  try {
    console.log('Testing admin authentication...\n');
    
    // 1. Check if admin user exists in auth.users
    console.log('1. Checking auth.users table...');
    const { data: authUsers, error: authError } = await supabase
      .from('auth.users')
      .select('*')
      .eq('email', adminEmail);
    
    if (authError) {
      console.error('Auth users error:', authError);
    } else {
      console.log('Auth users found:', authUsers?.length || 0);
      if (authUsers?.length > 0) {
        console.log('Auth user details:', {
          id: authUsers[0].id,
          email: authUsers[0].email,
          user_metadata: authUsers[0].user_metadata
        });
      }
    }
    
    // 2. Check profiles table
    console.log('\n2. Checking profiles table...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail);
    
    if (profileError) {
      console.error('Profiles error:', profileError);
    } else {
      console.log('Profiles found:', profiles?.length || 0);
      if (profiles?.length > 0) {
        console.log('Profile details:', {
          id: profiles[0].id,
          email: profiles[0].email,
          role: profiles[0].role,
          full_name: profiles[0].full_name
        });
      }
    }
    
    // 3. Test categories access with service role
    console.log('\n3. Testing categories access with service role...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(5);
    
    if (categoriesError) {
      console.error('Categories error:', categoriesError);
    } else {
      console.log('Categories accessible:', categories?.length || 0);
      console.log('Sample categories:', categories?.slice(0, 2).map(c => c.name));
    }
    
    // 4. Test categories RLS policies
    console.log('\n4. Testing categories RLS policies...');
    const { data: policies, error: policyError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'categories');
    
    if (policyError) {
      console.error('Policy error:', policyError);
    } else {
      console.log('RLS policies for categories:', policies?.length || 0);
      policies?.forEach(policy => {
        console.log(`- ${policy.policyname}: ${policy.cmd} for ${policy.roles}`);
      });
    }
    
    console.log('\n✅ Admin authentication test complete');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAdminAuth()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });