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
      // Fetch total courses with proper count query
      const { count: coursesCount, error: coursesError } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      if (coursesError) {
        console.error('Error fetching courses count:', coursesError);
      }

      // Fetch unique active students count
      const { data: activeEnrollments, error: studentsError } = await supabase
        .from('enrollments')
        .select('user_id')
        .eq('status', 'active');

      if (studentsError) {
        console.error('Error fetching students count:', studentsError);
      }

      // Calculate unique student count
      const uniqueStudents = activeEnrollments 
        ? new Set(activeEnrollments.map(e => e.user_id)).size 
        : 0;

      // Fetch course completion rate using enrollments table
      const { count: completionsCount, error: completionsError } = await supabase
        .from('enrollments')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed');

      if (completionsError) {
        console.error('Error fetching completions count:', completionsError);
      }

      // Fetch recent activity with more meaningful data
      const { data: activity, error: activityError } = await supabase
        .from('enrollments')
        .select(`
          id,
          enrolled_at,
          course_id,
          user_id,
          status
        `)
        .order('enrolled_at', { ascending: false })
        .limit(5);

      if (activityError) {
        console.error('Error fetching recent activity:', activityError);
      }

      // Fetch course details for recent activities
      let enhancedActivity: any[] = [];
      if (activity && activity.length > 0) {
        const courseIds = [...new Set(activity.map(a => a.course_id))];
        const userIds = [...new Set(activity.map(a => a.user_id))];

        const { data: coursesData } = await supabase
          .from('courses')
          .select('id, title')
          .in('id', courseIds);

        const { data: usersData } = await supabase
          .from('profiles')
          .select('id, full_name, email')
          .in('id', userIds);

        const courseMap = new Map(coursesData?.map(c => [c.id, c.title]) || []);
        const userMap = new Map(usersData?.map(u => [u.id, u.full_name || u.email]) || []);

        enhancedActivity = activity.map(a => ({
          ...a,
          course_title: courseMap.get(a.course_id) || 'Unknown Course',
          user_name: userMap.get(a.user_id) || 'Unknown User'
        }));
      }

      // Fetch popular courses with simpler query
      const { data: popular, error: popularError } = await supabase
        .from('courses')
        .select(`
          id,
          title,
          slug,
          description
        `)
        .limit(5);

      if (popularError) {
        console.error('Error fetching popular courses:', popularError);
      }

      // Calculate revenue from payments table
      const { data: paidPayments, error: revenueError } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      let totalRevenue = 0;
      if (revenueError) {
        console.error('Error fetching revenue from payments:', revenueError);
        
        // Fallback: try to get revenue from invoices table
        const { data: paidInvoices, error: invoiceRevenueError } = await supabase
          .from('invoices')
          .select('total_amount')
          .eq('status', 'paid');

        if (!invoiceRevenueError && paidInvoices) {
          totalRevenue = paidInvoices.reduce((sum, invoice) => {
            const amount = parseFloat(invoice.total_amount) || 0;
            return sum + amount;
          }, 0);
        }
      } else if (paidPayments) {
        totalRevenue = paidPayments.reduce((sum, payment) => {
          const amount = typeof payment.amount === 'number' ? payment.amount : parseFloat(payment.amount) || 0;
          return sum + amount;
        }, 0);
      }

      setStats({
        totalCourses: coursesCount || 0,
        activeStudents: uniqueStudents,
        completionRate: Math.round((completionsCount || 0) / (uniqueStudents || 1) * 100),
        revenue: totalRevenue
      });

      setRecentActivity(enhancedActivity || []);
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
            {recentActivity.length > 0 ? (
              recentActivity.map((activity) => (
                <div key={activity.id} className="border-l-4 border-primary-500 pl-4">
                  <p className="text-sm text-gray-600">
                    {activity.user_name || 'Student'} enrolled in {activity.course_title || 'course'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(activity.enrolled_at).toLocaleDateString()} • Status: {activity.status || 'active'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No recent activity</p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="p-6 bg-white rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold mb-4">Recent Courses</h3>
          <div className="space-y-4">
            {popularCourses.length > 0 ? (
              popularCourses.map((course) => (
                <div key={course.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                    <p className="text-xs text-gray-500">
                      {course.description ? course.description.substring(0, 50) + '...' : 'No description'}
                    </p>
                  </div>
                  <div className="text-sm font-medium text-primary-600">
                    Active
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No courses available</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;