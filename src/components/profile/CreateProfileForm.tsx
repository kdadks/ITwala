import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import toast from 'react-hot-toast';

interface ProfileFormData {
  fullName: string;
  phone?: string;
  bio?: string;
}

interface CreateProfileFormProps {
  onSuccess?: () => void;
}

const CreateProfileForm: React.FC<CreateProfileFormProps> = ({ onSuccess }) => {
  const supabaseClient = useSupabaseClient();
  const user = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>();

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) {
      toast.error('You must be logged in to create a profile');
      return;
    }

    setIsLoading(true);

    try {
      // Try to create profile via API first
      const response = await fetch('/api/auth/create-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          full_name: data.fullName,
          avatar_url: '',
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Update additional fields if API creation was successful
        if (data.phone || data.bio) {
          const { error: updateError } = await supabaseClient
            .from('profiles')
            .update({
              phone: data.phone || null,
              bio: data.bio || null,
              updated_at: new Date().toISOString(),
            })
            .eq('id', user.id);

          if (updateError) {
            console.error('Error updating additional profile fields:', updateError);
            // Don't fail completely, just warn
            toast.success('Profile created successfully, but some additional information may not have been saved.');
          } else {
            toast.success('Profile created successfully!');
          }
        } else {
          toast.success('Profile created successfully!');
        }

        if (onSuccess) {
          onSuccess();
        }
      } else {
        console.error('API error:', result);
        toast.error(result.error || 'Failed to create profile');
      }
    } catch (error) {
      console.error('Error creating profile:', error);
      toast.error('An error occurred while creating your profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Profile</h2>
      <p className="text-gray-600 mb-6">
        It looks like your profile wasn't created during registration. Please complete your profile below.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="fullName"
            type="text"
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
              errors.fullName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Enter your full name"
            {...register('fullName', { required: 'Full name is required' })}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="+91 9999999999"
            {...register('phone')}
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Tell us a little about yourself..."
            {...register('bio')}
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Profile...' : 'Create Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfileForm;