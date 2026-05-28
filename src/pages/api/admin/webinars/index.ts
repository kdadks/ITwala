import type { NextApiRequest, NextApiResponse } from 'next';
import { supabaseAdmin } from '@/lib/supabaseClient';
import { requireAdmin } from '@/lib/adminAuth';

function toSlug(title: string, dateTime: string): string {
  const datePart = new Date(dateTime).toISOString().slice(0, 10);
  const titlePart = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
  return `${titlePart}-${datePart}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await requireAdmin(req, res);
  if (!admin) return;

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Admin client not configured' });
  }

  // GET — list all webinars (all statuses) + registration_count
  if (req.method === 'GET') {
    try {
      const { data: webinars, error } = await supabaseAdmin
        .from('webinars')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      // Fetch registration counts for all webinars in one query
      const { data: counts, error: countError } = await supabaseAdmin
        .from('webinar_registrations')
        .select('webinar_id');

      if (countError) {
        return res.status(500).json({ error: countError.message });
      }

      const countMap: Record<string, number> = {};
      for (const row of counts ?? []) {
        countMap[row.webinar_id] = (countMap[row.webinar_id] ?? 0) + 1;
      }

      const result = (webinars ?? []).map((w) => ({
        ...w,
        registration_count: countMap[w.id] ?? 0,
      }));

      return res.status(200).json({ webinars: result });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Internal server error' });
    }
  }

  // POST — create a new webinar
  if (req.method === 'POST') {
    try {
      const {
        title,
        description,
        date_time,
        speaker_name,
        topics,
        learning_outcomes,
        duration_minutes,
        status,
        speaker_title,
        speaker_bio,
        speaker_image,
        media_url,
        media_type,
        banner_image,
        registration_limit,
        custom_fields,
      } = req.body;

      if (!title || typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({ error: 'title is required' });
      }
      if (!description || typeof description !== 'string' || !description.trim()) {
        return res.status(400).json({ error: 'description is required' });
      }
      if (!date_time) {
        return res.status(400).json({ error: 'date_time is required' });
      }
      if (!speaker_name || typeof speaker_name !== 'string' || !speaker_name.trim()) {
        return res.status(400).json({ error: 'speaker_name is required' });
      }

      const slug = toSlug(title.trim(), date_time);

      const { data, error } = await supabaseAdmin
        .from('webinars')
        .insert({
          title: title.trim(),
          slug,
          description: description.trim(),
          date_time,
          speaker_name: speaker_name.trim(),
          topics: topics ?? null,
          learning_outcomes: learning_outcomes ?? null,
          duration_minutes: duration_minutes ?? 60,
          status: status ?? 'draft',
          speaker_title: speaker_title ?? null,
          speaker_bio: speaker_bio ?? null,
          speaker_image: speaker_image ?? null,
          media_url: media_url ?? null,
          media_type: media_type ?? null,
          banner_image: banner_image ?? null,
          registration_limit: registration_limit ?? null,
          custom_fields: custom_fields ?? null,
        })
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(201).json({ webinar: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
