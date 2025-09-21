import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, User, LogOut, Settings, BookOpen, Home, GraduationCap, Phone, Info, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/hooks/useAuth';
import { allCourses } from '@/data/allCourses';

const GlossyNavbar = () => {
  const router = useRouter();
  const { user, isAdmin, profile, signOut } = useAuth();
  const supabaseClient = useSupabaseClient();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Handle scroll effect for glassmorphic background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Search suggestions
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Navigation items with icons
  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Academy', href: '/academy', icon: GraduationCap },
    { label: 'Courses', href: '/courses', icon: BookOpen },
    { label: 'Consulting', href: '/consulting', icon: Briefcase },
    { label: 'About', href: '/about', icon: Info },
    { label: 'Contact', href: '/contact', icon: Phone }
  ];

  const userMenuItems = user ? [
    { label: 'Dashboard', href: '/dashboard', icon: User },
    { label: 'My Courses', href: '/dashboard/courses', icon: BookOpen },
    { label: 'Settings', href: '/dashboard/settings', icon: Settings },
    ...(isAdmin ? [
      { label: 'Admin Panel', href: '/admin', icon: Settings }
    ] : [])
  ] : [];

  // Close search on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Glassmorphic Sticky Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          isScrolled 
            ? 'bg-white/30 backdrop-blur-3xl border-b border-white/30 shadow-2xl shadow-primary-500/10' 
            : 'bg-gradient-to-r from-white/15 via-white/10 to-white/15 backdrop-blur-2xl'
        }`}
        style={{
          background: isScrolled 
            ? 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
            : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: isScrolled 
            ? '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
            : '0 4px 16px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex justify-between items-center h-20">
            
            {/* Left - Glossy Logo */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
              className="flex items-center"
            >
              <Link href="/">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="relative">
                    {/* Gradient shine effect container */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 rounded-xl blur-sm opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative bg-white/20 backdrop-blur-sm p-2 rounded-xl border border-white/30">
                      <Image
                        src="/images/IT-WALA-logo-48x48.png"
                        alt="ITwala Academy Logo"
                        width={40}
                        height={40}
                        className="h-10 w-10 object-contain relative z-10"
                        priority
                      />
                      {/* Shine overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-600 via-secondary-600 to-accent-600 bg-clip-text blur-sm"></div>
                    <div className="relative">
                      <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 bg-clip-text text-transparent">ITwala</span>
                      <div className="text-sm font-medium text-gray-700 mt-0.5">IT- It's Simple</div>
                    </div>
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Center - Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Link href={item.href}>
                    <div className={`group relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      router.pathname === item.href 
                        ? 'text-primary-600' 
                        : 'text-gray-700 hover:text-primary-600'
                    }`}>
                      {item.label}
                      
                      {/* Glowing underline effect */}
                      <div className={`absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500 transition-all duration-300 group-hover:w-full ${
                        router.pathname === item.href ? 'w-full' : ''
                      }`}>
                        {/* Shimmer effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent"
                          initial={{ x: '-100%' }}
                          animate={{ x: router.pathname === item.href ? ['100%', '-100%'] : '-100%' }}
                          transition={{ 
                            duration: 2, 
                            repeat: router.pathname === item.href ? Infinity : 0,
                            ease: "linear"
                          }}
                        />
                      </div>
                      
                      {/* Hover glow effect */}
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400/20 via-secondary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </nav>

            {/* Right - Auth Buttons & Search */}
            <div className="flex items-center space-x-4">
              
              {/* Search Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 text-gray-800 hover:text-primary-600 transition-colors duration-300 relative group bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="w-5 h-5" />
                <div className="absolute inset-0 rounded-full bg-primary-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.button>

              {user ? (
                /* User Menu */
                <div className="relative hidden lg:block">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-800 hover:text-primary-600 transition-colors duration-300 p-2 rounded-xl bg-white/30 backdrop-blur-sm border border-white/40 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsUserMenuOpen(!isUserMenuOpen);
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold">
                      {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                    </div>
                    <span className="hidden xl:block">{profile?.full_name || 'User'}</span>
                  </motion.button>

                  <AnimatePresence>
                    {isUserMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-56 bg-white/80 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/50 py-2 z-10"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.75) 100%)',
                        }}
                      >
                        {userMenuItems.map((item) => {
                          const IconComponent = item.icon;
                          return (
                            <Link key={item.href} href={item.href}>
                              <div className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-800 hover:bg-white/30 transition-colors duration-200 mx-1 rounded-xl">
                                <IconComponent className="w-4 h-4" />
                                <span>{item.label}</span>
                              </div>
                            </Link>
                          );
                        })}
                        <div className="border-t border-white/40 mt-2 pt-2 mx-1">
                          <button
                            onClick={signOut}
                            className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-200 rounded-xl"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                /* Auth Buttons for non-logged in users */
                <div className="hidden lg:flex items-center space-x-3">
                  <Link href="/auth/login">
                    <motion.div
                      whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)" }}
                      whileTap={{ scale: 0.95 }}
                      className="px-6 py-2.5 text-sm font-medium text-gray-700 hover:text-primary-600 transition-all duration-300 relative group cursor-pointer"
                    >
                      Log in
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400/10 via-secondary-500/10 to-accent-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
                    </motion.div>
                  </Link>
                  
                  <Link href="/auth/register">
                    <motion.div
                      whileHover={{ 
                        scale: 1.05, 
                        boxShadow: "0 0 25px rgba(139, 92, 246, 0.6)" 
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-6 py-2.5 text-sm font-medium text-white cursor-pointer group overflow-hidden rounded-xl"
                      style={{
                        background: 'linear-gradient(135deg, #38a169 0%, #22c55e 50%, #22c55e 100%)',
                      }}
                    >
                      <div className="relative z-10">Sign Up</div>
                      
                      {/* Glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      {/* Shine animation */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                      
                      {/* Glow effect */}
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500 opacity-20 blur-sm group-hover:opacity-40 transition-opacity duration-300 -z-10"></div>
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="lg:hidden p-2 text-gray-800 hover:text-primary-600 transition-colors duration-300 relative group bg-white/20 backdrop-blur-sm rounded-full border border-white/30"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                <div className="absolute inset-0 rounded-full bg-primary-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile Menu with slide-down animation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="lg:hidden overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                borderTop: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div className="container mx-auto px-4 py-6 space-y-4">
                
                {/* Mobile Navigation Links */}
                <div className="space-y-2">
                  {navItems.map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link href={item.href}>
                          <div 
                            className={`flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-all duration-300 ${
                              router.pathname === item.href
                                ? 'text-primary-600 bg-primary-50/50'
                                : 'text-gray-700 hover:text-primary-600 hover:bg-white/10'
                            }`}
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <IconComponent className="w-5 h-5" />
                            <span>{item.label}</span>
                          </div>
                        </Link>
                      </motion.div>
                    );
                  })}
                </div>
                
                {user ? (
                  /* Mobile User Menu */
                  <div className="border-t border-white/20 pt-4 space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold">
                        {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{profile?.full_name || 'User'}</div>
                        <div className="text-xs text-gray-500">{user.email}</div>
                      </div>
                    </div>
                    
                    {userMenuItems.map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (index + navItems.length) * 0.1, duration: 0.3 }}
                        >
                          <Link href={item.href}>
                            <div
                              className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white/10 rounded-xl transition-all duration-300"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <IconComponent className="w-5 h-5" />
                              <span>{item.label}</span>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                    
                    <motion.button
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (userMenuItems.length + navItems.length) * 0.1, duration: 0.3 }}
                      onClick={() => {
                        signOut();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center space-x-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50/50 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </motion.button>
                  </div>
                ) : (
                  /* Mobile Auth Buttons */
                  <div className="border-t border-white/20 pt-4 space-y-3">
                    <Link href="/auth/login">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                        className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-white/10 rounded-xl transition-all duration-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Log in
                      </motion.div>
                    </Link>
                    
                    <Link href="/auth/register">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: (navItems.length + 1) * 0.1, duration: 0.3 }}
                        className="block w-full px-4 py-3 text-center text-base font-medium text-white rounded-xl transition-all duration-300 relative overflow-hidden group"
                        style={{
                          background: 'linear-gradient(135deg, #38a169 0%, #22c55e 50%, #22c55e 100%)',
                        }}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="relative z-10">Sign Up</span>
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </motion.div>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl mx-4 mt-24"
              onClick={e => e.stopPropagation()}
            >
              <div 
                className="relative rounded-2xl shadow-2xl border border-white/40 overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.85) 100%)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <form onSubmit={handleSearch} className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 w-5 h-5" />
                    <input
                      type="text"
                      className="w-full pl-12 pr-12 py-4 text-lg bg-white/60 backdrop-blur-sm border border-white/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent placeholder-gray-600 text-gray-900 shadow-inner"
                      placeholder="Search courses..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800 transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </form>
                
                {suggestions.length > 0 && (
                  <div className="border-t border-white/40 max-h-64 overflow-y-auto bg-white/20">
                    {suggestions.map((suggestion, idx) => (
                      <motion.div
                        key={suggestion}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.2 }}
                        className="px-6 py-4 cursor-pointer hover:bg-white/30 transition-colors text-gray-800 text-base border-b border-white/20 last:border-0"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          router.push(`/courses?search=${encodeURIComponent(suggestion)}`);
                          setIsSearchOpen(false);
                          setSearchQuery('');
                        }}
                      >
                        {suggestion}
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="px-6 py-3 text-xs text-gray-600 text-center border-t border-white/40 bg-white/10">
                  Press <kbd className="px-2 py-1 bg-white/40 rounded border border-white/50 text-xs">Esc</kbd> to close
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GlossyNavbar;