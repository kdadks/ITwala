-- Remove ALL sample/mock data from analytics_data table
-- This will leave you with only real tracking data

-- Step 1: Delete all existing sample data
DELETE FROM analytics_data;

-- Step 2: Reset the table (clears all records and resets auto-increment)
TRUNCATE TABLE analytics_data RESTART IDENTITY;

-- Step 3: Verify the table is empty
SELECT COUNT(*) as remaining_records FROM analytics_data;

-- Optional: Also clear page_views and user_sessions if you want to start completely fresh
-- Uncomment these lines if you want to remove all tracking history:
-- DELETE FROM page_views;
-- DELETE FROM user_sessions;
-- TRUNCATE TABLE page_views RESTART IDENTITY;
-- TRUNCATE TABLE user_sessions RESTART IDENTITY;

-- Success message
SELECT 'All sample data removed! Analytics will now only show real website usage data.' as status;