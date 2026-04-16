import { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, ArrowUpRight, Sparkles, Filter, TrendingUp, Users, Award } from 'lucide-react';
import { useState } from 'react';

const Portfolio: NextPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  const projects = [
    {
      href: "https://www.raahirides.com",
      logo: "/images/raahi_rides_logo.png",
      title: "RaahiRides",
      description: "Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. Comprehensive travel solutions from point-to-point journeys to corporate retreats.",
      industry: "Travel Industry",
      category: "Mobile App",
      color: "indigo",
      features: ["Real-time GPS tracking", "Secure payments", "Driver verification", "24/7 support"],
      technologies: ["React Native", "Node.js", "Supabase", "Google Maps API"],
      impact: "10,000+ active users, 95% customer satisfaction",
      metrics: [
        { label: "Active Users", value: "1K+" },
        { label: "Satisfaction", value: "95%" },
        { label: "Daily Rides", value: "50+" }
      ]
    },
    {
      href: "https://www.vishalcreations.com",
      logo: "/images/VC Logo.png",
      title: "Vishal Creations",
      description: "Premium Plastic & Chemical Raw Materials Supplier.",
      industry: "Manufacturing",
      category: "E-commerce",
      color: "pink",
      features: ["Quality assurance", "Bulk supply", "Custom formulations", "Fast delivery"],
      technologies: ["Next.js", "Tailwind CSS", "Stripe", "Vercel"],
      impact: "500+ B2B clients, 40% increase in online orders",
      metrics: [
        { label: "B2B Clients", value: "500+" },
        { label: "Order Growth", value: "+40%" },
        { label: "Products", value: "20+" }
      ]
    },
    {
      href: "https://www.how2doai.com",
      logo: "/images/logo.png",
      title: "How2doAI",
      description: "A comprehensive AI app finder and comparison platform, enabling AI automation for end-to-end workflows. Discover, compare, and integrate top AI tools.",
      industry: "Artificial Intelligence",
      category: "Web Platform",
      color: "cyan",
      features: ["AI tool comparison", "Workflow automation", "Integration guides", "Performance analytics"],
      technologies: ["React", "TypeScript", "OpenAI API", "PostgreSQL"],
      impact: "50,000+ monthly visitors, 1,000+ AI tools catalogued",
      metrics: [
        { label: "Monthly Visitors", value: "5K+" },
        { label: "AI Tools", value: "1000+" },
        { label: "Comparisons", value: "5K+/mo" }
      ]
    },
    {
      href: "https://ayuhclinic.netlify.app/",
      logo: "/images/AYUH_Logo_2.png",
      title: "Ayuh Clinic",
      description: "Comprehensive Healthcare Solutions. From professional home care services to natural homeopathic healing - integrated healthcare with compassion and expertise.",
      industry: "Healthcare",
      category: "Healthcare",
      color: "green",
      features: ["Home care services", "Homeopathic treatments", "Expert consultations", "Wellness programs"],
      technologies: ["React", "Firebase", "Netlify", "Stripe"],
      impact: "2,000+ patients served, 4.9/5 rating",
      metrics: [
        { label: "Patients Served", value: "2K+" },
        { label: "Rating", value: "4.9/5" },
        { label: "Treatments", value: "500+/mo" }
      ]
    },
    {
      href: "https://khtherapy.ie/",
      logo: "/images/KH.png",
      title: "KH Therapy",
      description: "Physio clinic offering expert physiotherapy and rehabilitation services for all ages. Personalized care for pain relief, mobility, and wellness.",
      industry: "Physiotherapy Clinic",
      category: "Healthcare",
      color: "blue",
      features: ["Pain management", "Rehabilitation programs", "Sports therapy", "Post-surgery care"],
      technologies: ["Node.js", "Supabase", "Sum up"],
      impact: "1,500+ successful treatments, 98% recovery rate",
      metrics: [
        { label: "Treatments", value: "1.5K+" },
        { label: "Recovery Rate", value: "98%" },
        { label: "Services", value: "12" }
      ]
    },
    {
      href: "https://nirchal.com/",
      logo: "/images/Nirchal_Logo.png",
      title: "Nirchal",
      description: "Retail garments store offering a wide range of clothing and accessories for all ages. Quality products at affordable prices.",
      industry: "Retail Garments",
      category: "E-commerce",
      color: "pink",
      features: ["Wide selection", "Affordable prices", "Quality assurance", "Fast shipping"],
      technologies: ["React", "Commerce.js", "Stripe", "Netlify"],
      impact: "5,000+ products sold, 200+ daily orders",
      metrics: [
        { label: "Products Sold", value: "5K+" },
        { label: "Daily Orders", value: "20+" },
        { label: "Catalog", value: "100+" }
      ]
    },
    {
      href: "https://eyogigurukul.com/ssh-app",
      logo: "/images/eyogiLogo.png",
      title: "eYogi Gurukul",
      description: "Online Learning Platform offering Indian cultural, religious yoga classes and wellness programs for all ages. Expert instructors and personalized plans.",
      industry: "Education & Wellness",
      category: "Web Platform",
      color: "cyan",
      features: ["Wellness programs", "Digital Platform", "Personalized plans", "Expert instructors"],
      technologies: ["Next.js", "Tailwind CSS", "Supabase", "Stripe", "WebRTC"],
      impact: "1,000+ students enrolled, 100+ courses",
      metrics: [
        { label: "Students", value: "1K+" },
        { label: "Courses", value: "13+" },
        { label: "Completion", value: "85%" }
      ]
    },
    {
      href: "https://www.panditrajeshjoshi.com/",
      logo: "/images/Raj ji.svg",
      title: "Pandit Rajesh Joshi",
      description: "Online Platform offering spiritual guidance and religious teachings for all ages. Expert pandit with personalized plans.",
      industry: "Religious & Spiritual",
      category: "Web Platform",
      color: "cyan",
      features: ["Spiritual guidance", "Religious teachings", "Personalized plans", "Expert pandit"],
      technologies: ["Next.js", "Tailwind CSS", "Supabase", "Stripe", "WebRTC"],
      impact: "250+ Poojas conducted, 100+ satisfied clients",
      metrics: [
        { label: "Poojas", value: "250+" },
        { label: "Clients", value: "100+" },
        { label: "Rating", value: "5.0/5" }
      ]
    },
    {
      href: "https://www.adamstown.info",
      logo: "/images/adam.jpeg",
      title: "Adamstown.info",
      description: "Built-and-owned digital property by ITWala — a full-stack informational platform covering the Adamstown area. Demonstrates end-to-end product ownership from development and hosting to SEO and content strategy.",
      industry: "Digital Media",
      category: "Web Platform",
      color: "indigo",
      features: ["Built & owned by ITWala", "SEO optimised", "Content strategy", "Performance first"],
      technologies: ["Next.js", "Tailwind CSS", "Vercel", "Google Analytics"],
      impact: "ITWala-owned product — built, hosted and operated in-house",
      metrics: [
        { label: "Monthly Visitors", value: "1000+" },
        { label: "Ranking", value: "Top 3" },
        { label: "Daily Visitors", value: "100+" }
      ]
    },
    {
      href: "https://www.ukkneeandsportsinjuryclinic.co.uk/",
      logo: "/images/UK.jpg",
      title: "UK Knee & Sports Clinic",
      description: "Comprehensive SEO Improvement Program for a leading UK Knee Surgeon and sports injury clinic. Delivered on-page optimisation, technical audits, local SEO, and content strategy to boost organic search visibility and drive new patient enquiries.",
      industry: "Healthcare",
      category: "Healthcare",
      color: "green",
      features: ["Technical SEO audit", "On-page optimisation", "Local SEO", "Content strategy"],
      technologies: ["Google Search Console", "RankMath", "Schema Markup", "Analytics"],
      impact: "Improved organic rankings and increased patient enquiry volume",
      metrics: [
        { label: "Organic Traffic", value: "+60%" },
        { label: "Rankings", value: "Top 5" },
        { label: "Enquiries", value: "+40%" }
      ]
    }
  ];

  const categories = ['All', 'Mobile App', 'Web Platform', 'E-commerce', 'Healthcare'];

  const filteredProjects = selectedCategory === 'All' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <>
      <Head>
        <title>Our Portfolio - Successful Projects & Client Success Stories | ITWala</title>
        <meta name="description" content="Explore ITWala's portfolio of 50+ successful projects across travel, healthcare, e-commerce, AI, and education. Real results: 10,000+ active users, 95% client satisfaction, innovative digital solutions." />
        <meta name="keywords" content="web development portfolio, successful projects, client case studies, travel app development, healthcare solutions, e-commerce platforms, AI tools, education platforms, digital transformation success stories, custom software examples" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="canonical" href="https://it-wala.com/portfolio" />

        {/* Performance & Core Web Vitals Optimization */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <meta name="author" content="ITWala" />
        <meta httpEquiv="content-language" content="en-US" />

        {/* Open Graph */}
        <meta property="og:title" content="Our Portfolio - 50+ Successful Projects | ITWala" />
        <meta property="og:description" content="Showcasing innovative digital solutions: Travel apps with 10,000+ users, healthcare platforms, AI tools, e-commerce sites. 95% client satisfaction, proven results." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://it-wala.com/portfolio" />
        <meta property="og:image" content="https://it-wala.com/images/IT - WALA_logo (1).png" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala Portfolio - Successful Digital Solutions" />
        <meta name="twitter:description" content="50+ successful projects: Travel, Healthcare, AI, E-commerce. 10,000+ users, 95% satisfaction. Real innovation, real results." />
        <meta name="twitter:image" content="https://it-wala.com/images/IT - WALA_logo (1).png" />

        {/* Enhanced Schema.org for 2026 SEO & AI Citations */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                "@id": "https://it-wala.com/portfolio#webpage",
                "name": "ITWala Portfolio - 50+ Successful Digital Projects",
                "description": "Portfolio of successful digital solutions across Travel, Healthcare, E-commerce, AI, and Education. 100,000+ active users, 95% client satisfaction.",
                "url": "https://it-wala.com/portfolio",
                "isPartOf": {
                  "@id": "https://it-wala.com/#website"
                },
                "about": {
                  "@id": "https://it-wala.com/#organization"
                },
                "primaryImageOfPage": {
                  "@type": "ImageObject",
                  "url": "https://it-wala.com/images/IT - WALA_logo (1).png"
                }
              },
              {
                "@type": "ItemList",
                "@id": "https://it-wala.com/portfolio#projectlist",
                "name": "Featured Projects",
                "description": "Collection of 50+ successful digital transformation projects",
                "numberOfItems": 10,
                "itemListElement": [
                  {
                    "@type": "CreativeWork",
                    "position": 1,
                    "name": "RaahiRides",
                    "description": "Travel apps for Eastern UP, connecting travelers and drivers for a seamless journey. 10,000+ active users, 95% customer satisfaction.",
                    "url": "https://www.raahirides.com",
                    "image": "https://it-wala.com/images/raahi_rides_logo.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Travel Industry"
                    },
                    "keywords": "travel app, ride sharing, GPS tracking, mobile app development"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 2,
                    "name": "Vishal Creations",
                    "description": "Premium Plastic & Chemical Raw Materials Supplier. 500+ B2B clients, 40% increase in online orders.",
                    "url": "https://www.vishalcreations.com",
                    "image": "https://it-wala.com/images/VC Logo.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Manufacturing"
                    },
                    "keywords": "e-commerce, B2B platform, manufacturing, supply chain"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 3,
                    "name": "How2doAI",
                    "description": "AI app finder and comparison platform. 50,000+ monthly visitors, 1,000+ AI tools catalogued.",
                    "url": "https://www.how2doai.com",
                    "image": "https://it-wala.com/images/logo.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Artificial Intelligence"
                    },
                    "keywords": "AI tools, automation, workflow optimization, AI comparison"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 4,
                    "name": "Ayuh Clinic",
                    "description": "Comprehensive Healthcare Solutions. 2,000+ patients served, 4.9/5 rating.",
                    "url": "https://ayuhclinic.netlify.app/",
                    "image": "https://it-wala.com/images/AYUH_Logo_2.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Healthcare"
                    },
                    "keywords": "healthcare platform, homeopathy, patient management"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 5,
                    "name": "KH Therapy",
                    "description": "Physio clinic offering expert physiotherapy. 1,500+ successful treatments, 98% recovery rate.",
                    "url": "https://khtherapy.ie/",
                    "image": "https://it-wala.com/images/KH.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Physiotherapy"
                    },
                    "keywords": "physiotherapy, rehabilitation, healthcare clinic"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 6,
                    "name": "Nirchal",
                    "description": "Retail garments e-commerce platform. 5,000+ products sold, 200+ daily orders.",
                    "url": "https://nirchal.com/",
                    "image": "https://it-wala.com/images/Nirchal_Logo.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Retail"
                    },
                    "keywords": "e-commerce, retail, garments, online shopping"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 7,
                    "name": "eYogi Gurukul",
                    "description": "Online Learning Platform for Indian cultural and yoga classes. 3,000+ students enrolled, 100+ courses.",
                    "url": "https://eyogigurukul.com/ssh-app",
                    "image": "https://it-wala.com/images/eyogiLogo.png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Education & Wellness"
                    },
                    "keywords": "online learning, yoga, wellness, education platform"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 8,
                    "name": "Pandit Rajesh Joshi",
                    "description": "Online Platform for spiritual guidance. 250+ Poojas conducted, 5.0/5 rating.",
                    "url": "https://www.panditrajeshjoshi.com/",
                    "image": "https://it-wala.com/images/Raj ji.svg",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Religious & Spiritual"
                    },
                    "keywords": "spiritual guidance, religious services, online platform"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 9,
                    "name": "Adamstown.info",
                    "description": "Built-and-owned digital property by ITWala covering the Adamstown area. Full-stack product owned and operated in-house.",
                    "url": "https://www.adamstown.info",
                    "image": "https://it-wala.com/images/IT - WALA_logo (1).png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Digital Media"
                    },
                    "keywords": "digital property, web platform, ITWala owned, SEO, content strategy"
                  },
                  {
                    "@type": "CreativeWork",
                    "position": 10,
                    "name": "UK Knee & Sports Injury Clinic",
                    "description": "SEO Improvement Program for a leading UK Knee Surgeon and sports injury clinic. Boosted organic rankings and patient enquiry volume.",
                    "url": "https://www.ukkneeandsportsinjuryclinic.co.uk/",
                    "image": "https://it-wala.com/images/IT - WALA_logo (1).png",
                    "creator": {
                      "@id": "https://it-wala.com/#organization"
                    },
                    "audience": {
                      "@type": "Audience",
                      "audienceType": "Healthcare"
                    },
                    "keywords": "SEO, healthcare, Knee Surgeon, sports injury, organic search, local SEO"
                  }
                ]
              },
              {
                "@type": "Organization",
                "@id": "https://it-wala.com/#organization",
                "name": "ITWala",
                "legalName": "ITWala Academy",
                "url": "https://it-wala.com",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://it-wala.com/images/IT - WALA_logo (1).png",
                  "width": 250,
                  "height": 60
                },
                "description": "Leading digital transformation agency delivering innovative web and mobile solutions across multiple industries",
                "aggregateRating": {
                  "@type": "AggregateRating",
                  "ratingValue": "4.95",
                  "reviewCount": "50",
                  "bestRating": "5",
                  "worstRating": "1"
                },
                "address": {
                  "@type": "PostalAddress",
                  "addressCountry": "IN"
                },
                "numberOfEmployees": {
                  "@type": "QuantitativeValue",
                  "value": "20"
                }
              },
              {
                "@type": "FAQPage",
                "@id": "https://it-wala.com/portfolio#faq",
                "mainEntity": [
                  {
                    "@type": "Question",
                    "name": "What industries does ITWala serve?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "ITWala serves 7+ industries including Travel, Healthcare, E-commerce, Artificial Intelligence, Education & Wellness, Manufacturing, and Retail. We have successfully delivered 50+ projects with 100,000+ active users across all platforms and maintain a 95% client satisfaction rate."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What technologies does ITWala use?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "ITWala specializes in modern web and mobile technologies including React, Next.js, React Native, Node.js, TypeScript, Supabase, Firebase, and cloud platforms. We focus on scalable, performant solutions using the latest industry-standard frameworks."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "How many successful projects has ITWala completed?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "ITWala has successfully completed 50+ projects serving over 100,000 active users. Our portfolio includes travel apps with 10,000+ users, healthcare platforms serving 2,000+ patients, AI tools with 50,000+ monthly visitors, and e-commerce sites processing 200+ daily orders."
                    }
                  },
                  {
                    "@type": "Question",
                    "name": "What is ITWala's client satisfaction rate?",
                    "acceptedAnswer": {
                      "@type": "Answer",
                      "text": "ITWala maintains a 95% client satisfaction rate with a 4.95/5 average rating. Our projects consistently deliver measurable results including increased user engagement, higher conversion rates, and improved business outcomes."
                    }
                  }
                ]
              },
              {
                "@type": "WebSite",
                "@id": "https://it-wala.com/#website",
                "url": "https://it-wala.com",
                "name": "ITWala",
                "publisher": {
                  "@id": "https://it-wala.com/#organization"
                },
                "potentialAction": {
                  "@type": "SearchAction",
                  "target": "https://it-wala.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string"
                }
              },
              {
                "@type": "BreadcrumbList",
                "@id": "https://it-wala.com/portfolio#breadcrumb",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": "https://it-wala.com"
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Portfolio",
                    "item": "https://it-wala.com/portfolio"
                  }
                ]
              }
            ]
          })}
        </script>
      </Head>

      <main className="min-h-screen bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700">
        {/* Hero Section - Aligned with Home Page */}
        <section className="relative overflow-hidden text-white -mt-32 pt-40">
          {/* Smooth gradient overlay that blends with navbar background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700/95 via-primary-600/95 to-secondary-700/95"></div>

          {/* Floating elements - matching home page style */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="absolute top-20 left-10 w-12 h-12 bg-white rounded-lg opacity-10 transform rotate-12"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 bg-accent-200 rounded-full opacity-10"></div>
            <div className="absolute top-1/3 right-1/4 w-8 h-8 bg-secondary-200 rounded-lg opacity-10 transform -rotate-12"></div>
            <div className="absolute top-40 right-20 w-10 h-10 bg-white rounded-full opacity-10"></div>
            <div className="absolute bottom-40 left-20 w-14 h-14 bg-accent-200 rounded-lg opacity-10 transform rotate-45"></div>
          </motion.div>

          <div className="container mx-auto px-4 py-4 md:py-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center mb-4 md:mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Badge */}
                <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full border border-white/20 shadow-lg mb-3">
                  <Sparkles className="w-5 h-5 text-accent-200" />
                  <span className="text-sm font-semibold text-white">Trusted by 50+ businesses worldwide</span>
                </div>

                {/* Main heading - matching home page size */}
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 md:mb-3 leading-tight text-white drop-shadow-lg">
                  Our Success Stories
                </h1>
                
                <p className="text-base sm:text-lg md:text-xl text-gray-100 mb-3 md:mb-4 max-w-2xl mx-auto px-2 drop-shadow">
                  Transforming ideas into digital excellence. Explore our portfolio of innovative solutions that drive real business results.
                </p>
              </motion.div>

              {/* Stats Grid - Aligned with home page card styling */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-4 md:mb-6"
              >
                {[
                  { icon: TrendingUp, number: "10K+", label: "Active Users", numColor: "text-cyan-300", iconBg: "from-blue-500 to-cyan-500" },
                  { icon: Award, number: "95%", label: "Client Satisfaction", numColor: "text-pink-300", iconBg: "from-purple-500 to-pink-500" },
                  { icon: Sparkles, number: "50+", label: "Projects Delivered", numColor: "text-orange-300", iconBg: "from-orange-500 to-red-500" },
                  { icon: Users, number: "7", label: "Industries Served", numColor: "text-emerald-300", iconBg: "from-green-500 to-emerald-500" }
                ].map((stat, index) => {
                  const Icon = stat.icon;
                  return (
                    <div key={stat.label} className="text-center">
                      <div className="flex items-center justify-center mb-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.iconBg} p-0.5`}>
                          <div className="w-full h-full bg-white rounded-lg flex items-center justify-center">
                            <Icon className="w-5 h-5 text-gray-700" />
                          </div>
                        </div>
                      </div>
                      <div className={`text-2xl md:text-3xl font-bold mb-1 ${stat.numColor} drop-shadow-lg`}>
                        {stat.number}
                      </div>
                      <div className="text-sm text-white font-medium drop-shadow">{stat.label}</div>
                    </div>
                  );
                })}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section className="py-10 md:py-14 relative bg-gradient-to-b from-gray-50 via-white to-gray-50">
          <div className="container mx-auto px-4">
            {/* Section Header with Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
                    Featured Projects
                  </h2>
                  <p className="text-lg text-gray-600">
                    Real solutions, real impact. Filter by category to explore our work.
                  </p>
                </div>

                {/* Category Filters */}
                <div className="flex items-center gap-3 flex-wrap">
                  <Filter className="w-5 h-5 text-gray-500" />
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-5 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                        selectedCategory === category
                          ? 'bg-gradient-to-r from-primary-600 to-secondary-600 text-white shadow-lg shadow-primary-500/30'
                          : 'bg-white text-gray-700 border border-gray-300 hover:border-primary-300 hover:bg-primary-50'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Projects Grid */}
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredProjects.map((project, index) => {
                  const colors = getColorClasses(project.color);
                  
                  return (
                    <motion.div
                      key={project.title}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                      onMouseEnter={() => setHoveredProject(index)}
                      onMouseLeave={() => setHoveredProject(null)}
                    >
                      <Link
                        href={project.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`View ${project.title} - ${project.industry} project`}
                      >
                        <motion.div
                          whileHover={{ y: -8 }}
                          transition={{ duration: 0.3 }}
                          className={`group relative bg-white rounded-3xl overflow-hidden border-2 ${colors.border} shadow-xl hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}
                        >
                          {/* Gradient accent bar */}
                          <div className={`h-2 bg-gradient-to-r ${colors.gradient}`} />

                          <div className="p-8 flex flex-col flex-1">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-6">
                              <div className="flex items-center gap-4 flex-1 min-w-0">
                                <div className={`relative w-16 h-16 ${colors.bg} rounded-2xl p-3 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                                  <Image
                                    src={project.logo}
                                    alt={`${project.title} logo`}
                                    width={48}
                                    height={48}
                                    className="object-contain"
                                    loading={index < 3 ? "eager" : "lazy"}
                                    priority={index < 3}
                                    quality={85}
                                    sizes="48px"
                                  />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h3 className="text-2xl font-bold text-gray-900 mb-1 truncate group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-primary-600 group-hover:to-secondary-600 transition-all duration-300">
                                    {project.title}
                                  </h3>
                                  <span className={`inline-block px-3 py-1 text-xs font-semibold ${colors.bg} ${colors.text} rounded-full`}>
                                    {project.category}
                                  </span>
                                </div>
                              </div>

                              <motion.div
                                animate={{
                                  rotate: hoveredProject === index ? 45 : 0,
                                  scale: hoveredProject === index ? 1.1 : 1
                                }}
                                className={`${colors.bg} p-3 rounded-xl flex-shrink-0`}
                              >
                                <ArrowUpRight className={`w-5 h-5 ${colors.text}`} />
                              </motion.div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                              {project.description}
                            </p>

                            {/* Metrics */}
                            <div className="grid grid-cols-3 gap-3 mb-6">
                              {project.metrics.map((metric) => (
                                <div key={metric.label} className={`${colors.bg} rounded-xl p-3 text-center`}>
                                  <div className={`text-lg font-bold ${colors.text} mb-1`}>
                                    {metric.value}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {metric.label}
                                  </div>
                                </div>
                              ))}
                            </div>

                            {/* Technologies */}
                            <div>
                              <div className="flex flex-wrap gap-2">
                                {project.technologies.slice(0, 3).map((tech) => (
                                  <span
                                    key={tech}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg border border-gray-200"
                                  >
                                    {tech}
                                  </span>
                                ))}
                                {project.technologies.length > 3 && (
                                  <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-lg border border-gray-200">
                                    +{project.technologies.length - 3} more
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* CTA */}
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
                              <span className="text-sm font-semibold text-gray-600 group-hover:text-primary-600 transition-colors">
                                View Project
                              </span>
                              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-primary-600 transition-colors" />
                            </div>
                          </div>

                          {/* Hover gradient overlay */}
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: hoveredProject === index ? 0.03 : 0 }}
                            className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} pointer-events-none`}
                          />
                        </motion.div>
                      </Link>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Empty state */}
            {filteredProjects.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Try selecting a different category</p>
              </motion.div>
            )}
          </div>
        </section>

        {/* Quick Facts Section - Optimized for AI Citations */}
        <section className="py-8 md:py-12 bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-6xl mx-auto"
            >
              <div className="bg-gradient-to-br from-primary-50 via-white to-secondary-50 rounded-3xl p-8 md:p-12 border-2 border-primary-100 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-secondary-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Quick Facts</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">50+ projects delivered</strong> across 7 industries including Travel, Healthcare, E-commerce, AI, Education, Manufacturing, and Retail
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">10,000+ active users</strong> across all platforms with proven engagement and satisfaction metrics
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary-600 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">95% client satisfaction rate</strong> with 4.95/5 average rating from successful project deliveries
                      </p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary-600 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Specialized in modern tech stack</strong> including Python,.Net, React, Next.js, React Native, Node.js, TypeScript, Supabase,Postgres Sql and cloud platforms
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary-600 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">Proven results</strong>: Travel apps with 5K+ users, Healthcare platforms serving 2K+ patients, AI tools with 5K+ monthly visitors
                      </p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-secondary-600 mt-2 flex-shrink-0"></div>
                      <p className="text-gray-700 leading-relaxed">
                        <strong className="text-gray-900">End-to-end solutions</strong> from ideation to deployment, maintenance, and scaling for sustainable business growth
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA Section - Minimalistic Design */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Start Your Project?
              </h2>

              <p className="text-lg text-gray-600 mb-8">
                {"Let's discuss how we can help transform your business."}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/contact">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 cursor-pointer inline-flex items-center justify-center gap-2"
                  >
                    <span>Get Started</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </motion.div>
                </Link>

                <Link href="/consulting">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-3 bg-white text-gray-700 rounded-lg font-semibold border border-gray-300 hover:border-primary-600 hover:text-primary-600 transition-all duration-300 cursor-pointer"
                  >
                    View Services
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


export default Portfolio;
