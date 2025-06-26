import React from 'react';
import { motion } from 'framer-motion';
import { Dispatch, SetStateAction } from 'react';

interface CourseFilterProps {
  categories: string[];
  levels: string[];
  selectedCategory: string;
  selectedLevel: string;
  onCategoryChange: (category: string) => void;
  onLevelChange: (level: string) => void;
  priceRange: [number, number];
  setPriceRange: Dispatch<SetStateAction<[number, number]>>;
  sortBy: string;
  setSortBy: Dispatch<SetStateAction<string>>;
}

const CourseFilter: React.FC<CourseFilterProps> = ({
  categories,
  levels,
  selectedCategory,
  selectedLevel,
  onCategoryChange,
  onLevelChange,
  priceRange,
  setPriceRange,
  sortBy,
  setSortBy
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white p-6 rounded-lg shadow-md mb-8 flex flex-col gap-6"
    >
      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Category</h3>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Level Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Level</h3>
        <select
          id="level"
          value={selectedLevel}
          onChange={(e) => onLevelChange(e.target.value)}
          className="w-full rounded-md border border-gray-300 py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        >
          <option value="all">All Levels</option>
          {levels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range Filter */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Registration Fee Range (₹)</h3>
        <div className="flex items-center gap-2">
          <input
            type="number"
            value={priceRange[0]}
            onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
            className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            min="0"
            max={priceRange[1]}
          />
          <span className="text-gray-500">to</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
            className="w-1/2 p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
            min={priceRange[0]}
          />
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        type="button"
        className="mt-2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md border border-gray-300 transition"
        onClick={() => {
          onCategoryChange('all');
          onLevelChange('all');
          setPriceRange([0, 50000]);
          setSortBy('popular');
        }}
      >
        Reset Filters
      </button>
    </motion.div>
  );
};

export default CourseFilter;