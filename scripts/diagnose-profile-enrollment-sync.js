const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function diagnoseProfileEnrollmentSync() {
  console.log('🔍 Diagnosing Profile-Enrollment Synchronization Issues...\n');

  try {
    // Step 1: Check profiles table
    console.log('📊 PROFILES TABLE ANALYSIS:');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email, role, created_at');
    
    if (profilesError) {
      console.error('❌ Error fetching profiles:', profilesError);
      return;
    }

    const roleCounts = profiles.reduce((acc, profile) => {
      acc[profile.role] = (acc[profile.role] || 0) + 1;
      return acc;
    }, {});

    console.log(`  Total profiles: ${profiles.length}`);
    console.log('  Role distribution:');
    Object.entries(roleCounts).forEach(([role, count]) => {
      console.log(`    ${role}: ${count}`);
    });

    // Step 2: Check enrollments table
    console.log('\n📊 ENROLLMENTS TABLE ANALYSIS:');
    const { data: enrollments, error: enrollmentsError } = await supabase
      .from('enrollments')
      .select('id, user_id, course_id, status, enrolled_at');
    
    if (enrollmentsError) {
      console.error('❌ Error fetching enrollments:', enrollmentsError);
      return;
    }

    console.log(`  Total enrollments: ${enrollments.length}`);
    
    const statusCounts = enrollments.reduce((acc, enrollment) => {
      acc[enrollment.status] = (acc[enrollment.status] || 0) + 1;
      return acc;
    }, {});

    console.log('  Status distribution:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`    ${status}: ${count}`);
    });

    // Step 3: Check relationship integrity
    console.log('\n🔗 RELATIONSHIP INTEGRITY CHECK:');
    
    // Find students without enrollments
    const studentsWithProfiles = profiles.filter(p => p.role === 'student');
    const enrolledUserIds = new Set(enrollments.map(e => e.user_id));
    const studentsWithoutEnrollments = studentsWithProfiles.filter(s => !enrolledUserIds.has(s.id));

    console.log(`  Students with profiles: ${studentsWithProfiles.length}`);
    console.log(`  Students with enrollments: ${enrollments.length}`);
    console.log(`  Students without enrollments: ${studentsWithoutEnrollments.length}`);

    if (studentsWithoutEnrollments.length > 0) {
      console.log('\n📋 STUDENTS WITHOUT ENROLLMENTS:');
      studentsWithoutEnrollments.slice(0, 10).forEach(student => {
        console.log(`    ${student.email} (${student.id})`);
      });
      if (studentsWithoutEnrollments.length > 10) {
        console.log(`    ... and ${studentsWithoutEnrollments.length - 10} more`);
      }
    }

    // Step 4: Check for orphaned enrollments
    const profileIds = new Set(profiles.map(p => p.id));
    const orphanedEnrollments = enrollments.filter(e => !profileIds.has(e.user_id));

    if (orphanedEnrollments.length > 0) {
      console.log('\n⚠️  ORPHANED ENROLLMENTS (enrollments without profiles):');
      orphanedEnrollments.forEach(enrollment => {
        console.log(`    Enrollment ID: ${enrollment.id}, User ID: ${enrollment.user_id}`);
      });
    }

    // Step 5: Check auth.users vs profiles
    console.log('\n👥 AUTH.USERS vs PROFILES COMPARISON:');
    const { data: authUsers, error: usersError } = await supabase.auth.admin.listUsers();
    if (usersError) {
      console.error('❌ Error fetching auth users:', usersError);
      return;
    }

    const confirmedUsers = authUsers.users.filter(u => u.email_confirmed_at);
    console.log(`  Confirmed users in auth.users: ${confirmedUsers.length}`);
    console.log(`  Profiles in profiles table: ${profiles.length}`);

    // Step 6: Check courses table
    console.log('\n📚 COURSES TABLE ANALYSIS:');
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('id, title, enrollments, students');
    
    if (coursesError) {
      console.error('❌ Error fetching courses:', coursesError);
    } else {
      console.log(`  Total courses: ${courses.length}`);
      const totalEnrollmentsFromCourses = courses.reduce((sum, course) => sum + (course.enrollments || 0), 0);
      console.log(`  Total enrollments (from courses table): ${totalEnrollmentsFromCourses}`);
      console.log(`  Total enrollments (from enrollments table): ${enrollments.length}`);
      
      if (totalEnrollmentsFromCourses !== enrollments.length) {
        console.log('  ⚠️  MISMATCH: Course enrollment counts don\'t match enrollment table!');
      }
    }

    console.log('\n✅ Diagnosis complete!');
    
    // Summary and recommendations
    console.log('\n📝 SUMMARY & RECOMMENDATIONS:');
    if (studentsWithoutEnrollments.length > 0) {
      console.log(`  🔸 Found ${studentsWithoutEnrollments.length} students without enrollments`);
      console.log('  🔸 These students should be enrolled in default/trial courses');
    }
    
    if (orphanedEnrollments.length > 0) {
      console.log(`  🔸 Found ${orphanedEnrollments.length} orphaned enrollments`);
      console.log('  🔸 These enrollments should be cleaned up or linked to proper profiles');
    }
    
    if (courses.length > 0) {
      const totalEnrollmentsFromCourses = courses.reduce((sum, course) => sum + (course.enrollments || 0), 0);
      if (totalEnrollmentsFromCourses !== enrollments.length) {
        console.log('  🔸 Course enrollment counts need to be synchronized with enrollment table');
      }
    }

  } catch (error) {
    console.error('❌ Error during diagnosis:', error);
    process.exit(1);
  }
}

// Run the diagnosis
diagnoseProfileEnrollmentSync().then(() => {
  console.log('\n🏁 Diagnosis completed');
  process.exit(0);
});