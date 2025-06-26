const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugAuth() {
  try {
    console.log('🔍 Debugging authentication state...');
    
    // List all users and their profiles
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) {
      console.error('❌ Error fetching auth users:', authError);
      return;
    }
    
    console.log('\n👥 All authenticated users:');
    for (const user of authUsers.users) {
      console.log(`  - ${user.email} (${user.id})`);
      console.log(`    Metadata:`, user.user_metadata);
      console.log(`    Last sign in:`, user.last_sign_in_at);
      
      // Get profile for this user
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profileError) {
        console.log(`    Profile: ❌ Error - ${profileError.message}`);
      } else {
        console.log(`    Profile: ✅ Role: ${profile.role}, Name: ${profile.full_name}`);
      }
      console.log('');
    }
    
    // Check if there are any active sessions
    console.log('🔐 Checking for active sessions...');
    
    // Test the useAuth logic manually
    console.log('\n🧪 Testing admin check logic...');
    const prashantUser = authUsers.users.find(u => u.email === 'prashant.srivastav@gmail.com');
    
    if (prashantUser) {
      const { data: prashantProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', prashantUser.id)
        .single();
      
      // Simulate the checkAdminStatus function from useAuth
      const isMetadataAdmin = prashantUser.user_metadata?.role === 'admin';
      const isProfileAdmin = prashantProfile?.role === 'admin';
      const isAdminEmail = prashantUser.email === 'admin@itwala.com';
      
      console.log('Admin check for prashant.srivastav@gmail.com:');
      console.log(`  - Metadata admin: ${isMetadataAdmin}`);
      console.log(`  - Profile admin: ${isProfileAdmin}`);
      console.log(`  - Admin email: ${isAdminEmail}`);
      console.log(`  - Final result: ${isMetadataAdmin || isProfileAdmin || isAdminEmail}`);
      
      if (!isProfileAdmin) {
        console.log('❌ Profile admin check failed - this is the issue!');
      } else {
        console.log('✅ Profile admin check passed');
      }
    }
    
  } catch (error) {
    console.error('❌ Error debugging auth:', error);
  }
}

// Also create a function to force refresh user metadata
async function forceRefreshUserMetadata() {
  try {
    console.log('🔄 Forcing user metadata refresh...');
    
    const { data: authUsers } = await supabase.auth.admin.listUsers();
    const prashantUser = authUsers.users.find(u => u.email === 'prashant.srivastav@gmail.com');
    
    if (prashantUser) {
      // Update user metadata to include admin role
      const { data, error } = await supabase.auth.admin.updateUserById(
        prashantUser.id,
        {
          user_metadata: {
            ...prashantUser.user_metadata,
            role: 'admin'
          }
        }
      );
      
      if (error) {
        console.error('❌ Error updating user metadata:', error);
      } else {
        console.log('✅ User metadata updated with admin role');
        console.log('Updated user:', data.user.user_metadata);
      }
    }
    
  } catch (error) {
    console.error('❌ Error refreshing metadata:', error);
  }
}

// Run based on command line argument
if (require.main === module) {
  const command = process.argv[2];
  
  if (command === 'refresh') {
    forceRefreshUserMetadata().then(() => debugAuth()).catch(console.error);
  } else {
    debugAuth().catch(console.error);
  }
}

module.exports = { debugAuth, forceRefreshUserMetadata };