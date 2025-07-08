import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';

interface AnalyticsData {
  id: string;
  page_views: number;
  unique_visitors: number;
  total_time: number;
  bounce_rate: number;
  date: string;
  top_pages?: any[];
  referrers?: any[];
  devices?: any[];
}

const AnalyticsPage: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const supabase = useSupabaseClient();
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timeRange, setTimeRange] = useState('7days');
  const [authChecked, setAuthChecked] = useState(false);
  const [realTimePages, setRealTimePages] = useState<any[]>([]);

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

  const fetchRealTimePageViews = async () => {
    try {
      const daysToFetch = timeRange === '30days' ? 30 : 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);

      // Get real-time page views data
      const { data: pageViews, error } = await supabase
        .from('page_views')
        .select('page_url, page_title, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching real-time page views:', error);
        return;
      }

      // Aggregate page views by URL
      const pageViewCounts: { [key: string]: { count: number; title: string; url: string } } = {};
      
      pageViews?.forEach((view) => {
        const url = view.page_url || '/';
        const title = view.page_title || 'Untitled Page';
        
        if (!pageViewCounts[url]) {
          pageViewCounts[url] = { count: 0, title, url };
        }
        pageViewCounts[url].count++;
      });

      // Convert to array and sort by count
      const sortedPages = Object.values(pageViewCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      setRealTimePages(sortedPages);
    } catch (error) {
      console.error('Error in fetchRealTimePageViews:', error);
    }
  };

  useEffect(() => {
    const checkAdmin = async () => {
      console.log('Analytics: Checking admin status...');
      
      if (!user) {
        console.log('Analytics: No user found, redirecting to login');
        router.push('/auth/login');
        return;
      }

      try {
        console.log('Analytics: Checking user:', { id: user.id, email: user.email, metadata: user.user_metadata });
        
        // Check profile in Supabase
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError && !profileError.message.includes('Results contain 0 rows')) {
          console.error('Analytics: Profile error:', profileError);
          throw profileError;
        }

        console.log('Analytics: Profile found:', profile);

        // Check for admin status in both metadata and profile
        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        const isProfileAdmin = profile?.role === 'admin';
        const isUserAdmin = isMetadataAdmin || isProfileAdmin;

        console.log('Analytics: Admin check:', { isMetadataAdmin, isProfileAdmin, isUserAdmin });
        setIsAdmin(isUserAdmin);
        setAuthChecked(true);

        if (!isUserAdmin) {
          console.log('Analytics: User is not admin, redirecting to dashboard');
          router.push('/dashboard');
          return;
        }

        // User is admin, fetch analytics and real-time data
        fetchAnalytics();
        fetchRealTimePageViews();
        
      } catch (error) {
        console.error('Analytics: Error checking admin status:', error);
        router.push('/dashboard');
      }
    };

    checkAdmin();
  }, [user?.id, timeRange]);

  useEffect(() => {
    if (authChecked && isAdmin) {
      fetchAnalytics();
      fetchRealTimePageViews();
    }
  }, [timeRange, authChecked, isAdmin]);

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

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

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

              {isLoading || !authChecked ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-8">
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Total Page Views</h3>
                      <p className="mt-2 text-3xl font-semibold">{analytics.length > 0 ? getTotalMetrics().page_views.toLocaleString() : '0'}</p>
                      {analytics.length === 0 && <p className="text-xs text-gray-400 mt-1">Start browsing to see data</p>}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Unique Visitors</h3>
                      <p className="mt-2 text-3xl font-semibold">{analytics.length > 0 ? getTotalMetrics().unique_visitors.toLocaleString() : '0'}</p>
                      {analytics.length === 0 && <p className="text-xs text-gray-400 mt-1">Tracking visitor sessions</p>}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Average Time on Site</h3>
                      <p className="mt-2 text-3xl font-semibold">{analytics.length > 0 ? formatTime(getTotalMetrics().total_time / analytics.length || 0) : '0m'}</p>
                      {analytics.length === 0 && <p className="text-xs text-gray-400 mt-1">Time measurement active</p>}
                    </div>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-sm font-medium text-gray-500">Bounce Rate</h3>
                      <p className="mt-2 text-3xl font-semibold">{analytics.length > 0 ? averageBounceRate : '0'}%</p>
                      {analytics.length === 0 && <p className="text-xs text-gray-400 mt-1">Calculating bounce rates</p>}
                    </div>
                  </div>

                  {/* Charts Section */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Page Views Chart */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4">Page Views Trend</h3>
                      <div className="h-64">
                        {analytics.length > 0 ? (
                          <div className="flex items-end space-x-1 h-full">
                            {analytics.slice().reverse().map((day, index) => {
                              const maxViews = Math.max(...analytics.map(d => d.page_views));
                              const height = maxViews > 0 ? (day.page_views / maxViews) * 100 : 0;
                              return (
                                <div key={day.id} className="flex-1 flex flex-col items-center">
                                  <div
                                    className="bg-blue-500 hover:bg-blue-600 transition-colors w-full rounded-t cursor-pointer"
                                    style={{ height: `${height}%`, minHeight: '4px' }}
                                    title={`${new Date(day.date).toLocaleDateString()}: ${day.page_views} views`}
                                  />
                                  <span className="text-xs text-gray-500 mt-1 transform -rotate-45 origin-top-left">
                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📊</div>
                              <p className="font-medium">No chart data yet</p>
                              <p className="text-sm">Charts will appear after running daily aggregation</p>
                              <div className="mt-3 p-2 bg-blue-50 rounded text-blue-700 text-xs">
                                Run: <code>node scripts/run-analytics-aggregation.js</code>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Top Pages */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4">Top Pages (Real-time)</h3>
                      <div className="space-y-3">
                        {realTimePages.length > 0 ? (
                          realTimePages.slice(0, 5).map((page: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{page.title}</p>
                                <p className="text-xs text-gray-400 truncate">{page.url}</p>
                                <p className="text-sm text-gray-500">{page.count} views</p>
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-green-500 h-2 rounded-full"
                                  style={{
                                    width: `${Math.min((page.count / Math.max(...realTimePages.map(p => p.count))) * 100, 100)}%`
                                  }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No page views recorded yet.</p>
                            <p className="text-sm">Start browsing your website to see top pages!</p>
                            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                              <p className="text-sm text-blue-700">
                                💡 <strong>Tip:</strong> Navigate to different pages on your website to see real-time analytics data appear here.
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Traffic Sources and Device Breakdown */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Traffic Sources */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4">Traffic Sources</h3>
                      <div className="space-y-3">
                        {analytics.length > 0 && analytics[0].referrers && Array.isArray(analytics[0].referrers) && analytics[0].referrers.length > 0 ? (
                          analytics[0].referrers.slice(0, 5).map((referrer: any, index: number) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                              <div>
                                <p className="font-medium text-gray-900">{referrer.referrer || 'Unknown'}</p>
                                <p className="text-sm text-gray-500">{referrer.visits || 0} visits</p>
                              </div>
                              <div className="w-16 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-purple-500 h-2 rounded-full"
                                  style={{ width: `${Math.min((referrer.visits || 0) / Math.max(...(analytics[0].referrers?.map((r: any) => r.visits || 0) || [1])) * 100, 100)}%` }}
                                />
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No referrer data available yet.</p>
                            <p className="text-sm">Traffic sources will appear as visitors arrive!</p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Device Breakdown */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-semibold mb-4">Device Types</h3>
                      <div className="space-y-3">
                        {analytics.length > 0 && analytics[0].devices && Array.isArray(analytics[0].devices) && analytics[0].devices.length > 0 ? (
                          analytics[0].devices.map((device: any, index: number) => {
                            const colors = ['bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-red-500'];
                            const color = colors[index % colors.length];
                            return (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                <div className="flex items-center">
                                  <div className={`w-3 h-3 rounded-full ${color} mr-3`}></div>
                                  <div>
                                    <p className="font-medium text-gray-900 capitalize">{device.device || 'Unknown'}</p>
                                    <p className="text-sm text-gray-500">{device.count || 0} visits</p>
                                  </div>
                                </div>
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`${color} h-2 rounded-full`}
                                    style={{ width: `${Math.min((device.count || 0) / Math.max(...(analytics[0].devices?.map((d: any) => d.count || 0) || [1])) * 100, 100)}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <p>No device data available yet.</p>
                            <p className="text-sm">Device breakdown will show as users visit!</p>
                          </div>
                        )}
                      </div>
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
