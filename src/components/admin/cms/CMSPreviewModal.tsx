import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Smartphone, Globe, ArrowRight, CheckCircle2, HelpCircle, GraduationCap, Briefcase, Home, Folder, Phone, Info } from 'lucide-react';
import { FaLinkedin, FaEnvelope, FaPhone } from 'react-icons/fa';
import { HeroData } from './CMSHeroEditor';
import { SEOData } from './CMSSEOEditor';
import { ArrayItem } from './CMSArrayEditor';

interface CMSPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageTitle: string;
  pagePath: string;
  hero: HeroData;
  cta?: any;
  stats?: ArrayItem[];
  features?: ArrayItem[];
  faqs?: ArrayItem[];
  seo: SEOData;
  serviceShowcase?: any;
  testimonials?: any;
  headerFooter?: any;
}

const PreviewNavLink = ({ label, href, active }: { label: string; href: string; active: boolean }) => (
  <span
    className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
      active
        ? 'bg-white/20 text-white'
        : 'text-white/80 hover:text-white hover:bg-white/10'
    }`}
  >
    {label}
  </span>
);

export const CMSPreviewModal: React.FC<CMSPreviewModalProps> = ({
  isOpen,
  onClose,
  pageTitle,
  pagePath,
  hero,
  cta,
  stats = [],
  features = [],
  faqs = [],
  seo,
  serviceShowcase,
  testimonials,
  headerFooter,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile' | 'seo'>('desktop');

  if (!isOpen) return null;

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Academy', href: '/academy' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Product & Consulting', href: '/consulting' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ];

  const currentYear = new Date().getFullYear();

  return (
    <AnimatePresence>
      {/* Outer overlay — scrollable, flex column to center modal vertically */}
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-4 px-3 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 20 }}
          className="bg-gray-100 rounded-3xl shadow-2xl w-full max-w-6xl flex flex-col border border-gray-300 my-auto"
          style={{ minHeight: '85vh' }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── Top Control Bar ── */}
          <div className="bg-white border-b border-gray-200 px-5 py-3.5 flex items-center justify-between flex-wrap gap-3 rounded-t-3xl sticky top-0 z-10 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-600 text-white flex items-center justify-center font-extrabold text-xs shadow-md">
                IT
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900">
                  Preview: <span className="text-primary-600">{pageTitle}</span>
                </h3>
                <span className="text-xs text-gray-400 font-mono">https://it-wala.com{pagePath}</span>
              </div>
            </div>

            {/* Viewport Toggles */}
            <div className="flex items-center bg-gray-100 p-1 rounded-xl border border-gray-200">
              {[
                { key: 'desktop' as const, icon: Monitor, label: 'Desktop' },
                { key: 'mobile' as const, icon: Smartphone, label: 'Mobile' },
                { key: 'seo' as const, icon: Globe, label: 'SEO Preview' },
              ].map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setDeviceMode(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    deviceMode === key
                      ? 'bg-white text-primary-600 shadow-sm'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ── Modal Body ── */}
          <div className="flex-1 p-4 sm:p-6 flex justify-center bg-gray-100">
            {deviceMode === 'seo' ? (
              /* SEO Preview */
              <div className="w-full max-w-2xl space-y-6">
                {/* Google SERP snippet */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Google Search Result Snippet
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl space-y-1.5 border border-gray-100 font-sans">
                    <div className="text-xs text-emerald-700 font-mono">https://it-wala.com{pagePath}</div>
                    <div className="text-lg text-blue-700 font-medium hover:underline truncate">
                      {seo?.metaTitle || hero.title}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                      {seo?.metaDescription || hero.subtitle}
                    </div>
                  </div>
                </div>

                {/* Social card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                  <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Social Card (LinkedIn / Twitter / Facebook)
                  </div>
                  <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
                    <div className="h-44 bg-gradient-to-br from-primary-600 to-secondary-700 flex items-center justify-center relative">
                      {seo?.ogImage ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={seo.ogImage} alt="OG Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-white/60 gap-2">
                          <Globe className="w-10 h-10" />
                          <span className="text-xs font-medium">Set OG image in SEO tab</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4 space-y-1 bg-white">
                      <div className="text-xs text-gray-400 uppercase font-mono">it-wala.com</div>
                      <div className="text-base font-bold text-gray-900 truncate">
                        {seo?.metaTitle || hero.title}
                      </div>
                      <div className="text-xs text-gray-600 line-clamp-2">
                        {seo?.metaDescription || hero.subtitle}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Keywords */}
                {seo?.keywords && (
                  <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Target Keywords</div>
                    <div className="flex flex-wrap gap-2">
                      {seo.keywords.split(',').map((kw, i) => (
                        <span key={i} className="px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full border border-primary-100">
                          {kw.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Full Page Mockup */
              <div
                className={`transition-all duration-300 bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-200 flex flex-col ${
                  deviceMode === 'mobile' ? 'w-[385px]' : 'w-full max-w-5xl'
                }`}
                style={{ minHeight: '600px' }}
              >
                {/* ── Announcement Bar (rendered ONLY if enabled in CMS) ── */}
                {headerFooter?.header?.showAnnouncement && (
                  <div className="bg-gradient-to-r from-accent-600 via-accent-500 to-amber-500 text-white text-[10px] font-semibold py-1.5 px-4 text-center">
                    {headerFooter.header.announcementText || '⚡ New AI Crash Course Started! Enrol now for expert-led training'}{' '}
                    <span className="underline font-bold">{headerFooter.header.announcementCta || 'Enroll Now →'}</span>
                  </div>
                )}

                {/* ── Header (matches GlossyNavbar exactly) ── */}
                <div className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 px-4 pt-3 pb-2">
                  <div
                    className="rounded-2xl px-4 py-3 flex items-center justify-between gap-3"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.75) 0%, rgba(249,250,251,0.70) 50%, rgba(255,255,255,0.75) 100%)',
                      border: '1px solid rgba(255,255,255,0.5)',
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    {/* Logo + Brand */}
                    <div className="flex items-center gap-2.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/images/IT-WALA-logo-64x64.png"
                        alt="ITwala"
                        className="h-8 w-8 object-contain rounded-xl"
                      />
                      <div>
                        <div className="text-sm font-extrabold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent leading-tight">
                          ITwala
                        </div>
                        <div className="text-[9px] text-gray-500 font-medium leading-tight">IT- It&apos;s Simple</div>
                      </div>
                    </div>

                    {/* Nav links */}
                    {deviceMode === 'desktop' && (
                      <div className="flex items-center gap-0.5">
                        {navLinks.map((link) => (
                          <PreviewNavLink
                            key={link.href}
                            label={link.label}
                            href={link.href}
                            active={pagePath === link.href || (link.href !== '/' && pagePath.startsWith(link.href))}
                          />
                        ))}
                      </div>
                    )}

                    {/* CTA */}
                    <button className="px-3 py-1.5 text-[10px] font-bold text-white bg-gradient-to-r from-primary-500 to-secondary-600 rounded-xl shadow-md whitespace-nowrap">
                      Contact Us
                    </button>
                  </div>
                </div>

                {/* ── Hero Section Preview ── */}
                <section className="relative overflow-hidden bg-white py-10 px-6 sm:px-10 border-b border-gray-100">
                  <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-primary-500/40 to-transparent" />

                  <div className="relative z-10 max-w-3xl space-y-4">
                    {/* Eyebrow */}
                    <div className="flex items-center gap-3">
                      <div className="h-px w-8 bg-primary-500 shrink-0" />
                      <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-primary-500">
                        {hero.badge || 'ITWala · IT Excellence'}
                      </span>
                    </div>

                    {/* Title */}
                    <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
                      {hero.title || 'Your Page Headline'}
                    </h1>

                    {/* Subtitle */}
                    <div className="flex items-center gap-3">
                      <div className="w-[3px] h-8 bg-accent-500 rounded-full shrink-0" />
                      <p className="text-sm text-gray-600 font-medium leading-relaxed">
                        {hero.subtitle || 'Your section subtitle goes here.'}
                      </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {hero.primaryCtaText && (
                        <span className="inline-flex items-center gap-2 bg-primary-500 text-white h-9 px-5 rounded-lg font-semibold text-xs shadow-md cursor-pointer">
                          {hero.primaryCtaText}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {hero.secondaryCtaText && (
                        <span className="inline-flex items-center gap-1.5 h-9 px-4 rounded-lg text-gray-600 bg-gray-100 text-xs font-medium cursor-pointer">
                          {hero.secondaryCtaText}
                        </span>
                      )}
                    </div>
                  </div>
                </section>

                {/* ── Showcase / "Two Paths to IT Excellence" (if Home page) ── */}
                {pagePath === '/' && (
                  <section className="py-8 px-6 bg-gray-50 border-b border-gray-100">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                        {serviceShowcase?.sectionTitle || 'Two Paths to IT Excellence'}
                      </h2>
                      <p className="text-xs text-gray-600 max-w-xl mx-auto mt-1">
                        {serviceShowcase?.sectionSubtitle || 'Whether you\'re looking to advance your career or transform your business, we have the expertise to guide you to success.'}
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {/* Academy Card */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <div className="font-bold text-gray-900 text-sm">{serviceShowcase?.academy?.title || 'ITWala Academy'}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{serviceShowcase?.academy?.description || 'Master in-demand technologies with our comprehensive courses designed by industry experts.'}</p>
                        <div className="text-xs font-semibold text-accent-600">{serviceShowcase?.academy?.ctaText || 'Explore Academy Courses →'}</div>
                      </div>

                      {/* Consulting Card */}
                      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm space-y-3">
                        <div className="font-bold text-gray-900 text-sm">{serviceShowcase?.consulting?.title || 'ITWala Consulting'}</div>
                        <p className="text-xs text-gray-500 leading-relaxed">{serviceShowcase?.consulting?.description || 'Accelerate your business growth with our expert IT consulting services.'}</p>
                        <div className="text-xs font-semibold text-primary-600">{serviceShowcase?.consulting?.ctaText || 'Explore Consulting Services →'}</div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Stats */}
                {stats.length > 0 && (
                  <section className="px-6 sm:px-10 py-8 bg-gray-50 border-b border-gray-100">
                    <div className={`grid gap-4 ${stats.length <= 3 ? 'grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'}`}>
                      {stats.map((st, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm text-center">
                          <div className="w-5 h-[3px] bg-primary-500 rounded-full mb-2 mx-auto" />
                          <div className="text-xl font-bold text-gray-900 leading-none">{st.value}</div>
                          <div className="text-[10px] uppercase tracking-widest text-gray-400 font-medium mt-1">{st.label}</div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Features / Key Highlights */}
                {features.length > 0 && (
                  <section className="px-6 sm:px-10 py-8 bg-white border-b border-gray-100">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-primary-500">Highlights</span>
                      <h2 className="text-lg font-bold text-gray-900 mt-1">Key Features &amp; Offerings</h2>
                    </div>
                    <div className={`grid gap-4 ${features.length <= 2 ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-3'}`}>
                      {features.map((feat, i) => (
                        <div key={i} className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                          <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
                            <CheckCircle2 className="w-4 h-4" />
                          </div>
                          <h3 className="font-bold text-gray-900 text-xs">{feat.title}</h3>
                          <p className="text-[11px] text-gray-500 leading-relaxed">{feat.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* Testimonials / Client Success Stories */}
                {pagePath === '/' && (
                  <section className="px-6 sm:px-10 py-8 bg-gray-50 border-b border-gray-100">
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center gap-1.5 bg-primary-50 border border-primary-100 text-primary-600 text-[10px] font-semibold uppercase px-3 py-1 rounded-full mb-2">
                        {testimonials?.badge || 'Client Success Stories'}
                      </div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {testimonials?.title || 'What Our Clients & Students Say'}
                      </h2>
                      <p className="text-xs text-gray-500 max-w-xl mx-auto mt-1">
                        {testimonials?.subtitle || 'Real outcomes delivered to enterprise clients and learners across 7+ industries worldwide.'}
                      </p>
                    </div>
                  </section>
                )}

                {/* FAQs */}
                {faqs.length > 0 && (
                  <section className="px-6 sm:px-10 py-8 bg-gray-50 border-b border-gray-100">
                    <div className="text-center mb-6">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500">FAQ</span>
                      <h2 className="text-lg font-bold text-gray-900 mt-1 font-serif">Frequently Asked Questions</h2>
                    </div>
                    <div className="space-y-3 max-w-2xl mx-auto">
                      {faqs.map((faq, i) => (
                        <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-1">
                          <h4 className="font-bold text-gray-900 text-xs flex items-center gap-2">
                            <HelpCircle className="w-3.5 h-3.5 text-primary-500 flex-shrink-0" />
                            {faq.title}
                          </h4>
                          <p className="text-[11px] text-gray-500 pl-5 leading-relaxed">{faq.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* CTA Banner */}
                <section className="px-6 sm:px-10 py-10 bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white text-center space-y-3">
                  <h2 className="text-xl sm:text-2xl font-extrabold font-serif">
                    {cta?.title || 'Ready to Transform Your Career or Business?'}
                  </h2>
                  <p className="text-xs text-primary-100 max-w-lg mx-auto">
                    {cta?.subtitle || 'Join hundreds of successful graduates and partner companies working with ITwala.'}
                  </p>
                  <div className="pt-1">
                    <span className="inline-flex items-center gap-2 bg-white text-primary-600 font-bold text-xs px-5 py-2.5 rounded-xl shadow-lg cursor-pointer">
                      {cta?.buttonText || 'Get Started →'}
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </section>

                {/* ── Footer (matches Footer.tsx EXACTLY) ── */}
                <footer className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white px-6 sm:px-10 py-8">
                  {/* Top Section */}
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src="/images/IT-WALA-logo-48x48.png" alt="ITwala Logo" className="h-9 w-auto object-contain" />
                      <div>
                        <span className="text-lg font-bold text-white">ITwala</span>
                        <p className="text-xs text-white/90 font-medium">IT- It&apos;s Simple</p>
                      </div>
                      <p className="text-xs text-white/80 max-w-xs hidden md:block border-l border-white/20 pl-4 ml-2">
                        {headerFooter?.footer?.aboutText || 'Empowering professionals with cutting-edge AI and technology skills through comprehensive courses and expert consulting.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 text-xs">
                      <span className="flex items-center gap-1.5"><FaEnvelope className="w-3.5 h-3.5" /> {headerFooter?.footer?.contactEmail || 'contact@it-wala.com'}</span>
                      <span className="flex items-center gap-1.5"><FaPhone className="w-3.5 h-3.5" /> {headerFooter?.footer?.contactPhone || '+91 98765 43210'}</span>
                      <span className="bg-primary-800 p-2 rounded-full"><FaLinkedin className="w-4 h-4" /></span>
                    </div>
                  </div>

                  {/* Links Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-6 border-t border-b border-white/20 text-xs">
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">Quick Links</h4>
                      <ul className="space-y-1 text-white/80">
                        <li>Academy</li>
                        <li>All Courses</li>
                        <li>AI Education Guide</li>
                        <li className="text-amber-300 font-semibold">Resources Hub</li>
                        <li>About Us</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">AI Courses</h4>
                      <ul className="space-y-1 text-white/80">
                        <li>AI &amp; ML Fundamentals</li>
                        <li>AI Courses</li>
                        <li>ML Training</li>
                        <li>Data Science</li>
                        <li>Beginner Courses</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">Services</h4>
                      <ul className="space-y-1 text-white/80">
                        <li>Consulting</li>
                        <li>AI Solutions</li>
                        <li>Digital Transform</li>
                        <li>Tech Consulting</li>
                        <li>Corporate Training</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-white uppercase tracking-wider mb-2 text-[11px]">Support</h4>
                      <ul className="space-y-1 text-white/80">
                        <li>Contact Us</li>
                        <li>FAQ</li>
                        <li>Career Support</li>
                        <li>Privacy Policy</li>
                        <li>Terms of Service</li>
                      </ul>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="pt-4 flex flex-col sm:flex-row justify-between items-center text-[11px] text-white/80 gap-2">
                    <span>© {currentYear} kdadks service private ltd. All rights reserved.</span>
                    <div className="flex gap-4">
                      <span>Privacy Policy</span>
                      <span>Terms of Service</span>
                      <span>Sitemap</span>
                    </div>
                  </div>
                </footer>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
