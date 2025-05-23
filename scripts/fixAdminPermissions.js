const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

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

async function fixAdminPermissions() {
  try {
    console.log('1. Checking admin user...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    const adminUser = users.find(u => u.email === 'admin@itwala.com');
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }

    console.log('\n2. Updating auth metadata...');
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: { 
          role: 'admin',
          full_name: 'Admin User'
        },
        email_confirm: true
      }
    );

    if (updateError) throw updateError;

    console.log('\n3. Checking profiles table...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (profileError && !profileError.message.includes('Results contain 0 rows')) {
      throw profileError;
    }

    console.log('\n4. Updating profile...');
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: adminUser.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (upsertError) throw upsertError;

    console.log('\n5. Updating RLS policies...');
    const { error: policyError } = await supabase.rpc('create_profiles_table', {
      sql_command: `
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
      `
    });

    if (policyError) throw policyError;

    console.log('\nAdmin permissions fixed successfully!');
    console.log('\nPlease:');
    console.log('1. Sign out if you are currently signed in');
    console.log('2. Clear your browser cache/cookies for the site');
    console.log('3. Sign in again with:');
    console.log('   Email: admin@itwala.com');
    console.log('   Password: Admin@123');

  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdminPermissions();
