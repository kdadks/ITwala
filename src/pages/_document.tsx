import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="description" content="ITwala Academy - Premier AI education platform offering comprehensive artificial intelligence, machine learning, and data science courses. Master AI skills with expert-led training and hands-on projects." />
        <meta name="keywords" content="AI education, artificial intelligence courses, machine learning training, data science certification, AI bootcamp, deep learning courses, neural networks training, AI career development, online AI education, professional AI training" />
        <meta name="author" content="ITwala Academy" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="ITwala Academy - Premier AI Education & Training Platform" />
        <meta property="og:description" content="Master artificial intelligence with comprehensive AI courses, machine learning training, and data science certification. Join 500+ students advancing their AI careers." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta property="og:image:alt" content="ITwala Academy - AI Education Platform" />
        <meta property="og:site_name" content="ITwala Academy" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITwala Academy - Premier AI Education Platform" />
        <meta name="twitter:description" content="Master AI with comprehensive courses in machine learning, data science, and artificial intelligence. Expert-led training with hands-on projects." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:image:alt" content="ITwala Academy Logo" />
        
        {/* Additional SEO Meta Tags */}
        <meta name="theme-color" content="#3B82F6" />
        <meta name="msapplication-TileColor" content="#3B82F6" />
        
        {/* Favicon and Icons */}
        <link rel="icon" type="image/png" href="/images/IT - WALA_logo (1).png" />
        <link rel="apple-touch-icon" href="/images/IT - WALA_logo (1).png" />
        
        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "EducationalOrganization",
            "name": "ITwala Academy",
            "description": "Premier AI education platform offering comprehensive artificial intelligence, machine learning, and data science courses",
            "url": "https://academy.it-wala.com",
            "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
            "sameAs": [
              "https://www.linkedin.com/company/itwala",
              "https://twitter.com/itwala"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7982303199",
              "contactType": "customer service",
              "email": "sales@it-wala.com"
            },
            "offers": {
              "@type": "Offer",
              "category": "AI Education Courses",
              "description": "Comprehensive AI and machine learning training programs"
            }
          })}
        </script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}