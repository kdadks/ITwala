import { NextPage } from 'next';
import Head from 'next/head';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';

interface Instructor {
  id: string;
  full_name: string;
  email: string;
  bio: string;
  specialization: string;
  avatar_url: string;
  courses: {
    id: string;
    title: string;
  }[];
  students_count: number;
  rating: number;
}

const InstructorsPage: NextPage = () => {
  const supabase = useSupabaseClient();
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newInstructor, setNewInstructor] = useState({
    full_name: '',
    email: '',
    bio: '',
    specialization: '',
    avatar_url: ''
  });

  useEffect(() => {
    fetchInstructors();
  }, []);

  const fetchInstructors = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          bio,
          specialization,
          avatar_url,
          courses:courses(id, title),
          students_count:enrollments(count),
          rating:reviews(rating)
        `)
        .eq('role', 'instructor');

      if (error) throw error;

      const formattedInstructors = data?.map(instructor => ({
        ...instructor,
        students_count: instructor.students_count?.[0]?.count || 0,
        rating: instructor.rating 
          ? Number((instructor.rating.reduce((acc: number, r: any) => acc + r.rating, 0) / instructor.rating.length).toFixed(1))
          : 0
      }));

      setInstructors(formattedInstructors);
    } catch (error) {
      console.error('Error fetching instructors:', error);
      toast.error('Failed to load instructors');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddInstructor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: userData, error: userError } = await supabase.auth.signUp({
        email: newInstructor.email,
        password: Math.random().toString(36).slice(-8), // Generate random password
        options: {
          data: {
            full_name: newInstructor.full_name,
            avatar_url: newInstructor.avatar_url,
            role: 'instructor'
          }
        }
      });

      if (userError) throw userError;

      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          bio: newInstructor.bio,
          specialization: newInstructor.specialization
        })
        .eq('id', userData.user?.id);

      if (profileError) throw profileError;

      toast.success('Instructor added successfully');
      setShowAddModal(false);
      fetchInstructors();
    } catch (error) {
      console.error('Error adding instructor:', error);
      toast.error('Failed to add instructor');
    }
  };

  return (
    <>
      <Head>
        <title>Instructors - ITwala Academy Admin</title>
        <meta name="description" content="Manage instructors at ITwala Academy" />
      </Head>

      <div className="flex h-screen bg-gray-100">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <AdminHeader />
          
          <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-900">Instructors</h1>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Add Instructor
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instructor</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialization</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {instructors.map((instructor) => (
                        <tr key={instructor.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={instructor.avatar_url || '/images/default-avatar.png'}
                                  alt={instructor.full_name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{instructor.full_name}</div>
                                <div className="text-sm text-gray-500">{instructor.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{instructor.specialization}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">
                              {instructor.courses.map(course => course.title).join(', ')}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {instructor.students_count}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{instructor.rating} ⭐</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900 mr-4">Edit</button>
                            <button className="text-red-600 hover:text-red-900">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Add Instructor Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-semibold mb-4">Add New Instructor</h2>
            <form onSubmit={handleAddInstructor}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={newInstructor.full_name}
                    onChange={(e) => setNewInstructor({...newInstructor, full_name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={newInstructor.email}
                    onChange={(e) => setNewInstructor({...newInstructor, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    rows={3}
                    value={newInstructor.bio}
                    onChange={(e) => setNewInstructor({...newInstructor, bio: e.target.value})}
                  ></textarea>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Specialization</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={newInstructor.specialization}
                    onChange={(e) => setNewInstructor({...newInstructor, specialization: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
                  <input
                    type="url"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                    value={newInstructor.avatar_url}
                    onChange={(e) => setNewInstructor({...newInstructor, avatar_url: e.target.value})}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                >
                  Add Instructor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorsPage;
