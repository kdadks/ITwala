import Link from 'next/link';
import Image from 'next/image';
import { FaLinkedin, FaEnvelope, FaPhone, FaArrowUp } from 'react-icons/fa';
import { useState, useEffect } from 'react';

interface Category {
  name: string;
  slug: string;
}

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch categories from the database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/courses/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to static categories if API fails
        setCategories([
          { name: 'Artificial Intelligence', slug: 'Artificial Intelligence' },
          { name: 'Product Management', slug: 'Product Management' },
          { name: 'Software Development', slug: 'Software Development' },
          { name: 'Software Testing', slug: 'Software Testing' }
        ]);
      }
    };

    fetchCategories();
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
              <span className="hidden sm:inline text-white">|</span>
              <a
                href="tel:+917982303199"
                className="flex items-center space-x-2 text-white hover:text-white transition-colors duration-200"
              >
                <FaPhone className="w-4 h-4" />
                <span>+91 7982303199</span>
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
              {[
                { href: '/about', label: 'About' },
                { href: '/courses', label: 'Courses' },
                { href: '/consulting', label: 'Consulting' },
                { href: '/contact', label: 'Contact' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white hover:text-primary-200 transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Course Categories */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              Categories
            </h3>
            <nav className="space-y-2">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/courses?category=${encodeURIComponent(category.slug)}`}
                  className="block text-white hover:text-primary-200 transition-colors duration-200 text-sm"
                >
                  {category.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              Services
            </h3>
            <nav className="space-y-2">
              {[
                { href: '/services/ai-solutions', label: 'AI Solutions' },
                { href: '/services/digital-transformation', label: 'Digital Transform' },
                { href: '/services/it-staffing', label: 'IT Staffing' },
                { href: '/services/technical-consulting', label: 'Consulting' }
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-white hover:text-primary-200 transition-colors duration-200 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold mb-3 text-white text-sm uppercase tracking-wide">
              Stay Updated
            </h3>
            <div className="space-y-3">
              <p className="text-white text-xs">Get course updates & insights</p>
              <div className="flex flex-col gap-2">
                <input
                  type="email"
                  placeholder="Your email"
                  className="px-3 py-2 bg-primary-800 border border-primary-600 rounded text-white placeholder-primary-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
                <button className="px-3 py-2 bg-secondary-600 hover:bg-secondary-700 text-white font-medium rounded text-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-400">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-primary-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white text-xs text-center md:text-left">
            &copy; {currentYear} kdadks service private ltd. All rights reserved.
          </p>
          <nav className="flex flex-wrap justify-center md:justify-end gap-4 text-xs">
            <Link href="/privacy-policy" className="text-white hover:text-primary-200 transition-colors duration-200">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="text-white hover:text-primary-200 transition-colors duration-200">
              Terms of Service
            </Link>
            <Link href="/sitemap" className="text-white hover:text-primary-200 transition-colors duration-200">
              Sitemap
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
