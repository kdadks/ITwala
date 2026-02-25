import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { Home, LogOut, Bell } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminHeader: React.FC = () => {
  const router = useRouter();
  const supabase = useSupabaseClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/admin/login');
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <div>
              <h1 className="text-base font-semibold text-gray-900">ITwala Academy</h1>
              <p className="text-xs text-gray-500">Administration Portal</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/">
            <button className="inline-flex items-center gap-2 px-3.5 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200">
              <Home className="w-4 h-4" />
              <span className="hidden md:inline text-sm font-medium">Home</span>
            </button>
          </Link>
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;