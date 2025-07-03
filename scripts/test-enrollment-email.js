const { createTransport } = require('nodemailer');

// Test SMTP configuration
async function testSMTP() {
  console.log('Testing SMTP configuration...');
  
  // Load environment variables
  require('dotenv').config();
  
  console.log('SMTP_USER:', process.env.SMTP_USER);
  console.log('SMTP_FROM:', process.env.SMTP_FROM);
  console.log('SMTP_PASS:', process.env.SMTP_PASS ? '[HIDDEN]' : 'NOT SET');
  
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
    
    // Test connection
    console.log('Testing SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    
    // Send test email
    console.log('Sending test enrollment email...');
    const result = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'sales@it-wala.com',
      to: 'sales@it-wala.com',
      subject: 'Test Enrollment Email',
      html: `
        <h2>Test Enrollment Email</h2>
        <p>This is a test email to verify enrollment email functionality.</p>
        <p><strong>Course:</strong> Test Course</p>
        <p><strong>Name:</strong> Test User</p>
        <p><strong>Email:</strong> test@example.com</p>
        <p><strong>Phone:</strong> +91 9876543210</p>
      `,
    });
    
    console.log('✅ Test email sent successfully:', result.messageId);
    
  } catch (error) {
    console.error('❌ SMTP Error:', error);
    
    if (error.code === 'EAUTH') {
      console.error('Authentication error - check SMTP_USER and SMTP_PASS');
    } else if (error.code === 'ESOCKET') {
      console.error('Socket error - check SMTP host and port');
    } else if (error.code === 'EENVELOPE') {
      console.error('Envelope error - check from/to email addresses');
    }
  }
}

testSMTP();