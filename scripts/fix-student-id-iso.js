/**
 * Script to fix student ID to use ISO codes on profiles table
 * Run with: node scripts/fix-student-id-iso.js
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
  return countries[countryName] || 'XX';
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
  
  return 'XX';
}

async function fixStudentIds() {
  console.log('========================================');
  console.log('Fix Student IDs to use ISO codes');
  console.log('========================================\n');

  const userId = 'dfd993d5-024d-4d62-adca-89a91e9a3147';

  // 1. Get the user's profile
  console.log('1. Fetching profile...');
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (profileError) {
    console.error('Error:', profileError);
    return;
  }

  console.log('   Name:', profile.full_name);
  console.log('   Country:', profile.country);
  console.log('   State:', profile.state);

  // 2. Clear old enrollment student_ids
  console.log('\n2. Clearing old enrollment student_ids...');
  const { data: enrollments } = await supabase
    .from('enrollments')
    .select('id, student_id')
    .eq('user_id', userId);

  console.log('   Found', enrollments?.length || 0, 'enrollment(s)');
  
  for (const e of enrollments || []) {
    if (e.student_id) {
      console.log('   Clearing:', e.student_id);
      await supabase.from('enrollments').update({ student_id: null }).eq('id', e.id);
    }
  }

  // 3. Generate new student ID with ISO codes
  console.log('\n3. Generating new student ID with ISO codes...');
  const countryCode = getCountryIsoCode(profile.country || 'India');
  const stateCode = getStateIsoCode(profile.state || '', countryCode);
  
  console.log('   Country ISO:', countryCode);
  console.log('   State ISO:', stateCode);

  // Generate using database function
  const { data: newStudentId, error: genError } = await supabase.rpc('generate_student_id', {
    country_code: countryCode,
    state_code: stateCode
  });

  let finalStudentId;
  if (genError) {
    console.log('   RPC failed, using fallback...');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    finalStudentId = `${countryCode}-${stateCode}-${year}-${month}-0001`;
  } else {
    finalStudentId = newStudentId;
  }

  console.log('   New Student ID:', finalStudentId);

  // 4. Update profile
  console.log('\n4. Updating profile with new student ID...');
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ student_id: finalStudentId })
    .eq('id', userId);

  if (updateError) {
    console.error('   Error:', updateError);
    return;
  }

  console.log('   ✅ Profile updated!');

  // 5. Verify
  console.log('\n5. Verifying...');
  const { data: updated } = await supabase
    .from('profiles')
    .select('full_name, student_id')
    .eq('id', userId)
    .single();

  console.log('   Student:', updated?.full_name);
  console.log('   Student ID:', updated?.student_id);

  console.log('\n========================================');
  console.log('✅ Done!');
  console.log('========================================');
}

fixStudentIds();
