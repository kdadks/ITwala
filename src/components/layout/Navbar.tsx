import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';

import { allCourses } from '@/data/allCourses';

const Navbar = () => {
  const router = useRouter();
  const { user, isAdmin, profile, signOut } = useAuth();
  const supabaseClient = useSupabaseClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // DEBUG: Log allCourses for autocomplete troubleshooting
  useEffect(() => {
    console.log('allCourses:', allCourses.length, allCourses);
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      const filtered = allCourses
        .filter(course =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map(course => course.title)
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  }, [searchQuery]);

  // DEBUG: Log allCourses for autocomplete troubleshooting
  useEffect(() => {
    console.log('allCourses:', allCourses.length, allCourses);
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabaseClient.auth.signOut();
      if (error) throw error;
      
      toast.success('Logged out successfully');
      router.push('/');
    } catch (error: any) {
      toast.error('Error logging out');
      console.error('Logout error:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Academy', href: '/academy' },
    { label: 'Courses', href: '/courses' },
    { label: 'Consulting', href: '/consulting' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const userMenuItems = user ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'My Courses', href: '/dashboard/courses' },
    { label: 'Settings', href: '/dashboard/settings' },
    ...(isAdmin ? [
      { label: 'Admin Panel', href: '/admin' }
    ] : [])
  ] : [];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Add Escape key handler for closing search modal
  useEffect(() => {
    if (!isSearchOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${isScrolled ? 'bg-white/80 border-b border-gray-200 shadow-md' : 'bg-white/40 border-b border-transparent'} dark:${isScrolled ? 'bg-gray-900/80 border-b border-gray-700' : 'bg-gray-900/40 border-b border-transparent'}`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center space-x-3">
                <img
                  src="/images/IT - WALA_logo (1).png"
                  alt="ITwala Academy Logo"
                  className="h-10 w-auto"
                  style={{ maxWidth: 48 }}
                />
                <div className="flex flex-col justify-center leading-tight">
                  <span className="text-xl font-bold text-primary-500">ITwala</span>
                  <span className="text-xs md:text-sm text-primary-700 font-medium mt-0.5 ml-0.5 tracking-wide whitespace-nowrap">IT- It's Simple</span>
                </div>
              </div>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex items-center space-x-6">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <div className={`text-sm font-medium ${router.pathname === item.href ? 'text-primary-500' : 'text-gray-700 hover:text-primary-500'} transition-colors`}>
                    {item.label}
                  </div>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                className="text-gray-700 hover:text-primary-500 transition-colors"
                onClick={() => setIsSearchOpen(true)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>

              {user ? (
                <div className="relative">
                  <button
                    className="flex items-center text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors focus:outline-none"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-500 text-white flex items-center justify-center">
                      {profile?.avatar_url ? (
                        <img
                          className="h-8 w-8 rounded-full"
                          src={profile.avatar_url}
                          alt={profile.full_name}
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium">
                            {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                      >
                        {userMenuItems.map((item) => (
                          <Link key={item.href} href={item.href}>
                            <div
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setIsUserMenuOpen(false)}
                            >
                              {item.label}
                            </div>
                          </Link>
                        ))}
                        <button
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={signOut}
                        >
                          Sign out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link href="/auth/login">
                    <div className="text-sm font-medium text-gray-700 hover:text-primary-500 transition-colors">
                      Log in
                    </div>
                  </Link>
                  <Link href="/auth/register">
                    <div className="text-sm font-medium bg-primary-500 text-white py-2 px-4 rounded-md hover:bg-primary-600 transition-colors">
                      Sign up
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center space-x-3">
            {/* Mobile Search Button */}
            <button
              className="text-gray-700 hover:text-primary-500 transition-colors p-2"
              onClick={() => setIsSearchOpen(true)}
              aria-label="Search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </button>
            
            {/* Mobile Menu Button */}
            <button
              className="text-gray-700 hover:text-primary-500 transition-colors focus:outline-none p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white border-t border-gray-200 overflow-hidden shadow-lg"
          >
            <div className="container mx-auto px-4 py-6">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                        router.pathname === item.href
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </div>
                  </Link>
                ))}
                
                {user && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <div className="px-4 py-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                          <span className="text-primary-600 font-medium text-sm">
                            {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {profile?.full_name || user.email}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {userMenuItems.map((item) => (
                      <Link key={item.href} href={item.href}>
                        <div
                          className={`block px-4 py-3 text-base font-medium rounded-lg transition-colors ${
                            router.pathname === item.href
                              ? 'text-primary-600 bg-primary-50'
                              : 'text-gray-700 hover:text-primary-600 hover:bg-gray-50'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.label}
                        </div>
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Sign out
                    </button>
                  </>
                )}
                
                {!user && (
                  <>
                    <div className="border-t border-gray-200 my-2"></div>
                    <Link href="/auth/login">
                      <div
                        className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in
                      </div>
                    </Link>
                    <Link href="/auth/register">
                      <div
                        className="block px-4 py-3 text-base font-medium bg-primary-500 text-white hover:bg-primary-600 rounded-lg transition-colors text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign up
                      </div>
                    </Link>
                  </>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg relative flex flex-col mt-24 mb-8 max-h-[90vh] overflow-y-auto pt-12"
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                onClick={() => setIsSearchOpen(false)}
                aria-label="Close search"
                type="button"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
              <form onSubmit={handleSearch} autoComplete="off">
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  autoFocus
                />
              </form>
              {suggestions.length > 0 && (
                <ul className="mt-3 bg-white border border-gray-200 rounded-md shadow max-h-56 overflow-y-auto divide-y divide-gray-100">
                  {suggestions.map((suggestion, idx) => (
                    <li
                      key={suggestion}
                      className="px-4 py-3 cursor-pointer hover:bg-primary-50 text-gray-700 text-base"
                      onClick={() => {
                        setSearchQuery(suggestion);
                        router.push(`/courses?search=${encodeURIComponent(suggestion)}`);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-gray-400 mt-4 text-center">Press <kbd className="px-1 py-0.5 bg-gray-100 rounded border text-xs">Esc</kbd> to close</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;