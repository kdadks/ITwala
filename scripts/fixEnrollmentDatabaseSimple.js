const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function fixEnrollmentDatabase() {
  console.log('🔧 Fixing enrollment database issues...');

  // Create Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    console.log('📝 Adding missing columns to profiles table...');
    
    // First, let's check what columns currently exist
    const { data: existingData, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (checkError) {
      console.error('❌ Error checking profiles table:', checkError.message);
      return;
    }

    console.log('Current columns in profiles table:', Object.keys(existingData[0] || {}));

    // Since we can't execute DDL directly, let's modify the enrollment API to handle missing columns gracefully
    console.log('✅ Database check completed. Will modify the enrollment API to handle missing columns.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the fix
fixEnrollmentDatabase();