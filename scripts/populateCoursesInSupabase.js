const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample course data - you can modify this or add more courses
const sampleCourses = [
  {
    // Remove id field to let Supabase auto-generate UUID
    slug: "ai-machine-learning-fundamentals",
    title: "AI & Machine Learning Fundamentals",
    description: "Master the fundamentals of artificial intelligence and machine learning with hands-on projects. Learn how to build and deploy machine learning models that solve real-world problems.",
    image: "/images/Cybernetic Workspace.jpeg",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "8 weeks",
    price: 3999,
    original_price: 14999,
    status: "published",
    students: 345,
    enrollment_status: "Open",
    rating: 4.8,
    rating_count: 128,
    resources: 35,
    published_date: "2025-05-01",
    learning_outcomes: [
      "Understand key AI and machine learning concepts",
      "Build classification and regression models",
      "Implement neural networks with TensorFlow and Keras",
      "Develop computer vision applications",
      "Apply natural language processing techniques",
      "Deploy machine learning models to production",
      "Understand ethical considerations in AI",
      "Work with real-world datasets"
    ],
    requirements: [
      "Basic Python programming knowledge",
      "Understanding of basic mathematics (algebra, statistics)",
      "No prior AI or machine learning experience required",
      "A computer with internet connection"
    ],
    modules: [
      {
        id: "m1",
        title: "Introduction to AI and Machine Learning",
        description: "Learn the fundamental concepts and terminology of AI and machine learning.",
        lessons: [
          {
            id: "l1",
            title: "What is Artificial Intelligence?",
            type: "video",
            content: "This lesson covers the definition of AI, its history, and its applications in various industries.",
            isPreview: true
          }
        ]
      }
    ],
    reviews: [],
    instructor: {
      name: "Dr. Sarah Johnson",
      bio: "AI researcher with 10+ years of experience in machine learning and data science.",
      image: "/images/instructors/sarah-johnson.jpg"
    },
    faqs: [
      {
        question: "Do I need prior programming experience?",
        answer: "Basic Python knowledge is recommended, but we'll cover the essentials needed for the course."
      }
    ],
    tags: ["AI", "Machine Learning", "Python", "Data Science"],
    language: "English",
    certification_included: true
  },
  {
    slug: "full-stack-web-development",
    title: "Full Stack Web Development",
    description: "Learn to build modern web applications from front-end to back-end using the latest technologies and best practices.",
    image: "/images/Tech Professional at Work.jpeg",
    category: "Web Development",
    level: "Intermediate",
    duration: "12 weeks",
    price: 4999,
    original_price: 19999,
    status: "published",
    students: 567,
    enrollment_status: "Open",
    rating: 4.7,
    rating_count: 203,
    resources: 45,
    published_date: "2025-04-15",
    learning_outcomes: [
      "Build responsive web applications with React",
      "Create RESTful APIs with Node.js and Express",
      "Work with databases (MongoDB, PostgreSQL)",
      "Implement user authentication and authorization",
      "Deploy applications to cloud platforms",
      "Use version control with Git and GitHub",
      "Apply modern development practices and tools"
    ],
    requirements: [
      "Basic HTML, CSS, and JavaScript knowledge",
      "Familiarity with programming concepts",
      "A computer with internet connection",
      "Willingness to learn and practice coding"
    ],
    modules: [
      {
        id: "m1",
        title: "Frontend Development with React",
        description: "Learn to build interactive user interfaces with React.",
        lessons: [
          {
            id: "l1",
            title: "Introduction to React",
            type: "video",
            content: "Overview of React and its ecosystem.",
            isPreview: true
          }
        ]
      }
    ],
    reviews: [],
    instructor: {
      name: "Mike Chen",
      bio: "Senior Full Stack Developer with experience at top tech companies.",
      image: "/images/instructors/mike-chen.jpg"
    },
    faqs: [
      {
        question: "What technologies will I learn?",
        answer: "You'll learn React, Node.js, Express, MongoDB, PostgreSQL, and deployment strategies."
      }
    ],
    tags: ["React", "Node.js", "JavaScript", "Full Stack"],
    language: "English",
    certification_included: true
  },
  {
    slug: "cybersecurity-fundamentals",
    title: "Cybersecurity Fundamentals",
    description: "Learn essential cybersecurity concepts, tools, and practices to protect digital assets and systems from threats.",
    image: "/images/Control Room Activity.jpeg",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "10 weeks",
    price: 3499,
    original_price: 12999,
    status: "published",
    students: 234,
    enrollment_status: "Open",
    rating: 4.6,
    rating_count: 89,
    resources: 28,
    published_date: "2025-03-20",
    learning_outcomes: [
      "Understand cybersecurity principles and frameworks",
      "Identify and assess security vulnerabilities",
      "Implement security controls and countermeasures",
      "Use security tools for monitoring and analysis",
      "Develop incident response procedures",
      "Apply risk management strategies"
    ],
    requirements: [
      "Basic computer and networking knowledge",
      "No prior cybersecurity experience required",
      "Interest in information security",
      "A computer with internet connection"
    ],
    modules: [
      {
        id: "m1",
        title: "Introduction to Cybersecurity",
        description: "Overview of cybersecurity landscape and key concepts.",
        lessons: [
          {
            id: "l1",
            title: "What is Cybersecurity?",
            type: "video",
            content: "Introduction to cybersecurity and its importance.",
            isPreview: true
          }
        ]
      }
    ],
    reviews: [],
    instructor: {
      name: "Alex Rodriguez",
      bio: "Cybersecurity expert with 15+ years in information security.",
      image: "/images/instructors/alex-rodriguez.jpg"
    },
    faqs: [
      {
        question: "Will I get hands-on experience?",
        answer: "Yes, the course includes practical labs and real-world scenarios."
      }
    ],
    tags: ["Cybersecurity", "Information Security", "Risk Management"],
    language: "English",
    certification_included: true
  }
];

