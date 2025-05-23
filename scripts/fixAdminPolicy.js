const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

async function fixAdminPolicy() {
  try {
    console.log('1. Applying new admin policies...');
    const sql = `
    -- Enable RLS
    ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

    -- Drop all existing policies to start fresh
    DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
    DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
    DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
    DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;
    DROP POLICY IF EXISTS "Admin Access Policy" ON public.profiles;
    DROP POLICY IF EXISTS "User Self Access" ON public.profiles;
    DROP POLICY IF EXISTS "Public Read Access" ON public.profiles;

    -- Create a simplified admin policy that avoids recursion
    CREATE POLICY "Admin Access Policy"
    ON public.profiles
    FOR ALL
    USING (
      EXISTS (
        SELECT 1 FROM auth.users
        WHERE auth.uid() = id
        AND (
          email = 'admin@itwala.com'  -- Direct admin email check
          OR raw_user_meta_data->>'role' = 'admin'  -- Check admin role in metadata
        )
      )
    );

    -- Basic user access policy
    CREATE POLICY "User Self Access"
    ON public.profiles
    FOR ALL
    USING (auth.uid() = id);

    -- Everyone can view profiles
    CREATE POLICY "Public Read Access"
    ON public.profiles
    FOR SELECT
    USING (true);`;

    const { error: policyError } = await adminClient.rpc('apply_migration', { sql });
    if (policyError) throw policyError;

    // Get admin user
    console.log('\n2. Verifying admin user...');
    const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers();
    if (usersError) throw usersError;

    const adminUser = users.find(u => u.email === 'admin@itwala.com');
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }

    // Update admin metadata
    console.log('\n3. Updating admin metadata...');
    const { error: updateError } = await adminClient.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: { role: 'admin' }
      }
    );
    if (updateError) throw updateError;

    // Update admin profile
    console.log('\n4. Updating admin profile...');
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

    console.log('\nAdmin policy update completed successfully!');
    console.log('\nPlease:');
    console.log('1. Sign out');
    console.log('2. Clear your browser cache');
    console.log('3. Sign back in with:');
    console.log('   Email: admin@itwala.com');
    console.log('   Password: Admin@123');

  } catch (error) {
    console.error('Error:', error);
    console.error('Full error:', error.message);
  }
}

fixAdminPolicy();
