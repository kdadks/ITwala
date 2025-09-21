const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function resetAdminPassword() {
  const adminUserId = '7e843c10-6199-4846-a38e-12fac730e027';
  const adminEmail = 'admin@itwala.com';
  const newPassword = 'Admin@123';
  
  try {
    console.log('🔑 Resetting admin password...');
    
    // Update the admin user's password using admin API
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUserId,
      {
        password: newPassword,
        email_confirm: true // Ensure email is confirmed
      }
    );
    
    if (error) {
      console.error('❌ Error resetting password:', error);
      return;
    }
    
    console.log('✅ Admin password reset successfully!');
    
    // Test the login
    console.log('\n🧪 Testing login with new password...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: newPassword
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError);
      
      // Let's also try to check if the user is confirmed
      console.log('\n📧 Checking user confirmation status...');
      const { data: userData, error: userError } = await supabase.auth.admin.getUserById(adminUserId);
      if (userError) {
        console.error('Error getting user details:', userError);
      } else {
        console.log('User details:', {
          email: userData.user.email,
          email_confirmed_at: userData.user.email_confirmed_at,
          last_sign_in_at: userData.user.last_sign_in_at
        });
      }
    } else {
      console.log('✅ Login successful!');
      console.log('Session:', {
        user_id: loginData.user?.id,
        email: loginData.user?.email,
        role: loginData.user?.user_metadata?.role
      });
    }
    
    console.log('\n🎉 Admin credentials:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

resetAdminPassword();