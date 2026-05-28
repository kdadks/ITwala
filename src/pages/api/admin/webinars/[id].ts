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

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Webinar ID is required' });
  }

  // GET — return one webinar (any status) + registration_count
  if (req.method === 'GET') {
    try {
      const { data: webinar, error } = await supabaseAdmin
        .from('webinars')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !webinar) {
        return res.status(404).json({ error: 'Webinar not found' });
      }

      const { count, error: countError } = await supabaseAdmin
        .from('webinar_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('webinar_id', id);

      if (countError) {
        return res.status(500).json({ error: countError.message });
      }

      return res.status(200).json({ webinar: { ...webinar, registration_count: count ?? 0 } });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Internal server error' });
    }
  }

  // PUT — partial update; regenerate slug if title or date_time changed
  if (req.method === 'PUT') {
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

      // Fetch existing webinar to derive slug properly
      const { data: existing, error: fetchError } = await supabaseAdmin
        .from('webinars')
        .select('id, title, date_time, slug')
        .eq('id', id)
        .single();

      if (fetchError || !existing) {
        return res.status(404).json({ error: 'Webinar not found' });
      }

      const newTitle = title !== undefined ? String(title).trim() : existing.title;
      const newDateTime = date_time !== undefined ? date_time : existing.date_time;
      const shouldRegenerateSlug =
        (title !== undefined && title !== existing.title) ||
        (date_time !== undefined && date_time !== existing.date_time);

      const slug = shouldRegenerateSlug ? toSlug(newTitle, newDateTime) : existing.slug;

      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
        slug,
      };

      if (title !== undefined) updatePayload.title = newTitle;
      if (description !== undefined) updatePayload.description = String(description).trim();
      if (date_time !== undefined) updatePayload.date_time = date_time;
      if (speaker_name !== undefined) updatePayload.speaker_name = String(speaker_name).trim();
      if (topics !== undefined) updatePayload.topics = topics;
      if (learning_outcomes !== undefined) updatePayload.learning_outcomes = learning_outcomes;
      if (duration_minutes !== undefined) updatePayload.duration_minutes = duration_minutes;
      if (status !== undefined) updatePayload.status = status;
      if (speaker_title !== undefined) updatePayload.speaker_title = speaker_title;
      if (speaker_bio !== undefined) updatePayload.speaker_bio = speaker_bio;
      if (speaker_image !== undefined) updatePayload.speaker_image = speaker_image;
      if (media_url !== undefined) updatePayload.media_url = media_url;
      if (media_type !== undefined) updatePayload.media_type = media_type;
      if (banner_image !== undefined) updatePayload.banner_image = banner_image;
      if (registration_limit !== undefined) updatePayload.registration_limit = registration_limit;
      if (custom_fields !== undefined) updatePayload.custom_fields = custom_fields;

      const { data, error } = await supabaseAdmin
        .from('webinars')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(200).json({ webinar: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Internal server error' });
    }
  }

  // DELETE — delete webinar (cascades to registrations via FK)
  if (req.method === 'DELETE') {
    try {
      const { error } = await supabaseAdmin
        .from('webinars')
        .delete()
        .eq('id', id);

      if (error) {
        return res.status(500).json({ error: error.message });
      }

      return res.status(204).end();
    } catch (err: any) {
      return res.status(500).json({ error: err.message ?? 'Internal server error' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
