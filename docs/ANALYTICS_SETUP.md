# Analytics Setup Guide

This guide will help you set up automatic analytics tracking and aggregation.

## Overview

The analytics system consists of:
1. **Real-time tracking**: Client-side tracking of page views, sessions, and user behavior
2. **Data storage**: Raw data stored in `page_views` and `user_sessions` tables
3. **Daily aggregation**: Automatic aggregation of data into `analytics_data` table
4. **Admin dashboard**: View analytics at `/admin/analytics`

## Setup Steps

### 1. Database Setup

Run the following SQL scripts in your Supabase SQL Editor in this order:

1. **Create tables** (if not already done):
   ```bash
   supabase/create-analytics-table.sql
   ```

2. **Add countries column and update aggregation function**:
   ```bash
   supabase/add-countries-to-analytics-data.sql
   ```

3. **Fix RLS policies** (if needed):
   ```bash
   supabase/fix-analytics-rls-manual.sql
   ```

### 2. Environment Variables

Add the following to your `.env.local` file:

```env
# Supabase (should already exist)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Analytics Cron Secret (generate a random string)
ANALYTICS_CRON_SECRET=your-random-secret-key-here
```

**Generate a secret key**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. Vercel Deployment Setup

If deploying to Vercel:

1. Add environment variables in Vercel dashboard:
   - Go to Project Settings → Environment Variables
   - Add `ANALYTICS_CRON_SECRET` with your generated secret

2. The `vercel.json` file is already configured to run daily aggregation at 2 AM UTC:
   ```json
   {
     "crons": [
       {
         "path": "/api/analytics/aggregate",
         "schedule": "0 2 * * *"
       }
     ]
   }
   ```

3. Vercel will automatically set the `Authorization` header with your secret when calling the cron job.

### 4. Manual Aggregation

You can manually trigger aggregation in several ways:

#### Option A: Using the Node.js Script
```bash
node scripts/run-analytics-aggregation.js
```

#### Option B: Using the API Endpoint
```bash
curl -X POST http://localhost:3000/api/analytics/aggregate \
  -H "Authorization: Bearer your-analytics-cron-secret" \
  -H "Content-Type: application/json"
```

#### Option C: Backfill Historical Data
```bash
# Backfill last 7 days
node scripts/run-analytics-aggregation.js backfill

# Backfill last 30 days
node scripts/run-analytics-aggregation.js backfill 30
```

### 5. How It Works

#### Data Flow:
1. **User visits page** → AnalyticsTracker component loads
2. **Country detection**:
   - Calls `/api/analytics/get-country` (server-side IP lookup)
   - Falls back to timezone mapping
   - Falls back to Cloudflare API
   - Falls back to browser locale
3. **Data captured**: Page view recorded in `page_views` table
4. **Session tracking**: Session info recorded in `user_sessions` table
5. **Daily aggregation** (runs at 2 AM UTC):
   - Calls `aggregate_daily_analytics()` function
   - Processes previous day's data
   - Stores aggregated metrics in `analytics_data` table
6. **Admin views data**: Dashboard queries `analytics_data` table

#### Country Detection Priority:
1. Server-side IP lookup (most reliable)
2. Timezone mapping (works offline)
3. Cloudflare trace API (fast)
4. Browser locale (least reliable)

### 6. Testing

#### Test Country Detection:
```bash
# Open browser console on your site and check for logs:
✅ Country detected via server-side: [Country Name]
```

#### Test Analytics Tracking:
1. Visit different pages on your site
2. Check Supabase `page_views` table for new entries
3. Verify country field is populated

#### Test Aggregation:
```bash
# Run aggregation for yesterday
node scripts/run-analytics-aggregation.js

# Check results in Supabase analytics_data table
```

### 7. Monitoring

Check the Vercel logs to see if the cron job is running:
- Go to Vercel Dashboard → Your Project → Logs
- Filter by `/api/analytics/aggregate`
- Should see daily execution at 2 AM UTC

### 8. Troubleshooting

#### "Unknown" Countries
**Causes**:
- Testing on localhost (IP is 127.0.0.1)
- VPN/proxy usage
- Privacy browsers blocking geolocation
- API rate limits exceeded

**Solutions**:
- Deploy to production (Vercel/Netlify) for real IPs
- Server-side detection should work better in production
- Timezone fallback will work for most users

#### No Data in Analytics Dashboard
**Causes**:
- Aggregation hasn't run yet
- No page views captured
- RLS policies blocking access

**Solutions**:
```bash
# 1. Check if page views are being captured
SELECT COUNT(*) FROM page_views;

# 2. Run manual aggregation
node scripts/run-analytics-aggregation.js

# 3. Check aggregated data
SELECT * FROM analytics_data ORDER BY date DESC LIMIT 5;

# 4. Verify you're an admin
SELECT role FROM profiles WHERE id = 'your-user-id';
```

#### Aggregation Not Running Automatically
**Causes**:
- Vercel cron not configured
- Wrong ANALYTICS_CRON_SECRET
- API endpoint failing

**Solutions**:
1. Check Vercel cron is enabled (Pro plan required)
2. Verify environment variables in Vercel
3. Check Vercel logs for errors
4. Test endpoint manually

### 9. Database Queries

Useful SQL queries:

```sql
-- Check total page views today
SELECT COUNT(*) FROM page_views WHERE DATE(created_at) = CURRENT_DATE;

-- Check country distribution
SELECT country, COUNT(*) as count
FROM page_views
GROUP BY country
ORDER BY count DESC;

-- Check latest aggregated data
SELECT * FROM analytics_data ORDER BY date DESC LIMIT 7;

-- Manual aggregation for specific date
SELECT aggregate_daily_analytics('2025-01-02'::DATE);

-- Check if countries column exists
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'analytics_data';
```

### 10. Production Checklist

- [ ] Database tables created
- [ ] Countries column added to analytics_data
- [ ] RLS policies configured
- [ ] Environment variables set in Vercel
- [ ] ANALYTICS_CRON_SECRET generated and set
- [ ] vercel.json configured
- [ ] Deployed to Vercel
- [ ] Manual aggregation tested
- [ ] Admin dashboard accessible
- [ ] Country detection working
- [ ] Cron job scheduled and running

## Support

If you encounter issues:
1. Check Supabase logs for database errors
2. Check Vercel logs for API errors
3. Test endpoints manually with curl
4. Verify environment variables
5. Check browser console for client-side errors
