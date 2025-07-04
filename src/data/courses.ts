import { Course } from '../types/course';

// Just export the base courses
export const courseData: Course[] = [
  {
    id: "1",
    slug: "ai-machine-learning-fundamentals",
    title: "AI & Machine Learning Fundamentals",
    description: "Master the fundamentals of artificial intelligence and machine learning with hands-on projects. Learn how to build and deploy machine learning models that solve real-world problems.",
    image: "/images/Cybernetic Workspace.jpeg",
    category: "Artificial Intelligence",
    level: "Beginner",
    duration: "8 weeks",
    price: 3999,
    originalPrice: 14999,
    status: "published",
    students: 345,
    enrollmentStatus: "Open",
    rating: 4.8,
    ratingCount: 128,
    resources: 35,
    publishedDate: "2025-05-01",
    learningOutcomes: [
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
    ]
  },
  {
    id: "2",
    slug: "AI product-management",
    title: "AI Product Management",
    description: "Learn how to build and manage successful AI products from ideation to launch. Develop skills in market research, user experience design, and agile product development.",
    image: "/images/Professional Woman at Planning Board.jpeg",  // Updated to relevant course image
    category: "Product Management",
    level: "Intermediate",
    resources: 22,
    publishedDate: "2025-04-01",
    price: 3999,
    originalPrice: 13999,  // Updated to match new pricing strategy
    status: "published",
    enrollments: 287,
    learningOutcomes: [
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
        title: "Introduction to Product Management",
        description: "Understand the role of a product manager and key responsibilities.",
        lessons: [
          {
            id: "1",
            title: "What is Product Management?",
            type: "video",
            content: "Overview of product management and how it differs from project management and other roles."
          },
          {
            id: "2",
            title: "The Product Development Lifecycle",
            type: "video",
            content: "Learn about the different stages from idea to market and ongoing iteration."
          },
          {
            id: "3",
            title: "Key Product Management Frameworks",
            type: "reading",
            content: "Review of essential frameworks like AARRR, Kano Model, and MoSCoW."
          },
          {
            id: "4",
            title: "Product Manager Skills Assessment",
            type: "quiz",
            content: "Evaluate your current skills and identify areas for improvement."
          }
        ],
        id: ''
      },
      {
        title: "User Research and Market Analysis",
        description: "Methods for understanding user needs and market opportunities.",
        lessons: [
          {
            id: "5",
            title: "User Research Techniques",
            type: "video",
            content: "Learn about user interviews, surveys, focus groups, and usability testing."
          },
          {
            id: "6",
            title: "Creating User Personas",
            type: "lab",
            content: "Develop detailed user personas to guide product development decisions."
          },
          {
            id: "7",
            title: "Market Analysis for Product Managers",
            type: "video",
            content: "How to analyze competition, market size, and trends to inform product strategy."
          },
          {
            id: "8",
            title: "Feature Prioritization Workshop",
            type: "lab",
            content: "Use frameworks like RICE, Value vs. Effort, and Kano to prioritize features."
          }
        ],
        id: ''
      },
      {
        title: "Product Strategy and Roadmapping",
        description: "Develop strategic thinking and communication skills for product planning.",
        lessons: [
          {
            id: "9",
            title: "Defining Product Vision and Strategy",
            type: "video",
            content: "Learn how to craft a compelling product vision and strategic framework."
          },
          {
            id: "10",
            title: "Creating Effective Product Roadmaps",
            type: "lab",
            content: "Hands-on exercise to build outcome-driven roadmaps that align with business goals."
          },
          {
            id: "11",
            title: "Communicating with Stakeholders",
            type: "video",
            content: "Strategies for effective communication with executives, engineers, designers, and customers."
          },
          {
            id: "12",
            title: "OKRs for Product Management",
            type: "lab",
            content: "Set and track Objectives and Key Results for your product initiatives."
          }
        ],
        id: ''
      },
      {
        title: "Product Development and Execution",
        description: "Successfully manage the build phase of product development.",
        lessons: [
          {
            id: "13",
            title: "Working with Development Teams",
            type: "video",
            content: "Best practices for collaborating with engineers, designers, and other team members."
          },
          {
            id: "14",
            title: "Agile Product Management",
            type: "lab",
            content: "Apply agile methodologies to product management processes."
          },
          {
            id: "15",
            title: "Writing Effective User Stories",
            type: "video",
            content: "Learn to write clear, actionable user stories and acceptance criteria."
          },
          {
            id: "16",
            title: "Product Launch Planning",
            type: "lab",
            content: "Create a comprehensive launch plan for a new product or feature."
          }
        ],
        id: ''
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Neha Gupta",
        rating: 5,
        date: "2025-04-15",
        comment: "This course transformed my approach to product management. The roadmapping techniques are invaluable!",
        userImage: "https://picsum.photos/100/100?random=3",  // Placeholder for user image
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
        question: "Is this course suitable for beginners?",
        answer: "While beginners can benefit from this course, it's designed for those with some familiarity with software development or project management concepts."
      },
      {
        question: "Will this course help me transition into a product management role?",
        answer: "Yes, many of our students have successfully transitioned into product management roles after completing this course and building a portfolio."
      },
      {
        question: "Do you provide templates for product documentation?",
        answer: "Yes, we provide templates for product requirements documents, roadmaps, user stories, and other essential product management artifacts."
      },
      {
        question: "Is there any group work or networking opportunity with other students?",
        answer: "Yes, we have group projects and a community forum where you can connect with other aspiring and experienced product managers."
      }
    ]
  },
  {
    id: "3",
    slug: "java-programming-masterclass",
    title: "Java Programming Masterclass",
    description: "Comprehensive Java programming course covering everything from basics to advanced topics. Perfect for beginners and those looking to enhance their Java skills.",
    image: "/images/Tech Professional at Work.jpeg",  // Updated to relevant course image
    category: "Software Development",
    level: "Beginner to Advanced",
    resources: 35,
    publishedDate: "2025-04-01",
    price: 3999,
    originalPrice: 13999,  // Updated to match new pricing strategy
    status: "published",
    enrollments: 523,
    learningOutcomes: [
      "Master Java syntax and fundamentals",
      "Understand object-oriented programming concepts",
      "Build GUI applications with JavaFX",
      "Work with databases using JDBC",
      "Develop web applications with Spring Boot",
      "Implement data structures and algorithms in Java",
      "Utilize concurrency and multithreading",
      "Apply best practices for clean code and testing"
    ],
    requirements: [
      "No prior programming experience required",
      "A computer (Windows, Mac, or Linux)",
      "Desire to learn and practice regularly",
      "Internet connection for downloading tools and libraries"
    ],
    modules: [
      {
        title: "Java Basics and Environment Setup",
        description: "Get started with Java programming and set up your development environment.",
        lessons: [
          {
            id: "1",
            title: "Introduction to Java and Its Ecosystem",
            type: "video",
            content: "Overview of Java, its features, and its role in modern software development."
          },
          {
            id: "2",
            title: "Setting Up Your Development Environment",
            type: "lab",
            content: "Install JDK, set up IDE (IntelliJ IDEA), and configure your workspace."
          },
          {
            id: "3",
            title: "Your First Java Program",
            type: "lab",
            content: "Write, compile, and run a simple Java application with explanation of each step."
          },
          {
            id: "4",
            title: "Understanding Java Syntax",
            type: "video",
            content: "Learn about variables, data types, operators, and control flow statements."
          }
        ],
        id: ''
      },
      {
        title: "Object-Oriented Programming in Java",
        description: "Master the fundamentals of object-oriented programming with Java.",
        lessons: [
          {
            id: "5",
            title: "Classes and Objects",
            type: "video",
            content: "Understand how to define classes, create objects, and work with instance variables and methods."
          },
          {
            id: "6",
            title: "Inheritance and Polymorphism",
            type: "lab",
            content: "Implement inheritance hierarchies and utilize polymorphism for flexible code."
          },
          {
            id: "7",
            title: "Interfaces and Abstract Classes",
            type: "video",
            content: "Learn when and how to use interfaces and abstract classes in your designs."
          },
          {
            id: "8",
            title: "Encapsulation and Data Hiding",
            type: "lab",
            content: "Apply encapsulation principles to create robust, maintainable code."
          }
        ],
        id: ''
      },
      {
        title: "Java Collections and Generics",
        description: "Work with Java's powerful collections framework and generic types.",
        lessons: [
          {
            id: "9",
            title: "Introduction to Collections Framework",
            type: "video",
            content: "Overview of Lists, Sets, Maps, and other collection interfaces and implementations."
          },
          {
            id: "10",
            title: "Working with Lists and Arrays",
            type: "lab",
            content: "Hands-on exercises with ArrayList, LinkedList, and arrays."
          },
          {
            id: "11",
            title: "Maps and Sets in Practice",
            type: "lab",
            content: "Implement solutions using HashMap, TreeMap, HashSet, and TreeSet."
          },
          {
            id: "12",
            title: "Generics and Type Safety",
            type: "video",
            content: "Understand generic types and how they provide compile-time type safety."
          }
        ],
        id: ''
      },
      {
        title: "Advanced Java Features",
        description: "Explore advanced Java features for professional development.",
        lessons: [
          {
            id: "13",
            title: "Exception Handling",
            type: "video",
            content: "Learn to handle errors and exceptions effectively in Java applications."
          },
          {
            id: "14",
            title: "Multithreading and Concurrency",
            type: "lab",
            content: "Create multi-threaded applications and understand synchronization."
          },
          {
            id: "15",
            title: "Java I/O and NIO",
            type: "video",
            content: "Work with files, streams, and the newer NIO APIs for efficient I/O operations."
          },
          {
            id: "16",
            title: "Lambda Expressions and Streams",
            type: "lab",
            content: "Utilize functional programming features introduced in Java 8 and beyond."
          }
        ],
        id: ''
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Sanjay Verma",
        rating: 5,
        date: "2025-05-15",
        comment: "This course took me from knowing nothing about this field to building complete applications. The explanations are clear and the exercises reinforce learning."
      },
      {
        id: 2,
        user: "Divya Sharma",
        rating: 5,
        date: "2025-05-22",
        comment: "Best course I've found! The instructor explains complex topics in an easy-to-understand way, and the project-based approach is very effective."
      },
      {
        id: 3,
        user: "Mohan Rao",
        rating: 4,
        date: "2025-05-28",
        comment: "Very comprehensive coverage. The practical approach really helps in understanding concepts."
      }
    ],
    faqs: [
      {
        question: "Is this course suitable for complete beginners?",
        answer: "Yes, this course starts from the very basics and gradually progresses to advanced topics, making it suitable for beginners."
      },
      {
        question: "Will I be able to build real-world applications after this course?",
        answer: "Absolutely! The course includes several projects that simulate real-world applications, and by the end, you'll have the skills to create your own."
      },
      {
        question: "How long does it take to complete the course?",
        answer: "The course content is 48 hours, but most students take 2-3 months to complete it, studying about 5-7 hours per week."
      },
      {
        question: "Are there any opportunities for job placement after completion?",
        answer: "We have partnerships with several companies looking for Java developers, and our career services team can help with resume building and interview preparation."
      }
    ]
  },
  {
    id: "4",
    slug: "AI software-testing",
    title: "AI Software Testing",
    description: "Learn modern approaches to AI software testing automation using industry-standard tools and frameworks. Build a strong foundation in quality assurance principles.",
    image: "/images/Control Room Activity.jpeg",  // Updated to relevant course image
    category: "Software Testing",
    level: "Intermediate",
    resources: 25,
    publishedDate: "2025-04-01",
    price: 3999,
    originalPrice: 13999,  // Updated to match new pricing strategy
    status: "published",
    enrollments: 198,
    learningOutcomes: [
      "Understand software testing principles and methodologies",
      "Design effective test cases and test plans",
      "Implement automated testing using Selenium WebDriver",
      "Create API tests with Postman and RestAssured",
      "Build continuous integration pipelines for testing",
      "Implement mobile application testing",
      "Apply performance and security testing techniques",
      "Generate comprehensive test reports"
    ],
    requirements: [
      "Basic understanding of programming concepts",
      "Familiarity with web technologies (HTML, CSS, JavaScript)",
      "Knowledge of any programming language (Java preferred)",
      "A computer with internet connection"
    ],
    modules: [
      {
        title: "Fundamentals of Software Testing",
        description: "Introduction to testing concepts, methodologies, and best practices.",
        lessons: [
          {
            id: "1",
            title: "Introduction to Software Testing",
            type: "video",
            content: "Overview of testing types, levels, and their importance in the software development lifecycle."
          },
          {
            id: "2",
            title: "Testing Methodologies",
            type: "video",
            content: "Learn about different testing approaches including agile testing, TDD, BDD, and traditional methods."
          },
          {
            id: "3",
            title: "Creating Test Cases and Test Plans",
            type: "lab",
            content: "Hands-on practice writing effective test cases and comprehensive test plans."
          },
          {
            id: "4",
            title: "Defect Management Process",
            type: "video",
            content: "Understand how to report, track, and manage defects throughout the testing lifecycle."
          }
        ],
        id: ''
      },
      {
        title: "Web UI Testing with Selenium",
        description: "Automated testing for web applications using Selenium WebDriver.",
        lessons: [
          {
            id: "5",
            title: "Introduction to Selenium WebDriver",
            type: "video",
            content: "Overview of Selenium architecture and components for web automation."
          },
          {
            id: "6",
            title: "Setting Up Selenium Environment",
            type: "lab",
            content: "Configure your development environment with Selenium WebDriver, TestNG, and supporting tools."
          },
          {
            id: "7",
            title: "Locating Elements and Browser Interactions",
            type: "lab",
            content: "Practice finding web elements using different locator strategies and performing actions."
          },
          {
            id: "8",
            title: "Building a Page Object Model Framework",
            type: "lab",
            content: "Implement a maintainable testing framework using the Page Object Model design pattern."
          }
        ],
        id: ''
      },
      {
        title: "API Testing",
        description: "Techniques for testing RESTful and SOAP web services.",
        lessons: [
          {
            id: "9",
            title: "Introduction to API Testing",
            type: "video",
            content: "Understand the importance of API testing and key concepts in web services."
          },
          {
            id: "10",
            title: "Postman for API Testing",
            type: "lab",
            content: "Create and execute API tests using Postman, including assertions and test collections."
          },
          {
            id: "11",
            title: "RestAssured Framework",
            type: "lab",
            content: "Implement API tests in Java using RestAssured library with TestNG framework."
          },
          {
            id: "12",
            title: "Mocking and Stubbing APIs",
            type: "video",
            content: "Learn to use mock services for testing APIs in isolation using WireMock and other tools."
          }
        ],
        id: ''
      },
      {
        title: "Continuous Integration and Advanced Testing",
        description: "Integrate automated tests into CI/CD pipelines and explore advanced testing topics.",
        lessons: [
          {
            id: "13",
            title: "Continuous Integration for Testing",
            type: "video",
            content: "Understand how to integrate automated tests into CI/CD pipelines using Jenkins and GitHub Actions."
          },
          {
            id: "14",
            title: "Mobile Testing Automation",
            type: "lab",
            content: "Implement automated tests for mobile applications using Appium."
          },
          {
            id: "15",
            title: "Performance Testing Basics",
            type: "video",
            content: "Introduction to performance testing concepts and tools like JMeter."
          },
          {
            id: "16",
            title: "Security Testing Fundamentals",
            type: "lab",
            content: "Learn basic security testing techniques and tools to identify common vulnerabilities."
          }
        ],
        id: ''
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Amit Patel",
        rating: 5,
        date: "2025-04-10",
        comment: "This course completely transformed my approach to testing. The hands-on projects were challenging and realistic."
      },
      {
        id: 2,
        user: "Ritu Sharma",
        rating: 4,
        date: "2025-05-15",
        comment: "Great content and practical examples. I would have liked more coverage of security testing, but overall very valuable."
      },
      {
        id: 3,
        user: "Karan Singh",
        rating: 5,
        date: "2025-06-02",
        comment: "The instructor's expertise is evident throughout the course. I was able to implement the testing frameworks at my workplace immediately."
      }
    ],
    faqs: [
      {
        question: "Do I need to know how to code to take this course?",
        answer: "Basic programming knowledge is required, especially for automated testing sections. Java knowledge is preferred but not mandatory."
      },
      {
        question: "Which testing tools are covered in this course?",
        answer: "The course covers Selenium WebDriver, TestNG, Postman, RestAssured, Jenkins, and introduces JMeter and Appium."
      },
      {
        question: "Will this course prepare me for ISTQB certification?",
        answer: "While this course covers many topics relevant to ISTQB Foundation Level, it is more focused on practical skills rather than exam preparation."
      },
      {
        question: "Can I use a Mac or Linux computer for this course?",
        answer: "Yes, the tools and frameworks covered in this course work across Windows, Mac, and Linux operating systems."
      }
    ]
  },
  {
    id: "5",
    slug: "salesforce-development-fundamentals",
    title: "Salesforce Development Fundamentals",
    description: "Learn to build custom applications on the Salesforce platform. Master Apex programming, Lightning components, and integration with external systems.",
    image: "/images/Team Presentation Scene.jpeg",  // Updated to relevant course image
    category: "Software Development",
    level: "Beginner to Intermediate",
    resources: 28,
    publishedDate: "2025-04-01",
    price: 3999,
    originalPrice: 13999,  // Updated to match new pricing strategy
    status: "published",
    enrollments: 234,
    learningOutcomes: [
      "Understand Salesforce platform fundamentals",
      "Develop custom applications using Apex and Visualforce",
      "Build Lightning Web Components",
      "Implement triggers, batch jobs, and scheduled processes",
      "Create custom APIs and integrate with external systems",
      "Work with Salesforce data using SOQL and SOSL",
      "Apply security and sharing concepts",
      "Prepare for Salesforce Platform Developer I certification"
    ],
    requirements: [
      "Basic knowledge of object-oriented programming concepts",
      "Familiarity with database concepts",
      "Understanding of web technologies (HTML, CSS, JavaScript)",
      "No prior Salesforce experience required"
    ],
    modules: [
      {
        title: "Salesforce Platform Basics",
        description: "Introduction to the Salesforce platform architecture and capabilities.",
        lessons: [
          {
            id: "1",
            title: "Introduction to Salesforce as a Platform",
            type: "video",
            content: "Overview of Salesforce platform capabilities, architecture, and development approaches."
          },
          {
            id: "2",
            title: "Setting Up Your Developer Environment",
            type: "lab",
            content: "Create a Salesforce Developer Edition org and configure your workspace for development."
          },
          {
            id: "3",
            title: "Data Modeling in Salesforce",
            type: "video",
            content: "Learn about standard and custom objects, fields, relationships, and schema builder."
          },
          {
            id: "4",
            title: "Building a Custom App (Point-and-Click)",
            type: "lab",
            content: "Create a custom application using declarative tools like App Builder and Process Builder."
          }
        ],
        id: ''
      },
      {
        title: "Apex Programming Fundamentals",
        description: "Core Apex programming concepts for Salesforce development.",
        lessons: [
          {
            id: "5",
            title: "Introduction to Apex",
            type: "video",
            content: "Overview of Apex language, execution contexts, governor limits, and best practices."
          },
          {
            id: "6",
            title: "Apex Data Types and Control Structures",
            type: "lab",
            content: "Practice working with variables, collections, conditionals, and loops in Apex."
          },
          {
            id: "7",
            title: "SOQL and SOSL Queries",
            type: "lab",
            content: "Learn to query and search Salesforce data using SOQL and SOSL in Apex."
          },
          {
            id: "8",
            title: "DML Operations and Database Methods",
            type: "video",
            content: "Master data manipulation techniques and transaction control in Apex."
          }
        ],
        id: ''
      },
      {
        title: "Triggers and Asynchronous Apex",
        description: "Advanced Apex development for complex business logic.",
        lessons: [
          {
            id: "9",
            title: "Apex Triggers",
            type: "video",
            content: "Understand trigger events, context variables, and best practices for implementation."
          },
          {
            id: "10",
            title: "Building Trigger Frameworks",
            type: "lab",
            content: "Implement a scalable and maintainable trigger framework for your applications."
          },
          {
            id: "11",
            title: "Asynchronous Apex",
            type: "video",
            content: "Learn about future methods, queueable Apex, batch Apex, and scheduled jobs."
          },
          {
            id: "12",
            title: "Implementing Batch and Scheduled Jobs",
            type: "lab",
            content: "Build batch processes and scheduled jobs for data processing and maintenance tasks."
          }
        ],
        id: ''
      },
      {
        title: "Lightning Web Components and Integration",
        description: "Modern UI development and integration with external systems.",
        lessons: [
          {
            id: "13",
            title: "Introduction to Lightning Web Components",
            type: "video",
            content: "Overview of the Lightning Component Framework and component-based architecture."
          },
          {
            id: "14",
            title: "Building Your First Lightning Web Component",
            type: "lab",
            content: "Create and deploy a custom Lightning Web Component with interactive functionality."
          },
          {
            id: "15",
            title: "Salesforce API Integration",
            type: "video",
            content: "Learn about REST and SOAP API integration patterns with external systems."
          },
          {
            id: "16",
            title: "Implementing a Connected App",
            type: "lab",
            content: "Build an integration solution connecting Salesforce with an external service."
          }
        ],
        id: ''
      }
    ],
    reviews: [
      {
        id: 1,
        user: "Suresh Kumar",
        rating: 5,
        date: "2025-04-05",
        comment: "This course provided the perfect foundation for my Salesforce development career. The instructor explains complex concepts clearly with relevant examples."
      },
      {
        id: 2,
        user: "Meera Patel",
        rating: 4,
        date: "2025-04-12",
        comment: "Very comprehensive coverage of Salesforce development. The hands-on projects were particularly valuable for reinforcing concepts."
      },
      {
        id: 3,
        user: "Vivek Reddy",
        rating: 5,
        date: "2025-05-20",
        comment: "I passed my Platform Developer I certification after completing this course! The curriculum perfectly aligned with the exam objectives."
      }
    ],
    faqs: [
      {
        question: "Do I need to purchase a Salesforce license to take this course?",
        answer: "No, you can sign up for a free Salesforce Developer Edition organization which provides all the features needed for the course."
      },
      {
        question: "Will this course prepare me for Salesforce certification exams?",
        answer: "Yes, this course covers the topics required for the Salesforce Platform Developer I certification. Additional study may be needed for specific exam details."
      },
      {
        question: "How much programming experience do I need before taking this course?",
        answer: "Basic knowledge of object-oriented programming concepts is recommended. If you're familiar with Java, C#, or a similar language, you'll be well-prepared."
      },
      {
        question: "Does this course cover Salesforce administration topics?",
        answer: "While the course focuses on development, it does cover essential administration concepts necessary for developers to understand the platform."
      }
    ]
  }
];