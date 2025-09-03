import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCode, FaArrowLeft, FaCheckCircle, FaExternalLinkAlt, FaRocket, FaBolt } from 'react-icons/fa';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import { useState, useEffect } from 'react';

const ProductDevelopment: NextPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + products.length) % products.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };
  // Removed slider state variables as we're using a grid layout instead

  const products = [
    {
      href: "https://www.raahirides.com",
      logo: "/images/raahi_rides_logo.png",
      title: "RaahiRides",
      description: "Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. Comprehensive travel solutions from point-to-point journeys to corporate retreats.",
      industry: "Travel Industry",
      color: "indigo",
      features: ["Real-time GPS tracking", "Secure payments", "Driver verification", "24/7 support"],
      ctaText: "Explore RaahiRides"
    },
    {
      href: "https://www.vishalcreations.com",
      logo: "/images/VC Logo.png",
      title: "Vishal Creations",
      description: "Premium Plastic & Chemical Raw Materials Supplier.",
      industry: "Manufacturing",
      color: "pink",
      features: ["Quality assurance", "Bulk supply", "Custom formulations", "Fast delivery"],
      ctaText: "Shop Materials"
    },
    {
      href: "https://www.how2doai.com",
      logo: "/images/logo.png",
      title: "How2doAI",
      description: "A comprehensive AI app finder and comparison platform, enabling AI automation for end-to-end workflows. Discover, compare, and integrate top AI tools.",
      industry: "Artificial Intelligence",
      color: "cyan",
      features: ["AI tool comparison", "Workflow automation", "Integration guides", "Performance analytics"],
      ctaText: "Discover AI Tools"
    },
    {
      href: "https://ayuhclinic.netlify.app/",
      logo: "/images/AYUH_Logo_2.png",
      title: "Ayuh Clinic",
      description: "Comprehensive Healthcare Solutions. From professional home care services to natural homeopathic healing - integrated healthcare with compassion and expertise.",
      industry: "Healthcare",
      color: "green",
      features: ["Home care services", "Homeopathic treatments", "Expert consultations", "Wellness programs"],
      ctaText: "Book Appointment"
    },
    {
      href: "https://khtherapy.netlify.app/",
      logo: "/images/KH.png",
      title: "Khtherapy",
      description: "Physio clinic offering expert physiotherapy and rehabilitation services for all ages. Personalized care for pain relief, mobility, and wellness.",
      industry: "Physiotherapy Clinic",
      color: "blue",
      features: ["Pain management", "Rehabilitation programs", "Sports therapy", "Post-surgery care"],
      ctaText: "Start Therapy"
    }
  ];

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

            {/* Compact Portfolio Grid - Replace Slider */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              className="max-w-7xl mx-auto group/container"
            >
              <div className="text-center mb-4">
                <div className="flex items-center justify-center mb-2">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", stiffness: 200 }}
                  >
                    <div className="bg-indigo-100 p-1.5 rounded-lg mr-2">
                      <FaBolt className="text-indigo-600 w-4 h-4" />
                    </div>
                  </motion.div>
                  <motion.span 
                    className="text-indigo-600 font-semibold text-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    Live Products Portfolio
                  </motion.span>
                </div>
              </div>

              {/* Sophisticated Product Carousel */}
              <div className="relative max-w-4xl mx-auto">
                {/* Carousel Container */}
                <div
                  className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/10 via-white/5 to-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {/* Main Carousel */}
                  <div className="relative h-[28rem] md:h-[32rem] lg:h-[36rem]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 300 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -300 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                        className="absolute inset-0"
                      >
                        {(() => {
                          const product = products[currentIndex];
                          const colorClasses = getColorClasses(product.color);
                          return (
                            <div className="h-full flex items-center justify-center p-4 md:p-6 lg:p-8">
                              <div className="max-w-3xl w-full">
                                {/* Product Card */}
                                <motion.div
                                  initial={{ opacity: 0, y: 50 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.8, delay: 0.2 }}
                                  className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 md:p-8 shadow-2xl border border-white/30 relative overflow-hidden"
                                >
                                  {/* Glassmorphism background */}
                                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/10 to-white/5"></div>

                                  {/* Floating particles */}
                                  <div className="absolute top-6 right-6 w-3 h-3 bg-indigo-400/30 rounded-full blur-sm animate-bounce"></div>
                                  <div className="absolute bottom-8 left-8 w-2 h-2 bg-purple-400/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '1s' }}></div>
                                  <div className="absolute top-1/2 right-12 w-2.5 h-2.5 bg-cyan-400/30 rounded-full blur-sm animate-bounce" style={{ animationDelay: '2s' }}></div>

                                  <div className="relative z-10 text-center">
                                    {/* Logo */}
                                    <div className="relative mb-4 inline-block">
                                      <div className="w-20 h-20 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-xl border border-white/40 relative overflow-hidden">
                                        {/* Glassmorphism reflection */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent opacity-60"></div>
                                        <Image
                                          src={product.logo}
                                          alt={`${product.title} Logo`}
                                          width={40}
                                          height={40}
                                          className="object-contain relative z-10"
                                        />
                                      </div>
                                      {/* Live indicator */}
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
                                      </div>
                                    </div>

                                    {/* Title */}
                                    <h3 className={`text-xl md:text-2xl lg:text-3xl font-bold mb-2 ${colorClasses.text} bg-gradient-to-r from-current to-current bg-clip-text`}>
                                      {product.title}
                                    </h3>

                                    {/* Industry Badge */}
                                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${colorClasses.industry} bg-white/20 backdrop-blur-sm border border-white/30 mb-3`}>
                                      <div className={`w-1.5 h-1.5 ${colorClasses.text.replace('text-', 'bg-')} rounded-full mr-1.5 animate-pulse`}></div>
                                      {product.industry}
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-700 text-sm md:text-base lg:text-lg leading-relaxed mb-4 max-w-xl mx-auto">
                                      {product.description}
                                    </p>

                                    {/* Features */}
                                    <div className="grid grid-cols-2 gap-2 mb-6 max-w-lg mx-auto">
                                      {product.features.map((feature, idx) => (
                                        <motion.div
                                          key={idx}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ duration: 0.5, delay: 0.4 + idx * 0.1 }}
                                          className="flex items-center justify-center space-x-1.5 text-xs md:text-sm text-gray-600 bg-white/50 rounded-lg py-1.5 px-2"
                                        >
                                          <FaCheckCircle className="text-green-500 flex-shrink-0 text-xs" />
                                          <span>{feature}</span>
                                        </motion.div>
                                      ))}
                                    </div>

                                    {/* CTA Button */}
                                    <motion.a
                                      href={product.href}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group relative overflow-hidden"
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                      <span className="relative z-10 mr-2 text-sm">{product.ctaText}</span>
                                      <FaExternalLinkAlt className="relative z-10 group-hover:rotate-12 transition-transform duration-300 text-sm" />
                                    </motion.a>
                                  </div>
                                </motion.div>
                              </div>
                            </div>
                          );
                        })()}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Navigation Controls */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-3">
                    {/* Previous Button */}
                    <motion.button
                      onClick={prevSlide}
                      className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronLeft className="w-5 h-5 text-white group-hover:text-indigo-600 transition-colors duration-300" />
                    </motion.button>

                    {/* Play/Pause Button */}
                    <motion.button
                      onClick={toggleAutoPlay}
                      className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isAutoPlaying ? (
                        <Pause className="w-5 h-5 text-white group-hover:text-indigo-600 transition-colors duration-300" />
                      ) : (
                        <Play className="w-5 h-5 text-white group-hover:text-indigo-600 transition-colors duration-300" />
                      )}
                    </motion.button>

                    {/* Next Button */}
                    <motion.button
                      onClick={nextSlide}
                      className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center shadow-lg border border-white/30 hover:bg-white/30 transition-all duration-300 group"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <ChevronRight className="w-5 h-5 text-white group-hover:text-indigo-600 transition-colors duration-300" />
                    </motion.button>
                  </div>

                  {/* Dot Indicators */}
                  <div className="absolute bottom-4 right-4 flex space-x-2">
                    {products.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                          index === currentIndex
                            ? 'bg-white shadow-lg scale-125'
                            : 'bg-white/50 hover:bg-white/70'
                        }`}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.8 }}
                      />
                    ))}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-1 bg-white/20 backdrop-blur-sm rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((currentIndex + 1) / products.length) * 100}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>

              {/* Enhanced Portfolio Summary */}
              <motion.div
                className="flex justify-center mt-8"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                <div className="bg-white/90 backdrop-blur-md rounded-2xl px-8 py-4 shadow-xl border border-white/50 group hover:shadow-2xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-center space-x-8 text-sm text-gray-600">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
                        <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-30"></div>
                      </div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">{products.length}</div>
                        <div className="text-xs text-gray-500">Live Products</div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">100%</div>
                        <div className="text-xs text-gray-500">Enterprise Ready</div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">99.9%</div>
                        <div className="text-xs text-gray-500">Uptime</div>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-gray-200"></div>
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-rose-400 rounded-full animate-pulse"></div>
                      <div>
                        <div className="font-bold text-gray-800 text-lg">24/7</div>
                        <div className="text-xs text-gray-500">Support</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
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