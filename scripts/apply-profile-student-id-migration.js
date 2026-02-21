/**
 * Script to apply the student_id migration to profiles table
 * This moves student_id from enrollments (per-course) to profiles (per-student)
 * Run with: node scripts/apply-profile-student-id-migration.js
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

async function applyMigration() {
  console.log('========================================');
  console.log('Student ID Migration - Profiles Table');
  console.log('========================================\n');
  console.log('This script adds student_id column to profiles');
  console.log('(1:1 relationship - one ID per student)\n');

  try {
    // Step 1: Check if column already exists
    console.log('1. Checking if student_id column exists...');
    const { data: checkData, error: checkError } = await supabase
      .from('profiles')
      .select('student_id')
      .limit(1);

    if (!checkError) {
      console.log('   ✅ Column already exists');
    } else if (checkError.message.includes('student_id')) {
      console.log('   Column does not exist, creating...');
      
      // Use direct SQL via RPC or REST
      // Since we can't run raw SQL directly, we'll use a workaround
      // The user needs to run the SQL in Supabase dashboard
      console.log('\n   ⚠️  Please run this SQL in Supabase Dashboard:');
      console.log('   ----------------------------------------');
      console.log('   ALTER TABLE profiles');
      console.log('   ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;');
      console.log('   ----------------------------------------\n');
      console.log('   After running the SQL, run this script again.\n');
      process.exit(0);
    }

    // Step 2: Migrate existing student IDs from enrollments to profiles
    console.log('\n2. Migrating existing student IDs from enrollments...');
    
    // Get all unique users with enrollments that have student_id
    const { data: enrollmentsWithIds, error: enrollError } = await supabase
      .from('enrollments')
      .select('user_id, student_id')
      .not('student_id', 'is', null)
      .order('enrolled_at', { ascending: true });

    if (enrollError) {
      console.log('   Error fetching enrollments:', enrollError.message);
    } else if (enrollmentsWithIds && enrollmentsWithIds.length > 0) {
      console.log(`   Found ${enrollmentsWithIds.length} enrollment(s) with student IDs`);
      
      // Group by user_id and take the first (oldest) student_id
      const userStudentIds = {};
      for (const e of enrollmentsWithIds) {
        if (!userStudentIds[e.user_id]) {
          userStudentIds[e.user_id] = e.student_id;
        }
      }

      console.log(`   Unique users: ${Object.keys(userStudentIds).length}`);

      // Update profiles with student IDs
      let updated = 0;
      for (const [userId, studentId] of Object.entries(userStudentIds)) {
        // Check if profile already has a student_id
        const { data: profile } = await supabase
          .from('profiles')
          .select('student_id')
          .eq('id', userId)
          .single();

        if (profile && !profile.student_id) {
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ student_id: studentId })
            .eq('id', userId);

          if (!updateError) {
            updated++;
            console.log(`   ✅ Migrated: ${userId} -> ${studentId}`);
          }
        }
      }

      console.log(`   Total migrated: ${updated}`);
    } else {
      console.log('   No existing student IDs to migrate');
    }

    // Step 3: Generate student IDs for profiles without one (students only)
    console.log('\n3. Generating student IDs for enrolled students without one...');
    
    // Get all enrolled users without student_id on their profile
    const { data: profilesWithoutId, error: profilesError } = await supabase
      .from('profiles')
      .select('id, full_name, country, state, student_id, role')
      .is('student_id', null)
      .eq('role', 'student');

    if (profilesError) {
      console.log('   Error fetching profiles:', profilesError.message);
    } else if (profilesWithoutId && profilesWithoutId.length > 0) {
      console.log(`   Found ${profilesWithoutId.length} student profile(s) without student ID`);
      
      for (const profile of profilesWithoutId) {
        // Check if this user has any enrollment
        const { data: hasEnrollment } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', profile.id)
          .limit(1);

        if (hasEnrollment && hasEnrollment.length > 0) {
          // Generate student ID
          const countryCode = getCountryIsoCode(profile.country || 'India');
          const stateCode = getStateIsoCode(profile.state || '', countryCode);

          const { data: studentId, error: genError } = await supabase
            .rpc('generate_student_id', {
              country_code: countryCode,
              state_code: stateCode
            });

          if (!genError && studentId) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ student_id: studentId })
              .eq('id', profile.id);

            if (!updateError) {
              console.log(`   ✅ Generated: ${profile.full_name || profile.id} -> ${studentId}`);
            }
          }
        }
      }
    } else {
      console.log('   All student profiles have student IDs');
    }

    console.log('\n========================================');
    console.log('✅ Migration Complete!');
    console.log('========================================');

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Helper functions
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

applyMigration();
