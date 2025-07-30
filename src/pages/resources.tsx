import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';
import BacklinkingHub from '@/components/seo/BacklinkingHub';

interface ResourceItem {
  title: string;
  description: string;
  url: string;
  category: string;
  readTime: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

const AIResourcesPage: NextPage = () => {
  const resources: ResourceItem[] = [
    {
      title: "AI & Machine Learning Fundamentals",
      description: "Complete guide to getting started with artificial intelligence and machine learning concepts.",
      url: "/courses/ai-machine-learning-fundamentals",
      category: "Course",
      readTime: "8 weeks",
      difficulty: "Beginner"
    },
    {
      title: "Complete AI Education Guide 2025",
      description: "Your roadmap to mastering AI and ML with career guidance and learning paths.",
      url: "/ai-education-guide",
      category: "Guide",
      readTime: "15 min",
      difficulty: "Beginner"
    },
    {
      title: "Data Science Professional Program",
      description: "Advanced data science training with real-world applications and projects.",
      url: "/courses?category=Data Science",
      category: "Course",
      readTime: "12 weeks",
      difficulty: "Intermediate"
    },
    {
      title: "AI Solutions for Business",
      description: "How to implement AI solutions in your business for competitive advantage.",
      url: "/services/ai-solutions",
      category: "Service",
      readTime: "10 min",
      difficulty: "Intermediate"
    },
    {
      title: "Machine Learning Career Paths",
      description: "Explore different career opportunities in machine learning and AI.",
      url: "/ai-education-guide#career-paths",
      category: "Career",
      readTime: "12 min",
      difficulty: "Beginner"
    },
    {
      title: "Deep Learning Specialization",
      description: "Advanced neural networks, CNNs, RNNs, and deep learning applications.",
      url: "/courses?level=Advanced",
      category: "Course",
      readTime: "16 weeks",
      difficulty: "Advanced"
    },
    {
      title: "AI Product Management",
      description: "Learn to manage AI products from ideation to successful market launch.",
      url: "/courses/AI product-management",
      category: "Course",
      readTime: "10 weeks",
      difficulty: "Intermediate"
    },
    {
      title: "Digital Transformation with AI",
      description: "Transform your business operations using artificial intelligence technologies.",
      url: "/services/digital-transformation",
      category: "Service",
      readTime: "8 min",
      difficulty: "Intermediate"
    },
    {
      title: "ITwala Academy Student Success",
      description: "Real stories from our students who built successful AI careers.",
      url: "/academy#testimonials",
      category: "Success Story",
      readTime: "5 min",
      difficulty: "Beginner"
    }
  ];

  const categories = ['All', 'Course', 'Guide', 'Service', 'Career', 'Success Story'];

  return (
    <>
      <Head>
        <title>AI Learning Resources - Free Guides & Courses | ITwala Academy</title>
        <meta name="description" content="Comprehensive AI learning resources, guides, and courses. Free educational content for artificial intelligence, machine learning, and data science." />
        <meta name="keywords" content="AI resources, machine learning guides, artificial intelligence tutorials, free AI courses, data science learning, AI education materials, ML resources, deep learning guides" />
        <meta property="og:title" content="AI Learning Resources - Free Guides & Courses | ITwala Academy" />
        <meta property="og:description" content="Access comprehensive AI learning resources, guides, and courses for mastering artificial intelligence and machine learning." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com/resources" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <link rel="canonical" href="https://academy.it-wala.com/resources" />
        
        {/* Schema for Resource Page */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "AI Learning Resources",
            "description": "Comprehensive collection of AI and machine learning educational resources",
            "url": "https://academy.it-wala.com/resources",
            "publisher": {
              "@type": "EducationalOrganization",
              "name": "ITwala Academy",
              "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png"
            },
            "mainEntity": {
              "@type": "ItemList",
              "name": "AI Learning Resources",
              "numberOfItems": resources.length,
              "itemListElement": resources.map((resource, index) => ({
                "@type": "LearningResource",
                "position": index + 1,
                "name": resource.title,
                "description": resource.description,
                "url": `https://academy.it-wala.com${resource.url}`,
                "educationalLevel": resource.difficulty,
                "learningResourceType": resource.category
              }))
            }
          })}
        </script>
      </Head>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-600 to-purple-700 py-20 text-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                AI Learning Resources Hub
              </h1>
              <p className="text-xl mb-8">
                Comprehensive collection of AI and machine learning resources to accelerate your learning journey. 
                From beginner guides to advanced courses and career guidance.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <span className="bg-white/20 px-4 py-2 rounded-full">Free Guides</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">Expert Courses</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">Career Support</span>
                <span className="bg-white/20 px-4 py-2 rounded-full">Industry Insights</span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link href={resource.url} className="group block h-full">
                    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full border border-gray-100 hover:border-primary-200">
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-100 rounded-full">
                          {resource.category}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          resource.difficulty === 'Beginner' ? 'bg-green-100 text-green-700' :
                          resource.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {resource.difficulty}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                        {resource.title}
                      </h3>
                      
                      <p className="text-gray-600 mb-4 flex-grow">
                        {resource.description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>{resource.readTime}</span>
                        <div className="flex items-center text-primary-600 font-medium group-hover:text-primary-700">
                          Access Resource
                          <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Learning Paths Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Structured Learning Paths
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Follow our curated learning paths designed by industry experts to master AI and ML systematically.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600">1</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <Link href="/ai-education-guide" className="hover:text-primary-600 transition-colors">
                    Foundation Path
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Start with AI fundamentals, mathematics, and Python programming basics.
                </p>
                <Link href="/courses/ai-machine-learning-fundamentals" className="text-primary-600 font-medium hover:text-primary-700">
                  Begin Learning →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <Link href="/courses?level=Intermediate" className="hover:text-primary-600 transition-colors">
                    Specialization Path
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Choose your specialization: ML, Deep Learning, NLP, or Computer Vision.
                </p>
                <Link href="/courses" className="text-primary-600 font-medium hover:text-primary-700">
                  Explore Courses →
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-purple-600">3</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  <Link href="/services/ai-solutions" className="hover:text-primary-600 transition-colors">
                    Professional Path
                  </Link>
                </h3>
                <p className="text-gray-600 mb-4">
                  Apply skills in real projects, build portfolio, and advance your career.
                </p>
                <Link href="/academy#career-support" className="text-primary-600 font-medium hover:text-primary-700">
                  Get Career Support →
                </Link>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Internal Linking Hub */}
        <BacklinkingHub currentPage="resources" />
      </main>
    </>
  );
};

export default AIResourcesPage;
