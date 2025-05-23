const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function basicTest() {
  try {
    // 1. Simple query to verify connection
    console.log('1. Testing connection...');
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);

    if (testError) {
      console.error('Connection test failed:', testError);
      return;
    }
    console.log('Connection successful');

    // 2. Get admin user
    console.log('\n2. Checking admin user...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('Error listing users:', usersError);
      return;
    }
    const adminUser = users.find(u => u.email === 'admin@itwala.com');
    console.log('Admin user found:', adminUser ? 'Yes' : 'No');
    if (adminUser) {
      console.log('Admin metadata:', adminUser.user_metadata);
    }

    // 3. Check admin profile
    if (adminUser) {
      console.log('\n3. Checking admin profile...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', adminUser.id)
        .single();

      if (profileError) {
        console.error('Error checking profile:', profileError);
        return;
      }
      console.log('Admin profile:', profile);
    }

  } catch (error) {
    console.error('Test failed:', error);
  }
}

basicTest();
