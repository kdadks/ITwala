const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function refreshAdminSession() {
  try {
    console.log('1. Signing out first...');
    await supabase.auth.signOut();

    console.log('2. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) throw signInError;
    
    console.log('3. Getting current session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;
    
    console.log('4. Getting current user...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError) throw userError;

    console.log('\nSession Info:', {
      userId: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.user_metadata?.role
    });

    console.log('\nUser Info:', {
      id: user?.id,
      email: user?.email,
      metadata: user?.user_metadata
    });

    console.log('\n5. Checking profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user?.id)
      .single();
    
    if (profileError) throw profileError;
    
    console.log('Profile Info:', profile);

  } catch (error) {
    console.error('Error:', error);
  }
}

refreshAdminSession();
