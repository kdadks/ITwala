import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, LogOut, Settings, BookOpen, Home, GraduationCap, Phone, Info, Briefcase, Folder } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const GlossyNavbar = () => {
  const router = useRouter();
  const { user, isAdmin, profile, signOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Handle scroll effect for glassmorphic background
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  // Navigation items with icons
  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Academy', href: '/academy', icon: GraduationCap },
    { label: 'Courses', href: '/courses', icon: BookOpen },
    { label: 'Portfolio', href: '/portfolio', icon: Folder },
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

  // Close menu on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Stunning Rounded Centered Header */}
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 w-full z-50 px-4 pt-6 pb-4 transition-all duration-500 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700"
      >
        {/* Centered Container with Rounded Glassmorphic Design */}
        <div className="container mx-auto max-w-7xl">
          <div
            className={`relative rounded-3xl transition-all duration-500 ${
              isScrolled
                ? 'bg-white/70 shadow-2xl shadow-primary-500/20'
                : 'bg-white/50 shadow-xl'
            }`}
            style={{
              background: isScrolled
                ? 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(249,250,251,0.90) 50%, rgba(255,255,255,0.95) 100%)'
                : 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(249,250,251,0.70) 50%, rgba(255,255,255,0.75) 100%)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255, 255, 255, 0.5)',
              boxShadow: isScrolled
                ? '0 20px 60px rgba(0, 0, 0, 0.12), 0 8px 32px rgba(59, 130, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8), inset 0 -1px 0 rgba(0, 0, 0, 0.05)'
                : '0 12px 40px rgba(0, 0, 0, 0.08), 0 4px 16px rgba(59, 130, 246, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
            }}
          >
            {/* Gradient Border Effect */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-400/20 via-secondary-500/20 to-accent-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

            {/* Shimmer Effect Overlay */}
            <motion.div
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0"
              animate={{
                x: ['-200%', '200%'],
                opacity: [0, 0.3, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "linear"
              }}
            />

            <div className="flex justify-between items-center px-6 lg:px-8 h-20 md:h-24">
            
            {/* Left - Stunning Logo with 3D Effect */}
            <motion.div
              whileHover={{ scale: 1.05, rotateY: 5 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="flex items-center relative"
              style={{ perspective: '1000px' }}
            >
              <Link href="/">
                <div className="flex items-center space-x-3 group cursor-pointer">
                  <div className="relative transform-gpu">
                    {/* Glowing backdrop */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary-400 via-secondary-500 to-accent-500 rounded-2xl blur-lg"
                      animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.6, 0.8, 0.6]
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />

                    {/* Logo container with depth */}
                    <div className="relative rounded-2xl border border-white/60 shadow-xl">
                      <Image
                        src="/images/IT-WALA-logo-64x64.png"
                        alt="ITwala Logo"
                        width={64}
                        height={64}
                        className="h-16 w-16 object-contain relative z-10 drop-shadow-lg rounded-lg"
                        priority
                        quality={100}
                      />

                      {/* Holographic shine overlay */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"
                        animate={{
                          backgroundPosition: ['0% 0%', '100% 100%']
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse"
                        }}
                      />

                      {/* Inner glow */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary-200/30 via-transparent to-accent-200/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </div>

                  {/* Brand text with gradient animation */}
                  <div className="relative block">
                    <motion.div
                      className="relative"
                      whileHover={{ x: 2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-2xl md:text-3xl font-extrabold bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-600 bg-clip-text text-transparent drop-shadow-sm">
                        ITwala
                      </span>
                      <div className="text-xs md:text-sm font-semibold text-gray-600 mt-0.5 tracking-wide">
                        IT- It's Simple
                      </div>
                    </motion.div>

                    {/* Animated shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent opacity-0 group-hover:opacity-100"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '200%' }}
                      transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Center - Stunning Navigation Pill Design */}
            <nav className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              <div className="flex items-center space-x-1 bg-white/40 backdrop-blur-md px-3 py-2 rounded-full border border-white/60 shadow-lg">
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.08, duration: 0.4, type: "spring" }}
                  >
                    <Link href={item.href}>
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={`relative px-5 py-2.5 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                          router.pathname === item.href
                            ? 'text-white'
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        {/* Active state background with gradient */}
                        {router.pathname === item.href && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-500 via-primary-600 to-secondary-600 shadow-lg"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                            style={{
                              boxShadow: '0 4px 16px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                            }}
                          >
                            {/* Animated shine effect on active tab */}
                            <motion.div
                              className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/30 to-transparent"
                              animate={{ x: ['-100%', '100%'] }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                              }}
                            />
                          </motion.div>
                        )}

                        {/* Hover state background */}
                        {router.pathname !== item.href && (
                          <div className="absolute inset-0 rounded-full bg-white/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        )}

                        <span className="relative z-10">{item.label}</span>

                        {/* Glow effect on hover for inactive tabs */}
                        {router.pathname !== item.href && (
                          <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400/0 via-primary-400/20 to-primary-400/0 opacity-0"
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        )}
                      </motion.div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </nav>

            {/* Right - Stunning Action Buttons */}
            <div className="flex items-center space-x-3">

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
                /* Premium Auth Buttons */
                <div className="hidden lg:flex items-center space-x-2">
                  <Link href="/auth/login">
                    <motion.div
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-6 py-2.5 text-sm font-semibold text-gray-700 hover:text-primary-600 transition-all duration-300 cursor-pointer group bg-white/50 backdrop-blur-sm rounded-full border border-white/60 shadow-md overflow-hidden"
                      style={{
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.6)'
                      }}
                    >
                      <span className="relative z-10">Log in</span>

                      {/* Hover gradient background */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary-50 via-secondary-50 to-primary-50 opacity-0"
                        whileHover={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />

                      {/* Shimmer effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-0 group-hover:opacity-100"
                        initial={{ x: '-100%' }}
                        whileHover={{ x: '100%' }}
                        transition={{ duration: 0.6 }}
                      />
                    </motion.div>
                  </Link>

                  <Link href="/auth/register">
                    <motion.div
                      whileHover={{
                        scale: 1.05,
                        y: -2,
                        boxShadow: "0 8px 24px rgba(34, 197, 94, 0.4)"
                      }}
                      whileTap={{ scale: 0.95 }}
                      className="relative px-6 py-2.5 text-sm font-semibold text-white cursor-pointer group overflow-hidden rounded-full"
                      style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
                        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
                      }}
                    >
                      <span className="relative z-10 flex items-center space-x-2">
                        <span>Sign Up</span>
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </span>

                      {/* Glossy overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full"></div>

                      {/* Animated shine */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1,
                          ease: "linear"
                        }}
                      />

                      {/* Outer glow pulse */}
                      <motion.div
                        className="absolute inset-0 rounded-full bg-emerald-400 opacity-30 blur-md -z-10"
                        animate={{
                          scale: [1, 1.15, 1],
                          opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      />
                    </motion.div>
                  </Link>
                </div>
              )}

              {/* Premium Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                className="lg:hidden p-3 text-primary-700 hover:text-primary-800 transition-all duration-300 relative group bg-white/90 backdrop-blur-md rounded-full border border-white/70 shadow-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                style={{
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.7)'
                }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isMenuOpen ? 'close' : 'menu'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </motion.div>
                </AnimatePresence>

                {/* Glow effect on hover */}
                <motion.div
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 via-secondary-500 to-accent-500 opacity-0 blur-md"
                  whileHover={{ opacity: 0.5, scale: 1.2 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </div>
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
              className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-xl border-t border-gray-200 shadow-lg"
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
                                ? 'text-white bg-primary-600 shadow-md'
                                : 'text-gray-800 hover:text-primary-600 hover:bg-primary-50'
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
                  <div className="border-t border-gray-200 pt-4 space-y-2">
                    <div className="flex items-center space-x-3 px-4 py-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-secondary-600 flex items-center justify-center text-white font-semibold">
                        {profile?.full_name?.[0] || user.email?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{profile?.full_name || 'User'}</div>
                        <div className="text-xs text-gray-600">{user.email}</div>
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
                              className="flex items-center space-x-3 px-4 py-3 text-base font-medium text-gray-800 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300"
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
                      className="flex items-center space-x-3 w-full px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-300"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Sign out</span>
                    </motion.button>
                  </div>
                ) : (
                  /* Mobile Auth Buttons */
                  <div className="border-t border-gray-200 pt-4 space-y-3">
                    <Link href="/auth/login">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: navItems.length * 0.1, duration: 0.3 }}
                        className="block w-full px-4 py-3 text-center text-base font-medium text-gray-800 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all duration-300 border border-gray-300"
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
    </>
  );
};

export default GlossyNavbar;