import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllResources } from '@/lib/resourcesService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { category, q } = req.query;
    let resources = await getAllResources(false);

    if (typeof category === 'string' && category !== 'All' && category.trim() !== '') {
      resources = resources.filter((r) => r.category === category);
    }

    if (typeof q === 'string' && q.trim() !== '') {
      const search = q.toLowerCase().trim();
      resources = resources.filter(
        (r) =>
          r.title.toLowerCase().includes(search) ||
          r.description.toLowerCase().includes(search) ||
          r.keywords.some((k) => k.toLowerCase().includes(search))
      );
    }

    return res.status(200).json({ resources });
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return res.status(500).json({ error: error?.message || 'Failed to fetch resources' });
  }
}
