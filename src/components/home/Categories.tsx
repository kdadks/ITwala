import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaClipboardCheck, FaRobot, FaTasks, FaChartLine, FaMobileAlt } from 'react-icons/fa';
import { allCourses as courseData } from '@/data/allCourses';

// Map of category names to their respective icons and colors
const categoryMeta = {
  'Prompt Engineering': {
    icon: <FaRobot className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600',
    description: 'Master the art of crafting effective prompts for AI models'
  },
  'Agentic AI': {
    icon: <FaRobot className="w-6 h-6" />,
    color: 'bg-indigo-100 text-indigo-600',
    description: 'Build autonomous AI agents that can perform complex tasks'
  },
  'Artificial Intelligence': {
    icon: <FaRobot className="w-6 h-6" />,
    color: 'bg-yellow-100 text-yellow-600',
    description: 'Explore machine learning, deep learning, and AI applications'
  },
  'Product Management': {
    icon: <FaChartLine className="w-6 h-6" />,
    color: 'bg-pink-100 text-pink-600',
    description: 'Learn to define, build, and launch successful IT products'
  },
  // Default category metadata
  default: {
    icon: <FaTasks className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600',
    description: 'Master specialized skills in this domain'
  }
};

const Categories = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  // Get unique categories and create category objects
  const categories = Array.from(new Set(courseData.map(course => course.category)))
    .map((category, index) => ({
      id: index + 1,
      name: category,
      slug: category.toLowerCase().replace(/\s+/g, '-'),
      icon: categoryMeta[category]?.icon || categoryMeta.default.icon,
      color: categoryMeta[category]?.color || categoryMeta.default.color,
      description: categoryMeta[category]?.description || categoryMeta.default.description
    }));

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 px-2">Explore Our Course Categories</h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2">
            Discover specialized courses designed to advance your IT career and skills
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {categories.map((category) => (
            <motion.div
              key={category.id}
              onHoverStart={() => setHoveredId(category.id)}
              onHoverEnd={() => setHoveredId(null)}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Link href={`/courses?category=${encodeURIComponent(category.name)}`} passHref>
                <div className={`bg-white rounded-xl shadow-md overflow-hidden h-full transition-all duration-300 ${hoveredId === category.id ? 'shadow-lg' : ''}`}>
                  <div className="p-6 flex flex-col h-full">
                    <div className={`inline-flex items-center justify-center p-3 rounded-full mb-4 ${category.color}`}>
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{category.description}</p>
                    <div className="flex items-center text-primary-500 font-medium mt-auto">
                      Explore Courses
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;