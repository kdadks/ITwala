import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { readFileSync } from 'fs';
import { join } from 'path';
import { supabase, supabaseAdmin } from '@/lib/supabaseClient';

// ─── Validation ───────────────────────────────────────────────────────────────

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizePhone(p: string): string {
  return p.replace(/[\s\-().]/g, '');
}

function isValidInternationalPhone(phone: string): boolean {
  return /^\+[1-9]\d{6,14}$/.test(normalizePhone(phone.trim()));
}

// ─── Formatters ───────────────────────────────────────────────────────────────

function formatDateTime(dateTime: string): string {
  return new Date(dateTime).toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}

// ─── ICS generator ────────────────────────────────────────────────────────────

function toIcsDate(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function foldIcsLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) {
    parts.push(' ' + line.slice(i, i + 74));
  }
  return parts.join('\r\n');
}

function buildIcs(params: {
  uid: string;
  title: string;
  description: string;
  dateTime: string;
  durationMinutes: number;
}): string {
  const start = new Date(params.dateTime);
  const end = new Date(start.getTime() + params.durationMinutes * 60_000);
  const esc = (s: string) =>
    s.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ITWala Academy//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:REQUEST',
    'BEGIN:VEVENT',
    `UID:${params.uid}@it-wala.com`,
    `DTSTART:${toIcsDate(start)}`,
    `DTEND:${toIcsDate(end)}`,
    foldIcsLine(`SUMMARY:${esc(params.title)}`),
    foldIcsLine(`DESCRIPTION:${esc(params.description)}`),
    'ORGANIZER;CN=ITWala Academy:mailto:support@it-wala.com',
    'LOCATION:Online — join link will be sent before the event',
    'STATUS:CONFIRMED',
    'SEQUENCE:0',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

// ─── Email builder ────────────────────────────────────────────────────────────

function buildConfirmationEmail(params: {
  firstName: string;
  hasBanner: boolean;
  webinar: {
    title: string;
    date_time: string;
    duration_minutes: number;
    speaker_name: string;
    speaker_title?: string | null;
    topics?: string[] | null;
  };
}): string {
  const { firstName, hasBanner, webinar } = params;
  const formattedDate = formatDateTime(webinar.date_time);

  const bannerRow = hasBanner
    ? `<tr><td style="padding:0;line-height:0;"><img src="cid:banner" alt="${webinar.title}" style="width:100%;max-height:220px;object-fit:cover;display:block;"/></td></tr>`
    : '';

  const speakerLine = webinar.speaker_title
    ? `${webinar.speaker_name}, ${webinar.speaker_title}`
    : webinar.speaker_name;

  const topicsHtml =
    webinar.topics && webinar.topics.length > 0
      ? `<div style="margin-bottom:28px;">
          <p style="font-size:14px;font-weight:600;color:#111827;margin:0 0 10px;">Topics covered:</p>
          <ul style="margin:0;padding-left:20px;">
            ${webinar.topics.map((t) => `<li style="font-size:14px;color:#4b5563;margin-bottom:5px;">${t}</li>`).join('')}
          </ul>
        </div>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Registration Confirmed</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f8;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f4f8;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08);max-width:600px;width:100%;">
          <!-- Header with logo -->
          <tr>
            <td style="background:#1a56a0;padding:24px 40px;text-align:center;">
              <img src="cid:logo" alt="ITWala Academy" style="height:52px;display:block;margin:0 auto;"/>
            </td>
          </tr>
          <!-- Banner (if available) -->
          ${bannerRow}
          <!-- Body -->
          <tr>
            <td style="padding:40px 40px 32px;">
              <p style="color:#1a56a0;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 6px;">Registration Confirmed</p>
              <h2 style="color:#111827;margin:0 0 8px;font-size:22px;font-weight:700;line-height:1.3;">You're in, ${firstName}! 🎉</h2>
              <p style="color:#6b7280;margin:0 0 28px;font-size:15px;">Your spot is reserved. Here are the details:</p>

              <!-- Event card -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-left:4px solid #1a56a0;border-radius:6px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 12px;font-size:18px;font-weight:700;color:#111827;">${webinar.title}</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#374151;">📅&nbsp; ${formattedDate}</p>
                    <p style="margin:0 0 6px;font-size:14px;color:#374151;">⏱&nbsp; ${webinar.duration_minutes} minutes</p>
                    <p style="margin:0;font-size:14px;color:#374151;">🎤&nbsp; ${speakerLine}</p>
                  </td>
                </tr>
              </table>

              ${topicsHtml}

              <!-- Calendar note -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border:1px solid #fde68a;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:14px 18px;">
                    <p style="margin:0;font-size:14px;color:#92400e;">
                      📆&nbsp;<strong>Calendar invite attached</strong> — open the <em>.ics</em> file to add this event to your calendar in one click.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#6b7280;font-size:14px;margin:0 0 10px;">
                We'll send you the session link and any final details closer to the date. Keep an eye on your inbox!
              </p>
              <p style="color:#6b7280;font-size:14px;margin:0 0 32px;">
                Got questions? Reach us at <a href="mailto:support@it-wala.com" style="color:#1a56a0;text-decoration:none;font-weight:500;">support@it-wala.com</a>
              </p>
              <p style="color:#9ca3af;font-size:13px;margin:0;">
                See you at the session,<br/>
                <strong style="color:#1a56a0;">The ITWala Academy Team</strong>
              </p>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f9fafb;padding:18px 40px;text-align:center;border-top:1px solid #e5e7eb;">
              <p style="color:#9ca3af;font-size:12px;margin:0;">
                &copy; ${new Date().getFullYear()} ITWala Academy &nbsp;|&nbsp;
                <a href="https://it-wala.com" style="color:#9ca3af;text-decoration:none;">it-wala.com</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

// ─── Handler ──────────────────────────────────────────────────────────────────

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id } = req.query;
  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Webinar ID is required' });
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    organization,
    job_title,
    country,
    state,
    custom_answers,
  } = req.body;

  // Validate required fields
  if (!first_name || typeof first_name !== 'string' || !first_name.trim()) {
    return res.status(400).json({ error: 'first_name is required' });
  }
  if (!last_name || typeof last_name !== 'string' || !last_name.trim()) {
    return res.status(400).json({ error: 'last_name is required' });
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email.trim())) {
    return res.status(400).json({ error: 'A valid email is required' });
  }
  if (!phone || typeof phone !== 'string' || !isValidInternationalPhone(phone)) {
    return res.status(400).json({
      error: 'A valid international phone number starting with + is required',
    });
  }

  try {
    // Fetch the webinar
    const { data: webinar, error: webinarError } = await supabase
      .from('webinars')
      .select(
        'id, title, date_time, duration_minutes, speaker_name, speaker_title, description, topics, banner_image, status, registration_limit'
      )
      .eq('id', id)
      .single();

    if (webinarError || !webinar) {
      return res.status(404).json({ error: 'Webinar not found' });
    }

    if (webinar.status !== 'published') {
      return res.status(400).json({ error: 'This webinar is not available for registration' });
    }

    // Check registration limit
    if (webinar.registration_limit !== null) {
      const { count, error: countError } = await supabaseAdmin!
        .from('webinar_registrations')
        .select('id', { count: 'exact', head: true })
        .eq('webinar_id', id);

      if (countError) {
        return res.status(500).json({ error: countError.message });
      }

      if ((count ?? 0) >= webinar.registration_limit) {
        return res.status(400).json({ error: 'This webinar has reached its registration limit' });
      }
    }

    // Insert registration (use service role to bypass RLS — this is a server-side route)
    const { data: registration, error: insertError } = await supabaseAdmin!
      .from('webinar_registrations')
      .insert({
        webinar_id: id,
        first_name: first_name.trim(),
        last_name: last_name.trim(),
        email: email.trim().toLowerCase(),
        phone: normalizePhone(phone.trim()),
        organization: organization ?? null,
        job_title: job_title ?? null,
        country: country ?? null,
        state: state ?? null,
        custom_answers: custom_answers ?? {},
        confirmation_sent: false,
      })
      .select('id')
      .single();

    if (insertError) {
      if (insertError.code === '23505') {
        return res.status(409).json({ error: 'Already registered for this webinar' });
      }
      return res.status(500).json({ error: insertError.message });
    }

    // Send confirmation email (non-fatal)
    try {
      const transporter = createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT ?? '465'),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Logo (always embedded)
      const logoBuffer = readFileSync(
        join(process.cwd(), 'public', 'images', 'IT - WALA_logo (1).png')
      );

      // Banner — embed local paths, skip HTTP URLs (blocked by most email clients anyway)
      let bannerBuffer: Buffer | null = null;
      const bannerSrc = webinar.banner_image as string | null;
      if (bannerSrc && !bannerSrc.startsWith('http://') && !bannerSrc.startsWith('https://')) {
        try {
          const rel = bannerSrc.startsWith('/') ? bannerSrc.slice(1) : bannerSrc;
          bannerBuffer = readFileSync(join(process.cwd(), rel));
        } catch {
          // banner not found on disk — skip
        }
      }

      // Calendar attachment
      const icsContent = buildIcs({
        uid: registration.id,
        title: webinar.title,
        description: webinar.description ?? '',
        dateTime: webinar.date_time,
        durationMinutes: webinar.duration_minutes,
      });

      const attachments: object[] = [
        {
          filename: 'itwala-logo.png',
          content: logoBuffer,
          cid: 'logo',
          contentDisposition: 'inline',
        },
        {
          filename: 'event.ics',
          content: Buffer.from(icsContent, 'utf8'),
          contentType: 'text/calendar; method=REQUEST',
          contentDisposition: 'attachment',
        },
      ];

      if (bannerBuffer) {
        attachments.push({
          filename: 'banner.jpg',
          content: bannerBuffer,
          cid: 'banner',
          contentDisposition: 'inline',
        });
      }

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: email.trim().toLowerCase(),
        subject: `You're registered: ${webinar.title}`,
        html: buildConfirmationEmail({
          firstName: first_name.trim(),
          hasBanner: !!bannerBuffer,
          webinar,
        }),
        attachments,
      });

      await supabaseAdmin!
        .from('webinar_registrations')
        .update({ confirmation_sent: true })
        .eq('id', registration.id);
    } catch {
      // Email failure is non-fatal — registration is already saved
    }

    return res.status(201).json({ message: 'Registration successful' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message ?? 'Internal server error' });
  }
}
