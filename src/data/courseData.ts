import { Course } from '../types/course';

const courseList: Course[] = [
  {
    id: "1",
    slug: "ai-machine-learning-fundamentals",
    title: "AI & Machine Learning Fundamentals",
    description: "Master the fundamentals of AI and machine learning with hands-on projects",
    price: 3999,
    rating: 4.8,
    reviews: [],
    enrollments: 345,
    image: "/images/Focused Individual at Computer.jpeg",
    category: "Artificial Intelligence",
    level: "Intermediate",
    learningOutcomes: ["Learn AI fundamentals", "Build ML models", "Deploy solutions"],
    requirements: ["Basic Python knowledge", "Mathematics fundamentals"],
    modules: []
  },
  {
    id: "2",
    slug: "AI product-management",
    title: "AI Product Management",
    description: "Learn how to build and manage successful AI products",
    price: 3999,
    rating: 4.5,
    reviews: [],
    enrollments: 287,
    image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "Product Management",
    level: "Intermediate",
    learningOutcomes: ["Product strategy", "AI product lifecycle", "User research"],
    requirements: ["Basic understanding of AI", "Project management"],
    modules: []
  }
];

export const courseData = courseList;
