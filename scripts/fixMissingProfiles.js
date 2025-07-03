const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixMissingProfiles() {
  console.log('🔍 Checking for missing profiles...\n');

  try {
    // Step 1: Get all users from auth.users
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) throw usersError;

    console.log(`📊 Found ${users.users.length} users in auth.users`);

    // Step 2: Get all profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role');
    if (profilesError) throw profilesError;

    console.log(`📊 Found ${profiles.length} profiles in profiles table`);

    // Step 3: Find users without profiles
    const profileIds = new Set(profiles.map(p => p.id));
    const usersWithoutProfiles = users.users.filter(user => 
      !profileIds.has(user.id) && user.email_confirmed_at
    );

    console.log(`🔍 Found ${usersWithoutProfiles.length} users without profiles\n`);

    // Step 4: Create missing profiles
    if (usersWithoutProfiles.length > 0) {
      console.log('📝 Creating missing profiles...');
      
      for (const user of usersWithoutProfiles) {
        const isAdminEmail = user.email === 'admin@itwala.com';
        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        
        const profileData = {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.email || 'User',
          role: (isAdminEmail || isMetadataAdmin) ? 'admin' : 'student',
          created_at: user.created_at,
          updated_at: new Date().toISOString()
        };

        const { error: insertError } = await supabase
          .from('profiles')
          .insert(profileData);

        if (insertError) {
          console.error(`❌ Failed to create profile for ${user.email}:`, insertError.message);
        } else {
          console.log(`✅ Created profile for ${user.email} with role: ${profileData.role}`);
        }
      }
    }

    // Step 5: Update existing profiles with missing or 'user' roles
    const { data: profilesWithBadRoles, error: badRolesError } = await supabase
      .from('profiles')
      .select('id, email, role')
      .or('role.is.null,role.eq.,role.eq.user');

    if (badRolesError) throw badRolesError;

    if (profilesWithBadRoles.length > 0) {
      console.log(`\n🔧 Updating ${profilesWithBadRoles.length} profiles with missing/invalid roles...`);
      
      for (const profile of profilesWithBadRoles) {
        const isAdminEmail = profile.email === 'admin@itwala.com';
        const newRole = isAdminEmail ? 'admin' : 'student';
        
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            role: newRole,
            updated_at: new Date().toISOString()
          })
          .eq('id', profile.id);

        if (updateError) {
          console.error(`❌ Failed to update role for ${profile.email}:`, updateError.message);
        } else {
          console.log(`✅ Updated role for ${profile.email} to: ${newRole}`);
        }
      }
    }

    // Step 6: Final verification
    console.log('\n📊 Final verification...');
    
    const { data: finalProfiles, error: finalError } = await supabase
      .from('profiles')
      .select('role, id')
      .order('created_at', { ascending: true });

    if (finalError) throw finalError;

    const roleCounts = finalProfiles.reduce((acc, profile) => {
      acc[profile.role] = (acc[profile.role] || 0) + 1;
      return acc;
    }, {});

    console.log('\n📈 Role distribution:');
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`  ${role}: ${count}`);
    });

    console.log(`\n✅ Total profiles: ${finalProfiles.length}`);
    console.log(`✅ Total confirmed users: ${users.users.filter(u => u.email_confirmed_at).length}`);
    
    if (finalProfiles.length === users.users.filter(u => u.email_confirmed_at).length) {
      console.log('🎉 All users now have profiles!');
    } else {
      console.log('⚠️  Some users still missing profiles - manual intervention may be needed');
    }

  } catch (error) {
    console.error('❌ Error fixing missing profiles:', error);
    process.exit(1);
  }
}

// Run the fix
fixMissingProfiles().then(() => {
  console.log('\n🏁 Profile fix completed');
  process.exit(0);
});