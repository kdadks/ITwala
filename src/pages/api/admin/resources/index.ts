import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { getAllResources, saveResource, normalizeResource } from '@/lib/resourcesService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const resources = await getAllResources(true); // Include drafts
      return res.status(200).json({ resources });
    } catch (error: any) {
      console.error('Error fetching admin resources:', error);
      return res.status(500).json({ error: error?.message || 'Failed to fetch admin resources' });
    }
  }

  // POST requires admin authentication
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'POST') {
    try {
      const newBlogData = req.body;
      if (!newBlogData.title || !newBlogData.slug) {
        return res.status(400).json({ error: 'Title and Slug are required' });
      }

      const existing = await getAllResources(true);
      
      // Check slug collision
      const slugExists = existing.some((b) => b.slug === newBlogData.slug);
      if (slugExists) {
        return res.status(400).json({ error: `A blog with slug "${newBlogData.slug}" already exists.` });
      }

      const newRecord = normalizeResource({
        ...newBlogData,
        id: `blog_${Date.now()}`,
        publishDate: newBlogData.publishDate || new Date().toISOString().split('T')[0],
        updatedDate: new Date().toISOString().split('T')[0],
      });

      const saved = await saveResource(newRecord);

      if (!saved) {
        return res.status(500).json({ error: 'Failed to save new blog post to database' });
      }

      return res.status(201).json({ message: 'Blog created successfully', resource: newRecord });
    } catch (error: any) {
      console.error('Error creating blog:', error);
      return res.status(500).json({ error: error?.message || 'Failed to create blog' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST']);
  return res.status(405).json({ error: 'Method not allowed' });
}
