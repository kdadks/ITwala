const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

// Create client with service role key for admin operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // 1. Create profiles table
    console.log('\n1. Creating profiles table...');
    const { error: createError } = await supabase.rpc('create_profiles_table', {
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

        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

        -- Create policies
        DO $$ 
        BEGIN
          -- Drop existing policies if they exist
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

          -- Create admin-specific policy that grants full access
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

    if (createError) {
      console.error('Error creating profiles table:', createError);
      throw createError;
    }

    // 2. Set up admin user
    console.log('\n2. Setting up admin user...');
    const { data: { user: adminUser }, error: signUpError } = await supabase.auth.admin.createUser({
      email: 'admin@itwala.com',
      password: 'Admin@123',
      email_confirm: true,
      user_metadata: {
        role: 'admin',
        full_name: 'Admin User'
      }
    });

    // 3. Get admin user if already exists
    console.log('\n3. Fetching admin user...');
    let user = adminUser;
    if (!user) {
      const { data: {users}, error: listError } = await supabase.auth.admin.listUsers();
      if (listError) {
        console.error('Error listing users:', listError);
        throw listError;
      }
      user = users.find(u => u.email === 'admin@itwala.com');
      if (!user) {
        throw new Error('Failed to find or create admin user');
      }
    }

    // Update user metadata
    console.log('\n4. Updating user metadata...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      user.id,
      {
        email_confirm: true,
        user_metadata: { role: 'admin', full_name: 'Admin User' }
      }
    );

    if (updateError) {
      console.error('Error updating user metadata:', updateError);
      throw updateError;
    }

    // 5. Create/update admin profile
    console.log('\n5. Creating admin profile...');
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        email: user.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (profileError) {
      console.error('Error creating admin profile:', profileError);
      throw profileError;
    }

    console.log('\nDatabase setup completed successfully!');
    console.log('\nYou can now log in with:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('\nSetup failed:', error);
    process.exit(1);
  }
}

setupDatabase().then(() => process.exit(0));
