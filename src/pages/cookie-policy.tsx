import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CookiePolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Cookie Policy - ITwala Academy</title>
        <meta name="description" content="Cookie Policy for ITwala Academy - Learn how we use cookies and similar tracking technologies on our platform." />
        <link rel="canonical" href="https://academy.it-wala.com/cookie-policy" />
      </Head>

      <main>
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">Cookie Policy</h1>
              <p className="text-xl text-primary-600">
                Learn how ITwala Academy uses cookies and similar technologies to improve your experience.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="prose prose-lg"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg">

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">What Are Cookies?</h2>
                  <p className="text-gray-700 mb-6">
                    Cookies are small text files that are placed on your device (computer, tablet, or mobile) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and give website owners useful information about how their site is being used.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">How We Use Cookies</h2>
                  <p className="text-gray-700 mb-4">
                    ITwala Academy uses cookies for the following purposes:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                    <li>To keep you signed in to your account during your session</li>
                    <li>To remember your preferences and settings</li>
                    <li>To understand how you interact with our platform</li>
                    <li>To measure and analyse the performance of our website</li>
                    <li>To deliver relevant content and course recommendations</li>
                    <li>To improve the overall quality of our services</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Types of Cookies We Use</h2>

                  <div className="space-y-6 mb-6">
                    <div className="bg-primary-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-primary-700 mb-2">Essential Cookies</h3>
                      <p className="text-gray-700">
                        These cookies are strictly necessary for the website to function. They enable core features such as authentication, session management, and security. Without these cookies, the services you have asked for cannot be provided. These cannot be disabled.
                      </p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-secondary-700 mb-2">Analytics Cookies</h3>
                      <p className="text-gray-700">
                        These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. We use this data to improve our platform, content, and user experience. We may use tools such as Google Analytics for this purpose.
                      </p>
                    </div>

                    <div className="bg-primary-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-primary-700 mb-2">Functional Cookies</h3>
                      <p className="text-gray-700">
                        These cookies allow the website to remember choices you make (such as your language or region preferences) and provide enhanced, more personalised features. They may be set by us or by third-party providers whose services we use on our pages.
                      </p>
                    </div>

                    <div className="bg-secondary-50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-secondary-700 mb-2">Performance Cookies</h3>
                      <p className="text-gray-700">
                        These cookies collect information about how you use our website — for example, which pages you visit most often and whether you receive any error messages. All information collected by these cookies is aggregated and therefore anonymous.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Third-Party Cookies</h2>
                  <p className="text-gray-700 mb-4">
                    Some cookies on our platform are set by third-party services that appear on our pages. We do not control the use of these cookies and you should refer to the relevant third-party privacy policies for more information. Third-party services we use may include:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                    <li><strong>Google Analytics</strong> — website traffic analysis</li>
                    <li><strong>Supabase</strong> — authentication and session management</li>
                    <li><strong>Razorpay / Payment Providers</strong> — secure payment processing</li>
                    <li><strong>Netlify</strong> — website hosting and performance monitoring</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Managing and Controlling Cookies</h2>
                  <p className="text-gray-700 mb-4">
                    You can control and manage cookies in several ways. Please note that removing or blocking cookies may impact your user experience and some functionality may no longer be available.
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
                    <li>
                      <strong>Browser settings:</strong> Most browsers allow you to view, manage, delete, and block cookies. Refer to your browser&apos;s help documentation for instructions.
                    </li>
                    <li>
                      <strong>Opt-out tools:</strong> You can opt out of Google Analytics tracking by installing the{' '}
                      <a
                        href="https://tools.google.com/dlpage/gaoptout"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-secondary-600 underline hover:text-secondary-800"
                      >
                        Google Analytics Opt-out Browser Add-on
                      </a>.
                    </li>
                    <li>
                      <strong>Do Not Track:</strong> Some browsers support a &quot;Do Not Track&quot; feature. We respect this signal where technically feasible.
                    </li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Cookie Retention</h2>
                  <p className="text-gray-700 mb-6">
                    Cookies can be either <strong>session cookies</strong> (which expire when you close your browser) or <strong>persistent cookies</strong> (which remain on your device for a set period or until manually deleted). The retention period varies depending on the purpose of each cookie.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Changes to This Cookie Policy</h2>
                  <p className="text-gray-700 mb-6">
                    We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our practices. We encourage you to review this page periodically. The date at the bottom of this page indicates when it was last updated.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-4">Contact Us</h2>
                  <p className="text-gray-700 mb-4">
                    If you have any questions about our use of cookies, please contact us:
                  </p>
                  <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                    <p className="text-secondary-700">
                      Email: support@it-wala.com<br />
                      Phone: +91 7982303199<br />
                      Address: ITwala Academy, Lucknow, Uttar Pradesh, India
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <Link href="/privacy-policy" className="text-secondary-600 hover:text-secondary-800 underline text-sm">
                      Privacy Policy
                    </Link>
                    <Link href="/terms-of-service" className="text-secondary-600 hover:text-secondary-800 underline text-sm">
                      Terms of Service
                    </Link>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <p className="text-gray-600 text-sm">
                      Last updated: May 8, 2026
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default CookiePolicy;
