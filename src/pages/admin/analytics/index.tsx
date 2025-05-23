import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface AnalyticsData {
  id: string;
  page_views: number;
  unique_visitors: number;
  total_time: number;
  bounce_rate: number;
  date: string;
}

const AnalyticsPage: NextPage = () => {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const supabase = useSupabaseClient();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7days');

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const daysToFetch = timeRange === '30days' ? 30 : 7;

      // First ensure the table exists
      const { error: tableCheckError } = await supabase
        .from('analytics_data')
        .select('id')
        .limit(1);

      if (tableCheckError) {
        // Initialize table with sample data if it doesn't exist
        await initializeAnalyticsData();
      }

      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .gte('date', new Date(Date.now() - daysToFetch * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Error loading analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const initializeAnalyticsData = async () => {
    try {
      // Generate sample data for the last 30 days
      const sampleData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        return {
          date: date.toISOString().split('T')[0],
          page_views: Math.floor(Math.random() * 1000) + 500,
          unique_visitors: Math.floor(Math.random() * 500) + 200,
          total_time: Math.floor(Math.random() * 120) + 60,
          bounce_rate: Math.floor(Math.random() * 30) + 20
        };
      });

      const { error } = await supabase
        .from('analytics_data')
        .insert(sampleData);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error initializing analytics data:', error);
    }
  };

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }

    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }

    fetchAnalytics();
  }, [user, isAdmin, timeRange]);

  const getTotalMetrics = () => {
    return analytics.reduce((acc, curr) => ({
      page_views: acc.page_views + curr.page_views,
      unique_visitors: acc.unique_visitors + curr.unique_visitors,
      total_time: acc.total_time + curr.total_time,
      bounce_rate: acc.bounce_rate + curr.bounce_rate
    }), {
      page_views: 0,
      unique_visitors: 0,
      total_time: 0,
      bounce_rate: 0
    });
  };

  const averageBounceRate = analytics.length > 0 ? 
    (getTotalMetrics().bounce_rate / analytics.length).toFixed(2) : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Analytics - Admin Dashboard</title>
        <meta name="description" content="Website analytics and statistics" />
      </Head>

      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Analytics</h1>
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="7days">Last 7 Days</option>
                  <option value="30days">Last 30 Days</option>
                </select>
              </div>

              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Total Page Views</h3>
                      <p className="mt-2 text-3xl font-semibold">{getTotalMetrics().page_views.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Unique Visitors</h3>
                      <p className="mt-2 text-3xl font-semibold">{getTotalMetrics().unique_visitors.toLocaleString()}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Average Time on Site</h3>
                      <p className="mt-2 text-3xl font-semibold">{formatTime(getTotalMetrics().total_time / analytics.length || 0)}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
                      <p className="mt-2 text-3xl font-semibold">{averageBounceRate}%</p>
                    </div>
                  </div>

                  {/* Daily Stats Table */}
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Daily Statistics</h2>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Page Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unique Visitors</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bounce Rate</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {analytics.map((day) => (
                            <tr key={day.id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {new Date(day.date).toLocaleDateString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {day.page_views.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {day.unique_visitors.toLocaleString()}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {formatTime(day.total_time)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {day.bounce_rate}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AnalyticsPage;
