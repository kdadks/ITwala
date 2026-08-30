import type { NextApiRequest, NextApiResponse } from 'next';
import { requireAdmin } from '@/lib/adminAuth';
import { getResourceByIdOrSlug, saveResource, deleteResource, normalizeResource } from '@/lib/resourcesService';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Blog ID or Slug parameter is required' });
  }

  if (req.method === 'GET') {
    const article = await getResourceByIdOrSlug(id);
    if (!article) {
      return res.status(404).json({ error: 'Blog post not found' });
    }
    return res.status(200).json({ resource: article });
  }

  // PUT and DELETE require admin authentication
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (req.method === 'PUT') {
    try {
      const existing = await getResourceByIdOrSlug(id);
      if (!existing) {
        return res.status(404).json({ error: 'Blog post not found for updating' });
      }

      const updatePayload = req.body;
      const updatedRecord = normalizeResource({
        ...existing,
        ...updatePayload,
        updatedDate: new Date().toISOString().split('T')[0],
      });

      const saved = await saveResource(updatedRecord);
      if (!saved) {
        return res.status(500).json({ error: 'Failed to update blog in database' });
      }

      return res.status(200).json({ message: 'Blog updated successfully', resource: updatedRecord });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Failed to update blog' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const saved = await deleteResource(id);
      if (!saved) {
        return res.status(500).json({ error: 'Failed to delete blog from database' });
      }

      return res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error?.message || 'Failed to delete blog' });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
  return res.status(405).json({ error: 'Method not allowed' });
}
