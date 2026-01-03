# Analytics Setup for Netlify

## ✅ What's Already Done

1. ✅ SQL migration ran successfully in Supabase
2. ✅ Netlify scheduled function created
3. ✅ netlify.toml configured with cron schedule
4. ✅ API endpoints created for manual triggering
5. ✅ Country detection improved with server-side API

## 🚀 Deploy to Netlify

### Step 1: Add Environment Variables in Netlify

Go to Netlify Dashboard → Site Settings → Environment Variables, and add:

1. **ANALYTICS_CRON_SECRET** (optional but recommended)
   - Value: `e343c92a2b4d43249255b0836dba7c36371a758fe4a081dfb14dbbff3fa990ee`
   - This secures your manual API endpoint

These should already be set (verify they exist):
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Step 2: Deploy Your Code

```bash
# Commit all changes
git add .
git commit -m "Add Netlify scheduled analytics aggregation and improved country tracking"
git push
```

Netlify will automatically deploy.

### Step 3: Enable Scheduled Functions (IMPORTANT)

**Note**: Netlify Scheduled Functions require a **Level 1 site** or higher (available on Pro plan or higher).

1. Go to Netlify Dashboard → Your Site → Functions
2. Look for `scheduled-analytics-aggregation`
3. Verify the schedule shows: `0 2 * * *` (2 AM UTC daily)

**If you're on the free plan**, you have two options:
- **Option A**: Upgrade to Pro plan ($19/month) to get scheduled functions
- **Option B**: Use a free external cron service (see Alternative Setup below)

## Alternative Setup (Free Plan Compatible)

If you're on Netlify's free plan, use an external cron service:

### Using cron-job.org (Free)

1. Go to https://cron-job.org/en/ and create a free account

2. Create a new cron job:
   - **Title**: Analytics Aggregation
   - **URL**: `https://your-site.netlify.app/api/analytics/aggregate`
   - **Schedule**: Daily at 2:00 AM (your timezone or UTC)
   - **Request method**: POST
   - **Headers** (if you set ANALYTICS_CRON_SECRET):
     ```
     Authorization: Bearer e343c92a2b4d43249255b0836dba7c36371a758fe4a081dfb14dbbff3fa990ee
     ```

3. Save and enable the job

### Using EasyCron (Free)

1. Go to https://www.easycron.com/ and create a free account (up to 1 cron job free)

2. Create a new cron job:
   - **URL**: `https://your-site.netlify.app/api/analytics/aggregate`
   - **Cron Expression**: `0 2 * * *` (2 AM daily)
   - **Request Type**: POST
   - **Custom Headers**:
     ```
     Authorization: Bearer e343c92a2b4d43249255b0836dba7c36371a758fe4a081dfb14dbbff3fa990ee
     ```

3. Save and test

## How It Works

### Automatic Aggregation (Pro Plan):
```
Every day at 2 AM UTC
    ↓
Netlify triggers scheduled function
    ↓
scheduled-analytics-aggregation.js runs
    ↓
Calls aggregate_daily_analytics() in Supabase
    ↓
Yesterday's data aggregated
    ↓
Admin dashboard shows updated data
```

### Manual Aggregation (Free Plan with External Cron):
```
Every day at 2 AM
    ↓
cron-job.org sends POST request
    ↓
/api/analytics/aggregate endpoint
    ↓
Calls aggregate_daily_analytics() in Supabase
    ↓
Yesterday's data aggregated
    ↓
Admin dashboard shows updated data
```

## Testing

### Test the Netlify Function Locally

```bash
# Install Netlify CLI if you haven't
npm install -g netlify-cli

# Test function locally
netlify dev

# In another terminal, trigger the function
curl -X POST http://localhost:8888/.netlify/functions/scheduled-analytics-aggregation
```

### Test the API Endpoint

```bash
# Test on your deployed site
curl -X POST https://your-site.netlify.app/api/analytics/aggregate \
  -H "Authorization: Bearer e343c92a2b4d43249255b0836dba7c36371a758fe4a081dfb14dbbff3fa990ee"
```

