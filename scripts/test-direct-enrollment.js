const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function testDirectEnrollment() {
  try {
    console.log('Testing direct enrollment functionality...');
    
    // Test 1: Check if we can query enrollments table
    console.log('\n1. Testing enrollments table access...');
    const { data: enrollments, error: enrollmentError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id')
      .limit(5);
    
    if (enrollmentError) {
      console.error('Error accessing enrollments:', enrollmentError);
    } else {
      console.log('✅ Enrollments table accessible');
      console.log('Sample enrollments:', enrollments);
    }
    
    // Test 2: Check if we can query profiles table
    console.log('\n2. Testing profiles table access...');
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('id, full_name, phone, address_line1, city, state')
      .limit(5);
    
    if (profileError) {
      console.error('Error accessing profiles:', profileError);
    } else {
      console.log('✅ Profiles table accessible');
      console.log('Sample profiles:', profiles);
    }
    
    // Test 3: Check if we can query courses table
    console.log('\n3. Testing courses table access...');
    const { data: courses, error: courseError } = await supabase
      .from('courses')
      .select('id, title, price')
      .limit(5);
    
    if (courseError) {
      console.error('Error accessing courses:', courseError);
    } else {
      console.log('✅ Courses table accessible');
      console.log('Sample courses:', courses);
    }
    
    // Test 4: Check for users with previous enrollments and complete profiles
    console.log('\n4. Testing users eligible for direct enrollment...');
    const { data: eligibleUsers, error: eligibleError } = await supabase
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
      .not('full_name', 'is', null)
      .not('phone', 'is', null)
      .not('address_line1', 'is', null)
      .not('city', 'is', null)
      .not('state', 'is', null);
    
    if (eligibleError) {
      console.error('Error checking eligible users:', eligibleError);
    } else {
      console.log('✅ Found users eligible for direct enrollment:');
      console.log('Eligible users count:', eligibleUsers?.length || 0);
      if (eligibleUsers && eligibleUsers.length > 0) {
        console.log('Sample eligible user:', eligibleUsers[0]);
      }
    }
    
    console.log('\n✅ Direct enrollment test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testDirectEnrollment();