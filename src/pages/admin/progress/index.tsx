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
  lesson_id: string | null;
  module_id: string | null;
  class_number: number | null;
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
  }, [isAdmin, authLoading]);

  useEffect(() => {
    fetchStudents();
    fetchCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        .select('lesson_id, module_id, class_number, completed')
        .eq('user_id', selectedStudent)
        .eq('course_id', selectedCourse);

      if (error) throw error;

      const progressMap: Record<string, boolean> = {};
      const selectedCourseData = courses.find(c => c.id === selectedCourse);

      data?.forEach((item: ProgressItem) => {
        if (item.lesson_id && item.class_number) {
          const key = `class-${item.class_number}`;
          progressMap[key] = item.completed;
        } else if (item.module_id && selectedCourseData) {
          const moduleIndex = selectedCourseData.modules.findIndex(m => m.id === item.module_id);
          if (moduleIndex >= 0) {
            const key = `module-${moduleIndex}`;
            progressMap[key] = item.completed;
          }
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStudent, selectedCourse]);

  const toggleProgress = (key: string) => {
    setProgress(prev => {
      const newValue = !prev[key];
      const updated = {
        ...prev,
        [key]: newValue
      };

      if (key.startsWith('module-')) {
        const moduleIndex = parseInt(key.replace('module-', ''), 10);
        const selectedCourseData = courses.find(c => c.id === selectedCourse);
        const courseModule = selectedCourseData?.modules?.[moduleIndex];

        if (courseModule?.lessons?.length > 0) {
          let classNumber = 0;
          for (const m of selectedCourseData?.modules || []) {
            for (const l of m.lessons || []) {
              classNumber++;
              updated[`class-${classNumber}`] = newValue;
            }
          }
        }
      }

      return updated;
    });
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

      const lessonUpdates = [];
      const moduleUpdates = [];
      let classNumber = 0;

      // Iterate through modules and lessons
      for (let moduleIndex = 0; moduleIndex < (selectedCourseData.modules || []).length; moduleIndex++) {
        const courseModule = selectedCourseData.modules[moduleIndex];
        const moduleKey = `module-${moduleIndex}`;
        const isModuleCompleted = progress[moduleKey] || false;

        if (!courseModule.lessons || courseModule.lessons.length === 0) {
          // Module has no lessons - create module-level entry
          moduleUpdates.push({
            user_id: selectedStudent,
            course_id: selectedCourse,
            module_id: courseModule.id,
            lesson_id: null,
            class_number: null,
            completed: isModuleCompleted,
            completed_at: isModuleCompleted ? new Date().toISOString() : null,
            updated_at: new Date().toISOString()
          });
        } else {
          // Module has lessons - create lesson-level entries
          for (const lesson of courseModule.lessons) {
            classNumber++;
            const key = `class-${classNumber}`;
            const isCompleted = progress[key] || false;

            lessonUpdates.push({
              user_id: selectedStudent,
              course_id: selectedCourse,
              module_id: courseModule.id,
              lesson_id: lesson.id,
              class_number: classNumber,
              completed: isCompleted,
              completed_at: isCompleted ? new Date().toISOString() : null,
              updated_at: new Date().toISOString()
            });
          }
        }
      }

      // Upsert lesson-level progress records
      if (lessonUpdates.length > 0) {
        const { error } = await supabase
          .from('progress')
          .upsert(lessonUpdates, {
            onConflict: 'user_id,lesson_id'
          });

        if (error) throw error;
      }

      // Upsert module-level progress records
      if (moduleUpdates.length > 0) {
        const { error } = await supabase
          .from('progress')
          .upsert(moduleUpdates, {
            onConflict: 'user_id,module_id'
          });

        if (error) throw error;
      }

      // Update enrollment progress percentage
      const completedCount = Object.values(progress).filter(Boolean).length;
      const totalClasses = lessonUpdates.length + moduleUpdates.length;
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
                    {selectedCourseData?.modules?.map((module: any, moduleIndex: number) => {
                      const moduleKey = `module-${moduleIndex}`;
                      const isModuleCompleted = progress[moduleKey] || false;
                      const hasLessons = module.lessons && module.lessons.length > 0;

                      return (
                        <div key={moduleIndex} className="border rounded-lg p-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Module {moduleIndex + 1}: {module.title}
                          </h3>
                          <div className="space-y-2">
                            <label className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isModuleCompleted}
                                onChange={() => toggleProgress(moduleKey)}
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                              <span className="ml-3 text-sm font-medium text-gray-900">
                                {hasLessons ? 'Mark entire module as complete' : 'Mark module as complete'}
                              </span>
                            </label>
                            {hasLessons && (
                              <div className="ml-4 space-y-2">
                                {module.lessons.map((lesson: any, lessonIndex: number) => {
                                  classNumber++;
                                  const key = `class-${classNumber}`;
                                  return (
                                    <label
                                      key={lessonIndex}
                                      className="flex items-center p-3 hover:bg-gray-50 rounded-md cursor-pointer"
                                    >
                                      <input
                                        type="checkbox"
                                        checked={progress[key] || false}
                                        onChange={() => toggleProgress(key)}
                                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                                      />
                                      <span className="ml-3 text-sm text-gray-900">
                                        Class {classNumber}: {lesson.title}
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}

                    {/* Save Button */}
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-gray-600">
                        {Object.values(progress).filter(Boolean).length} of {Object.keys(progress).length} items completed
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
