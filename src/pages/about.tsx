import { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { motion } from 'framer-motion';
import CompanyMission from '../components/about/CompanyMission';
import Locations from '../components/about/Locations';

const About: NextPage = () => {
  return (
    <>
      <Head>
        <title>About Us - ITwala Academy</title>
        <meta name="description" content="Learn about ITwala Academy, our mission, our team, and our vision for IT education in India." />
      </Head>

      <main>
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">About ITwala Academy</h1>
              <p className="text-xl text-gray-600 mb-8">
                Building the next generation of IT professionals through quality education and hands-on training.
              </p>
            </motion.div>
          </div>
        </section>

        <CompanyMission />
        
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
                  <Image 
                    src="https://picsum.photos/400/400" // Temporary placeholder
                    alt="ITwala Team Collaboration" 
                    layout="fill"
                    objectFit="cover"
                    className="rounded-lg"
                  />
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Innovate today for better tomorrow
                </p>
                <p className="text-gray-600 mb-4">
                  IT-Wala Academy is dedicated to providing high-quality, industry-relevant training to empower individuals and professionals. Our industry-expert instructors, practical learning approach ensure you gain the skills needed to succeed in today's competitive market. We focus on hands-on experience and real-world applications to bridge the gap between education and employment.
                </p>
                <p className="text-gray-600">
                  At IT-Wala Academy, we offer more than just education; we provide real-world experience. Through our close ties with the software development division of our parent company, our students have the unique opportunity to gain hands-on experience in a thriving technology environment. This invaluable exposure not only enhances their learning but also significantly boosts their career prospects, preparing them to excel in the competitive tech industry.
                </p>
              </motion.div>
            </div>
          </div>
        </section>
        
        <Locations />
      </main>
    </>
  );
};

export default About;