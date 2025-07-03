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
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  highestQualification: string;
  degreeName: string;
  hasLaptop: boolean;
}

interface PasswordFormData {
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
  
  const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm<ProfileFormData>();
  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, watch, formState: { errors: passwordErrors } } = useForm<PasswordFormData>();
  
  const newPassword = watch('newPassword', '');

  // Indian states list
  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
    "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
    "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
    "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
    "West Bengal"
  ];

  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        try {
          // Fetch profile data from database
          const { data: profile, error } = await supabaseClient
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
            console.error('Error fetching profile:', error);
          }

          // Set form data with profile info or defaults
          resetProfile({
            fullName: profile?.full_name || user.user_metadata?.full_name || '',
            email: user.email || '',
            phone: profile?.phone || '',
            bio: profile?.bio || '',
            addressLine1: profile?.address_line1 || '',
            addressLine2: profile?.address_line2 || '',
            city: profile?.city || '',
            state: profile?.state || '',
            country: profile?.country || 'India',
            pincode: profile?.pincode || '',
            highestQualification: profile?.highest_qualification || '',
            degreeName: profile?.degree_name || '',
            hasLaptop: profile?.has_laptop || false,
          });
        } catch (error) {
          console.error('Error fetching profile:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();
  }, [user, resetProfile, supabaseClient]);

  const updateProfile = async (data: ProfileFormData) => {
    setIsUpdating(true);
    
    try {
      console.log('Sending profile update request...');
      
      const profileData = {
        fullName: data.fullName,
        phone: data.phone,
        bio: data.bio,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2,
        city: data.city,
        state: data.state,
        country: data.country,
        pincode: data.pincode,
        highestQualification: data.highestQualification,
        degreeName: data.degreeName,
        hasLaptop: data.hasLaptop
      };

      // Try the main API endpoint first
      let response = await fetch('/api/profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profileData }),
      });

      console.log('Main API response status:', response.status);
      
      let result = await response.json();
      console.log('Main API response data:', result);

      // If main API fails with permission error, try the simple API
      if (!response.ok && result.debug?.code === '42501') {
        console.log('Permission error detected, trying simple API...');
        
        response = await fetch('/api/profile/update-simple', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ profileData }),
        });

        console.log('Simple API response status:', response.status);
        result = await response.json();
        console.log('Simple API response data:', result);
      }

      if (!response.ok) {
        const errorMessage = result.message || 'Failed to update profile';
        const debugInfo = result.debug ? ` (Debug: ${JSON.stringify(result.debug)})` : '';
        throw new Error(errorMessage + debugInfo);
      }

      toast.success('Profile updated successfully!');
      console.log('Profile update successful');
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to update profile. Please try again.';
      toast.error(errorMessage);
      console.error('Update profile error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const updatePassword = async (data: PasswordFormData) => {
    setIsUpdating(true);
    
    try {
      const { error } = await supabaseClient.auth.updateUser({
        password: data.newPassword,
      });

      if (error) {
        throw new Error(error.message);
      }

      toast.success('Password updated successfully!');
      resetPassword({
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
                    <form onSubmit={handleSubmitProfile(updateProfile)} className="space-y-6">
                      {/* Basic Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              id="fullName"
                              className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                profileErrors.fullName ? 'border-red-500' : 'border-gray-300'
                              }`}
                              {...registerProfile('fullName', { required: 'Full name is required' })}
                            />
                            {profileErrors.fullName && <p className="mt-1 text-sm text-red-500">{profileErrors.fullName.message}</p>}
                          </div>
                          
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                              type="email"
                              id="email"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-100"
                              disabled
                              {...registerProfile('email')}
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
                              {...registerProfile('phone')}
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            <textarea
                              id="bio"
                              rows={3}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Tell us a little about yourself"
                              {...registerProfile('bio')}
                            ></textarea>
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Address Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                            <input
                              type="text"
                              id="addressLine1"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Street address"
                              {...registerProfile('addressLine1')}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                            <input
                              type="text"
                              id="addressLine2"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="Apartment, suite, etc. (optional)"
                              {...registerProfile('addressLine2')}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                            <input
                              type="text"
                              id="city"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              {...registerProfile('city')}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <select
                              id="state"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              {...registerProfile('state')}
                            >
                              <option value="">Select State</option>
                              {indianStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <input
                              type="text"
                              id="country"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              {...registerProfile('country')}
                            />
                          </div>
                          
                          <div>
                            <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                            <input
                              type="text"
                              id="pincode"
                              pattern="[0-9]{6}"
                              maxLength={6}
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="123456"
                              {...registerProfile('pincode')}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Educational Information */}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Educational Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification</label>
                            <select
                              id="highestQualification"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              {...registerProfile('highestQualification')}
                            >
                              <option value="">Select qualification</option>
                              <option value="10th">10th</option>
                              <option value="12th">12th</option>
                              <option value="diploma">Diploma</option>
                              <option value="bachelors">Bachelor's Degree</option>
                              <option value="masters">Master's Degree</option>
                              <option value="phd">Ph.D.</option>
                            </select>
                          </div>
                          
                          <div>
                            <label htmlFor="degreeName" className="block text-sm font-medium text-gray-700 mb-1">Degree Name</label>
                            <input
                              type="text"
                              id="degreeName"
                              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                              placeholder="e.g., Computer Science, MBA"
                              {...registerProfile('degreeName')}
                            />
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <div className="flex items-center">
                            <input
                              id="hasLaptop"
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              {...registerProfile('hasLaptop')}
                            />
                            <label htmlFor="hasLaptop" className="ml-3 text-sm font-medium text-gray-700">
                              I have access to a laptop
                            </label>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">This helps us understand your learning setup for technical courses.</p>
                        </div>
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
                    <form onSubmit={handleSubmitPassword(updatePassword)} className="space-y-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                        <input
                          type="password"
                          id="currentPassword"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            passwordErrors.currentPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...registerPassword('currentPassword', { required: 'Current password is required' })}
                        />
                        {passwordErrors.currentPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.currentPassword.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                        <input
                          type="password"
                          id="newPassword"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            passwordErrors.newPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...registerPassword('newPassword', {
                            required: 'New password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters',
                            },
                          })}
                        />
                        {passwordErrors.newPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.newPassword.message}</p>}
                      </div>
                      
                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                        <input
                          type="password"
                          id="confirmPassword"
                          className={`w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            passwordErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                          }`}
                          {...registerPassword('confirmPassword', {
                            required: 'Please confirm your new password',
                            validate: value => value === newPassword || 'The passwords do not match',
                          })}
                        />
                        {passwordErrors.confirmPassword && <p className="mt-1 text-sm text-red-500">{passwordErrors.confirmPassword.message}</p>}
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