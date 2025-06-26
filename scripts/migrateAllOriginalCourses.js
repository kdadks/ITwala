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

// All original course data from your project files
const allOriginalCourses = [
  // From courses.ts - AI & Machine Learning Fundamentals (complete version)
  {
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
    enrollments: 345,
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
          },
          {
            id: "l2",
            title: "Types of Machine Learning",
            type: "video",
            content: "Learn about supervised, unsupervised, and reinforcement learning."
          },
          {
            id: "l3",
            title: "Setting Up Your Development Environment",
            type: "lab",
            content: "Install and configure Python, Jupyter Notebooks, and essential ML libraries."
          }
        ]
      },
      {
        id: "m2",
        title: "Machine Learning Fundamentals",
        description: "Master the core concepts and techniques of machine learning.",
        lessons: [
          {
            id: "l4",
            title: "Data Preprocessing",
            type: "video",
            content: "Learn how to prepare and clean data for machine learning models."
          },
          {
            id: "l5",
            title: "Feature Engineering",
            type: "lab",
            content: "Practice creating and selecting features for your models."
          }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Sanjay Verma",
        rating: 5,
        date: "2025-05-15",
        comment: "Excellent course! The hands-on projects really helped me understand AI concepts.",
        userImage: "https://picsum.photos/100/100?random=1"
      },
      {
        id: 2,
        user: "Priya Sharma",
        rating: 4,
        date: "2025-05-10",
        comment: "The practical exercises and real-world examples made complex topics easy to understand.",
        userImage: "https://picsum.photos/100/100?random=2"
      }
    ],
    faqs: [
      {
        question: "How long do I have access to the course?",
        answer: "You will have lifetime access to the course materials."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "Yes, this course is designed for beginners with basic Python knowledge."
      },
      {
        question: "What software will I need?",
        answer: "You'll need Python 3.8 or higher, and we'll help you set up all necessary libraries and tools."
      }
    ],
    instructor: {
      name: "Dr. Sarah Johnson",
      bio: "AI researcher with 10+ years of experience in machine learning and data science.",
      image: "/images/instructors/sarah-johnson.jpg"
    },
    tags: ["AI", "Machine Learning", "Python", "Data Science"],
    language: "English",
    certification_included: true
  },

  // From courses.ts - AI Product Management (complete version)
  {
    slug: "AI product-management",
    title: "AI Product Management",
    description: "Learn how to build and manage successful AI products from ideation to launch. Develop skills in market research, user experience design, and agile product development.",
    image: "/images/Professional Woman at Planning Board.jpeg",
    category: "Product Management",
    level: "Intermediate",
    duration: "10 weeks",
    price: 3999,
    original_price: 13999,
    status: "published",
    students: 287,
    enrollment_status: "Open",
    rating: 4.5,
    rating_count: 3,
    resources: 22,
    published_date: "2025-04-01",
    enrollments: 287,
    learning_outcomes: [
      "Define product strategy and vision",
      "Conduct effective market and user research",
      "Create compelling product roadmaps",
      "Prioritize features using data-driven frameworks",
      "Work effectively with engineering and design teams",
      "Manage product development using agile methodologies",
      "Launch products and measure success",
      "Develop a product manager mindset"
    ],
    requirements: [
      "Basic understanding of software development",
      "Familiarity with project management concepts",
      "No specific technical skills required",
      "A computer with internet connection"
    ],
    modules: [
      {
        id: "pm1",
        title: "Introduction to Product Management",
        description: "Understand the role of a product manager and key responsibilities.",
        lessons: [
          {
            id: "pm1-l1",
            title: "What is Product Management?",
            type: "video",
            content: "Overview of product management and how it differs from project management and other roles."
          },
          {
            id: "pm1-l2",
            title: "The Product Development Lifecycle",
            type: "video",
            content: "Learn about the different stages from idea to market and ongoing iteration."
          },
          {
            id: "pm1-l3",
            title: "Key Product Management Frameworks",
            type: "reading",
            content: "Review of essential frameworks like AARRR, Kano Model, and MoSCoW."
          },
          {
            id: "pm1-l4",
            title: "Product Manager Skills Assessment",
            type: "quiz",
            content: "Evaluate your current skills and identify areas for improvement."
          }
        ]
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Neha Gupta",
        rating: 5,
        date: "2025-04-15",
        comment: "This course transformed my approach to product management. The roadmapping techniques are invaluable!",
        userImage: "https://picsum.photos/100/100?random=3"
      },
      {
        id: 2,
        user: "Arjun Reddy",
        rating: 4,
        date: "2025-04-22",
        comment: "Great practical insights that I could apply immediately in my role. Would have liked more case studies."
      },
      {
        id: 3,
        user: "Priya Krishnan",
        rating: 5,
        date: "2025-05-20",
        comment: "The instructor's real-world examples made complex concepts easy to understand. Highly recommended!"
      }
    ],
    faqs: [
      {
        question: "Do I need technical background for this course?",
        answer: "No technical background is required, but basic understanding of software development is helpful."
      },
      {
        question: "Will this course help me transition to product management?",
        answer: "Yes, this course is designed to help professionals transition into product management roles."
      }
    ],
    instructor: {
      name: "Mike Chen",
      bio: "Senior Product Manager with experience at top tech companies.",
      image: "/images/instructors/mike-chen.jpg"
    },
    tags: ["Product Management", "Strategy", "Agile", "Leadership"],
    language: "English",
    certification_included: true
  },

  // From newcourses.ts - Prompt Engineering Mastery
  {
    slug: "prompt-engineering-mastery",
    title: "Prompt Engineering Mastery",
    description: "Master the art of crafting effective prompts for AI language models. Learn advanced techniques for optimizing AI interactions.",
    image: "/images/Colorful Sticky Notes Brainstorming.jpeg",
    category: "Prompt Engineering",
    level: "Beginner",
    duration: "6 weeks",
    status: "published",
    students: 0,
    enrollment_status: "Open",
    rating: 5.0,
    rating_count: 0,
    resources: 15,
    price: 3999,
    original_price: 7999,
    published_date: "2025-05-01",
    enrollments: 0,
    learning_outcomes: [
      "Understand prompt engineering principles",
      "Master different prompting techniques",
      "Learn chain-of-thought prompting",
      "Implement system and user role prompts",
      "Create effective few-shot learning prompts",
      "Optimize prompts for specific use cases",
      "Handle complex multi-step tasks",
      "Build AI applications with prompt engineering"
    ],
    requirements: [
      "Basic understanding of AI concepts",
      "No coding experience required",
      "Curiosity about AI and language models",
      "A computer with internet connection"
    ],
    modules: [
      {
        id: "pe-m1",
        title: "Introduction to Prompt Engineering",
        description: "Understand the fundamentals of prompt engineering and its importance in AI.",
        lessons: [
          {
            id: "pe-m1-l1",
            title: "What is Prompt Engineering?",
            type: "video",
            content: "Overview of prompt engineering and its role in AI systems.",
            isPreview: true
          },
          {
            id: "pe-m1-l2",
            title: "Types of Language Models",
            type: "video",
            content: "Understanding different language models and their capabilities."
          }
        ]
      },
      {
        id: "pe-m2",
        title: "Prompt Design Patterns",
        description: "Learn effective patterns for designing prompts.",
        lessons: [
          {
            id: "pe-m2-l1",
            title: "Basic Prompt Structures",
            type: "lab",
            content: "Practice creating different types of prompts."
          },
          {
            id: "pe-m2-l2",
            title: "Role-based Prompting",
            type: "video",
            content: "Learn how to use system and user roles in prompts."
          }
        ]
      }
    ],
    reviews: [],
    faqs: [
      {
        question: "What is prompt engineering?",
        answer: "Prompt engineering is the practice of designing and optimizing inputs to AI language models to get desired outputs effectively."
      },
      {
        question: "Do I need programming experience?",
        answer: "No programming experience is required. This course focuses on understanding and crafting effective prompts for AI models."
      }
    ],
    instructor: {
      name: "Industry Expert",
      bio: "An industry professional with extensive experience in prompt engineering and AI systems optimization.",
      image: "https://picsum.photos/200/200?random=6"
    },
    tags: ["Prompt Engineering", "AI", "Language Models", "GPT"],
    language: "English",
    certification_included: true
  },

  // From newcourses.ts - Agentic AI Development
  {
    slug: "agentic-ai-development",
    title: "Agentic AI Development",
    description: "Learn to build autonomous AI agents that can perform complex tasks independently. Master the creation of AI systems that can plan, reason, and execute multi-step operations.",
    image: "/images/Robotic Hand Typing.jpeg",
    category: "Agentic AI",
    level: "Advanced",
    duration: "10 weeks",
    status: "published",
    students: 0,
    enrollment_status: "Open",
    rating: 5.0,
    rating_count: 0,
    resources: 20,
    price: 3999,
    original_price: 7999,
    published_date: "2025-05-15",
    enrollments: 0,
    learning_outcomes: [
      "Understand AI agent architectures",
      "Implement planning and reasoning systems",
      "Create task-oriented AI agents",
      "Build multi-agent systems",
      "Develop memory systems for agents",
      "Learn agent communication protocols",
      "Implement safety measures in AI agents",
      "Deploy autonomous AI systems"
    ],
    requirements: [
      "Strong programming background",
      "Understanding of AI and ML concepts",
      "Experience with Python",
      "Familiarity with NLP concepts"
    ],
    modules: [
      {
        id: "aa-m1",
        title: "Fundamentals of Agentic AI",
        description: "Introduction to AI agents and their core components.",
        lessons: [
          {
            id: "aa-m1-l1",
            title: "What are AI Agents?",
            type: "video",
            content: "Understanding the concept of autonomous AI agents.",
            isPreview: true
          },
          {
            id: "aa-m1-l2",
            title: "Agent Architectures",
            type: "video",
            content: "Different approaches to building AI agents."
          }
        ]
      },
      {
        id: "aa-m2",
        title: "Building Autonomous Agents",
        description: "Practical implementation of AI agents.",
        lessons: [
          {
            id: "aa-m2-l1",
            title: "Planning Systems",
            type: "lab",
            content: "Implementing planning algorithms for AI agents."
          },
          {
            id: "aa-m2-l2",
            title: "Memory and State Management",
            type: "video",
            content: "Building memory systems for long-term task execution."
          }
        ]
      }
    ],
    reviews: [],
    faqs: [
      {
        question: "What are AI agents?",
        answer: "AI agents are autonomous systems that can perceive their environment and take actions to achieve specific goals."
      },
      {
        question: "Is this course suitable for beginners?",
        answer: "This is an advanced course that requires prior experience with AI concepts and programming."
      }
    ],
    instructor: {
      name: "Industry Expert",
      bio: "An industry professional with extensive experience in autonomous AI systems and multi-agent architectures.",
      image: "https://picsum.photos/200/200?random=7"
    },
    tags: ["Agentic AI", "Autonomous Systems", "AI Agents", "Advanced AI"],
    language: "English",
    certification_included: true
  },

  // From newcourses.ts - ML DevOps Basic
  {
    slug: "ml-devops-basic",
    title: "Machine Learning DevOps (ML DevOps) Basic",
    description: "Learn the fundamentals of MLOps and DevOps practices for machine learning projects. Master the tools and workflows for deploying, monitoring, and maintaining ML models in production environments.",
    image: "/images/Tech-Savvy Professional in a Multiscreen Workspace.jpeg",
    category: "Machine Learning",
    level: "Intermediate",
    duration: "8 weeks",
    status: "published",
    students: 0,
    enrollment_status: "Open",
    rating: 5.0,
    rating_count: 0,
    resources: 22,
    price: 3999,
    original_price: 7999,
    published_date: "2025-06-15",
    enrollments: 0,
    learning_outcomes: [
      "Understand MLOps principles and workflows",
      "Build CI/CD pipelines for ML projects",
      "Implement model versioning and tracking",
      "Deploy ML models to production environments",
      "Monitor model performance and drift",
      "Automate model retraining processes",
      "Implement A/B testing for model deployment",
      "Apply best practices for ML system architecture"
    ],
    requirements: [
      "Basic understanding of machine learning concepts",
      "Familiarity with Python programming",
      "Experience with at least one ML framework (TensorFlow, PyTorch, etc.)",
      "Basic knowledge of Docker and containerization"
    ],
    modules: [
      {
        id: "mlops-m1",
        title: "Introduction to ML DevOps",
        description: "Understand the fundamentals of MLOps and its importance in the ML lifecycle.",
        lessons: [
          {
            id: "mlops-m1-l1",
            title: "What is ML DevOps?",
            type: "video",
            content: "Overview of ML DevOps and how it differs from traditional DevOps.",
            isPreview: true
          },
          {
            id: "mlops-m1-l2",
            title: "The ML Lifecycle",
            type: "video",
            content: "Understanding the end-to-end machine learning lifecycle and where MLOps fits in."
          },
          {
            id: "mlops-m1-l3",
            title: "Setting Up Your MLOps Environment",
            type: "lab",
            content: "Configure your development environment with essential MLOps tools and frameworks."
          }
        ]
      },
      {
        id: "mlops-m2",
        title: "Version Control for ML Projects",
        description: "Learn how to effectively version control ML models, data, and code.",
        lessons: [
          {
            id: "mlops-m2-l1",
            title: "Git for ML Projects",
            type: "video",
            content: "Best practices for using Git with machine learning projects."
          },
          {
            id: "mlops-m2-l2",
            title: "Data Versioning",
            type: "lab",
            content: "Implement data versioning using DVC (Data Version Control)."
          },
          {
            id: "mlops-m2-l3",
            title: "Model Versioning and Registry",
            type: "lab",
            content: "Set up and use a model registry to track model versions and metadata."
          }
        ]
      }
    ],
    reviews: [],
    faqs: [
      {
        question: "What is ML DevOps?",
        answer: "ML DevOps (or MLOps) is a set of practices that combines Machine Learning, DevOps, and Data Engineering to deploy and maintain ML systems in production reliably and efficiently."
      },
      {
        question: "Is this course suitable for beginners in machine learning?",
        answer: "This course requires basic understanding of machine learning concepts. If you're new to ML, we recommend taking our 'AI & Machine Learning Fundamentals' course first."
      },
      {
        question: "Will I learn how to build ML models in this course?",
        answer: "This course focuses on the operational aspects of ML systems rather than model building. We assume you already have some experience with creating ML models."
      },
      {
        question: "What tools will we use in this course?",
        answer: "You'll work with industry-standard tools like Git, DVC, Docker, Kubernetes, MLflow, Kubeflow, and various cloud services for ML deployment."
      }
    ],
    instructor: {
      name: "Industry Expert",
      bio: "An experienced ML engineer with expertise in deploying and maintaining machine learning systems at scale.",
      image: "https://picsum.photos/200/200?random=8"
    },
    tags: ["MLOps", "DevOps", "Machine Learning", "CI/CD", "Docker"],
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

async function migrateAllCourses() {
  try {
    console.log('🚀 Starting migration of all original course data to Supabase...');
    
    // Transform courses for database
    const transformedCourses = allOriginalCourses.map(transformCourseForDB);
    console.log(`📚 Found ${transformedCourses.length} courses to migrate`);
    
    // Clear existing courses first
    console.log('🧹 Clearing existing courses...');
    const { error: deleteError } = await supabase
      .from('courses')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    if (deleteError) {
      console.warn('⚠️  Warning: Could not clear existing courses:', deleteError.message);
    }
    
    // Insert courses in batches
    const batchSize = 5;
    for (let i = 0; i < transformedCourses.length; i += batchSize) {
      const batch = transformedCourses.slice(i, i + batchSize);
      console.log(`📦 Inserting batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(transformedCourses.length/batchSize)}...`);
      
      const { data, error } = await supabase
        .from('courses')
        .insert(batch)
        .select();
      
      if (error) {
        console.error('❌ Error inserting batch:', error);
        console.error('Failed batch data:', JSON.stringify(batch, null, 2));
        throw error;
      }
      
      console.log(`✅ Successfully inserted ${batch.length} courses`);
    }
    
    // Verify migration
    const { data: allInsertedCourses, error: countError } = await supabase
      .from('courses')
      .select('id, title, slug, category')
      .order('title');
    
    if (countError) {
      console.error('❌ Error verifying courses:', countError);
    } else {
      console.log(`\n🎉 Successfully migrated ${allInsertedCourses.length} courses:`);
      allInsertedCourses.forEach(course => {
        console.log(`   📖 ${course.title} (${course.category}) - ${course.slug}`);
      });
    }
    
    console.log('\n✅ Migration completed successfully!');
    console.log('🌐 Your application now has all original course data in Supabase.');
    console.log('🔗 Visit /courses to see all migrated courses.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateAllCourses();