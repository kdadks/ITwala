import type { NextApiRequest, NextApiResponse } from 'next';
import { getResourceBySlug, getAllResources } from '@/lib/resourcesService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;
    if (typeof slug !== 'string') {
      return res.status(400).json({ error: 'Slug parameter is required' });
    }

    const article = await getResourceBySlug(slug);
    if (!article) {
      return res.status(404).json({ error: 'Resource article not found' });
    }

    // Get related articles in same category or recent
    const all = await getAllResources(false);
    const related = all
      .filter((r) => r.slug !== slug && r.category === article.category)
      .slice(0, 3);

    return res.status(200).json({ article, relatedArticles: related });
  } catch (error: any) {
    console.error('Error fetching resource by slug:', error);
    return res.status(500).json({ error: error?.message || 'Failed to fetch resource' });
  }
}
