-- Management scripts for the analytics cron job
-- Copy and run these queries in Supabase SQL Editor as needed

-- ========================================
-- VIEW ALL CRON JOBS
-- ========================================
SELECT
    jobid,
    jobname,
    schedule,
    command,
    active
FROM cron.job
ORDER BY jobname;

-- ========================================
-- VIEW RECENT JOB EXECUTION HISTORY
-- ========================================
SELECT
    jr.runid,
    jr.job_pid,
    jr.database,
    jr.username,
    jr.command,
    jr.status,
    jr.return_message,
    jr.start_time,
    jr.end_time,
    EXTRACT(EPOCH FROM (jr.end_time - jr.start_time)) as duration_seconds
FROM cron.job_run_details jr
JOIN cron.job j ON jr.jobid = j.jobid
WHERE j.jobname = 'daily-analytics-aggregation'
ORDER BY jr.start_time DESC
LIMIT 10;

-- ========================================
-- MANUALLY RUN THE AGGREGATION (for testing)
-- ========================================
-- Run for yesterday:
SELECT aggregate_daily_analytics(target_date := (CURRENT_DATE - 1)::DATE);

-- Run for a specific date:
-- SELECT aggregate_daily_analytics(target_date := '2024-01-15'::DATE);

-- Run for today (current data):
-- SELECT aggregate_daily_analytics(target_date := CURRENT_DATE);

-- ========================================
-- CHECK LAST AGGREGATION RESULT
-- ========================================
SELECT
    date,
    page_views,
    unique_visitors,
    total_time,
    bounce_rate,
    created_at,
    updated_at
FROM analytics_data
ORDER BY date DESC
LIMIT 7;

-- ========================================
-- PAUSE THE CRON JOB
-- ========================================
-- UPDATE cron.job SET active = false WHERE jobname = 'daily-analytics-aggregation';

-- ========================================
-- RESUME THE CRON JOB
-- ========================================
-- UPDATE cron.job SET active = true WHERE jobname = 'daily-analytics-aggregation';

-- ========================================
-- DELETE THE CRON JOB
-- ========================================
-- SELECT cron.unschedule('daily-analytics-aggregation');

-- ========================================
-- RESCHEDULE TO DIFFERENT TIME
-- ========================================
-- Example: Change to 3 AM UTC instead of 2 AM
-- SELECT cron.unschedule('daily-analytics-aggregation');
-- SELECT cron.schedule(
--     'daily-analytics-aggregation',
--     '0 3 * * *',  -- 3 AM daily
--     $$
--     SELECT aggregate_daily_analytics(target_date := (CURRENT_DATE - 1)::DATE);
--     $$
-- );

-- ========================================
-- CHECK FOR FAILED JOBS
-- ========================================
SELECT
    jr.start_time,
    jr.status,
    jr.return_message,
    jr.command
FROM cron.job_run_details jr
JOIN cron.job j ON jr.jobid = j.jobid
WHERE j.jobname = 'daily-analytics-aggregation'
AND jr.status != 'succeeded'
ORDER BY jr.start_time DESC
LIMIT 10;
