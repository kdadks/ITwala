import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import {
  Briefcase, Plus, ExternalLink, Edit2, Trash2, Eye, EyeOff, Filter, ArrowUpRight,
  Save, X, Sparkles
} from 'lucide-react';
import { PortfolioItem } from '@/types/portfolio';

export const EmbeddedPortfolioCMS: React.FC = () => {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

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

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

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
        throw new Error(errorData.error || 'Failed to save portfolio item');
      }

      toast.success(item.id ? 'Portfolio item updated!' : 'Portfolio item created!');
      setIsModalOpen(false);
      setEditingItem(null);
      fetchPortfolioItems();
    } catch (error: any) {
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
  const filteredProjects = selectedCategory === 'All'
    ? portfolioItems
    : portfolioItems.filter(p => p.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-indigo-600" />
            Portfolio Projects Catalog
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manage showcase projects, tech stacks, impact metrics, and website visibility.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/admin/portfolio" className="btn btn-outline text-xs">
            <ExternalLink className="w-3.5 h-3.5 mr-1" />
            Full Portfolio View
          </Link>
          <button
            onClick={openCreateModal}
            className="btn btn-primary text-xs"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Project
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400 mr-1" />
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-gray-900 text-white shadow'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent" />
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-800">No projects found</h3>
          <p className="text-xs text-gray-500 mt-1 mb-4">Add your first project to display in the showcase</p>
          <button
            onClick={openCreateModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 rounded-lg shadow"
          >
            + Add Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between relative group ${
                !project.is_active ? 'opacity-60 bg-gray-50' : ''
              }`}
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 p-1.5 flex items-center justify-center border border-gray-200">
                      {project.logo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={project.logo} alt="Logo" className="w-full h-full object-contain" />
                      ) : (
                        <Briefcase className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{project.title}</h4>
                      <span className="text-[10px] uppercase font-bold text-primary-600 tracking-wider">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    project.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {project.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-gray-600 leading-relaxed line-clamp-3 mb-4">
                  {project.description}
                </p>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies?.slice(0, 3).map((tech) => (
                    <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-medium rounded">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Actions Footer */}
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 font-medium">Order: #{project.display_order}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(project)}
                    className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                    title={project.is_active ? 'Hide Project' : 'Show Project'}
                  >
                    {project.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => openEditModal(project)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg"
                    title="Edit Project"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => project.id && handleDelete(project.id)}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit / Create Modal */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold text-gray-900">
                {editingItem.id ? 'Edit Portfolio Project' : 'Create New Portfolio Project'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Project Title</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="e.g. EdTech Learning Platform"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Category</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value as PortfolioItem['category'] })}
                    className="w-full px-3 py-2 border rounded-lg text-sm bg-white"
                  >
                    <option value="Mobile App">Mobile App</option>
                    <option value="Web Platform">Web Platform</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Display Order</label>
                  <input
                    type="number"
                    value={editingItem.display_order}
                    onChange={(e) => setEditingItem({ ...editingItem, display_order: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingItem.description}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="Summary of project impact and technical execution..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Logo URL</label>
                <input
                  type="text"
                  value={editingItem.logo || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, logo: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="/images/logo.png"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Technologies (comma separated)</label>
                <input
                  type="text"
                  value={editingItem.technologies?.join(', ') || ''}
                  onChange={(e) => setEditingItem({
                    ...editingItem,
                    technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="React, Next.js, Node.js, PostgreSQL"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={editingItem.is_active}
                  onChange={(e) => setEditingItem({ ...editingItem, is_active: e.target.checked })}
                  className="rounded text-primary-600"
                />
                <label htmlFor="is_active" className="text-xs font-semibold text-gray-700">
                  Visible on public portfolio page
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSave(editingItem)}
                className="px-4 py-2 text-xs font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-lg shadow"
              >
                Save Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
