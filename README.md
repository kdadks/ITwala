# ITWala Academy

A modern educational platform built with Next.js and Supabase, offering comprehensive course management and learning experiences.

## Overview

ITWala Academy is a feature-rich educational platform designed to provide seamless course management and learning experiences. The platform supports multiple user roles (students and administrators) and offers a comprehensive set of features for course delivery and management.

## Features

- **User Authentication**
  - Secure login/registration system
  - Role-based access control (Student/Admin)
  - Protected routes and content

- **Course Management**
  - Comprehensive course creation and editing
  - Rich content support including video lessons
  - Course categorization and organization
  - Progress tracking for students

- **Student Features**
  - Course enrollment system
  - Progress tracking
  - Personal dashboard
  - Course recommendations
  - Achievement tracking

- **Administrative Features**
  - Admin dashboard
  - User management
  - Course analytics
  - Content management
  - Site settings configuration
  - Category management

- **Additional Features**
  - Responsive design
  - Real-time updates
  - Interactive UI components
  - WhatsApp integration
  - Contact form functionality

## Technology Stack

- **Frontend**
  - Next.js 15
  - React 18
  - TailwindCSS
  - HeadlessUI/HeroIcons
  - Framer Motion
  - React Player

- **Backend & Database**
  - Supabase (Backend as a Service)
  - PostgreSQL Database
  - Real-time subscriptions

- **Authentication**
  - Supabase Auth
  - JWT token handling
  - Role-based access control

- **State Management & Data Fetching**
  - SWR for data fetching
  - React Context for state
  - React Hook Form for form handling

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (Latest LTS version recommended)
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/itwala-academy.git
cd itwala-academy
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

4. Run the development server:
```bash
npm run dev
```

## Project Structure

```
itwala-academy/
├── public/            # Static files
├── src/
│   ├── components/    # React components
│   ├── pages/        # Next.js pages
│   ├── styles/       # CSS styles
│   ├── utils/        # Utility functions
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript types
│   └── lib/          # Library configurations
├── scripts/          # Database and setup scripts
└── supabase/         # Supabase configurations and migrations
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project's API credentials
3. Run the database migrations:
```bash
cd supabase
supabase migration up
```

4. Set up the admin user:
```bash
npm run setup:admin
```

## Deployment

The project is configured for deployment on Netlify:

1. Connect your repository to Netlify
2. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
3. Set up environment variables in Netlify dashboard
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
