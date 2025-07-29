-- Complete Course Migration SQL for Supabase
-- This file contains all original course data from your project
-- Execute this in Supabase SQL Editor if needed

-- Clear existing courses first (optional)
DELETE FROM courses WHERE id IS NOT NULL;

-- Insert all original course data
INSERT INTO courses (
  slug, title, description, price, original_price, image, category, level, duration,
  status, students, enrollment_status, rating, rating_count, resources, published_date,
  enrollments, learning_outcomes, requirements, modules, reviews, instructor, faqs,
  tags, language, certification_included
) VALUES 

-- AI & Machine Learning Fundamentals
(
  'ai-machine-learning-fundamentals',
  'AI & Machine Learning Fundamentals',
  'Master the fundamentals of artificial intelligence and machine learning with hands-on projects. Learn how to build and deploy machine learning models that solve real-world problems.',
  3999,
  14999,
  '/images/Cybernetic Workspace.jpeg',
  'Artificial Intelligence',
  'Beginner',
  '8 weeks',
  'published',
  345,
  'Open',
  4.8,
  128,
  35,
  '2025-05-01',
  345,
  '["Understand key AI and machine learning concepts", "Build classification and regression models", "Implement neural networks with TensorFlow and Keras", "Develop computer vision applications", "Apply natural language processing techniques", "Deploy machine learning models to production", "Understand ethical considerations in AI", "Work with real-world datasets"]'::jsonb,
  '["Basic Python programming knowledge", "Understanding of basic mathematics (algebra, statistics)", "No prior AI or machine learning experience required", "A computer with internet connection"]'::jsonb,
  '[{"id": "m1", "title": "Introduction to AI and Machine Learning", "description": "Learn the fundamental concepts and terminology of AI and machine learning.", "lessons": [{"id": "l1", "title": "What is Artificial Intelligence?", "type": "video", "content": "This lesson covers the definition of AI, its history, and its applications in various industries.", "isPreview": true}, {"id": "l2", "title": "Types of Machine Learning", "type": "video", "content": "Learn about supervised, unsupervised, and reinforcement learning."}, {"id": "l3", "title": "Setting Up Your Development Environment", "type": "lab", "content": "Install and configure Python, Jupyter Notebooks, and essential ML libraries."}]}, {"id": "m2", "title": "Machine Learning Fundamentals", "description": "Master the core concepts and techniques of machine learning.", "lessons": [{"id": "l4", "title": "Data Preprocessing", "type": "video", "content": "Learn how to prepare and clean data for machine learning models."}, {"id": "l5", "title": "Feature Engineering", "type": "lab", "content": "Practice creating and selecting features for your models."}]}]'::jsonb,
  '[{"id": 1, "user": "Sanjay Verma", "rating": 5, "date": "2025-05-15", "comment": "Excellent course! The hands-on projects really helped me understand AI concepts.", "userImage": "https://picsum.photos/100/100?random=1"}, {"id": 2, "user": "Priya Sharma", "rating": 4, "date": "2025-05-10", "comment": "The practical exercises and real-world examples made complex topics easy to understand.", "userImage": "https://picsum.photos/100/100?random=2"}]'::jsonb,
  '{"name": "Dr. Sarah Johnson", "bio": "AI researcher with 10+ years of experience in machine learning and data science.", "image": "/images/instructors/sarah-johnson.jpg"}'::jsonb,
  '[{"question": "How long do I have access to the course?", "answer": "You will have lifetime access to the course materials."}, {"question": "Is this course suitable for beginners?", "answer": "Yes, this course is designed for beginners with basic Python knowledge."}, {"question": "What software will I need?", "answer": "You will need Python 3.8 or higher, and we will help you set up all necessary libraries and tools."}]'::jsonb,
  '["AI", "Machine Learning", "Python", "Data Science"]'::jsonb,
  'English',
  true
),

