const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testProfileUpdate() {
  try {
    console.log('Testing profile update functionality...');
    
    // Test 1: Check if we can read profiles
    console.log('\n1. Testing profile read access...');
    const { data: profiles, error: readError } = await supabase
      .from('profiles')
      .select('id, full_name, phone')
      .limit(1);
    
    if (readError) {
      console.error('❌ Profile read error:', readError);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('❌ No profiles found');
      return;
    }
    
    console.log('✅ Profile read successful');
    console.log('Sample profile:', profiles[0]);
    
    // Test 2: Try direct profile update with service role
    console.log('\n2. Testing direct profile update with service role...');
    const testProfile = profiles[0];
    
    const { data: updateResult, error: updateError } = await supabase
      .from('profiles')
      .update({
        bio: 'Updated bio - ' + new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', testProfile.id)
      .select();
    
    if (updateError) {
      console.error('❌ Direct profile update error:', updateError);
    } else {
      console.log('✅ Direct profile update successful');
      console.log('Updated profile:', updateResult[0]);
    }
    
    // Test 3: Test the API endpoint locally (simulation)
    console.log('\n3. Testing API endpoint structure...');
    
    const mockProfileData = {
      fullName: 'Test User Updated',
      phone: '+91 9876543210',
      bio: 'Updated bio from API test',
      addressLine1: '456 Updated Street',
      addressLine2: 'Updated Area',
      city: 'Updated City',
      state: 'Karnataka',
      country: 'India',
      pincode: '560001',
      highestQualification: 'masters',
      degreeName: 'Computer Applications',
      hasLaptop: true
    };
    
    const { data: apiUpdateResult, error: apiUpdateError } = await supabase
      .from('profiles')
      .update({
        full_name: mockProfileData.fullName,
        phone: mockProfileData.phone,
        bio: mockProfileData.bio,
        address_line1: mockProfileData.addressLine1,
        address_line2: mockProfileData.addressLine2,
        city: mockProfileData.city,
        state: mockProfileData.state,
        country: mockProfileData.country,
        pincode: mockProfileData.pincode,
        highest_qualification: mockProfileData.highestQualification,
        degree_name: mockProfileData.degreeName,
        has_laptop: mockProfileData.hasLaptop,
        updated_at: new Date().toISOString()
      })
      .eq('id', testProfile.id)
      .select();
    
    if (apiUpdateError) {
      console.error('❌ API simulation update error:', apiUpdateError);
    } else {
      console.log('✅ API simulation update successful');
      console.log('API updated profile:', apiUpdateResult[0]);
    }
    
    console.log('\n✅ Profile update test completed!');
    console.log('📋 Next steps:');
    console.log('1. Apply the SQL permissions: fix-profile-table-permissions.sql');
    console.log('2. Test the profile settings page in the browser');
    console.log('3. Check that the API endpoint /api/profile/update works');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testProfileUpdate();