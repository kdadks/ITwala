require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client with service role key
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

async function fixAdminWithServiceRole() {
  try {
    // 1. Create or update profiles table
    console.log('1. Creating/updating profiles table...');
    const { error: tableError } = await supabaseAdmin.rpc('create_profiles_table', {
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

        DO $$ 
        BEGIN
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
        END $$;
      `
    });

    if (tableError) {
      console.error('Table setup error:', tableError);
      return;
    }

    // 2. Get or create admin user
    console.log('\n2. Setting up admin user...');
    const { data: { user: adminUser }, error: createUserError } = await supabaseAdmin.auth.admin.createUser({
      email: 'admin@itwala.com',
      password: 'Admin@123',
      email_confirm: true,
      user_metadata: { role: 'admin', full_name: 'Admin User' }
    });

    if (createUserError && !createUserError.message.includes('already registered')) {
      console.error('User creation error:', createUserError);
      return;
    }

    // Get admin user if creation failed due to existing user
    let user = adminUser;
    if (!user) {
      const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        return;
      }
      user = users.find(u => u.email === 'admin@itwala.com');
    }

    if (!user) {
      console.error('Failed to find or create admin user');
      return;
    }

    // 3. Update admin user metadata
    console.log('\n3. Updating admin metadata...');
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true,
        user_metadata: { role: 'admin', full_name: 'Admin User' }
      }
    );

    if (updateError) {
      console.error('Metadata update error:', updateError);
      return;
    }

    // 4. Create/update admin profile
    console.log('\n4. Creating/updating admin profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: user.id,
        email: 'admin@itwala.com',
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });

    if (profileError) {
      console.error('Profile update error:', profileError);
      return;
    }

    // 5. Verify setup
    console.log('\n5. Verifying setup...');
    const { data: profile, error: checkError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', 'admin@itwala.com')
      .single();

    if (checkError) {
      console.error('Verification error:', checkError);
      return;
    }

    console.log('\nAdmin setup complete!');
    console.log('Profile:', profile);
    console.log('\nYou can now log in with:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

fixAdminWithServiceRole();
