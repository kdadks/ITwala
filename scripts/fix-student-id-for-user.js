/**
 * Script to generate student ID for a specific user's profile (1:1 with student)
 * Run with: node scripts/fix-student-id-for-user.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// User ID to fix
const USER_ID = 'dfd993d5-024d-4d62-adca-89a91e9a3147';

async function fixStudentId() {
  console.log('========================================');
  console.log('Fix Student ID for User Profile');
  console.log('(1:1 relationship - one ID per student)');
  console.log('========================================\n');
  console.log('User ID:', USER_ID, '\n');

  try {
    // 1. Fetch the profile to get country/state and check existing student_id
    console.log('1. Fetching profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', USER_ID)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      process.exit(1);
    }

    console.log('   Profile found:', profile.full_name || profile.email);
    console.log('   Country:', profile.country || 'Not set');
    console.log('   State:', profile.state || 'Not set');
    console.log('   Current Student ID:', profile.student_id || 'NONE');

    if (profile.student_id) {
      console.log('\n✅ Profile already has student ID:', profile.student_id);
      console.log('No action needed.');
      process.exit(0);
    }

    // 2. Check if there are enrollments
    console.log('\n2. Checking enrollments...');
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select('id, course_id')
      .eq('user_id', USER_ID);

    if (enrollError) {
      console.error('Error fetching enrollments:', enrollError);
    } else {
      console.log('   Found', enrollments?.length || 0, 'enrollment(s)');
    }

    // 3. Generate student ID for profile
    console.log('\n3. Generating student ID...');
    
    // Default codes if not set (using ISO codes)
    const countryCode = getCountryIsoCode(profile.country || 'India');
    const stateCode = getStateIsoCode(profile.state || '', countryCode);

    let studentId = null;

    // Try using database function
    const { data: generatedId, error: genError } = await supabase
      .rpc('generate_student_id', {
        country_code: countryCode,
        state_code: stateCode
      });

    if (genError) {
      console.log('   RPC failed, generating fallback ID...');
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      studentId = `${countryCode}-${stateCode}-${year}-${month}-0001`;
    } else {
      studentId = generatedId;
    }

    console.log('   Generated ID:', studentId);

    // 4. Update profile with student ID
    console.log('\n4. Updating profile with student ID...');
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ student_id: studentId })
      .eq('id', USER_ID);

    if (updateError) {
      console.error('   ❌ Error updating profile:', updateError);
      process.exit(1);
    }

    console.log('   ✅ Profile updated successfully');

    // 5. Verify the fix
    console.log('\n5. Verifying fix...');
    const { data: updatedProfile } = await supabase
      .from('profiles')
      .select('full_name, student_id')
      .eq('id', USER_ID)
      .single();

    console.log('   Student:', updatedProfile.full_name);
    console.log('   Student ID:', updatedProfile.student_id);

    console.log('\n========================================');
    console.log('✅ Done!');
    console.log('========================================');

  } catch (error) {
    console.error('Unexpected error:', error);
    process.exit(1);
  }
}

// Helper functions for ISO codes
function getCountryIsoCode(countryName) {
  const countries = {
    'India': 'IN',
    'United States': 'US',
    'United Kingdom': 'GB',
    'Canada': 'CA',
    'Australia': 'AU',
    'Germany': 'DE',
    'France': 'FR',
  };
  return countries[countryName] || countryName?.substring(0, 2)?.toUpperCase() || 'XX';
}

function getStateIsoCode(stateName, countryCode) {
  const indianStates = {
    'Andhra Pradesh': 'AP',
    'Karnataka': 'KA',
    'Maharashtra': 'MH',
    'Tamil Nadu': 'TN',
    'Kerala': 'KL',
    'Telangana': 'TG',
    'Gujarat': 'GJ',
    'Rajasthan': 'RJ',
    'Delhi': 'DL',
    'Uttar Pradesh': 'UP',
    'West Bengal': 'WB',
    'Punjab': 'PB',
    'Haryana': 'HR',
    'Bihar': 'BR',
    'Odisha': 'OR',
    'Madhya Pradesh': 'MP',
    'Assam': 'AS',
    'Jharkhand': 'JH',
    'Chhattisgarh': 'CG',
    'Uttarakhand': 'UK',
    'Himachal Pradesh': 'HP',
    'Goa': 'GA',
  };

  if (countryCode === 'IN' && indianStates[stateName]) {
    return indianStates[stateName];
  }
  
  return stateName?.substring(0, 2)?.toUpperCase() || 'XX';
}

fixStudentId();
