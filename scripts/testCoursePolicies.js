// Test RLS and policies for courses table
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase admin client with service role key
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

async function testCoursePolicies() {
  try {
    console.log('1. Checking RLS status on courses table...');
    const { data: rlsData, error: rlsError } = await supabase.rpc('check_rls_enabled', {
      table_name: 'courses'
    });
    
    if (rlsError) {
      console.error('Error checking RLS:', rlsError);
      return;
    }
    console.log('RLS enabled:', rlsData);

    console.log('\n2. Checking existing policies on courses table...');
    const { data: policies, error: policiesError } = await supabase
      .from('pg_policies')
      .select('*')
      .eq('tablename', 'courses');

    if (policiesError) {
      console.error('Error checking policies:', policiesError);
      return;
    }
    console.log('Current policies:', policies);

    console.log('\n3. Testing admin access with service role...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .limit(1);

    if (coursesError) {
      console.error('Error checking courses:', coursesError);
      return;
    }
    console.log('Sample course data:', courses);

  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

testCoursePolicies();
