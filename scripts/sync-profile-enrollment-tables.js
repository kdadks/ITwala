const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncProfileEnrollmentTables() {
  console.log('🔄 Syncing Profile and Enrollment Tables...\n');

  try {
    // Step 1: Get all students from profiles
    console.log('📊 Step 1: Fetching students from profiles table...');
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('role', 'student');
    
    if (studentsError) throw studentsError;
    console.log(`✅ Found ${students.length} students in profiles table`);

    // Step 2: Get existing enrollments
    console.log('\n📊 Step 2: Fetching existing enrollments...');
    const { data: existingEnrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, status');
    
    if (enrollmentsError) throw enrollmentsError;
    console.log(`✅ Found ${existingEnrollments.length} existing enrollments`);

    // Step 3: Get available courses
    console.log('\n📊 Step 3: Fetching available courses...');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, price, status')
      .eq('status', 'published')
      .order('created_at', { ascending: true });
    
    if (coursesError) throw coursesError;
    console.log(`✅ Found ${courses.length} published courses`);

    // Step 4: Find students without enrollments
    const enrolledUserIds = new Set(existingEnrollments.map(e => e.user_id));
    const studentsWithoutEnrollments = students.filter(s => !enrolledUserIds.has(s.id));
    
    console.log(`\n🔍 Found ${studentsWithoutEnrollments.length} students without enrollments`);

    // Step 5: Auto-enroll students in a default course (pick first free course or first course)
    if (studentsWithoutEnrollments.length > 0 && courses.length > 0) {
      console.log('\n📝 Step 5: Auto-enrolling students in default courses...');
      
      // Find a free course or use the first course
      const defaultCourse = courses.find(c => c.price === 0) || courses[0];
      console.log(`Using default course: "${defaultCourse.title}" (Price: ${defaultCourse.price})`);

      const newEnrollments = studentsWithoutEnrollments.map(student => ({
        user_id: student.id,
        course_id: defaultCourse.id,
        enrolled_at: new Date().toISOString(),
        status: 'active',
        progress: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      // Insert new enrollments in batches
      for (let i = 0; i < newEnrollments.length; i += 100) {
        const batch = newEnrollments.slice(i, i + 100);
        const { error: insertError } = await supabase
          .from('enrollments')
          .insert(batch);
        
        if (insertError) {
          console.error(`❌ Error inserting batch ${i / 100 + 1}:`, insertError);
        } else {
          console.log(`✅ Inserted enrollment batch ${i / 100 + 1} (${batch.length} enrollments)`);
        }
      }

      console.log(`✅ Auto-enrolled ${studentsWithoutEnrollments.length} students in "${defaultCourse.title}"`);
    }

    // Step 6: Fix course enrollment counts
    console.log('\n🔄 Step 6: Fixing course enrollment counts...');
    
    // Get updated enrollment counts
    const { data: enrollmentCounts, error: countError } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('status', 'active');
    
    if (countError) throw countError;

    // Count enrollments per course
    const courseEnrollmentCounts = enrollmentCounts.reduce((acc, enrollment) => {
      acc[enrollment.course_id] = (acc[enrollment.course_id] || 0) + 1;
      return acc;
    }, {});

    // Update course enrollment counts
    for (const [courseId, count] of Object.entries(courseEnrollmentCounts)) {
      const { error: updateError } = await supabase
        .from('courses')
        .update({ 
          enrollments: count,
          students: count,
          updated_at: new Date().toISOString()
        })
        .eq('id', courseId);
      
      if (updateError) {
        console.error(`❌ Error updating course ${courseId}:`, updateError);
      }
    }

    // Reset courses with no enrollments
    const { error: resetError } = await supabase
      .from('courses')
      .update({ 
        enrollments: 0,
        students: 0,
        updated_at: new Date().toISOString()
      })
      .not('id', 'in', `(${Object.keys(courseEnrollmentCounts).join(',')})`);

    if (resetError) {
      console.error('❌ Error resetting courses with no enrollments:', resetError);
    } else {
      console.log('✅ Updated course enrollment counts');
    }

    // Step 7: Verification
    console.log('\n🔍 Step 7: Final verification...');
    
    const { data: finalEnrollments, error: finalError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, status');
    
    if (finalError) throw finalError;

    const { data: finalCourses, error: finalCoursesError } = await supabase
      .from('courses')
      .select('id, title, enrollments, students');
    
    if (finalCoursesError) throw finalCoursesError;

    console.log(`✅ Total enrollments now: ${finalEnrollments.length}`);
    console.log(`✅ Students with enrollments: ${new Set(finalEnrollments.map(e => e.user_id)).size}`);
    
    const totalCourseEnrollments = finalCourses.reduce((sum, course) => sum + (course.enrollments || 0), 0);
    console.log(`✅ Total course enrollments: ${totalCourseEnrollments}`);
    
    if (totalCourseEnrollments === finalEnrollments.length) {
      console.log('🎉 Enrollment counts are now synchronized!');
    } else {
      console.log('⚠️  Enrollment counts still need adjustment');
    }

  } catch (error) {
    console.error('❌ Error syncing profile-enrollment tables:', error);
    process.exit(1);
  }
}

// Run the sync
syncProfileEnrollmentTables().then(() => {
  console.log('\n🏁 Profile-Enrollment sync completed');
  process.exit(0);
});