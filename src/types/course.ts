export interface Review {
  id: number;
  user: string;
  rating: number;
  date: string;
  comment: string;
  userImage?: string;
}

export interface Lesson {
  id: string;
  title: string;
  type: LessonType;
  content: string;
  isPreview?: boolean;
  resources?: string[];
  duration?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export type LessonType = 'video' | 'lab' | 'quiz' | 'reading';

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  price: number;
  image: string;
  category: string;
  level: string;
  duration?: string;
  status?: string;
  learningOutcomes: string[];
  requirements: string[];
  modules: Module[];
  reviews: Review[];
  students?: number;
  enrollmentStatus?: 'Open' | 'Closed' | 'In Progress';
  thumbnail?: string;
  schedule?: string;
  language?: string;
  lastUpdated?: string;
  certificationIncluded?: boolean;
  tags?: string[];
  instructor?: {
    name: string;
    bio: string;
    image: string;
  };
  rating?: number;
  ratingCount?: number;
  originalPrice?: number;
  resources?: number;
  publishedDate?: string;
  enrollments?: number;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
}
