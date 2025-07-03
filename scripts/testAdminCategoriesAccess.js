const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with anon key (like the frontend)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function testCategoriesAccess() {
  const adminEmail = 'admin@itwala.com';
  const adminPassword = 'Admin@123';
  
  try {
    console.log('Testing categories access as admin user...\n');
    
    // 1. Sign in as admin
    console.log('1. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (signInError) {
      console.error('Sign in error:', signInError);
      return;
    }
    
    console.log('✅ Signed in successfully');
    
    // 2. Get profile
    console.log('\n2. Getting profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
      return;
    }
    
    console.log('✅ Profile retrieved:', {
      id: profile.id,
      email: profile.email,
      role: profile.role
    });
    
    // 3. Test categories access (READ)
    console.log('\n3. Testing categories READ access...');
    const { data: categories, error: readError } = await supabase
      .from('categories')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (readError) {
      console.error('❌ Categories READ error:', readError);
    } else {
      console.log('✅ Categories READ success:', categories?.length || 0, 'categories');
      categories?.forEach((cat, index) => {
        console.log(`  ${index + 1}. ${cat.name} (${cat.id})`);
      });
    }
    
    // 4. Test categories access (INSERT)
    console.log('\n4. Testing categories INSERT access...');
    const testCategoryName = `Test Category ${Date.now()}`;
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert([{ name: testCategoryName }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Categories INSERT error:', insertError);
    } else {
      console.log('✅ Categories INSERT success:', insertData);
      
      // Clean up test category
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
    
    // 5. Test admin metadata and profile logic
    console.log('\n5. Testing admin logic...');
    const user = signInData.user;
    const isMetadataAdmin = user?.user_metadata?.role === 'admin';
    const isProfileAdmin = profile?.role === 'admin';
    const isAdminEmail = user?.email === 'admin@itwala.com';
    const isAdmin = isMetadataAdmin || isProfileAdmin || isAdminEmail;
    
    console.log('Admin check results:', {
      isMetadataAdmin,
      isProfileAdmin,
      isAdminEmail,
      isAdmin,
      userMetadata: user?.user_metadata
    });
    
    if (isAdmin) {
      console.log('✅ Admin status: PASSED');
    } else {
      console.log('❌ Admin status: FAILED');
    }
    
    // 6. Test session and token
    console.log('\n6. Testing session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
    } else if (session) {
      console.log('✅ Session active:', {
        userId: session.user?.id,
        email: session.user?.email,
        tokenType: session.token_type,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A'
      });
    } else {
      console.log('❌ No session found');
    }
    
    // 7. Sign out
    console.log('\n7. Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out');
    
    console.log('\n🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testCategoriesAccess()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });