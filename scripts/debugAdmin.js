const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function debugAdminSetup() {
  const adminEmail = 'admin@itwala.com';
  
  try {
    // 1. Create/verify admin user
    console.log('\n1. Setting up admin user...');
    let { data: authData, error: signUpError } = await supabase.auth.signUp({
      email: adminEmail,
      password: 'Admin@123',
      options: {
        data: {
          role: 'admin',
          full_name: 'Admin User'
        }
      }
    });
    
    if (signUpError && !signUpError.message.includes('already registered')) {
      console.error('Error creating admin user:', signUpError);
      return;
    }

    // Try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: 'Admin@123'
    });

    if (signInError) {
      console.error('Error signing in as admin:', signInError);
      return;
    }

    const user = signInData.user;
    console.log('Auth user found/created:', {
      id: user?.id,
      email: user?.email,
      role: user?.user_metadata?.role,
      metadata: user?.user_metadata
    });

    // 2. Check profiles table
    console.log('\n2. Checking profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    console.log('Current profile:', profile);

    if (profileError && profileError.code !== 'PGRST116') {
      console.error('Error checking profile:', profileError);
      return;
    }

    // 3. Ensure profiles table exists with correct structure
    console.log('\n3. Ensuring profiles table structure...');
    const { error: createTableError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT,
        role TEXT DEFAULT 'user',
        email TEXT,
        avatar_url TEXT,
        bio TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
        phone TEXT
      );
    `);

    if (createTableError) {
      console.error('Error ensuring table structure:', createTableError);
    }

    // 4. Update or create admin profile
    console.log('\n4. Updating admin profile...');
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: adminEmail,
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (upsertError) {
      console.error('Error upserting profile:', upsertError);
      return;
    }

    // 5. Verify final state
    console.log('\n5. Verifying final state...');
    const { data: finalProfile, error: finalError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', adminEmail)
      .single();

    if (finalError) {
      console.error('Error checking final state:', finalError);
      return;
    }

    console.log('Final profile state:', finalProfile);
    console.log('\nAdmin setup verification complete!');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

debugAdminSetup()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
