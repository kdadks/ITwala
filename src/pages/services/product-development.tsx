import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCode, FaArrowLeft, FaCheckCircle, FaExternalLinkAlt, FaRocket } from 'react-icons/fa';

const ProductDevelopment: NextPage = () => {
  return (
    <>
      <Head>
        <title>Custom Product Development Services | Web & Mobile App Development - ITWala</title>
        <meta name="description" content="Top product development company offering custom software, web & mobile app development, MVP development, SaaS solutions. Expert full-stack developers, agile methodology, 50+ successful products launched globally." />
        <meta name="keywords" content="product development company, custom software development, web application development, mobile app development, MVP development, SaaS development, full stack development, agile development, React development, Node.js development, API development, microservices, e-commerce development, enterprise software, UI UX design, quality assurance, product strategy, scalable solutions" />
        <link rel="canonical" href="https://academy.it-wala.com/services/product-development" />

        {/* Open Graph */}
        <meta property="og:title" content="Custom Product Development Services - Web & Mobile Apps | ITWala" />
        <meta property="og:description" content="Leading product development services: Custom software, web & mobile apps, MVP development, SaaS solutions. 50+ successful products, 95% client satisfaction, agile methodology." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com/services/product-development" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Product Development Services - Custom Software & Apps" />
        <meta name="twitter:description" content="Expert product development: Web apps, mobile apps, MVPs, SaaS. Full-stack team, agile process, 50+ successful launches." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />

        {/* Schema.org for Product Development Service */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "serviceType": "Product Development Services",
            "name": "Custom Product Development",
            "description": "End-to-end product development services including web applications, mobile apps, MVP development, and SaaS solutions",
            "provider": {
              "@type": "Organization",
              "name": "ITWala",
              "url": "https://academy.it-wala.com",
              "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "150"
              }
            },
            "areaServed": "Global",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Product Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "MVP Development",
                    "description": "Rapid prototyping and minimum viable product development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Full-Stack Development",
                    "description": "Complete web and mobile application development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SaaS Development",
                    "description": "Scalable software as a service solutions"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile App Development",
                    "description": "iOS and Android mobile application development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "API Development",
                    "description": "RESTful API and microservices architecture"
                  }
                }
              ]
            },
            "offers": {
              "@type": "Offer",
              "availability": "https://schema.org/InStock",
              "priceCurrency": "USD"
            }
          })}
        </script>

        {/* BreadcrumbList Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://academy.it-wala.com"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Services",
                "item": "https://academy.it-wala.com/services"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Product Development",
                "item": "https://academy.it-wala.com/services/product-development"
              }
            ]
          })}
        </script>
      </Head>

      <main className="pt-8">
        {/* Compact Hero Section with Integrated Products */}
        <section className="py-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 relative overflow-hidden">
          {/* Gradient overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-white/20 via-transparent to-indigo-50/30 pointer-events-none"></div>
          {/* Background Pattern with subtle animation */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-600 rounded-full blur-xl animate-pulse" style={{ animationDuration: '4s' }}></div>
            <div className="absolute top-32 right-20 w-32 h-32 bg-purple-600 rounded-full blur-xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }}></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500 rounded-full blur-xl animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          </div>

          <div className="container mx-auto px-4 relative">
            {/* Compact Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-6xl mx-auto text-center mb-4"
            >
              <div className="flex justify-center mb-3">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ duration: 0.6, delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-12 h-12 rounded-xl flex items-center justify-center shadow-lg">
                    <FaCode className="w-6 h-6" />
                  </div>
                </motion.div>
              </div>
              
              <motion.h1 
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Product Strategy & Development
              </motion.h1>
              
              <motion.p 
                className="text-base md:text-lg text-gray-600 mb-4 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                End-to-end product strategy & development services from concept to launch, building scalable and user-centric solutions.
              </motion.p>              <div className="flex flex-col sm:flex-row justify-center gap-3 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Link href="/contact">
                    <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center">
                      <FaRocket className="mr-2" />
                      Start Your Project
                    </button>
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                >
                  <Link href="/consulting">
                    <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-2 px-5 rounded-full transition-all duration-300 flex items-center">
                      <FaArrowLeft className="w-4 h-4 mr-2" />
                      Back to Services
                    </button>
                  </Link>
                </motion.div>
              </div>

              {/* Compact Stats */}
              <motion.div 
                className="flex justify-center space-x-8 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
              >
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xl font-bold text-indigo-600">50+</div>
                  <div className="text-xs text-gray-600">Products</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xl font-bold text-purple-600">95%</div>
                  <div className="text-xs text-gray-600">Satisfaction</div>
                </motion.div>
                <motion.div 
                  className="text-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="text-xl font-bold text-indigo-600">24/7</div>
                  <div className="text-xs text-gray-600">Support</div>
                </motion.div>
              </motion.div>
            </motion.div>

            <motion.div
              className="text-center mt-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <Link href="/portfolio">
                <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg">
                  Product Portfolio
                </button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div 
                className="text-center mb-12"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">What We Offer</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Our product development services cover the entire lifecycle from ideation to deployment. We build robust, scalable, and user-friendly products that drive business growth and customer satisfaction.
                </p>
              </motion.div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="space-y-6">
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">MVP Development</h3>
                        <p className="text-gray-600">Rapid prototyping and minimum viable product development to validate your ideas quickly.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Full-Stack Development</h3>
                        <p className="text-gray-600">Complete web and mobile application development using modern technologies and frameworks.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">UI/UX Design</h3>
                        <p className="text-gray-600">User-centered design and intuitive interfaces that enhance user experience and engagement.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">API Development</h3>
                        <p className="text-gray-600">Robust and scalable API development for seamless integration and data exchange.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <FaCheckCircle className="w-6 h-6 text-indigo-500 mr-4 mt-1 flex-shrink-0" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Quality Assurance</h3>
                        <p className="text-gray-600">Comprehensive testing and quality assurance to ensure reliable and bug-free products.</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Development Approach</h3>
                  
                  <div className="space-y-6 mb-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Agile Methodology</h4>
                      <p className="text-gray-600 mb-3">We follow agile development practices for faster delivery and continuous improvement.</p>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Sprint-based development</li>
                        <li>• Regular stakeholder feedback</li>
                        <li>• Iterative improvements</li>
                        <li>• Transparent communication</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Domain</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">HealthCare</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">E-commerce</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">CRM</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">AI ML, Agentic AI</span>
                    
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Tourism</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Mobile & Web development</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Workflow Autimation</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Education</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Technology Stack</h4>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">React/Next.js</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Node.js</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">Python/Django</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">React Native</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">AWS/Azure</span>
                        <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm">PostgreSQL</span>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Quality Standards</h4>
                      <ul className="space-y-1 text-gray-600 text-sm">
                        <li>• Code reviews and best practices</li>
                        <li>• Automated testing and CI/CD</li>
                        <li>• Performance optimization</li>
                        <li>• Security implementation</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Development Timeline (Directional)</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Discovery & Planning</span>
                        <span className="text-gray-900 font-medium">1-2 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Design & Prototyping</span>
                        <span className="text-gray-900 font-medium">2-3 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Development Sprints</span>
                        <span className="text-gray-900 font-medium">8-16 weeks</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Testing & Deployment</span>
                        <span className="text-gray-900 font-medium">2-3 weeks</span>
        
                      </div>
                    </div>
                  </div>

                  <Link href="/contact">
                    <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors">
                      Contact Us
                    </button>
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Types Section */}
        <section className="py-12 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Products We Build</h2>
                <p className="text-lg text-gray-600">Diverse range of digital products across industries</p>
              </motion.div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Web Applications</h3>
                  <p className="text-gray-600 mb-4">Responsive web apps with modern frameworks and cloud deployment.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• SaaS platforms</li>
                    <li>• E-commerce solutions</li>
                    <li>• Business dashboards</li>
                    <li>• Content management systems</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Mobile Applications</h3>
                  <p className="text-gray-600 mb-4">Native and cross-platform mobile apps for iOS and Android.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• React Native apps</li>
                    <li>• Progressive web apps</li>
                    <li>• Enterprise mobile solutions</li>
                    <li>• Consumer applications</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">API & Backend</h3>
                  <p className="text-gray-600 mb-4">Scalable backend systems and RESTful API development.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Microservices architecture</li>
                    <li>• Database design</li>
                    <li>• Third-party integrations</li>
                    <li>• Cloud infrastructure</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">E-commerce Platforms</h3>
                  <p className="text-gray-600 mb-4">Custom e-commerce solutions with payment integration.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Online marketplaces</li>
                    <li>• B2B platforms</li>
                    <li>• Subscription services</li>
                    <li>• Multi-vendor systems</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Enterprise Solutions</h3>
                  <p className="text-gray-600 mb-4">Large-scale enterprise applications and integrations.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• ERP systems</li>
                    <li>• CRM platforms</li>
                    <li>• Workflow automation</li>
                    <li>• Data analytics tools</li>
                  </ul>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                  className="bg-white rounded-lg p-6 shadow-sm"
                >
                  <div className="bg-indigo-100 text-indigo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    <FaCode className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Products</h3>
                  <p className="text-gray-600 mb-4">Intelligent applications with machine learning capabilities.</p>
                  <ul className="text-sm text-gray-500 space-y-1">
                    <li>• Recommendation engines</li>
                    <li>• Chatbots and virtual assistants</li>
                    <li>• Predictive analytics</li>
                    <li>• Computer vision solutions</li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Build Your Product?</h2>
              <p className="text-lg text-gray-600 mb-8">
                Let's transform your ideas into powerful digital products that drive business success.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/contact">
                  <div className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    Start Your Project
                  </div>
                </Link>
                <Link href="/consulting">
                  <div className="border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white font-semibold py-3 px-8 rounded-full transition-colors">
                    View All Services
                  </div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
    </>
  );
};

export default ProductDevelopment;