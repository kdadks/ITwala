import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { createClient } from '@supabase/supabase-js';
import { sanitizeText } from '@/utils/sanitize';
import { notifySchema } from '@/utils/validation';
import { applyRateLimit } from '@/lib/rateLimit';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const validated = notifySchema.parse(req.body);
    const { userId, courseId, name, email, phone } = validated;

    if (!userId || !courseId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!applyRateLimit(req, res)) return;

    // Get course details
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('title, description')
      .eq('id', courseId)
      .single();

    if (courseError) {
      return res.status(500).json({ message: 'Course information not available' });
    }

    // Create a transporter using SMTP
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const safeName = sanitizeText(name || 'Student');
    const safeEmail = sanitizeText(email || '');
    const safePhone = phone ? sanitizeText(phone) : '';
    const safeCourseTitle = sanitizeText(courseData.title);
    const safeCourseDescription = sanitizeText(courseData.description || '');

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'support@it-wala.com',
      to: 'support@it-wala.com',
      subject: `New Course Enrollment: ${safeCourseTitle}`,
      html: `
        <h2>New Course Enrollment</h2>
        <p><strong>Course:</strong> ${safeCourseTitle}</p>
        <p><strong>Name:</strong> ${safeName}</p>
        <p><strong>Email:</strong> ${safeEmail}</p>
        <p><strong>Phone:</strong> ${safePhone || 'Not provided'}</p>
      `,
    });

    // Send confirmation email to student
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'support@it-wala.com',
      to: safeEmail,
      subject: `Enrollment Confirmation: ${safeCourseTitle}`,
      html: `
        <h2>Enrollment Confirmation</h2>
        <p>Dear ${safeName},</p>
        <p>Thank you for enrolling in <strong>${safeCourseTitle}</strong>.</p>
        <p>${safeCourseDescription}</p>
        <p>Our team will contact you shortly with further details about the course schedule and payment options.</p>
        <p>If you have any questions, please contact us at support@it-wala.com or call +91 7982303199.</p>
        <p>Best regards,<br>ITwala Academy Team</p>
      `,
    });

    return res.status(200).json({ message: 'Enrollment notification sent successfully' });
  } catch (error) {
    return res.status(500).json({
      message: 'Error sending enrollment notification'
    });
  }
}