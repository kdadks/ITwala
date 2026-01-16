# Code Changes Required - Course Architecture Fix

## Overview
This document provides the exact code changes needed to migrate from static data files to API-based course data.

---

## Change 1: Fix Dashboard Course Page
**File**: `/src/pages/dashboard/course/[slug].tsx`  
**Priority**: CRITICAL  
**Effort**: 2-3 hours

### Current Code (Lines 1-52)
```typescript
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { allCourses as courseData } from '@/data/allCourses';  // <-- REMOVE THIS
import { Course } from '@/types/course';
import CourseHeader from '@/components/dashboard/CourseHeader';
import CourseNavigation from '@/components/dashboard/CourseNavigation';
import CourseContent from '@/components/dashboard/CourseContent';
import { hydrateModuleIds } from '@/utils/moduleHelper';

interface CoursePageProps {
  course: Course;
}

const CoursePage: NextPage<CoursePageProps> = ({ course }) => {
  const router = useRouter();
  const user = useUser();
  // ... rest of component
}

// This function needs to be updated:
// export const getServerSideProps: GetServerSideProps = (context) => {
//   const { slug } = context.params;
//   const course = courseData.find(c => c.slug === slug);
//   // ...
// }
```

### New Code (Replacement)
```typescript
import type { NextPage, GetServerSideProps } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useUser } from '@supabase/auth-helpers-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
// REMOVED: import { allCourses as courseData } from '@/data/allCourses';
import { Course } from '@/types/course';
import CourseHeader from '@/components/dashboard/CourseHeader';
import CourseNavigation from '@/components/dashboard/CourseNavigation';
import CourseContent from '@/components/dashboard/CourseContent';
import { hydrateModuleIds } from '@/utils/moduleHelper';

interface CoursePageProps {
  course: Course;
}

const CoursePage: NextPage<CoursePageProps> = ({ course }) => {
  const router = useRouter();
  const user = useUser();
  
  useEffect(() => {
    if (!user && !isLoading) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);
  
  // ... rest of component remains the same
}

// UPDATED: Fetch from API instead of static data
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params as { slug: string };
  
  try {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = context.req.headers.host || 'localhost:3000';
    const apiUrl = `${protocol}://${host}/api/courses/${slug}`;
    
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      return {
        notFound: true,
      };
    }
    
    const { course } = await response.json();
    
    // Hydrate module IDs
    const hydratedCourse = hydrateModuleIds(course);
    
    return {
      props: {
        course: hydratedCourse,
      },
      revalidate: 3600, // ISR: Revalidate every hour
    };
  } catch (error) {
    console.error('Error fetching course:', error);
    return {
      notFound: true,
    };
  }
};

export default CoursePage;
```

---

## Change 2: Fix Home - Featured Courses
**File**: `/src/components/home/FeaturedCourses.tsx`  
**Priority**: MEDIUM  
**Effort**: 1.5-2 hours

### Current Code (Lines 1-15)
```typescript
import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { allCourses as courseData } from '@/data/allCourses';  // <-- CHANGE THIS

const FeaturedCourses = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Get the featured courses - prioritize new courses and popular AI courses
  const featuredCourses = courseData
    .sort((a, b) => {
      // First sort by new categories
      const isNewCategoryA = a.category === "Prompt Engineering" || a.category === "Agentic AI";
      const isNewCategoryB = b.category === "Prompt Engineering" || b.category === "Agentic AI";
      if (isNewCategoryA && !isNewCategoryB) return -1;
      if (!isNewCategoryA && isNewCategoryB) return 1;
      
      // Then sort by newest
      return new Date(b.publishedDate || "").getTime() - new Date(a.publishedDate || "").getTime();
    })
    .slice(0, 4);
```

### New Code (Replacement)
```typescript
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Course } from '@/types/course';

const FeaturedCourses = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/courses?limit=10');
        
        if (!response.ok) {
          throw new Error('Failed to fetch courses');
        }
        
        const { courses } = await response.json();
        
        // Sort and get top 4
        const sorted = courses
          .sort((a: Course, b: Course) => {
            // First sort by new categories
            const isNewCategoryA = a.category === "Prompt Engineering" || a.category === "Agentic AI";
            const isNewCategoryB = b.category === "Prompt Engineering" || b.category === "Agentic AI";
            if (isNewCategoryA && !isNewCategoryB) return -1;
            if (!isNewCategoryA && isNewCategoryB) return 1;
            
            // Then sort by newest
            return new Date(b.publishedDate || "").getTime() - new Date(a.publishedDate || "").getTime();
          })
          .slice(0, 4);
        
        setFeaturedCourses(sorted);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFeaturedCourses();
  }, []);

  if (isLoading) {
    return (
      <section className="py-0 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    );
  }
```

The rest of the component remains the same.

---

## Change 3: Fix Home - Categories
**File**: `/src/components/home/Categories.tsx`  
**Priority**: MEDIUM  
**Effort**: 1.5-2 hours

### Current Code (Lines 1-50)
```typescript
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaClipboardCheck, FaRobot, FaTasks, FaChartLine, FaMobileAlt } from 'react-icons/fa';
import { allCourses as courseData } from '@/data/allCourses';  // <-- CHANGE THIS

