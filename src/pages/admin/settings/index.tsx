import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { setupSiteSettings, getSiteSettings, updateSiteSettings } from '@/utils/siteSettings';

interface SiteSettings {
  id?: string;
  siteName: string;
  contactEmail: string;
  supportPhone: string;
  maintenanceMode: boolean;
  enrollmentsEnabled: boolean;
}

const AdminSettings: NextPage = () => {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const supabase = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: 'ITwala Academy',
    contactEmail: 'sales@it-wala.com',
    supportPhone: '+91 7982303199',
    maintenanceMode: false,
    enrollmentsEnabled: true
  });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

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

    let isMounted = true;

    const setupAndFetchSettings = async () => {
      try {
        setIsLoading(true);
        
        // Initialize settings table and get initial data
        await setupSiteSettings();
        
        // Fetch current settings
        const data = await getSiteSettings();
        
        if (isMounted && data) {
          setSettings({
            ...settings,  // Keep any default values
            ...data       // Override with database values
          });
        }
      } catch (error: any) {
        if (isMounted) {
          console.error('Error loading settings:', error);
          toast.error(error.message || 'Failed to load settings. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    setupAndFetchSettings();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [user, isAdmin, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateSiteSettings(settings);
      toast.success('Settings saved successfully');
    } catch (error: any) {
      console.error('Error saving settings:', error);
      toast.error(error.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setIsUpdatingPassword(true);

    try {
      // First verify the current password
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email!,
        password: passwordForm.currentPassword
      });

      if (signInError) {
        throw new Error('Current password is incorrect');
      }

      // Update to new password
      const { error: updateError } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (updateError) throw updateError;

      toast.success('Password updated successfully');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      console.error('Error updating password:', error);
      toast.error(error.message || 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  if (isLoading || authLoading) {
    return (
      <>
        <Head>
          <title>Admin Settings - ITwala Academy</title>
          <meta name="description" content="Configure admin settings for ITwala Academy" />
        </Head>
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Admin Settings - ITwala Academy</title>
        <meta name="description" content="Configure admin settings for ITwala Academy" />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="siteName"
                        value={settings.siteName}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contactEmail"
                        value={settings.contactEmail}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      />
                    </div>

                    <div>
                      <label htmlFor="supportPhone" className="block text-sm font-medium text-gray-700">
                        Support Phone
                      </label>
                      <input
                        type="tel"
                        id="supportPhone"
                        value={settings.supportPhone}
                        onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                      />
                    </div>

                    <div className="flex items-start space-x-8">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="maintenanceMode"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="maintenanceMode" className="ml-2 block text-sm text-gray-900">
                          Maintenance Mode
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="enrollmentsEnabled"
                          checked={settings.enrollmentsEnabled}
                          onChange={(e) => setSettings({ ...settings, enrollmentsEnabled: e.target.checked })}
                          className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <label htmlFor="enrollmentsEnabled" className="ml-2 block text-sm text-gray-900">
                          Enable Enrollments
                        </label>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Update Admin Password</h2>
                  
                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        id="currentPassword"
                        value={passwordForm.currentPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="newPassword"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                        minLength={6}
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirmPassword"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-primary-500"
                        required
                        minLength={6}
                      />
                    </div>

                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isUpdatingPassword}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdatingPassword ? 'Updating...' : 'Update Password'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </motion.div>
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

export default AdminSettings;
