import type { NextPage, GetStaticProps, GetStaticPaths } from 'next';
import type { Course, Module } from '../../types/course';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { allCourses as courseData } from '@/data/allCourses';
import CourseBanner from '../../components/courses/CourseBanner';
import CourseContent from '../../components/courses/CourseContent';
import CourseReviews from '../../components/courses/CourseReviews';
import CourseFAQ from '../../components/courses/CourseFAQ';
import RelatedCourses from '../../components/courses/RelatedCourses';
import { useState, useEffect } from 'react';
import EnrollmentModal from '../../components/courses/EnrollmentModal';
import LoadingState from '../../components/common/LoadingState';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { getSiteSettings } from '@/utils/siteSettings';
import { toast } from 'react-hot-toast';

interface CoursePageProps {
  course: Course;
  relatedCourses: Course[];
}

const CoursePage: NextPage<CoursePageProps> = ({ course, relatedCourses }) => {
  const router = useRouter();
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

  if (router.isFallback || isCheckingSettings) {
    return <LoadingState />;
  }

  if (!course) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-bold text-center">Course not found</h1>
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
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${course.title} - ITwala Academy`} />
          <meta name="twitter:description" content={course.description} />
          <meta name="twitter:image" content={course.image} />
        </Head>

        <main>
          <CourseBanner 
            course={course} 
            onEnroll={handleEnrollClick}
            enrollmentsEnabled={enrollmentsEnabled}
          />
          
          <section className="py-12 bg-white">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Course</h2>
                      <p className="text-gray-700 mb-6">{course.description}</p>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">What You'll Learn</h3>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                        {course.learningOutcomes.map((outcome: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary-500 mr-2">✓</span>
                            <span className="text-gray-700">{outcome}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">Requirements</h3>
                      <ul className="list-disc pl-5 mb-6">
                        {course.requirements.map((req: string, index: number) => (
                          <li key={index} className="text-gray-700 mb-2">{req}</li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                  
                  <CourseContent modules={course.modules} />
                  <CourseReviews reviews={course.reviews} />
                  <CourseFAQ faqs={course.faqs} />
                </div>
                
                <div className="lg:col-span-1">
                  <div className="sticky top-24">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
                    >
                      <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-3xl font-bold text-gray-900">₹{course.price.toLocaleString()}</span>
                          {course.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">₹{course.originalPrice.toLocaleString()}</span>
                          )}
                        </div>
                        
                        <button 
                          onClick={handleEnrollClick}
                          className={`w-full py-3 px-6 font-semibold rounded-md transition duration-200 mb-4 ${
                            enrollmentsEnabled 
                              ? 'bg-primary-500 hover:bg-primary-600 text-white' 
                              : 'bg-gray-300 cursor-not-allowed text-gray-600'
                          }`}
                        >
                          {enrollmentsEnabled ? 'Enroll Now' : 'Enrollment Disabled'}
                        </button>
                        
                        <div className="text-center text-gray-500 text-sm mb-6">Tuition fee will be discussed post registration</div>
                        
                        <div className="border-t border-gray-200 pt-4">
                          <ul>
                            <li className="flex items-center text-gray-700">
                              <svg className="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Full lifetime access
                            </li>
                            <li className="flex items-center text-gray-700">
                              <svg className="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              Certificate of completion
                            </li>
                            <li className="flex items-center text-gray-700">
                              <svg className="w-5 h-5 mr-2 text-primary-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              24/7 support
                            </li>
                          </ul>
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="bg-white rounded-lg shadow-md p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">Share This Course</h3>
                      <div className="flex space-x-4 mb-4">
                        <a
                          href={getFacebookShareUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Facebook"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </a>
                        <a
                          href={getTwitterShareUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on Twitter"
                          className="text-blue-400 hover:text-blue-600"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.128 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </a>
                        <a
                          href={getLinkedInShareUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on LinkedIn"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                          </svg>
                        </a>
                        <a
                          href={getWhatsAppShareUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Share on WhatsApp"
                          className="text-green-500 hover:text-green-700"
                        >
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.946C.16 5.335 5.495 0 12.05 0c3.197.016 6.202 1.245 8.457 3.5 2.254 2.254 3.48 5.259 3.476 8.45-.013 6.554-5.35 11.892-11.9 11.892-1.984-.001-3.934-.5-5.661-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.896-9.884.002-2.641-1.025-5.122-2.889-6.991-1.865-1.869-4.35-2.9-6.989-2.902-5.448 0-9.878 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.1-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.496.1-.198.05-.372-.025-.522-.074-.148-.668-1.614-.916-2.205-.241-.579-.486-.5-.668-.51-.173-.01-.371-.012-.57-.012-.198 0-.52.074-.792.372-.273.297-1.04 1.016-1.04 2.48 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.747.325 1.332.518 1.812.605.524.127 1 .109 1.377.068.42-.063 1.291-.52 1.478-1.03.185-.507.185-.942.136-1.034-.047-.092-.173-.147-.371-.247z" />
                          </svg>
                        </a>
                        <button
                          onClick={handleCopyLink}
                          className="ml-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition text-sm border border-gray-200"
                          aria-label="Copy course link"
                          type="button"
                        >
                          {copied ? 'Copied!' : 'Copy Link'}
                        </button>
                      </div>
                      <div className="text-xs text-gray-400">
                        Shareable link: <span className="break-all">{shareUrl}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          <RelatedCourses courses={relatedCourses} />
          
          {enrollmentsEnabled && (
            <EnrollmentModal 
              isOpen={isEnrollmentModalOpen} 
              onClose={() => setIsEnrollmentModalOpen(false)} 
              course={course} 
            />
          )}
        </main>
      </>
    </ErrorBoundary>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Using allCourses instead of courseData to include new courses
  const paths = courseData.map((course) => ({
    params: { slug: course.slug },
  }));

  return {
    paths,
    fallback: true, // Enable ISR for new courses
  };
};

export const getStaticProps: GetStaticProps<CoursePageProps> = async ({ params }) => {
  try {
    const slug = params?.slug as string;
    const course = courseData.find((course) => course.slug === slug);
    
    if (!course) {
      return {
        notFound: true,
      };
    }

    const relatedCourses = courseData
      .filter((c) => c.category === course.category && c.id !== course.id)
      .slice(0, 3);

    return {
      props: {
        course,
        relatedCourses,
      },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.error('Error in getStaticProps:', error);
    return {
      notFound: true,
    };
  }
};

export default CoursePage;