-- Setup pg_cron for automatic daily analytics aggregation
-- This runs directly in Supabase without needing external services

-- Enable the pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove any existing analytics aggregation job (to avoid duplicates)
-- This will only unschedule if the job exists
DO $$
BEGIN
    PERFORM cron.unschedule('daily-analytics-aggregation');
EXCEPTION
    WHEN OTHERS THEN
        RAISE NOTICE 'Job does not exist yet, proceeding with creation';
END $$;

-- Schedule the analytics aggregation job
-- Runs every day at 2:00 AM UTC (same as your external cron)
-- The job calls the aggregate_daily_analytics function with yesterday's date
SELECT cron.schedule(
    'daily-analytics-aggregation',           -- Job name
    '0 2 * * *',                            -- Cron schedule: 2 AM daily
    $$
    SELECT aggregate_daily_analytics(target_date := (CURRENT_DATE - 1)::DATE);
    $$
);

-- Verify the job was created
SELECT * FROM cron.job WHERE jobname = 'daily-analytics-aggregation';

-- To view job execution history (useful for debugging)
-- SELECT * FROM cron.job_run_details WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname = 'daily-analytics-aggregation') ORDER BY start_time DESC LIMIT 10;

-- Instructions:
-- 1. Run this SQL in the Supabase SQL Editor
-- 2. The job will automatically run every day at 2 AM UTC
-- 3. No need for external cron services or API endpoints
-- 4. Check execution logs with: SELECT * FROM cron.job_run_details WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname = 'daily-analytics-aggregation') ORDER BY start_time DESC LIMIT 10;

COMMENT ON EXTENSION pg_cron IS 'Job scheduler for PostgreSQL - used for daily analytics aggregation';
