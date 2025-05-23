import { NextApiRequest, NextApiResponse } from 'next';
import { createAdminUser } from '@/utils/setupAdmin';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await createAdminUser();
    res.status(200).json({ message: 'Admin setup completed successfully' });
  } catch (error) {
    console.error('Admin setup failed:', error);
    res.status(500).json({ message: 'Admin setup failed', error });
  }
}
