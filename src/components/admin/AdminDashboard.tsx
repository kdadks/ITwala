import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Link from 'next/link';

const AdminDashboard: React.FC = () => {
  const supabase = useSupabaseClient();
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    completionRate: 0,
    revenue: 0
  });
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch total courses
      const { data: courses } = await supabase
        .from('courses')
        .select('count');

      // Fetch active students
      const { data: students } = await supabase
        .from('enrollments')
        .select('count')
        .eq('status', 'active');

      // Fetch course completion rate
      const { data: completions } = await supabase
        .from('progress')
        .select('count')
        .eq('completed', true);

      // Fetch recent activity
      const { data: activity } = await supabase
        .from('enrollments')
        .select(`
          id,
          created_at,
          courses(title),
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      // Fetch popular courses
      const { data: popular } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          enrollments(count),
          reviews(rating)
        `)
        .order('enrollments', { ascending: false })
        .limit(5);

      setStats({
        totalCourses: courses?.[0]?.count || 0,
        activeStudents: students?.[0]?.count || 0,
        completionRate: Math.round((completions?.[0]?.count || 0) / (students?.[0]?.count || 1) * 100),
        revenue: 0 // You'll need to implement revenue calculation based on your business logic
      });

      setRecentActivity(activity || []);
      setPopularCourses(popular || []);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  // Quick action buttons
  const quickActions = [
    { title: 'Add New Course', href: '/admin/courses/create', color: 'bg-primary-500' },
    { title: 'Manage Content', href: '/admin/content', color: 'bg-secondary-500' },
    { title: 'View Students', href: '/admin/students', color: 'bg-success-500' }
  ];

  return (
    <div className="p-4 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {quickActions.map((action, index) => (
          <Link href={action.href} key={index}>
            <div className={`${action.color} text-white p-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity`}>
              <h3 className="font-medium">{action.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Total Courses</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalCourses}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Active Students</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.activeStudents}</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Course Completion</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">{stats.completionRate}%</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-sm font-medium text-gray-500">Revenue</h3>
          <div className="mt-2 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">₹{stats.revenue.toLocaleString()}</p>
          </div>
        </motion.div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="border-l-4 border-primary-500 pl-4">
                <p className="text-sm text-gray-600">
                  {activity.profiles.full_name} enrolled in {activity.courses.title}
                </p>
                <p className="text-xs text-gray-400">
                  {new Date(activity.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Popular Courses</h3>
          <div className="space-y-4">
            {popularCourses.map((course) => (
              <div key={course.id} className="flex items-center space-x-4">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                  <p className="text-xs text-gray-500">
                    {course.enrollments[0]?.count || 0} enrollments
                  </p>
                </div>
                <div className="text-sm font-medium text-primary-600">
                  {course.reviews?.length > 0 
                    ? `${(course.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / course.reviews.length).toFixed(1)} ⭐`
                    : 'Not rated'}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;