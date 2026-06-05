/**
 * Test script for event registration email functionality
 * Usage: node scripts/test-event-email.js
 */

const { createTransport } = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

async function testEventEmail() {
  console.log('\n🔍 Testing Event Registration Email Configuration\n');
  console.log('='.repeat(60));

  // Step 1: Check environment variables
  console.log('\n1️⃣  Checking SMTP Environment Variables...\n');
  
  const requiredVars = {
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_SECURE: process.env.SMTP_SECURE,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS ? '***configured***' : undefined,
    SMTP_FROM: process.env.SMTP_FROM,
  };

  let allConfigured = true;
  for (const [key, value] of Object.entries(requiredVars)) {
    const status = value ? '✅' : '❌';
    console.log(`${status} ${key}: ${value || 'NOT SET'}`);
    if (!value) allConfigured = false;
  }

  if (!allConfigured) {
    console.error('\n❌ ERROR: Some required SMTP environment variables are missing!');
    console.log('\nPlease add the following to your .env.local file:\n');
    console.log('SMTP_HOST=smtp.hostinger.com');
    console.log('SMTP_PORT=465');
    console.log('SMTP_SECURE=true');
    console.log('SMTP_USER=sales@it-wala.com');
    console.log('SMTP_PASS=your-password-here');
    console.log('SMTP_FROM=sales@it-wala.com');
    process.exit(1);
  }

  console.log('\n✅ All SMTP environment variables are configured\n');

  // Step 2: Test SMTP connection
  console.log('='.repeat(60));
  console.log('\n2️⃣  Testing SMTP Connection...\n');

  try {
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Attempting to verify SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection verified successfully!\n');

    // Step 3: Send test email
    console.log('='.repeat(60));
    console.log('\n3️⃣  Sending Test Email...\n');

    const testEmailAddress = process.env.SMTP_USER; // Send to the same email
    console.log(`Sending test email to: ${testEmailAddress}`);

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: testEmailAddress,
      subject: 'Test: Event Registration Email',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8"/>
          <title>Test Email</title>
        </head>
        <body style="margin:0;padding:20px;background:#f0f4f8;font-family:Arial,sans-serif;">
          <div style="max-width:600px;margin:0 auto;background:#ffffff;padding:30px;border-radius:10px;">
            <h2 style="color:#1a56a0;">✅ Test Email Successful</h2>
            <p>This is a test email from the ITWala event registration system.</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
            <p>If you're seeing this email, your SMTP configuration is working correctly!</p>
            <hr style="border:none;border-top:1px solid #e0e0e0;margin:20px 0;">
            <p style="color:#666;font-size:12px;">
              This is an automated test email. You can safely delete it.
            </p>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Test email sent successfully!\n');
    console.log('='.repeat(60));
    console.log('\n🎉 All tests passed! Your SMTP configuration is working correctly.\n');
    console.log('Next steps:');
    console.log('1. Check your inbox at', testEmailAddress);
    console.log('2. If you received the email, the configuration is correct');
    console.log('3. If not, check your spam folder');
    console.log('4. Make sure the same variables are set in your Netlify environment\n');

  } catch (error) {
    console.error('\n❌ ERROR during testing:\n');
    console.error('Error Code:', error.code || 'Unknown');
    console.error('Error Message:', error.message);
    
    console.log('\n🔧 Troubleshooting Tips:\n');
    
    switch (error.code) {
      case 'EAUTH':
        console.log('❌ Authentication failed - check SMTP_USER and SMTP_PASS');
        console.log('   - Verify username is correct (usually an email address)');
        console.log('   - Verify password is correct');
        console.log('   - Check if 2FA is enabled on the email account');
        break;
      
      case 'ESOCKET':
      case 'ECONNECTION':
      case 'ETIMEDOUT':
        console.log('❌ Connection failed - check SMTP_HOST and SMTP_PORT');
        console.log('   - Verify host:', process.env.SMTP_HOST);
        console.log('   - Verify port:', process.env.SMTP_PORT);
        console.log('   - Check your internet connection');
        console.log('   - Check if your firewall is blocking the connection');
        break;
      
      case 'EENVELOPE':
        console.log('❌ Invalid email address - check SMTP_FROM');
        console.log('   - Verify SMTP_FROM is a valid email address');
        console.log('   - Ensure it matches an authorized sender address');
        break;
      
      default:
        console.log('❌ Unknown error occurred');
        console.log('   - Full error details:', error);
    }
    
    console.log('\n');
    process.exit(1);
  }
}

// Run the test
testEventEmail().catch((error) => {
  console.error('Unexpected error:', error);
  process.exit(1);
});
