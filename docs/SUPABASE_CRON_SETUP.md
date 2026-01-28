# Supabase Cron Job Setup for Analytics Aggregation

This guide explains how to set up automatic daily analytics aggregation using Supabase's built-in `pg_cron` extension instead of external cron services.

## Why Use Supabase Cron?

### Advantages over External Cron Services:
- **No external dependencies**: Everything runs within Supabase
- **Better security**: No need to expose API endpoints publicly
- **No authentication required**: Runs directly in database
- **Free**: Included with Supabase
- **Reliable**: Managed by Supabase infrastructure
- **Easy monitoring**: View execution logs in SQL Editor
- **No environment variables needed**: No `ANALYTICS_CRON_SECRET` or API keys required

### Disadvantages of External Cron (cron-job.org, etc.):
- Requires public API endpoint
- Needs authentication/security headers
- Requires environment variables in production
- Extra service to manage
- Potential security vulnerabilities
- Can fail due to network issues

## Setup Instructions

### Step 1: Enable pg_cron Extension

1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor**
4. Run the setup script from `supabase/setup-analytics-cron-job.sql`:

```sql
-- Enable the pg_cron extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove any existing analytics aggregation job (to avoid duplicates)
SELECT cron.unschedule('daily-analytics-aggregation');

-- Schedule the analytics aggregation job
-- Runs every day at 2:00 AM UTC
SELECT cron.schedule(
    'daily-analytics-aggregation',           -- Job name
    '0 2 * * *',                            -- Cron schedule: 2 AM daily
    $$
    SELECT aggregate_daily_analytics((CURRENT_DATE - INTERVAL '1 day')::DATE);
    $$
);
```

5. Click **Run** to execute the script

### Step 2: Verify the Job Was Created

Run this query to confirm:

```sql
SELECT * FROM cron.job WHERE jobname = 'daily-analytics-aggregation';
```

You should see output like:
```
jobid | schedule    | command                                           | nodename  | nodeport | database | username | active
------+-------------+---------------------------------------------------+-----------+----------+----------+----------+--------
1     | 0 2 * * *   | SELECT aggregate_daily_analytics(CURRENT_DATE...) | localhost | 5432     | postgres | postgres | true
```

### Step 3: Test the Job Manually

Before waiting for the scheduled run, test it manually:

```sql
-- Run aggregation for yesterday
SELECT aggregate_daily_analytics((CURRENT_DATE - INTERVAL '1 day')::DATE);
```

Check if data was aggregated:

```sql
SELECT
    date,
    page_views,
    unique_visitors,
    total_time,
    bounce_rate
FROM analytics_data
ORDER BY date DESC
LIMIT 7;
```

### Step 4: Disable External Cron Job

Since you're now using Supabase cron, you can:

1. **Disable cron-job.org**: Go to https://console.cron-job.org/jobs/7111721 and disable/delete the job
2. **Remove API endpoint** (optional): You can keep `src/pages/api/analytics/aggregate.ts` for manual testing, or delete it
3. **Remove Netlify scheduled function** (optional): Remove or disable `netlify/functions/scheduled-analytics-aggregation.js`

## Management & Monitoring

### View Recent Job Execution History

```sql
SELECT
    jr.runid,
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
```

### Check for Failed Jobs

```sql
SELECT
    jr.start_time,
    jr.status,
    jr.return_message
FROM cron.job_run_details jr
JOIN cron.job j ON jr.jobid = j.jobid
WHERE j.jobname = 'daily-analytics-aggregation'
AND jr.status != 'succeeded'
ORDER BY jr.start_time DESC;
```

### Pause the Cron Job

```sql
UPDATE cron.job SET active = false WHERE jobname = 'daily-analytics-aggregation';
```

### Resume the Cron Job

```sql
UPDATE cron.job SET active = true WHERE jobname = 'daily-analytics-aggregation';
```

### Change Schedule Time

Example: Change from 2 AM to 3 AM UTC:

```sql
SELECT cron.unschedule('daily-analytics-aggregation');
SELECT cron.schedule(
    'daily-analytics-aggregation',
    '0 3 * * *',  -- 3 AM daily
    $$
    SELECT aggregate_daily_analytics((CURRENT_DATE - INTERVAL '1 day')::DATE);
    $$
);
```

### Delete the Cron Job

```sql
SELECT cron.unschedule('daily-analytics-aggregation');
```

## Cron Schedule Format

The schedule uses standard cron syntax: `minute hour day month weekday`

Examples:
- `0 2 * * *` - Every day at 2:00 AM UTC
- `0 3 * * *` - Every day at 3:00 AM UTC
- `0 */6 * * *` - Every 6 hours
- `0 0 * * 0` - Every Sunday at midnight
- `30 1 * * 1-5` - Every weekday at 1:30 AM

## Troubleshooting

### Job Not Running

1. Check if job is active:
   ```sql
   SELECT * FROM cron.job WHERE jobname = 'daily-analytics-aggregation';
   ```

2. Check execution logs:
   ```sql
   SELECT * FROM cron.job_run_details
   WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname = 'daily-analytics-aggregation')
   ORDER BY start_time DESC LIMIT 5;
   ```

3. Verify the function exists:
   ```sql
   SELECT routine_name FROM information_schema.routines
   WHERE routine_name = 'aggregate_daily_analytics';
   ```

### Job Fails With Error

Check the error message in job run details:

```sql
SELECT
    start_time,
    status,
    return_message,
    command
FROM cron.job_run_details
WHERE jobid IN (SELECT jobid FROM cron.job WHERE jobname = 'daily-analytics-aggregation')
AND status = 'failed'
ORDER BY start_time DESC;
```

### Manual Test

Always test manually first:

```sql
-- Test for yesterday
SELECT aggregate_daily_analytics((CURRENT_DATE - INTERVAL '1 day')::DATE);

-- Test for specific date
SELECT aggregate_daily_analytics('2024-01-15'::DATE);
```

## Next Steps

1. ✅ Set up Supabase cron job (follow Step 1-3 above)
2. ✅ Test manually
3. ✅ Monitor first scheduled run (check at 2:01 AM UTC)
4. ✅ Disable external cron service (cron-job.org)
5. ✅ Remove/disable API endpoint (optional)
6. ✅ Set up monitoring alerts (optional)

## Files Reference

- **Setup Script**: `supabase/setup-analytics-cron-job.sql`
- **Management Scripts**: `supabase/manage-analytics-cron.sql`
- **Analytics Function**: Defined in `supabase/create-analytics-table.sql`
- **This Guide**: `docs/SUPABASE_CRON_SETUP.md`

## Resources

- [Supabase pg_cron Documentation](https://supabase.com/docs/guides/database/extensions/pg_cron)
- [PostgreSQL Cron Syntax](https://crontab.guru/)
- [pg_cron GitHub](https://github.com/citusdata/pg_cron)
