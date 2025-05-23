const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const serviceRoleClient = createClient(
  'https://lyywvmoxtlovvxknpkpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function debugState() {
  try {
    // 1. Check if profiles table exists
    console.log('1. Checking profiles table...');
    const { data: tables, error: tablesError } = await serviceRoleClient
      .from('information_schema.tables')
      .select('*')
      .eq('table_schema', 'public')
      .eq('table_name', 'profiles');

    if (tablesError) {
      console.error('Error checking tables:', tablesError);
    } else {
      console.log('Tables found:', tables);
    }

    // 2. List RLS policies
    console.log('\n2. Checking RLS policies...');
    const { data: policies, error: policiesError } = await serviceRoleClient
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'profiles');

    if (policiesError) {
      console.error('Error checking policies:', policiesError);
    } else {
      console.log('Policies:', policies);
    }

    // 3. Check admin user in auth.users
    console.log('\n3. Checking auth.users...');
    const { data: { users }, error: usersError } = await serviceRoleClient.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error checking users:', usersError);
    } else {
      const adminUser = users.find(u => u.email === 'admin@itwala.com');
      console.log('Admin user:', {
        id: adminUser?.id,
        email: adminUser?.email,
        role: adminUser?.role,
        metadata: adminUser?.user_metadata,
        lastSignIn: adminUser?.last_sign_in_at,
        confirmedAt: adminUser?.email_confirmed_at
      });
    }

    // 4. Check admin profile
    console.log('\n4. Checking profiles table data...');
    const { data: profiles, error: profilesError } = await serviceRoleClient
      .from('profiles')
      .select('*')
      .eq('email', 'admin@itwala.com');

    if (profilesError) {
      console.error('Error checking profiles:', profilesError);
    } else {
      console.log('Admin profile:', profiles?.[0]);
    }

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

debugState();
