const { createTransport } = require('nodemailer');

// Test enrollment email flow
async function testEnrollmentFlow() {
  console.log('Testing enrollment email flow...');
  
  // Load environment variables
  require('dotenv').config();
  
  try {
    // Create transporter
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Test email data
    const testEmailData = {
      studentName: 'Test Student',
      studentEmail: 'test@example.com',
      studentPhone: '+1234567890',
      courseTitle: 'Test Course',
      courseDuration: '4 weeks',
      courseFees: '₹5,000'
    };

    console.log('Sending student confirmation email...');
    
    // Send student confirmation email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: testEmailData.studentEmail,
      subject: `Enrollment Confirmation - ${testEmailData.courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to ITwala Academy!</h2>
          <p>Dear ${testEmailData.studentName},</p>
          <p>Thank you for enrolling in <strong>${testEmailData.courseTitle}</strong>.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Course Details:</h3>
            <ul>
              <li><strong>Course:</strong> ${testEmailData.courseTitle}</li>
              <li><strong>Duration:</strong> ${testEmailData.courseDuration}</li>
              <li><strong>Fees:</strong> ${testEmailData.courseFees}</li>
            </ul>
          </div>
          
          <p>We will contact you soon with further details.</p>
          <p>Best regards,<br>ITwala Academy Team</p>
        </div>
      `,
    });

    console.log('✅ Student confirmation email sent successfully');

    console.log('Sending admin notification email...');

    // Send admin notification email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: 'sales@it-wala.com',
      subject: `New Enrollment - ${testEmailData.courseTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">New Course Enrollment</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px;">
            <h3>Student Information:</h3>
            <ul>
              <li><strong>Name:</strong> ${testEmailData.studentName}</li>
              <li><strong>Email:</strong> ${testEmailData.studentEmail}</li>
              <li><strong>Phone:</strong> ${testEmailData.studentPhone}</li>
            </ul>
            
            <h3>Course Information:</h3>
            <ul>
              <li><strong>Course:</strong> ${testEmailData.courseTitle}</li>
              <li><strong>Duration:</strong> ${testEmailData.courseDuration}</li>
              <li><strong>Fees:</strong> ${testEmailData.courseFees}</li>
            </ul>
          </div>
          
          <p>Please follow up with the student for payment and course access.</p>
        </div>
      `,
    });

    console.log('✅ Admin notification email sent successfully');
    console.log('✅ All enrollment emails sent successfully!');

  } catch (error) {
    console.error('❌ Error sending enrollment emails:', error);
  }
}

// Run the test
testEnrollmentFlow().catch(console.error);