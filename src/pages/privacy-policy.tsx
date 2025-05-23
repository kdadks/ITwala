import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PrivacyPolicy: NextPage = () => {
  return (
    <>
      <Head>
        <title>Privacy Policy - ITwala Academy</title>
        <meta name="description" content="Privacy Policy for ITwala Academy - Learn how we protect and handle your personal information." />
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
              <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">Privacy Policy</h1>
              <p className="text-xl text-primary-600">
                Your privacy is important to us. Learn how we collect, use, and protect your information.
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
                  <h2 className="text-2xl font-bold text-primary-700 mb-6">Information We Collect</h2>
                  <p className="text-gray-700 mb-6">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700">
                    <li>Name and contact information</li>
                    <li>Account credentials</li>
                    <li>Course enrollment and progress data</li>
                    <li>Payment information</li>
                    <li>Communication preferences</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">How We Use Your Information</h2>
                  <p className="text-gray-700 mb-6">
                    We use the collected information to:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700">
                    <li>Provide and improve our educational services</li>
                    <li>Process your payments and enrollments</li>
                    <li>Send important updates about your courses</li>
                    <li>Personalize your learning experience</li>
                    <li>Analyze and improve our platform</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">Data Protection</h2>
                  <p className="text-gray-700 mb-6">
                    We implement appropriate technical and organizational security measures to protect your personal information. These measures include encryption, secure servers, and regular security assessments.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">Your Rights</h2>
                  <p className="text-gray-700 mb-6">
                    You have the right to:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700">
                    <li>Access your personal data</li>
                    <li>Request corrections to your data</li>
                    <li>Request deletion of your data</li>
                    <li>Object to data processing</li>
                    <li>Request data portability</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">Cookie Policy</h2>
                  <p className="text-gray-700 mb-6">
                    We use cookies to enhance your experience on our platform. These cookies help us understand how you use our services and allow us to remember your preferences.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">Contact Us</h2>
                  <p className="text-gray-700 mb-6">
                    If you have any questions about our Privacy Policy, please contact us at:
                  </p>
                  <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                    <p className="text-secondary-700">
                      Email: sales@it-wala.com<br />
                      Phone: +91 7982303199<br />
                      Address: ITwala Academy, Lucknow, Uttar Pradesh, India
                    </p>
                  </div>

                  <div className="border-t border-gray-200 pt-6 mt-6">
                    <p className="text-gray-600 text-sm">
                      Last updated: May 23, 2025
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

export default PrivacyPolicy;