-- AI Product Management
(
  'AI product-management',
  'AI Product Management',
  'Learn how to build and manage successful AI products from ideation to launch. Develop skills in market research, user experience design, and agile product development.',
  3999,
  13999,
  '/images/Professional Woman at Planning Board.jpeg',
  'Product Management',
  'Intermediate',
  '10 weeks',
  'published',
  287,
  'Open',
  4.5,
  3,
  22,
  '2025-04-01',
  287,
  '["Define product strategy and vision", "Conduct effective market and user research", "Create compelling product roadmaps", "Prioritize features using data-driven frameworks", "Work effectively with engineering and design teams", "Manage product development using agile methodologies", "Launch products and measure success", "Develop a product manager mindset"]'::jsonb,
  '["Basic understanding of software development", "Familiarity with project management concepts", "No specific technical skills required", "A computer with internet connection"]'::jsonb,
  '[{"id": "pm1", "title": "Introduction to Product Management", "description": "Understand the role of a product manager and key responsibilities.", "lessons": [{"id": "pm1-l1", "title": "What is Product Management?", "type": "video", "content": "Overview of product management and how it differs from project management and other roles."}, {"id": "pm1-l2", "title": "The Product Development Lifecycle", "type": "video", "content": "Learn about the different stages from idea to market and ongoing iteration."}, {"id": "pm1-l3", "title": "Key Product Management Frameworks", "type": "reading", "content": "Review of essential frameworks like AARRR, Kano Model, and MoSCoW."}, {"id": "pm1-l4", "title": "Product Manager Skills Assessment", "type": "quiz", "content": "Evaluate your current skills and identify areas for improvement."}]}]'::jsonb,
  '[{"id": 1, "user": "Neha Gupta", "rating": 5, "date": "2025-04-15", "comment": "This course transformed my approach to product management. The roadmapping techniques are invaluable!", "userImage": "https://picsum.photos/100/100?random=3"}, {"id": 2, "user": "Arjun Reddy", "rating": 4, "date": "2025-04-22", "comment": "Great practical insights that I could apply immediately in my role. Would have liked more case studies."}, {"id": 3, "user": "Priya Krishnan", "rating": 5, "date": "2025-05-20", "comment": "The instructor real-world examples made complex concepts easy to understand. Highly recommended!"}]'::jsonb,
  '{"name": "Mike Chen", "bio": "Senior Product Manager with experience at top tech companies.", "image": "/images/instructors/mike-chen.jpg"}'::jsonb,
  '[{"question": "Do I need technical background for this course?", "answer": "No technical background is required, but basic understanding of software development is helpful."}, {"question": "Will this course help me transition to product management?", "answer": "Yes, this course is designed to help professionals transition into product management roles."}]'::jsonb,
  '["Product Management", "Strategy", "Agile", "Leadership"]'::jsonb,
  'English',
  true
),

