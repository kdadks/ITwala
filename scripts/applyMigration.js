const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Create admin client with service role key
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function applyMigration() {
  try {
    console.log('1. Reading migration SQL...');
    const sql = `
    -- Create profiles table if it doesn't exist
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

    -- Add role and email columns if they don't exist
    ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS email TEXT;

    -- Ensure row level security (RLS) is enabled
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Drop existing policies to avoid conflicts
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;

    -- Create default profile access policies
    CREATE POLICY "Public profiles are viewable by everyone"
      ON public.profiles FOR SELECT
      USING (true);

    CREATE POLICY "Users can update their own profile"
      ON public.profiles FOR UPDATE
      USING (auth.uid() = id);

    -- Create admin-specific policies
    CREATE POLICY "Admins have full access"
      ON public.profiles 
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
    `;

    // Apply migration
    console.log('2. Applying migration...');
    const { error: migrationError } = await adminClient.rpc('apply_migration', { sql });
    
    if (migrationError) throw migrationError;

    // Get admin user
    console.log('\n3. Getting admin user...');
    const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();
    if (usersError) throw usersError;

    const adminUser = users.find(u => u.email === 'admin@itwala.com');
    if (!adminUser) throw new Error('Admin user not found');

    // Update admin metadata
    console.log('\n4. Updating admin user metadata...');
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: { role: 'admin' }
      }
    );

    if (updateError) throw updateError;

    // Create/update admin profile
    console.log('\n5. Updating admin profile...');
    const { error: profileError } = await adminClient
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: adminUser.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      });

    if (profileError) throw profileError;

    console.log('Migration completed successfully!');
    console.log('\nPlease try signing out and signing back in as admin:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error:', error);
  }
}

applyMigration();
