import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface Student {
  id: string;
  full_name: string;
  student_id: string;
  email: string;
}

interface Course {
  id: string;
  title: string;
}

interface AttendanceRecord {
  student_id: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes: string;
}

const AdminAttendance: NextPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { isAdmin, isLoading: authLoading, user } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<Student[]>([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [classDate, setClassDate] = useState(new Date().toISOString().split('T')[0]);
  const [classNumber, setClassNumber] = useState(1);
  const [attendance, setAttendance] = useState<Record<string, AttendanceRecord>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourse) {
      fetchEnrolledStudents();
      loadExistingAttendance();
    } else {
      setEnrolledStudents([]);
      setAttendance({});
    }
  }, [selectedCourse, classDate, classNumber]);

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .eq('status', 'published')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const fetchEnrolledStudents = async () => {
    if (!selectedCourse) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select(`
          student_id:user_id,
          profile:profiles(id, full_name, student_id, email)
        `)
        .eq('course_id', selectedCourse)
        .eq('status', 'active');

      if (error) throw error;

      const students = data?.map((enrollment: any) => ({
        id: enrollment.profile.id,
        full_name: enrollment.profile.full_name,
        student_id: enrollment.profile.student_id,
        email: enrollment.profile.email,
      })) || [];

      setEnrolledStudents(students);

      // Initialize attendance records for new students
      const initialAttendance: Record<string, AttendanceRecord> = {};
      students.forEach(student => {
        if (!attendance[student.id]) {
          initialAttendance[student.id] = {
            student_id: student.id,
            status: 'absent',
            notes: ''
          };
        }
      });

      setAttendance(prev => ({ ...prev, ...initialAttendance }));
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load enrolled students');
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingAttendance = async () => {
    if (!selectedCourse || !classDate) return;

    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('student_id, status, notes')
        .eq('course_id', selectedCourse)
        .eq('class_date', classDate)
        .eq('class_number', classNumber);

      if (error) throw error;

      if (data && data.length > 0) {
        const existingAttendance: Record<string, AttendanceRecord> = {};
        data.forEach(record => {
          existingAttendance[record.student_id] = {
            student_id: record.student_id,
            status: record.status as any,
            notes: record.notes || ''
          };
        });
        setAttendance(prev => ({ ...prev, ...existingAttendance }));
      }
    } catch (error: any) {
      console.error('Error loading attendance:', error);
    }
  };

  const updateAttendance = (studentId: string, field: 'status' | 'notes', value: string) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const markAll = (status: 'present' | 'absent') => {
    const updatedAttendance = { ...attendance };
    enrolledStudents.forEach(student => {
      updatedAttendance[student.id] = {
        ...updatedAttendance[student.id],
        status
      };
    });
    setAttendance(updatedAttendance);
  };

  const saveAttendance = async () => {
    if (!selectedCourse || !classDate || !user) {
      toast.error('Please select a course and date');
      return;
    }

    setIsSaving(true);
    try {
      const attendanceRecords = Object.values(attendance).map(record => ({
        student_id: record.student_id,
        course_id: selectedCourse,
        class_date: classDate,
        class_number: classNumber,
        status: record.status,
        notes: record.notes || null,
        marked_by: user.id,
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('attendance')
        .upsert(attendanceRecords, {
          onConflict: 'student_id,course_id,class_date,class_number'
        });

      if (error) throw error;

      toast.success('Attendance saved successfully!');
    } catch (error: any) {
      console.error('Error saving attendance:', error);
      toast.error(error.message || 'Failed to save attendance');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  const presentCount = Object.values(attendance).filter(a => a.status === 'present').length;
  const lateCount = Object.values(attendance).filter(a => a.status === 'late').length;
  const absentCount = Object.values(attendance).filter(a => a.status === 'absent').length;

  return (
    <>
      <Head>
        <title>Attendance Management - Admin - ITwala Academy</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
            <p className="mt-2 text-gray-600">Mark student attendance for classes</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Date
                </label>
                <input
                  type="date"
                  value={classDate}
                  onChange={(e) => setClassDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Class Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={classNumber}
                  onChange={(e) => setClassNumber(parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {selectedCourse && (
              <>
                {/* Quick Actions */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b">
                  <div className="flex gap-2">
                    <button
                      onClick={() => markAll('present')}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
                    >
                      Mark All Present
                    </button>
                    <button
                      onClick={() => markAll('absent')}
                      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                    >
                      Mark All Absent
                    </button>
                  </div>
                  <div className="text-sm text-gray-600">
                    Total: {enrolledStudents.length} | Present: {presentCount} | Late: {lateCount} | Absent: {absentCount}
                  </div>
                </div>

                {/* Student List */}
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                  </div>
                ) : enrolledStudents.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No students enrolled in this course
                  </div>
                ) : (
                  <div className="space-y-3">
                    {enrolledStudents.map(student => (
                      <div key={student.id} className="border rounded-lg p-4 hover:bg-gray-50">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{student.full_name}</h4>
                            <p className="text-sm text-gray-600">
                              {student.student_id && `ID: ${student.student_id} • `}
                              {student.email}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            {(['present', 'late', 'absent', 'excused'] as const).map(status => (
                              <button
                                key={status}
                                onClick={() => updateAttendance(student.id, 'status', status)}
                                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                                  attendance[student.id]?.status === status
                                    ? status === 'present'
                                      ? 'bg-green-600 text-white'
                                      : status === 'late'
                                      ? 'bg-yellow-600 text-white'
                                      : status === 'excused'
                                      ? 'bg-blue-600 text-white'
                                      : 'bg-red-600 text-white'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                              >
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          placeholder="Add notes (optional)..."
                          value={attendance[student.id]?.notes || ''}
                          onChange={(e) => updateAttendance(student.id, 'notes', e.target.value)}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Save Button */}
                {enrolledStudents.length > 0 && (
                  <div className="mt-6 pt-4 border-t flex justify-end">
                    <button
                      onClick={saveAttendance}
                      disabled={isSaving}
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? 'Saving...' : 'Save Attendance'}
                    </button>
                  </div>
                )}
              </>
            )}

            {!selectedCourse && (
              <div className="text-center py-12 text-gray-500">
                Select a course to manage attendance
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminAttendance;
