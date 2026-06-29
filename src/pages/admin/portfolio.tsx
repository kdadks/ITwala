import { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { 
  Plus, Edit2, Trash2, Save, X, Eye, EyeOff, GripVertical,
  ExternalLink, ArrowUpRight, Sparkles, Filter, ChevronDown, ChevronUp, Settings, AlertTriangle
} from 'lucide-react';
import { PortfolioItem, PortfolioMetric } from '@/types/portfolio';

const PortfolioCMS: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [settings, setSettings] = useState({
    page_title: 'Our Success Stories',
    page_subtitle: 'Transforming ideas into digital excellence',
    tagline: 'trusted by 50+ businesses worldwide',
    breadcrumb_label: 'Our Work · {count}+ Projects Delivered',
    metrics: [
      { value: '10K+', label: 'Active Users' },
      { value: '95%', label: 'Client Satisfaction' },
      { value: '10+', label: 'Projects Delivered' },
      { value: '7', label: 'Industries Served' }
    ],
    featured_section_title: 'Featured Projects',
    featured_section_subtitle: 'Real solutions, real impact. Filter by category to explore our work.'
  });

  // Check admin access
  useEffect(() => {
    const checkAdmin = async () => {
      if (!user) {
        router.push('/admin/login');
        return;
      }

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        router.push('/admin');
        return;
      }

      fetchPortfolioItems();
      fetchPortfolioSettings();
    };

    checkAdmin();
  }, [user]); // Removed router and supabaseClient from dependencies

  const fetchPortfolioItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/portfolio');
      if (!response.ok) throw new Error('Failed to fetch portfolio items');
      
      const data = await response.json();
      setPortfolioItems(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load portfolio items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (item: PortfolioItem) => {
    try {
      const method = item.id ? 'PUT' : 'POST';
      const response = await fetch('/api/admin/portfolio', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error(errorData.error || 'Failed to save portfolio item');
      }

      const savedItem = await response.json();
      console.log('Saved item:', savedItem);

      toast.success(item.id ? 'Portfolio item updated!' : 'Portfolio item created!');
      setIsModalOpen(false);
      setEditingItem(null);
      await fetchPortfolioItems();
    } catch (error: any) {
      console.error('Save error:', error);
      toast.error(error.message || 'Failed to save portfolio item');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error('Failed to delete portfolio item');

      toast.success('Portfolio item deleted!');
      setDeleteConfirmId(null);
      fetchPortfolioItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete portfolio item');
    }
  };

  const fetchPortfolioSettings = async () => {
    try {
      const response = await fetch('/api/admin/portfolio-settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(prev => ({ ...prev, ...data }));
      }
    } catch (error: any) {
      console.warn('Error fetching portfolio settings:', error.message);
    }
  };

  const handleSaveSettings = async () => {
    try {
      const response = await fetch('/api/admin/portfolio-settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      toast.success('Settings updated successfully!');
      setShowSettings(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save settings');
    }
  };

  const handleMetricChange = (index: number, field: 'value' | 'label', value: string) => {
    const newMetrics = [...settings.metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setSettings({ ...settings, metrics: newMetrics });
  };

  const addMetric = () => {
    setSettings({
      ...settings,
      metrics: [...settings.metrics, { value: '', label: '' }]
    });
  };

  const removeMetric = (index: number) => {
    const newMetrics = settings.metrics.filter((_, i) => i !== index);
    setSettings({ ...settings, metrics: newMetrics });
  };


  const handleToggleActive = async (item: PortfolioItem) => {
    try {
      const response = await fetch('/api/admin/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...item, is_active: !item.is_active }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      toast.success(item.is_active ? 'Portfolio item hidden' : 'Portfolio item activated');
      fetchPortfolioItems();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const openCreateModal = () => {
    setEditingItem({
      title: '',
      description: '',
      industry: '',
      category: 'Web Platform',
      href: '',
      logo: '',
      color: 'indigo',
      features: [],
      technologies: [],
      impact: '',
      metrics: [],
      display_order: portfolioItems.length + 1,
      is_active: true,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: PortfolioItem) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const categories = ['All', 'Mobile App', 'Web Platform', 'E-commerce', 'Healthcare'];

  // CMS always shows all projects - is_active only affects public website
  const filteredProjects = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === selectedCategory);

  const getColorClasses = (color: string) => {
    const colorMap: { [key: string]: { border: string; bg: string; text: string; gradient: string } } = {
      indigo: {
        border: 'border-indigo-200 hover:border-indigo-400',
        bg: 'bg-indigo-50',
        text: 'text-indigo-600',
        gradient: 'from-indigo-500 to-purple-600'
      },
      pink: {
        border: 'border-pink-200 hover:border-pink-400',
        bg: 'bg-pink-50',
        text: 'text-pink-600',
        gradient: 'from-pink-500 to-rose-600'
      },
      cyan: {
        border: 'border-cyan-200 hover:border-cyan-400',
        bg: 'bg-cyan-50',
        text: 'text-cyan-600',
        gradient: 'from-cyan-500 to-blue-600'
      },
      green: {
        border: 'border-green-200 hover:border-green-400',
        bg: 'bg-green-50',
        text: 'text-green-600',
        gradient: 'from-green-500 to-emerald-600'
      },
      blue: {
        border: 'border-blue-200 hover:border-blue-400',
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        gradient: 'from-blue-500 to-indigo-600'
      }
    };
    return colorMap[color] || colorMap.indigo;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Portfolio CMS...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Portfolio CMS - Admin | ITwala Academy</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Portfolio CMS</h1>
                <p className="text-sm text-gray-600">Manage portfolio projects with live preview</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
                >
                  <Settings className="w-4 h-4" />
                  Page Settings
                </button>
                <button
                  onClick={openCreateModal}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add New Project
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Portfolio Preview */}
        <main className="container mx-auto px-4 py-8">
          {/* Hero Section Preview */}
          <section className="mb-12 bg-white rounded-2xl p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-10 bg-primary-500" />
              <span className="text-xs font-semibold tracking-widest uppercase text-primary-500">
                {settings.breadcrumb_label.replace('{count}', portfolioItems.filter(p => p.is_active).length.toString())}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {settings.page_title}
            </h1>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-9 bg-accent-500 rounded-full" />
              <p className="text-lg text-gray-600 font-medium">
                {settings.page_subtitle}
                <span className="text-gray-400 font-normal"> · {settings.tagline}</span>
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-stretch divide-x divide-gray-200 bg-gray-50 rounded-xl p-6">
              {settings.metrics.map((stat: any) => (
                <div key={stat.label} className="px-6 first:pl-0">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-gray-400 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 rounded-2xl p-8 shadow-sm border border-gray-200">
            {/* Category Filters */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{settings.featured_section_title}</h2>
                <p className="text-gray-600">Click on any project card to edit</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Filter className="w-5 h-5 text-gray-500" />
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg'
                        : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => {
                const colors = getColorClasses(project.color);
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    {/* Admin Controls Overlay */}
                    <div className="absolute -top-3 -right-3 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEditModal(project)}
                        className="p-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleActive(project)}
                        className={`p-2 ${project.is_active ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded-lg shadow-lg hover:opacity-90 transition-opacity`}
                        title={project.is_active ? 'Hide' : 'Show'}
                      >
                        {project.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => project.id && setDeleteConfirmId(project.id)}
                        className="p-2 bg-red-600 text-white rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Inactive Overlay */}
                    {!project.is_active && (
                      <div className="absolute inset-0 bg-gray-900/50 z-10 rounded-3xl flex items-center justify-center">
                        <span className="px-4 py-2 bg-gray-800 text-white text-sm font-semibold rounded-full">
                          Inactive
                        </span>
                      </div>
                    )}

                    {/* Project Card (matching public design) */}
                    <div
                      className={`bg-white rounded-3xl overflow-hidden border-2 ${colors.border} shadow-xl hover:shadow-2xl transition-all h-full flex flex-col cursor-pointer`}
                      onClick={() => openEditModal(project)}
                    >
                      <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />
                      
                      <div className="p-6 flex flex-col flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className={`relative w-14 h-14 ${colors.bg} rounded-xl p-2 flex items-center justify-center flex-shrink-0`}>
                              {project.logo && (project.logo.startsWith('/') || project.logo.startsWith('http')) ? (
                                <Image
                                  src={project.logo}
                                  alt={`${project.title} logo`}
                                  width={40}
                                  height={40}
                                  style={{ width: 'auto', height: 'auto', maxWidth: '40px', maxHeight: '40px' }}
                                  className="object-contain"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                                  <span className="text-gray-400 text-xs font-bold">?</span>
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="text-xl font-bold text-gray-900 truncate">
                                {project.title}
                              </h3>
                              <span className={`inline-block px-2 py-1 text-xs font-semibold ${colors.bg} ${colors.text} rounded-full mt-1`}>
                                {project.category}
                              </span>
                            </div>
                          </div>
                          <div className={`${colors.bg} p-2 rounded-lg flex-shrink-0`}>
                            <ArrowUpRight className={`w-4 h-4 ${colors.text}`} />
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
                          {project.description}
                        </p>

                        {/* Metrics */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          {project.metrics.map((metric) => (
                            <div key={metric.label} className={`${colors.bg} rounded-lg p-2 text-center`}>
                              <div className={`text-sm font-bold ${colors.text}`}>
                                {metric.value}
                              </div>
                              <div className="text-xs text-gray-600 truncate">
                                {metric.label}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Technologies */}
                        <div className="flex flex-wrap gap-1 mb-4">
                          {project.technologies.slice(0, 3).map((tech) => (
                            <span
                              key={tech}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                            >
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                              +{project.technologies.length - 3}
                            </span>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
                          <span className="text-xs font-semibold text-gray-600">
                            Order: {project.display_order}
                          </span>
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {filteredProjects.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📁</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600 mb-6">
                  {selectedCategory === 'All' 
                    ? 'Start by adding your first portfolio project'
                    : `No projects in the ${selectedCategory} category`}
                </p>
                <button
                  onClick={openCreateModal}
                  className="px-6 py-3 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add New Project
                </button>
              </div>
            )}
          </section>
        </main>

        {/* Edit/Create Modal */}
        <PortfolioModal
          isOpen={isModalOpen}
          item={editingItem}
          onClose={() => {
            setIsModalOpen(false);
            setEditingItem(null);
          }}
          onSave={handleSave}
        />

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setShowSettings(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
              >
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                  <h2 className="text-2xl font-bold text-gray-900">Portfolio Page Settings</h2>
                  <button
                    onClick={() => setShowSettings(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-6 space-y-6">
                  {/* Page Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Title</label>
                    <input
                      type="text"
                      value={settings.page_title}
                      onChange={(e) => setSettings({ ...settings, page_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Our Success Stories"
                    />
                  </div>

                  {/* Page Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Page Subtitle</label>
                    <input
                      type="text"
                      value={settings.page_subtitle}
                      onChange={(e) => setSettings({ ...settings, page_subtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Transforming ideas into digital excellence"
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="trusted by 50+ businesses worldwide"
                    />
                  </div>

                  {/* Breadcrumb Label */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Breadcrumb Label</label>
                    <input
                      type="text"
                      value={settings.breadcrumb_label}
                      onChange={(e) => setSettings({ ...settings, breadcrumb_label: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Our Work · {count}+ Projects Delivered"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use {'{count}'} as placeholder for dynamic project count (e.g., "Our Work · {'{count}'}+ Projects Delivered")</p>
                  </div>

                  {/* Metrics */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-gray-700">Metrics</label>
                      <button
                        onClick={addMetric}
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        + Add Metric
                      </button>
                    </div>
                    <div className="space-y-3">
                      {settings.metrics.map((metric: any, index: number) => (
                        <div key={index} className="flex gap-3 items-start">
                          <input
                            type="text"
                            value={metric.value}
                            onChange={(e) => handleMetricChange(index, 'value', e.target.value)}
                            placeholder="Value (e.g., 10K+)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <input
                            type="text"
                            value={metric.label}
                            onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                            placeholder="Label (e.g., Active Users)"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => removeMetric(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Featured Section Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Section Title</label>
                    <input
                      type="text"
                      value={settings.featured_section_title}
                      onChange={(e) => setSettings({ ...settings, featured_section_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Featured Projects"
                    />
                  </div>

                  {/* Featured Section Subtitle */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Featured Section Subtitle</label>
                    <input
                      type="text"
                      value={settings.featured_section_subtitle}
                      onChange={(e) => setSettings({ ...settings, featured_section_subtitle: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="Real solutions, real impact. Filter by category to explore our work."
                    />
                  </div>
                </div>

                <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveSettings}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    <Save className="w-4 h-4" />
                    Save Settings
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {deleteConfirmId && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
              onClick={() => setDeleteConfirmId(null)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Portfolio Item</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        Are you sure you want to delete this portfolio item? This action cannot be undone and will permanently remove the project from your portfolio.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 px-6 py-4 rounded-b-2xl flex items-center justify-end gap-3">
                  <button
                    onClick={() => setDeleteConfirmId(null)}
                    className="px-4 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

// Portfolio Modal Component
interface PortfolioModalProps {
  isOpen: boolean;
  item: PortfolioItem | null;
  onClose: () => void;
  onSave: (item: PortfolioItem) => void;
}

const PortfolioModal: React.FC<PortfolioModalProps> = ({ isOpen, item, onClose, onSave }) => {
  const [formData, setFormData] = useState<PortfolioItem | null>(null);
  const [featuresInput, setFeaturesInput] = useState('');
  const [technologiesInput, setTechnologiesInput] = useState('');

  useEffect(() => {
    if (item) {
      setFormData(item);
    }
  }, [item, isOpen]);

  if (!isOpen || !formData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate logo path
    if (formData.logo && !formData.logo.startsWith('/') && !formData.logo.startsWith('http://') && !formData.logo.startsWith('https://')) {
      toast.error('Logo path must start with "/" or be a full URL (http:// or https://)');
      return;
    }
    
    onSave(formData);
  };

  const updateField = (field: keyof PortfolioItem, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const addFeature = () => {
    if (featuresInput.trim()) {
      updateField('features', [...formData.features, featuresInput.trim()]);
      setFeaturesInput('');
    }
  };

  const removeFeature = (index: number) => {
    updateField('features', formData.features.filter((_, i) => i !== index));
  };

  const addTechnology = () => {
    if (technologiesInput.trim()) {
      updateField('technologies', [...formData.technologies, technologiesInput.trim()]);
      setTechnologiesInput('');
    }
  };

  const removeTechnology = (index: number) => {
    updateField('technologies', formData.technologies.filter((_, i) => i !== index));
  };

  const addMetric = () => {
    updateField('metrics', [...formData.metrics, { label: '', value: '' }]);
  };

  const updateMetric = (index: number, field: 'label' | 'value', value: string) => {
    const newMetrics = [...formData.metrics];
    newMetrics[index][field] = value;
    updateField('metrics', newMetrics);
  };

  const removeMetric = (index: number) => {
    updateField('metrics', formData.metrics.filter((_, i) => i !== index));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto"
          >
            <form onSubmit={handleSubmit}>
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                <h2 className="text-2xl font-bold text-gray-900">
                  {formData.id ? 'Edit Portfolio Item' : 'Create New Portfolio Item'}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Industry *</label>
                    <input
                      type="text"
                      required
                      value={formData.industry}
                      onChange={(e) => updateField('industry', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => updateField('category', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="Mobile App">Mobile App</option>
                      <option value="Web Platform">Web Platform</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Healthcare">Healthcare</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color Theme *</label>
                    <select
                      required
                      value={formData.color}
                      onChange={(e) => updateField('color', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="indigo">Indigo</option>
                      <option value="pink">Pink</option>
                      <option value="cyan">Cyan</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Project URL *</label>
                    <input
                      type="url"
                      required
                      value={formData.href}
                      onChange={(e) => updateField('href', e.target.value)}
                      placeholder="https://example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Logo Path *</label>
                    <input
                      type="text"
                      required
                      value={formData.logo}
                      onChange={(e) => updateField('logo', e.target.value)}
                      placeholder="/images/logo.png or https://example.com/logo.png"
                      pattern="^(/|https?://).*"
                      title="Must start with / or be a full URL (http:// or https://)"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must start with "/" (e.g., /images/logo.png) or be a full URL</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Display Order *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={formData.display_order}
                      onChange={(e) => updateField('display_order', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(e) => updateField('is_active', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => updateField('is_featured', e.target.checked)}
                        className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Impact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Impact Statement *</label>
                  <input
                    type="text"
                    required
                    value={formData.impact}
                    onChange={(e) => updateField('impact', e.target.value)}
                    placeholder="10,000+ active users, 95% customer satisfaction"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Features */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={featuresInput}
                      onChange={(e) => setFeaturesInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                      placeholder="Enter feature and press Enter"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addFeature}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
                      >
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(index)}
                          className="hover:text-primary-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Technologies */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Technologies</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={technologiesInput}
                      onChange={(e) => setTechnologiesInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                      placeholder="Enter technology and press Enter"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={addTechnology}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-secondary-50 text-secondary-700 rounded-full text-sm"
                      >
                        {tech}
                        <button
                          type="button"
                          onClick={() => removeTechnology(index)}
                          className="hover:text-secondary-900"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">Metrics</label>
                    <button
                      type="button"
                      onClick={addMetric}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      + Add Metric
                    </button>
                  </div>
                  <div className="space-y-2">
                    {formData.metrics.map((metric, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={metric.label}
                          onChange={(e) => updateMetric(index, 'label', e.target.value)}
                          placeholder="Label (e.g., Active Users)"
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          value={metric.value}
                          onChange={(e) => updateMetric(index, 'value', e.target.value)}
                          placeholder="Value (e.g., 10K+)"
                          className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => removeMetric(index)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <span className="flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Portfolio Item
                  </span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

// Disable static generation for this admin page
export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default PortfolioCMS;
