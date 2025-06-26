import type { NextPage } from 'next';
import type { Course } from '../../types/course';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
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

const CoursePage: NextPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrollmentModalOpen, setIsEnrollmentModalOpen] = useState(false);
  const [enrollmentsEnabled, setEnrollmentsEnabled] = useState(true);
  const [isCheckingSettings, setIsCheckingSettings] = useState(true);
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

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
    if (enrollmentsEnabled) {
      setIsEnrollmentModalOpen(true);
    } else {
      toast.error('Enrollment is currently disabled. Please try again later.');
    }
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
          <title>{course.title} - ITwala Academy</title>
          <meta name="description" content={course.description} />
          <meta property="og:title" content={`${course.title} - ITwala Academy`} />
          <meta property="og:description" content={course.description} />
          <meta property="og:type" content="website" />
          <meta property="og:image" content={course.image} />
          <meta property="og:url" content={shareUrl} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${course.title} - ITwala Academy`} />
          <meta name="twitter:description" content={course.description} />
          <meta name="twitter:image" content={course.image} />
        </Head>

        <main>
          {/* Course Banner */}
          <section className="bg-gradient-to-r from-primary-600 to-primary-800 py-16">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>
                  <p className="text-xl text-primary-100 mb-6">{course.description}</p>
                  <div className="flex items-center space-x-4 text-primary-100">
                    <span>⭐ {course.rating || 0}/5</span>
                    <span>📅 {course.duration}</span>
                  </div>
                </div>
                <div className="text-center lg:text-right">
                  <div className="mb-4">
                    <div className="text-sm text-primary-200 mb-1">Registration Fee</div>
                    <div className="text-4xl font-bold text-white mb-2">
                      ₹{course.price.toLocaleString()}
                      {course.originalPrice && (
                        <span className="text-xl text-primary-200 line-through ml-2">
                          ₹{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {course.feesDiscussedPostEnrollment && (
                      <div className="text-sm text-yellow-300 bg-yellow-900/20 px-3 py-2 rounded-lg border border-yellow-400/30">
                        Tuition fees will be discussed post enrollment
                      </div>
                    )}
                  </div>
                  <button
                    onClick={handleEnrollClick}
                    disabled={!enrollmentsEnabled}
                    className={`px-8 py-3 rounded-md font-semibold transition-colors ${
                      enrollmentsEnabled
                        ? 'bg-white text-primary-600 hover:bg-gray-100'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {enrollmentsEnabled ? 'Enroll Now' : 'Enrollment Disabled'}
                  </button>
                </div>
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
                      <h3 className="text-lg font-semibold mb-2">What You'll Learn</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.learningOutcomes.map((outcome, index) => (
                          <li key={index} className="text-gray-700">{outcome}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Requirements</h3>
                      <ul className="list-disc list-inside space-y-1">
                        {course.requirements.map((requirement, index) => (
                          <li key={index} className="text-gray-700">{requirement}</li>
                        ))}
                      </ul>
                    </div>
                    {course.modules && course.modules.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Course Modules</h3>
                        <div className="space-y-2">
                          {course.modules.map((module, index) => (
                            <div key={module.id} className="border rounded-lg p-4">
                              <h4 className="font-medium">{index + 1}. {module.title}</h4>
                              <p className="text-gray-600 text-sm mt-1">{module.description}</p>
                              <p className="text-sm text-gray-500 mt-2">
                                {module.lessons.length} lessons
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* FAQ Section */}
                {course.faqs && course.faqs.length > 0 && (
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                      {course.faqs.map((faq, index) => (
                        <div key={index} className="border-b pb-4">
                          <h3 className="font-semibold mb-2">{faq.question}</h3>
                          <p className="text-gray-700">{faq.answer}</p>
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
                      ₹{course.price.toLocaleString()}
                      {course.originalPrice && (
                        <span className="text-lg text-gray-500 line-through ml-2">
                          ₹{course.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    {course.feesDiscussedPostEnrollment && (
                      <div className="text-sm text-yellow-600 bg-yellow-50 px-3 py-2 rounded-lg border border-yellow-200 mb-2">
                        Tuition fees will be discussed post enrollment
                      </div>
                    )}
                    {course.originalPrice && (
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
                <RelatedCourses courses={relatedCourses} />
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