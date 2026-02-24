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
  modules: any[];
}

interface ProgressItem {
  lesson_id: string;
  class_number: number;
  completed: boolean;
}

const AdminProgress: NextPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const { isAdmin, isLoading: authLoading } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [progress, setProgress] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAdmin) {
      router.push('/admin/login');
    }
  }, [isAdmin, authLoading, router]);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
  }, []);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, student_id, email')
        .eq('role', 'student')
        .order('full_name');

      if (error) throw error;
      setStudents(data || []);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error('Failed to load students');
    }
  };

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, modules')
        .eq('status', 'published')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const loadProgress = async () => {
    if (!selectedStudent || !selectedCourse) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('lesson_id, class_number, completed')
        .eq('user_id', selectedStudent)
        .eq('course_id', selectedCourse);

      if (error) throw error;

      const progressMap: Record<string, boolean> = {};
      data?.forEach((item: ProgressItem) => {
        const key = `${item.class_number}`;
        progressMap[key] = item.completed;
      });

      setProgress(progressMap);
    } catch (error: any) {
      console.error('Error loading progress:', error);
      toast.error('Failed to load progress data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStudent && selectedCourse) {
      loadProgress();
    } else {
      setProgress({});
    }
  }, [selectedStudent, selectedCourse]);

  const toggleProgress = (classNumber: number) => {
    const key = `${classNumber}`;
    setProgress(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const saveProgress = async () => {
    if (!selectedStudent || !selectedCourse) {
      toast.error('Please select a student and course');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCourseData = courses.find(c => c.id === selectedCourse);
      if (!selectedCourseData) throw new Error('Course not found');

      const progressUpdates = [];
      let classNumber = 0;

      // Iterate through modules and lessons
      for (const module of selectedCourseData.modules || []) {
        for (const lesson of module.lessons || []) {
          classNumber++;
          const key = `${classNumber}`;
          const isCompleted = progress[key] || false;

          progressUpdates.push({
            user_id: selectedStudent,
            course_id: selectedCourse,
            lesson_id: lesson.id || `lesson-${classNumber}`,
            class_number: classNumber,
            completed: isCompleted,
            completed_at: isCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          });
        }
      }

      // Upsert all progress records
      const { error } = await supabase
        .from('progress')
        .upsert(progressUpdates, {
          onConflict: 'user_id,course_id,lesson_id'
        });

      if (error) throw error;

      // Update enrollment progress percentage
      const completedCount = Object.values(progress).filter(Boolean).length;
      const totalClasses = progressUpdates.length;
      const progressPercentage = totalClasses > 0
        ? Math.round((completedCount / totalClasses) * 100)
        : 0;

      await supabase
        .from('enrollments')
        .update({
          progress: progressPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', selectedStudent)
        .eq('course_id', selectedCourse);

      toast.success('Progress updated successfully!');
    } catch (error: any) {
      console.error('Error saving progress:', error);
      toast.error(error.message || 'Failed to save progress');
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

  const selectedCourseData = courses.find(c => c.id === selectedCourse);
  let classNumber = 0;

  return (
    <>
      <Head>
        <title>Student Progress Management - Admin - ITwala Academy</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Student Progress Management</h1>
            <p className="mt-2 text-gray-600">Update student progress by class/lesson</p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a student...</option>
                  {students.map(student => (
                    <option key={student.id} value={student.id}>
                      {student.full_name} {student.student_id ? `(${student.student_id})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Course
                </label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Choose a course...</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Progress Grid */}
            {selectedStudent && selectedCourse && (
              <>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    <p className="mt-2 text-gray-600">Loading progress...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {selectedCourseData?.modules?.map((module: any, moduleIndex: number) => (
                      <div key={moduleIndex} className="border rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Module {moduleIndex + 1}: {module.title}
                        </h3>
                        <div className="space-y-2">
                          {module.lessons?.map((lesson: any, lessonIndex: number) => {
                            classNumber++;
                            const key = `${classNumber}`;
                            return (
                              <label
                                key={lessonIndex}
                                className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={progress[key] || false}
                                  onChange={() => toggleProgress(classNumber)}
                                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                />
                                <span className="ml-3 text-sm text-gray-900">
                                  Class {classNumber}: {lesson.title}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Save Button */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {Object.values(progress).filter(Boolean).length} of {classNumber} classes completed
                      </div>
                      <button
                        onClick={saveProgress}
                        disabled={isSaving}
                        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save Progress'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!selectedStudent && !selectedCourse && (
              <div className="text-center py-12 text-gray-500">
                Select a student and course to manage progress
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProgress;
