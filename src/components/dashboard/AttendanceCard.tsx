import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import Link from 'next/link';

interface AttendanceRecord {
  class_date: string;
  class_number: number;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string | null;
  course: {
    title: string;
  };
}

interface CourseAttendance {
  course_id: string;
  course_title: string;
  total_classes: number;
  present_count: number;
  attendance_percentage: number;
}

const AttendanceCard = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([]);
  const [recentAttendance, setRecentAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (user) {
      fetchAttendance();
    }
  }, [user]);

  const fetchAttendance = async () => {
    if (!user) return;

    try {
      // Fetch recent attendance records
      const { data: recentData, error: recentError } = await supabase
        .from('attendance')
        .select(`
          class_date,
          class_number,
          status,
          notes,
          course:courses(title)
        `)
        .eq('student_id', user.id)
        .order('class_date', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      const transformedRecent = recentData?.map((record: any) => ({
        ...record,
        course: record.course ? { title: record.course.title } : { title: 'Unknown Course' }
      })) || [];

      setRecentAttendance(transformedRecent);

      // Calculate attendance percentage per course
      const { data: enrollmentData, error: enrollmentError } = await supabase
        .from('enrollments')
        .select(`
          course_id,
          course:courses(title)
        `)
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (enrollmentError) throw enrollmentError;

      const attendanceByCourse: CourseAttendance[] = [];

      for (const enrollment of enrollmentData || []) {
        const { data: attendanceData } = await supabase
          .from('attendance')
          .select('status')
          .eq('student_id', user.id)
          .eq('course_id', enrollment.course_id);

        const totalClasses = attendanceData?.length || 0;
        const presentCount = attendanceData?.filter(a =>
          a.status === 'present' || a.status === 'late'
        ).length || 0;

        const percentage = totalClasses > 0
          ? Math.round((presentCount / totalClasses) * 100)
          : 0;

        const courseData: any = enrollment.course;
        const courseTitle = Array.isArray(courseData)
          ? courseData[0]?.title || 'Unknown Course'
          : courseData?.title || 'Unknown Course';

        if (totalClasses > 0) {
          attendanceByCourse.push({
            course_id: enrollment.course_id,
            course_title: courseTitle,
            total_classes: totalClasses,
            present_count: presentCount,
            attendance_percentage: percentage
          });
        }
      }

      setCourseAttendance(attendanceByCourse);
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-50';
      case 'late':
        return 'text-yellow-600 bg-yellow-50';
      case 'excused':
        return 'text-blue-600 bg-blue-50';
      case 'absent':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'late':
        return '⏰';
      case 'excused':
        return '📝';
      case 'absent':
        return '✗';
      default:
        return '?';
    }
  };

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 75) return 'text-green-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance</h2>
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-md p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Attendance</h2>
        {courseAttendance.length > 0 && (
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        )}
      </div>

      {courseAttendance.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No attendance records yet</p>
      ) : (
        <div className="space-y-4">
          {/* Course-wise Attendance Summary */}
          <div className="space-y-3">
            {courseAttendance.map((course) => (
              <div key={course.course_id} className="border rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900 text-sm">{course.course_title}</h3>
                  <span className={`text-lg font-bold ${getAttendanceColor(course.attendance_percentage)}`}>
                    {course.attendance_percentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span>{course.present_count} / {course.total_classes} classes attended</span>
                  {course.attendance_percentage < 75 && (
                    <span className="text-red-600 font-medium">Below 75%</span>
                  )}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      course.attendance_percentage >= 75
                        ? 'bg-green-600'
                        : course.attendance_percentage >= 50
                        ? 'bg-yellow-600'
                        : 'bg-red-600'
                    }`}
                    style={{ width: `${course.attendance_percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Attendance Details */}
          {showDetails && recentAttendance.length > 0 && (
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Recent Classes</h3>
              <div className="space-y-2">
                {recentAttendance.map((record, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Class {record.class_number} - {record.course.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(record.class_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      {record.notes && (
                        <p className="text-xs text-gray-600 italic mt-1">{record.notes}</p>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}>
                      {getStatusIcon(record.status)} {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default AttendanceCard;
