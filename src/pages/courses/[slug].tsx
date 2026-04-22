import type { NextPage } from 'next';
import type { Course } from '../../types/course';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import CourseBanner from '../../components/courses/CourseBanner';
import CourseContent from '../../components/courses/CourseContent';
import CourseReviews from '../../components/courses/CourseReviews';
import CourseFAQ from '../../components/courses/CourseFAQ';
import RelatedCourses from '../../components/courses/RelatedCourses';
import EnrollmentModal from '../../components/courses/EnrollmentModal';
import LoadingState from '../../components/common/LoadingState';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { getSiteSettings } from '@/utils/siteSettings';
import { toast } from 'react-hot-toast';
import { detectCountryFromIP, setCountryInCookie, getCountryInfo } from '@/utils/countryDetection';
import { formatCurrency } from '@/utils/currency';

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  const user = useUser();

  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [enrollmentsEnabled, setEnrollmentsEnabled] = useState(true);
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [modules, setModules] = useState<any[] | null>(null);
  const [faqs, setFaqs] = useState<any[] | null>(null);
  const [reviews, setReviews] = useState<any[] | null>(null);
  const [modulesLoading, setModulesLoading] = useState(false);
  const [faqsLoading, setFaqsLoading] = useState(false);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [userCountry, setUserCountry] = useState<string>('IN');
  const [pricing, setPricing] = useState<{
    price: number;
    originalPrice?: number;
    currency: string;
    symbol: string;
  } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setShareUrl(window.location.href);
    }
  }, []);

  useEffect(() => {
    const checkEnrollmentSettings = async () => {
      try {
        const settings = await getSiteSettings();
        setEnrollmentsEnabled(settings.enrollmentsEnabled);
      } catch (error) {
        console.error('Error fetching site settings:', error);
        setEnrollmentsEnabled(true);
      } finally {
        setIsCheckingSettings(false);
      }
    };
    checkEnrollmentSettings();
  }, []);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the specific course
        const courseResponse = await fetch(`/api/courses/${slug}`);
        if (!courseResponse.ok) {
          if (courseResponse.status === 404) {
            setError('Course not found');
          } else {
            throw new Error('Failed to load course');
          }
          return;
        }

        const courseData = await courseResponse.json();
        setCourse(courseData.course);

        // Fetch related courses (same category, excluding current course)
        if (courseData.course) {
          const relatedResponse = await fetch(`/api/courses?category=${courseData.course.category}&limit=3`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const filtered = relatedData.courses.filter((c: Course) => c.id !== courseData.course.id).slice(0, 3);
            setRelatedCourses(filtered);
          }
        }
      } catch (err) {
        console.error('Error fetching course:', err);
        setError(err instanceof Error ? err.message : 'Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  useEffect(() => {
    // Always re-detect country from IP on mount to avoid stale cookies
    // (e.g. a user who previously visited from a different country/VPN).
    const initializeCountry = async () => {
      const detected = await detectCountryFromIP();
      setCountryInCookie(detected);
      setUserCountry(detected);
    };

    initializeCountry();
  }, []);

  useEffect(() => {
    if (!course) return;

    // Fetch country-specific pricing
    const fetchPricing = async () => {
      try {
        const response = await fetch(`/api/pricing/course?courseId=${course.id}&country=${userCountry}`);
        if (response.ok) {
          const data = await response.json();
          setPricing(data.pricing);
        } else {
          // Fallback to default course pricing
          setPricing({
            price: course.price,
            originalPrice: course.originalPrice,
            currency: 'INR',
            symbol: '₹'
          });
        }
      } catch (error) {
        console.error('Error fetching pricing:', error);
        // Fallback to default course pricing
        setPricing({
          price: course.price,
          originalPrice: course.originalPrice,
          currency: 'INR',
          symbol: '₹'
        });
      }
    };

    fetchPricing();

    // Lazy load modules, faqs, reviews in parallel
    setModulesLoading(true); setFaqsLoading(true); setReviewsLoading(true);
    fetch(`/api/courses/${course.slug}/modules`).then(r => r.json()).then(d => setModules(d.modules || [])).finally(() => setModulesLoading(false));
    fetch(`/api/courses/${course.slug}/faqs`).then(r => r.json()).then(d => setFaqs(d.faqs || [])).finally(() => setFaqsLoading(false));
    fetch(`/api/courses/${course.slug}/reviews`).then(r => r.json()).then(d => setReviews(d.reviews || [])).finally(() => setReviewsLoading(false));
  }, [course, userCountry]);

  const getFacebookShareUrl = () =>
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const getTwitterShareUrl = () =>
    `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(course?.title ?? '')}`;
  const getLinkedInShareUrl = () =>
    `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(course?.title ?? '')}&summary=${encodeURIComponent(course?.description ?? '')}`;
  const getWhatsAppShareUrl = () =>
    `https://wa.me/?text=${encodeURIComponent(course?.title + ' - ' + shareUrl)}`;

  const handleCopyLink = async () => {
    if (typeof window !== 'undefined' && shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleEnrollClick = () => {
    if (!enrollmentsEnabled) {
      toast.error('Enrollment is currently disabled. Please try again later.');
      return;
    }

    // Check if user is logged in
    if (!user) {
      // Store enrollment intent in localStorage
      if (course) {
        localStorage.setItem('enrollmentIntent', JSON.stringify({
          courseId: course.id,
          courseTitle: course.title,
          redirectPath: `/courses/${slug}`
        }));
      }

      toast.error('Please log in or sign up to enroll in this course');
      router.push('/auth?redirect=enrollment');
      return;
    }

    // User is logged in, open enrollment modal
    setIsEnrollmentModalOpen(true);
  };

  if (loading || isCheckingSettings) {
    return <LoadingState />;
  }

  if (error || !course) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {error === 'Course not found' ? 'Course Not Found' : 'Error Loading Course'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Course not found' 
              ? 'The course you are looking for does not exist or has been removed.'
              : error || 'Something went wrong while loading the course.'
            }
          </p>
          <button
            onClick={() => router.push('/courses')}
            className="bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <>
        <Head>
          <title>{course.title} - AI & Machine Learning Course | ITwala Academy</title>
          <meta name="description" content={`${course.description} Join ITwala Academy's comprehensive ${course.title} course. Expert-led AI training with hands-on projects, industry certification, and career support.`} />
          <meta name="keywords" content={`${course.title}, AI course, machine learning training, ${course.category.toLowerCase()}, artificial intelligence education, data science course, deep learning, neural networks, AI certification, online AI training`} />
          <meta property="og:title" content={`${course.title} - AI & ML Course | ITwala Academy`} />
          <meta property="og:description" content={`Master ${course.title} with expert instructors. Comprehensive AI and machine learning training with hands-on projects and industry certification.`} />
          <meta property="og:type" content="article" />
          <meta property="og:image" content={course.image} />
          <meta property="og:url" content={shareUrl} />
          <meta property="article:section" content="AI Education" />
          <meta property="article:tag" content="Artificial Intelligence" />
          <meta property="article:tag" content="Machine Learning" />
          <meta property="article:tag" content="Data Science" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${course.title} - AI Course | ITwala Academy`} />
          <meta name="twitter:description" content={`Master ${course.title} with comprehensive AI training, hands-on projects, and expert guidance.`} />
          <meta name="twitter:image" content={course.image} />
          <link rel="canonical" href={shareUrl} />
          
          {/* Enhanced Course Schema */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Course",
              "name": course.title,
              "description": course.description,
              "provider": {
                "@type": "EducationalOrganization",
                "name": "ITwala Academy",
                "url": "https://academy.it-wala.com",
                "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png"
              },
              "image": course.image,
              "url": shareUrl,
              "courseCode": course.slug,
              "educationalLevel": course.level,
              "timeRequired": course.duration,
              "courseMode": "online",
              "inLanguage": "en",
              "about": [
                "Artificial Intelligence",
                "Machine Learning",
                "Data Science",
                course.category
              ],
              "teaches": course.learningOutcomes,
              "coursePrerequisites": course.requirements,
              "offers": {
                "@type": "Offer",
                "category": "AI Education",
                "price": pricing ? (pricing.price / 100) : course.price,
                "priceCurrency": pricing ? pricing.currency : "INR",
                "availability": "InStock",
                "validFrom": course.publishedDate || new Date().toISOString(),
                "description": `Registration fee for ${course.title} course`
              },
              "aggregateRating": course.rating && course.ratingCount ? {
                "@type": "AggregateRating",
                "ratingValue": course.rating,
                "ratingCount": course.ratingCount,
                "bestRating": 5
              } : undefined,
              "hasCourseInstance": {
                "@type": "CourseInstance",
                "courseMode": "online",
                "instructor": {
                  "@type": "Person",
                  "name": "ITwala Academy Expert Instructors",
                  "description": "Industry professionals with extensive AI and ML experience"
                }
              }
            })}
          </script>
        </Head>

        <main>
          {/* Course Banner */}
          <section className="relative overflow-hidden bg-white">
            <div className="absolute inset-0 mesh-gradient opacity-50 pointer-events-none" />
            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent hidden lg:block" />
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-5 lg:pt-16 lg:pb-6">
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
                {/* Left: course info */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55 }}
                  className="max-w-2xl"
                >
                  <div className="flex items-center gap-3 mb-7">
                    <div className="h-px w-10 bg-primary-500 shrink-0" />
                    <span className="text-[11px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                      ITwala Academy · {course.level}
                    </span>
                  </div>
                  <h1 className="font-serif text-[2.2rem] sm:text-[2.8rem] lg:text-[3.2rem] leading-[1.08] text-gray-900 mb-5">
                    {course.title}
                  </h1>
                  <div className="flex items-start gap-3 mb-5">
                    <div className="w-[3px] min-h-[2.25rem] bg-accent-500 rounded-full shrink-0 mt-1" />
                    <p className="text-[1.05rem] text-gray-600 leading-relaxed">{course.description}</p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    {course.rating ? <span>⭐ {course.rating}/5</span> : null}
                    {course.duration ? <span>📅 {course.duration}</span> : null}
                  </div>
                </motion.div>

                {/* Right: pricing + enroll */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: 0.1 }}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 min-w-[220px] lg:mt-16"
                >
                  <p className="text-[10px] uppercase tracking-[0.15em] text-gray-400 mb-1">Registration Fee</p>
                  {course.feesDiscussedPostEnrollment ? (
                    <p className="text-sm font-semibold text-accent-500 mb-4">Discussed post enrollment</p>
                  ) : (
                    <div className="mb-4">
                      <span className="text-[2rem] font-bold text-gray-900 leading-none">
                        {pricing ? (
                          <>{pricing.symbol}{(pricing.price / 100).toLocaleString()}</>
                        ) : (
                          formatCurrency(course.price, { decimals: 0 })
                        )}
                      </span>
                      {(pricing?.originalPrice || course.originalPrice) && (
                        <span className="text-sm text-gray-400 line-through ml-2">
                          {pricing?.originalPrice
                            ? `${pricing.symbol}${(pricing.originalPrice / 100).toLocaleString()}`
                            : formatCurrency(course.originalPrice!, { decimals: 0 })}
                        </span>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleEnrollClick}
                    disabled={!enrollmentsEnabled}
                    className={`w-full h-11 rounded-lg font-semibold text-sm transition-all duration-200 ${
                      enrollmentsEnabled
                        ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {enrollmentsEnabled ? 'Enroll Now' : 'Enrollment Disabled'}
                  </button>
                </motion.div>
              </div>
            </div>
          </section>
          
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Course Content */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-2xl font-bold mb-4">Course Content</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{"What You'll Learn"}</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={`outcome-${index}`} className="text-gray-700">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.requirements.map((requirement, index) => (
                          <li key={`requirement-${index}`} className="text-gray-700">{requirement}</li>
                        ))}
                      </ul>
                    </div>
                    {modulesLoading ? (
                      <div className="h-24 bg-gray-100 animate-pulse rounded mb-4" />
                    ) : modules && modules.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Course Modules</h3>
                        <div className="space-y-2">
                          {modules.map((module, index) => (
                            <div key={module.id || `module-${index}`} className="border rounded-lg p-4">
                              <h4 className="font-medium">{index + 1}. {module.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                {module.lessons?.length || 0} lessons
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                {/* FAQ Section */}
                {faqsLoading ? (
                  <div className="h-24 bg-gray-100 animate-pulse rounded mb-4" />
                ) : faqs && faqs.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {faqs.map((faq, index) => (
                        <div key={faq.id || `faq-${index}`} className="border-b pb-4">
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-gray-700">{faq.answer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Reviews Section */}
                {reviewsLoading ? (
                  <div className="h-24 bg-gray-100 animate-pulse rounded mb-4" />
                ) : reviews && reviews.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
                    <div className="space-y-4">
                      {reviews.map((review, index) => (
                        <div key={review.id || `review-${index}`} className="border-b pb-4">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-gray-900 mr-2">{review.user}</span>
                            <span className="text-yellow-500">{'★'.repeat(review.rating)}</span>
                            <span className="ml-2 text-xs text-gray-500">{review.date}</span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-8">
                <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                  <div className="text-center mb-6">
                    <div className="text-sm text-gray-600 mb-2">Registration Fee</div>
                    <div className="text-3xl font-bold text-primary-600 mb-3">
                      {pricing ? (
                        <>
                          {pricing.symbol}{(pricing.price / 100).toLocaleString()}
                          {pricing.originalPrice && (
                            <span className="text-lg text-gray-500 line-through ml-2">
                              {pricing.symbol}{(pricing.originalPrice / 100).toLocaleString()}
                            </span>
                          )}
                        </>
                      ) : (
                        <>
                          {formatCurrency(course.price, { decimals: 0 })}
                          {course.originalPrice && (
                            <span className="text-lg text-gray-500 line-through ml-2">
                              {formatCurrency(course.originalPrice, { decimals: 0 })}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                    {course.feesDiscussedPostEnrollment && (
                      <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200 mb-2">
                        Tuition fees will be discussed post enrollment
                      </div>
                    )}
                    {pricing && pricing.originalPrice && (
                      <div className="text-sm text-green-600 font-medium">
                        Save {pricing.symbol}{((pricing.originalPrice - pricing.price) / 100).toLocaleString()}
                      </div>
                    )}
                    {!pricing && course.originalPrice && (
                      <div className="text-sm text-green-600 font-medium">
                        Save ₹{(course.originalPrice - course.price).toLocaleString()}
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={handleEnrollClick}
                    disabled={!enrollmentsEnabled}
                    className={`w-full py-3 px-6 rounded-md font-semibold transition-colors ${
                      enrollmentsEnabled
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {enrollmentsEnabled ? 'Enroll Now' : 'Enrollment Disabled'}
                  </button>
                  
                  <div className="mt-6 space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Duration:</span>
                      <span className="font-medium">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Language:</span>
                      <span className="font-medium">{course.language || 'English'}</span>
                    </div>
                    {course.certificationIncluded && (
                      <div className="flex justify-between">
                        <span>Certificate:</span>
                        <span className="font-medium text-green-600">Included</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {relatedCourses.length > 0 && (
            <section className="bg-gray-50 py-12">
              <div className="container mx-auto px-4">
                <h2 className="text-2xl font-bold text-center mb-8">Related Courses</h2>
                <RelatedCourses courses={relatedCourses} userCountry={userCountry} />
              </div>
            </section>
          )}
        </main>

        <EnrollmentModal
          isOpen={isEnrollmentModalOpen}
          onClose={() => setIsEnrollmentModalOpen(false)}
          course={course}
        />
      </>
    </ErrorBoundary>
  );
};

export default CoursePage;