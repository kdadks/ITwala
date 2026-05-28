import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { requireAdmin } from '@/lib/adminAuth';

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function buildCsvRow(fields: unknown[]): string {
  return fields.map(escapeCsvField).join(',');
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Admin client not configured' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Webinar ID is required' });
  }

  try {
    // Verify webinar exists and get its title for the filename
    const { data: webinar, error: webinarError } = await supabaseAdmin
      .from('webinars')
      .select('id, title, slug')
      .eq('id', id)
      .single();

    if (webinarError || !webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    const { data: registrants, error } = await supabaseAdmin
      .from('webinar_registrations')
      .select('first_name, last_name, email, phone, organization, job_title, registered_at')
      .eq('webinar_id', id)
      .order('registered_at', { ascending: true });

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const header = buildCsvRow([
      'first_name',
      'last_name',
      'email',
      'phone',
      'organization',
      'job_title',
      'registered_at',
    ]);

    const rows = (registrants ?? []).map((r) =>
      buildCsvRow([
        r.first_name,
        r.last_name,
        r.email,
        r.phone,
        r.organization,
        r.job_title,
        r.registered_at,
      ])
    );

    const csv = [header, ...rows].join('\r\n');

    const filename = `registrants-${webinar.slug ?? id}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    return res.status(200).send(csv);
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
