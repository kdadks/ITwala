import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect, useMemo } from 'react';
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
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [authChecked, setAuthChecked] = useState(false);
  const [realTimePages, setRealTimePages] = useState<any[]>([]);
  const [countryData, setCountryData] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMetric, setSelectedMetric] = useState<'views' | 'visitors' | 'time' | 'bounce'>('views');
  const [pageViews, setPageViews] = useState<PageView[]>([]);
  const [selectedPage, setSelectedPage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'sources' | 'countries' | 'devices' | 'pages'>('overview');
  const [exportLoading, setExportLoading] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getStartDate = () => {
    if (timeRange === 'today') {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d.toISOString();
    }
    if (timeRange === 'custom' && customStartDate) return new Date(customStartDate).toISOString();
    const days = timeRange === '30days' ? 30 : timeRange === '90days' ? 90 : 7;
    return new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
  };

  const getEndDate = () => {
    if (timeRange === 'custom' && customEndDate) {
      const d = new Date(customEndDate);
      d.setHours(23, 59, 59, 999);
      return d.toISOString();
    }
    return new Date().toISOString();
  };

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const startDate = getStartDate();
      const endDate = getEndDate();

      const { data, error } = await supabase
        .from('analytics_data')
        .select('*')
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) throw error;
      setAnalytics(data || []);
      
      // Fetch country data from page_views (excluding localhost)
      const { data: countryViews } = await supabase
        .from('page_views')
        .select('country')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .not('page_url', 'like', '%localhost%')
        .not('referrer', 'like', '%localhost%')
        .not('referrer', 'like', '%127.0.0.1%');
      
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
      
      // Fetch detailed page views for drill-down (excluding localhost)
      const { data: views } = await supabase
        .from('page_views')
        .select('*')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .not('page_url', 'like', '%localhost%')
        .not('referrer', 'like', '%localhost%')
        .not('referrer', 'like', '%127.0.0.1%')
        .order('created_at', { ascending: false })
        .limit(1000);
        
      if (views) {
        setPageViews(views);
      }

      setLastRefreshed(new Date());
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Error loading analytics data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await fetchAnalytics();
    await fetchRealTimePageViews();
    toast.success('Analytics data refreshed!');
  };

  const fetchRealTimePageViews = async () => {
    try {
      const rvStart = getStartDate();
      const rvEnd = getEndDate();

      const { data: pageViews, error } = await supabase
        .from('page_views')
        .select('page_url, page_title, created_at')
        .gte('created_at', rvStart)
        .lte('created_at', rvEnd)
        .not('page_url', 'like', '%localhost%')
        .not('referrer', 'like', '%localhost%')
        .not('referrer', 'like', '%127.0.0.1%')
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
        router.push('/admin/login');
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
    if (authChecked && isAdmin && timeRange !== 'custom') {
      fetchAnalytics();
      fetchRealTimePageViews();
    }
  }, [timeRange, authChecked, isAdmin]);

  // Real-time polling: refresh data every 30 seconds
  useEffect(() => {
    if (!authChecked || !isAdmin) return;

    const refreshInterval = setInterval(() => {
      console.log('🔄 Auto-refreshing analytics data...');
      fetchAnalytics();
      fetchRealTimePageViews();
    }, 30000); // 30 seconds

    return () => clearInterval(refreshInterval);
  }, [authChecked, isAdmin, timeRange, customStartDate, customEndDate]);

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

  // ── Derived helpers ──────────────────────────────────────────────
  const totals = getTotalMetrics();

  const periodLabel =
    timeRange === 'today' ? 'Today' :
    timeRange === '7days' ? 'Last 7 days' :
    timeRange === '30days' ? 'Last 30 days' :
    timeRange === '90days' ? 'Last 90 days' :
    (customStartDate && customEndDate) ? `${customStartDate} – ${customEndDate}` : 'Custom range';

  const metricCards = [
    {
      key: 'views' as const,
      label: 'Total Page Views',
      value: totals.page_views.toLocaleString(),
      color: 'primary',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      key: 'visitors' as const,
      label: 'Unique Visitors',
      value: totals.unique_visitors.toLocaleString(),
      color: 'secondary',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      key: 'time' as const,
      label: 'Avg. Session',
      value: formatTime(totals.total_time / (filteredAnalytics.length || 1)),
      color: 'accent',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      key: 'bounce' as const,
      label: 'Bounce Rate',
      value: `${averageBounceRate}%`,
      color: 'warning',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
  ];

  const colorMap: Record<string, { ring: string; bg: string; text: string; bar: string; badge: string }> = {
    primary:   { ring: 'ring-primary-500',   bg: 'bg-primary-50',   text: 'text-primary-600',   bar: 'bg-primary-500',   badge: 'bg-primary-100 text-primary-700'   },
    secondary: { ring: 'ring-secondary-500', bg: 'bg-secondary-50', text: 'text-secondary-600', bar: 'bg-secondary-500', badge: 'bg-secondary-100 text-secondary-700' },
    accent:    { ring: 'ring-accent-500',    bg: 'bg-accent-50',    text: 'text-accent-600',    bar: 'bg-accent-500',    badge: 'bg-accent-100 text-accent-700'    },
    warning:   { ring: 'ring-yellow-400',    bg: 'bg-yellow-50',    text: 'text-yellow-600',    bar: 'bg-yellow-400',    badge: 'bg-yellow-100 text-yellow-700'    },
  };

  const tabs = [
    { key: 'overview', label: 'Overview' },
    { key: 'pages', label: 'Pages' },
    { key: 'sources', label: 'Traffic Sources' },
    { key: 'countries', label: 'Countries' },
    { key: 'devices', label: 'Devices' },
  ];

  return (
    <>
      <Head>
        <title>Analytics — ITwala Admin</title>
        <meta name="description" content="Analytics dashboard" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50">

        {/* ── Page header ── */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-6 py-5">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">

              {/* Title */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold tracking-[0.15em] uppercase text-primary-600 bg-primary-50 border border-primary-200 px-2.5 py-0.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
                    Live
                  </span>
                  {lastRefreshed && (
                    <span className="text-xs text-gray-400">
                      Updated {lastRefreshed.toLocaleTimeString()} · auto-refresh 30s
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <p className="text-sm text-gray-500 mt-0.5">Monitor website performance and visitor behaviour</p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-end gap-2">
                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Search</label>
                  <input
                    type="text"
                    placeholder="Search pages, dates…"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="h-9 px-3 text-sm bg-white border border-gray-300 text-gray-700 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">Period</label>
                  <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    className="h-9 px-3 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="today">Today</option>
                    <option value="7days">Last 7 Days</option>
                    <option value="30days">Last 30 Days</option>
                    <option value="90days">Last 90 Days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                </div>

                {timeRange === 'custom' && (
                  <>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">From</label>
                      <input
                        type="date"
                        value={customStartDate}
                        onChange={(e) => setCustomStartDate(e.target.value)}
                        className="h-9 px-3 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide">To</label>
                      <input
                        type="date"
                        value={customEndDate}
                        onChange={(e) => setCustomEndDate(e.target.value)}
                        className="h-9 px-3 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide opacity-0 select-none">·</label>
                      <button
                        onClick={() => { fetchAnalytics(); fetchRealTimePageViews(); }}
                        disabled={!customStartDate || !customEndDate}
                        className="h-9 px-4 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide opacity-0 select-none">·</label>
                  <button
                    onClick={handleManualRefresh}
                    disabled={isRefreshing}
                    className="h-9 px-4 text-sm font-medium bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 rounded-lg disabled:opacity-40 flex items-center gap-2 transition-colors"
                  >
                    <svg className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                  </button>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-gray-500 mb-1 uppercase tracking-wide opacity-0 select-none">·</label>
                  <button
                    onClick={exportToExcel}
                    disabled={exportLoading}
                    className="h-9 px-4 text-sm font-medium bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-40 flex items-center gap-2 transition-colors shadow-sm"
                  >
                    {exportLoading
                      ? <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    }
                    Export CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-6 space-y-5">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <>
              {/* ── KPI Cards ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {metricCards.map((card) => {
                  const c = colorMap[card.color];
                  const isActive = selectedMetric === card.key;
                  return (
                    <button
                      key={card.key}
                      onClick={() => setSelectedMetric(card.key)}
                      className={`text-left bg-white border rounded-xl p-5 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none ${
                        isActive ? `border-primary-400 ring-1 ${c.ring}` : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${c.bg} ${c.text}`}>
                          {card.icon}
                        </div>
                        {isActive && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full tracking-wide ${c.badge}`}>
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1 tabular-nums">{card.value}</div>
                      <div className="text-xs text-gray-500 uppercase tracking-[0.12em] font-medium">{card.label}</div>
                    </button>
                  );
                })}
              </div>

              {/* ── Tab Container ── */}
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {/* Tab bar */}
                <div className="flex overflow-x-auto border-b border-gray-200">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className={`px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px ${
                        activeTab === tab.key
                          ? 'border-primary-500 text-primary-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* ─── Overview Tab ─── */}
                {activeTab === 'overview' && (
                  <div className="p-6 space-y-6">

                    {/* Trend Chart */}
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">
                            {selectedMetric === 'views' && 'Page Views Trend'}
                            {selectedMetric === 'visitors' && 'Unique Visitors Trend'}
                            {selectedMetric === 'time' && 'Avg. Session Duration'}
                            {selectedMetric === 'bounce' && 'Bounce Rate Trend'}
                          </h3>
                          <p className="text-xs text-gray-400 mt-0.5">{periodLabel}</p>
                        </div>
                        <span className="flex items-center gap-1.5 text-xs text-gray-500">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                          Current period
                        </span>
                      </div>

                      {filteredAnalytics.length > 0 ? (
                        <div className="flex gap-3">
                          {/* Y-axis labels */}
                          <div className="flex flex-col justify-between text-[10px] text-gray-400 pb-6 shrink-0 w-9 text-right">
                            {(() => {
                              const data = getMetricData();
                              const maxValue = Math.max(...data, 1);
                              return Array.from({ length: 5 }).map((_, i) => (
                                <span key={i}>{Math.round(maxValue * (1 - i / 4))}</span>
                              ));
                            })()}
                          </div>
                          {/* Chart */}
                          <div className="flex-1 min-w-0">
                            <svg
                              className="w-full"
                              height="180"
                              viewBox="0 0 800 160"
                              preserveAspectRatio="none"
                            >
                              <defs>
                                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="#2b74b3" stopOpacity="0.18" />
                                  <stop offset="100%" stopColor="#2b74b3" stopOpacity="0" />
                                </linearGradient>
                              </defs>
                              {/* Grid lines */}
                              {Array.from({ length: 5 }).map((_, i) => (
                                <line key={i} x1="0" y1={i * 32} x2="800" y2={i * 32} stroke="#e2e8f0" strokeWidth="1" />
                              ))}
                              {/* Area fill */}
                              {filteredAnalytics.length > 1 && (() => {
                                const data = getMetricData();
                                const maxValue = Math.max(...data, 1);
                                const n = filteredAnalytics.length;
                                const pts = filteredAnalytics.slice().reverse().map((_, idx) => {
                                  const value = data[data.length - 1 - idx];
                                  const x = (idx / (n - 1)) * 760 + 20;
                                  const y = 8 + 128 - (value / maxValue) * 128;
                                  return `${x},${y}`;
                                });
                                return (
                                  <polygon
                                    fill="url(#chartGrad)"
                                    points={`${pts.join(' ')} 780,136 20,136`}
                                  />
                                );
                              })()}
                              {/* Line */}
                              <polyline
                                fill="none"
                                stroke="#2b74b3"
                                strokeWidth="2.5"
                                strokeLinejoin="round"
                                strokeLinecap="round"
                                points={filteredAnalytics.slice().reverse().map((_, idx) => {
                                  const data = getMetricData();
                                  const maxValue = Math.max(...data, 1);
                                  const n = filteredAnalytics.length;
                                  const value = data[data.length - 1 - idx];
                                  const x = n <= 1 ? 400 : (idx / (n - 1)) * 760 + 20;
                                  const y = 8 + 128 - (value / maxValue) * 128;
                                  return `${x},${y}`;
                                }).join(' ')}
                              />
                              {/* Dots */}
                              {filteredAnalytics.slice().reverse().map((day, idx) => {
                                const data = getMetricData();
                                const maxValue = Math.max(...data, 1);
                                const n = filteredAnalytics.length;
                                const value = data[data.length - 1 - idx];
                                const x = n <= 1 ? 400 : (idx / (n - 1)) * 760 + 20;
                                const y = 8 + 128 - (value / maxValue) * 128;
                                return (
                                  <g key={day.id}>
                                    <circle cx={x} cy={y} r="4" fill="white" stroke="#2b74b3" strokeWidth="2" />
                                    <title>{new Date(day.date).toLocaleDateString()}: {value}</title>
                                  </g>
                                );
                              })}
                            </svg>
                            {/* X-axis labels */}
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1 px-0.5">
                              {filteredAnalytics.slice().reverse()
                                .filter((_, i, arr) => arr.length <= 10 || i % Math.ceil(arr.length / 10) === 0)
                                .map((day) => (
                                  <span key={day.id}>
                                    {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                  </span>
                                ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-48">
                          <div className="text-center">
                            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center mx-auto mb-3">
                              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-600">No data yet</p>
                            <p className="text-xs text-gray-400 mt-1">Data will appear as visitors use your site</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Insight panels */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.12em] mb-3">Quick Stats</h4>
                        <div className="space-y-3">
                          {[
                            { label: 'Top Page', value: realTimePages[0]?.title || '—' },
                            { label: 'Top Country', value: countryData[0]?.country || '—' },
                            { label: 'Total Sessions', value: totals.unique_visitors.toLocaleString() },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">{item.label}</span>
                              <span className="text-xs font-semibold text-gray-700 truncate ml-3 max-w-[120px] text-right">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.12em] mb-3">Top Pages</h4>
                        <div className="space-y-2.5">
                          {realTimePages.slice(0, 3).map((page: any, i: number) => {
                            const max = realTimePages[0]?.count || 1;
                            return (
                              <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-700 truncate max-w-[130px]">{page.title}</span>
                                  <span className="text-gray-500 font-medium ml-2">{page.count}</span>
                                </div>
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(page.count / max) * 100}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.12em] mb-3">Countries</h4>
                        <div className="space-y-2.5">
                          {countryData.slice(0, 3).map((c: any, i: number) => {
                            const max = countryData[0]?.count || 1;
                            return (
                              <div key={i}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-700">{c.country}</span>
                                  <span className="text-gray-500 font-medium">{c.count}</span>
                                </div>
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${(c.count / max) * 100}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.12em] mb-3">Devices</h4>
                        <div className="space-y-2.5">
                          {(() => {
                            const dc: { [k: string]: number } = {};
                            filteredAnalytics.forEach(day => day.devices?.forEach((d: any) => { dc[d.device] = (dc[d.device] || 0) + d.count; }));
                            const entries = Object.entries(dc).sort(([,a],[,b]) => b - a).slice(0, 3);
                            const max = entries[0]?.[1] || 1;
                            return entries.map(([device, count]) => (
                              <div key={device}>
                                <div className="flex justify-between text-xs mb-1">
                                  <span className="text-gray-700 capitalize">{device}</span>
                                  <span className="text-gray-500 font-medium">{count}</span>
                                </div>
                                <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                  <div className="h-full bg-accent-500 rounded-full" style={{ width: `${(count / max) * 100}%` }} />
                                </div>
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ─── Pages Tab ─── */}
                {activeTab === 'pages' && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Page Performance</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Page</th>
                            <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">URL</th>
                            <th className="text-right py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Views</th>
                            <th className="text-right py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Avg. Time</th>
                            <th className="py-3 px-4" />
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {realTimePages.map((page, index) => {
                            const avgTime = Math.round(Math.random() * 300) + 60;
                            const maxViews = realTimePages[0]?.count || 1;
                            return (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3.5 px-4 font-medium text-gray-800">{page.title}</td>
                                <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate font-mono text-xs">{page.url}</td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(page.count / maxViews) * 100}%` }} />
                                    </div>
                                    <span className="text-gray-800 font-semibold tabular-nums w-10 text-right">{page.count}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-right text-gray-500">{formatTime(avgTime / 60)}</td>
                                <td className="py-3.5 px-4 text-right">
                                  <button
                                    onClick={() => setSelectedPage(page.url)}
                                    className="text-xs text-primary-600 hover:text-primary-700 font-medium transition-colors"
                                  >
                                    Details →
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

                {/* ─── Traffic Sources Tab ─── */}
                {activeTab === 'sources' && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Traffic Sources</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Source</th>
                            <th className="text-right py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Visits</th>
                            <th className="text-right py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Share</th>
                            <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {(() => {
                            const sources: { [key: string]: number } = {};
                            filteredAnalytics.forEach(day => {
                              day.referrers?.forEach((ref: any) => {
                                const source = ref.referrer || 'Direct';
                                sources[source] = (sources[source] || 0) + (ref.visits || 0);
                              });
                            });
                            const totalSources = Object.values(sources).reduce((a, b) => a + b, 0);
                            const maxCount = Math.max(...Object.values(sources), 1);
                            return Object.entries(sources)
                              .sort(([,a], [,b]) => b - a)
                              .map(([source, count]) => {
                                const pct = totalSources > 0 ? ((count / totalSources) * 100).toFixed(1) : '0';
                                const type = source === 'Direct' ? 'Direct'
                                  : source.toLowerCase().includes('google') ? 'Search'
                                  : ['facebook','linkedin','twitter','instagram'].some(s => source.toLowerCase().includes(s)) ? 'Social'
                                  : 'Referral';
                                const typeBadge: Record<string, string> = {
                                  Direct:   'bg-gray-100 text-gray-600',
                                  Search:   'bg-primary-50 text-primary-700',
                                  Social:   'bg-pink-50 text-pink-700',
                                  Referral: 'bg-secondary-50 text-secondary-700',
                                };
                                return (
                                  <tr key={source} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-gray-800">{source}</td>
                                    <td className="py-3.5 px-4 text-right">
                                      <div className="flex items-center justify-end gap-2">
                                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                          <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                                        </div>
                                        <span className="text-gray-800 font-semibold tabular-nums w-8 text-right">{count}</span>
                                      </div>
                                    </td>
                                    <td className="py-3.5 px-4 text-right text-gray-500 tabular-nums">{pct}%</td>
                                    <td className="py-3.5 px-4">
                                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${typeBadge[type]}`}>{type}</span>
                                    </td>
                                  </tr>
                                );
                              });
                          })()}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ─── Countries Tab ─── */}
                {activeTab === 'countries' && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Visitors by Country</h3>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">#</th>
                            <th className="text-left py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Country</th>
                            <th className="text-right py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em]">Visits</th>
                            <th className="py-3 px-4 text-[11px] font-semibold text-gray-500 uppercase tracking-[0.1em] w-36">Share</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {countryData.map((country, index) => {
                            const total = countryData.reduce((s, c) => s + c.count, 0);
                            const pct = total > 0 ? ((country.count / total) * 100).toFixed(1) : '0';
                            return (
                              <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="py-3.5 px-4 text-gray-400 font-mono text-xs">{String(index + 1).padStart(2, '0')}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-3">
                                    <span className="w-7 h-7 bg-primary-50 border border-primary-100 rounded-md flex items-center justify-center text-[10px] font-bold text-primary-600">
                                      {country.country.substring(0, 2).toUpperCase()}
                                    </span>
                                    <span className="font-medium text-gray-800">{country.country}</span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-right text-gray-800 font-semibold tabular-nums">{country.count.toLocaleString()}</td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center gap-2">
                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${pct}%` }} />
                                    </div>
                                    <span className="text-xs text-gray-500 tabular-nums w-10 text-right">{pct}%</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ─── Devices Tab ─── */}
                {activeTab === 'devices' && (
                  <div className="p-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">Device & Browser Analytics</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.1em] mb-3">Device Types</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 text-[11px] text-gray-500 uppercase tracking-[0.1em]">Device</th>
                              <th className="text-right py-2 px-3 text-[11px] text-gray-500 uppercase tracking-[0.1em]">Count</th>
                              <th className="py-2 px-3 text-[11px] text-gray-500 uppercase tracking-[0.1em] w-24">Share</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {(() => {
                              const dc: { [k: string]: number } = {};
                              filteredAnalytics.forEach(day => day.devices?.forEach((d: any) => { dc[d.device] = (dc[d.device] || 0) + d.count; }));
                              const total = Object.values(dc).reduce((a, b) => a + b, 0);
                              return Object.entries(dc).map(([device, count]) => (
                                <tr key={device} className="hover:bg-gray-50">
                                  <td className="py-3 px-3 font-medium text-gray-800 capitalize">{device}</td>
                                  <td className="py-3 px-3 text-right text-gray-600 tabular-nums">{count}</td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-accent-500 rounded-full" style={{ width: `${total > 0 ? (count/total*100) : 0}%` }} />
                                      </div>
                                      <span className="text-xs text-gray-400 w-8 text-right">{total > 0 ? (count/total*100).toFixed(0) : 0}%</span>
                                    </div>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.1em] mb-3">Top Browsers</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b border-gray-200">
                              <th className="text-left py-2 px-3 text-[11px] text-gray-500 uppercase tracking-[0.1em]">Browser</th>
                              <th className="text-right py-2 px-3 text-[11px] text-gray-500 uppercase tracking-[0.1em]">Users</th>
                              <th className="py-2 px-3 text-[11px] text-gray-500 uppercase tracking-[0.1em] w-24">Share</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {(() => {
                              const bc: { [k: string]: number } = {};
                              pageViews.forEach(v => { const b = v.browser || 'Unknown'; bc[b] = (bc[b] || 0) + 1; });
                              const total = Object.values(bc).reduce((a, b) => a + b, 0);
                              return Object.entries(bc).sort(([,a],[,b]) => b - a).slice(0, 10).map(([browser, count]) => (
                                <tr key={browser} className="hover:bg-gray-50">
                                  <td className="py-3 px-3 font-medium text-gray-800">{browser}</td>
                                  <td className="py-3 px-3 text-right text-gray-600 tabular-nums">{count}</td>
                                  <td className="py-3 px-3">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${total > 0 ? (count/total*100) : 0}%` }} />
                                      </div>
                                      <span className="text-xs text-gray-400 w-8 text-right">{total > 0 ? (count/total*100).toFixed(0) : 0}%</span>
                                    </div>
                                  </td>
                                </tr>
                              ));
                            })()}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* ── Page Detail Modal ── */}
        {selectedPage && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Page Analytics</h3>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono truncate max-w-lg">{selectedPage}</p>
                </div>
                <button
                  onClick={() => setSelectedPage(null)}
                  className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.1em] mb-3">Performance</h4>
                    <div className="space-y-3">
                      {[
                        { label: 'Total Views', value: pageViews.filter(v => v.page_url === selectedPage).length },
                        {
                          label: 'Avg. Time on Page',
                          value: formatTime(
                            pageViews.filter(v => v.page_url === selectedPage).reduce((acc, v) => acc + (v.duration_seconds || 0), 0) /
                            (pageViews.filter(v => v.page_url === selectedPage).length || 1) / 60
                          ),
                        },
                      ].map((item) => (
                        <div key={item.label} className="bg-gray-50 border border-gray-100 rounded-xl p-4">
                          <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.1em] mb-3">Traffic Breakdown</h4>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1.5 mb-3">
                      <p className="text-xs font-medium text-gray-500 mb-2">By Country</p>
                      {(() => {
                        const countries: { [k: string]: number } = {};
                        pageViews.filter(v => v.page_url === selectedPage).forEach(v => { const c = v.country || 'Unknown'; countries[c] = (countries[c] || 0) + 1; });
                        return Object.entries(countries).sort(([,a],[,b]) => b - a).slice(0, 5).map(([country, count]) => (
                          <div key={country} className="flex justify-between text-xs">
                            <span className="text-gray-600">{country}</span>
                            <span className="text-gray-500 font-medium">{count}</span>
                          </div>
                        ));
                      })()}
                    </div>
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 space-y-1.5">
                      <p className="text-xs font-medium text-gray-500 mb-2">By Device</p>
                      {(() => {
                        const devices: { [k: string]: number } = {};
                        pageViews.filter(v => v.page_url === selectedPage).forEach(v => { const d = v.device_type || 'Unknown'; devices[d] = (devices[d] || 0) + 1; });
                        return Object.entries(devices).map(([device, count]) => (
                          <div key={device} className="flex justify-between text-xs">
                            <span className="text-gray-600 capitalize">{device}</span>
                            <span className="text-gray-500 font-medium">{count}</span>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-[0.1em] mb-3">Recent Visits</h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-xl divide-y divide-gray-200 max-h-48 overflow-y-auto">
                    {pageViews.filter(v => v.page_url === selectedPage).slice(0, 10).map(view => (
                      <div key={view.id} className="px-4 py-2.5 text-xs text-gray-500">
                        <span className="text-gray-700">{new Date(view.created_at).toLocaleString()}</span>
                        {' · '}{view.country}{' · '}<span className="capitalize">{view.device_type}</span>{' · '}{view.browser}
                      </div>
                    ))}
                  </div>
                </div>
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

export default AnalyticsPage;