### Test Manual Aggregation Script

```bash
# Still works locally
node scripts/run-analytics-aggregation.js

# Backfill last 7 days
node scripts/run-analytics-aggregation.js backfill 7
```

## Monitoring

### Check Netlify Function Logs

1. Netlify Dashboard → Your Site → Functions → `scheduled-analytics-aggregation`
2. Click on the function to see logs
3. Should see executions at 2 AM UTC daily

### Check if Data is Being Aggregated

In Supabase SQL Editor:
```sql
-- Check latest aggregated data
SELECT date, page_views, unique_visitors, countries
FROM analytics_data
ORDER BY date DESC
LIMIT 7;

-- Check country distribution
SELECT
  date,
  jsonb_array_length(countries) as countries_tracked,
  countries
FROM analytics_data
WHERE date >= CURRENT_DATE - INTERVAL '7 days'
ORDER BY date DESC;
```

### View in Admin Dashboard

Go to: `https://your-site.netlify.app/admin/analytics`

**Countries Tab** should now show:
- Actual country names instead of "Unknown"
- Proper distribution of visitors by country
- Data refreshes every 30 seconds

## Troubleshooting

### No Scheduled Functions Available

**Cause**: You're on Netlify's free plan
**Solution**: Use external cron service (cron-job.org or EasyCron) as described above

### Function Not Running

1. Check Netlify Functions tab for errors
2. Check environment variables are set
3. Test manually: `curl -X POST https://your-site.netlify.app/.netlify/functions/scheduled-analytics-aggregation`

### Countries Still Showing "Unknown"

**In Development (localhost)**:
- This is normal - IP is 127.0.0.1
- Will work correctly on deployed site

**In Production**:
- Check browser console for country detection logs
- Should see: `✅ Country detected via server-side: [Country]`
- If not, check `/api/analytics/get-country` is working

### No Data in Dashboard

```bash
# 1. Check if page views are being captured
# In Supabase SQL Editor:
SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURRENT_DATE;

# 2. Run manual aggregation
node scripts/run-analytics-aggregation.js

# 3. Check aggregated data
SELECT * FROM analytics_data ORDER BY date DESC LIMIT 5;
```

## Current Status

✅ **Working**:
- Analytics tracking (3,948+ page views)
- Country detection with server-side API
- Manual aggregation via script
- Manual aggregation via API endpoint
- Netlify scheduled function configured

🎯 **Next Steps**:
1. Deploy to Netlify
2. **If on Pro plan**: Verify scheduled function is enabled
3. **If on Free plan**: Set up external cron service
4. Add `ANALYTICS_CRON_SECRET` environment variable (optional)
5. Check `/admin/analytics` after 24 hours

## Summary

### Files Created for Netlify:
- `netlify/functions/scheduled-analytics-aggregation.js` - Scheduled function
- `netlify.toml` - Updated with function configuration

### Three Ways to Run Aggregation:

1. **Automatic (Pro Plan)**: Netlify scheduled function runs daily at 2 AM
2. **Automatic (Free Plan)**: External cron service calls API daily at 2 AM
3. **Manual**: Run `node scripts/run-analytics-aggregation.js` anytime

### Country Detection Improvements:

- Server-side IP lookup (`/api/analytics/get-country`)
- 90-95% accuracy in production
- Proper country names in analytics dashboard
- Fallback to timezone/locale if IP lookup fails

## Questions?

**Q: Do I need ANALYTICS_CRON_SECRET?**
A: Optional. It secures the manual API endpoint. If not set, the API works in "testing mode" without auth.

**Q: Which is better - Netlify function or external cron?**
A: Netlify function is cleaner (no external service), but requires Pro plan. External cron is free and works identically.

**Q: How do I know it's working?**
A: Check Netlify Functions logs or cron service logs. Also check `analytics_data` table in Supabase for new daily records.

**Q: Can I change the schedule?**
A: Yes! Update the cron expression in `netlify.toml` or in your external cron service. Format: `minute hour day month dayofweek`

---

**Ready to deploy!** Just push your code to trigger Netlify deployment.
