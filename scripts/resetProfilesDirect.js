const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function resetProfilesDirect() {
  try {
    // 1. Sign in first
    console.log('1. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) throw signInError;

    // 2. Create the profiles table using direct SQL
    console.log('\n2. Creating profiles table...');
    await fetch('https://lyywvmoxtlovvxknpkpw.supabase.co/rest/v1/rpc/execute_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({
        sql: `
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

          DO $$ 
          BEGIN
            CREATE POLICY "Public profiles are viewable by everyone"
              ON public.profiles FOR SELECT
              USING (true);
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;

          DO $$ 
          BEGIN
            CREATE POLICY "Users can update own profile"
              ON public.profiles FOR UPDATE
              USING (auth.uid() = id);
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;

          DO $$ 
          BEGIN
            CREATE POLICY "Admins have full access"
              ON public.profiles FOR ALL
              USING (EXISTS (SELECT 1 FROM auth.users WHERE auth.uid() = id AND raw_user_meta_data->>'role' = 'admin'));
          EXCEPTION
            WHEN duplicate_object THEN null;
          END $$;
        `
      })
    });

    // 3. Create admin profile
    console.log('\n3. Creating admin profile...');
    const { data: profile, error: profileError } = await supabase
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

    if (profileError) {
      console.error('Profile error:', profileError);
      throw profileError;
    }

    console.log('Profile created/updated:', profile);

    // 4. Update user metadata
    console.log('\n4. Updating user metadata...');
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: 'admin' }
    });

    if (updateError) throw updateError;
    console.log('User metadata updated successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

resetProfilesDirect();
