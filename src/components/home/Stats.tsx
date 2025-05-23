import { motion } from 'framer-motion';
import { FaUserGraduate, FaLaptopCode, FaUsers, FaBriefcase } from 'react-icons/fa';
import { allCourses as courseData } from '@/data/allCourses';

const Stats = () => {
  const courseCount = courseData.length;
  
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Impact in Numbers</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Our commitment to quality education has made a real difference
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-primary-600 text-white rounded-full">
              <FaUserGraduate className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">5,000+</div>
            <div className="text-gray-400">Students Enrolled</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-secondary-500 text-white rounded-full">
              <FaLaptopCode className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">{courseCount}+</div>
            <div className="text-gray-400">Specialized Courses</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-accent-500 text-white rounded-full">
              <FaUsers className="w-8 h-8" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900">20+</div>
            <div className="text-gray-400">Learning Tracks</div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-gray-800 rounded-lg p-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 mb-6 bg-success-500 text-white rounded-full">
              <FaBriefcase className="w-8 h-8" />
            </div>
            <div className="text-4xl font-bold mb-2">80%</div>
            <div className="text-gray-400">Job Placement Rate</div>
          </motion.div>
        </div>


      </div>
    </section>
  );
};

export default Stats;