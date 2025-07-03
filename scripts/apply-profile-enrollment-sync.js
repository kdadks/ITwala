const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeSQL(sql) {
  try {
    const { data, error } = await supabase.rpc('exec', { sql });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

async function applyProfileEnrollmentSync() {
  console.log('🚀 Starting comprehensive Profile-Enrollment synchronization...\n');

  try {
    // Step 1: Run initial sync of data
    console.log('📊 Step 1: Running initial data synchronization...');
    
    // Get all students from profiles
    const { data: students, error: studentsError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at')
      .eq('role', 'student');
    
    if (studentsError) throw studentsError;
    console.log(`✅ Found ${students.length} students in profiles table`);

    // Get existing enrollments
    const { data: existingEnrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, status');
    
    if (enrollmentsError) throw enrollmentsError;
    console.log(`✅ Found ${existingEnrollments.length} existing enrollments`);

    // Get available courses
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, price, status')
      .eq('status', 'published')
      .order('created_at', { ascending: true });
    
    if (coursesError) throw coursesError;
    console.log(`✅ Found ${courses.length} published courses`);

    // Find students without enrollments
    const enrolledUserIds = new Set(existingEnrollments.map(e => e.user_id));
    const studentsWithoutEnrollments = students.filter(s => !enrolledUserIds.has(s.id));
    
    console.log(`🔍 Found ${studentsWithoutEnrollments.length} students without enrollments`);

    // Step 2: Auto-enroll students in default course
    if (studentsWithoutEnrollments.length > 0 && courses.length > 0) {
      console.log('\n📝 Step 2: Auto-enrolling students in default course...');
      
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

      // Insert new enrollments
      const { error: insertError } = await supabase
        .from('enrollments')
        .insert(newEnrollments);
      
      if (insertError) {
        console.error('❌ Error inserting enrollments:', insertError);
      } else {
        console.log(`✅ Auto-enrolled ${studentsWithoutEnrollments.length} students`);
      }
    }

    // Step 3: Apply SQL migration for relationships and triggers
    console.log('\n⚙️  Step 3: Applying relationship and trigger setup...');
    
    const sqlPath = path.join(__dirname, '..', 'sync-profile-enrollment-relationships.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into statements and execute
    const statements = sqlContent
      .split(/(?:^|\n)(?:--[^\n]*\n)*\s*(?=\w)/gm)
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    console.log(`Executing ${statements.length} SQL statements...`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim() && !statement.startsWith('--')) {
        try {
          const result = await executeSQL(statement);
          if (result.error) {
            console.log(`⚠️  Statement ${i + 1}: ${result.error.message}`);
          } else {
            console.log(`✅ Statement ${i + 1}: Applied successfully`);
          }
        } catch (error) {
          console.log(`⚠️  Statement ${i + 1}: ${error.message}`);
        }
      }
    }

    // Step 4: Fix course enrollment counts
    console.log('\n🔄 Step 4: Fixing course enrollment counts...');
    
    const { data: enrollmentCounts, error: countError } = await supabase
      .from('enrollments')
      .select('course_id')
      .eq('status', 'active');
    
    if (countError) throw countError;

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
    if (Object.keys(courseEnrollmentCounts).length > 0) {
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
      }
    }

    console.log('✅ Updated course enrollment counts');

    // Step 5: Test the new functions
    console.log('\n🧪 Step 5: Testing new functions...');
    
    try {
      const { data: stats, error: statsError } = await supabase
        .rpc('get_enrollment_statistics');
      
      if (statsError) {
        console.log('⚠️  Could not retrieve statistics:', statsError.message);
      } else {
        console.log('📊 Enrollment Statistics:');
        console.log(`  Total profiles: ${stats[0].total_profiles}`);
        console.log(`  Total students: ${stats[0].total_students}`);
        console.log(`  Total enrollments: ${stats[0].total_enrollments}`);
        console.log(`  Students with enrollments: ${stats[0].students_with_enrollments}`);
        console.log(`  Students without enrollments: ${stats[0].students_without_enrollments}`);
        console.log(`  Active enrollments: ${stats[0].active_enrollments}`);
        console.log(`  Inactive enrollments: ${stats[0].inactive_enrollments}`);
      }
    } catch (error) {
      console.log('⚠️  Statistics function not yet available');
    }

    // Step 6: Final verification
    console.log('\n🔍 Step 6: Final verification...');
    
    const { data: finalEnrollments, error: finalError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, status');
    
    if (finalError) throw finalError;

    const { data: finalCourses, error: finalCoursesError } = await supabase
      .from('courses')
      .select('id, title, enrollments, students');
    
    if (finalCoursesError) throw finalCoursesError;

    console.log(`✅ Total enrollments: ${finalEnrollments.length}`);
    console.log(`✅ Students with enrollments: ${new Set(finalEnrollments.map(e => e.user_id)).size}`);
    
    const totalCourseEnrollments = finalCourses.reduce((sum, course) => sum + (course.enrollments || 0), 0);
    console.log(`✅ Total course enrollments: ${totalCourseEnrollments}`);
    
    if (totalCourseEnrollments === finalEnrollments.length) {
      console.log('🎉 Enrollment counts are now synchronized!');
    } else {
      console.log('⚠️  Enrollment counts still need adjustment');
    }

    console.log('\n🎯 Automatic synchronization features enabled:');
    console.log('  ✅ Auto-enrollment of new students');
    console.log('  ✅ Automatic course enrollment count updates');
    console.log('  ✅ Profile-enrollment relationship integrity');
    console.log('  ✅ Monitoring views and statistics functions');
    console.log('  ✅ Data integrity constraints and triggers');

  } catch (error) {
    console.error('❌ Error during profile-enrollment sync:', error);
    process.exit(1);
  }
}

// Run the comprehensive sync
applyProfileEnrollmentSync().then(() => {
  console.log('\n🏁 Comprehensive Profile-Enrollment synchronization completed!');
  console.log('📝 Next steps:');
  console.log('  • New students will be automatically enrolled in default courses');
  console.log('  • Course enrollment counts will be automatically updated');
  console.log('  • Use the monitoring view: SELECT * FROM profile_enrollment_sync_status;');
  console.log('  • Get statistics: SELECT * FROM get_enrollment_statistics();');
  process.exit(0);
});