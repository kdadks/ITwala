import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupAdmin() {
  try {
    console.log('Setting up admin user...');

    // Step 1: Create or get admin user
    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email: 'admin@itwala.com',
      password: 'Admin@123',
      options: {
        data: {
          full_name: 'Admin User',
          role: 'admin'
        }
      }
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      throw signUpError;
    }

    // Step 2: Create admin profile
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user?.id,
        full_name: 'Admin User',
        role: 'admin',
        email: 'admin@itwala.com',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      throw profileError;
    }

    // Step 3: Verify admin profile
    const { data: profile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@itwala.com')
      .single();

    if (verifyError) {
      throw verifyError;
    }

    console.log('Admin setup completed successfully');
    console.log('Profile:', profile);
    console.log('\nYou can now log in with:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error setting up admin:', error);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
