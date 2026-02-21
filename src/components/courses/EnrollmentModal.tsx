import React, { useState, useEffect, useMemo } from 'react';
import { Dialog } from '@headlessui/react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useUser } from '@supabase/auth-helpers-react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';
import { getSiteSettings } from '@/utils/siteSettings';
import { 
  countries, 
  getStatesByCountry, 
  getCitiesByState as getCitiesFromState,
  getCountryIsoCode,
  getStateIsoCode
} from '@/utils/locationData';

interface Course {
  id: string;
  title: string;
  price: number;
}

interface EnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: Course;
}

const EnrollmentModal: React.FC<EnrollmentModalProps> = ({ isOpen, onClose, course }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [enrollmentsEnabled, setEnrollmentsEnabled] = useState(true);
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);
  const [hasExistingProfile, setHasExistingProfile] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);
  const [showDirectEnrollment, setShowDirectEnrollment] = useState(false);
  const supabase = useSupabaseClient();
  const user = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    state: '',
    city: '',
    country: 'India',
    pincode: '',
    highestQualification: '',
    degreeName: '',
    hasLaptop: false
  });

  useEffect(() => {
    const checkEnrollmentSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setEnrollmentsEnabled(settings.enrollmentsEnabled);
        
        // If enrollments are disabled and modal is open, show an error and close the modal
        if (!settings.enrollmentsEnabled && isOpen) {
          toast.error('Enrollment is currently disabled. Please try again later.');
          onClose();
        }
      } catch (error) {
        console.error('Error fetching site settings:', error);
        // Default to true if we can't fetch settings
        setEnrollmentsEnabled(true);
      } finally {
        setIsCheckingSettings(false);
      }
    };
    
    if (isOpen) {
      checkEnrollmentSettings();
    }
  }, [isOpen, onClose]);

  // Check if user has previously enrolled in any course and has complete profile
  useEffect(() => {
    const checkUserEnrollmentHistory = async () => {
      if (!isOpen || !user) {
        setIsCheckingProfile(false);
        return;
      }

      try {
        setIsCheckingProfile(true);
        
        // Check if user has any previous enrollments
        const { data: enrollments, error: enrollmentError } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (enrollmentError) {
          console.error('Error checking enrollments:', enrollmentError);
          setHasExistingProfile(false);
          setIsCheckingProfile(false);
          return;
        }

        // If user has previous enrollments, check if profile has complete info
        if (enrollments && enrollments.length > 0) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, phone, address_line1, city, state, country, pincode, highest_qualification')
            .eq('id', user.id)
            .single();

          if (profileError) {
            console.error('Error fetching profile:', profileError);
            setHasExistingProfile(false);
          } else {
            // Check if profile has essential information for direct enrollment
            const hasCompleteProfile = profile &&
              profile.full_name &&
              profile.phone &&
              profile.address_line1 &&
              profile.city &&
              profile.state;

            setHasExistingProfile(!!hasCompleteProfile);
            
            if (hasCompleteProfile) {
              setShowDirectEnrollment(true);
            }
          }
        } else {
          setHasExistingProfile(false);
        }
      } catch (error) {
        console.error('Error checking user enrollment history:', error);
        setHasExistingProfile(false);
      } finally {
        setIsCheckingProfile(false);
      }
    };

    checkUserEnrollmentHistory();
  }, [isOpen, user?.id, supabase]);

  // Get country ISO code from selected country name
  const selectedCountryCode = useMemo(() => {
    return getCountryIsoCode(formData.country);
  }, [formData.country]);

  // Get states for selected country
  const availableStates = useMemo(() => {
    return getStatesByCountry(selectedCountryCode);
  }, [selectedCountryCode]);

  // Get cities for selected state (only for India currently)
  const availableCities = useMemo(() => {
    return getCitiesFromState(formData.state, selectedCountryCode);
  }, [formData.state, selectedCountryCode]);

  // Check if city should be a dropdown or text input
  const hasCityDropdown = selectedCountryCode === 'IN' && availableCities.length > 0;

  // Handle direct enrollment for users with existing profile
  const handleDirectEnrollment = async () => {
    setIsLoading(true);

    try {
      // Check if enrollments are enabled
      const settings = await getSiteSettings();
      if (!settings.enrollmentsEnabled) {
        throw new Error('Enrollment is currently disabled. Please try again later.');
      }

      // Use the new enrollment API endpoint with direct enrollment flag
      const enrollmentResponse = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          directEnrollment: true // Flag to indicate this is a direct enrollment
        }),
      });

      const enrollmentData = await enrollmentResponse.json();

      if (!enrollmentResponse.ok) {
        if (enrollmentData.requiresAuth) {
          toast.error('Please log in to enroll in this course');
          router.push('/auth/login?redirect=enrollment');
          return;
        }
        throw new Error(enrollmentData.message || 'Failed to enroll in the course');
      }

      toast.success(`Successfully enrolled! Your Student ID: ${enrollmentData.studentId}`, {
        duration: 6000
      });
      router.push('/dashboard/courses');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in the course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Check if enrollments are enabled
      const settings = await getSiteSettings();
      if (!settings.enrollmentsEnabled) {
        throw new Error('Enrollment is currently disabled. Please try again later.');
      }

      // If user is not logged in, redirect to login with enrollment intent
      if (!user) {
        // Store enrollment intent in localStorage
        localStorage.setItem('enrollmentIntent', JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          userDetails: formData
        }));
        
        toast.error('Please log in to enroll in this course');
        router.push('/auth/login?redirect=enrollment');
        return;
      }

      // Use the new enrollment API endpoint
      const enrollmentResponse = await fetch('/api/enrollment/enroll', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          userDetails: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            addressLine1: formData.addressLine1,
            addressLine2: formData.addressLine2,
            state: formData.state,
            city: formData.city,
            country: formData.country,
            pincode: formData.pincode,
            highestQualification: formData.highestQualification,
            degreeName: formData.degreeName,
            hasLaptop: formData.hasLaptop
          }
        }),
      });

      const enrollmentData = await enrollmentResponse.json();

      if (!enrollmentResponse.ok) {
        if (enrollmentData.requiresAuth) {
          // Store enrollment intent and redirect to login
          localStorage.setItem('enrollmentIntent', JSON.stringify({
            courseId: course.id,
            courseTitle: course.title,
            userDetails: formData
          }));
          
          toast.error('Please log in to enroll in this course');
          router.push('/auth/login?redirect=enrollment');
          return;
        }
        throw new Error(enrollmentData.message || 'Failed to enroll in the course');
      }

      toast.success(`Successfully enrolled! Your Student ID: ${enrollmentData.studentId}`, {
        duration: 6000
      });
      router.push('/dashboard/courses');
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'Failed to enroll in the course');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog 
      open={isOpen} 
      onClose={() => !isLoading && onClose()} 
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

        <div className="relative bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-xl">
          <Dialog.Title className="text-lg font-medium leading-6 text-gray-900">
            Enroll in Course
          </Dialog.Title>

          <div className="mt-4">
            {isCheckingProfile ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                <span className="ml-2 text-sm text-gray-600">Checking your profile...</span>
              </div>
            ) : showDirectEnrollment && hasExistingProfile ? (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Welcome back! Since you've enrolled in courses before, you can enroll directly.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <strong>Quick Enrollment:</strong> We'll use your existing profile information to enroll you directly. A confirmation email will be sent to you.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex space-x-3">
                  <button
                    type="button"
                    onClick={() => !isLoading && onClose()}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDirectEnrollment(false)}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isLoading}
                  >
                    Fill Form Instead
                  </button>
                  <button
                    type="button"
                    onClick={handleDirectEnrollment}
                    className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Enrolling...' : 'Enroll Now'}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-4">
                  Please fill in your details to enroll in {course.title}
                </p>
                <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-4 border rounded-lg p-4">
                  <h3 className="font-medium text-gray-900">Address Details</h3>
                  
                  <div>
                    <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700">
                      Address Line 1
                    </label>
                    <input
                      type="text"
                      id="addressLine1"
                      value={formData.addressLine1}
                      onChange={(e) => setFormData({ ...formData, addressLine1: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      id="addressLine2"
                      value={formData.addressLine2}
                      onChange={(e) => setFormData({ ...formData, addressLine2: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <select
                      id="country"
                      value={formData.country}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          country: e.target.value,
                          state: '', // Reset state when country changes
                          city: ''   // Reset city when country changes
                        });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading}
                    >
                      {countries.map(country => (
                        <option key={country.isoCode} value={country.name}>{country.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700">
                      State / Province / Region
                    </label>
                    <select
                      id="state"
                      value={formData.state}
                      onChange={(e) => {
                        setFormData({ 
                          ...formData, 
                          state: e.target.value,
                          city: '' // Reset city when state changes
                        });
                      }}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      required
                      disabled={isLoading}
                    >
                      <option value="">Select State</option>
                      {availableStates.map(state => (
                        <option key={state.isoCode} value={state.name}>{state.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    {hasCityDropdown ? (
                      <select
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                        disabled={isLoading || !formData.state}
                      >
                        <option value="">Select City</option>
                        {availableCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Enter city name"
                        required
                        disabled={isLoading || !formData.state}
                      />
                    )}
                  </div>

                  <div>
                    <label htmlFor="pincode" className="block text-sm font-medium text-gray-700">
                      {selectedCountryCode === 'IN' ? 'Pincode' : 'Postal / ZIP Code'}
                    </label>
                    <input
                      type="text"
                      id="pincode"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      pattern={selectedCountryCode === 'IN' ? '[0-9]{6}' : undefined}
                      maxLength={selectedCountryCode === 'IN' ? 6 : 20}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={selectedCountryCode === 'IN' ? '6-digit pincode' : 'Enter postal code'}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="highestQualification" className="block text-sm font-medium text-gray-700">
                    Highest Qualification
                  </label>
                  <select
                    id="highestQualification"
                    value={formData.highestQualification}
                    onChange={(e) => setFormData({ ...formData, highestQualification: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    disabled={isLoading}
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

                {(formData.highestQualification === 'bachelors' || formData.highestQualification === 'masters') && (
                  <div>
                    <label htmlFor="degreeName" className="block text-sm font-medium text-gray-700">
                      Degree Name
                    </label>
                    <input
                      type="text"
                      id="degreeName"
                      value={formData.degreeName}
                      onChange={(e) => setFormData({ ...formData, degreeName: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder={`Enter your ${formData.highestQualification === 'bachelors' ? "Bachelor's" : "Master's"} degree name`}
                      required
                      disabled={isLoading}
                    />
                  </div>
                )}

                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="hasLaptop"
                      type="checkbox"
                      checked={formData.hasLaptop}
                      onChange={(e) => setFormData({ ...formData, hasLaptop: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="hasLaptop" className="font-medium text-gray-700">
                      Do you have access to a laptop?
                    </label>
                    <p className="text-gray-500">This is required for completing course assignments and projects.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  type="button"
                  onClick={() => !isLoading && onClose()}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {isLoading ? 'Enrolling...' : 'Enroll Now'}
                </button>
              </div>
            </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default EnrollmentModal;