# Complete Analytics System Setup Guide

## Overview
This guide will help you set up a complete website analytics system that tracks page views, user sessions, and provides detailed analytics in your admin dashboard.

## Step 1: Create Analytics Database Tables

Run this SQL script in your Supabase SQL Editor:

```sql
-- Copy and paste the entire content of create-analytics-table.sql
-- This will create: analytics_data, page_views, user_sessions tables
-- Plus analytics aggregation functions and sample data
```

**File to run:** `create-analytics-table.sql`

## Step 2: Verify Tables Were Created

After running the SQL, verify these tables exist in your Supabase dashboard:
- ✅ `analytics_data` - Daily aggregated analytics
- ✅ `page_views` - Individual page view tracking  
- ✅ `user_sessions` - User session tracking

## Step 3: Test the Analytics Page

1. Start your development server: `npm run dev`
2. Login as admin
3. Navigate to Admin Dashboard → Analytics
4. You should see sample analytics data for the last 30 days

## Features Included

### 📊 Analytics Dashboard
- **Daily Statistics**: Page views, unique visitors, average time, bounce rate
- **Time Range Selection**: Last 7 days or last 30 days
- **Visual Data Table**: Daily breakdown of all metrics
- **Real-time Data**: Updates based on actual website usage

### 🔍 Tracking System
- **Automatic Page Tracking**: Every page view is tracked automatically
- **Session Management**: Unique visitor tracking with session IDs
- **Device Detection**: Mobile, desktop, tablet classification
- **Browser Detection**: Chrome, Firefox, Safari, etc.
- **Duration Tracking**: Time spent on each page
- **Referrer Tracking**: Track where visitors come from

### 🛡️ Privacy & Security
- **Row Level Security**: Only admins can view analytics data
- **Anonymous Tracking**: Works for both logged-in and anonymous users
- **Session-based**: Uses session IDs instead of permanent tracking cookies
- **GDPR Friendly**: Minimal data collection, no personal information stored

## How It Works

### 1. Data Collection
The `AnalyticsTracker` component (added to `_app.tsx`) automatically:
- Tracks every page view
- Records session information
- Measures time spent on pages
- Detects device and browser information

### 2. Data Aggregation
The `aggregate_daily_analytics()` SQL function:
- Runs daily to summarize page view data
- Calculates unique visitors, bounce rates, popular pages
- Stores aggregated data in `analytics_data` table

### 3. Data Display
The Analytics admin page (`/admin/analytics`):
- Queries aggregated data from `analytics_data` table
- Shows interactive dashboard with statistics
- Provides time range filtering

## Manual Analytics Aggregation

If you want to manually run analytics aggregation:

```bash
# Run aggregation for yesterday
cd scripts && node run-analytics-aggregation.js

# Backfill analytics for last 7 days
cd scripts && node run-analytics-aggregation.js backfill 7

# Backfill analytics for last 30 days  
cd scripts && node run-analytics-aggregation.js backfill 30
```

## Sample Data Included

The SQL script includes sample analytics data for the last 30 days:
- **Page Views**: 500-1000 per day
- **Unique Visitors**: 200-500 per day  
- **Average Time**: 60-120 minutes
- **Bounce Rate**: 20-50%
- **Top Pages**: /courses, /about, /contact
- **Referrers**: Google, Direct, Facebook
- **Devices**: Desktop (60%), Mobile (36%), Tablet (4%)

## Real-World Usage

Once deployed, the system will:

1. **Track Real Users**: Every visitor to your website will be tracked
2. **Generate Real Data**: Replace sample data with actual usage statistics
3. **Update Daily**: Analytics data updates automatically as users visit
4. **Provide Insights**: See which pages are popular, where traffic comes from, etc.

## Analytics Metrics Explained

### Page Views
Total number of pages viewed by all visitors

### Unique Visitors  
Number of unique sessions (different people visiting)

### Average Time on Site
Average time visitors spend on your website (in minutes)

### Bounce Rate
Percentage of visitors who leave after viewing only one page

### Top Pages
Most visited pages on your website

### Referrers
Websites that send traffic to your site

### Device Breakdown
Percentage of visitors using desktop, mobile, or tablet

## Troubleshooting

### Analytics Page Shows "No Data"
1. Verify analytics tables were created in Supabase
2. Check that sample data was inserted
3. Ensure admin user has proper permissions

### Tracking Not Working
1. Check browser console for JavaScript errors
2. Verify Supabase connection is working
3. Check RLS policies allow inserting page views

### Aggregation Errors
1. Ensure the `aggregate_daily_analytics()` function exists
2. Check that all required tables have data
3. Verify date format is correct (YYYY-MM-DD)

## Next Steps

### Automated Daily Aggregation
Set up a cron job or scheduled function to run daily aggregation:
```bash
# Add to crontab to run daily at 1 AM
0 1 * * * cd /path/to/your/project/scripts && node run-analytics-aggregation.js
```

### Enhanced Analytics
Consider adding:
- Geographic location tracking (country/city)
- A/B testing capabilities
- Conversion tracking
- Custom event tracking
- Export functionality

### Performance Optimization
For high-traffic sites:
- Consider data retention policies (delete old page_views data)
- Add more database indexes
- Implement caching for analytics dashboard

## Files Created

1. **`create-analytics-table.sql`** - Database schema and sample data
2. **`src/components/common/AnalyticsTracker.tsx`** - Client-side tracking
3. **`scripts/run-analytics-aggregation.js`** - Manual aggregation script
4. **Updated `src/pages/_app.tsx`** - Added analytics tracking
5. **Updated `src/pages/admin/analytics/index.tsx`** - Fixed authentication

Your analytics system is now complete and ready to track real website usage! 🎉