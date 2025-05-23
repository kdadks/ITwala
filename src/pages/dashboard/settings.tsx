import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface ProfileFormData {
  fullName: string;
  email: string;
  phone: string;
  bio: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const Settings: NextPage = () => {
  const router = useRouter();
  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm<ProfileFormData>();
  
  const newPassword = watch('newPassword', '');

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      // In a real app, you would fetch the user's profile from your database
      reset({
        fullName: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: user.user_metadata?.phone || '',
        bio: user.user_metadata?.bio || '',
      });
      setIsLoading(false);
    }
  }, [user, reset]);

  const updateProfile = async (data: ProfileFormData) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabaseClient.auth.updateUser({
        data: {
          full_name: data.fullName,
          phone: data.phone,
          bio: data.bio,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile. Please try again.');
      console.error('Update profile error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async (data: ProfileFormData) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Password updated successfully!');
      reset({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password. Please try again.');
      console.error('Update password error:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Account Settings - ITwala Academy</title>
        <meta name="description" content="Manage your account settings and preferences on ITwala Academy." />
      </Head>

      <main className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
              
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'profile'
                        ? 'text-primary-600 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('profile')}
                  >
                    Profile Information
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'password'
                        ? 'text-primary-600 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('password')}
                  >
                    Password
                  </button>
                  <button
                    className={`px-6 py-3 font-medium text-sm ${
                      activeTab === 'notifications'
                        ? 'text-primary-600 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveTab('notifications')}
                  >
                    Notifications
                  </button>
                </div>
                
                <div className="p-6">
                  {activeTab === 'profile' && (
                    <form onSubmit={handleSubmit(updateProfile)} className="space-y-6">
                      <div>
                        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          id="fullName"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.fullName ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...register('fullName', { required: 'Full name is required' })}
                        />
                        {errors.fullName && <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          id="email"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100"
                          disabled
                          {...register('email')}
                        />
                        <p className="mt-1 text-sm text-gray-500">Your email cannot be changed</p>
                      </div>
                      
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          id="phone"
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+91 9999999999"
                          {...register('phone')}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                        <textarea
                          id="bio"
                          rows={4}
                          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="Tell us a little about yourself"
                          {...register('bio')}
                        ></textarea>
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? 'Saving...' : 'Save Changes'}
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === 'password' && (
                    <form onSubmit={handleSubmit(updatePassword)} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...register('currentPassword', { required: 'Current password is required' })}
                        />
                        {errors.currentPassword && <p className="mt-1 text-sm text-red-500">{errors.currentPassword.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...register('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters',
                            },
                          })}
                        />
                        {errors.newPassword && <p className="mt-1 text-sm text-red-500">{errors.newPassword.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...register('confirmPassword', {
                            required: 'Please confirm your new password',
                            validate: value => value === newPassword || 'The passwords do not match',
                          })}
                        />
                        {errors.confirmPassword && <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>}
                      </div>
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isUpdating}
                          className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {isUpdating ? 'Updating...' : 'Update Password'}
                        </button>
                      </div>
                    </form>
                  )}
                  
                  {activeTab === 'notifications' && (
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="emailCourseUpdates"
                                name="emailCourseUpdates"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailCourseUpdates" className="font-medium text-gray-700">Course updates</label>
                              <p className="text-gray-500">Get notified when courses you're enrolled in are updated.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="emailNewCourses"
                                name="emailNewCourses"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailNewCourses" className="font-medium text-gray-700">New course announcements</label>
                              <p className="text-gray-500">Get notified when new courses are available in your areas of interest.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="emailPromotions"
                                name="emailPromotions"
                                type="checkbox"
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="emailPromotions" className="font-medium text-gray-700">Promotions and special offers</label>
                              <p className="text-gray-500">Get notified about discounts and special promotions.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Platform Notifications</h3>
                        
                        <div className="space-y-4">
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="platformComments"
                                name="platformComments"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="platformComments" className="font-medium text-gray-700">Comments and replies</label>
                              <p className="text-gray-500">Get notified when someone replies to your comment or question.</p>
                            </div>
                          </div>
                          
                          <div className="flex items-start">
                            <div className="flex items-center h-5">
                              <input
                                id="platformAssignments"
                                name="platformAssignments"
                                type="checkbox"
                                defaultChecked
                                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                              />
                            </div>
                            <div className="ml-3 text-sm">
                              <label htmlFor="platformAssignments" className="font-medium text-gray-700">Assignment reminders</label>
                              <p className="text-gray-500">Get notified about upcoming assignments and deadlines.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <button
                          type="button"
                          onClick={() => toast.success('Notification preferences saved!')}
                          className="py-2 px-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-md transition duration-200"
                        >
                          Save Preferences
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
};

export default Settings;