const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdminUser() {
  const adminEmail = 'admin@itwala.com';

  try {
    console.log('Fetching admin user...');
    const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) throw usersError;

    const adminUser = users.find(user => user.email === adminEmail);
    
    if (!adminUser) {
      console.log('Admin user not found in auth.users');
      return;
    }

    console.log('Checking profiles table...');
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', adminUser.id)
      .single();

    if (profileError && profileError.code !== 'PGRST116') {
      throw profileError;
    }

    if (!existingProfile) {
      console.log('Creating admin profile...');
      const { error: insertError } = await supabase
        .from('profiles')
        .insert([
          {
            id: adminUser.id,
            full_name: 'Admin User',
            role: 'admin',
            email: adminEmail,
            created_at: new Date().toISOString()
          }
        ]);

      if (insertError) throw insertError;
      console.log('Admin profile created successfully');
    } else {
      console.log('Updating existing admin profile...');
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin',
          full_name: 'Admin User'
        })
        .eq('id', adminUser.id);

      if (updateError) throw updateError;
      console.log('Admin profile updated successfully');
    }

  } catch (error) {
    console.error('Error fixing admin user:', error);
  }
}

fixAdminUser().then(() => {
  console.log('Admin fix process completed');
  process.exit(0);
}).catch((error) => {
  console.error('Admin fix failed:', error);
  process.exit(1);
});
