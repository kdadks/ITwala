// @ts-check
const { supabase, supabaseAdmin } = require('./utils/supabaseClient');

if (!supabaseAdmin) {
  console.error('Service role key is required for admin operations');
  process.exit(1);
}

const adminClient = supabaseAdmin; // TypeScript will now know this is not null

async function setupAdmin() {
  try {
    console.log('Setting up admin account...');

    // 1. Create admin user using admin client
    console.log('1. Creating admin user...');
    const { data: signUpData, error: signUpError } = await adminClient.auth.admin.createUser({
      email: 'admin@itwala.com',
      password: 'Admin@123',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Admin User'
      }
    });

    if (signUpError) {
      console.error('Sign up error:', signUpError);
      if (!signUpError.message.includes('already registered')) {
        throw signUpError;
      }
    }

    console.log('Sign up response:', signUpData);

    // 2. Create or update admin profile
    console.log('\n2. Setting up admin profile...');
    const { data: profile, error: upsertError } = await adminClient
      .from('profiles')
      .upsert({
        id: signUpData?.user?.id,
        email: 'admin@itwala.com',
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
