import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect to Google Fonts for better performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="description" content="ITWala - Global leader in web development, AI education, custom software development, and IT consulting. Transform careers with edutech training or scale businesses with product development, digital transformation & IT staffing solutions." />
        <meta name="keywords" content="web development company, AI education platform, edutech solutions, custom software development, AI development services, IT consulting services, product development company, digital transformation consulting, training and development programs, IT staffing solutions, machine learning education, custom web applications, enterprise software development, AI training courses, technology consulting firm, software engineering services, cloud development, mobile app development, full stack development, react development, node.js development, python AI development, data science training, agile development, DevOps consulting, IT recruitment services, tech talent acquisition, business intelligence solutions, API development, microservices architecture, SaaS development, e-learning platform" />
        <meta name="author" content="ITWala" />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content="ITWala - Global Web Development, AI Education & IT Consulting Leader" />
        <meta property="og:description" content="Top-ranked web development company, AI education platform, and IT consulting firm. Custom software development, edutech solutions, digital transformation, training programs & IT staffing services worldwide." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://academy.it-wala.com" />
        <meta property="og:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta property="og:image:alt" content="ITWala - Complete IT Solutions" />
        <meta property="og:site_name" content="ITWala" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="ITWala - Web Dev, AI Education & IT Consulting" />
        <meta name="twitter:description" content="Global leader: Custom web development, AI education platform, product development, digital transformation consulting, training programs & IT staffing solutions." />
        <meta name="twitter:image" content="https://academy.it-wala.com/images/IT - WALA_logo (1).png" />
        <meta name="twitter:image:alt" content="ITWala Logo" />
        
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
            "@type": "Organization",
            "name": "ITWala",
            "alternateName": "IT Wala",
            "description": "Global leader in web development, AI education, custom software development, IT consulting, product development, digital transformation, training & development, and IT staffing solutions",
            "url": "https://academy.it-wala.com",
            "logo": "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
            "image": "https://academy.it-wala.com/images/IT - WALA_logo (1).png",
            "sameAs": [
              "https://www.linkedin.com/company/itwala",
              "https://twitter.com/itwala"
            ],
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "IN",
              "addressRegion": "Global"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+91-7982303199",
              "contactType": "customer service",
              "email": "sales@it-wala.com",
              "availableLanguage": ["English", "Hindi"]
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "reviewCount": "500",
              "bestRating": "5"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "Comprehensive IT Services & Solutions",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Web Development Services",
                    "description": "Custom web development, full-stack development, React, Node.js, responsive web applications, SaaS development",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "EducationalOccupationalProgram",
                    "name": "AI Education & Training Platform",
                    "description": "Comprehensive AI education, machine learning courses, data science training, edutech platform with hands-on projects",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    },
                    "numberOfCredits": "500+ students trained"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Custom Software Development",
                    "description": "Enterprise software development, custom applications, API development, microservices, mobile app development",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "AI Development Services",
                    "description": "AI solutions, machine learning implementation, chatbots, predictive analytics, computer vision, NLP solutions",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "IT Consulting Services",
                    "description": "Technology consulting, IT strategy, solution architecture, technical advisory, DevOps consulting",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Product Development",
                    "description": "End-to-end product development, MVP development, product strategy, scalable solutions, agile development",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Digital Transformation Consulting",
                    "description": "Digital transformation strategy, cloud migration, business process automation, technology modernization",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "EducationalOccupationalProgram",
                    "name": "Training & Development Programs",
                    "description": "Corporate training, technology upskilling, professional development, custom training programs",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "IT Staffing Solutions",
                    "description": "IT recruitment, tech talent acquisition, staff augmentation, dedicated development teams",
                    "provider": {
                      "@type": "Organization",
                      "name": "ITWala"
                    }
                  }
                }
              ]
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