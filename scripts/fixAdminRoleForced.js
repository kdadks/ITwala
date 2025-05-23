const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' }); // Using the .env we created earlier

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY, // Using service role to bypass RLS
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function fixAdminRole() {
  try {
    console.log('Getting admin user...');
    const { data: { users }, error: usersError } = await supabaseAdmin.auth.admin.listUsers();
    if (usersError) throw usersError;

    const adminUser = users.find(user => user.email === 'admin@itwala.com');
    if (!adminUser) {
      console.error('Admin user not found');
      return;
    }

    console.log('Admin user found:', adminUser.id);

    // Update auth user metadata
    console.log('Updating auth metadata...');
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      adminUser.id,
      { user_metadata: { role: 'admin' } }
    );
    if (updateError) throw updateError;

    // Update or create profile with service role
    console.log('Updating profile...');
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: adminUser.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      });
    
    if (profileError) throw profileError;

    console.log('Admin role fixed successfully');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixAdminRole();
