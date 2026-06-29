import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res });

  if (req.method === 'GET') {
    // Public endpoint - fetch portfolio settings
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('page_title, page_subtitle, tagline, breadcrumb_label, metrics, featured_section_title, featured_section_subtitle')
      .single();

    if (error) {
      // Return default values if table doesn't exist yet
      if (error.code === '42P01' || error.code === 'PGRST116') {
        return res.status(200).json({
          page_title: 'Our Success Stories',
          page_subtitle: 'Transforming ideas into digital excellence',
          tagline: 'trusted by 50+ businesses worldwide',
          breadcrumb_label: 'Our Work · {count}+ Projects Delivered',
          metrics: [
            { value: '10K+', label: 'Active Users' },
            { value: '95%', label: 'Client Satisfaction' },
            { value: '10+', label: 'Projects Delivered' },
            { value: '7', label: 'Industries Served' }
          ],
          featured_section_title: 'Featured Projects',
          featured_section_subtitle: 'Real solutions, real impact. Filter by category to explore our work.'
        });
      }
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
