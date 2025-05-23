import { Course } from '../types/course';
import { courseData } from './courses';
import { newCourses } from './newcourses';
import { hydrateModuleIds } from '@/utils/moduleHelper';

// Combine existing and new courses, ensuring all have module IDs
export const allCourses: Course[] = [...courseData, ...newCourses].map(course => hydrateModuleIds(course));
