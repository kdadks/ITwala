const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Regular client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Admin client with service role
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function setupWithServiceRole() {
  try {
    // 1. Create profiles table
    console.log('1. Creating profiles table...');
    await supabaseAdmin.rpc('create_profiles_table', {
      sql_command: `
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

        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- Basic policies
        CREATE POLICY IF NOT EXISTS "Public profiles are viewable by everyone"
          ON public.profiles FOR SELECT
          USING (true);

        CREATE POLICY IF NOT EXISTS "Users can update own profile"
          ON public.profiles FOR UPDATE
          USING (auth.uid() = id);

        -- Admin policies
        CREATE POLICY IF NOT EXISTS "Admins have full access"
          ON public.profiles FOR ALL
          USING (
            EXISTS (
              SELECT 1
              FROM auth.users
              WHERE auth.uid() = id 
              AND (
                raw_user_meta_data->>'role' = 'admin'
                OR
                EXISTS (
                  SELECT 1 
                  FROM profiles 
                  WHERE profiles.id = auth.uid() 
                  AND profiles.role = 'admin'
                )
              )
            )
          );
      `
    });

    // 2. Sign in as admin
    console.log('\n2. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) throw signInError;

    // 3. Create admin profile using service role
    console.log('\n3. Creating admin profile...');
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) throw profileError;

    console.log('Profile created:', profile);

    // 4. Update user metadata using service role
    console.log('\n4. Updating user metadata...');
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      signInData.user.id,
      {
        user_metadata: { role: 'admin' }
      }
    );

    if (updateError) throw updateError;

    console.log('User metadata updated successfully');

    // 5. Verify setup
    console.log('\n5. Verifying setup...');
    const { data: verifyProfile, error: verifyError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (verifyError) throw verifyError;

    console.log('Final profile state:', verifyProfile);

  } catch (error) {
    console.error('Error:', error);
  }
}

setupWithServiceRole();
