import { NextPage } from 'next';
import Head from 'next/head';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface Payment {
  id: string;
  created_at: string;
  amount: number;
  status: string;
  student: {
    full_name: string;
    email: string;
  };
  course: {
    title: string;
  };
}

const RevenuePage: NextPage = () => {
  const supabase = useSupabaseClient();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    averageOrderValue: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPayments();
    fetchStats();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          id,
          created_at,
          amount,
          status,
          student:profiles(full_name, email),
          course:courses(title)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      const formattedData = (data || []).map(item => ({
        ...item,
        student: item.student[0],
        course: item.course[0]
      }));
      setPayments(formattedData);
    } catch (error) {
      console.error('Error fetching payments:', error);
      toast.error('Failed to load payment history');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Total Revenue
      const { data: totalRevenue } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed');

      // Monthly Revenue
      const monthStart = new Date();
      monthStart.setDate(1);
      monthStart.setHours(0, 0, 0, 0);

      const { data: monthlyRevenue } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'completed')
        .gte('created_at', monthStart.toISOString());

      // Pending Payments
      const { data: pendingPayments } = await supabase
        .from('payments')
        .select('amount')
        .eq('status', 'pending');

      setStats({
        totalRevenue: totalRevenue?.reduce((sum, p) => sum + p.amount, 0) || 0,
        monthlyRevenue: monthlyRevenue?.reduce((sum, p) => sum + p.amount, 0) || 0,
        pendingPayments: pendingPayments?.length || 0,
        averageOrderValue: totalRevenue && totalRevenue.length 
          ? (totalRevenue.reduce((sum, p) => sum + p.amount, 0) / totalRevenue.length)
          : 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const filteredPayments = payments.filter(payment => {
    let matchesTime = true;
    let matchesStatus = true;

    if (timeFilter !== 'all') {
      const date = new Date(payment.created_at);
      const now = new Date();
      switch (timeFilter) {
        case 'today':
          matchesTime = date.toDateString() === now.toDateString();
          break;
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesTime = date >= weekAgo;
          break;
        case 'month':
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesTime = date >= monthAgo;
          break;
      }
    }

    if (statusFilter !== 'all') {
      matchesStatus = payment.status === statusFilter;
    }

    return matchesTime && matchesStatus;
  });

  return (
    <>
      <Head>
        <title>Revenue - ITwala Academy Admin</title>
        <meta name="description" content="Track revenue and payment history" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">Revenue Overview</h1>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Monthly Revenue</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    ₹{stats.monthlyRevenue.toLocaleString()}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Pending Payments</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    {stats.pendingPayments}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                  <p className="mt-2 text-3xl font-semibold text-gray-900">
                    ₹{stats.averageOrderValue.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="mb-6 flex justify-between items-center">
                <div className="flex space-x-4">
                  <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All Time</option>
                    <option value="today">Today</option>
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                  </select>

                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>

                <button
                  onClick={() => {/* Export functionality */}}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Export CSV
                </button>
              </div>

              {/* Payments Table */}
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(payment.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{payment.student.full_name}</div>
                            <div className="text-sm text-gray-500">{payment.student.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.course.title}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            ₹{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              payment.status === 'completed' 
                                ? 'bg-green-100 text-green-800'
                                : payment.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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

export default RevenuePage;
