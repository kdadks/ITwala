import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-primary-700 via-primary-600 to-secondary-700 text-white relative">
      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Scroll to top"
        >
          <FaArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Top Section - Company Info and Contact */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
          {/* Company Info */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/images/IT-WALA-logo-48x48.png"
                alt="ITwala Academy Logo"
                width={48}
                height={48}
                className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
              />
              <div>
                <span className="text-xl font-bold text-white">ITwala</span>
                <p className="text-sm text-white font-medium">IT- It's Simple</p>
              </div>
            </Link>
            
            <p className="text-white text-sm max-w-md">
              Empowering professionals with cutting-edge AI and technology skills through comprehensive courses and expert consulting.
            </p>
          </div>

          {/* Contact & Social */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-4 text-sm">
              <a
                href="mailto:sales@it-wala.com"
                className="flex items-center space-x-2 text-white hover:text-white transition-colors duration-200"
              >
                <FaEnvelope className="w-4 h-4" />
                <span>sales@it-wala.com</span>
              </a>

              <a
                href="tel:+917982303199"
                className="flex items-center space-x-2 text-white hover:text-white transition-colors duration-200"
              >
                <FaPhone className="w-4 h-4" />
                <span>+91 79823 03199</span>
              </a>
            </div>

            <a
              href="https://www.linkedin.com/company/it-wala.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-primary-800 hover:bg-primary-900 p-2 rounded-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-400"
              aria-label="Follow us on LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              Quick Links
            </h3>
            <nav className="space-y-2">
              <Link href="/academy" className="block text-white hover:text-white transition-colors text-sm">
                Academy
              </Link>
              <Link href="/courses" className="block text-white hover:text-white transition-colors text-sm">
                All Courses
              </Link>
              <Link href="/ai-education-guide" className="block text-white hover:text-white transition-colors text-sm">
                AI Education Guide
              </Link>
              <Link href="/resources" className="block text-white hover:text-white transition-colors text-sm">
                Learning Resources
              </Link>
              <Link href="/about" className="block text-white hover:text-white transition-colors text-sm">
                About Us
              </Link>
            </nav>
          </div>

          {/* AI Courses */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              AI Courses
            </h3>
            <nav className="space-y-2">
              <Link href="/courses/ai-machine-learning-fundamentals" className="block text-white hover:text-white transition-colors text-sm">
                AI & ML Fundamentals
              </Link>
              <Link href="/courses?category=Artificial Intelligence" className="block text-white hover:text-white transition-colors text-sm">
                AI Courses
              </Link>
              <Link href="/courses?category=Machine Learning" className="block text-white hover:text-white transition-colors text-sm">
                ML Training
              </Link>
              <Link href="/courses?category=Data Science" className="block text-white hover:text-white transition-colors text-sm">
                Data Science
              </Link>
              <Link href="/courses?level=Beginner" className="block text-white hover:text-white transition-colors text-sm">
                Beginner Courses
              </Link>
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              Services
            </h3>
            <nav className="space-y-2">
              <Link href="/consulting" className="block text-white hover:text-white transition-colors text-sm">
                Consulting
              </Link>
              <Link href="/services/ai-solutions" className="block text-white hover:text-white transition-colors text-sm">
                AI Solutions
              </Link>
              <Link href="/services/digital-transformation" className="block text-white hover:text-white transition-colors text-sm">
                Digital Transform
              </Link>
              <Link href="/services/technical-consulting" className="block text-white hover:text-white transition-colors text-sm">
                Tech Consulting
              </Link>
              <Link href="/services/training-development" className="block text-white hover:text-white transition-colors text-sm">
                Corporate Training
              </Link>
            </nav>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              Support
            </h3>
            <nav className="space-y-2">
              <Link href="/contact" className="block text-white hover:text-white transition-colors text-sm">
                Contact Us
              </Link>
              <Link href="/academy#faq" className="block text-white hover:text-white transition-colors text-sm">
                FAQ
              </Link>
              <Link href="/academy#career-support" className="block text-white hover:text-white transition-colors text-sm">
                Career Support
              </Link>
              <Link href="/privacy-policy" className="block text-white hover:text-white transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="block text-white hover:text-white transition-colors text-sm">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white text-xs text-center md:text-left">
            &copy; {currentYear} kdadks service private ltd. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
            <Link href="/privacy-policy" className="text-white hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-white hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="text-white hover:text-white transition-colors">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
