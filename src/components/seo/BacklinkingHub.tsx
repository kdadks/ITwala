import Link from 'next/link';
import { motion } from 'framer-motion';

interface RelatedLink {
  title: string;
  url: string;
  description: string;
  category?: string;
}

interface BacklinkingHubProps {
  currentPage: string;
  currentCategory?: string;
}

const BacklinkingHub: React.FC<BacklinkingHubProps> = ({ currentPage, currentCategory }) => {
  // Define internal linking strategy based on page type
  const getRelatedLinks = (): RelatedLink[] => {
    const baseLinks: RelatedLink[] = [
      {
        title: "AI Education Guide 2025",
        url: "/ai-education-guide",
        description: "Complete roadmap for AI learning",
        category: "Guide"
      },
      {
        title: "AI & ML Courses",
        url: "/courses",
        description: "Comprehensive AI training programs",
        category: "Courses"
      },
      {
        title: "ITwala Academy",
        url: "/academy",
        description: "Premier AI education platform",
        category: "About"
      }
    ];

    // Add contextual links based on current page
    if (currentPage === 'course') {
      return [
        ...baseLinks,
        {
          title: "All AI Courses",
          url: "/courses?category=Artificial Intelligence",
          description: "Explore all AI courses",
          category: "Related"
        },
        {
          title: "ML Fundamentals",
          url: "/courses/ai-machine-learning-fundamentals",
          description: "Start with ML basics",
          category: "Beginner"
        },
        {
          title: "Data Science Training",
          url: "/courses?category=Data Science",
          description: "Master data science skills",
          category: "Advanced"
        },
        {
          title: "AI Consulting Services",
          url: "/services/ai-solutions",
          description: "Professional AI implementation",
          category: "Services"
        }
      ];
    }

    if (currentPage === 'services') {
      return [
        ...baseLinks,
        {
          title: "AI Solutions",
          url: "/services/ai-solutions",
          description: "Custom AI development",
          category: "AI"
        },
        {
          title: "Digital Transformation",
          url: "/services/digital-transformation",
          description: "Complete business digitization",
          category: "Strategy"
        },
        {
          title: "Technical Consulting",
          url: "/services/technical-consulting",
          description: "Expert technical guidance",
          category: "Consulting"
        },
        {
          title: "Product Development",
          url: "/services/product-development",
          description: "End-to-end product creation",
          category: "Development"
        }
      ];
    }

    if (currentPage === 'academy') {
      return [
        ...baseLinks,
        {
          title: "AI Career Roadmap",
          url: "/ai-education-guide#career-paths",
          description: "Plan your AI career journey",
          category: "Career"
        },
        {
          title: "Free AI Resources",
          url: "/academy#resources",
          description: "Free learning materials",
          category: "Resources"
        },
        {
          title: "Student Success Stories",
          url: "/academy#testimonials",
          description: "Real student achievements",
          category: "Success"
        },
        {
          title: "Certification Programs",
          url: "/courses?level=certification",
          description: "Industry-recognized certifications",
          category: "Certification"
        }
      ];
    }

    return baseLinks;
  };

  const relatedLinks = getRelatedLinks();

  return (
    <section className="py-12 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
            Explore Related Resources
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover more AI education resources, courses, and expert guidance to accelerate your learning journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedLinks.map((link, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link href={link.url} className="group block">
                <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full border border-gray-100 hover:border-primary-200">
                  {link.category && (
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-600 bg-primary-100 rounded-full mb-3">
                      {link.category}
                    </span>
                  )}
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {link.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {link.description}
                  </p>
                  <div className="mt-4 flex items-center text-primary-600 text-sm font-medium group-hover:text-primary-700">
                    Learn More
                    <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Featured External Resources for Backlinking */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-white rounded-xl shadow-lg p-8"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">
            Industry Resources & Partners
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Industry Certification</h4>
              <p className="text-sm text-gray-600">Recognized AI credentials</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 4l-4-4-4 4v5c0 3.88 2.69 7.64 7 8.93 4.31-1.29 7-5.05 7-8.93V4z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Expert Mentorship</h4>
              <p className="text-sm text-gray-600">1-on-1 industry guidance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Career Support</h4>
              <p className="text-sm text-gray-600">Job placement assistance</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-8 h-8 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Learning Community</h4>
              <p className="text-sm text-gray-600">Active student network</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default BacklinkingHub;
