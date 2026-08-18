import { NextPage } from 'next';
import Head from 'next/head';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { countries, getStatesByCountry, getCountryIsoCode } from '@/utils/locationData';

interface Enrollment {
  id: string;
  enrolled_at: string;
  course: {
    id: string;
    title: string;
  };
  status: 'active' | 'completed' | 'paused';
  progress: number;
}

interface Student {
  id: string;
  full_name: string;
  email: string;
  student_id: string | null;
  created_at: string;
  phone?: string | null;
  date_of_birth?: string | null;
  parent_name?: string | null;
  highest_qualification?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  pincode?: string | null;
  enrollments: Enrollment[];
}

interface Course {
  id: string;
  title: string;
  price: number;
}

interface NewStudentForm {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  date_of_birth: string;
  parent_name: string;
  highest_qualification: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  courseIds: string[];
}

const emptyForm: NewStudentForm = {
  full_name: '',
  email: '',
  password: '',
  phone: '',
  date_of_birth: '',
  parent_name: '',
  highest_qualification: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  country: 'India',
  pincode: '',
  courseIds: [],
};

const StudentsPage: NextPage = () => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'paused'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<NewStudentForm>(emptyForm);

  const isEditMode = Boolean(editingStudent);

  // Get country ISO code from selected country name
  const selectedCountryCode = useMemo(() => {
    return getCountryIsoCode(formData.country);
  }, [formData.country]);

  // Get states for selected country
  const availableStates = useMemo(() => {
    return getStatesByCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          student_id,
          created_at,
          phone,
          date_of_birth,
          parent_name,
          highest_qualification,
          address_line1,
          address_line2,
          city,
          state,
          country,
          pincode,
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
        enrollments: (student.enrollments || []).map((e: any) => ({
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

  const fetchCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, price')
        .eq('status', 'published')
        .order('title');

      if (error) throw error;
      setCourses(data || []);
    } catch (error: any) {
      console.error('Error fetching courses:', error);
      toast.error('Failed to load courses');
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setEditingStudent(null);
    setShowAddModal(false);
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData(emptyForm);
    setShowAddModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      full_name: student.full_name || '',
      email: student.email || '',
      password: '',
      phone: student.phone || '',
      date_of_birth: student.date_of_birth || '',
      parent_name: student.parent_name || '',
      highest_qualification: student.highest_qualification || '',
      address_line1: student.address_line1 || '',
      address_line2: student.address_line2 || '',
      city: student.city || '',
      state: student.state || '',
      country: student.country || 'India',
      pincode: student.pincode || '',
      courseIds: student.enrollments.map(e => e.course.id),
    });
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/admin/students/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create student');
      }

      toast.success('Student created successfully!');
      resetForm();
      await fetchStudents(); // Refresh the student list
    } catch (error: any) {
      console.error('Error creating student:', error);
      toast.error(error.message || 'Failed to create student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingStudent) return;

    if (!formData.full_name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Update profile information
      const updateResponse = await fetch(`/api/admin/students/${editingStudent.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.date_of_birth,
          parent_name: formData.parent_name,
          highest_qualification: formData.highest_qualification,
          address_line1: formData.address_line1,
          address_line2: formData.address_line2,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          pincode: formData.pincode,
        }),
      });

      const updateResult = await updateResponse.json();
      if (!updateResponse.ok) {
        throw new Error(updateResult.error || 'Failed to update student');
      }

      // 2. Reconcile course enrollments
      const currentIds = editingStudent.enrollments.map(en => en.course.id);
      const selectedIds = formData.courseIds;
      const toAdd = selectedIds.filter(cid => !currentIds.includes(cid));
      const toRemove = currentIds.filter(cid => !selectedIds.includes(cid));

      const errors: string[] = [];

      for (const courseId of toAdd) {
        const res = await fetch(`/api/admin/students/${editingStudent.id}/enrollments`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }),
        });
        if (!res.ok) {
          const r = await res.json().catch(() => ({}));
          errors.push(r.error || `Failed to enroll in course ${courseId}`);
        }
      }

      for (const courseId of toRemove) {
        const res = await fetch(`/api/admin/students/${editingStudent.id}/enrollments`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseId }),
        });
        if (!res.ok) {
          const r = await res.json().catch(() => ({}));
          errors.push(r.error || `Failed to remove course ${courseId}`);
        }
      }

      if (errors.length > 0) {
        toast.error(`Profile updated, but: ${errors.join('; ')}`);
      } else {
        toast.success('Student updated successfully!');
      }

      resetForm();
      await fetchStudents();
    } catch (error: any) {
      console.error('Error updating student:', error);
      toast.error(error.message || 'Failed to update student');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async () => {
    if (!deletingStudent) return;
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/admin/students/${deletingStudent.id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete student');
      }
      toast.success('Student deleted successfully');
      setDeletingStudent(null);
      await fetchStudents();
    } catch (error: any) {
      console.error('Error deleting student:', error);
      toast.error(error.message || 'Failed to delete student');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCourseToggle = (courseId: string) => {
    setFormData(prev => ({
      ...prev,
      courseIds: prev.courseIds.includes(courseId)
        ? prev.courseIds.filter(id => id !== courseId)
        : [...prev.courseIds, courseId]
    }));
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/admin/login');
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
        await fetchCourses();
      } catch (error) {
        console.error('Error checking admin status:', error);
        router.push('/dashboard');
      }
    };

    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    if (!isAdmin) return;

    const interval = setInterval(() => {
      fetchStudents();
      fetchCourses();
    }, 5000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

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
      student.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.student_id?.toLowerCase().includes(searchQuery.toLowerCase());

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

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
            <button
              onClick={openAddModal}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Add Student
            </button>
          </div>

          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or student ID..."
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
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Enrolled Courses</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          {student.student_id ? (
                            <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded text-gray-700 inline-block">
                              {student.student_id}
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-2">
                            {student.enrollments.map(enrollment => (
                              <div key={enrollment.id} className="flex items-center justify-between">
                                <span className="text-sm text-gray-900">{enrollment.course.title}</span>
                                <select
                                  value={enrollment.status}
                                  onChange={(e) => handleEnrollmentStatusChange(enrollment.id, e.target.value as any)}
                                  className={`text-xs px-2 py-1 rounded-full font-medium ml-2 ${enrollment.status === 'completed' ? 'bg-green-100 text-green-800' :
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
                            {student.enrollments.length === 0 && (
                              <span className="text-sm text-gray-400">No courses</span>
                            )}
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
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => openEditModal(student)}
                            className="text-primary-600 hover:text-primary-900 mr-3"
                            disabled={isSubmitting}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setDeletingStudent(student)}
                            className="text-red-600 hover:text-red-900"
                            disabled={isDeleting}
                          >
                            Delete
                          </button>
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

        {/* Add / Edit Student Modal */}
        {(showAddModal || editingStudent) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  {isEditMode ? 'Edit Student' : 'Add New Student'}
                </h2>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                  disabled={isSubmitting}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={isEditMode ? handleUpdateStudent : handleAddStudent} className="px-6 py-4 space-y-6">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.full_name}
                        onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    {!isEditMode && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Password <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="password"
                          required
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Minimum 6 characters"
                          minLength={6}
                          disabled={isSubmitting}
                        />
                        <p className="mt-1 text-xs text-gray-500">This password will be shared with the student via email</p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth (DD/MM/YYYY)
                      </label>
                      <input
                        type="text"
                        value={formData.date_of_birth}
                        onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="DD/MM/YYYY"
                        pattern="\d{2}/\d{2}/\d{4}"
                        disabled={isSubmitting}
                      />
                      <p className="mt-1 text-xs text-gray-500">Format: DD/MM/YYYY (e.g., 15/08/2000)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parent Name
                      </label>
                      <input
                        type="text"
                        value={formData.parent_name}
                        onChange={(e) => setFormData({ ...formData, parent_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Highest Qualification
                      </label>
                      <select
                        value={formData.highest_qualification}
                        onChange={(e) => setFormData({ ...formData, highest_qualification: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      >
                        <option value="">Select qualification</option>
                        <option value="10th">10th</option>
                        <option value="12th">12th</option>
                        <option value="diploma">Diploma</option>
                        <option value="bachelors">{"Bachelor's Degree"}</option>
                        <option value="masters">{"Master's Degree"}</option>
                        <option value="phd">Ph.D.</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Address Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        value={formData.address_line1}
                        onChange={(e) => setFormData({ ...formData, address_line1: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        value={formData.address_line2}
                        onChange={(e) => setFormData({ ...formData, address_line2: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <select
                        value={formData.country}
                        onChange={(e) => setFormData({ ...formData, country: e.target.value, state: '', city: '' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        disabled={isSubmitting}
                      >
                        {countries.map((country) => (
                          <option key={country.isoCode} value={country.name}>
                            {country.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State / Province / Region
                      </label>
                      <select
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value, city: '' })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                        disabled={isSubmitting}
                      >
                        <option value="">Select State</option>
                        {availableStates.map((state) => (
                          <option key={state.isoCode} value={state.name}>
                            {state.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={isSubmitting}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Enrollment */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {isEditMode ? 'Course Enrollments' : 'Enroll in Courses (Optional)'}
                  </h3>
                  <div className="border border-gray-200 rounded-md max-h-60 overflow-y-auto">
                    {courses.length === 0 ? (
                      <div className="p-4 text-center text-gray-500">No courses available</div>
                    ) : (
                      <div className="divide-y divide-gray-200">
                        {courses.map((course) => (
                          <label
                            key={course.id}
                            className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={formData.courseIds.includes(course.id)}
                              onChange={() => handleCourseToggle(course.id)}
                              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              disabled={isSubmitting}
                            />
                            <span className="ml-3 flex-1 text-sm text-gray-900">{course.title}</span>
                            <span className="ml-2 text-sm text-gray-500">₹{course.price}</span>
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                  {formData.courseIds.length > 0 && (
                    <p className="mt-2 text-sm text-gray-600">
                      {formData.courseIds.length} course{formData.courseIds.length > 1 ? 's' : ''} selected
                    </p>
                  )}
                  {isEditMode && (
                    <p className="mt-1 text-xs text-gray-500">
                      Unchecking a course will remove the student's enrollment when you save.
                    </p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? (isEditMode ? 'Saving...' : 'Creating...')
                      : (isEditMode ? 'Save Changes' : 'Create Student')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Delete Student</h2>
              <p className="text-sm text-gray-600 mb-2">
                Are you sure you want to delete <span className="font-semibold">{deletingStudent.full_name}</span>?
              </p>
              <p className="text-sm text-red-600 mb-6">
                This will permanently remove the student's account, profile, and all enrollments. This action cannot be undone.
              </p>
              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingStudent(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStudent}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete Student'}
                </button>
              </div>
            </div>
          </div>
        )}
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

export default StudentsPage;
