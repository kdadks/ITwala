import Head from 'next/head';

interface AIEducationSEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  url?: string;
  image?: string;
  type?: 'website' | 'article' | 'course';
  courseData?: {
    name: string;
    description: string;
    category: string;
    level: string;
    duration: string;
    price: number;
    rating?: number;
    ratingCount?: number;
    learningOutcomes: string[];
    requirements: string[];
  };
}

const AIEducationSEO: React.FC<AIEducationSEOProps> = ({
  title = "ITWala Academy - Premier AI Education Platform",
  description = "Master artificial intelligence and machine learning with ITWala Academy. Comprehensive AI courses, expert instructors, hands-on projects, and industry certifications.",
  keywords = [],
  url = "https://academy.it-wala.com",
  image = "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
  type = 'website',
  courseData
}) => {
  const defaultKeywords = [
    'AI education',
    'artificial intelligence courses',
    'machine learning training',
    'data science certification',
    'AI bootcamp',
    'deep learning courses',
    'neural networks training',
    'AI career development',
    'online AI education',
    'professional AI training'
  ];

  const allKeywords = [...defaultKeywords, ...keywords].join(', ');

  const structuredData = courseData ? {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": courseData.name,
    "description": courseData.description,
    "provider": {
      "@type": "EducationalOrganization",
      "name": "ITWala Academy",
      "url": "https://academy.it-wala.com",
      "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
      "description": "Premier AI education platform offering comprehensive artificial intelligence and machine learning courses"
    },
    "image": image,
    "url": url,
    "educationalLevel": courseData.level,
    "timeRequired": courseData.duration,
    "courseMode": "online",
    "inLanguage": "en",
    "about": [
      "Artificial Intelligence",
      "Machine Learning",
      "Data Science",
      courseData.category
    ],
    "teaches": courseData.learningOutcomes,
    "coursePrerequisites": courseData.requirements,
    "offers": {
      "@type": "Offer",
      "category": "AI Education",
      "price": courseData.price,
      "priceCurrency": "INR",
      "availability": "InStock",
      "description": `Professional AI and machine learning training course`
    },
    "aggregateRating": courseData.rating && courseData.ratingCount ? {
      "@type": "AggregateRating",
      "ratingValue": courseData.rating,
      "ratingCount": courseData.ratingCount,
      "bestRating": 5
    } : undefined,
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "online",
      "instructor": {
        "@type": "Person",
        "name": "ITWala Academy Expert Instructors",
        "description": "Industry professionals with extensive AI and ML experience"
      }
    }
  } : {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "ITWala Academy",
    "alternateName": "ITWala AI Academy",
    "description": "Premier AI education platform offering comprehensive artificial intelligence, machine learning, and data science courses",
    "url": url,
    "logo": image,
    "foundingDate": "2020",
    "areaServed": "Worldwide",
    "educationalCredentialAwarded": "AI and Machine Learning Certification",
    "hasCredential": {
      "@type": "EducationalOccupationalCredential",
      "name": "AI and Machine Learning Professional Certificate",
      "description": "Industry-recognized certification in artificial intelligence and machine learning"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500",
      "bestRating": "5"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+91-7982303199",
      "contactType": "customer service",
      "email": "sales@it-wala.com"
    }
  };

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="ITWala Academy" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="ITWala Academy - AI Education Platform" />
      <meta property="og:site_name" content="ITWala Academy" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="ITWala Academy Logo" />
      
      {/* Additional SEO Meta Tags */}
      <link rel="canonical" href={url} />
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Head>
  );
};

export default AIEducationSEO;