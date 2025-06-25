import { Course } from '../types/course';

// New courses to be added to courses.ts
export const newCourses: Course[] = [
  {
    id: "6",
    slug: "prompt-engineering-mastery",
    title: "Prompt Engineering Mastery",
    description: "Master the art of crafting effective prompts for AI language models. Learn advanced techniques for optimizing AI interactions.",
    image: "/images/Colorful Sticky Notes Brainstorming.jpeg",
    category: "Prompt Engineering",
    level: "Beginner",
    duration: "6 weeks",
    status: "published",
    students: 0,
    enrollmentStatus: "Open",
    rating: 5.0,
    ratingCount: 0,
    resources: 15,
    price: 3999,
    originalPrice: 7999,
    publishedDate: "2025-05-01",
    enrollments: 0,
    instructor: {
      name: "Industry Expert",
      bio: "An industry professional with extensive experience in prompt engineering and AI systems optimization.",
      image: "https://picsum.photos/200/200?random=6"
    },
    learningOutcomes: [
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
    ]
  },
  {
    id: "7", 
    slug: "agentic-ai-development",
    title: "Agentic AI Development",
    description: "Learn to build autonomous AI agents that can perform complex tasks independently. Master the creation of AI systems that can plan, reason, and execute multi-step operations.",
    image: "/images/Robotic Hand Typing.jpeg",
    category: "Agentic AI",
    level: "Advanced",
    duration: "10 weeks",
    status: "published",
    students: 0,
    enrollmentStatus: "Open",
    rating: 5.0,
    ratingCount: 0,
    resources: 20,
    price: 3999,
    originalPrice: 7999,
    publishedDate: "2025-05-15",
    enrollments: 0,
    instructor: {
      name: "Industry Expert",
      bio: "An industry professional with extensive experience in autonomous AI systems and multi-agent architectures.",
      image: "https://picsum.photos/200/200?random=7"
    },
    learningOutcomes: [
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
    ]
  },
  {
    id: "8",
    slug: "ml-devops-basic",
    title: "Machine Learning DevOps (ML DevOps) Basic",
    description: "Learn the fundamentals of MLOps and DevOps practices for machine learning projects. Master the tools and workflows for deploying, monitoring, and maintaining ML models in production environments.",
    image: "/images/Tech-Savvy Professional in a Multiscreen Workspace.jpeg",
    category: "Machine Learning",
    level: "Intermediate",
    duration: "8 weeks",
    status: "published",
    students: 0,
    enrollmentStatus: "Open",
    rating: 5.0,
    ratingCount: 0,
    resources: 22,
    price: 3999,
    originalPrice: 7999,
    publishedDate: "2025-06-15",
    enrollments: 0,
    instructor: {
      name: "Industry Expert",
      bio: "An experienced ML engineer with expertise in deploying and maintaining machine learning systems at scale.",
      image: "https://picsum.photos/200/200?random=8"
    },
    learningOutcomes: [
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
      },
      {
        id: "mlops-m3",
        title: "CI/CD for Machine Learning",
        description: "Build continuous integration and deployment pipelines for ML projects.",
        lessons: [
          {
            id: "mlops-m3-l1",
            title: "CI/CD Principles for ML",
            type: "video",
            content: "Understanding how CI/CD applies to machine learning workflows."
          },
          {
            id: "mlops-m3-l2",
            title: "Building ML Pipelines",
            type: "lab",
            content: "Create automated pipelines for data processing, model training, and evaluation."
          },
          {
            id: "mlops-m3-l3",
            title: "Automated Testing for ML Models",
            type: "lab",
            content: "Implement tests for data quality, model performance, and system integration."
          }
        ]
      },
      {
        id: "mlops-m4",
        title: "Model Deployment and Monitoring",
        description: "Learn strategies for deploying ML models and monitoring them in production.",
        lessons: [
          {
            id: "mlops-m4-l1",
            title: "Deployment Strategies",
            type: "video",
            content: "Explore different approaches to deploying ML models to production."
          },
          {
            id: "mlops-m4-l2",
            title: "Containerizing ML Models",
            type: "lab",
            content: "Package ML models using Docker for consistent deployment."
          },
          {
            id: "mlops-m4-l3",
            title: "Model Monitoring and Observability",
            type: "lab",
            content: "Set up monitoring for model performance, drift, and system health."
          },
          {
            id: "mlops-m4-l4",
            title: "Automated Retraining Workflows",
            type: "video",
            content: "Design systems for detecting when models need retraining and automating the process."
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
    ]
  }
];
