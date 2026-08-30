import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { seedStaticResources } from '@/lib/resourcesService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  try {
    const result = await seedStaticResources();
    return res.status(200).json({
      message: `Successfully seeded resources into database (${result.count} total records).`,
      count: result.count,
    });
  } catch (error: any) {
    console.error('Error seeding resources:', error);
    return res.status(500).json({ error: error?.message || 'Failed to seed resources' });
  }
}