// Transform course data to match database schema
function transformCourseForDB(course) {
  return {
    // Let Supabase auto-generate the UUID for id
    slug: course.slug,
    title: course.title,
    description: course.description,
    price: course.price,
    original_price: course.original_price || null,
    image: course.image,
    category: course.category,
    level: course.level,
    duration: course.duration || null,
    status: course.status || 'published',
    students: course.students || 0,
    enrollment_status: course.enrollment_status || 'Open',
    rating: course.rating || 0,
    rating_count: course.rating_count || 0,
    resources: course.resources || 0,
    published_date: course.published_date || new Date().toISOString().split('T')[0],
    enrollments: course.enrollments || course.students || 0,
    learning_outcomes: course.learning_outcomes || [],
    requirements: course.requirements || [],
    modules: course.modules || [],
    reviews: course.reviews || [],
    instructor: course.instructor || null,
    faqs: course.faqs || [],
    tags: course.tags || [],
    thumbnail: course.thumbnail || null,
    schedule: course.schedule || null,
    language: course.language || 'English',
    certification_included: course.certification_included || false
  };
}

async function populateCourses() {
  try {
    console.log('Starting to populate courses in Supabase...');
    
    // Transform courses for database
    const transformedCourses = sampleCourses.map(transformCourseForDB);
    console.log(`Found ${transformedCourses.length} courses to insert`);
    
    // Clear existing courses (optional - remove if you want to keep existing data)
    console.log('Clearing existing courses...');
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.warn('Warning: Could not clear existing courses:', deleteError.message);
    }
    
    // Insert courses in batches to avoid timeout
    const batchSize = 10;
    for (let i = 0; i < transformedCourses.length; i += batchSize) {
      const batch = transformedCourses.slice(i, i + batchSize);
      console.log(`Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(transformedCourses.length/batchSize)}...`);
      
      const { data, error } = await supabase
        .from('courses')
        .insert(batch)
        .select();
      
      if (error) {
        console.error('Error inserting batch:', error);
        console.error('Failed batch data:', JSON.stringify(batch, null, 2));
        throw error;
      }
      
      console.log(`Successfully inserted ${batch.length} courses`);
    }
    
    // Verify insertion
    const { data: allInsertedCourses, error: countError } = await supabase
      .from('courses')
      .select('id, title, slug')
      .order('title');
    
    if (countError) {
      console.error('Error verifying courses:', countError);
    } else {
      console.log(`\nSuccessfully populated ${allInsertedCourses.length} courses:`);
      allInsertedCourses.forEach(course => {
        console.log(`- ${course.title} (${course.slug})`);
      });
    }
    
    console.log('\n✅ Course population completed successfully!');
    console.log('\nYou can now test your application - the courses should load from Supabase.');
    
  } catch (error) {
    console.error('❌ Error populating courses:', error);
    process.exit(1);
  }
}

// Run the script
populateCourses();