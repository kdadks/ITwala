# Event Registration Email Fix

## Issue Summary

Event registration emails were not being sent after users submitted the form at `/events/[id]`. The registration was successfully saved to the database, but confirmation emails failed silently without any error logs.

## Root Cause

The event registration API endpoint (`/api/webinars/[id]/register`) had inadequate error handling:
1. All email errors were silently caught and ignored
2. No diagnostic logging to identify SMTP configuration issues
3. No validation of required SMTP environment variables

## Changes Made

### 1. Enhanced Error Logging

**File:** `src/pages/api/webinars/[id]/register.ts`

Added comprehensive error logging similar to the enrollment endpoint:
- Pre-flight validation of SMTP environment variables
- Detailed SMTP configuration logging
- Specific error code handling (EAUTH, ESOCKET, EENVELOPE, ECONNECTION)
- Success confirmation logs

```typescript
// Before: Silent error handling
catch {
  // Email failure is non-fatal — registration is already saved
}

// After: Detailed error handling
catch (emailError: any) {
  console.error('❌ Email notification error:', emailError);
  
  if (emailError.code === 'EAUTH') {
    console.error('Authentication error - check SMTP_USER and SMTP_PASS');
  } else if (emailError.code === 'ESOCKET') {
    console.error('Socket error - check SMTP host and port');
  } else if (emailError.code === 'EENVELOPE') {
    console.error('Envelope error - check from/to email addresses');
  } else if (emailError.code === 'ECONNECTION') {
    console.error('Connection error - check SMTP_HOST and network connectivity');
  }
}
```

### 2. SMTP Configuration Validation

Added pre-flight validation to check if all required SMTP environment variables are configured:

```typescript
if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS || !process.env.SMTP_FROM) {
  console.error('❌ SMTP configuration is incomplete. Missing required environment variables:');
  console.error('SMTP_HOST:', process.env.SMTP_HOST ? '✓ Set' : '✗ Missing');
  console.error('SMTP_USER:', process.env.SMTP_USER ? '✓ Set' : '✗ Missing');
  console.error('SMTP_PASS:', process.env.SMTP_PASS ? '✓ Set' : '✗ Missing');
  console.error('SMTP_FROM:', process.env.SMTP_FROM ? '✓ Set' : '✗ Missing');
  throw new Error('SMTP configuration is incomplete');
}
```

### 3. Test Script

**File:** `scripts/test-event-email.js`

Created a comprehensive test script to diagnose SMTP configuration issues:
- Validates all required environment variables
- Tests SMTP connection
- Sends a test email
- Provides specific troubleshooting tips based on error codes

## Setup Instructions

### For Local Development

1. **Create `.env.local` file** (if it doesn't exist):
   ```bash
   cp .env.example .env.local
   ```

2. **Add SMTP configuration**:
   ```env
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=sales@it-wala.com
   SMTP_PASS=your-actual-password
   SMTP_FROM=sales@it-wala.com
   ```

3. **Test the configuration**:
   ```bash
   node scripts/test-event-email.js
   ```

### For Production (Netlify)

1. **Go to Netlify Dashboard**:
   - Navigate to: Site Settings > Environment Variables

2. **Add the following environment variables**:
   ```
   SMTP_HOST=smtp.hostinger.com
   SMTP_PORT=465
   SMTP_SECURE=true
   SMTP_USER=sales@it-wala.com
   SMTP_PASS=your-actual-password
   SMTP_FROM=sales@it-wala.com
   ```

3. **Redeploy the site** to pick up the new environment variables

## Troubleshooting

### How to Check Logs

**On Netlify:**
1. Go to Netlify Dashboard
2. Select your site
3. Click "Functions" in the left sidebar
4. Look for the function execution logs

**Locally:**
- Check the terminal/console where your dev server is running
- Look for logs starting with `🔍 Sending webinar registration confirmation email...`

### Common Error Codes

| Error Code | Meaning | Solution |
|------------|---------|----------|
| `EAUTH` | Authentication failed | Check SMTP_USER and SMTP_PASS are correct |
| `ESOCKET` | Socket/connection error | Verify SMTP_HOST and SMTP_PORT are correct |
| `EENVELOPE` | Invalid email address | Check SMTP_FROM is a valid email |
| `ECONNECTION` | Connection timeout | Check network connectivity and firewall settings |

### Testing Steps

1. **Test locally first**:
   ```bash
   node scripts/test-event-email.js
   ```

2. **If local test passes**, ensure the same variables are in Netlify

3. **Check Netlify function logs** after a form submission

4. **Common issues**:
   - Missing environment variables in Netlify
   - Incorrect SMTP password
   - Email account has 2FA enabled (use app-specific password)
   - Firewall blocking outbound SMTP connections

## Expected Behavior

### Before Fix
- ❌ Emails fail silently
- ❌ No error logs
- ❌ No way to diagnose issues
- ✅ Registration still saves (non-fatal)

### After Fix
- ✅ Detailed error logs in console
- ✅ SMTP configuration validation
- ✅ Specific error messages for different issues
- ✅ Test script available for diagnosis
- ✅ Registration still saves (non-fatal)

## Verification

To verify the fix is working:

1. **Check the logs** - You should now see detailed SMTP logs
2. **Run the test script** - Confirms SMTP configuration
3. **Submit a test registration** - Verify email is received
4. **Check `webinar_registrations` table** - Verify `confirmation_sent` is set to `true`

## Files Modified

- ✅ `src/pages/api/webinars/[id]/register.ts` - Enhanced error logging
- ✅ `scripts/test-event-email.js` - New test script
- ✅ `.env.example` - Environment variable template
- ✅ `docs/EVENT_EMAIL_FIX.md` - This documentation

## Next Steps

1. Run the test script locally: `node scripts/test-event-email.js`
2. If local test fails, fix the SMTP configuration in `.env.local`
3. Once local test passes, verify the same variables are in Netlify
4. Redeploy and test with a real event registration
5. Check Netlify function logs to confirm emails are being sent

## Related Issues

This fix follows the same pattern used in:
- `/api/enrollment/enroll.ts` - Enrollment email notifications
- `/api/enrollment/notify.ts` - Enrollment notification system
- `/api/admin/students/create.ts` - Student creation emails

All email-sending endpoints now have consistent error handling and logging.
