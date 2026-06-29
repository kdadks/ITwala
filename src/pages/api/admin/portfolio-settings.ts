import type { NextApiRequest, NextApiResponse } from 'next';
import { createPagesServerClient } from '@supabase/auth-helpers-nextjs';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const supabase = createPagesServerClient({ req, res });

  if (req.method === 'GET') {
    // Fetch portfolio settings
    const { data, error } = await supabase
      .from('portfolio_settings')
      .select('*')
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'PUT') {
    // Check authentication and admin role
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    // Update settings
    const { 
      page_title, 
      page_subtitle, 
      tagline,
      breadcrumb_label,
      metrics,
      featured_section_title,
      featured_section_subtitle
    } = req.body;

    const { data, error } = await supabase
      .from('portfolio_settings')
      .update({
        page_title,
        page_subtitle,
        tagline,
        breadcrumb_label,
        metrics,
        featured_section_title,
        featured_section_subtitle
      })
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
