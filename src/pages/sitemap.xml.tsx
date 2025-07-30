import { GetServerSideProps } from 'next';

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/academy',
    '/consulting',
    '/courses',
    '/ai-education-guide',
    '/services',
    '/services/ai-solutions',
    '/services/product-development',
    '/services/digital-transformation',
    '/services/technical-consulting',
    '/services/it-staffing',
    '/services/training-development',
    '/services/product-strategy',
    '/terms-of-service',
    '/privacy-policy'
  ];

  // Generate course pages dynamically
  let coursePages: string[] = [];
  try {
    // Import course data
    const { courseData } = await import('../data/courses');
    coursePages = courseData.map(course => `/courses/${course.slug}`);
  } catch (error) {
    console.error('Error loading course data for sitemap:', error);
  }

  const allPages = [...staticPages, ...coursePages];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPages
        .map((page) => {
          const route = page === '' ? '' : page;
          const priority = page === '' ? '1.0' :
                          page.startsWith('/courses/') ? '0.8' :
                          page === '/academy' || page === '/consulting' ? '0.9' :
                          page === '/ai-education-guide' ? '0.9' :
                          page === '/courses' || page.startsWith('/services/') ? '0.7' : '0.6';
          
          const changefreq = page === '' ? 'daily' :
                           page.startsWith('/courses/') ? 'weekly' :
                           page === '/courses' || page === '/ai-education-guide' ? 'weekly' : 'monthly';

          return `
            <url>
              <loc>https://academy.it-wala.com${route}</loc>
              <lastmod>${new Date().toISOString()}</lastmod>
              <changefreq>${changefreq}</changefreq>
              <priority>${priority}</priority>
            </url>
          `;
        })
        .join('')}
    </urlset>
  `;

  res.setHeader('Content-Type', 'text/xml');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default SiteMap;