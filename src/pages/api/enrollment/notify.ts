import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

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
    const { userId, courseId, name, email, phone } = req.body;

    if (!userId || !courseId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get course details
    const { data: courseData, error: courseError } = await supabase
      .from('courses')
      .select('title, description')
      .eq('id', courseId)
      .single();

    if (courseError) {
      throw new Error(`Error fetching course: ${courseError.message}`);
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

    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: 'sales@it-wala.com',
      subject: `New Course Enrollment: ${courseData.title}`,
      html: `
        <h2>New Course Enrollment</h2>
        <p><strong>Course:</strong> ${courseData.title}</p>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      `,
    });

    // Send confirmation email to student
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: email,
      subject: `Enrollment Confirmation: ${courseData.title}`,
      html: `
        <h2>Enrollment Confirmation</h2>
        <p>Dear ${name},</p>
        <p>Thank you for enrolling in <strong>${courseData.title}</strong>.</p>
        <p>${courseData.description}</p>
        <p>Our team will contact you shortly with further details about the course schedule and payment options.</p>
        <p>If you have any questions, please contact us at sales@it-wala.com or call +91 7982303199.</p>
        <p>Best regards,<br>ITwala Academy Team</p>
      `,
    });

    return res.status(200).json({ message: 'Enrollment notification sent successfully' });
  } catch (error) {
    console.error('Error sending enrollment notification:', error);
    
    // More detailed error logging
    if (error.code === 'EAUTH') {
      console.error('Authentication error - check SMTP_USER and SMTP_PASS');
      return res.status(500).json({ message: 'Authentication error with email server' });
    } else if (error.code === 'ESOCKET') {
      console.error('Socket error - check SMTP host and port');
      return res.status(500).json({ message: 'Connection error with email server' });
    } else if (error.code === 'EENVELOPE') {
      console.error('Envelope error - check from/to email addresses');
      return res.status(500).json({ message: 'Invalid sender or recipient email' });
    } else if (error.message.includes('no such table')) {
      console.error('Database error - table not found');
      return res.status(500).json({ message: 'Database error - course information not available' });
    }
    
    return res.status(500).json({
      message: 'Error sending enrollment notification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}