import Link from 'next/link';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">IT- Simple Hain</h3>
            <p className="text-gray-400 mb-4">
              Let us shape your career
            </p>
            <div className="flex space-x-4">
              <a href="https://www.linkedin.com/company/it-wala.com/about/" 
                 target="_blank" 
                 rel="noopener noreferrer" 
                 className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Useful Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about">
                  <div className="text-gray-400 hover:text-white transition-colors">About Us</div>
                </Link>
              </li>
              <li>
                <Link href="/courses">
                  <div className="text-gray-400 hover:text-white transition-colors">Courses</div>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <div className="text-gray-400 hover:text-white transition-colors">Contact Us</div>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <div className="text-gray-400 hover:text-white transition-colors">Privacy Policy</div>
                </Link>
              </li>
              <li>
                <Link href="/terms">
                  <div className="text-gray-400 hover:text-white transition-colors">Terms of Service</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Course Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses?category=prompt-engineering">
                  <div className="text-gray-400 hover:text-white transition-colors">Prompt Engineering</div>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=agentic-ai">
                  <div className="text-gray-400 hover:text-white transition-colors">Agentic AI</div>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=artificial-intelligence">
                  <div className="text-gray-400 hover:text-white transition-colors">Artificial Intelligence</div>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=product-management">
                  <div className="text-gray-400 hover:text-white transition-colors">AI Product Management</div>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=software-development">
                  <div className="text-gray-400 hover:text-white transition-colors">Software Development</div>
                </Link>
              </li>
              <li>
                <Link href="/courses?category=software-testing">
                  <div className="text-gray-400 hover:text-white transition-colors">AI Software Testing</div>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                </svg>
                <a href="mailto:sales@it-wala.com" className="text-gray-400 hover:text-white transition-colors">
                  sales@it-wala.com
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                </svg>
                <a href="tel:+917982303199" className="text-gray-400 hover:text-white transition-colors">
                  +91 7982303199
                </a>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"></path>
                </svg>
                <span className="text-gray-400">
                  Office Hours: 9 AM–5 PM
                </span>
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 mb-4">Subscribe to Newsletter</h3>
            <form className="flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="py-2 px-3 rounded-l-md text-gray-900 flex-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-500 hover:bg-primary-600 py-2 px-4 rounded-r-md text-white font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {currentYear} kdadks service private ltd. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy">
              <div className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </div>
            </Link>
            <Link href="/terms">
              <div className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </div>
            </Link>
            <Link href="/sitemap">
              <div className="text-gray-400 hover:text-white text-sm transition-colors">
                Sitemap
              </div>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;