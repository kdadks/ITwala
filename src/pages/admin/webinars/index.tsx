import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Calendar,
  Search,
  Plus,
  Edit2,
  Trash2,
  Users,
  Eye,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';

interface Webinar {
  id: string;
  title: string;
  slug: string;
  date_time: string;
  duration_minutes: number;
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  speaker_name: string;
  speaker_title: string;
  registration_limit: number | null;
  registration_count: number;
  created_at: string;
}

const statusBadge = (status: Webinar['status']) => {
  const map: Record<Webinar['status'], string> = {
    draft: 'bg-yellow-100 text-yellow-800',
    published: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-gray-100 text-gray-800',
  };
  return `px-2 py-0.5 text-xs font-semibold rounded-full ${map[status]}`;
};

const AdminWebinars: NextPage = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const user = useUser();

  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [webinars, setWebinars] = useState<Webinar[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const getToken = async () => {
    const session = await supabase.auth.getSession();
    return session.data.session?.access_token;
  };

  const fetchWebinars = async () => {
    try {
      const token = await getToken();
      const res = await fetch('/api/admin/webinars', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch webinars');
      const data = await res.json();
      setWebinars(data.webinars ?? []);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load webinars');
    }
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
        const admin = data?.role === 'admin';
        setIsAdmin(admin);
        if (admin) await fetchWebinars();
      } catch (err) {
        console.error('Admin check error:', err);
        setIsAdmin(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAdmin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, supabase]);

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/admin/login');
    }
  }, [user, isLoading, router]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this webinar? All registrations will be removed.')) return;
    setDeletingId(id);
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/webinars/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) throw new Error('Delete failed');
      setWebinars((prev) => prev.filter((w) => w.id !== id));
      toast.success('Webinar deleted');
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete webinar');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleStatus = async (webinar: Webinar) => {
    const newStatus = webinar.status === 'published' ? 'draft' : 'published';
    setTogglingId(webinar.id);
    try {
      const token = await getToken();
      const res = await fetch(`/api/admin/webinars/${webinar.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      const updated = await res.json();
      setWebinars((prev) => prev.map((w) => (w.id === webinar.id ? { ...w, status: updated.status } : w)));
      toast.success(`Webinar ${newStatus === 'published' ? 'published' : 'unpublished'}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  const now = new Date();
  const totalRegistrations = webinars.reduce((sum, w) => sum + (w.registration_count || 0), 0);
  const publishedCount = webinars.filter((w) => w.status === 'published').length;
  const upcomingCount = webinars.filter((w) => new Date(w.date_time) > now).length;

  const filtered = webinars.filter((w) => {
    const matchSearch = w.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.speaker_name?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = !statusFilter || w.status === statusFilter;
    return matchSearch && matchStatus;
  });

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
        <title>Special Events (Webinars) - ITwala Academy Admin</title>
        <meta name="description" content="Manage special events and webinars" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Special Events (Webinars)</h1>
            <Link href="/admin/webinars/create">
              <div className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" />
                Create Webinar
              </div>
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { label: 'Total Webinars', value: webinars.length },
              { label: 'Published', value: publishedCount },
              { label: 'Upcoming', value: upcomingCount },
              { label: 'Total Registrations', value: totalRegistrations },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-lg shadow p-4">
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg shadow mb-6 p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by title or speaker..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="">All Statuses</option>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow overflow-hidden"
          >
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <Calendar className="w-14 h-14 mb-4 opacity-40" />
                <p className="text-lg font-medium text-gray-500">No webinars yet</p>
                <p className="text-sm mt-1">Create your first special event or webinar.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {['Title', 'Date / Time', 'Status', 'Speaker', 'Registrants', 'Actions'].map((h) => (
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
                    {filtered.map((webinar) => (
                      <tr key={webinar.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="text-sm font-medium text-gray-900 max-w-xs truncate">{webinar.title}</div>
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                          {webinar.date_time
                            ? new Date(webinar.date_time).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : '—'}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <span className={statusBadge(webinar.status)}>
                            {webinar.status.charAt(0).toUpperCase() + webinar.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-sm text-gray-600">
                          <div>{webinar.speaker_name || '—'}</div>
                          {webinar.speaker_title && (
                            <div className="text-xs text-gray-400">{webinar.speaker_title}</div>
                          )}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap text-sm text-gray-600">
                          {webinar.registration_count ?? 0}
                          {webinar.registration_limit ? ` / ${webinar.registration_limit}` : ' / ∞'}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <Link href={`/admin/webinars/${webinar.id}/edit`} title="Edit">
                              <Edit2 className="w-4 h-4 text-primary-600 hover:text-primary-800 cursor-pointer" />
                            </Link>
                            <Link href={`/admin/webinars/${webinar.id}/registrants`} title="View Registrants">
                              <Users className="w-4 h-4 text-blue-500 hover:text-blue-700 cursor-pointer" />
                            </Link>
                            <button
                              onClick={() => handleToggleStatus(webinar)}
                              disabled={togglingId === webinar.id}
                              title={webinar.status === 'published' ? 'Unpublish' : 'Publish'}
                              className="text-gray-400 hover:text-gray-700 disabled:opacity-40"
                            >
                              {webinar.status === 'published' ? (
                                <ToggleRight className="w-5 h-5 text-green-500" />
                              ) : (
                                <ToggleLeft className="w-5 h-5" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDelete(webinar.id)}
                              disabled={deletingId === webinar.id}
                              title="Delete"
                              className="text-red-400 hover:text-red-600 disabled:opacity-40"
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
          </motion.div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  return { props: {} };
}

export default AdminWebinars;
