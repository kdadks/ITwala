import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, CheckCircle, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const Portfolio: NextPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 450; // card width + gap
      const currentScroll = scrollContainerRef.current.scrollLeft;
      const targetScroll = direction === 'left'
        ? currentScroll - scrollAmount
        : currentScroll + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
    }
  };

  const projects = [
    {
      href: "https://www.raahirides.com",
      logo: "/images/raahi_rides_logo.png",
      title: "RaahiRides",
      description: "Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. Comprehensive travel solutions from point-to-point journeys to corporate retreats.",
      industry: "Travel Industry",
      color: "indigo",
      features: ["Real-time GPS tracking", "Secure payments", "Driver verification", "24/7 support"],
      technologies: ["React Native", "Node.js", "MongoDB", "Google Maps API"],
      impact: "10,000+ active users, 95% customer satisfaction"
    },
    {
      href: "https://www.vishalcreations.com",
      logo: "/images/VC Logo.png",
      title: "Vishal Creations",
      description: "Premium Plastic & Chemical Raw Materials Supplier.",
      industry: "Manufacturing",
      color: "pink",
      features: ["Quality assurance", "Bulk supply", "Custom formulations", "Fast delivery"],
      technologies: ["Next.js", "Tailwind CSS", "Stripe", "Vercel"],
      impact: "500+ B2B clients, 40% increase in online orders"
    },
    {
      href: "https://www.how2doai.com",
      logo: "/images/logo.png",
      title: "How2doAI",
      description: "A comprehensive AI app finder and comparison platform, enabling AI automation for end-to-end workflows. Discover, compare, and integrate top AI tools.",
      industry: "Artificial Intelligence",
      color: "cyan",
      features: ["AI tool comparison", "Workflow automation", "Integration guides", "Performance analytics"],
      technologies: ["React", "TypeScript", "OpenAI API", "PostgreSQL"],
      impact: "50,000+ monthly visitors, 1,000+ AI tools catalogued"
    },
    {
      href: "https://ayuhclinic.netlify.app/",
      logo: "/images/AYUH_Logo_2.png",
      title: "Ayuh Clinic",
      description: "Comprehensive Healthcare Solutions. From professional home care services to natural homeopathic healing - integrated healthcare with compassion and expertise.",
      industry: "Healthcare",
      color: "green",
      features: ["Home care services", "Homeopathic treatments", "Expert consultations", "Wellness programs"],
      technologies: ["React", "Firebase", "Netlify", "Stripe"],
      impact: "2,000+ patients served, 4.9/5 rating"
    },
    {
      href: "https://khtherapy.ie/",
      logo: "/images/KH.png",
      title: "KH Therapy",
      description: "Physio clinic offering expert physiotherapy and rehabilitation services for all ages. Personalized care for pain relief, mobility, and wellness.",
      industry: "Physiotherapy Clinic",
      color: "blue",
      features: ["Pain management", "Rehabilitation programs", "Sports therapy", "Post-surgery care"],
      technologies: ["WordPress", "WooCommerce", "Custom Plugins"],
      impact: "1,500+ successful treatments, 98% recovery rate"
    },
    {
      href: "https://nirchal.com/",
      logo: "/images/Nirchal_Logo.png",
      title: "Nirchal",
      description: "Retail garments store offering a wide range of clothing and accessories for all ages. Quality products at affordable prices.",
      industry: "Retail Garments",
      color: "pink",
      features: ["Wide selection", "Affordable prices", "Quality assurance", "Fast shipping"],
      technologies: ["React", "Commerce.js", "Stripe", "Netlify"],
      impact: "5,000+ products sold, 200+ daily orders"
    },
    {
      href: "https://eyogigurukul.com/ssh-app",
      logo: "/images/eyogiLogo.png",
      title: "eYogi Gurukul",
      description: "Online Learning Platform offering Indian cultural, religious yoga classes and wellness programs for all ages. Expert instructors and personalized plans.",
      industry: "Education & Wellness",
      color: "cyan",
      features: ["Wellness programs", "Digital Platform", "Personalized plans", "Expert instructors"],
      technologies: ["Next.js", "Supabase", "Stripe", "WebRTC"],
      impact: "3,000+ students enrolled, 100+ courses"
    }
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case 'indigo':
        return {
          gradient: 'from-indigo-500 via-purple-500 to-pink-500',
          bg: 'bg-indigo-50',
          text: 'text-indigo-600',
          border: 'border-indigo-200',
          glow: 'shadow-indigo-500/50'
        };
      case 'pink':
        return {
          gradient: 'from-pink-500 via-rose-500 to-red-500',
          bg: 'bg-pink-50',
          text: 'text-pink-600',
          border: 'border-pink-200',
          glow: 'shadow-pink-500/50'
        };
      case 'cyan':
        return {
          gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
          bg: 'bg-cyan-50',
          text: 'text-cyan-600',
          border: 'border-cyan-200',
          glow: 'shadow-cyan-500/50'
        };
      case 'green':
        return {
          gradient: 'from-green-500 via-emerald-500 to-teal-500',
          bg: 'bg-green-50',
          text: 'text-green-600',
          border: 'border-green-200',
          glow: 'shadow-green-500/50'
        };
      case 'blue':
        return {
          gradient: 'from-blue-500 via-indigo-500 to-purple-500',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200',
          glow: 'shadow-blue-500/50'
        };
      default:
        return {
          gradient: 'from-primary-500 via-secondary-500 to-accent-500',
          bg: 'bg-primary-50',
          text: 'text-primary-600',
          border: 'border-primary-200',
          glow: 'shadow-primary-500/50'
        };
    }
  };

  return (
    <>
      <Head>
        <title>Our Portfolio - Successful Projects & Client Success Stories | ITWala</title>
        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        <meta name="description" content="Explore ITWala's portfolio of 50+ successful projects across travel, healthcare, e-commerce, AI, and education. Real results: 10,000+ active users, 95% client satisfaction, innovative digital solutions." />
        <meta name="keywords" content="web development portfolio, successful projects, client case studies, travel app development, healthcare solutions, e-commerce platforms, AI tools, education platforms, digital transformation success stories, custom software examples" />
        <link rel="canonical" href="https://academy.it-wala.com/portfolio" />

        {/* Open Graph */}
        <meta property="og:title" content="Our Portfolio - 50+ Successful Projects | ITWala" />
        <meta property="og:description" content="Showcasing innovative digital solutions: Travel apps with 10,000+ users, healthcare platforms, AI tools, e-commerce sites. 95% client satisfaction, proven results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com/portfolio" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala Portfolio - Successful Digital Solutions" />
        <meta name="twitter:description" content="50+ successful projects: Travel, Healthcare, AI, E-commerce. 10,000+ users, 95% satisfaction. Real innovation, real results." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />

        {/* Schema.org */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "ITWala Portfolio",
            "description": "Portfolio of successful digital solutions and client projects",
            "url": "https://academy.it-wala.com/portfolio",
            "provider": {
              "@type": "Organization",
              "name": "ITWala",
              "url": "https://academy.it-wala.com"
            }
          })}
        </script>
      </Head>

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden text-white py-12 md:py-16">
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 opacity-30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ duration: 1 }}
          >
            <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500 rounded-full blur-3xl"></div>
          </motion.div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 mb-8"
              >
                <Sparkles className="w-5 h-5 text-yellow-300" />
                <span className="text-sm font-semibold">50+ Successful Projects Delivered</span>
              </motion.div>

              <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-lg">
                Our Portfolio
              </h1>

              <p className="text-lg md:text-xl text-gray-100 mb-4 leading-relaxed">
                Transforming Ideas into <span className="font-bold text-yellow-300">Digital Excellence</span>
              </p>

              <p className="text-base text-gray-200 max-w-2xl mx-auto mb-8">
                From innovative travel apps to comprehensive healthcare platforms, we've helped businesses across industries achieve digital success.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { number: "50+", label: "Projects Completed" },
                  { number: "95%", label: "Client Satisfaction" },
                  { number: "100K+", label: "Active Users" },
                  { number: "7", label: "Industries Served" }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                  >
                    <div className="text-2xl md:text-3xl font-bold text-yellow-300 mb-1">{stat.number}</div>
                    <div className="text-xs text-gray-200">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Portfolio Scrolling Section */}
        <section className="py-20 bg-gray-50 relative overflow-hidden">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Projects
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Real solutions, real impact. See how we've helped businesses thrive in the digital age.
              </p>
            </motion.div>

            {/* Horizontal Scrolling Container with Manual Controls */}
            <div className="relative">
              {/* Left Scroll Button */}
              <button
                onClick={() => scroll('left')}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md hover:bg-white shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-110"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-6 h-6 text-gray-700" />
              </button>

              {/* Right Scroll Button */}
              <button
                onClick={() => scroll('right')}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 backdrop-blur-md hover:bg-white shadow-xl rounded-full p-4 transition-all duration-300 hover:scale-110"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-6 h-6 text-gray-700" />
              </button>

              {/* Gradient overlays for fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

              {/* Scrolling wrapper */}
              <div
                ref={scrollContainerRef}
                className="overflow-x-auto scrollbar-hide scroll-smooth"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <div className="flex space-x-8 px-4">
                  {projects.map((project, index) => {
                const colors = getColorClasses(project.color);

                return (
                  <motion.div
                    key={`${project.title}-${index}`}
                    className="flex-shrink-0"
                    style={{ width: '420px', height: '720px' }}
                  >
                    <Link href={project.href} target="_blank" rel="noopener noreferrer">
                      <motion.div
                        whileHover={{ y: -8, scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                        className={`relative h-full bg-white rounded-3xl overflow-hidden border-2 ${colors.border} shadow-xl hover:${colors.glow} hover:shadow-2xl transition-all duration-300 group cursor-pointer`}
                      >
                        {/* Gradient header */}
                        <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

                        <div className="p-8 flex flex-col h-full">
                          {/* Logo and Title */}
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center space-x-4">
                              <div className={`relative w-16 h-16 ${colors.bg} rounded-xl p-2 flex items-center justify-center`}>
                                <Image
                                  src={project.logo}
                                  alt={`${project.title} logo`}
                                  width={48}
                                  height={48}
                                  className="object-contain"
                                />
                              </div>
                              <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-primary-600 group-hover:to-secondary-600 transition-all duration-300">
                                  {project.title}
                                </h3>
                                <span className={`text-sm font-semibold ${colors.text}`}>
                                  {project.industry}
                                </span>
                              </div>
                            </div>

                            <motion.div
                              whileHover={{ rotate: 45, scale: 1.2 }}
                              transition={{ duration: 0.3 }}
                              className={`${colors.bg} p-3 rounded-full`}
                            >
                              <ExternalLink className={`w-5 h-5 ${colors.text}`} />
                            </motion.div>
                          </div>

                          {/* Description */}
                          <div className="mb-6 flex-shrink-0" style={{ height: '72px' }}>
                            <p className="text-gray-600 leading-relaxed line-clamp-3">
                              {project.description}
                            </p>
                          </div>

                          {/* Features */}
                          <div className="mb-6 flex-shrink-0" style={{ height: '100px' }}>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Features</h4>
                            <div className="grid grid-cols-2 gap-2">
                              {project.features.map((feature) => (
                                <div key={feature} className="flex items-start space-x-2">
                                  <CheckCircle className={`w-4 h-4 ${colors.text} flex-shrink-0 mt-0.5`} />
                                  <span className="text-sm text-gray-600">{feature}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Technologies */}
                          <div className="mb-6 flex-shrink-0" style={{ height: '84px' }}>
                            <h4 className="text-sm font-semibold text-gray-700 mb-3">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech) => (
                                <span
                                  key={tech}
                                  className={`px-3 py-1 ${colors.bg} ${colors.text} text-xs font-medium rounded-full border ${colors.border} h-fit`}
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Impact */}
                          <div className={`${colors.bg} rounded-xl p-4 border ${colors.border} flex-shrink-0`} style={{ height: '88px' }}>
                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Impact & Results</h4>
                            <p className={`text-sm ${colors.text} font-semibold`}>{project.impact}</p>
                          </div>

                          {/* CTA - pushed to bottom */}
                          <div className="mt-auto pt-6">
                            <motion.div
                              className="flex items-center justify-between"
                              whileHover={{ x: 5 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className={`font-semibold ${colors.text} flex items-center space-x-2`}>
                                <span>View Live Project</span>
                                <ArrowRight className="w-5 h-5" />
                              </span>
                            </motion.div>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      </motion.div>
                    </Link>
                  </motion.div>
                );
              })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 text-white relative overflow-hidden">
          <motion.div
            className="absolute inset-0 opacity-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
          >
            <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full blur-3xl"></div>
          </motion.div>

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-gray-100 mb-10">
                Let's create something amazing together. Join the ranks of successful businesses we've helped transform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact">
                  <motion.div
                    whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white text-primary-600 rounded-full font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
                  >
                    Get Started Today
                  </motion.div>
                </Link>

                <Link href="/consulting">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 bg-white/10 backdrop-blur-md text-white rounded-full font-bold text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 cursor-pointer"
                  >
                    View All Services
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </>
  );
};

export default Portfolio;
