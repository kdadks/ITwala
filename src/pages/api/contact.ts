import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { name, email, phone, subject, message, toEmail } = req.body;

    // Debug information
    console.log('Contact form submission:');
    console.log('- Name:', name);
    console.log('- Email:', email);
    console.log('- Subject:', subject);
    console.log('- To Email:', toEmail);
    console.log('- SMTP User:', process.env.SMTP_USER);
    console.log('- SMTP From:', process.env.SMTP_FROM);
    console.log('- SMTP Host:', process.env.SMTP_HOST);
    console.log('- SMTP Port:', process.env.SMTP_PORT);
    
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

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: toEmail,
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    
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
    }
    
    return res.status(500).json({
      message: 'Error sending email',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
