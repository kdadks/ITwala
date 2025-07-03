const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function fixEnrollmentTableStructure() {
  console.log('🔧 Fixing enrollment table structure and syncing data...\n');

  try {
    // Step 1: Check current enrollment table structure
    console.log('📊 Step 1: Checking current enrollment table structure...');
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('*')
      .limit(1);
    
    if (enrollmentsError) {
      console.error('❌ Error checking enrollments:', enrollmentsError);
      return;
    }

    console.log('✅ Enrollments table accessible');

    // Step 2: Sync missing enrollments manually
    console.log('\n📝 Step 2: Manually syncing missing enrollments...');
    
    // Get all students
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('role', 'student');
    
    if (studentsError) throw studentsError;
    console.log(`✅ Found ${students.length} students`);

    // Get existing enrollments
    const { data: existingEnrollments, error: existingError } = await supabase
      .from('enrollments')
      .select('user_id, course_id, status');
    
    if (existingError) throw existingError;
    console.log(`✅ Found ${existingEnrollments.length} existing enrollments`);

    // Get available courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, price, status')
      .eq('status', 'published')
      .order('price', { ascending: true });
    
    if (coursesError) throw coursesError;
    console.log(`✅ Found ${courses.length} published courses`);

    // Find students without enrollments
    const enrolledUserIds = new Set(existingEnrollments.map(e => e.user_id));
    const studentsWithoutEnrollments = students.filter(s => !enrolledUserIds.has(s.id));
    
    console.log(`🔍 Found ${studentsWithoutEnrollments.length} students without enrollments`);

    // Step 3: Create enrollments for students without them
    if (studentsWithoutEnrollments.length > 0 && courses.length > 0) {
      console.log('\n📝 Step 3: Creating enrollments for students...');
      
      // Use the cheapest course or first course
      const defaultCourse = courses[0];
      console.log(`Using default course: "${defaultCourse.title}" (Price: ${defaultCourse.price})`);

      // Create enrollments one by one to avoid schema issues
      for (const student of studentsWithoutEnrollments) {
        try {
          const { data: newEnrollment, error: insertError } = await supabase
            .from('enrollments')
            .insert({
              user_id: student.id,
              course_id: defaultCourse.id,
              enrolled_at: new Date().toISOString(),
              status: 'active',
              progress: 0
            })
            .select()
            .single();

          if (insertError) {
            console.error(`❌ Error enrolling ${student.email}:`, insertError.message);
          } else {
            console.log(`✅ Enrolled ${student.email} in "${defaultCourse.title}"`);
          }
        } catch (error) {
          console.error(`❌ Error enrolling ${student.email}:`, error.message);
        }
      }
    }

    // Step 4: Update course enrollment counts
    console.log('\n🔄 Step 4: Updating course enrollment counts...');
    
    // Get all enrollments grouped by course
    const { data: allEnrollments, error: allEnrollmentsError } = await supabase
      .from('enrollments')
      .select('course_id, status');
    
    if (allEnrollmentsError) throw allEnrollmentsError;

    // Count active enrollments per course
    const courseEnrollmentCounts = allEnrollments
      .filter(e => e.status === 'active')
      .reduce((acc, enrollment) => {
        acc[enrollment.course_id] = (acc[enrollment.course_id] || 0) + 1;
        return acc;
      }, {});

    console.log(`📊 Found enrollments for ${Object.keys(courseEnrollmentCounts).length} courses`);

    // Update each course's enrollment count
    for (const [courseId, count] of Object.entries(courseEnrollmentCounts)) {
      const { error: updateError } = await supabase
        .from('courses')
        .update({ 
          enrollments: count,
          students: count
        })
        .eq('id', courseId);
      
      if (updateError) {
        console.error(`❌ Error updating course ${courseId}:`, updateError.message);
      } else {
        console.log(`✅ Updated course with ${count} enrollments`);
      }
    }

    // Reset courses with no enrollments to 0
    const { error: resetError } = await supabase
      .from('courses')
      .update({ enrollments: 0, students: 0 })
      .not('id', 'in', `(${Object.keys(courseEnrollmentCounts).join(',')})`);

    if (resetError) {
      console.error('❌ Error resetting courses:', resetError.message);
    } else {
      console.log('✅ Reset courses with no enrollments');
    }

    // Step 5: Final verification
    console.log('\n🔍 Step 5: Final verification...');
    
    const { data: finalEnrollments, error: finalError } = await supabase
      .from('enrollments')
      .select('user_id, course_id, status');
    
    if (finalError) throw finalError;

    const { data: finalCourses, error: finalCoursesError } = await supabase
      .from('courses')
      .select('id, title, enrollments, students');
    
    if (finalCoursesError) throw finalCoursesError;

    const uniqueStudentsEnrolled = new Set(finalEnrollments.map(e => e.user_id)).size;
    const totalCourseEnrollments = finalCourses.reduce((sum, course) => sum + (course.enrollments || 0), 0);

    console.log('📊 Final Statistics:');
    console.log(`  Total students: ${students.length}`);
    console.log(`  Students with enrollments: ${uniqueStudentsEnrolled}`);
    console.log(`  Total enrollments: ${finalEnrollments.length}`);
    console.log(`  Total course enrollments: ${totalCourseEnrollments}`);
    console.log(`  Active enrollments: ${finalEnrollments.filter(e => e.status === 'active').length}`);

    if (uniqueStudentsEnrolled === students.length) {
      console.log('🎉 All students now have enrollments!');
    } else {
      console.log(`⚠️  ${students.length - uniqueStudentsEnrolled} students still need enrollments`);
    }

    if (totalCourseEnrollments === finalEnrollments.length) {
      console.log('🎉 Course enrollment counts are synchronized!');
    } else {
      console.log('⚠️  Course enrollment counts need adjustment');
    }

    // Step 6: Show course breakdown
    console.log('\n📚 Course Enrollment Breakdown:');
    const courseBreakdown = finalCourses
      .filter(c => c.enrollments > 0)
      .sort((a, b) => b.enrollments - a.enrollments);

    courseBreakdown.forEach(course => {
      console.log(`  ${course.title}: ${course.enrollments} students`);
    });

  } catch (error) {
    console.error('❌ Error fixing enrollment table:', error);
    process.exit(1);
  }
}

// Run the fix
fixEnrollmentTableStructure().then(() => {
  console.log('\n🏁 Enrollment table structure fix completed!');
  process.exit(0);
});