-- Prompt Engineering Mastery
(
  'prompt-engineering-mastery',
  'Prompt Engineering Mastery',
  'Master the art of crafting effective prompts for AI language models. Learn advanced techniques for optimizing AI interactions.',
  3999,
  7999,
  '/images/Colorful Sticky Notes Brainstorming.jpeg',
  'Prompt Engineering',
  'Beginner',
  '6 weeks',
  'published',
  0,
  'Open',
  5.0,
  0,
  15,
  '2025-05-01',
  0,
  '["Understand prompt engineering principles", "Master different prompting techniques", "Learn chain-of-thought prompting", "Implement system and user role prompts", "Create effective few-shot learning prompts", "Optimize prompts for specific use cases", "Handle complex multi-step tasks", "Build AI applications with prompt engineering"]'::jsonb,
  '["Basic understanding of AI concepts", "No coding experience required", "Curiosity about AI and language models", "A computer with internet connection"]'::jsonb,
  '[{"id": "pe-m1", "title": "Introduction to Prompt Engineering", "description": "Understand the fundamentals of prompt engineering and its importance in AI.", "lessons": [{"id": "pe-m1-l1", "title": "What is Prompt Engineering?", "type": "video", "content": "Overview of prompt engineering and its role in AI systems.", "isPreview": true}, {"id": "pe-m1-l2", "title": "Types of Language Models", "type": "video", "content": "Understanding different language models and their capabilities."}]}, {"id": "pe-m2", "title": "Prompt Design Patterns", "description": "Learn effective patterns for designing prompts.", "lessons": [{"id": "pe-m2-l1", "title": "Basic Prompt Structures", "type": "lab", "content": "Practice creating different types of prompts."}, {"id": "pe-m2-l2", "title": "Role-based Prompting", "type": "video", "content": "Learn how to use system and user roles in prompts."}]}]'::jsonb,
  '[]'::jsonb,
  '{"name": "Industry Expert", "bio": "An industry professional with extensive experience in prompt engineering and AI systems optimization.", "image": "https://picsum.photos/200/200?random=6"}'::jsonb,
  '[{"question": "What is prompt engineering?", "answer": "Prompt engineering is the practice of designing and optimizing inputs to AI language models to get desired outputs effectively."}, {"question": "Do I need programming experience?", "answer": "No programming experience is required. This course focuses on understanding and crafting effective prompts for AI models."}]'::jsonb,
  '["Prompt Engineering", "AI", "Language Models", "GPT"]'::jsonb,
  'English',
  true
),

-- Agentic AI Development
(
  'agentic-ai-development',
  'Agentic AI Development',
  'Learn to build autonomous AI agents that can perform complex tasks independently. Master the creation of AI systems that can plan, reason, and execute multi-step operations.',
  3999,
  7999,
  '/images/Robotic Hand Typing.jpeg',
  'Agentic AI',
  'Advanced',
  '10 weeks',
  'published',
  0,
  'Open',
  5.0,
  0,
  20,
  '2025-05-15',
  0,
  '["Understand AI agent architectures", "Implement planning and reasoning systems", "Create task-oriented AI agents", "Build multi-agent systems", "Develop memory systems for agents", "Learn agent communication protocols", "Implement safety measures in AI agents", "Deploy autonomous AI systems"]'::jsonb,
  '["Strong programming background", "Understanding of AI and ML concepts", "Experience with Python", "Familiarity with NLP concepts"]'::jsonb,
  '[{"id": "aa-m1", "title": "Fundamentals of Agentic AI", "description": "Introduction to AI agents and their core components.", "lessons": [{"id": "aa-m1-l1", "title": "What are AI Agents?", "type": "video", "content": "Understanding the concept of autonomous AI agents.", "isPreview": true}, {"id": "aa-m1-l2", "title": "Agent Architectures", "type": "video", "content": "Different approaches to building AI agents."}]}, {"id": "aa-m2", "title": "Building Autonomous Agents", "description": "Practical implementation of AI agents.", "lessons": [{"id": "aa-m2-l1", "title": "Planning Systems", "type": "lab", "content": "Implementing planning algorithms for AI agents."}, {"id": "aa-m2-l2", "title": "Memory and State Management", "type": "video", "content": "Building memory systems for long-term task execution."}]}]'::jsonb,
  '[]'::jsonb,
  '{"name": "Industry Expert", "bio": "An industry professional with extensive experience in autonomous AI systems and multi-agent architectures.", "image": "https://picsum.photos/200/200?random=7"}'::jsonb,
  '[{"question": "What are AI agents?", "answer": "AI agents are autonomous systems that can perceive their environment and take actions to achieve specific goals."}, {"question": "Is this course suitable for beginners?", "answer": "This is an advanced course that requires prior experience with AI concepts and programming."}]'::jsonb,
  '["Agentic AI", "Autonomous Systems", "AI Agents", "Advanced AI"]'::jsonb,
  'English',
  true
),

