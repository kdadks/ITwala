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

async function testAdminLogin() {
  const adminEmail = 'admin@itwala.com';
  const adminPassword = 'Admin@123';
  
  try {
    console.log('Testing admin login flow...\n');
    
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
    
    console.log('✅ Sign in successful');
    console.log('User ID:', signInData.user?.id);
    console.log('User Email:', signInData.user?.email);
    console.log('User Metadata:', signInData.user?.user_metadata);
    
    // 2. Test profile access
    console.log('\n2. Testing profile access...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();
    
    if (profileError) {
      console.error('Profile error:', profileError);
    } else {
      console.log('✅ Profile access successful');
      console.log('Profile role:', profile.role);
      console.log('Profile details:', {
        id: profile.id,
        email: profile.email,
        role: profile.role,
        full_name: profile.full_name
      });
    }
    
    // 3. Test categories access
    console.log('\n3. Testing categories access...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(3);
    
    if (categoriesError) {
      console.error('Categories error:', categoriesError);
    } else {
      console.log('✅ Categories access successful');
      console.log('Categories found:', categories?.length || 0);
      console.log('Sample categories:', categories?.map(c => c.name));
    }
    
    // 4. Test admin check logic
    console.log('\n4. Testing admin check logic...');
    const isMetadataAdmin = signInData.user?.user_metadata?.role === 'admin';
    const isProfileAdmin = profile?.role === 'admin';
    const isAdminEmail = signInData.user?.email === 'admin@itwala.com';
    const isAdmin = isMetadataAdmin || isProfileAdmin || isAdminEmail;
    
    console.log('Admin checks:', {
      isMetadataAdmin,
      isProfileAdmin,
      isAdminEmail,
      isAdmin
    });
    
    if (isAdmin) {
      console.log('✅ Admin status confirmed');
    } else {
      console.log('❌ Admin status failed');
    }
    
    // 5. Test session token
    console.log('\n5. Testing session token...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session error:', sessionError);
    } else if (session) {
      console.log('✅ Session token obtained');
      console.log('Access token length:', session.access_token?.length || 0);
      console.log('Token type:', session.token_type);
      console.log('Expires at:', session.expires_at ? new Date(session.expires_at * 1000).toISOString() : 'N/A');
    } else {
      console.log('❌ No session found');
    }
    
    // 6. Sign out
    console.log('\n6. Signing out...');
    const { error: signOutError } = await supabase.auth.signOut();
    
    if (signOutError) {
      console.error('Sign out error:', signOutError);
    } else {
      console.log('✅ Sign out successful');
    }
    
    console.log('\n✅ Admin login test complete');
    
  } catch (error) {
    console.error('Test error:', error);
  }
}

testAdminLogin()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });