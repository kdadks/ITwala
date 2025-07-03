const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function createTestProfileData() {
  try {
    console.log('Creating test profile data for direct enrollment...');
    
    // Find a user who has enrollments but incomplete profile
    const { data: usersWithEnrollments, error: fetchError } = await supabase
      .from('profiles')
      .select(`
        id, 
        full_name, 
        phone, 
        address_line1, 
        city, 
        state,
        enrollments!inner(id)
      `)
      .limit(1);
    
    if (fetchError) {
      console.error('Error fetching users:', fetchError);
      return;
    }
    
    if (!usersWithEnrollments || usersWithEnrollments.length === 0) {
      console.log('No users with enrollments found');
      return;
    }
    
    const testUser = usersWithEnrollments[0];
    console.log('Found test user:', testUser.full_name, '(ID:', testUser.id, ')');
    
    // Update their profile with complete information
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .update({
        phone: '+91 9876543210',
        address_line1: '123 Test Street',
        address_line2: 'Near Test Park',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
        pincode: '400001',
        highest_qualification: 'bachelors',
        degree_name: 'Computer Science',
        has_laptop: true
      })
      .eq('id', testUser.id)
      .select();
    
    if (updateError) {
      console.error('Error updating profile:', updateError);
      return;
    }
    
    console.log('✅ Successfully updated profile for user:', testUser.full_name);
    console.log('Updated profile:', updatedProfile[0]);
    
    // Verify the update worked
    const { data: verifyProfile, error: verifyError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, address_line1, city, state')
      .eq('id', testUser.id)
      .single();
    
    if (verifyError) {
      console.error('Error verifying profile:', verifyError);
      return;
    }
    
    console.log('✅ Profile verification successful:');
    console.log('- Full Name:', verifyProfile.full_name);
    console.log('- Phone:', verifyProfile.phone);
    console.log('- Address:', verifyProfile.address_line1);
    console.log('- City:', verifyProfile.city);
    console.log('- State:', verifyProfile.state);
    
    console.log('\n🎉 Test data created successfully!');
    console.log('Now when user', testUser.full_name, 'tries to enroll in a new course,');
    console.log('they should see the direct enrollment option.');
    
  } catch (error) {
    console.error('❌ Error creating test profile data:', error);
  }
}

createTestProfileData();