// Map of category names to their respective icons and colors
const categoryMeta = {
  'Prompt Engineering': {
    icon: <FaRobot className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600',
    description: 'Master the art of crafting effective prompts for AI models'
  },
  // ... more categories
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
```

### New Code (Replacement)
```typescript
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaLaptopCode, FaClipboardCheck, FaRobot, FaTasks, FaChartLine, FaMobileAlt } from 'react-icons/fa';
import { Course } from '@/types/course';

// Map of category names to their respective icons and colors
const categoryMeta: Record<string, any> = {
  'Prompt Engineering': {
    icon: <FaRobot className="w-6 h-6" />,
    color: 'bg-purple-100 text-purple-600',
    description: 'Master the art of crafting effective prompts for AI models'
  },
  // ... more categories (keep existing)
};

interface Category {
  id: number;
  name: string;
  slug: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

const Categories = () => {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/courses/categories');
        
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        
        const { categories: rawCategories } = await response.json();
        
        const formattedCategories = rawCategories
          .map((category: string, index: number) => ({
            id: index + 1,
            name: category,
            slug: category.toLowerCase().replace(/\s+/g, '-'),
            icon: (categoryMeta[category] as any)?.icon || categoryMeta.default.icon,
            color: (categoryMeta[category] as any)?.color || categoryMeta.default.color,
            description: (categoryMeta[category] as any)?.description || categoryMeta.default.description
          }));
        
        setCategories(formattedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="py-8 md:py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        </div>
      </section>
    );
  }
```

The rest of the component remains the same.

---

## Change 4: Fix Home - Stats
**File**: `/src/components/home/Stats.tsx`  
**Priority**: LOW (Display only)  
**Effort**: 1 hour

### Current Code (Lines 1-55)
```typescript
// (Component removed from home page, safe to delete or keep for future use)

import { motion } from 'framer-motion';
import { FaUserGraduate, FaLaptopCode, FaUsers, FaBriefcase, FaProjectDiagram, FaTrophy } from 'react-icons/fa';
import { allCourses as courseData } from '@/data/allCourses';  // <-- CHANGE THIS

const keyConsultingStats = [
	{
		icon: <FaProjectDiagram className="w-8 h-8" />,
		value: '20+',
		label: 'Projects Delivered',
		// ... rest of stats
	},
	// ...
];

const stats = [
	{
		icon: <FaUserGraduate className="w-8 h-8" />,
		value: '500+',
		label: 'Students Enrolled',
		color: 'from-primary-600 to-primary-600',
		ring: 'ring-primary-500/30',
	},
	{
		icon: <FaLaptopCode className="w-8 h-8" />,
		value: `${courseData.length}+`,  // <-- CHANGE THIS LINE
		label: 'Specialized Courses',
		color: 'from-secondary-700 to-secondary-700',
		ring: 'ring-secondary-500/30',
	},
	// ...
];
```

### New Code (Replacement)
```typescript
// (Component removed from home page, safe to delete or keep for future use)

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { FaUserGraduate, FaLaptopCode, FaUsers, FaBriefcase, FaProjectDiagram, FaTrophy } from 'react-icons/fa';

const keyConsultingStats = [
	{
		icon: <FaProjectDiagram className="w-8 h-8" />,
		value: '20+',
		label: 'Projects Delivered',
		// ... rest of stats (keep existing)
	},
	// ...
];

const Stats = () => {
	const [courseCount, setCourseCount] = useState<number | string>('8+');
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchCourseCount = async () => {
			try {
				setIsLoading(true);
				const response = await fetch('/api/courses');
				
				if (response.ok) {
					const { courses } = await response.json();
					setCourseCount(`${courses.length}+`);
				}
			} catch (error) {
				console.error('Error fetching course count:', error);
				setCourseCount('8+'); // fallback
			} finally {
				setIsLoading(false);
			}
		};
		
		fetchCourseCount();
	}, []);

	const stats = [
		{
			icon: <FaUserGraduate className="w-8 h-8" />,
			value: '500+',
			label: 'Students Enrolled',
			color: 'from-primary-600 to-primary-600',
			ring: 'ring-primary-500/30',
		},
		{
			icon: <FaLaptopCode className="w-8 h-8" />,
			value: courseCount,
			label: 'Specialized Courses',
			color: 'from-secondary-700 to-secondary-700',
			ring: 'ring-secondary-500/30',
		},
		// ... rest of stats (keep existing)
	];

	return (
		// ... component JSX remains the same
	);
};

