const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function fullReset() {
  try {
    console.log('1. Creating profiles table...');
    const { error: tableError } = await supabase.query(`
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
      CREATE POLICY "Public profiles are viewable by everyone"
        ON public.profiles FOR SELECT
        USING (true);

      CREATE POLICY "Users can insert their own profile"
        ON public.profiles FOR INSERT
        WITH CHECK (auth.uid() = id);

      CREATE POLICY "Users can update own profile"
        ON public.profiles FOR UPDATE
        USING (auth.uid() = id);

      -- Admin policies
      CREATE POLICY "Admins have full access"
        ON public.profiles FOR ALL
        USING (
          EXISTS (
            SELECT 1 FROM public.profiles
            WHERE auth.uid() = id AND role = 'admin'
          )
        );
    `);

    if (tableError) throw tableError;

    // Sign in as admin
    console.log('\n2. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) throw signInError;

    // Create admin profile
    console.log('\n3. Creating admin profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    // Verify profile
    console.log('\n4. Verifying profile...');
    const { data: profile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (verifyError) throw verifyError;

    console.log('Success! Admin profile:', profile);

  } catch (error) {
    console.error('Error:', error);
  }
}

fullReset();
