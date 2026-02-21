import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import Head from 'next/head';

interface ContentSection {
  id: string;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const ContentManagementPage: NextPage = () => {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [newSection, setNewSection] = useState({
    name: '',
    content: ''
  });

  const fetchContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('content_sections')
        .select('*')
        .order('name');

      if (error) throw error;
      setSections(data || []);
    } catch (error: any) {
      console.error('Error fetching content:', error);
      toast.error(error.message || 'Failed to load content sections');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Wait for auth to be checked
    if (authLoading) return;

    // Redirect if not authenticated
    if (!user) {
      router.push('/admin/login');
      return;
    }

    // Redirect if not admin
    if (!isAdmin) {
      toast.error('You do not have permission to access this page');
      router.push('/dashboard');
      return;
    }

    fetchContent();
  }, [user, isAdmin, authLoading, router]);

  const handleSave = async () => {
    try {
      if (!newSection.name || !newSection.content) {
        toast.error('Please fill in all fields');
        return;
      }

      const { error } = await supabase
        .from('content_sections')
        .insert([{
          name: newSection.name,
          content: newSection.content
        }]);

      if (error) throw error;
      toast.success('Content section added successfully!');
      fetchContent();
      setNewSection({ name: '', content: '' });
    } catch (error: any) {
      toast.error(error.message || 'Error saving content');
    }
  };

  const handleUpdate = async (section: ContentSection) => {
    try {
      const { error } = await supabase
        .from('content_sections')
        .update({
          content: section.content,
          updated_at: new Date().toISOString()
        })
        .eq('id', section.id);

      if (error) throw error;
      toast.success('Content updated successfully!');
      fetchContent();
    } catch (error: any) {
      toast.error(error.message || 'Error updating content');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this section?')) return;

    try {
      const { error } = await supabase
        .from('content_sections')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast.success('Content deleted successfully!');
      fetchContent();
    } catch (error: any) {
      toast.error(error.message || 'Error deleting content');
    }
  };

  // Show loading state
  if (authLoading || (isLoading && !sections.length)) {
    return (
      <>
        <Head>
          <title>Content Management - Admin Dashboard</title>
          <meta name="description" content="Content management dashboard for administrators" />
        </Head>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        </main>
      </>
    );
  }

  // Show unauthorized message
  if (!isAdmin) {
    return (
      <>
        <Head>
          <title>Content Management - Admin Dashboard</title>
          <meta name="description" content="Content management dashboard for administrators" />
        </Head>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
              <p className="text-gray-600">You do not have permission to access this page.</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Content Management - Admin Dashboard</title>
        <meta name="description" content="Content management dashboard for administrators" />
      </Head>
      
      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h1 className="text-2xl font-bold mb-6">Content Management</h1>
              
              {/* Add New Section Form */}
              <div className="mb-8 space-y-4">
                <h2 className="text-lg font-semibold">Add New Content Section</h2>
                <div className="grid gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Name</label>
                    <input
                      type="text"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={newSection.name}
                      onChange={(e) => setNewSection({ ...newSection, name: e.target.value })}
                      placeholder="e.g., home_hero, about_mission"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                      value={newSection.content}
                      onChange={(e) => setNewSection({ ...newSection, content: e.target.value })}
                      placeholder="Enter section content (supports JSON)"
                    />
                  </div>
                  <div>
                    <button
                      onClick={handleSave}
                      className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                      Add Section
                    </button>
                  </div>
                </div>
              </div>

              {/* Content Sections List */}
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Existing Content Sections</h2>
                {sections.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No content sections found</p>
                ) : (
                  sections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{section.name}</h3>
                          <p className="text-sm text-gray-500">
                            Last updated: {new Date(section.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(section.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Content</label>
                        <textarea
                          rows={4}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                          defaultValue={section.content}
                          onBlur={(e) => handleUpdate({ ...section, content: e.target.value })}
                        />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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

export default ContentManagementPage;
