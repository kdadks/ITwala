const { createTransport } = require('nodemailer');

// Test enrollment email flow
async function testEnrollmentFlow() {
  console.log('Testing enrollment email flow...');
  
  // Load environment variables
  require('dotenv').config();
  
  try {
    // Create transporter
    const transporter = createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    // Mock course data
    const course = {
      title: 'Test Course - Full Stack Development',
      description: 'A comprehensive course covering modern web development technologies.',
      price: 25000
    };
    
    // Mock student data
    const studentName = 'John Doe';
    const studentEmail = 'john.doe@example.com';
    const studentPhone = '+91 9876543210';

    console.log('Sending test admin notification email...');
    // Send email to admin
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: 'sales@it-wala.com',
      subject: `New Course Enrollment: ${course.title}`,
      html: `
        <h2>New Course Enrollment</h2>
        <p><strong>Course:</strong> ${course.title}</p>
        <p><strong>Student Name:</strong> ${studentName}</p>
        <p><strong>Student Email:</strong> ${studentEmail}</p>
        <p><strong>Student Phone:</strong> ${studentPhone || 'Not provided'}</p>
        <p><strong>Course Price:</strong> ₹${course.price}</p>
        <p><strong>Enrollment Date:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    console.log('✅ Admin notification email sent successfully');

    console.log('Sending test student confirmation email...');
    // Send confirmation email to student
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: studentEmail,
      subject: `Enrollment Confirmation: ${course.title}`,
      html: `
        <h2>Enrollment Confirmation</h2>
        <p>Dear ${studentName},</p>
        <p>Thank you for enrolling in <strong>${course.title}</strong>.</p>
        <p>${course.description}</p>
        <p>Our team will contact you shortly with further details about the course schedule and payment options.</p>
        <p>If you have any questions, please contact us at sales@it-wala.com or call +91 7982303199.</p>
        <p>Best regards,<br>ITwala Academy Team</p>
      `,
    });

    console.log('✅ Student confirmation email sent successfully');
    console.log('🎉 Enrollment email flow test completed successfully!');
    
  } catch (error) {
    console.error('❌ Enrollment flow test failed:', error);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication error - check SMTP_USER and SMTP_PASS');
    } else if (error.code === 'ESOCKET') {
      console.error('Socket error - check SMTP host and port');
    } else if (error.code === 'EENVELOPE') {
      console.error('Envelope error - check from/to email addresses');
    }
  }
}

testEnrollmentFlow();