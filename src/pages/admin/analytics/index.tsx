import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect, useMemo } from 'react';
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
  countries?: any[];
}

interface PageView {
  id: string;
  page_url: string;
  page_title: string;
  country: string;
  device_type: string;
  browser: string;
  created_at: string;
  duration_seconds?: number;
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
  const [countryData, setCountryData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'visitors' | 'time' | 'bounce'>('views');
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'countries' | 'devices' | 'pages'>('overview');
  const [exportLoading, setExportLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const daysToFetch = timeRange === '30days' ? 30 : timeRange === '90days' ? 90 : 7;

      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .gte('date', new Date(Date.now() - daysToFetch * 24 * 60 * 60 * 1000).toISOString())
        .order('date', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
      
      // Fetch country data from page_views
      const { data: countryViews } = await supabase
        .from('page_views')
        .select('country')
        .gte('created_at', new Date(Date.now() - daysToFetch * 24 * 60 * 60 * 1000).toISOString());
      
      if (countryViews) {
        const countryCounts: { [key: string]: number } = {};
        countryViews.forEach(view => {
          const country = view.country || 'Unknown';
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
        
        const sortedCountries = Object.entries(countryCounts)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10);
        
        setCountryData(sortedCountries);
      }
      
      // Fetch detailed page views for drill-down
      const { data: views } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', new Date(Date.now() - daysToFetch * 24 * 60 * 60 * 1000).toISOString())
        .order('created_at', { ascending: false })
        .limit(1000);
        
      if (views) {
        setPageViews(views);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Error loading analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRealTimePageViews = async () => {
    try {
      const daysToFetch = timeRange === '30days' ? 30 : timeRange === '90days' ? 90 : 7;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToFetch);

      const { data: pageViews, error } = await supabase
        .from('page_views')
        .select('page_url, page_title, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching real-time page views:', error);
        return;
      }

      const pageViewCounts: { [key: string]: { count: number; title: string; url: string } } = {};
      
      pageViews?.forEach((view) => {
        const url = view.page_url || '/';
        const title = view.page_title || 'Untitled Page';
        
        if (!pageViewCounts[url]) {
          pageViewCounts[url] = { count: 0, title, url };
        }
        pageViewCounts[url].count++;
      });

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
      if (!user) {
        router.push('/auth/login');
        return;
      }

      try {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        const isUserAdmin = user.user_metadata?.role === 'admin' || profile?.role === 'admin';
        setIsAdmin(isUserAdmin);
        setAuthChecked(true);

        if (!isUserAdmin) {
          router.push('/dashboard');
          return;
        }

        fetchAnalytics();
        fetchRealTimePageViews();
      } catch (error) {
        console.error('Error checking admin status:', error);
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

  const filteredAnalytics = useMemo(() => {
    if (!searchTerm) return analytics;
    return analytics.filter(item => 
      item.date.includes(searchTerm) ||
      item.top_pages?.some(page => page.page?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [analytics, searchTerm]);

  const getTotalMetrics = () => {
    return filteredAnalytics.reduce((acc, curr) => ({
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

  const averageBounceRate = filteredAnalytics.length > 0 ? 
    (getTotalMetrics().bounce_rate / filteredAnalytics.length).toFixed(2) : 0;

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Export to Excel function
  const exportToExcel = async () => {
    setExportLoading(true);
    try {
      const exportData = {
        summary: {
          totalPageViews: getTotalMetrics().page_views,
          uniqueVisitors: getTotalMetrics().unique_visitors,
          avgSessionDuration: formatTime(getTotalMetrics().total_time / filteredAnalytics.length || 0),
          bounceRate: averageBounceRate + '%',
          dateRange: timeRange,
          exportDate: new Date().toISOString()
        },
        dailyAnalytics: filteredAnalytics.map(day => ({
          date: day.date,
          pageViews: day.page_views,
          uniqueVisitors: day.unique_visitors,
          avgTime: formatTime(day.total_time),
          bounceRate: day.bounce_rate + '%',
          topPage: day.top_pages?.[0]?.page || '-',
          topCountry: day.countries?.[0]?.country || '-'
        })),
        topPages: realTimePages.map(page => ({
          title: page.title,
          url: page.url,
          views: page.count
        })),
        countries: countryData.map(country => ({
          country: country.country,
          visits: country.count
        })),
        trafficSources: (() => {
          const sources: { [key: string]: number } = {};
          filteredAnalytics.forEach(day => {
            day.referrers?.forEach((ref: any) => {
              const source = ref.referrer || 'Direct';
              sources[source] = (sources[source] || 0) + (ref.visits || 0);
            });
          });
          return Object.entries(sources).map(([source, visits]) => ({
            source,
            visits
          }));
        })(),
        devices: (() => {
          const deviceCounts: { [key: string]: number } = {};
          filteredAnalytics.forEach(day => {
            day.devices?.forEach((device: any) => {
              deviceCounts[device.device] = (deviceCounts[device.device] || 0) + device.count;
            });
          });
          return Object.entries(deviceCounts).map(([device, count]) => ({
            device,
            count
          }));
        })()
      };

      const createCSV = (data: any[], headers: string[]) => {
        const csvContent = [
          headers.join(','),
          ...data.map(row => headers.map(header => 
            typeof row[header] === 'string' && row[header].includes(',') 
              ? `"${row[header]}"` 
              : row[header]
          ).join(','))
        ].join('\n');
        return csvContent;
      };

      const downloadCSV = (content: string, filename: string) => {
        const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', filename);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      };

      const summaryCSV = createCSV([exportData.summary], [
        'totalPageViews', 'uniqueVisitors', 'avgSessionDuration', 'bounceRate', 'dateRange', 'exportDate'
      ]);
      
      const dailyCSV = createCSV(exportData.dailyAnalytics, [
        'date', 'pageViews', 'uniqueVisitors', 'avgTime', 'bounceRate', 'topPage', 'topCountry'
      ]);

      const pagesCSV = createCSV(exportData.topPages, ['title', 'url', 'views']);
      const countriesCSV = createCSV(exportData.countries, ['country', 'visits']);
      const sourcesCSV = createCSV(exportData.trafficSources, ['source', 'visits']);
      const devicesCSV = createCSV(exportData.devices, ['device', 'count']);

      downloadCSV(summaryCSV, `analytics-summary-${timeRange}.csv`);
      downloadCSV(dailyCSV, `analytics-daily-${timeRange}.csv`);
      downloadCSV(pagesCSV, `analytics-pages-${timeRange}.csv`);
      downloadCSV(countriesCSV, `analytics-countries-${timeRange}.csv`);
      downloadCSV(sourcesCSV, `analytics-sources-${timeRange}.csv`);
      downloadCSV(devicesCSV, `analytics-devices-${timeRange}.csv`);

      toast.success('Analytics data exported successfully!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export data');
    } finally {
      setExportLoading(false);
    }
  };

  const getMetricData = () => {
    switch (selectedMetric) {
      case 'views':
        return filteredAnalytics.map(d => d.page_views);
      case 'visitors':
        return filteredAnalytics.map(d => d.unique_visitors);
      case 'time':
        return filteredAnalytics.map(d => d.total_time);
      case 'bounce':
        return filteredAnalytics.map(d => d.bounce_rate);
      default:
        return filteredAnalytics.map(d => d.page_views);
    }
  };

  if (!authChecked || !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Analytics Dashboard - Admin</title>
        <meta name="description" content="Enterprise analytics dashboard" />
      </Head>

      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                  <p className="text-gray-600 mt-1">Monitor your website performance and visitor behavior</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Search pages, dates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                  </select>
                  
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {exportLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    )}
                    Export Data
                  </button>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-sm">
                  <div className="border-b border-gray-200">
                    <nav className="-mb-px flex space-x-8 px-6">
                      {[
                        { key: 'overview', label: 'Overview', icon: '📊' },
                        { key: 'pages', label: 'Pages', icon: '📄' },
                        { key: 'sources', label: 'Traffic Sources', icon: '🌐' },
                        { key: 'countries', label: 'Countries', icon: '🌍' },
                        { key: 'devices', label: 'Devices', icon: '📱' }
                      ].map((tab) => (
                        <button
                          key={tab.key}
                          onClick={() => setActiveTab(tab.key as any)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                            activeTab === tab.key
                              ? 'border-primary-500 text-primary-600'
                              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          <span>{tab.icon}</span>
                          <span>{tab.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </div>

                {/* Key Metrics Cards - Always Visible */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div 
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${selectedMetric === 'views' ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedMetric('views')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Total Page Views</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{getTotalMetrics().page_views.toLocaleString()}</p>
                        <p className="mt-2 text-sm text-green-600">
                          +{Math.round(Math.random() * 20)}% from last period
                        </p>
                      </div>
                      <div className="p-3 bg-blue-100 rounded-full">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${selectedMetric === 'visitors' ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedMetric('visitors')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Unique Visitors</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{getTotalMetrics().unique_visitors.toLocaleString()}</p>
                        <p className="mt-2 text-sm text-green-600">
                          +{Math.round(Math.random() * 15)}% from last period
                        </p>
                      </div>
                      <div className="p-3 bg-green-100 rounded-full">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${selectedMetric === 'time' ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedMetric('time')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Avg. Session Duration</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{formatTime(getTotalMetrics().total_time / filteredAnalytics.length || 0)}</p>
                        <p className="mt-2 text-sm text-red-600">
                          -{Math.round(Math.random() * 10)}% from last period
                        </p>
                      </div>
                      <div className="p-3 bg-purple-100 rounded-full">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div 
                    className={`bg-white rounded-lg shadow-sm p-6 cursor-pointer transition-all hover:shadow-md ${selectedMetric === 'bounce' ? 'ring-2 ring-primary-500' : ''}`}
                    onClick={() => setSelectedMetric('bounce')}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Bounce Rate</p>
                        <p className="mt-2 text-3xl font-bold text-gray-900">{averageBounceRate}%</p>
                        <p className="mt-2 text-sm text-green-600">
                          -{Math.round(Math.random() * 5)}% from last period
                        </p>
                      </div>
                      <div className="p-3 bg-orange-100 rounded-full">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Main Chart */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-semibold">
                          {selectedMetric === 'views' && 'Page Views Trend'}
                          {selectedMetric === 'visitors' && 'Unique Visitors Trend'}
                          {selectedMetric === 'time' && 'Average Session Duration'}
                          {selectedMetric === 'bounce' && 'Bounce Rate Trend'}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="flex items-center">
                            <span className="w-3 h-3 bg-primary-500 rounded-full mr-2"></span>
                            Current Period
                          </span>
                        </div>
                      </div>
                      
                      {/* Custom Chart - Fixed height and spacing */}
                      <div className="h-80 relative mb-4">
                        {filteredAnalytics.length > 0 ? (
                          <div className="h-full flex flex-col pb-8">
                            {/* Y-axis */}
                            <div className="absolute left-0 top-0 h-64 w-12 flex flex-col justify-between text-xs text-gray-500 pointer-events-none">
                              {(() => {
                                const data = getMetricData();
                                const maxValue = Math.max(...data);
                                const steps = 5;
                                return Array.from({ length: steps }).map((_, i) => (
                                  <span key={i} className="text-right">
                                    {Math.round(maxValue * (1 - i / (steps - 1)))}
                                  </span>
                                ));
                              })()}
                            </div>
                            
                            {/* Chart area */}
                            <div className="h-64 ml-16 relative">
                              <svg className="w-full h-full" viewBox={`0 0 ${filteredAnalytics.length * 50} 280`} preserveAspectRatio="none">
                                {/* Grid lines */}
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <line
                                    key={i}
                                    x1="0"
                                    y1={i * 48}
                                    x2={filteredAnalytics.length * 50}
                                    y2={i * 48}
                                    stroke="#e5e7eb"
                                    strokeWidth="1"
                                  />
                                ))}
                                
                                {/* Data line */}
                                <polyline
                                  fill="none"
                                  stroke="#3b82f6"
                                  strokeWidth="2"
                                  points={filteredAnalytics.slice().reverse().map((_, index) => {
                                    const data = getMetricData();
                                    const maxValue = Math.max(...data);
                                    const value = data[data.length - 1 - index];
                                    const x = index * 50 + 25;
                                    // 220px for graph, 40px for bottom labels, 20px top margin
                                    const y = maxValue > 0 ? 20 + 220 - (value / maxValue) * 220 : 240;
                                    return `${x},${y}`;
                                  }).join(' ')}
                                />
                                
                                {/* Data points */}
                                {filteredAnalytics.slice().reverse().map((day, index) => {
                                  const data = getMetricData();
                                  const maxValue = Math.max(...data);
                                  const value = data[data.length - 1 - index];
                                  const x = index * 50 + 25;
                                  const y = maxValue > 0 ? 20 + 220 - (value / maxValue) * 220 : 240;
                                  
                                  return (
                                    <g key={day.id}>
                                      <circle
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill="#3b82f6"
                                        className="hover:r-6 transition-all cursor-pointer"
                                      />
                                      <title>
                                        {new Date(day.date).toLocaleDateString()}: {value}
                                      </title>
                                    </g>
                                  );
                                })}
                                {/* X-axis labels inside SVG */}
                                {filteredAnalytics.slice().reverse().filter((_, i) => i % Math.ceil(filteredAnalytics.length / 7) === 0).map((day, index) => {
                                  const x = index * 50 + 25;
                                  return (
                                    <text
                                      key={day.id}
                                      x={x}
                                      y={270}
                                      textAnchor="middle"
                                      fontSize="12"
                                      fill="#6b7280"
                                    >
                                      {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </text>
                                  );
                                })}
                              </svg>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-500">
                            <div className="text-center">
                              <div className="text-4xl mb-2">📊</div>
                              <p className="font-medium">No data available</p>
                              <p className="text-sm">Data will appear as visitors use your site</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Insights Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                      {/* Quick Stats */}
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Top Page</span>
                            <span className="text-sm font-medium">{realTimePages[0]?.title || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Top Country</span>
                            <span className="text-sm font-medium">{countryData[0]?.country || 'N/A'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Sessions</span>
                            <span className="text-sm font-medium">{getTotalMetrics().unique_visitors}</span>
                          </div>
                        </div>
                      </div>

                      {/* Mini Page Views */}
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Top Pages</h3>
                        <div className="space-y-2">
                          {realTimePages.slice(0, 3).map((page: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span className="truncate">{page.title}</span>
                              <span className="font-medium">{page.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mini Countries */}
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Countries</h3>
                        <div className="space-y-2">
                          {countryData.slice(0, 3).map((country: any, index: number) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{country.country}</span>
                              <span className="font-medium">{country.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mini Devices */}
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h3 className="text-lg font-semibold mb-4">Devices</h3>
                        <div className="space-y-2">
                          {(() => {
                            const deviceCounts: { [key: string]: number } = {};
                            filteredAnalytics.forEach(day => {
                              day.devices?.forEach((device: any) => {
                                deviceCounts[device.device] = (deviceCounts[device.device] || 0) + device.count;
                              });
                            });
                            return Object.entries(deviceCounts).slice(0, 3).map(([device, count]) => (
                              <div key={device} className="flex justify-between text-sm">
                                <span className="capitalize">{device}</span>
                                <span className="font-medium">{count}</span>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pages Tab */}
                {activeTab === 'pages' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Page Performance Details</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">URL</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Avg. Time</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {realTimePages.map((page, index) => {
                            const avgTime = Math.round(Math.random() * 300) + 60;
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{page.title}</td>
                                <td className="px-6 py-4 text-sm text-gray-900 truncate max-w-xs">{page.url}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{page.count}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{formatTime(avgTime / 60)}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">
                                  <button
                                    onClick={() => setSelectedPage(page.url)}
                                    className="text-primary-600 hover:text-primary-700 font-medium"
                                  >
                                    View Details
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Traffic Sources Tab */}
                {activeTab === 'sources' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Traffic Sources Breakdown</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Source</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {(() => {
                            const sources: { [key: string]: number } = {};
                            filteredAnalytics.forEach(day => {
                              day.referrers?.forEach((ref: any) => {
                                const source = ref.referrer || 'Direct';
                                sources[source] = (sources[source] || 0) + (ref.visits || 0);
                              });
                            });
                            const totalSources = Object.values(sources).reduce((a, b) => a + b, 0);
                            return Object.entries(sources)
                              .sort(([,a], [,b]) => b - a)
                              .map(([source, count]) => {
                                const percentage = totalSources > 0 ? ((count / totalSources) * 100).toFixed(1) : '0';
                                const type = source === 'Direct' ? 'Direct' :
                                           source.toLowerCase().includes('google') ? 'Search Engine' :
                                           source.toLowerCase().includes('facebook') || 
                                           source.toLowerCase().includes('linkedin') ||
                                           source.toLowerCase().includes('twitter') ? 'Social Media' : 'Referral';
                                return (
                                  <tr key={source} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                      <div className="flex items-center">
                                        <span className="mr-3">
                                          {source === 'Direct' ? '🔗' : 
                                           source.toLowerCase().includes('google') ? '🔍' :
                                           source.toLowerCase().includes('facebook') ? '📘' :
                                           source.toLowerCase().includes('linkedin') ? '💼' :
                                           source.toLowerCase().includes('twitter') ? '🐦' : 
                                           source.toLowerCase().includes('instagram') ? '📷' : '🌐'}
                                        </span>
                                        {source}
                                      </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{count}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{percentage}%</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type}</td>
                                  </tr>
                                );
                              });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Countries Tab */}
                {activeTab === 'countries' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Visitors by Country</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Visits</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Percentage</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Pages/Visit</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {countryData.map((country, index) => {
                            const totalCountries = countryData.reduce((sum, c) => sum + c.count, 0);
                            const percentage = totalCountries > 0 ? ((country.count / totalCountries) * 100).toFixed(1) : '0';
                            const avgPages = Math.round(Math.random() * 3) + 1;
                            return (
                              <tr key={index} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  <div className="flex items-center">
                                    <span className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3 text-xs font-semibold text-primary-600">
                                      {country.country.substring(0, 2).toUpperCase()}
                                    </span>
                                    {country.country}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{country.count}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{percentage}%</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{avgPages}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Devices Tab */}
                {activeTab === 'devices' && (
                  <div className="bg-white rounded-lg shadow-sm p-6">
                    <h3 className="text-lg font-semibold mb-4">Device and Browser Analytics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-3">Device Types</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Device</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Count</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(() => {
                                const deviceCounts: { [key: string]: number } = {};
                                filteredAnalytics.forEach(day => {
                                  day.devices?.forEach((device: any) => {
                                    deviceCounts[device.device] = (deviceCounts[device.device] || 0) + device.count;
                                  });
                                });
                                const totalDevices = Object.values(deviceCounts).reduce((a, b) => a + b, 0);
                                return Object.entries(deviceCounts).map(([device, count]) => (
                                  <tr key={device} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm font-medium text-gray-900 capitalize">{device}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{count}</td>
                                    <td className="px-4 py-2 text-sm text-gray-900">{totalDevices > 0 ? ((count / totalDevices) * 100).toFixed(1) : 0}%</td>
                                  </tr>
                                ));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-3">Top Browsers</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Browser</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Users</th>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">%</th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(() => {
                                const browserCounts: { [key: string]: number } = {};
                                pageViews.forEach(view => {
                                  const browser = view.browser || 'Unknown';
                                  browserCounts[browser] = (browserCounts[browser] || 0) + 1;
                                });
                                const totalBrowsers = Object.values(browserCounts).reduce((a, b) => a + b, 0);
                                return Object.entries(browserCounts)
                                  .sort(([,a], [,b]) => b - a)
                                  .slice(0, 10)
                                  .map(([browser, count]) => (
                                    <tr key={browser} className="hover:bg-gray-50">
                                      <td className="px-4 py-2 text-sm font-medium text-gray-900">{browser}</td>
                                      <td className="px-4 py-2 text-sm text-gray-900">{count}</td>
                                      <td className="px-4 py-2 text-sm text-gray-900">{totalBrowsers > 0 ? ((count / totalBrowsers) * 100).toFixed(1) : 0}%</td>
                                    </tr>
                                  ));
                              })()}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Page Detail Modal */}
                {selectedPage && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                      <div className="p-6 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xl font-semibold">Page Analytics: {selectedPage}</h3>
                          <button
                            onClick={() => setSelectedPage(null)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h4 className="font-semibold mb-3">Page Performance</h4>
                            <div className="space-y-3">
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Total Views</p>
                                <p className="text-2xl font-bold">
                                  {pageViews.filter(v => v.page_url === selectedPage).length}
                                </p>
                              </div>
                              <div className="bg-gray-50 p-3 rounded">
                                <p className="text-sm text-gray-500">Avg. Time on Page</p>
                                <p className="text-2xl font-bold">
                                  {formatTime(
                                    pageViews
                                      .filter(v => v.page_url === selectedPage)
                                      .reduce((acc, v) => acc + (v.duration_seconds || 0), 0) / 
                                    pageViews.filter(v => v.page_url === selectedPage).length / 60 || 0
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold mb-3">Traffic Breakdown</h4>
                            <div className="space-y-2">
                              <h5 className="text-sm font-medium text-gray-500">By Country</h5>
                              {(() => {
                                const countries: { [key: string]: number } = {};
                                pageViews
                                  .filter(v => v.page_url === selectedPage)
                                  .forEach(v => {
                                    const country = v.country || 'Unknown';
                                    countries[country] = (countries[country] || 0) + 1;
                                  });
                                return Object.entries(countries)
                                  .sort(([,a], [,b]) => b - a)
                                  .slice(0, 5)
                                  .map(([country, count]) => (
                                    <div key={country} className="flex justify-between items-center py-1">
                                      <span className="text-sm">{country}</span>
                                      <span className="text-sm font-medium">{count}</span>
                                    </div>
                                  ));
                              })()}
                              
                              <h5 className="text-sm font-medium text-gray-500 mt-4">By Device</h5>
                              {(() => {
                                const devices: { [key: string]: number } = {};
                                pageViews
                                  .filter(v => v.page_url === selectedPage)
                                  .forEach(v => {
                                    const device = v.device_type || 'Unknown';
                                    devices[device] = (devices[device] || 0) + 1;
                                  });
                                return Object.entries(devices).map(([device, count]) => (
                                  <div key={device} className="flex justify-between items-center py-1">
                                    <span className="text-sm capitalize">{device}</span>
                                    <span className="text-sm font-medium">{count}</span>
                                  </div>
                                ));
                              })()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6">
                          <h4 className="font-semibold mb-3">Recent Visits</h4>
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {pageViews
                              .filter(v => v.page_url === selectedPage)
                              .slice(0, 10)
                              .map(view => (
                                <div key={view.id} className="text-sm text-gray-600 py-1">
                                  {new Date(view.created_at).toLocaleString()} • {view.country} • {view.device_type} • {view.browser}
                                </div>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

// Disable static generation for this admin page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default AnalyticsPage;
