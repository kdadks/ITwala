const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'present' : 'missing');
  console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'present' : 'missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setAdminRole() {
  try {
    console.log('🔧 Setting up admin role...');
    
    // Get the email from command line argument or use default
    const adminEmail = process.argv[2] || 'admin@itwala.com';
    console.log(`📧 Setting admin role for: ${adminEmail}`);
    
    // First, check if user exists in auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    const authUser = authUsers.users.find(user => user.email === adminEmail);
    
    if (!authUser) {
      console.log(`❌ User with email ${adminEmail} not found in auth.users`);
      console.log('Available users:');
      authUsers.users.forEach(user => {
        console.log(`  - ${user.email} (${user.id})`);
      });
      return;
    }
    
    console.log(`✅ Found user in auth: ${authUser.email} (${authUser.id})`);
    
    // Check if profile exists
    const { data: existingProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (profileError && !profileError.message.includes('Results contain 0 rows')) {
      console.error('❌ Error checking profile:', profileError);
      return;
    }
    
    if (existingProfile) {
      console.log('📋 Existing profile found:', existingProfile);
      
      // Update existing profile to admin
      const { data: updatedProfile, error: updateError } = await supabase
        .from('profiles')
        .update({
          role: 'admin'
        })
        .eq('id', authUser.id)
        .select()
        .single();
      
      if (updateError) {
        console.error('❌ Error updating profile:', updateError);
        return;
      }
      
      console.log('✅ Profile updated to admin:', updatedProfile);
    } else {
      console.log('📝 No profile found, creating new admin profile...');
      
      // Create new admin profile
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: authUser.id,
          email: authUser.email,
          full_name: authUser.user_metadata?.full_name || authUser.email.split('@')[0],
          role: 'admin',
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (createError) {
        console.error('❌ Error creating profile:', createError);
        return;
      }
      
      console.log('✅ New admin profile created:', newProfile);
    }
    
    // Verify the admin role is set
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();
    
    if (verifyError) {
      console.error('❌ Error verifying profile:', verifyError);
      return;
    }
    
    console.log('🎉 Admin role verification:');
    console.log(`  - User ID: ${verifyProfile.id}`);
    console.log(`  - Email: ${verifyProfile.email}`);
    console.log(`  - Role: ${verifyProfile.role}`);
    console.log(`  - Full Name: ${verifyProfile.full_name}`);
    
    if (verifyProfile.role === 'admin') {
      console.log('✅ Admin role successfully set!');
      console.log('🔄 Please refresh your browser and try accessing /admin/categories again');
    } else {
      console.log('❌ Admin role not set correctly');
    }
    
  } catch (error) {
    console.error('❌ Error setting admin role:', error);
  }
}

// Also create a function to list all users and their roles
async function listUsers() {
  try {
    console.log('👥 Listing all users and their roles...');
    
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }
    
    console.log('\n📋 Current users:');
    profiles.forEach(profile => {
      console.log(`  - ${profile.email} | Role: ${profile.role} | ID: ${profile.id}`);
    });
    
  } catch (error) {
    console.error('❌ Error listing users:', error);
  }
}

// Run the appropriate function based on command line arguments
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'list') {
    listUsers().catch(console.error);
  } else {
    setAdminRole().catch(console.error);
  }
}

module.exports = { setAdminRole, listUsers };