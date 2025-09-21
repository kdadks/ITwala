const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function updateAdminMetadata() {
  const adminUserId = '7e843c10-6199-4846-a38e-12fac730e027';
  
  try {
    console.log('🔧 Updating admin user metadata...');
    
    // Update the admin user's metadata to include the role
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUserId,
      {
        user_metadata: {
          role: 'admin',
          full_name: 'Admin User'
        }
      }
    );
    
    if (error) {
      console.error('❌ Error updating metadata:', error);
      return;
    }
    
    console.log('✅ Admin user metadata updated successfully!');
    console.log('Updated user:', {
      id: data.user.id,
      email: data.user.email,
      user_metadata: data.user.user_metadata
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateAdminMetadata();