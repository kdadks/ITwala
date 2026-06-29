import { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createPagesServerClient({ req, res });

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Check admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (profile?.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }

  try {
    if (req.method === 'GET') {
      // Get all portfolio items (including inactive ones for admin)
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'POST') {
      // Create new portfolio item
      const { data, error } = await supabase
        .from('portfolio_items')
        .insert([{
          ...req.body,
          created_by: session.user.id,
          updated_by: session.user.id
        }])
        .select()
        .single();

      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      // Update portfolio item
      const { id, ...updateData } = req.body;
      
      if (!id) {
        return res.status(400).json({ error: 'Portfolio item ID is required' });
      }

      const { data, error } = await supabase
        .from('portfolio_items')
        .update({
          ...updateData,
          updated_by: session.user.id
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      // Delete portfolio item
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ error: 'Portfolio item ID is required' });
      }

      const { error } = await supabase
        .from('portfolio_items')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return res.status(200).json({ message: 'Portfolio item deleted successfully' });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error: any) {
    console.warn('Portfolio API error:', error.message);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
