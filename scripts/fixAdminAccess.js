const fetch = require('node-fetch');

// Configuration
const config = {
  SUPABASE_URL: 'https://lyywvmoxtlovvxknpkpw.supabase.co',
  SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw',
  ADMIN_EMAIL: 'admin@itwala.com',
  ADMIN_ID: 'e6b1ce03-fa2d-40bc-b0cf-d5c2822b204f'
};

async function fixAdminAccess() {
  try {
    console.log('1. Creating profiles table...');
    const createTableResponse = await fetch(`${config.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.SUPABASE_KEY}`,
        'apikey': config.SUPABASE_KEY
      },
      body: JSON.stringify({
        command: `
          -- Create profiles table
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
            -- Drop existing policies
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
                  AND raw_user_meta_data->>'role' = 'admin'
                )
              );
          END $$;
        `
      })
    });

    console.log('Create table response:', await createTableResponse.text());

    console.log('\n2. Inserting admin profile...');
    const insertProfileResponse = await fetch(`${config.SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.SUPABASE_KEY}`,
        'apikey': config.SUPABASE_KEY,
        'Prefer': 'return=representation'
      },
      body: JSON.stringify({
        id: config.ADMIN_ID,
        email: config.ADMIN_EMAIL,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      })
    });

    console.log('Insert profile response:', await insertProfileResponse.text());

    console.log('\n3. Updating user metadata...');
    const updateMetadataResponse = await fetch(`${config.SUPABASE_URL}/auth/v1/admin/users/${config.ADMIN_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.SUPABASE_KEY}`,
        'apikey': config.SUPABASE_KEY
      },
      body: JSON.stringify({
        user_metadata: { role: 'admin' }
      })
    });

    console.log('Update metadata response:', await updateMetadataResponse.text());

    console.log('\nSetup completed! Please sign out and sign back in as:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');

  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdminAccess();
