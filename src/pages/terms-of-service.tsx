import { NextPage } from 'next';
import Head from 'next/head';
import { motion } from 'framer-motion';
import Link from 'next/link';

const TermsOfService: NextPage = () => {
  return (
    <>
      <Head>
        <title>Terms of Service - ITwala Academy</title>
        <meta name="description" content="Terms of Service for ITwala Academy - Understanding our service agreement and user responsibilities." />
      </Head>

      <main>
        <section className="py-12 md:py-20 bg-gradient-to-br from-primary-50 via-secondary-50 to-accent-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-primary-800 mb-6">Terms of Service</h1>
              <p className="text-xl text-primary-600">
                Please read these terms carefully before using our platform.
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
                  <h2 className="text-2xl font-bold text-primary-700 mb-6">1. Agreement to Terms</h2>
                  <p className="text-gray-700 mb-6">
                    By accessing or using ITwala Academy's services, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access our services.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">2. User Accounts</h2>
                  <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                    <ul className="list-disc pl-6 text-gray-700">
                      <li>You must be at least 13 years old to create an account</li>
                      <li>You are responsible for maintaining account security</li>
                      <li>Your account information must be accurate and up-to-date</li>
                      <li>One account per user unless explicitly permitted</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">3. Course Enrollment and Access</h2>
                  <p className="text-gray-700 mb-6">
                    Upon enrollment and payment:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700">
                    <li>You gain access to course materials for the specified duration</li>
                    <li>Access is personal and non-transferable</li>
                    <li>Course materials are protected by copyright</li>
                    <li>Sharing access credentials is prohibited</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">4. Payment Terms</h2>
                  <div className="bg-accent-50 rounded-lg p-6 mb-6 text-gray-700">
                    <p className="mb-4">All payments are:</p>
                    <ul className="list-disc pl-6">
                      <li>Processed securely through our payment partners</li>
                      <li>Non-refundable unless specified otherwise</li>
                      <li>Subject to our refund policy for eligible courses</li>
                      <li>Inclusive of applicable taxes</li>
                    </ul>
                  </div>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">5. Intellectual Property</h2>
                  <p className="text-gray-700 mb-6">
                    All content provided through our platform is protected by copyright and other intellectual property laws. Users may not copy, distribute, or create derivative works without explicit permission.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">6. User Conduct</h2>
                  <p className="text-gray-700 mb-6">
                    Users must:
                  </p>
                  <ul className="list-disc pl-6 mb-6 text-gray-700">
                    <li>Respect intellectual property rights</li>
                    <li>Maintain professional conduct in discussions</li>
                    <li>Not engage in disruptive behavior</li>
                    <li>Not attempt to breach platform security</li>
                  </ul>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">7. Termination</h2>
                  <p className="text-gray-700 mb-6">
                    We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">8. Changes to Terms</h2>
                  <p className="text-gray-700 mb-6">
                    We may modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.
                  </p>

                  <h2 className="text-2xl font-bold text-primary-700 mb-6">9. Contact Information</h2>
                  <div className="bg-secondary-50 rounded-lg p-6 mb-6">
                    <p className="text-secondary-700">
                      For questions about these Terms:<br />
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

export default TermsOfService;
