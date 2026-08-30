import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  RefreshCw,
  Eye,
  BookOpen,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ResourceArticle } from '@/types/resources';
import BlogPreviewModal from '@/components/admin/resources/BlogPreviewModal';

export default function AdminResourcesListPage() {
  const router = useRouter();
  const supabase = useSupabaseClient();
  const [blogs, setBlogs] = useState<ResourceArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSeeding, setIsSeeding] = useState(false);

  // In-Portal Preview Modal State
  const [previewBlog, setPreviewBlog] = useState<ResourceArticle | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Filters
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/resources');
      if (!res.ok) throw new Error('Failed to fetch blogs');
      const data = await res.json();
      setBlogs(data.resources || []);
    } catch (err: any) {
      toast.error(err?.message || 'Error loading blog posts');
    } finally {
      setIsLoading(false);
    }
  };

  const getAuthHeaders = async () => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleSeedData = async () => {
    try {
      setIsSeeding(true);
      const headers = await getAuthHeaders();
      const res = await fetch('/api/admin/resources/seed', {
        method: 'POST',
        headers,
      });
      if (!res.ok) throw new Error('Failed to seed blog resources');
      const data = await res.json();
      toast.success(data.message || 'Seeded static guides into database');
      fetchBlogs();
    } catch (err: any) {
      toast.error(err?.message || 'Error seeding blog resources');
    } finally {
      setIsSeeding(false);
    }
  };

  const handleDeleteBlog = async (id: string | number, blogTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${blogTitle}"?`)) return;

    try {
      const headers = await getAuthHeaders();
      const res = await fetch(`/api/admin/resources/${id}`, {
        method: 'DELETE',
        headers,
      });
      if (!res.ok) throw new Error('Failed to delete blog post');
      toast.success('Blog post deleted successfully');
      setBlogs(blogs.filter((b) => String(b.id) !== String(id) && b.slug !== String(id)));
    } catch (err: any) {
      toast.error(err?.message || 'Error deleting blog post');
    }
  };

  const handleOpenPreview = (blog: ResourceArticle) => {
    setPreviewBlog(blog);
    setIsPreviewOpen(true);
  };

  const handlePreviewStatusChange = (updatedBlog: ResourceArticle) => {
    setBlogs((prev) =>
      prev.map((b) => (b.slug === updatedBlog.slug || b.id === updatedBlog.id ? updatedBlog : b))
    );
    setPreviewBlog(updatedBlog);
    toast.success(`Status changed to ${updatedBlog.status}`);
  };

  // Filtered List
  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch =
      search.trim() === '' ||
      blog.title.toLowerCase().includes(search.toLowerCase()) ||
      blog.slug.toLowerCase().includes(search.toLowerCase()) ||
      blog.description.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = categoryFilter === 'All' || blog.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || blog.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalPublished = blogs.filter((b) => b.status === 'published').length;
  const totalDrafts = blogs.filter((b) => b.status === 'draft').length;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-primary-600" />
            Blog &amp; Resources Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit, and manage articles dynamically mapped to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-primary-700">/resources</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleSeedData}
            disabled={isSeeding}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold px-4 py-2.5 rounded-xl transition-colors inline-flex items-center gap-2"
            title="Import default static guides into database"
          >
            {isSeeding ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary-600" />
            ) : (
              <RefreshCw className="w-4 h-4 text-primary-600" />
            )}
            Seed Initial Guides
          </button>

          <Link href="/admin/resources/create">
            <span className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow transition-all inline-flex items-center gap-2 cursor-pointer">
              <Plus className="w-4 h-4" />
              Create New Blog
            </span>
          </Link>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Articles</div>
          <div className="text-2xl font-bold text-gray-900 mt-1">{blogs.length}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Published</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">{totalPublished}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Drafts</div>
          <div className="text-2xl font-bold text-amber-600 mt-1">{totalDrafts}</div>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Public Route</div>
          <Link href="/resources" target="_blank" className="text-xs text-primary-600 font-semibold hover:underline mt-2 inline-flex items-center gap-1">
            /resources <ExternalLink className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search blogs by title, slug, or keywords..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 font-medium"
          >
            <option value="All">All Categories</option>
            <option value="AI & Business Strategy">AI &amp; Business Strategy</option>
            <option value="Core AI Tech">Core AI Tech</option>
            <option value="AI Learning & Career">AI Learning &amp; Career</option>
            <option value="Startup & Product">Startup &amp; Product</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-xs bg-white text-gray-700 font-medium"
          >
            <option value="All">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Blog Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-7 h-7 animate-spin mr-2 text-primary-600" />
            <span>Loading blog posts...</span>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-base font-semibold">No blog posts found</p>
            <p className="text-xs text-gray-400 mt-1">
              Click "Create New Blog" or "Seed Initial Guides" to populate articles.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/70 text-gray-500 text-[11px] font-bold uppercase tracking-wider border-b border-gray-100">
                  <th className="px-5 py-3.5">Blog Article</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Read Time</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredBlogs.map((blog) => (
                  <tr key={blog.slug || String(blog.id)} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.featuredImage ? (
                          <div className="relative w-12 h-10 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 shrink-0">
                            <Image
                              src={blog.featuredImage}
                              alt={blog.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-10 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 max-w-md">
                          <h3 className="font-semibold text-gray-900 truncate text-sm">
                            {blog.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-mono truncate">
                            /resources/{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-block text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg">
                        {blog.category}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      {blog.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-xs text-gray-500">
                      {blog.readTime}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* In-Portal Preview Button */}
                        <button
                          onClick={() => handleOpenPreview(blog)}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="In-Portal Preview Mode"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Button */}
                        <Link
                          href={`/admin/resources/edit/${blog.slug}`}
                          className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title="Edit Blog"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        {/* Delete Button */}
                        <button
                          onClick={() => handleDeleteBlog(blog.slug || blog.id, blog.title)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Blog"
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
      </div>

      {/* In-Portal Blog Preview Modal */}
      <BlogPreviewModal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        blog={previewBlog}
        onStatusChange={handlePreviewStatusChange}
      />
    </div>
  );
}
