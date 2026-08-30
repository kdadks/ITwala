import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import {
  BookOpen, Plus, Search, Filter, ExternalLink, Edit3, Trash2, CheckCircle2,
  AlertCircle, Users, DollarSign
} from 'lucide-react';

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

export const EmbeddedCoursesCMS: React.FC = () => {
  const supabase = useSupabaseClient();
  const [courses, setCourses] = useState<FormattedCourse[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    try {
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

      const { data: categoriesData } = await supabase
        .from('categories')
        .select('id, name');
      
      const categoryMap = new Map(categoriesData?.map(cat => [cat.id, cat.name]) || []);

      const formatted: FormattedCourse[] = (coursesData || []).map(course => ({
        id: course.id,
        title: course.title,
        description: course.description || '',
        price: course.price || 0,
        status: course.status || 'draft',
        created_at: course.created_at,
        thumbnail: course.thumbnail || '/images/Tech Professional at Work.jpeg',
        slug: course.slug,
        category: categoryMap.get(course.category_id) || 'Uncategorized',
        enrollments: course.enrollments?.[0]?.count || 0
      }));

      setCourses(formatted);
      setCategories(Array.from(new Set(categoriesData?.map(c => c.name) || [])));
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error(error.message || 'Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (courseId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update({ status: newStatus })
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, status: newStatus } : c));
      toast.success('Course status updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!window.confirm('Are you sure you want to delete this course?')) return;

    setIsDeleting(courseId);
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;

      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success('Course deleted');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete course');
    } finally {
      setIsDeleting(null);
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

  const totalPublished = courses.filter(c => c.status === 'published').length;
  const totalDrafts = courses.filter(c => c.status === 'draft').length;
  const totalStudents = courses.reduce((acc, c) => acc + c.enrollments, 0);

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-600" />
            Courses Catalog Management
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage course offerings, pricing, publication status, and student enrollments.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/courses" className="btn btn-outline text-xs">
            <ExternalLink className="w-3.5 h-3.5 mr-1" />
            Full Courses View
          </Link>
          <Link href="/admin/courses/create" className="btn btn-primary text-xs">
            <Plus className="w-4 h-4 mr-1" />
            Create Course
          </Link>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-gray-500 font-medium uppercase tracking-wider">Total Courses</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{courses.length}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-emerald-600 font-medium uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </div>
          <div className="text-2xl font-bold text-emerald-700 mt-1">{totalPublished}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-amber-600 font-medium uppercase tracking-wider flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> Drafts
          </div>
          <div className="text-2xl font-bold text-amber-700 mt-1">{totalDrafts}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
          <div className="text-xs text-blue-600 font-medium uppercase tracking-wider flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Total Students
          </div>
          <div className="text-2xl font-bold text-blue-700 mt-1">{totalStudents}</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by course title or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 md:flex-none"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 flex-1 md:flex-none"
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Course List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-600">No courses match your filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-left">
                <tr>
                  <th className="px-6 py-3.5">Course Info</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Enrolled</th>
                  <th className="px-6 py-3.5">Fee (₹)</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white text-sm">
                {filteredCourses.map(course => (
                  <tr key={course.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative flex-shrink-0 bg-gray-100">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 line-clamp-1">{course.title}</div>
                          <div className="text-xs text-gray-400">Added {new Date(course.created_at).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                        {course.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={course.status}
                        onChange={(e) => handleUpdateStatus(course.id, e.target.value)}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border-none ${
                          course.status === 'published' ? 'bg-emerald-100 text-emerald-800' :
                          course.status === 'draft' ? 'bg-amber-100 text-amber-800' :
                          'bg-rose-100 text-rose-800'
                        }`}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-700">
                      {course.enrollments}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900">
                      ₹{course.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/courses/edit/${course.slug}`}>
                          <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Course">
                            <Edit3 className="w-4 h-4" />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDeleteCourse(course.id)}
                          disabled={isDeleting === course.id}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-30"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
