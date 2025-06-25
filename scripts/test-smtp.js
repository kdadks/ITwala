const nodemailer = require('nodemailer');
require('dotenv').config();

async function testSMTP() {
  console.log('Testing SMTP Configuration...');
  console.log('----------------------------');
  console.log('SMTP Host: smtp.hostinger.com');
  console.log('SMTP Port: 465');
  console.log('SMTP User:', process.env.SMTP_USER);
  console.log('SMTP From:', process.env.SMTP_FROM);
  console.log('----------------------------');

  try {
    // Create a transporter using SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      debug: true, // Show debug output
      logger: true // Log information into the console
    });

    // Verify connection configuration
    console.log('Verifying connection...');
    await transporter.verify();
    console.log('Server is ready to take our messages');

    // Send test email
    console.log('Sending test email...');
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.SMTP_USER,
      subject: 'SMTP Test',
      html: `
        <h2>SMTP Test Email</h2>
        <p>This is a test email to verify SMTP configuration.</p>
        <p>If you're seeing this, your SMTP configuration is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    console.log('----------------------------');
    console.log('SMTP test completed successfully!');
  } catch (error) {
    console.error('SMTP Test Failed:');
    console.error(error);
    
    if (error.code === 'EAUTH') {
      console.error('\nAuthentication error - check SMTP_USER and SMTP_PASS');
    } else if (error.code === 'ESOCKET') {
      console.error('\nSocket error - check SMTP host and port');
    } else if (error.code === 'EENVELOPE') {
      console.error('\nEnvelope error - check from/to email addresses');
    }
    
    process.exit(1);
  }
}

testSMTP();