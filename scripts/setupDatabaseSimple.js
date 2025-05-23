const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function setupDatabase() {
  try {
    console.log('Setting up database and admin user...');

    // 1. Try to sign in as admin first
    console.log('\n1. Attempting to sign in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError && !signInError.message.includes('Invalid login credentials')) {
      console.error('Unexpected sign in error:', signInError);
      throw signInError;
    }

    // 2. If sign in failed, create the admin user
    if (!signInData?.user) {
      console.log('\n2. Admin user not found, creating new admin user...');
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

      if (signUpError && !signUpError.message.includes('already registered')) {
        console.error('Error creating admin user:', signUpError);
        throw signUpError;
      }

      // Try signing in again
      const { data: newSignInData, error: newSignInError } = await supabase.auth.signInWithPassword({
        email: 'admin@itwala.com',
        password: 'Admin@123'
      });

      if (newSignInError) {
        console.error('Error signing in after signup:', newSignInError);
        throw newSignInError;
      }

      signInData = newSignInData;
    }

    // 3. Create or update admin profile
    console.log('\n3. Setting up admin profile...');
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      });

    if (upsertError) {
      console.error('Error upserting admin profile:', upsertError);
      
      // If error is about table not existing, create the table
      if (upsertError.message.includes('does not exist')) {
        console.log('\nProfiles table does not exist, creating it...');
        
        // Create the profiles table using raw SQL
        const { data, error: sqlError } = await supabase.query(`
          DO $$ 
          BEGIN
            -- Create the profiles table
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

            -- Enable RLS
            ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Users can view their own profile"
              ON public.profiles FOR SELECT
              USING (auth.uid() = id);

            CREATE POLICY "Users can update their own profile"
              ON public.profiles FOR UPDATE
              USING (auth.uid() = id);

            CREATE POLICY "Admin can view all profiles"
              ON public.profiles FOR SELECT
              USING (
                EXISTS (
                  SELECT 1 FROM public.profiles
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );

            CREATE POLICY "Admin can update all profiles"
              ON public.profiles FOR UPDATE
              USING (
                EXISTS (
                  SELECT 1 FROM public.profiles
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          END $$;
        `);

        if (sqlError) {
          console.error('Error creating profiles table:', sqlError);
          throw sqlError;
        }

        // Try upserting the profile again
        const { error: retryError } = await supabase
          .from('profiles')
          .upsert({
            id: signInData.user.id,
            email: signInData.user.email,
            role: 'admin',
            full_name: 'Admin User',
            created_at: new Date().toISOString()
          });

        if (retryError) {
          console.error('Error retrying profile upsert:', retryError);
          throw retryError;
        }
      } else {
        throw upsertError;
      }
    }

    console.log('\nSetup completed successfully!');
    console.log('\nYou can now log in with:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('\nSetup failed:', error);
    process.exit(1);
  }
}

setupDatabase().then(() => process.exit(0));
