# Netlify Environment Variables Setup Guide

## Immediate Action Required

The event registration emails are not being sent because the **SMTP environment variables are missing** in your Netlify deployment.

## Steps to Fix

### 1. Access Netlify Dashboard
1. Go to [https://app.netlify.com](https://app.netlify.com)
2. Log in to your account
3. Select your ITWala site
4. Go to **Site Settings** (in the left sidebar)
5. Click **Environment Variables** (under Build & Deploy section)

### 2. Add These Environment Variables

You need to add **6 SMTP variables**:

| Variable Name | Value |
|--------------|-------|
| `SMTP_HOST` | `smtp.hostinger.com` |
| `SMTP_PORT` | `465` |
| `SMTP_SECURE` | `true` |
| `SMTP_USER` | `sales@it-wala.com` |
| `SMTP_PASS` | `Chu@P+#LuD0` *(or try: Nokia@@@3315 if current doesn't work)* |
| `SMTP_FROM` | `sales@it-wala.com` |

### 3. How to Add Each Variable

For each variable:
1. Click **Add a variable** button
2. **Key**: Enter the variable name exactly as shown above (e.g., `SMTP_HOST`)
3. **Value**: Enter the corresponding value
4. **Scopes**: Keep default (usually "All")
5. Click **Create variable**

### 4. Verify All Variables Are Set

After adding all 6, you should see them listed. Make sure you have:
- ✅ SMTP_HOST
- ✅ SMTP_PORT
- ✅ SMTP_SECURE
- ✅ SMTP_USER
- ✅ SMTP_PASS
- ✅ SMTP_FROM

### 5. Trigger a Redeploy

After adding the variables:
1. Go to **Deploys** tab
2. Click **Trigger deploy** button
3. Select **Deploy site**
4. Wait for deployment to complete (usually 2-3 minutes)

## Testing After Deployment

### Test the Event Registration

1. Go to your event page: `https://it-wala.com/events/15af20d4-3457-4f05-b296-85843e43e619`
2. Fill out and submit the registration form
3. Check the email inbox (sales@it-wala.com or your test email)

### Check the Logs

If emails still don't work:

1. In Netlify Dashboard, go to **Functions** tab
2. Look for recent function executions
3. Click on a function to see logs
4. Look for these log messages:

   **Success:**
   ```
   ✅ Webinar registration email sent successfully
   ```

   **Failure - Will show specific error:**
   ```
   ❌ Email notification error:
   Authentication error - check SMTP_USER and SMTP_PASS
   ```

### Common Issues After Setup

| Error in Logs | Solution |
|--------------|----------|
| `EAUTH - Authentication failed` | Wrong password - try the alternate: `Nokia@@@3315` |
| `ESOCKET - Socket error` | Verify SMTP_HOST is `smtp.hostinger.com` |
| `EENVELOPE - Envelope error` | Verify SMTP_FROM is `sales@it-wala.com` |
| No error logs | Variables may not be loaded - try another redeploy |

## Password Note

Your documentation shows two passwords:
- **Current:** `Chu@P+#LuD0` (you provided this)
- **Previous:** `Nokia@@@3315` (in PRODUCTION_DEPLOYMENT_GUIDE.md)

**Try the current one first.** If authentication fails in the logs, update `SMTP_PASS` to `Nokia@@@3315` and redeploy.

## Verification Checklist

After deployment, verify:
- [ ] All 6 SMTP variables are set in Netlify
- [ ] Site has been redeployed
- [ ] Test registration form submits successfully
- [ ] Email confirmation is received
- [ ] Netlify function logs show: `✅ Webinar registration email sent successfully`
- [ ] Database `webinar_registrations` table shows `confirmation_sent = true`

## Quick Reference - Copy & Paste Values

```
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=sales@it-wala.com
SMTP_PASS=Chu@P+#LuD0
SMTP_FROM=sales@it-wala.com
```

## What Changed in the Code

The code now:
1. ✅ Validates SMTP configuration before sending
2. ✅ Logs detailed error messages
3. ✅ Shows exactly which environment variable is missing
4. ✅ Provides specific troubleshooting for each error type

This means you'll now see **clear error messages** in the Netlify function logs if there are any issues.

## Need Help?

If emails still don't work after following these steps:
1. Check Netlify function logs for specific error codes
2. Verify the password by logging into https://webmail.hostinger.com
3. Check if 2FA is enabled on the email account
4. Contact Hostinger support if authentication continues to fail

---

**Files Modified:**
- `src/pages/api/webinars/[id]/register.ts` - Enhanced error handling
- `scripts/test-event-email.js` - Test script for local debugging
- `docs/EVENT_EMAIL_FIX.md` - Complete documentation
- `.env.local` - Local environment configuration (not deployed)

**Next Step:** Follow the steps above to add SMTP variables to Netlify.