-- Machine Learning DevOps Basic
(
  'ml-devops-basic',
  'Machine Learning DevOps (ML DevOps) Basic',
  'Learn the fundamentals of MLOps and DevOps practices for machine learning projects. Master the tools and workflows for deploying, monitoring, and maintaining ML models in production environments.',
  3999,
  7999,
  '/images/Tech-Savvy Professional in a Multiscreen Workspace.jpeg',
  'Machine Learning',
  'Intermediate',
  '8 weeks',
  'published',
  0,
  'Open',
  5.0,
  0,
  22,
  '2025-06-15',
  0,
  '["Understand MLOps principles and workflows", "Build CI/CD pipelines for ML projects", "Implement model versioning and tracking", "Deploy ML models to production environments", "Monitor model performance and drift", "Automate model retraining processes", "Implement A/B testing for model deployment", "Apply best practices for ML system architecture"]'::jsonb,
  '["Basic understanding of machine learning concepts", "Familiarity with Python programming", "Experience with at least one ML framework (TensorFlow, PyTorch, etc.)", "Basic knowledge of Docker and containerization"]'::jsonb,
  '[{"id": "mlops-m1", "title": "Introduction to ML DevOps", "description": "Understand the fundamentals of MLOps and its importance in the ML lifecycle.", "lessons": [{"id": "mlops-m1-l1", "title": "What is ML DevOps?", "type": "video", "content": "Overview of ML DevOps and how it differs from traditional DevOps.", "isPreview": true}, {"id": "mlops-m1-l2", "title": "The ML Lifecycle", "type": "video", "content": "Understanding the end-to-end machine learning lifecycle and where MLOps fits in."}, {"id": "mlops-m1-l3", "title": "Setting Up Your MLOps Environment", "type": "lab", "content": "Configure your development environment with essential MLOps tools and frameworks."}]}, {"id": "mlops-m2", "title": "Version Control for ML Projects", "description": "Learn how to effectively version control ML models, data, and code.", "lessons": [{"id": "mlops-m2-l1", "title": "Git for ML Projects", "type": "video", "content": "Best practices for using Git with machine learning projects."}, {"id": "mlops-m2-l2", "title": "Data Versioning", "type": "lab", "content": "Implement data versioning using DVC (Data Version Control)."}, {"id": "mlops-m2-l3", "title": "Model Versioning and Registry", "type": "lab", "content": "Set up and use a model registry to track model versions and metadata."}]}]'::jsonb,
  '[]'::jsonb,
  '{"name": "Industry Expert", "bio": "An experienced ML engineer with expertise in deploying and maintaining machine learning systems at scale.", "image": "https://picsum.photos/200/200?random=8"}'::jsonb,
  '[{"question": "What is ML DevOps?", "answer": "ML DevOps (or MLOps) is a set of practices that combines Machine Learning, DevOps, and Data Engineering to deploy and maintain ML systems in production reliably and efficiently."}, {"question": "Is this course suitable for beginners in machine learning?", "answer": "This course requires basic understanding of machine learning concepts. If you are new to ML, we recommend taking our AI & Machine Learning Fundamentals course first."}, {"question": "Will I learn how to build ML models in this course?", "answer": "This course focuses on the operational aspects of ML systems rather than model building. We assume you already have some experience with creating ML models."}, {"question": "What tools will we use in this course?", "answer": "You will work with industry-standard tools like Git, DVC, Docker, Kubernetes, MLflow, Kubeflow, and various cloud services for ML deployment."}]'::jsonb,
  '["MLOps", "DevOps", "Machine Learning", "CI/CD", "Docker"]'::jsonb,
  'English',
  true
);

-- Update the auto-generated rating and enrollment counts using triggers
-- (The triggers will automatically calculate these based on reviews and enrollments tables)

-- Verify the migration
SELECT 
  title,
  category,
  level,
  price,
  rating,
  enrollments,
  slug
FROM courses 
ORDER BY title;