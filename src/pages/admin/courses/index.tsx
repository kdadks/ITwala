import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';

interface Category {
  id: string;
  name: string;
}

interface CourseEnrollment {
  count: number;
}

interface SupabaseCourseRaw {
  id: string;
  title: string;
  description: string;
  price: number | null;
  status: string | null;
  created_at: string;
  thumbnail: string | null;
  slug: string;
  category_id: string | null;
  enrollments: { count: number }[] | null;
}

interface FormattedCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  status: string;
  created_at: string;
  thumbnail: string;
  slug: string;
  category: string;
  enrollments: number;
}

const AdminCourses: NextPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [courses, setCourses] = useState<FormattedCourse[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [categories, setCategories] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Get courses from Supabase
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      // First fetch all courses
      const { data: coursesData, error } = await supabase
        .from('courses')
        .select(`
          *,
          enrollments!left (
            count
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (!coursesData) {
        setCourses([]);
        return;
      }

      // Get categories in a separate query
      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name');
      
      const categoryMap = new Map(categoriesData?.map(cat => [cat.id, cat.name]) || []);

      // Format courses data
      const formattedCourses: FormattedCourse[] = coursesData.map(course => ({
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price || 0,
        status: course.status || 'draft',
        created_at: course.created_at,
        thumbnail: course.thumbnail || '/images/Tech Professional at Work.jpeg',
        slug: course.slug,
        category: categoryMap.get(course.category_id) || 'Uncategorized',
        enrollments: course.enrollments?.[0]?.count || 0
      }));

      setCourses(formattedCourses);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error(error.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  // Get categories from Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      if (!data) {
        setCategories([]);
        return;
      }

      setCategories(data.map(cat => cat.name));
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) throw error;

        setIsAdmin(data.role === 'admin');
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAdmin();
    fetchCourses();
    fetchCategories();
  }, [user, supabase]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setIsDeleting(courseId);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.filter(course => course.id !== courseId));
      toast.success('Course deleted successfully');
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleUpdateStatus = async (courseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(courses.map(course => 
        course.id === courseId ? { ...course, status: newStatus } : course
      ));
      
      toast.success('Course status updated');
    } catch (error) {
      console.error('Error updating course status:', error);
      toast.error('Failed to update course status');
    }
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !selectedCategory || course.category === selectedCategory;
    const matchesStatus = !selectedStatus || course.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>;
  }

  if (!isAdmin) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600">You do not have permission to access this page.</p>
      </div>
    </div>;
  }

  return (
    <>
      <Head>
        <title>Manage Courses - ITwala Academy Admin</title>
        <meta name="description" content="Manage courses on ITwala Academy." />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
              <div className="mb-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
                <Link href="/admin/courses/create">
                  <div className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
                    Create New Course
                  </div>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                    <div className="absolute left-3 top-2.5 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <select 
                      className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    
                    <select 
                      className="bg-white border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                      <option value="">All Status</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registration Fee (₹)</th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredCourses.map((course) => (
                        <tr key={course.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden">
                                <Image src={course.thumbnail || '/images/Tech Professional at Work.jpeg'} alt={course.title} width={40} height={40} className="h-10 w-10 object-cover" />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{course.title}</div>
                                <div className="text-sm text-gray-500">
                                  Added {new Date(course.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-gray-900">{course.category}</span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select
                              value={course.status}
                              onChange={(e) => handleUpdateStatus(course.id, e.target.value)}
                              className={`text-xs px-2 py-1 rounded-full font-semibold 
                                ${course.status === 'published' ? 'bg-green-100 text-green-800' :
                                course.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'}`}
                            >
                              <option value="draft">Draft</option>
                              <option value="published">Published</option>
                              <option value="archived">Archived</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.enrollments}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {course.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                            <Link href={`/admin/courses/edit/${course.slug}`}>
                              <div className="text-primary-600 hover:text-primary-900">Edit</div>
                            </Link>
                            <button
                              onClick={() => handleDeleteCourse(course.id)}
                              disabled={isDeleting === course.id}
                              className={`text-red-600 hover:text-red-900 ${isDeleting === course.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                              {isDeleting === course.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No courses found</p>
                  </div>
                )}
              </div>
            </div>
      </main>
    </>
  );
};

// Disable static generation for this admin page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AdminCourses;