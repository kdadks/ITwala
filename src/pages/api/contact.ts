import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { sanitizeText, sanitizeEmail } from '@/utils/sanitize';
import { applyRateLimit } from '@/lib/rateLimit';
import { contactSchema } from '@/utils/validation';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validated = contactSchema.parse(req.body);
    const { name, email, phone, subject, message, toEmail } = validated;

    if (!applyRateLimit(req, res)) return;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const safeName = sanitizeText(name);
    const safeEmail = sanitizeEmail(email);
    const safeSubject = sanitizeText(subject);
    const safeMessage = sanitizeText(message);
    const safeToEmail = toEmail ? sanitizeEmail(toEmail) : undefined;

    if (!safeToEmail) {
      return res.status(400).json({ message: 'Recipient email is required' });
    }

    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: safeToEmail,
      subject: `Contact Form: ${safeSubject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${safeSubject}</p>
        <p><strong>Message:</strong></p>
        <p>${safeMessage}</p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error: any) {
    const isDev = process.env.NODE_ENV === 'development';
    return res.status(500).json({
      message: 'Error sending email',
      ...(isDev && { error: error.message })
    });
  }
}
