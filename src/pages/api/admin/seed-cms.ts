import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

/**
 * One-time seed API: Upserts ALL current hardcoded content from public pages
 * into the content_sections table so that CMS and public pages share the same DB source.
 *
 * Safe to re-run — uses upsert (insert on conflict update).
 *
 * POST /api/admin/seed-cms
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sections: { name: string; content: any }[] = [];

  // ═══════════════════════════════════════════════════════════════
  //  HOME PAGE — /
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_home_hero',
    content: {
      // UnifiedHero eyebrow + headline
      badge: 'Education & Consulting · IT Excellence',
      title: 'Your Complete IT Partner',
      subTagline: "IT — It's Simple · Let us shape your career & business",
      subtitle: 'Empowering individuals through world-class education and transforming businesses with expert consulting solutions. Your journey to IT excellence starts here.',
      primaryCtaText: 'Get Free Consultation',
      primaryCtaLink: '/contact',
      secondaryCtaText: 'Learn About Us →',
      secondaryCtaLink: '/about',
      bgImage: '',
      // Academy card (right panel)
      academyTitle: 'ITWala Academy',
      academyDescription: 'Master cutting-edge technologies with industry experts and hands-on projects. Build your career with our comprehensive courses.',
      academyTags: ['500+ Students', '8+ Courses', '80% Job Placement', '20+ Tracks'],
      academyCtaText: 'Explore Academy',
      academyCtaLink: '/academy',
      // Consulting card (right panel)
      consultingTitle: 'ITWala Consulting',
      consultingDescription: 'Transform your business with expert IT solutions. From strategy to implementation, we deliver results that drive growth.',
      consultingTags: ['20+ Projects', '50+ Consultants', '24/7 Support', '98% Satisfaction'],
      consultingCtaText: 'Explore Consulting',
      consultingCtaLink: '/consulting',
    },
  });

  sections.push({
    name: 'page_home_seo',
    content: {
      metaTitle: 'ITWala - Web Development, AI Academy & IT Consulting Globally',
      metaDescription: '#1 Web development company & AI Academy. Free AI education resources plus AI crash courses and full programs for beginners and professionals.',
      keywords: 'web development company, AI education platform, AI academy, coding bootcamp',
      ogImage: 'https://it-wala.com/images/IT - WALA_logo (1).png',
    },
  });

  sections.push({
    name: 'page_home_service_showcase',
    content: {
      sectionTitle: 'Two Paths to IT Excellence',
      sectionSubtitle: "Whether you're looking to advance your career or transform your business, we have the expertise to guide you to success.",
      academy: {
        title: 'ITWala Academy',
        tagline: 'Shape Your Career',
        description: "Master in-demand technologies with our comprehensive courses designed by industry experts. From beginner to advanced, we'll guide you every step of the way.",
        features: [
          { icon: 'FaGraduationCap', title: 'Expert-Led Courses', description: 'Learn from industry professionals with real-world experience' },
          { icon: 'FaCode', title: 'Hands-On Projects', description: 'Build portfolio-worthy projects while learning' },
          { icon: 'FaUsers', title: 'Community Support', description: 'Join a thriving community of learners and mentors' },
        ],
        stats: [
          { value: '500+', label: 'Students' },
          { value: '8+', label: 'Courses' },
          { value: '20+', label: 'Learning Tracks' },
          { value: '80%', label: 'Job Placement' },
        ],
        ctaText: 'Explore Academy Courses',
        ctaLink: '/academy',
      },
      consulting: {
        title: 'ITWala Consulting',
        tagline: 'Transform Your Business',
        description: "Accelerate your business growth with our expert IT consulting services. From strategy to implementation, we deliver solutions that drive results.",
        features: [
          { icon: 'FaRocket', title: 'Digital Transformation', description: 'Modernize your business with cutting-edge technology' },
          { icon: 'FaRobot', title: 'AI Solutions', description: 'Leverage artificial intelligence to automate and optimize' },
          { icon: 'FaCogs', title: 'Technical Consulting', description: 'Expert guidance for your technology stack and architecture' },
        ],
        stats: [
          { value: '20+', label: 'Projects' },
          { value: '50+', label: 'Consultants' },
          { value: '98%', label: 'Customer Satisfaction' },
        ],
        ctaText: 'Explore Consulting Services',
        ctaLink: '/consulting',
      },
      cta: {
        title: 'Ready to Get Started?',
        subtitle: "Whether you're looking to advance your skills or transform your business, we're here to help you achieve your goals.",
        primaryCtaText: 'Get Free Consultation',
        primaryCtaLink: '/contact',
        secondaryCtaText: 'Learn More About Us',
        secondaryCtaLink: '/about',
      },
    },
  });

  sections.push({
    name: 'page_home_testimonials',
    content: [
      { id: 1, name: 'RaahiRides', role: 'Travel & Ride-Sharing Platform', image: '/images/raahi_rides_logo.png', quote: 'ITWala transformed our vision of connecting travelers in Eastern UP into reality. Real-time GPS tracking, secure payments, and driver verification — delivered beyond expectations.', rating: 5, metric: '10,000+', metricLabel: 'Active Users' },
      { id: 2, name: 'Vishal Creations', role: 'Manufacturing & B2B Supply', image: '/images/VC Logo.png', quote: 'Their product development expertise helped us achieve a 40% increase in online orders and successfully serve 500+ B2B clients. A true game-changer for our business.', rating: 5, metric: '+40%', metricLabel: 'Online Orders' },
      { id: 3, name: 'How2doAI', role: 'AI Tools Discovery Platform', image: '/images/logo.png', quote: 'ITWala built an incredible AI app finder and comparison platform. From cataloguing 1,000+ tools to workflow automation guides — the quality and speed of delivery was outstanding.', rating: 5, metric: '5,000+', metricLabel: 'Monthly Visitors' },
      { id: 4, name: 'Ayuh Clinic', role: 'Healthcare & Homeopathy', image: '/images/AYUH_Logo_2.png', quote: "ITWala's healthcare solution transformed our clinic's digital presence. The booking system, patient management, and payment integration helped us serve 2,000+ patients with a 4.9/5 rating.", rating: 5, metric: '4.9/5', metricLabel: 'Patient Rating' },
      { id: 5, name: 'KH Therapy', role: 'Physiotherapy Clinic, Ireland', image: '/images/KH.png', quote: "ITWala built us a professional site with fully automated Booking, Payment & Invoicing. We've successfully managed 1,500+ treatments with a 98% recovery rate. Excellent technical support!", rating: 5, metric: '98%', metricLabel: 'Recovery Rate' },
      { id: 6, name: 'Nirchal', role: 'Retail Garments & E-Commerce', image: '/images/Nirchal_Logo.png', quote: 'ITWala delivered a seamless e-commerce platform for our garments store. The shopping experience, inventory management, and fast checkout have driven 5,000+ product sales and strong daily orders.', rating: 5, metric: '5,000+', metricLabel: 'Products Sold' },
      { id: 7, name: 'eYogi Gurukul', role: 'Education & Wellness Platform', image: '/images/eyogiLogo.png', quote: "ITWala's Next.js solution has been phenomenal. With live video classes, course management, and payment integration, we've grown to 1,000+ students across 13+ courses with 85% completion.", rating: 5, metric: '85%', metricLabel: 'Course Completion' },
      { id: 8, name: 'Pandit Rajesh Joshi', role: 'Spiritual & Religious Services', image: '/images/Raj ji.svg', quote: 'ITWala created a dignified platform that truly reflects our spiritual mission. The booking system and live session integration helped us conduct 250+ Poojas with a perfect 5.0/5 rating.', rating: 5, metric: '250+', metricLabel: 'Poojas Conducted' },
      { id: 9, name: 'Adamstown.info', role: 'Digital Media & Local Platform', image: '/images/adam.jpeg', quote: 'A full-stack product built, hosted, and operated in-house by ITWala — end-to-end product ownership from development and SEO to content strategy. Now ranking Top 3 with 1,000+ monthly visitors.', rating: 5, metric: 'Top 3', metricLabel: 'Search Rankings' },
      { id: 10, name: 'UK Knee & Sports Clinic', role: 'Healthcare SEO, United Kingdom', image: '/images/UK.jpg', quote: 'ITWala delivered a comprehensive SEO program — technical audits, on-page optimisation, local SEO, and content strategy. Organic traffic jumped 60% and patient enquiries increased by 40%.', rating: 5, metric: '+60%', metricLabel: 'Organic Traffic' },
      { id: 11, name: 'Luke Smith', role: 'Software Developer, TechCorp', image: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=400', quote: 'The Java Programming Masterclass gave me comprehensive knowledge and hands-on experience. The real-world projects made complex concepts easy to understand — helped me land a better role.', rating: 5, metric: '3x', metricLabel: 'Salary Growth' },
      { id: 12, name: 'Ankit Patel', role: 'AI Engineer, StartupX', image: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400', quote: 'The AI & Machine Learning course gave me the perfect foundation for my career transition. I went from basic Python to implementing production-grade AI models in just 6 months.', rating: 5, metric: '6 mo', metricLabel: 'To First AI Role' },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  //  ACADEMY PAGE — /academy
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_academy_hero',
    content: {
      badge: '🎓 ITWala AI Academy · Future-Proof Skills',
      title: 'Master AI & Machine Learning',
      subtitle: 'Learn artificial intelligence, data science, and modern software engineering with hands-on projects, expert mentorship, and industry certifications.',
      primaryCtaText: 'Browse Courses',
      primaryCtaLink: '/courses',
      secondaryCtaText: 'Free Resources',
      secondaryCtaLink: '/resources',
    },
  });

  sections.push({
    name: 'page_academy_seo',
    content: {
      metaTitle: 'ITWala AI Academy - AI Education, Crash Courses & Training',
      metaDescription: 'ITWala AI Academy - free AI education resources, an AI crash course, and full AI/ML programs for beginners and professionals.',
      keywords: 'AI academy, AI crash course, free AI education, AI courses for beginners, AI courses for professionals',
      ogImage: '',
    },
  });

  sections.push({
    name: 'page_academy_hero_stats',
    content: [
      { value: '500+', label: 'Students Enrolled' },
      { value: '98%', label: 'Satisfaction Rate' },
      { value: '8+', label: 'Batches Delivered' },
    ],
  });

  sections.push({
    name: 'page_academy_cta',
    content: {
      title: 'Ready to advance your IT career?',
      subtitle: 'Join thousands of students learning in-demand IT skills from industry professionals. Start your journey today with our specialized courses.',
      primaryCtaText: 'Browse All Courses',
      primaryCtaLink: '/courses',
      secondaryCtaText: 'Contact Us',
      secondaryCtaLink: '/contact',
      whyChooseTitle: 'Why Choose ITwala Academy?',
      reasons: [
        { title: 'Training by Industry Experts', description: 'Learn directly from professionals who have real-world experience in the field' },
        { title: 'Practical Learning Experience', description: 'Apply concepts through hands-on projects and real-world scenarios' },
        { title: 'IT Company Work Experience', description: 'Real work experience through hands-on industry projects' },
        { title: 'Flexible Learning Schedule', description: 'Study at your own pace, anytime and anywhere' },
      ],
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  CONSULTING PAGE — /consulting
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_consulting_hero',
    content: {
      badge: 'IT Consulting · Digital Transformation',
      title: 'ITWala Product & Consulting',
      subtitle: 'Transform Your Business · Expert IT Solutions',
      primaryCtaText: 'View Services',
      primaryCtaLink: '#services',
      secondaryCtaText: 'Contact Us',
      secondaryCtaLink: '/contact',
    },
  });

  sections.push({
    name: 'page_consulting_seo',
    content: {
      metaTitle: 'IT Consulting & Digital Transformation - ITwala',
      metaDescription: 'Expert IT consulting services including product development, AI solutions, digital transformation, and technical consulting.',
      keywords: 'IT consulting, digital transformation, product development, AI solutions, technical consulting',
      ogImage: '',
    },
  });

  sections.push({
    name: 'page_consulting_services_grid',
    content: {
      sectionTitle: 'Our Consulting Services',
      sectionSubtitle: 'Comprehensive IT solutions designed to accelerate your business growth and digital transformation journey',
      services: [
        {
          title: 'Product Strategy & Development',
          description: 'End-to-end product development services from concept to market research to deployment, ensuring quality and scalability.',
          icon: 'FaCode',
          features: ['Market Research & Validation', 'Go-To-Market Strategy', 'Custom Software Development', 'Web & Mobile App Development', 'API Development & Integration', 'Quality Assurance & Testing'],
          color: 'text-indigo-600',
          bgGradient: 'from-indigo-50 to-indigo-100',
          slug: 'product-development',
        },
        {
          title: 'AI Powered Solutions',
          description: 'Cutting-edge AI and machine learning solutions to automate processes and drive intelligent decision-making.',
          icon: 'FaRobot',
          features: ['AI Strategy & Implementation', 'Machine Learning Models', 'Natural Language Processing', 'Computer Vision Solutions', 'AI-Powered Workflow Automation', 'Agentic AI Solutions'],
          color: 'text-cyan-600',
          bgGradient: 'from-cyan-50 to-cyan-100',
          slug: 'ai-solutions',
        },
        {
          title: 'Digital Transformation',
          description: 'Comprehensive digital transformation services to modernize your business processes and technology infrastructure.',
          icon: 'FaRocket',
          features: ['Digital Strategy Development', 'Process Automation', 'Cloud Migration', 'Legacy System Modernization', 'Change Management'],
          color: 'text-purple-600',
          bgGradient: 'from-purple-50 to-purple-100',
          slug: 'digital-transformation',
        },
        {
          title: 'Technical Consulting',
          description: 'Expert technical guidance to optimize your technology stack, architecture, and development processes.',
          icon: 'FaCogs',
          features: ['Technology Stack Assessment', 'Architecture Design & Review', 'Code Quality Audits', 'Performance Optimization', 'Security Best Practices'],
          color: 'text-blue-600',
          bgGradient: 'from-blue-50 to-blue-100',
          slug: 'technical-consulting',
        },
        {
          title: 'IT Staffing Partner',
          description: 'Connect with top-tier IT professionals and build high-performing teams tailored to your specific needs.',
          icon: 'FaUsers',
          features: ['Talent Acquisition', 'Team Augmentation', 'Dedicated Development Teams', 'Skill Assessment', 'Long-term Partnerships'],
          color: 'text-green-600',
          bgGradient: 'from-green-50 to-green-100',
          slug: 'it-staffing',
        },
        {
          title: 'Training & Development',
          description: 'Comprehensive training programs to upskill your team and ensure successful technology adoption.',
          icon: 'FaGraduationCap',
          features: ['Custom Training Programs', 'Technology Workshops', 'Certification Courses', 'Mentorship Programs', 'Knowledge Transfer Sessions'],
          color: 'text-orange-600',
          bgGradient: 'from-orange-50 to-orange-100',
          slug: 'training-development',
        },
      ],
    },
  });

  sections.push({
    name: 'page_consulting_why_choose_us',
    content: {
      sectionTitle: 'Why Choose ITWala?',
      sectionSubtitle: 'Our commitment to excellence and innovation sets us apart in the IT consulting industry',
      advantages: [
        { icon: 'FaShieldAlt', title: 'Proven Expertise', description: 'With over a decade of experience, our team brings deep technical knowledge and industry best practices to every project.', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { icon: 'FaRocket', title: 'Rapid Delivery', description: 'Our agile methodology ensures fast time-to-market without compromising on quality or security standards.', color: 'text-green-600', bgColor: 'bg-green-100' },
        { icon: 'FaLock', title: 'Enterprise Security', description: 'We implement robust security measures and follow industry-standard compliance frameworks to protect your data.', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { icon: 'FaHandshake', title: 'Long-term Partnership', description: 'We build lasting relationships with our clients, providing ongoing support and continuous improvement.', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { icon: 'FaChartLine', title: 'Scalable Solutions', description: 'Our solutions are designed to grow with your business, ensuring long-term viability and performance.', color: 'text-red-600', bgColor: 'bg-red-100' },
        { icon: 'FaGlobe', title: 'Global Reach', description: 'With teams across multiple countries, we offer round-the-clock support and diverse perspectives.', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      ],
    },
  });

  sections.push({
    name: 'page_consulting_process_steps',
    content: {
      sectionTitle: 'Our Proven Process',
      sectionSubtitle: 'A systematic approach that ensures successful project delivery from concept to completion',
      steps: [
        { step: 1, title: 'Discovery & Analysis', description: 'We start by understanding your business goals, current challenges, and technical requirements through comprehensive analysis.', icon: 'FaSearch', color: 'text-blue-600', bgColor: 'bg-blue-100', details: ['Business requirements gathering', 'Current system assessment', 'Stakeholder interviews', 'Technical audit and analysis'] },
        { step: 2, title: 'Strategy & Planning', description: 'Based on our findings, we develop a comprehensive strategy and detailed project roadmap tailored to your specific needs.', icon: 'FaLightbulb', color: 'text-yellow-600', bgColor: 'bg-yellow-100', details: ['Solution architecture design', 'Technology stack selection', 'Project timeline creation', 'Resource allocation planning'] },
        { step: 3, title: 'Implementation', description: 'Our expert team executes the plan with precision, following agile methodologies and maintaining constant communication.', icon: 'FaCogs', color: 'text-green-600', bgColor: 'bg-green-100', details: ['Agile development process', 'Regular progress updates', 'Quality assurance testing', 'Continuous integration/deployment'] },
        { step: 4, title: 'Deployment & Launch', description: 'We ensure smooth deployment with minimal disruption to your operations, including comprehensive testing and user training.', icon: 'FaRocket', color: 'text-purple-600', bgColor: 'bg-purple-100', details: ['Production deployment', 'Performance monitoring', 'User training sessions', 'Go-live support'] },
        { step: 5, title: 'Support & Optimization', description: 'Post-launch, we provide ongoing support, monitoring, and optimization to ensure continued success and growth.', icon: 'FaHandshake', color: 'text-red-600', bgColor: 'bg-red-100', details: ['24/7 technical support', 'Performance optimization', 'Regular maintenance', 'Feature enhancements'] },
      ],
    },
  });

  sections.push({
    name: 'page_consulting_stats',
    content: {
      sectionTitle: 'Proven Track Record',
      sectionSubtitle: 'Our numbers speak for themselves - delivering exceptional results and building lasting partnerships worldwide',
      stats: [
        { icon: 'FaProjectDiagram', value: '20+', label: 'Projects Delivered', description: 'Successfully completed projects across various industries', color: 'text-blue-600', bgColor: 'bg-blue-100' },
        { icon: 'FaUsers', value: '50+', label: 'Expert Consultants', description: 'Certified professionals with deep industry expertise', color: 'text-green-600', bgColor: 'bg-green-100' },
        { icon: 'FaGlobe', value: '25+', label: 'Countries Served', description: 'Global reach with local expertise and understanding', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { icon: 'FaTrophy', value: '98%', label: 'Client Satisfaction', description: 'Consistently high satisfaction rates from our clients', color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
        { icon: 'FaClock', value: '10+', label: 'Years Experience', description: 'Decade of proven track record in IT consulting', color: 'text-red-600', bgColor: 'bg-red-100' },
        { icon: 'FaHandshake', value: '95%', label: 'Client Retention', description: 'Long-term partnerships built on trust and results', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
      ],
    },
  });

  sections.push({
    name: 'page_consulting_cta',
    content: {
      title: 'Ready to Transform Your Business?',
      subtitle: "Let's discuss how our expert consulting services can help you achieve your digital transformation goals and drive sustainable growth.",
      bulletPoints: [
        'Free initial consultation and project assessment',
        'Customized solutions tailored to your needs',
        'Proven track record with 20+ successful projects',
        'Ongoing support and maintenance included',
      ],
      ctaText: 'Get Started Today',
      ctaLink: '/contact',
      contact: {
        phone: '+91 7982303199',
        email: 'sales@it-wala.com',
        responseTime: 'We typically respond within 2 hours during business hours.',
      },
      faqs: [
        { question: 'How long does a typical project take?', answer: 'Project timelines vary based on scope and complexity, typically ranging from 2-6 months for most consulting engagements.' },
        { question: 'Do you work with small businesses?', answer: 'Yes, we work with businesses of all sizes, from startups to enterprise organizations, tailoring our approach to fit your budget and needs.' },
        { question: 'What industries do you serve?', answer: 'We have experience across multiple industries including healthcare, finance, e-commerce, manufacturing, and technology sectors.' },
      ],
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  ABOUT PAGE — /about
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_about_hero',
    content: {
      badge: 'Our Story · Mission & Values',
      title: 'About ITwala Academy & Consulting',
      subtitle: 'Empowering businesses and individuals with comprehensive IT education & consulting solutions.',
      primaryCtaText: 'Our Story',
      primaryCtaLink: '#our-story',
    },
  });

  sections.push({
    name: 'page_about_seo',
    content: {
      metaTitle: 'About ITwala Academy - AI Academy & Web Development Experts',
      metaDescription: 'Learn about ITwala Academy mission to provide world-class AI education, web development, and IT consulting services.',
      keywords: 'ITwala Academy, AI academy, AI education, web development, IT consulting, about ITwala',
      ogImage: '',
    },
  });

  sections.push({
    name: 'page_about_mission_cards',
    content: {
      sectionTitle: 'Transforming IT Education & Business Solutions',
      sectionSubtitle: "We're on a mission to make quality IT education accessible while delivering innovative business solutions",
      cards: [
        { title: 'Our Mission', description: 'Driving innovation through education and consulting. At ITwala, we transform aspiring technologists into industry-ready professionals while delivering cutting-edge business solutions to organizations worldwide.', icon: '🎯', color: 'from-primary-50 to-primary-100' },
        { title: 'Comprehensive Solutions', description: 'We offer a unique dual approach: world-class IT education through our Academy and professional consulting services including AI solutions, digital transformation, and product development for businesses of all sizes.', icon: '🏢', color: 'from-secondary-50 to-secondary-100' },
        { title: 'Real-World Integration', description: 'Our Academy students benefit from our active consulting projects, gaining hands-on experience with live business applications. Meanwhile, our consulting clients access top-tier talent and proven methodologies developed through years of industry experience.', icon: '🔗', color: 'from-accent-50 to-accent-100' },
      ],
    },
  });

  sections.push({
    name: 'page_about_consulting_services',
    content: {
      sectionTitle: 'ITwala Consulting Services',
      sectionSubtitle: 'Beyond education, we provide comprehensive IT consulting services to help businesses transform and grow',
      services: [
        { title: 'Product Development', description: 'End-to-end product development from concept to deployment with market research and go-to-market strategy.', iconType: 'code' },
        { title: 'AI Solutions', description: 'Cutting-edge AI and machine learning solutions including agentic AI, automation, and intelligent decision-making systems.', iconType: 'lightbulb' },
        { title: 'Digital Transformation', description: 'Comprehensive digital transformation services including cloud migration, process automation, and modernization.', iconType: 'bolt' },
      ],
      ctaText: 'Explore All Services',
      ctaLink: '/services',
    },
  });

  sections.push({
    name: 'page_about_our_story',
    content: {
      title: 'Our Story',
      motto: 'Innovate today for better tomorrow',
      image: '/images/IT - WALA_logo (1).png',
      paragraphs: [
        'ITwala is a comprehensive technology company offering both world-class IT education and professional consulting services. Our Academy division provides high-quality, industry-relevant training to empower individuals and professionals, while our Consulting division delivers cutting-edge solutions to businesses of all sizes.',
        'Through our Academy, we focus on hands-on experience and real-world applications to bridge the gap between education and employment. Our industry-expert instructors and practical learning approach ensure students gain the skills needed to succeed in today\'s competitive market.',
        'Our Consulting division leverages over 10 years of industry experience to provide comprehensive IT solutions including product development, AI-powered solutions, digital transformation, technical consulting, and IT staffing services. This unique combination allows our students to gain invaluable hands-on experience in a thriving technology environment while enabling businesses to access top-tier consulting expertise.',
      ],
    },
  });

  sections.push({
    name: 'page_about_global_presence',
    content: {
      sectionTitle: 'Our Global Presence',
      sectionSubtitle: 'We operate across multiple continents to serve our global community',
      locations: [
        { country: 'Ireland', city: 'Dublin' },
        { country: 'United Kingdom', city: 'London' },
        { country: 'India', city: 'Bengaluru' },
        { country: 'India', city: 'Lucknow' },
      ],
      contactInfo: {
        email: 'support@it-wala.com',
        phone: '+91 7982303199',
        officeHours: 'Monday - Friday: 9 AM - 5 PM',
      },
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  CONTACT PAGE — /contact
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_contact_hero',
    content: {
      badge: 'Get In Touch · Support & Enquiries',
      title: 'Contact Our Team',
      subtitle: 'Have questions about our courses or software consulting? Our experts are ready to help.',
    },
  });

  sections.push({
    name: 'page_contact_seo',
    content: {
      metaTitle: 'Contact ITwala - AI Academy & Web Development Consulting',
      metaDescription: 'Get in touch with ITwala for AI education support, AI course guidance, web development, and IT consulting services.',
      keywords: 'contact ITwala, AI academy support, AI course guidance, web development consulting, IT consulting contact',
      ogImage: '',
    },
  });

  sections.push({
    name: 'page_contact_info',
    content: {
      email: { address: 'support@it-wala.com', note: 'For general inquiries and support' },
      phone: { number: '+91 7982303199', note: 'Monday to Friday, 9AM to 5PM' },
      locations: [
        'Ireland - Dublin',
        'United Kingdom - London',
        'India - Bengaluru, Lucknow',
      ],
      officeHours: [
        'Monday - Friday: 9 AM - 5 PM',
        'Saturday: 10 AM - 3 PM',
        'Sunday: Closed',
      ],
      socialLinks: {
        linkedin: 'https://www.linkedin.com/company/it-wala.com',
      },
      mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.817036747081!2d80.9461593150447!3d26.8466939831587!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399be2b0b0b0b0b0%3A0x0!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1684637298945!5m2!1sen!2sin',
    },
  });

  sections.push({
    name: 'page_contact_faqs',
    content: [
      { id: 1, question: 'How do I enroll in a course?', answer: "You can browse our course catalog and click on the 'Enroll Now' button on any course page. You'll need to create an account or sign in if you already have one. Then follow the checkout process to complete your enrollment." },
      { id: 2, question: 'What payment methods do you accept?', answer: 'We accept all major credit and debit cards, UPI payments, and net banking for Indian students. For corporate training, we also offer invoice-based payments and purchase orders.' },
      { id: 3, question: 'Do you offer any refunds?', answer: "Yes, we have a 30-day money-back guarantee for most courses. If you're unsatisfied with your purchase, you can request a refund within 30 days of enrollment, provided you haven't completed more than 25% of the course." },
      { id: 4, question: 'How long do I have access to a course after enrolling?', answer: 'Once enrolled, you have lifetime access to the course materials. You can learn at your own pace and revisit the content whenever you need to refresh your knowledge.' },
      { id: 5, question: 'Do you offer corporate training programs?', answer: 'Yes, we offer customized corporate training programs for teams and organizations. Please contact our sales team at sales@it-wala.com for more information about corporate packages and custom curriculum.' },
      { id: 6, question: 'Will I receive a certificate after completing a course?', answer: 'Yes, you will receive a certificate of completion once you finish all the required lessons and assignments in a course. Certificates can be downloaded digitally and shared on platforms like LinkedIn.' },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  //  SERVICES PAGE — /services
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_services_hero',
    content: {
      badge: 'IT Consulting · Digital Transformation',
      title: 'Our Consulting Services',
      subtitle: 'Comprehensive IT solutions to accelerate growth & digital transformation.',
    },
  });

  sections.push({
    name: 'page_services_seo',
    content: {
      metaTitle: 'Web Development & IT Consulting Services - ITwala',
      metaDescription: 'Comprehensive web development and IT consulting services including product development, AI solutions, digital transformation, technical consulting, and IT staffing.',
      keywords: 'web development company, web development services, IT consulting services, product development, AI solutions, digital transformation, technical consulting, IT staffing',
      ogImage: '',
    },
  });

  sections.push({
    name: 'page_services_stats',
    content: [
      { value: '100+', label: 'Successful Projects' },
      { value: '50+', label: 'Expert Consultants' },
      { value: '24/7', label: 'Support' },
    ],
  });

  // ═══════════════════════════════════════════════════════════════
  //  COURSES PAGE — /courses
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_courses_hero',
    content: {
      badge: '📚 Browse All Courses',
      title: 'Find Your Perfect Course',
      subtitle: 'Explore our catalog of expert-led courses in AI, machine learning, web development, and more.',
    },
  });

  sections.push({
    name: 'page_courses_seo',
    content: {
      metaTitle: 'Browse All Courses - ITwala AI Academy',
      metaDescription: 'Browse our complete catalog of AI, machine learning, web development, and IT courses. Expert-led, hands-on learning for all skill levels.',
      keywords: 'AI courses, machine learning courses, web development courses, IT training, online courses',
      ogImage: '',
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  PORTFOLIO PAGE — /portfolio
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_portfolio_hero',
    content: {
      badge: '🚀 Our Work · Success Stories',
      title: 'Our Portfolio',
      subtitle: 'Showcasing our best work across web development, AI solutions, and digital transformation.',
    },
  });

  sections.push({
    name: 'page_portfolio_seo',
    content: {
      metaTitle: 'Portfolio - ITwala Web Development & AI Projects',
      metaDescription: 'Explore ITwala portfolio of successful web development, AI, and digital transformation projects delivered to clients worldwide.',
      keywords: 'web development portfolio, AI projects, digital transformation case studies, ITwala projects',
      ogImage: '',
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  RESOURCES PAGE — /resources
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_resources_hero',
    content: {
      badge: '📖 Free Learning Resources',
      title: 'IT Resources & Guides',
      subtitle: 'Free articles, guides, and tutorials on AI, machine learning, web development, and IT best practices.',
    },
  });

  sections.push({
    name: 'page_resources_seo',
    content: {
      metaTitle: 'Free IT Resources, AI Guides & Tutorials - ITwala',
      metaDescription: 'Free IT resources, AI guides, and tutorials from ITwala. Learn about AI, machine learning, web development, and industry best practices.',
      keywords: 'free IT resources, AI guides, machine learning tutorials, web development guides, IT best practices',
      ogImage: '',
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  LOCATIONS (Academy Locations page component)
  // ═══════════════════════════════════════════════════════════════

  sections.push({
    name: 'page_academy_locations',
    content: {
      sectionTitle: 'Our Learning Centers',
      locations: [
        {
          city: 'Lucknow',
          address: 'Lucknow, Uttar Pradesh 226016',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3559.0695846299307!2d80.99421!3d26.8668!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b16b%3A0x93ccba8909978be7!2sLucknow%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1684637298945!5m2!1sen!2sin',
          contactNumber: '+91 7982303199',
          email: 'sales@it-wala.com',
          timings: 'Mon-Sat: 9:00 AM - 6:00 PM',
          facilities: [],
        },
        {
          city: 'Azamgarh',
          address: 'Azamgarh, Uttar Pradesh 276001',
          mapUrl: 'https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14400.169755433826!2d83.1859!3d26.0679!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjYuMDY3OSw4My4xODU5!5e0!3m2!1sen!2sin!4v1635000000000!5m2!1sen!2sin',
          contactNumber: '+91 7982303199',
          email: 'sales@it-wala.com',
          timings: 'Mon-Sat: 9:30 AM - 6:30 PM',
          facilities: [],
        },
      ],
    },
  });

  // ═══════════════════════════════════════════════════════════════
  //  EXECUTE UPSERT
  // ═══════════════════════════════════════════════════════════════

  const results: { name: string; status: string }[] = [];
  let errorCount = 0;

  for (const section of sections) {
    // Check if row exists first
    const { data: existing } = await supabase
      .from('content_sections')
      .select('id')
      .eq('name', section.name)
      .single();

    let result;
    if (existing) {
      // Update existing row
      result = await supabase
        .from('content_sections')
        .update({
          content: JSON.stringify(section.content),
          updated_at: new Date().toISOString(),
        })
        .eq('name', section.name);
    } else {
      // Insert new row
      result = await supabase
        .from('content_sections')
        .insert({
          name: section.name,
          content: JSON.stringify(section.content),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
    }

    if (result.error) {
      errorCount++;
      results.push({ name: section.name, status: `ERROR: ${result.error.message}` });
    } else {
      results.push({ name: section.name, status: existing ? 'UPDATED' : 'INSERTED' });
    }
  }

  return res.status(200).json({
    message: `Seeded ${sections.length} sections. ${errorCount} errors.`,
    totalSections: sections.length,
    errors: errorCount,
    results,
  });
}
