# Country Analytics Setup Guide

## Overview
This guide will help you add country tracking to your analytics system and fix the page view trend visualization.

## Step 1: Run SQL Migration in Supabase

1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the content from `add-country-to-analytics-fixed.sql`
4. Click "Run" to execute

### What this does:
- Adds `country` column to `page_views` table
- Adds `countries` column to `analytics_data` table
- Updates the aggregation function to include country data

## Step 2: Verify the Changes

After running the SQL, verify the columns were added:

```sql
-- Check if columns exist
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name IN ('page_views', 'analytics_data') 
AND column_name IN ('country', 'countries');
```

## Step 3: Test Country Tracking

The analytics tracker has been updated to capture country information using IP geolocation. To test:

1. Visit your website
2. Navigate to different pages
3. Check the database:

```sql
-- View recent page views with country
SELECT 
    created_at,
    page_url,
    country
FROM page_views
ORDER BY created_at DESC
LIMIT 10;
```

## Step 4: Re-run Analytics Aggregation

To populate the country data in analytics_data:

```bash
cd scripts
node run-analytics-aggregation.js backfill 7
```

## What's Been Updated

### 1. AnalyticsTracker Component (`src/components/common/AnalyticsTracker.tsx`)
- Added geo-location detection using ipapi.co
- Captures visitor's country automatically
- No API key required for basic country detection

### 2. Admin Analytics Page (`src/pages/admin/analytics/index.tsx`)
- Fixed page view trend visualization with:
  - Proper scaling and height
  - Y-axis labels
  - X-axis date labels
  - Hover tooltips
- Added country statistics section showing:
  - Top 5 countries by visits
  - Visual progress bars
  - Geographic distribution placeholder

### 3. Database Schema
- `page_views.country` - Stores country for each page view
- `analytics_data.countries` - Stores aggregated country data

## Features Added

### Country Tracking
- Automatic country detection for all visitors
- No user action required
- Privacy-friendly (only country, no precise location)

### Improved Page View Chart
- Better visual representation
- Responsive design
- Clear axis labels
- Interactive tooltips on hover

### Country Analytics Display
- Top countries by visitor count
- Visual progress bars
- Country codes display
- Expandable to show more countries

## Troubleshooting

### If country data isn't showing:
1. Clear your browser cache
2. Make sure the SQL migration ran successfully
3. New visits will capture country data (old data won't have it)
4. Check browser console for any errors

### If page view chart looks wrong:
1. Ensure you have data in analytics_data table
2. Run the aggregation script to populate data
3. Check for JavaScript errors in console

## Next Steps

1. **Monitor Country Data**: Check the admin analytics page regularly
2. **Set Up Daily Aggregation**: Schedule the aggregation script to run daily
3. **Consider Enhancements**:
   - Add city-level tracking (requires API key)
   - Implement geographic map visualization
   - Add country-based filtering

## Privacy Considerations

The country tracking uses IP-based geolocation which:
- Only captures country-level data
- Doesn't store IP addresses
- Is GDPR compliant
- Respects user privacy

Your analytics system now tracks visitor countries and displays them in the admin dashboard! 🌍