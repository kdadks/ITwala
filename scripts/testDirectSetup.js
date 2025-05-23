const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://lyywvmoxtlovvxknpkpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function testAdminAccess() {
  try {
    console.log('1. Testing connection...');
    const { data, error } = await supabase.from('profiles').select('count').limit(1);
    
    if (error) {
      console.error('Connection error:', error);
      return;
    }
    console.log('Connection successful');

    // Run the migration SQL
    console.log('\n2. Running migration...');
    const { error: migrationError } = await supabase.rpc('create_profiles_table', {
      sql_command: `
        -- Ensure profiles table exists
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

        -- Remove existing policies
        DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
        DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
        DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
        DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;

        -- Create new policies
        CREATE POLICY "Public profiles are viewable by everyone"
          ON public.profiles FOR SELECT
          USING (true);

        CREATE POLICY "Users can update their own profile"
          ON public.profiles FOR UPDATE
          USING (auth.uid() = id);

        CREATE POLICY "Admins have full access"
          ON public.profiles FOR ALL
          USING (
            EXISTS (
              SELECT 1 FROM auth.users
              WHERE auth.uid() = profiles.id
              AND (
                raw_user_meta_data->>'role' = 'admin'
                OR EXISTS (
                  SELECT 1 FROM profiles p2
                  WHERE p2.id = auth.uid()
                  AND p2.role = 'admin'
                )
              )
            )
          );

        -- Insert or update admin user profile
        INSERT INTO public.profiles (id, email, role, full_name, created_at)
        VALUES (
          'e6b1ce03-fa2d-40bc-b0cf-d5c2822b204f',
          'admin@itwala.com',
          'admin',
          'Admin User',
          NOW()
        )
        ON CONFLICT (id) DO UPDATE
        SET role = 'admin',
            full_name = 'Admin User',
            email = 'admin@itwala.com';

        -- Update admin user metadata
        UPDATE auth.users
        SET raw_user_meta_data = jsonb_set(
          COALESCE(raw_user_meta_data, '{}'::jsonb),
          '{role}',
          '"admin"'
        )
        WHERE email = 'admin@itwala.com';
      `
    });

    if (migrationError) {
      console.error('Migration error:', migrationError);
      return;
    }

    console.log('Migration successful');

    // Verify admin setup
    console.log('\n3. Verifying admin user...');
    const { data: adminProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'admin@itwala.com')
      .single();

    if (profileError) {
      console.error('Profile check error:', profileError);
      return;
    }

    console.log('Admin profile:', adminProfile);
    console.log('\nSetup complete! You can now log in with:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminAccess();
