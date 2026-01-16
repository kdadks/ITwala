import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { toast } from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

interface Category {
  id: string;
  name: string;
  created_at: string;
}

const CategoriesPage: NextPage = () => {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newCategory, setNewCategory] = useState('');

  const fetchCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast.error('Error fetching categories: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Don't do anything while auth is loading
    if (authLoading) {
      return;
    }

    // Redirect if not authenticated
    if (!user) {
      router.push('/auth/login');
      return;
    }

    // Redirect if not admin
    if (!isAdmin) {
      toast.error('You do not have permission to access this page');
      router.push('/dashboard');
      return;
    }

    fetchCategories();
  }, [user, isAdmin, authLoading, router]);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategory.trim() }])
        .select()
        .single();

      if (error) throw error;

      setCategories([data, ...categories]);
      setNewCategory('');
      toast.success('Category added successfully!');
    } catch (error: any) {
      toast.error('Error adding category: ' + error.message);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure? This will affect all courses in this category.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully!');
    } catch (error: any) {
      toast.error('Error deleting category: ' + error.message);
    }
  };

  const handleUpdateCategory = async (id: string, newName: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ name: newName })
        .eq('id', id);

      if (error) throw error;

      setCategories(categories.map(cat => 
        cat.id === id ? { ...cat, name: newName } : cat
      ));
      toast.success('Category updated successfully!');
    } catch (error: any) {
      toast.error('Error updating category: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>Categories - Admin Dashboard</title>
        <meta name="description" content="Manage course categories" />
      </Head>

      <AdminHeader />
      
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6">Manage Categories</h1>

              {/* Add Category Form */}
              <form onSubmit={handleAddCategory} className="mb-8">
                <div className="flex gap-4">
                  <input
                    type="text"
                    placeholder="New category name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
                  >
                    Add Category
                  </button>
                </div>
              </form>

              {/* Categories List */}
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <input
                        type="text"
                        defaultValue={category.name}
                        onBlur={(e) => {
                          if (e.target.value !== category.name) {
                            handleUpdateCategory(category.id, e.target.value);
                          }
                        }}
                        className="flex-1 bg-transparent border-0 focus:ring-0"
                      />
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Delete
                      </button>
                    </div>
                  ))}

                  {categories.length === 0 && (
                    <p className="text-center text-gray-500">No categories found. Add one above.</p>
                  )}
                </div>
              )}
            </div>
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

export default CategoriesPage;
