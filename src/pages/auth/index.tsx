import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import UnifiedHero from '@/components/home/UnifiedHero';
import ServiceShowcase from '@/components/home/ServiceShowcase';
import Stats from '@/components/home/Stats';
import FeaturedCourses from '@/components/home/FeaturedCourses';

interface LoginFormData {
  email: string;
  password: string;
}

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthPage: NextPage = () => {
  const supabaseClient = useSupabaseClient();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);

  // Login form
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors }
  } = useForm<LoginFormData>();

  // Register form
  const {
    register: registerSignup,
    handleSubmit: handleRegisterSubmit,
    watch,
    formState: { errors: registerErrors }
  } = useForm<RegisterFormData>();

  const password = watch('password', '');

  // Login handler
  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);

    try {
      console.log('Attempting login for:', data.email);

      // Clear any existing session conflicts before login
      if (typeof window !== 'undefined') {
        const authKeys = Object.keys(localStorage).filter(key =>
          key.includes('supabase') || key.includes('auth') || key.includes('sb-')
        );
        if (authKeys.length > 1) {
          console.log('Clearing multiple auth tokens before login');
          authKeys.forEach(key => localStorage.removeItem(key));
        }
      }

      // Attempt to sign in
      const { data: signInData, error: signInError } = await supabaseClient.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      // If sign in succeeds, we're done
      if (!signInError && signInData?.user) {
        console.log('Login successful for user:', signInData.user.email);
        toast.success('Logged in successfully!');

        // Check for enrollment intent
        const enrollmentIntent = localStorage.getItem('enrollmentIntent');
        if (enrollmentIntent && router.query.redirect === 'enrollment') {
          try {
            const intent = JSON.parse(enrollmentIntent);
            localStorage.removeItem('enrollmentIntent');

            // Proceed with enrollment
            const enrollmentResponse = await fetch('/api/enrollment/enroll', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                courseId: intent.courseId,
                userDetails: intent.userDetails
              }),
            });

            const enrollmentData = await enrollmentResponse.json();

            if (enrollmentResponse.ok) {
              toast.success(`Successfully enrolled in ${intent.courseTitle}! You are now a ${enrollmentData.userRole}.`);
              router.push('/dashboard/courses');
              return;
            } else {
              toast.error(enrollmentData.message || 'Failed to complete enrollment');
            }
          } catch (enrollmentError) {
            console.error('Enrollment error:', enrollmentError);
            toast.error('Failed to complete enrollment after login');
          }
        }

        // Check if user is admin and redirect appropriately
        if (data.email === 'admin@itwala.com') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
        return;
      }

      // Handle specific error cases
      if (signInError) {
        console.error('Login error:', signInError);

        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          // Special handling for admin account setup
          if (data.email === 'admin@itwala.com') {
            toast.error('Invalid admin credentials. Please contact support if this persists.');
          } else {
            toast.error('Invalid email or password. Please check your credentials and try again.');
          }
        } else if (signInError.message.toLowerCase().includes('email not confirmed')) {
          toast.error('Please check your email for the confirmation link before logging in.');
        } else if (signInError.message.toLowerCase().includes('too many requests')) {
          toast.error('Too many login attempts. Please wait a moment before trying again.');
        } else {
          toast.error(signInError.message || 'Failed to log in. Please try again.');
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred. Please try again.';
      console.error('Login error:', errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Register helper function
  const createProfile = async (userId: string, fullName: string) => {
    try {
      const { data, error } = await supabaseClient.rpc('create_user_profile_simple', {
        p_full_name: fullName,
        p_avatar_url: ''
      });

      if (error) {
        console.error('Profile creation error:', error);
        return false;
      }

      console.log('Profile creation result:', data);
      return true;
    } catch (error) {
      console.error('Profile creation failed:', error);
      return false;
    }
  };

  // Register handler
  const onRegisterSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      const { error, data: authData } = await supabaseClient.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.name,
          },
        },
      });

      if (error) {
        // Show a user-friendly message if the user is already registered
        if (error.message && error.message.toLowerCase().includes('user already registered')) {
          toast.error('An account with this email already exists. Please log in or use a different email.');
          setIsLoading(false);
          return;
        }

        throw new Error(error.message);
      }

      // Create profile immediately after successful signup
      if (authData?.user) {
        console.log('User created successfully, creating profile...');

        // Get the session to ensure we're authenticated for profile creation
        const { data: session } = await supabaseClient.auth.getSession();

        if (session?.session) {
          const profileCreated = await createProfile(authData.user.id, data.name);

          if (profileCreated) {
            console.log('Profile created successfully');
          } else {
            console.warn('Profile creation failed, but user signup succeeded');
          }
        }
      }

      // Check if there's an enrollment intent
      const enrollmentIntent = localStorage.getItem('enrollmentIntent');
      if (enrollmentIntent) {
        toast.success('Registration successful! Please check your email to confirm your account, then you can complete your course enrollment.');
        setActiveTab('login');
      } else {
        toast.success('Registration successful! Please check your email to confirm your account.');
        setActiveTab('login');
      }
    } catch (error: any) {
      // More specific error handling
      let errorMessage = 'Registration failed. Please try again.';

      if (error.message) {
        // Network errors
        if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessage = 'Network error occurred. Please check your connection and try again.';
        }
        // Generic errors
        else {
          errorMessage = error.message;
        }
      }

      toast.error(errorMessage);
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>{activeTab === 'login' ? 'Login' : 'Register'} - ITwala Academy</title>
        <meta name="description" content="Access your ITwala Academy account or create a new one to start your learning journey." />
      </Head>

      {/* Homepage Content in Background */}
      <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
        <div className="pointer-events-none">
          <UnifiedHero />
          <ServiceShowcase />
          <Stats />
          <FeaturedCourses />
        </div>
      </div>

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center py-6 px-4 sm:px-6 lg:px-8 overflow-y-auto">
        {/* Floating Modal Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full max-w-md my-auto"
        >
          {/* Glow effect behind card */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 via-secondary-500 to-primary-600 rounded-2xl blur-xl opacity-40 animate-pulse" />
          
          {/* Main card */}
          <div className="relative bg-white/95 backdrop-blur-xl border border-primary-200/50 rounded-2xl shadow-2xl p-8 space-y-6">
            {/* Close button */}
            <Link href="/" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Link>

            {/* Header */}
            <div className="text-center">
              {/* Logo/Brand */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-lg overflow-hidden"
              >
                <Image 
                  src="/images/IT-WALA-logo-96x96.png" 
                  alt="ITwala Academy Logo" 
                  width={80} 
                  height={80} 
                  className="object-contain"
                  priority
                />
              </motion.div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome to ITwala Academy
              </h1>
              <p className="text-gray-500 text-sm">
                {activeTab === 'login' ? 'Sign in to continue your learning journey' : 'Create an account to get started'}
              </p>
            </div>

            {/* Tab Buttons */}
            <div className="flex space-x-2 bg-gray-100 rounded-xl p-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'login'
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                Log In
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('register')}
                className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                  activeTab === 'register'
                    ? 'bg-white text-primary-600 shadow-md'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                }`}
              >
                Sign Up
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form className="space-y-5" onSubmit={handleLoginSubmit(onLoginSubmit)}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email address
                        </label>
                        <input
                          id="login-email"
                          type="email"
                          autoComplete="email"
                          className={`w-full px-4 py-3 bg-white border ${
                            loginErrors.email ? 'border-red-400' : 'border-gray-300'
                          } text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                          placeholder="you@example.com"
                          {...registerLogin('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                        />
                        {loginErrors.email && <p className="mt-1.5 text-sm text-red-500">{loginErrors.email.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Password
                        </label>
                        <input
                          id="login-password"
                          type="password"
                          autoComplete="current-password"
                          className={`w-full px-4 py-3 bg-white border ${
                            loginErrors.password ? 'border-red-400' : 'border-gray-300'
                          } text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                          placeholder="••••••••"
                          {...registerLogin('password', { required: 'Password is required' })}
                        />
                        {loginErrors.password && <p className="mt-1.5 text-sm text-red-500">{loginErrors.password.message}</p>}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-offset-0"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                      <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Signing in...
                        </span>
                      ) : 'Sign In'}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <form className="space-y-5" onSubmit={handleRegisterSubmit(onRegisterSubmit)}>
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Full Name
                        </label>
                        <input
                          id="register-name"
                          type="text"
                          autoComplete="name"
                          className={`w-full px-4 py-3 bg-white border ${
                            registerErrors.name ? 'border-red-400' : 'border-gray-300'
                          } text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                          placeholder="John Doe"
                          {...registerSignup('name', { required: 'Full name is required' })}
                        />
                        {registerErrors.name && <p className="mt-1.5 text-sm text-red-500">{registerErrors.name.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Email address
                        </label>
                        <input
                          id="register-email"
                          type="email"
                          autoComplete="email"
                          className={`w-full px-4 py-3 bg-white border ${
                            registerErrors.email ? 'border-red-400' : 'border-gray-300'
                          } text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                          placeholder="you@example.com"
                          {...registerSignup('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                              message: 'Invalid email address',
                            },
                          })}
                        />
                        {registerErrors.email && <p className="mt-1.5 text-sm text-red-500">{registerErrors.email.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Password
                        </label>
                        <input
                          id="register-password"
                          type="password"
                          autoComplete="new-password"
                          className={`w-full px-4 py-3 bg-white border ${
                            registerErrors.password ? 'border-red-400' : 'border-gray-300'
                          } text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                          placeholder="••••••••"
                          {...registerSignup('password', {
                            required: 'Password is required',
                            minLength: {
                              value: 8,
                              message: 'Password must be at least 8 characters',
                            },
                          })}
                        />
                        {registerErrors.password && <p className="mt-1.5 text-sm text-red-500">{registerErrors.password.message}</p>}
                      </div>

                      <div>
                        <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">
                          Confirm Password
                        </label>
                        <input
                          id="register-confirm-password"
                          type="password"
                          autoComplete="new-password"
                          className={`w-full px-4 py-3 bg-white border ${
                            registerErrors.confirmPassword ? 'border-red-400' : 'border-gray-300'
                          } text-gray-900 placeholder-gray-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200`}
                          placeholder="••••••••"
                          {...registerSignup('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: value => value === password || 'The passwords do not match',
                          })}
                        />
                        {registerErrors.confirmPassword && <p className="mt-1.5 text-sm text-red-500">{registerErrors.confirmPassword.message}</p>}
                      </div>
                    </div>

                    <label className="flex items-start cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        className="mt-0.5 w-4 h-4 text-primary-600 bg-white border-gray-300 rounded focus:ring-primary-500 focus:ring-offset-0"
                      />
                      <span className="ml-2 text-sm text-gray-600">
                        I agree to the{' '}
                        <Link href="/terms" className="text-primary-600 hover:text-primary-500">Terms of Service</Link>
                        {' '}and{' '}
                        <Link href="/privacy" className="text-primary-600 hover:text-primary-500">Privacy Policy</Link>
                      </span>
                    </label>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3 px-4 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-secondary-500 text-white font-semibold rounded-xl shadow-lg shadow-primary-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Creating account...
                        </span>
                      ) : 'Create Account'}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default AuthPage;
