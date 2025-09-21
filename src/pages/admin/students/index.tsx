import { NextPage } from 'next';
import Head from 'next/head';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

interface Student {
  id: string;
  full_name: string;
  email: string;
  created_at: string;
  enrollments: {
    id: string;
    enrolled_at: string;
    course: {
      id: string;
      title: string;
    };
    status: 'active' | 'completed' | 'paused';
    progress: number;
  }[];
}

const StudentsPage: NextPage = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          created_at,
          enrollments(
            id,
            enrolled_at,
            status,
            progress,
            course:courses(
              id,
              title
            )
          )
        `)
        .eq('role', 'student')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedData: Student[] = (data || []).map(student => ({
        ...student,
        enrollments: student.enrollments.map((e: any) => ({
          ...e,
          course: Array.isArray(e.course) ? e.course[0] : e.course
        }))
      }));

      setStudents(transformedData);
    } catch (error: any) {
      console.error('Error fetching students:', error);
      toast.error(error.message || 'Failed to load students');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        if (data.role !== 'admin') {
          router.push('/dashboard');
          return;
        }

        setIsAdmin(true);
        await fetchStudents();
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/dashboard');
      }
    };

    checkAdmin();
  }, [user, router]);

  const handleEnrollmentStatusChange = async (enrollmentId: string, newStatus: 'active' | 'completed' | 'paused') => {
    try {
      const { error } = await supabase
        .from('enrollments')
        .update({ status: newStatus })
        .eq('id', enrollmentId);

      if (error) throw error;

      toast.success('Enrollment status updated successfully');
      fetchStudents(); // Refresh the data
    } catch (error: any) {
      console.error('Error updating enrollment status:', error);
      toast.error(error.message || 'Failed to update enrollment status');
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    
    return matchesSearch && student.enrollments.some(e => e.status === statusFilter);
  });

  const calculateProgress = (enrollments: Student['enrollments']) => {
    if (enrollments.length === 0) return 0;
    return Math.round(enrollments.reduce((acc, e) => acc + (e.progress || 0), 0) / enrollments.length);
  };

  return (
    <>
      <Head>
        <title>Students - ITwala Academy Admin</title>
        <meta name="description" content="Manage students at ITwala Academy" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6">
                <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
              </div>

              <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full md:max-w-xs px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="paused">Paused</option>
                  </select>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredStudents.map((student) => (
                          <tr key={student.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{student.full_name}</div>
                              <div className="text-sm text-gray-500">Joined {new Date(student.created_at).toLocaleDateString()}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                {student.enrollments.map(enrollment => (
                                  <div key={enrollment.id} className="flex items-center justify-between">
                                    <span className="text-sm text-gray-900">{enrollment.course.title}</span>
                                    <select
                                      value={enrollment.status}
                                      onChange={(e) => handleEnrollmentStatusChange(enrollment.id, e.target.value as any)}
                                      className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${
                                        enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        enrollment.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                        'bg-gray-100 text-gray-800'
                                      }`}
                                    >
                                      <option value="active">Active</option>
                                      <option value="completed">Completed</option>
                                      <option value="paused">Paused</option>
                                    </select>
                                  </div>
                                ))}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="w-full bg-gray-200 rounded-full h-2 mr-2 flex-grow">
                                  <div
                                    className="bg-primary-500 h-2 rounded-full"
                                    style={{ width: `${calculateProgress(student.enrollments)}%` }}
                                  />
                                </div>
                                <span className="text-sm text-gray-500 w-12">
                                  {calculateProgress(student.enrollments)}%
                                </span>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {filteredStudents.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No students found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </>
  );
};

// Disable static generation for this admin page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default StudentsPage;
