import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FaCode, FaArrowLeft, FaCheckCircle, FaExternalLinkAlt, FaRocket, FaBolt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const ProductDevelopment: NextPage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const products = [
    {
      href: "https://www.raahirides.com",
      logo: "/images/raahi_rides_logo.png",
      title: "RaahiRides",
      description: "Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. Comprehensive travel solutions from point-to-point journeys to corporate retreats.",
      industry: "Travel Industry",
      color: "indigo"
    },
    {
      href: "https://www.vishalcreations.com",
      logo: "/images/VC Logo.png",
      title: "Vishal Creations",
      description: "Premium Plastic & Chemical Raw Materials Supplier.",
      industry: "Manufacturing",
      color: "pink"
    },
    {
      href: "https://www.how2doai.com",
      logo: "/images/logo.png",
      title: "How2doAI",
      description: "A comprehensive AI app finder and comparison platform, enabling AI automation for end-to-end workflows. Discover, compare, and integrate top AI tools.",
      industry: "Artificial Intelligence",
      color: "cyan"
    },
    {
      href: "https://ayuhclinic.netlify.app/",
      logo: "/images/AYUH_Logo_2.png",
      title: "Ayuh Clinic",
      description: "Comprehensive Healthcare Solutions. From professional home care services to natural homeopathic healing - integrated healthcare with compassion and expertise.",
      industry: "Healthcare",
      color: "green"
    },
    {
      href: "https://khtherapy.netlify.app/",
      logo: "/images/KH.svg",
      title: "Khtherapy",
      description: "Physio clinic offering expert physiotherapy and rehabilitation services for all ages. Personalized care for pain relief, mobility, and wellness.",
      industry: "Physiotherapy Clinic",
      color: "blue"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + products.length) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  // Touch handlers for mobile swipe
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;
    
    const interval = setInterval(nextSlide, 6000); // Slower auto-slide for better UX
    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        prevSlide();
      } else if (event.key === 'ArrowRight') {
        nextSlide();
      } else if (event.key === ' ') {
        event.preventDefault();
        toggleAutoPlay();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          text: 'text-indigo-700',
          industry: 'text-indigo-500',
          hover: 'group-hover:text-indigo-600'
        };
      case 'pink':
        return {
          text: 'text-pink-700',
          industry: 'text-pink-500',
          hover: 'group-hover:text-pink-600'
        };
      case 'cyan':
        return {
          text: 'text-cyan-700',
          industry: 'text-cyan-500',
          hover: 'group-hover:text-cyan-600'
        };
      case 'green':
        return {
          text: 'text-green-700',
          industry: 'text-green-500',
          hover: 'group-hover:text-green-600'
        };
      case 'blue':
        return {
          text: 'text-blue-700',
          industry: 'text-blue-500',
          hover: 'group-hover:text-blue-600'
        };
      default:
        return {
          text: 'text-gray-700',
          industry: 'text-gray-500',
          hover: 'group-hover:text-gray-600'
        };
    }
  };
  return (
    <>
      <Head>
        <title>Product Development - ITWala Consulting</title>
        <meta name="description" content="End-to-end product development services from concept to launch, building scalable and user-centric solutions." />
      </Head>

      <main className="pt-8">
        {/* Enhanced Hero Section with Showcase Products */}
        <section className="py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-indigo-100 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-20 h-20 bg-indigo-600 rounded-full blur-xl"></div>
            <div className="absolute top-32 right-20 w-32 h-32 bg-purple-600 rounded-full blur-xl"></div>
            <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-indigo-500 rounded-full blur-xl"></div>
          </div>
          
          <div className="container mx-auto px-4 relative">
            {/* Main Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-5xl mx-auto text-center mb-8"
            >
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                  <FaCode className="w-8 h-8" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Product Strategy & Development
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-6 max-w-3xl mx-auto leading-relaxed">
                End-to-end product strategy & development services from concept to launch, building scalable and user-centric solutions that drive business success.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <Link href="/contact">
                  <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center">
                    <FaRocket className="mr-2" />
                    Start Your Project
                  </button>
                </Link>
                
                <Link href="/consulting">
                  <button className="border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center">
                    <FaArrowLeft className="w-4 h-4 mr-2" />
                    Back to All Services
                  </button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-indigo-600 mb-1">50+</div>
                  <div className="text-sm text-gray-600">Products Built</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-purple-600 mb-1">95%</div>
                  <div className="text-sm text-gray-600">Client Satisfaction</div>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="text-center"
                >
                  <div className="text-2xl font-bold text-indigo-600 mb-1">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </motion.div>
              </div>
            </motion.div>

            {/* Showcase Products Section - Integrated into Hero */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              <div className="text-center mb-8">
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                    <FaBolt className="text-indigo-600 w-5 h-5" />
                  </div>
                  <span className="text-indigo-600 font-semibold uppercase tracking-wider text-sm">Live Products Portfolio</span>
                </div>
                <h2 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900">
                  Enterprise Products by ITWala Consulting
                </h2>
                <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
                  Explore our portfolio of innovative products built from concept to market research to development to launch - real enterprise solutions making measurable impact across industries.
                </p>
              </div>
              
              {/* Enhanced Product Slider */}
              <div 
                className="relative group"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Progress Bar with Auto-play Controls */}
                <div className="flex justify-center items-center mb-6 space-x-4">
                  <button
                    onClick={toggleAutoPlay}
                    className="bg-white/80 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-indigo-600 p-2 rounded-lg shadow-md transition-all duration-300 border border-gray-200"
                    aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
                  >
                    {isAutoPlaying ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    )}
                  </button>
                  
                  <div className="bg-gray-200 rounded-full p-1 flex items-center space-x-1">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === currentSlide
                            ? 'bg-indigo-600 w-8'
                            : 'bg-gray-300 hover:bg-gray-400 w-2'
                        }`}
                        aria-label={`Go to product ${index + 1}: ${products[index].title}`}
                      />
                    ))}
                  </div>
                  
                  <div className="text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg border border-gray-200">
                    {isAutoPlaying && !isHovered ? 'Auto' : 'Manual'}
                  </div>
                </div>

                {/* Slider Container */}
                <div 
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white to-gray-50 shadow-2xl border border-gray-100"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  <div 
                    className="flex transition-transform duration-700 ease-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {products.map((product, index) => {
                      const colorClasses = getColorClasses(product.color);
                      return (
                        <motion.div
                          key={index}
                          className="group/card block w-full flex-shrink-0 relative"
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.5 }}
                        >
                          <a
                            href={product.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block p-8 md:p-12 hover:bg-gradient-to-br hover:from-gray-50 hover:to-white transition-all duration-500"
                          >
                            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                              {/* Enhanced Logo Section */}
                              <div className="flex-shrink-0 relative group/logo">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl blur-xl opacity-30 group-hover/card:opacity-50 transition-opacity duration-500"></div>
                                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-3xl flex items-center justify-center bg-white shadow-xl border border-gray-100 group-hover/card:shadow-2xl group-hover/card:scale-105 transition-all duration-500 p-4">
                                  <Image
                                    src={product.logo}
                                    alt={`${product.title} Logo`}
                                    width={product.title === "Vishal Creations" ? 120 : 80}
                                    height={product.title === "Vishal Creations" ? 120 : 80}
                                    className={`object-contain filter group-hover/card:brightness-110 transition-all duration-500 ${
                                      product.title === "Vishal Creations" ? "max-w-full max-h-full" : ""
                                    }`}
                                    style={{
                                      maxWidth: product.title === "Vishal Creations" ? "100%" : "80px",
                                      maxHeight: product.title === "Vishal Creations" ? "100%" : "80px"
                                    }}
                                  />
                                  {/* Live Status Indicator */}
                                  <div className="absolute -top-2 -right-2 flex items-center">
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                                      <div className="w-3 h-3 bg-white rounded-full"></div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Enhanced Content Section */}
                              <div className="flex-1 text-center lg:text-left space-y-6">
                                <div className="space-y-4">
                                  {/* Header with External Link */}
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className={`text-3xl lg:text-4xl font-bold ${colorClasses.text} group-hover/card:${colorClasses.hover} transition-colors duration-300`}>
                                        {product.title}
                                      </h3>
                                      <div className="flex items-center mt-2">
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${colorClasses.industry} bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200`}>
                                          {product.industry}
                                        </span>
                                        <div className="ml-3 flex items-center text-green-600">
                                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                                          <span className="text-sm font-medium">Live</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                      <FaExternalLinkAlt className={`text-gray-400 group-hover/card:${colorClasses.hover} transition-colors duration-300 text-xl`} />
                                      <div className="hidden lg:block w-12 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg opacity-20 group-hover/card:opacity-40 transition-opacity duration-300"></div>
                                    </div>
                                  </div>
                                  
                                  {/* Description */}
                                  <p className="text-gray-600 text-lg lg:text-xl leading-relaxed font-light">
                                    {product.description}
                                  </p>
                                </div>
                                
                                {/* Call to Action */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                  <div className="flex items-center space-x-4">
                                    <span className="text-sm text-gray-500 font-medium">View Live Product</span>
                                    <div className="flex space-x-1">
                                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                      <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                                    </div>
                                  </div>
                                  <div className={`group-hover/card:translate-x-2 transition-transform duration-300 ${colorClasses.text}`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Enhanced Navigation Controls */}
                <div className="absolute inset-y-0 left-0 flex items-center">
                  <button
                    onClick={prevSlide}
                    className="ml-4 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-indigo-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-100"
                    aria-label="Previous product"
                    disabled={products.length <= 1}
                  >
                    <FaChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button
                    onClick={nextSlide}
                    className="mr-4 bg-white/95 backdrop-blur-sm hover:bg-white text-gray-600 hover:text-indigo-600 p-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-110 opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:scale-100 border border-gray-100"
                    aria-label="Next product"
                    disabled={products.length <= 1}
                  >
                    <FaChevronRight className="w-6 h-6" />
                  </button>
                </div>

                {/* Enhanced Product Counter */}
                <div className="flex justify-center mt-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg border border-gray-200">
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span className="font-medium">
                        {currentSlide + 1} of {products.length}
                      </span>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <span>Enterprise Products</span>
                      <div className="w-px h-4 bg-gray-300"></div>
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>All Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Service Details */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-3xl font-bold text-gray-900 mb-6">What We Offer</h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Our product development services cover the entire lifecycle from ideation to deployment. We build robust, scalable, and user-friendly products that drive business growth and customer satisfaction.
                  </p>
                  
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
        <section className="py-20 bg-gray-50">
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
        <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
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