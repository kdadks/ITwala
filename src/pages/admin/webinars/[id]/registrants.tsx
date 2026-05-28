import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Search, Download, Users, Mail, CheckCircle, XCircle } from 'lucide-react';

interface Registrant {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  organization: string;
  job_title: string;
  registered_at: string;
  confirmation_sent: boolean;
}

const WebinarRegistrants: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [webinarTitle, setWebinarTitle] = useState('');
  const [registrants, setRegistrants] = useState<Registrant[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [exportingCsv, setExportingCsv] = useState(false);

  const getToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setIsAdmin(data?.role === 'admin');
      } catch (err) {
        console.error('Admin check error:', err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdmin();
  }, [user, supabase]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!id || !isAdmin) return;

    const fetchData = async () => {
      setDataLoading(true);
      try {
        const token = await getToken();

        // Fetch webinar details for the title
        const webinarRes = await fetch(`/api/admin/webinars/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (webinarRes.ok) {
          const webinar = await webinarRes.json();
          setWebinarTitle(webinar.title || '');
        }

        // Fetch registrants
        const regRes = await fetch(`/api/admin/webinars/${id}/registrants`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!regRes.ok) throw new Error('Failed to fetch registrants');
        const data = await regRes.json();
        setRegistrants(data.registrants ?? []);
      } catch (err: any) {
        toast.error(err.message || 'Failed to load registrants');
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isAdmin]);

  const handleExportCsv = async () => {
    if (!id) return;
    setExportingCsv(true);
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/webinars/${id}/registrants/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `registrants-${id}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success('CSV exported successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to export CSV');
    } finally {
      setExportingCsv(false);
    }
  };

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase();
    if (!q) return registrants;
    return registrants.filter(
      (r) =>
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email?.toLowerCase().includes(q)
    );
  }, [registrants, searchQuery]);

  const confirmationSentCount = registrants.filter((r) => r.confirmation_sent).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You do not have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Registrants - ITwala Academy Admin</title>
        <meta name="description" content="View and manage webinar registrants" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-4">
            <Link href="/admin/webinars">
              <div className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 cursor-pointer w-fit">
                <ArrowLeft className="w-4 h-4" />
                Back to Webinars
              </div>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {webinarTitle ? `${webinarTitle} — Registrants` : 'Registrants'}
              </h1>
            </div>
            <button
              onClick={handleExportCsv}
              disabled={exportingCsv || registrants.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              {exportingCsv ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <Users className="w-8 h-8 text-primary-500" />
              <div>
                <p className="text-sm text-gray-500">Total Registrants</p>
                <p className="text-2xl font-bold text-gray-900">{registrants.length}</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 flex items-center gap-3">
              <Mail className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Confirmations Sent</p>
                <p className="text-2xl font-bold text-gray-900">{confirmationSentCount}</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Table */}
          {dataLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg shadow overflow-hidden"
            >
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                  <Users className="w-14 h-14 mb-4 opacity-30" />
                  <p className="text-lg font-medium text-gray-500">
                    {registrants.length === 0 ? 'No registrations yet' : 'No results match your search'}
                  </p>
                  {registrants.length === 0 && (
                    <p className="text-sm mt-1 text-gray-400">Registrations will appear here once people sign up.</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {['Name', 'Email', 'Phone', 'Organization', 'Job Title', 'Registered At', 'Confirmed'].map((h) => (
                          <th
                            key={h}
                            className="px-5 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filtered.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50">
                          <td className="px-5 py-4 whitespace-nowrap">
                            <span className="text-sm font-medium text-gray-900">
                              {r.first_name} {r.last_name}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                            {r.email}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                            {r.phone || '—'}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                            {r.organization || '—'}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                            {r.job_title || '—'}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                            {r.registered_at
                              ? new Date(r.registered_at).toLocaleString('en-GB', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })
                              : '—'}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap text-center">
                            {r.confirmation_sent ? (
                              <CheckCircle className="w-4 h-4 text-green-500 inline-block" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-400 inline-block" />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default WebinarRegistrants;
