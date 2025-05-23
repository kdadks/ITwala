// @ts-check
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'present' : 'missing');
  console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'present' : 'missing');
  process.exit(1);
}

console.log('Using Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupAdmin() {
  try {
    console.log('Setting up admin account...');

    // 1. Sign up admin user
    console.log('1. Creating admin user...');
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@itwala.com',
      password: 'Admin@123',
      options: {
        data: {
          role: 'admin',
          full_name: 'Admin User'
        }
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      if (!signUpError.message.includes('already registered')) {
        throw signUpError;
      }
    }

    console.log('Sign up response:', signUpData);

    // 2. Try to sign in
    console.log('\n2. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      throw signInError;
    }

    console.log('Sign in successful:', signInData.user?.id);

    // 3. Create or update admin profile
    console.log('\n3. Setting up admin profile...');
    const { data: profile, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (upsertError) {
      console.error('Profile update error:', upsertError);
      throw upsertError;
    }

    console.log('Admin profile created:', profile);

    console.log('\nAdmin setup completed successfully!');
    console.log('\nYou can now log in with:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error setting up admin:', error.message);
    console.error('Full error:', error);
  }
}

setupAdmin().then(() => process.exit(0)).catch(() => process.exit(1));
