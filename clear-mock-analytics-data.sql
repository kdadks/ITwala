-- Clear all mock data from analytics tables to start fresh with real data

-- Clear mock analytics data (keep table structure)
DELETE FROM analytics_data;

-- Clear any existing page views and sessions (if you want to start completely fresh)
-- Uncomment these lines if you want to remove all existing tracking data:
-- DELETE FROM page_views;
-- DELETE FROM user_sessions;

-- Reset the analytics data table
-- This ensures we start with a clean slate for real analytics data
TRUNCATE TABLE analytics_data RESTART IDENTITY;

-- Optional: Insert today's initial record with zero values
INSERT INTO analytics_data (
    date, page_views, unique_visitors, total_time, bounce_rate,
    top_pages, referrers, devices
) VALUES (
    CURRENT_DATE, 0, 0, 0, 0.00,
    '[]'::jsonb, '[]'::jsonb, '[]'::jsonb
) ON CONFLICT (date) DO NOTHING;

SELECT 'Mock data cleared! Analytics will now track real website usage.' as result;