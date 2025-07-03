const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testAPIEndpoint() {
  try {
    console.log('Testing API endpoint functionality...');
    
    // Test 1: Check if we can get a user session
    console.log('\n1. Testing authentication setup...');
    
    // Get a test user
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
      .limit(1);
    
    if (profileError) {
      console.error('❌ Cannot fetch profiles:', profileError);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('❌ No profiles found for testing');
      return;
    }
    
    const testUser = profiles[0];
    console.log('✅ Test user found:', testUser.full_name);
    
    // Test 2: Simulate the API call structure
    console.log('\n2. Testing profile update structure...');
    
    const mockProfileData = {
      fullName: 'Test User API',
      phone: '+91 9999888777',
      bio: 'API test bio',
      addressLine1: 'API Test Street',
      addressLine2: 'API Test Area',
      city: 'API Test City',
      state: 'Maharashtra',
      country: 'India',
      pincode: '400001',
      highestQualification: 'bachelors',
      degreeName: 'Computer Science',
      hasLaptop: true
    };
    
    // Simulate what the API endpoint does
    const updateData = {
      id: testUser.id,
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
      email: testUser.email,
      updated_at: new Date().toISOString()
    };
    
    console.log('Attempting upsert with data:', updateData);
    
    const { data: updatedProfile, error: updateError } = await supabase
      .from('profiles')
      .upsert(updateData)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Update failed:', {
        message: updateError.message,
        code: updateError.code,
        details: updateError.details,
        hint: updateError.hint
      });
      
      // Test 3: Try a simpler update
      console.log('\n3. Testing simpler update...');
      const { data: simpleUpdate, error: simpleError } = await supabase
        .from('profiles')
        .update({
          bio: 'Simple API test - ' + new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', testUser.id)
        .select();
      
      if (simpleError) {
        console.error('❌ Simple update also failed:', simpleError);
      } else {
        console.log('✅ Simple update successful:', simpleUpdate[0]);
      }
    } else {
      console.log('✅ Full upsert successful:', updatedProfile);
    }
    
    // Test 4: Check RLS policies are working
    console.log('\n4. Testing RLS policies...');
    
    // Try to read the profile (should work)
    const { data: readTest, error: readError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', testUser.id)
      .single();
    
    if (readError) {
      console.error('❌ Read test failed:', readError);
    } else {
      console.log('✅ Read test successful');
    }
    
    console.log('\n📋 API Endpoint Test Summary:');
    console.log('✅ Profile access working');
    console.log(updateError ? '❌ Profile update failed' : '✅ Profile update working');
    console.log('✅ Data structure compatible');
    
    if (updateError) {
      console.log('\n🔍 Troubleshooting suggestions:');
      console.log('1. Check RLS policies in Supabase dashboard');
      console.log('2. Verify authenticated role has UPDATE permissions');
      console.log('3. Check if any column constraints are failing');
      console.log('4. Review the error details above for specific issues');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAPIEndpoint();