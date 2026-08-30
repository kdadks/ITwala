import { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'react-hot-toast';
import {
  Home, BookOpen, Briefcase, Info, Wrench, PhoneCall,
  FileText, Code, Globe, Save, RefreshCcw, Sparkles, Layers, Eye
} from 'lucide-react';

import { CMSHeroEditor, HeroData } from '@/components/admin/cms/CMSHeroEditor';
import { CMSArrayEditor, ArrayItem } from '@/components/admin/cms/CMSArrayEditor';
import { CMSSEOEditor, SEOData } from '@/components/admin/cms/CMSSEOEditor';
import { CMSHeaderFooterEditor, HeaderFooterData } from '@/components/admin/cms/CMSHeaderFooterEditor';
import { CMSCTAEditor, CTAData } from '@/components/admin/cms/CMSCTAEditor';
import { EmbeddedCoursesCMS } from '@/components/admin/cms/EmbeddedCoursesCMS';
import { EmbeddedPortfolioCMS } from '@/components/admin/cms/EmbeddedPortfolioCMS';
import { CMSPreviewModal } from '@/components/admin/cms/CMSPreviewModal';

interface PageContentData {
  hero: HeroData;
  cta?: CTAData;
  features?: ArrayItem[];
  stats?: ArrayItem[];
  faqs?: ArrayItem[];
  seo: SEOData;
  header_footer?: HeaderFooterData;
  service_showcase?: any;
  testimonials?: any;
}

const DEFAULT_PAGES_DATA: Record<string, PageContentData> = {
  home: {
    hero: {
      badge: 'Education & Consulting · IT Excellence',
      title: 'Your Complete IT Partner',
      subtitle: 'Empowering individuals through world-class education and transforming businesses with expert consulting solutions. Your journey to IT excellence starts here.',
      primaryCtaText: 'Get Free Consultation',
      primaryCtaLink: '/contact',
      secondaryCtaText: 'Learn About Us →',
      secondaryCtaLink: '/about',
      accentColor: 'indigo',
    },
    service_showcase: {
      sectionTitle: 'Two Paths to IT Excellence',
      sectionSubtitle: "Whether you're looking to advance your career or transform your business, we have the expertise to guide you to success.",
      academy: {
        title: 'ITWala Academy',
        tagline: 'Shape Your Career',
        description: "Master in-demand technologies with our comprehensive courses designed by industry experts. From beginner to advanced, we'll guide you every step of the way.",
        ctaText: 'Explore Academy Courses',
        ctaLink: '/academy',
      },
      consulting: {
        title: 'ITWala Consulting',
        tagline: 'Transform Your Business',
        description: "Accelerate your business growth with our expert IT consulting services. From strategy to implementation, we deliver solutions that drive results.",
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
    testimonials: {
      badge: 'Client Success Stories',
      title: 'What Our Clients & Students Say',
      subtitle: 'Real outcomes delivered to enterprise clients and learners across 7+ industries worldwide.',
    },
    cta: {
      badge: '📚 ITWala Academy CTA',
      title: 'Ready to advance your IT career?',
      subtitle: 'Join thousands of students learning in-demand IT skills from industry professionals. Start your journey today with our specialized courses.',
      buttonText: 'Browse All Courses',
      buttonLink: '/courses',
    },
    stats: [
      { value: '500+', label: 'Students Enrolled' },
      { value: '98%', label: 'Satisfaction Rate' },
      { value: '8+', label: 'Batches Delivered' },
    ],
    features: [
      { title: 'Two Paths to IT Excellence', description: 'Whether you\'re looking to advance your career or transform your business, we have the expertise to guide you to success.' },
      { title: 'ITWala Academy', description: 'Master in-demand technologies with our comprehensive courses designed by industry experts. From beginner to advanced, we\'ll guide you every step of the way.' },
      { title: 'ITWala Consulting', description: 'Accelerate your business growth with our expert IT consulting services. From strategy to implementation, we deliver solutions that drive results.' },
    ],
    seo: {
      metaTitle: 'ITWala - Web Development, AI Academy & IT Consulting Globally',
      metaDescription: '#1 Web development company & AI Academy. Free AI education resources plus AI crash courses and full programs for beginners and professionals.',
      keywords: 'web development company, AI education platform, AI academy, coding bootcamp',
    },
  },
  academy: {
    hero: {
      badge: '🎓 ITWala AI Academy · Future-Proof Skills',
      title: 'AI Education, Crash Courses & Professional Training',
      subtitle: 'ITWala AI Academy: free AI education resources, an AI crash course, and full AI/ML training programs for beginners and professionals, with industry experts and hands-on projects.',
      primaryCtaText: 'Explore Courses',
      primaryCtaLink: '/courses',
      secondaryCtaText: 'Free Resources',
      secondaryCtaLink: '/resources',
      accentColor: 'indigo',
    },
    cta: {
      badge: '🚀 Accelerate Your AI Career',
      title: 'Start Learning Artificial Intelligence Today',
      subtitle: 'Hands-on projects, industry certifications, and 1-on-1 mentor guidance.',
      buttonText: 'Enroll in AI Academy',
      buttonLink: '/courses',
    },
    features: [
      { title: 'AI & Machine Learning', description: 'Deep Learning, PyTorch, LLMs, Neural Networks & Agentic AI workflows.' },
      { title: 'Web & Mobile Development', description: 'React, Next.js, Node.js, Python & Full-Stack cloud deployment.' },
      { title: 'Data Science & Analytics', description: 'Python, SQL, Data Engineering, Pandas & Business Intelligence dashboards.' },
      { title: 'Cloud & DevOps', description: 'AWS, Docker, Kubernetes, CI/CD Pipelines & Serverless architecture.' },
    ],
    seo: {
      metaTitle: 'ITWala AI Academy - AI Education, Crash Courses & Training',
      metaDescription: 'ITWala AI Academy - free AI education resources, an AI crash course, and full AI/ML programs for beginners and professionals.',
      keywords: 'AI academy, AI crash course, free AI education, AI courses for beginners, AI courses for professionals',
    },
  },
  courses: {
    hero: {
      badge: 'AI & Machine Learning · Expert-Led Training',
      title: 'AI Courses & ML Training',
      subtitle: 'Master artificial intelligence and machine learning with expert-led courses, hands-on projects, and industry-recognized certifications.',
      primaryCtaText: 'Browse Catalog',
      primaryCtaLink: '#catalog',
      secondaryCtaText: 'Course Guidance',
      secondaryCtaLink: '/contact',
      accentColor: 'indigo',
    },
    faqs: [
      { title: 'Who can enroll in these AI courses?', description: 'Our courses are designed for beginners with no coding background as well as working professionals looking to upskill in AI and Machine Learning.' },
      { title: 'Are these courses live or self-paced?', description: 'We offer flexible learning paths including live interactive weekend/evening cohorts and self-paced practical modules.' },
      { title: 'Do I receive a certificate upon completion?', description: 'Yes, every student receives an industry-recognized ITwala Academy Certificate of Completion after finishing hands-on projects.' },
    ],
    seo: {
      metaTitle: 'AI Courses for Beginners & Professionals - ITwala Academy',
      metaDescription: 'Browse AI courses for beginners and professionals at ITwala Academy. Artificial intelligence, machine learning, and data science training with hands-on projects.',
      keywords: 'AI courses for beginners, AI courses for professionals, machine learning training',
    },
  },
  portfolio: {
    hero: {
      badge: 'Our Work · 50+ Projects Delivered',
      title: 'Our Success Stories',
      subtitle: 'Transforming ideas into digital excellence. Real solutions, real impact across travel, healthcare, e-commerce, and AI.',
      primaryCtaText: 'Featured Projects',
      primaryCtaLink: '#projects',
      secondaryCtaText: 'Hire Our Team',
      secondaryCtaLink: '/consulting',
      accentColor: 'rose',
    },
    stats: [
      { value: '10K+', label: 'Active Users' },
      { value: '95%', label: 'Client Satisfaction' },
      { value: '50+', label: 'Projects Delivered' },
      { value: '7', label: 'Industries Served' },
    ],
    seo: {
      metaTitle: 'Our Portfolio - Successful Projects & Client Success Stories | ITWala',
      metaDescription: 'Explore ITWala portfolio of 50+ successful projects across travel, healthcare, e-commerce, AI, and education.',
      keywords: 'web development portfolio, successful projects, client case studies',
    },
  },
  about: {
    hero: {
      badge: 'Our Story · Mission & Values',
      title: 'About ITwala Academy & Consulting',
      subtitle: 'Empowering businesses and individuals with comprehensive IT education & consulting solutions.',
      primaryCtaText: 'Our Story',
      primaryCtaLink: '#our-story',
      accentColor: 'emerald',
    },
    features: [
      { title: 'Product Development', description: 'End-to-end product development from concept to deployment with market research and go-to-market strategy.' },
      { title: 'AI Solutions', description: 'Cutting-edge AI and machine learning solutions including agentic AI, automation, and intelligent decision-making systems.' },
      { title: 'Digital Transformation', description: 'Comprehensive digital transformation services including cloud migration, process automation, and modernization.' },
    ],
    stats: [
      { value: 'Ireland', label: 'Dublin Hub' },
      { value: 'UK', label: 'London Hub' },
      { value: 'India', label: 'Bengaluru Hub' },
      { value: 'India', label: 'Lucknow Hub' },
    ],
    seo: {
      metaTitle: 'About ITwala Academy - AI Academy & Web Development Experts',
      metaDescription: 'Learn about ITwala Academy mission to provide world-class AI education, web development, and IT consulting services.',
      keywords: 'ITwala Academy, AI academy, AI education, web development, IT consulting, about ITwala',
    },
  },
  services: {
    hero: {
      badge: 'IT Consulting · Digital Transformation',
      title: 'Our Consulting Services',
      subtitle: 'Comprehensive IT solutions to accelerate growth & digital transformation.',
      accentColor: 'indigo',
    },
    stats: [
      { value: '100+', label: 'Successful Projects' },
      { value: '50+', label: 'Expert Consultants' },
      { value: '24/7', label: 'Support & Uptime' },
    ],
    features: [
      { title: 'Product Strategy & Development', description: 'Full-cycle product design, architecture planning, MVP creation, and scalable tech stack implementation.' },
      { title: 'AI Powered Solutions', description: 'Enterprise RAG pipelines, fine-tuned LLMs, autonomous AI agents, and workflow automation.' },
      { title: 'IT Staffing Partner', description: 'Dedicated senior engineers, tech leads, and DevOps engineers integrated into your team.' },
    ],
    seo: {
      metaTitle: 'Web Development & IT Consulting Services - ITwala',
      metaDescription: 'Comprehensive web development and IT consulting services including product development, AI solutions, digital transformation, technical consulting, and IT staffing.',
      keywords: 'web development company, web development services, IT consulting services, product development, AI solutions',
    },
  },
  contact: {
    hero: {
      badge: 'Get In Touch · Support & Enquiries',
      title: 'Contact Our Team',
      subtitle: 'Have questions about our courses or software consulting? Our experts are ready to help.',
      accentColor: 'amber',
    },
    faqs: [
      { title: 'What are the class timings?', description: 'We offer flexible weekday evening and weekend batches for working professionals.' },
      { title: 'Do you offer job placement support?', description: 'We provide dedicated 1-on-1 placement support, resume optimization, and referral networks.' },
      { title: 'Can beginners join the courses?', description: 'Yes! We have beginner-friendly foundation modules that guide you step-by-step.' },
    ],
    seo: {
      metaTitle: 'Contact ITwala - AI Academy & Web Development Consulting',
      metaDescription: 'Get in touch with ITwala for AI education support, AI course guidance, web development, and IT consulting services.',
      keywords: 'contact ITwala, AI academy support, AI course guidance, web development consulting',
    },
  },
  resources: {
    hero: {
      badge: 'AI Learning · Free Guides & Architecture Roadmaps',
      title: 'AI & Tech Resources Hub',
      subtitle: 'Accelerate your business & career with 20+ AEO guides, AI engineering roadmaps & startup frameworks.',
      accentColor: 'blue',
    },
    features: [
      { title: 'Agentic AI Architecture', description: 'Deep dive into multi-agent systems, tool use, and memory retention patterns.' },
      { title: 'Model Context Protocol (MCP)', description: 'Standardizing context injection and tool calling across client application boundaries.' },
      { title: 'RAG vs Fine-Tuning Guide', description: 'Choosing the right enterprise LLM architecture for your domain knowledge base.' },
    ],
    seo: {
      metaTitle: 'AI & Tech Resources Hub - Guides, AEO Insights & Engineering Roadmaps',
      metaDescription: 'Explore 20+ free comprehensive AI guides, business automation strategies, architecture deep dives, career roadmaps, and MVP development frameworks.',
      keywords: 'AI resources, agentic AI guide, model context protocol, RAG vs fine-tuning, AI engineer roadmap',
    },
  },
  consulting: {
    hero: {
      badge: 'IT Consulting · Digital Transformation',
      title: 'ITWala Product & Consulting',
      subtitle: 'Transform Your Business · Expert IT Solutions',
      primaryCtaText: 'View Services',
      primaryCtaLink: '#services',
      secondaryCtaText: 'Our Portfolio',
      secondaryCtaLink: '/portfolio',
      accentColor: 'indigo',
    },
    stats: [
      { value: '20+', label: 'Projects Delivered' },
      { value: '50+', label: 'Expert Consultants' },
      { value: '25+', label: 'Countries Served' },
      { value: '98%', label: 'Client Satisfaction' },
      { value: '10+', label: 'Years Experience' },
      { value: '95%', label: 'Client Retention Rate' },
    ],
    features: [
      { title: 'Proven Expertise', description: 'Over 10 years of experience delivering successful IT solutions across diverse industries with a track record of 20+ completed projects.' },
      { title: 'Rapid Delivery', description: 'Agile methodologies and efficient processes ensure faster time-to-market without compromising on quality or functionality.' },
      { title: 'Enterprise Security', description: 'Industry-leading security practices and compliance standards to protect your data and ensure regulatory adherence.' },
      { title: 'Long-term Partnership', description: 'We build lasting relationships with our clients, providing ongoing support and evolving solutions as your business grows.' },
      { title: 'Scalable Solutions', description: 'Future-proof architectures designed to scale with your business needs, from startup to enterprise level.' },
      { title: 'Global Reach', description: 'International experience with local expertise, serving clients across multiple time zones and cultural contexts.' },
    ],
    cta: {
      badge: '🤝 Partner with ITWala',
      title: 'Ready to Transform Your Business?',
      subtitle: 'From strategic planning to implementation, we deliver comprehensive IT solutions that drive growth and digital transformation.',
      buttonText: 'Schedule Free Consultation',
      buttonLink: '/contact',
    },
    seo: {
      metaTitle: 'ITWala Consulting - Expert IT Solutions & Digital Transformation',
      metaDescription: 'ITWala Consulting offers comprehensive IT solutions including AI implementation, digital transformation, technical consulting, and product development.',
      keywords: 'IT consulting, product strategy, digital transformation, AI solutions, technical consulting',
    },
  },
  global_header_footer: {
    hero: {
      badge: '⚙️ Global Header & Footer Settings',
      title: 'Site Navigation, Announcement Bar & Footer',
      subtitle: 'Manage global header announcement banners, hotline phones, support emails, address, copyright notes, and social profiles.',
    },
    header_footer: {
      header: {
        showAnnouncement: true,
        announcementText: '⚡ New AI Crash Course Started! Enrol now for expert-led training',
        announcementLink: '/courses',
        announcementCta: 'Enroll Now →',
        brandName: 'ITwala',
        brandTagline: "IT - It's Simple",
        phoneHotline: '+91 98765 43210',
        primaryCtaText: 'Contact Us',
        primaryCtaLink: '/contact',
      },
      footer: {
        aboutText: 'Empowering professionals with cutting-edge AI and technology skills through comprehensive courses and expert consulting.',
        contactEmail: 'contact@it-wala.com',
        contactPhone: '+91 98765 43210',
        address: 'Varanasi, Eastern UP, India',
        copyrightText: '© 2026 ITwala. All rights reserved.',
        linkedinUrl: 'https://linkedin.com',
        twitterUrl: 'https://twitter.com',
        githubUrl: 'https://github.com',
        instagramUrl: 'https://instagram.com',
      },
    },
    seo: {
      metaTitle: 'ITwala - Global Brand & Settings',
      metaDescription: 'Global header and footer configuration for ITwala website.',
      keywords: 'global settings, header, footer',
    },
  },
};

const PAGES_CONFIG = [
  { id: 'global_header_footer', label: 'Header & Footer', icon: Globe, path: 'Global' },
  { id: 'home', label: 'Home Page', icon: Home, path: '/' },
  { id: 'academy', label: 'Academy Page', icon: Sparkles, path: '/academy' },
  { id: 'courses', label: 'Courses Page', icon: BookOpen, path: '/courses', hasCatalog: true },
  { id: 'portfolio', label: 'Portfolio Page', icon: Briefcase, path: '/portfolio', hasCatalog: true },
  { id: 'about', label: 'About Us', icon: Info, path: '/about' },
  { id: 'services', label: 'Services Page', icon: Wrench, path: '/services' },
  { id: 'contact', label: 'Contact Us', icon: PhoneCall, path: '/contact' },
  { id: 'resources', label: 'Resources / Blog', icon: FileText, path: '/resources' },
  { id: 'consulting', label: 'Product & Consulting', icon: Code, path: '/consulting' },
];

const ContentManagementPage: NextPage = () => {
  const router = useRouter();
  const { user, isAdmin, isLoading: authLoading } = useAuth();
  const supabase = useSupabaseClient();

  const [activePageId, setActivePageId] = useState<string>('home');
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'catalog'>('content');
  const [pagesState, setPagesState] = useState<Record<string, PageContentData>>(DEFAULT_PAGES_DATA);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Fetch content from Supabase
  const fetchAllContent = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('content_sections')
        .select('*');

      if (error) throw error;

      if (data && data.length > 0) {
        const updated = { ...DEFAULT_PAGES_DATA };
        data.forEach((row) => {
          try {
            const parsed = typeof row.content === 'string' ? JSON.parse(row.content) : row.content;
            if (row.name.startsWith('page_')) {
              const parts = row.name.split('_');
              const pageKey = parts[1];
              const sectionType = parts.slice(2).join('_');

              if (!updated[pageKey]) {
                (updated as any)[pageKey] = {};
              }
              if (sectionType === 'hero') updated[pageKey].hero = { ...updated[pageKey].hero, ...parsed };
              else if (sectionType === 'seo') updated[pageKey].seo = { ...updated[pageKey].seo, ...parsed };
              else if (sectionType === 'header') updated[pageKey].header_footer = { ...updated[pageKey].header_footer, header: parsed };
              else if (sectionType === 'footer') updated[pageKey].header_footer = { ...updated[pageKey].header_footer, footer: parsed };
              else (updated[pageKey] as any)[sectionType] = parsed;
            }
          } catch (e) {
            // Ignore JSON parse errors for raw text
          }
        });
        setPagesState(updated);
      }
    } catch (error: any) {
      console.warn('Using default page schemas:', error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/admin/login');
      return;
    }
    if (!isAdmin) {
      toast.error('You do not have permission to access this page');
      router.push('/dashboard');
      return;
    }

    fetchAllContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin, authLoading]);

  // Handle saving the current page content
  const handleSavePage = async () => {
    setIsSaving(true);
    try {
      const pageData = pagesState[activePageId];
      if (!pageData) return;

      const entries: { name: string; content: string }[] = [];
      for (const [key, value] of Object.entries(pageData)) {
        if (value !== undefined && value !== null) {
          if (key === 'header_footer') {
            if ((value as any).header) entries.push({ name: `page_${activePageId}_header`, content: JSON.stringify((value as any).header) });
            if ((value as any).footer) entries.push({ name: `page_${activePageId}_footer`, content: JSON.stringify((value as any).footer) });
          } else {
            entries.push({ name: `page_${activePageId}_${key}`, content: JSON.stringify(value) });
          }
        }
      }

      for (const entry of entries) {
        const { data: existing } = await supabase
          .from('content_sections')
          .select('id')
          .eq('name', entry.name)
          .single();

        if (existing) {
          await supabase
            .from('content_sections')
            .update({ content: entry.content, updated_at: new Date().toISOString() })
            .eq('id', existing.id);
        } else {
          await supabase
            .from('content_sections')
            .insert([{ name: entry.name, content: entry.content }]);
        }
      }

      if (activePageId === 'portfolio') {
        try {
          await fetch('/api/admin/portfolio-settings', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              page_title: pageData.hero.title,
              page_subtitle: pageData.hero.subtitle,
              tagline: pageData.hero.badge || 'trusted by businesses',
              breadcrumb_label: 'Our Work · Projects Delivered',
              metrics: pageData.stats || [],
            }),
          });
        } catch (e) {
          // Sync warning swallow
        }
      }

      toast.success(`${currentPageConfig?.label} content updated live!`);
    } catch (error: any) {
      console.error('Error saving content:', error);
      toast.error(error.message || 'Error saving page content');
    } finally {
      setIsSaving(false);
    }
  };

  const currentPageConfig = PAGES_CONFIG.find(p => p.id === activePageId);
  const currentPageData = pagesState[activePageId] || DEFAULT_PAGES_DATA.home;

  const updatePageHero = (updatedHero: HeroData) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], hero: updatedHero },
    }));
  };

  const updatePageServiceShowcase = (updated: any) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], service_showcase: updated },
    }));
  };

  const updatePageTestimonials = (updated: any) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], testimonials: updated },
    }));
  };

  const updatePageStats = (updatedStats: ArrayItem[]) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], stats: updatedStats },
    }));
  };

  const updatePageFeatures = (updatedFeatures: ArrayItem[]) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], features: updatedFeatures },
    }));
  };

  const updatePageFaqs = (updatedFaqs: ArrayItem[]) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], faqs: updatedFaqs },
    }));
  };

  const updatePageCTA = (updatedCTA: CTAData) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], cta: updatedCTA },
    }));
  };

  const updateHeaderFooter = (updatedHF: HeaderFooterData) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], header_footer: updatedHF },
    }));
  };

  const updatePageSeo = (updatedSeo: SEOData) => {
    setPagesState(prev => ({
      ...prev,
      [activePageId]: { ...prev[activePageId], seo: updatedSeo },
    }));
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-600">Loading Page CMS Hub...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <>
      <Head>
        <title>Full Page Content Management System - ITwala Admin</title>
        <meta name="description" content="Manage all page contents, headers, SEO, courses, and portfolio items." />
      </Head>

      <main className="flex-1 overflow-y-auto bg-gray-50 min-h-screen p-6 font-sans">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header Banner - ITWala Project Style Theme */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden">
            <div className="absolute inset-0 mesh-gradient opacity-40 pointer-events-none" />
            <div className="relative z-10">
              <div className="flex items-center gap-2">
                <span className="badge badge-primary flex items-center gap-1.5 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Full Page CMS Control Panel
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-2 font-serif">
                Dynamic Page Content &amp; <span className="text-gradient">SEO Management</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Customize titles, hero sections, copy, list items, SEO metadata, and embedded catalogs for the live website.
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="btn btn-outline text-xs"
              >
                <Eye className="w-4 h-4 mr-1.5" />
                Live Page Preview Modal
              </button>
              <button
                type="button"
                onClick={fetchAllContent}
                className="px-3.5 py-2.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <RefreshCcw className="w-3.5 h-3.5" /> Reset
              </button>
              <button
                type="button"
                onClick={handleSavePage}
                disabled={isSaving}
                className="btn btn-primary text-xs disabled:opacity-50"
              >
                {isSaving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                Save {currentPageConfig?.label} Content
              </button>
            </div>
          </div>

          {/* Master CMS Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Page Selector Navigation Sidebar */}
            <div className="lg:col-span-3 space-y-2">
              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-sm space-y-1">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 px-3 py-2">
                  Select Page to Edit
                </div>

                {PAGES_CONFIG.map((page) => {
                  const Icon = page.icon;
                  const isActive = activePageId === page.id;

                  return (
                    <button
                      key={page.id}
                      type="button"
                      onClick={() => {
                        setActivePageId(page.id);
                        setActiveSubTab('content');
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20'
                          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-400'}`} />
                        <span className="truncate">{page.label}</span>
                      </div>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {page.path}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Main Editor Workspace Area */}
            <div className="lg:col-span-9 space-y-6">
              {/* Sub-tabs for Catalogs (Courses & Portfolio) */}
              {currentPageConfig?.hasCatalog && (
                <div className="flex border-b border-gray-200 bg-white px-6 py-2.5 rounded-3xl shadow-sm gap-4">
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('content')}
                    className={`py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                      activeSubTab === 'content'
                        ? 'bg-primary-50 text-primary-600 border border-primary-200 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5" />
                    Page Header &amp; Hero Content
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('catalog')}
                    className={`py-2 px-4 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                      activeSubTab === 'catalog'
                        ? 'bg-primary-50 text-primary-600 border border-primary-200 shadow-sm'
                        : 'text-gray-500 hover:text-gray-800'
                    }`}
                  >
                    {activePageId === 'courses' ? <BookOpen className="w-3.5 h-3.5" /> : <Briefcase className="w-3.5 h-3.5" />}
                    Manage {activePageId === 'courses' ? 'Courses Catalog' : 'Portfolio Showcase'}
                  </button>
                </div>
              )}

              {/* Sub-tab 2: Embedded Catalogs View */}
              {currentPageConfig?.hasCatalog && activeSubTab === 'catalog' ? (
                <div>
                  {activePageId === 'courses' && <EmbeddedCoursesCMS />}
                  {activePageId === 'portfolio' && <EmbeddedPortfolioCMS />}
                </div>
              ) : (
                /* Sub-tab 1: Page Content & SEO View */
                <div className="space-y-6">
                  {/* Hero Section Editor */}
                  <CMSHeroEditor
                    data={currentPageData.hero}
                    onChange={updatePageHero}
                    pageName={currentPageConfig?.label || activePageId}
                    onOpenPreview={() => setIsPreviewOpen(true)}
                  />

                  {/* Home Page: Academy & Consulting Card Editor */}
                  {activePageId === 'home' && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <span className="w-4 h-4 text-primary-500">🏠</span>
                          Home Page — Academy &amp; Consulting Cards (Right Panel)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Edit the two service cards shown on the right side of the home page hero section.
                        </p>
                      </div>

                      {/* Academy Card */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-primary-50 rounded-2xl border border-primary-100">
                        <div className="md:col-span-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-primary-600">📚 Academy Card</span>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Card Title</label>
                          <input
                            type="text"
                            value={(currentPageData.hero as any)?.academyTitle || 'ITWala Academy'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, academyTitle: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">CTA Button Text</label>
                          <input
                            type="text"
                            value={(currentPageData.hero as any)?.academyCtaText || 'Explore Academy'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, academyCtaText: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">CTA Link</label>
                          <input
                            type="text"
                            value={(currentPageData.hero as any)?.academyCtaLink || '/academy'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, academyCtaLink: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                          <input
                            type="text"
                            value={Array.isArray((currentPageData.hero as any)?.academyTags) ? (currentPageData.hero as any).academyTags.join(', ') : '500+ Students, 8+ Courses, 80% Job Placement, 20+ Tracks'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, academyTags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="500+ Students, 8+ Courses"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                          <textarea
                            rows={2}
                            value={(currentPageData.hero as any)?.academyDescription || ''}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, academyDescription: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Academy card description text..."
                          />
                        </div>
                      </div>

                      {/* Consulting Card */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent-50 rounded-2xl border border-accent-100">
                        <div className="md:col-span-2">
                          <span className="text-xs font-bold uppercase tracking-wider text-accent-600">💡 Consulting Card</span>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Card Title</label>
                          <input
                            type="text"
                            value={(currentPageData.hero as any)?.consultingTitle || 'ITWala Consulting'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, consultingTitle: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">CTA Button Text</label>
                          <input
                            type="text"
                            value={(currentPageData.hero as any)?.consultingCtaText || 'Explore Consulting'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, consultingCtaText: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">CTA Link</label>
                          <input
                            type="text"
                            value={(currentPageData.hero as any)?.consultingCtaLink || '/consulting'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, consultingCtaLink: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Tags (comma-separated)</label>
                          <input
                            type="text"
                            value={Array.isArray((currentPageData.hero as any)?.consultingTags) ? (currentPageData.hero as any).consultingTags.join(', ') : '20+ Projects, 50+ Consultants, 24/7 Support, 98% Satisfaction'}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, consultingTags: e.target.value.split(',').map((t: string) => t.trim()).filter(Boolean) } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="20+ Projects, 50+ Consultants"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Description</label>
                          <textarea
                            rows={2}
                            value={(currentPageData.hero as any)?.consultingDescription || ''}
                            onChange={(e) => updatePageHero({ ...currentPageData.hero, consultingDescription: e.target.value } as any)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            placeholder="Consulting card description text..."
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Home Page: "Two Paths to IT Excellence" (Service Showcase) Editor */}
                  {activePageId === 'home' && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-accent-500" />
                          Home Page — &quot;Two Paths to IT Excellence&quot; Section (Service Showcase)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Edit the title, subtitle, Academy offering box, Consulting offering box, and CTA banner in the Showcase section.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Section Title</label>
                          <input
                            type="text"
                            value={(currentPageData as any)?.service_showcase?.sectionTitle || 'Two Paths to IT Excellence'}
                            onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, sectionTitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Section Subtitle</label>
                          <input
                            type="text"
                            value={(currentPageData as any)?.service_showcase?.sectionSubtitle || ''}
                            onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, sectionSubtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                          />
                        </div>
                      </div>

                      {/* Academy Showcase Box */}
                      <div className="p-4 bg-accent-50 rounded-2xl border border-accent-100 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-accent-600">🎓 Academy Path Box</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={(currentPageData as any)?.service_showcase?.academy?.title || 'ITWala Academy'}
                              onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, academy: { ...((currentPageData as any).service_showcase?.academy || {}), title: e.target.value } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                            <input
                              type="text"
                              value={(currentPageData as any)?.service_showcase?.academy?.tagline || 'Shape Your Career'}
                              onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, academy: { ...((currentPageData as any).service_showcase?.academy || {}), tagline: e.target.value } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={(currentPageData as any)?.service_showcase?.academy?.description || ''}
                            onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, academy: { ...((currentPageData as any).service_showcase?.academy || {}), description: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      {/* Consulting Showcase Box */}
                      <div className="p-4 bg-primary-50 rounded-2xl border border-primary-100 space-y-3">
                        <span className="text-xs font-bold uppercase tracking-wider text-primary-600">💡 Consulting Path Box</span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Title</label>
                            <input
                              type="text"
                              value={(currentPageData as any)?.service_showcase?.consulting?.title || 'ITWala Consulting'}
                              onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, consulting: { ...((currentPageData as any).service_showcase?.consulting || {}), title: e.target.value } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Tagline</label>
                            <input
                              type="text"
                              value={(currentPageData as any)?.service_showcase?.consulting?.tagline || 'Transform Your Business'}
                              onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, consulting: { ...((currentPageData as any).service_showcase?.consulting || {}), tagline: e.target.value } })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-700 mb-1">Description</label>
                          <textarea
                            rows={2}
                            value={(currentPageData as any)?.service_showcase?.consulting?.description || ''}
                            onChange={(e) => updatePageServiceShowcase({ ...(currentPageData as any).service_showcase, consulting: { ...((currentPageData as any).service_showcase?.consulting || {}), description: e.target.value } })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Home Page: "Client Success Stories" (Testimonials Header) Editor */}
                  {activePageId === 'home' && (
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
                      <div className="border-b border-gray-100 pb-4">
                        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-purple-500" />
                          Home Page — &quot;Client Success Stories&quot; Section (Testimonials Header)
                        </h3>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Edit the section badge, headline, and subtitle for the Client Success Stories marquee section.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Badge</label>
                          <input
                            type="text"
                            value={(currentPageData as any)?.testimonials?.badge || 'Client Success Stories'}
                            onChange={(e) => updatePageTestimonials({ ...(currentPageData as any).testimonials, badge: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Section Title</label>
                          <input
                            type="text"
                            value={(currentPageData as any)?.testimonials?.title || 'What Our Clients & Students Say'}
                            onChange={(e) => updatePageTestimonials({ ...(currentPageData as any).testimonials, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs font-bold"
                          />
                        </div>
                        <div className="sm:col-span-3">
                          <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Section Subtitle</label>
                          <input
                            type="text"
                            value={(currentPageData as any)?.testimonials?.subtitle || 'Real outcomes delivered to enterprise clients and learners across 7+ industries worldwide.'}
                            onChange={(e) => updatePageTestimonials({ ...(currentPageData as any).testimonials, subtitle: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Header & Footer Editor for global_header_footer */}
                  {activePageId === 'global_header_footer' && (
                    <CMSHeaderFooterEditor
                      data={currentPageData.header_footer || {}}
                      onChange={updateHeaderFooter}
                    />
                  )}

                  {/* Optional Call-To-Action (CTA) Banner Editor */}
                  {activePageId !== 'global_header_footer' && (
                    <CMSCTAEditor
                      data={currentPageData.cta || {
                        title: 'Ready to Transform Your Skills or Business?',
                        subtitle: 'Join 10,000+ graduates and leading enterprises working with ITwala.',
                        buttonText: 'Get Started Today',
                        buttonLink: '/contact',
                      }}
                      onChange={updatePageCTA}
                    />
                  )}

                  {/* Optional Stats Counters Editor - always visible */}
                  <CMSArrayEditor
                    title="Key Metrics & Stat Counters"
                    items={currentPageData.stats || []}
                    onChange={updatePageStats}
                    itemType="stat"
                  />

                  {/* Optional Features List Editor - always visible */}
                  <CMSArrayEditor
                    title="Page Highlights & Feature Cards"
                    items={currentPageData.features || []}
                    onChange={updatePageFeatures}
                    itemType="feature"
                  />

                  {/* Optional FAQs Editor - always visible */}
                  <CMSArrayEditor
                    title="Frequently Asked Questions (FAQ)"
                    items={currentPageData.faqs || []}
                    onChange={updatePageFaqs}
                    itemType="faq"
                  />

                  {/* SEO & Search Metadata Editor */}
                  <CMSSEOEditor
                    data={currentPageData.seo}
                    onChange={updatePageSeo}
                    pagePath={currentPageConfig?.path || '/'}
                    onOpenPreview={() => setIsPreviewOpen(true)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Live Modal Preview Window */}
        <CMSPreviewModal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          pageTitle={currentPageConfig?.label || activePageId}
          pagePath={currentPageConfig?.path || '/'}
          hero={currentPageData.hero}
          cta={currentPageData.cta}
          stats={currentPageData.stats}
          features={currentPageData.features}
          faqs={currentPageData.faqs}
          seo={currentPageData.seo}
          serviceShowcase={(currentPageData as any)?.service_showcase}
          testimonials={(currentPageData as any)?.testimonials}
          headerFooter={pagesState.global_header_footer}
        />
      </main>
    </>
  );
};

export async function getServerSideProps() {
  return {
    props: {},
  };
}

export default ContentManagementPage;
