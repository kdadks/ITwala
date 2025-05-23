const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function resetProfiles() {
  try {
    // Sign in first to get full permissions
    console.log('1. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) throw signInError;

    // Create admin profile
    console.log('\n2. Creating admin profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: signInData.user.id,
        email: signInData.user.email,
        role: 'admin',
        full_name: 'Admin User',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();

    if (profileError) {
      console.error('Profile error:', profileError);
      
      // If table doesn't exist, try to create it
      if (profileError.message.includes('does not exist')) {
        console.log('\nCreating profiles table...');
        const { error: createError } = await supabase.rpc('create_profiles_table');
        if (createError) throw createError;
        
        // Try creating profile again
        console.log('\nRetrying profile creation...');
        const { data: retryProfile, error: retryError } = await supabase
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
          
        if (retryError) throw retryError;
        console.log('Profile created successfully:', retryProfile);
      } else {
        throw profileError;
      }
    } else {
      console.log('Profile updated successfully:', profile);
    }

    // Verify session and role are correct
    console.log('\n3. Verifying session...');
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) throw sessionError;

    console.log('Session Info:', {
      userId: session?.user?.id,
      email: session?.user?.email,
      role: session?.user?.user_metadata?.role
    });

    // Update user metadata
    console.log('\n4. Updating user metadata...');
    const { error: updateError } = await supabase.auth.updateUser({
      data: { role: 'admin' }
    });

    if (updateError) throw updateError;
    console.log('User metadata updated successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

resetProfiles();