export default Stats;
```

---

## Change 5: Delete Static Data Files

After completing changes 1-4, delete these files:

```bash
# Delete these files:
rm /src/data/allCourses.ts
rm /src/data/courses.ts
rm /src/data/newcourses.ts
rm /src/data/courses.ts.bak
rm /src/data/newcourses.ts.bak

# Verify no other files import them:
grep -r "from.*allCourses\|from.*courses.ts\|from.*newcourses" src/
```

---

## Change 6: Optional - Create Seed Script

**File**: Create `/scripts/seedCourses.ts`  
**Priority**: MEDIUM (For deployment)  
**Effort**: 2-3 hours

```typescript
import { supabaseAdmin } from '@/lib/supabaseClient';

// These courses should come from your static files or a data source
const allCoursesData = [
  {
    id: "1",
    slug: "ai-machine-learning-fundamentals",
    title: "AI & Machine Learning Fundamentals",
    description: "Master the fundamentals of artificial intelligence and machine learning...",
    // ... all course fields
  },
  // ... all 8 courses
];

export async function seedCourses() {
  if (!supabaseAdmin) {
    throw new Error('Supabase admin client not available');
  }

  console.log('Starting course seed...');
  let inserted = 0;
  let updated = 0;
  let errors = 0;

  for (const course of allCoursesData) {
    try {
      const { error } = await supabaseAdmin
        .from('courses')
        .upsert({
          id: course.id,
          slug: course.slug,
          title: course.title,
          description: course.description,
          // ... all other fields
        }, { onConflict: 'slug' });

      if (error) throw error;
      updated++;
    } catch (error) {
      console.error(`Error upserting course ${course.slug}:`, error);
      errors++;
    }
  }

  console.log(`Seed completed: ${inserted} inserted, ${updated} updated, ${errors} errors`);
  return { inserted, updated, errors };
}

// Run script
seedCourses().catch(console.error);
```

---

## Testing Checklist

After making all changes, test these:

### Testing Dashboard
- [ ] Visit `/dashboard/course/ai-machine-learning-fundamentals`
- [ ] Verify course loads from database (not static files)
- [ ] Check that modules display correctly
- [ ] Verify lesson content is correct

### Testing Home Page
- [ ] Home page loads without errors
- [ ] Featured Courses displays 4 courses
- [ ] Categories section shows all unique categories
- [ ] Stats shows course count (should update from API)

### Testing Course Pages
- [ ] `/courses` lists courses from database
- [ ] `/courses/[slug]` shows correct course details
- [ ] Filters and sorting work correctly
- [ ] Course reviews, FAQs load correctly

### Testing API Endpoints
- [ ] GET `/api/courses` returns all courses
- [ ] GET `/api/courses/[slug]` returns single course
- [ ] GET `/api/courses/categories` returns categories
- [ ] GET `/api/courses/[slug]/modules` returns modules
- [ ] GET `/api/courses/[slug]/faqs` returns FAQs
- [ ] GET `/api/courses/[slug]/reviews` returns reviews

---

## Rollback Plan

If something breaks, you can quickly revert:

```bash
# Undo changes to component/page files
git checkout src/pages/dashboard/course/[slug].tsx
git checkout src/components/home/FeaturedCourses.tsx
git checkout src/components/home/Categories.tsx
git checkout src/components/home/Stats.tsx

# Restore deleted files
git checkout src/data/allCourses.ts
git checkout src/data/courses.ts
git checkout src/data/newcourses.ts
```

---

## Summary

| Change | File | Impact | Effort |
|--------|------|--------|--------|
| 1 | dashboard/course/[slug].tsx | CRITICAL | 2-3h |
| 2 | components/home/FeaturedCourses.tsx | MEDIUM | 1.5-2h |
| 3 | components/home/Categories.tsx | MEDIUM | 1.5-2h |
| 4 | components/home/Stats.tsx | LOW | 1h |
| 5 | Delete static files | CLEANUP | 1h |
| 6 | Add seed script | MEDIUM | 2-3h |
| | **TOTAL** | | **10-14h** |

---

