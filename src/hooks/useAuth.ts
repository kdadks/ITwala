import { useEffect, useState } from 'react';
import { useSupabaseClient, useUser, useSession } from '@supabase/auth-helpers-react';
import router, { useRouter } from 'next/router';
import toast from 'react-hot-toast';

interface Profile {
  id: string;
  full_name?: string;
  role: 'admin' | 'instructor' | 'student';
  email: string;
  avatar_url?: string;
  bio?: string;
  created_at: string;
  phone?: string;
  student_id?: string | null;
  date_of_birth?: string | null;
  parent_name?: string | null;
}

interface UseAuthReturn {
  isLoading: boolean;
  user: any;
  isAdmin: boolean;
  isInstructor: boolean;
  profile: Profile | null;
  signOut: () => Promise<void>;
  hasPermission: (requiredRoles: string[]) => boolean;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

export const useAuth = (): UseAuthReturn => {
  const supabase = useSupabaseClient();
  const user = useUser();
  const session = useSession(); // Use session from auth helpers
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isInstructor, setIsInstructor] = useState(false);

  const checkAdminStatus = (user: any, profileData: Profile | null) => {
    // Check user metadata first (from auth.users)
    const isMetadataAdmin = user?.user_metadata?.role === 'admin';
    // Then check profile role (from profiles table)
    const isProfileAdmin = profileData?.role === 'admin';
    // Special case for admin@itwala.com
    const isAdminEmail = user?.email === 'admin@itwala.com';

    // Consider admin if any of the checks pass
    return isMetadataAdmin || isProfileAdmin || isAdminEmail;
  };

  const fetchProfile = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && !profileError.message.includes('Results contain 0 rows')) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      let currentProfile = profileData;

      if (!currentProfile) {
        const isAdminEmail = user.email === 'admin@itwala.com';
        const isMetadataAdmin = user.user_metadata?.role === 'admin';

        // Set admin role if either email matches or metadata indicates admin
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || user.email || 'User',
            role: (isAdminEmail || isMetadataAdmin) ? 'admin' : 'student',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
          throw createError;
        }
        currentProfile = newProfile;
      }

      // Ensure the profile has a valid role
      if (!currentProfile.role || currentProfile.role === 'user') {
        const isAdminEmail = user.email === 'admin@itwala.com';
        const isMetadataAdmin = user.user_metadata?.role === 'admin';
        const newRole = (isAdminEmail || isMetadataAdmin) ? 'admin' : 'student';

        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({
            role: newRole,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)
          .select()
          .single();

        if (updateError) {
          console.error('Error updating profile role:', updateError);
        } else {
          currentProfile = updatedProfile;
        }
      }

      // Set states based on profile and metadata
      setProfile(currentProfile);
      const adminStatus = checkAdminStatus(user, currentProfile);
      setIsAdmin(adminStatus);
      setIsInstructor(currentProfile?.role === 'instructor');

    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Error loading profile');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user?.id]); // Only depend on user.id to avoid infinite loops

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const hasPermission = (requiredRoles: string[]): boolean => {
    if (!profile || !profile.role) {
      return false;
    }
    return requiredRoles.includes(profile.role);
  };

  const updateProfile = async (data: Partial<Profile>) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', user?.id);

      if (error) throw error;

      await fetchProfile();
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
      throw error;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      toast.success('Password updated successfully');
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error('Failed to update password');
      throw error;
    }
  };

  return {
    isLoading,
    user,
    isAdmin,
    isInstructor,
    profile,
    signOut,
    hasPermission,
    updateProfile,
    updatePassword,
  };
};
