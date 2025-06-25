# Netlify Email Setup Guide

This guide explains how to set up email functionality for the ITWala Academy website on Netlify.

## Prerequisites

- A Netlify account
- A Hostinger email account
- Access to the ITWala Academy GitHub repository

## Environment Variables Setup

1. Log in to your Netlify dashboard
2. Navigate to your site
3. Go to **Site settings** > **Environment variables**
4. Add the following environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `SMTP_USER` | `sales@it-wala.com` | Your Hostinger email address |
| `SMTP_PASS` | `your-password` | Your Hostinger email password |
| `SMTP_FROM` | `sales@it-wala.com` | The "from" email address |

## Deployment Process

1. Push your changes to the GitHub repository
2. Netlify will automatically detect the changes and start the build process
3. The build process will use the environment variables you set up

## Verifying Email Functionality

### Testing Locally

Before deploying to Netlify, you can test your SMTP configuration locally:

1. Ensure your `.env` file has the correct SMTP credentials:
   ```
   SMTP_USER=sales@it-wala.com
   SMTP_PASS=your-password
   SMTP_FROM=sales@it-wala.com
   ```

2. Run the SMTP test script:
   ```bash
   node scripts/test-smtp.js
   ```

3. The script will:
   - Verify the connection to the SMTP server
   - Send a test email to your address
   - Display detailed logs of the process
   - Show any errors that occur

### Testing After Deployment

After deployment, you can verify that the email functionality is working correctly by:

1. Filling out the contact form on the website
2. Enrolling in a course
3. Checking that you receive the appropriate email notifications
4. Checking the Netlify function logs for any errors

## Troubleshooting

If you encounter a 500 Internal Server Error or emails are not being sent:

1. Check the Netlify function logs for detailed error messages
2. Verify that the environment variables are set correctly:
   - SMTP_USER should be set to sales@it-wala.com
   - SMTP_PASS should be set to your correct Hostinger email password
   - SMTP_FROM should be set to sales@it-wala.com

3. Common error codes and solutions:
   - **EAUTH**: Authentication error - check that your SMTP_USER and SMTP_PASS are correct
   - **ESOCKET**: Socket error - verify that smtp.hostinger.com and port 465 are accessible from Netlify
   - **EENVELOPE**: Envelope error - check that the from/to email addresses are valid

4. Ensure that your Hostinger email account is active and properly configured:
   - Verify that the email account exists in your Hostinger control panel
   - Check if there are any restrictions or security settings that might block API access
   - Confirm that SMTP is enabled for your email account

5. Test locally before deploying:
   - Set up the environment variables in your local .env file
   - Run the application locally and test the contact form
   - Check the console for detailed error messages

6. If using a custom domain for email, ensure MX records are properly configured

## SMTP Configuration Details

The application is configured to use the following SMTP settings:

- Host: `smtp.hostinger.com`
- Port: `465`
- Secure: `true`

These settings are hardcoded in the API endpoints:
- `src/pages/api/contact.ts`
- `src/pages/api/enrollment/notify.ts`

## Security Considerations

- Never commit sensitive information like email passwords to your repository
- Always use environment variables for sensitive information
- Consider using Netlify's encrypted environment variables for added security