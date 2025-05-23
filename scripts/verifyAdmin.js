const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function verifyAdmin() {
  try {
    // Create anonymous client first to test role change
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('1. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) {
      console.error('Sign in error:', signInError);
      return;
    }

    if (!signInData.user) {
      console.error('No user found after sign in');
      return;
    }

    console.log('Successfully signed in');
    console.log('User metadata:', signInData.user.user_metadata);

    // Now check profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return;
    }

    console.log('\nCurrent state:');
    console.log('- Profile:', profile);
    console.log('- User metadata:', signInData.user.user_metadata);
    console.log('- Session:', signInData.session ? 'Active' : 'None');

    // Create service role client for fixes if needed
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

    let needsFixing = false;

    if (!profile) {
      console.log('\nProfile missing - will create');
      needsFixing = true;
    } else if (profile.role !== 'admin') {
      console.log('\nProfile role incorrect - will fix');
      needsFixing = true;
    }

    if (!signInData.user.user_metadata?.role || signInData.user.user_metadata.role !== 'admin') {
      console.log('\nUser metadata incorrect - will fix');
      needsFixing = true;
    }

    if (needsFixing) {
      console.log('\nApplying fixes...');

      // Fix metadata first
      const { error: metadataError } = await adminClient.auth.admin.updateUserById(
        signInData.user.id,
        {
          user_metadata: { role: 'admin', full_name: 'Admin User' },
          email_confirm: true
        }
      );

      if (metadataError) {
        console.error('Error updating metadata:', metadataError);
        return;
      }

      // Then fix profile
      const { error: profileFixError } = await adminClient
        .from('profiles')
        .upsert({
          id: signInData.user.id,
          email: signInData.user.email,
          role: 'admin',
          full_name: 'Admin User',
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (profileFixError) {
        console.error('Error fixing profile:', profileFixError);
        return;
      }

      console.log('\nFixes applied successfully');
      console.log('\nPlease:');
      console.log('1. Sign out completely');
      console.log('2. Clear browser cache');
      console.log('3. Sign in again with:');
      console.log('   Email: admin@itwala.com');
      console.log('   Password: Admin@123');
    } else {
      console.log('\nAll good! Admin state is correct.');
      console.log('If you still cannot access admin features:');
      console.log('1. Sign out');
      console.log('2. Clear browser cache');
      console.log('3. Sign in again');
    }

  } catch (error) {
    console.error('Verification failed:', error);
  }
}

verifyAdmin();
