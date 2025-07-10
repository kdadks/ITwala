-- Add country column to page_views table if it doesn't exist
ALTER TABLE page_views 
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'Unknown';

-- Add countries column to analytics_data table for aggregated country data
ALTER TABLE analytics_data
ADD COLUMN IF NOT EXISTS countries JSONB DEFAULT '[]';

-- Update the aggregate_daily_analytics function to include country data
CREATE OR REPLACE FUNCTION aggregate_daily_analytics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
DECLARE
    daily_page_views INTEGER;
    daily_unique_visitors INTEGER;
    daily_avg_time INTEGER;
    daily_bounce_rate DECIMAL(5,2);
    top_pages_data JSONB;
    referrers_data JSONB;
    devices_data JSONB;
    countries_data JSONB;
BEGIN
    -- Calculate daily page views
    SELECT COUNT(*) INTO daily_page_views
    FROM page_views 
    WHERE DATE(created_at) = target_date;
    
    -- Calculate unique visitors (unique sessions)
    SELECT COUNT(DISTINCT session_id) INTO daily_unique_visitors
    FROM page_views 
    WHERE DATE(created_at) = target_date;
    
    -- Calculate average time on site (in minutes)
    SELECT COALESCE(AVG(duration_seconds) / 60, 0)::INTEGER INTO daily_avg_time
    FROM page_views 
    WHERE DATE(created_at) = target_date 
    AND duration_seconds > 0;
    
    -- Calculate bounce rate
    SELECT COALESCE(
        (COUNT(*) FILTER (WHERE is_bounce = true)::DECIMAL / NULLIF(COUNT(*), 0)) * 100, 
        0
    )::DECIMAL(5,2) INTO daily_bounce_rate
    FROM user_sessions 
    WHERE DATE(created_at) = target_date;
    
    -- Get top pages
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'page', page_url,
                'views', page_count
            ) ORDER BY page_count DESC
        ), '[]'::jsonb
    ) INTO top_pages_data
    FROM (
        SELECT page_url, COUNT(*) as page_count
        FROM page_views 
        WHERE DATE(created_at) = target_date
        GROUP BY page_url
        ORDER BY page_count DESC
        LIMIT 10
    ) top_pages;
    
    -- Get top referrers
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'referrer', COALESCE(referrer, 'Direct'),
                'visits', referrer_count
            ) ORDER BY referrer_count DESC
        ), '[]'::jsonb
    ) INTO referrers_data
    FROM (
        SELECT COALESCE(referrer, 'Direct') as referrer, COUNT(*) as referrer_count
        FROM page_views 
        WHERE DATE(created_at) = target_date
        GROUP BY referrer
        ORDER BY referrer_count DESC
        LIMIT 10
    ) top_referrers;
    
    -- Get device breakdown
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'device', COALESCE(device_type, 'Unknown'),
                'count', device_count
            )
        ), '[]'::jsonb
    ) INTO devices_data
    FROM (
        SELECT COALESCE(device_type, 'Unknown') as device_type, COUNT(*) as device_count
        FROM page_views 
        WHERE DATE(created_at) = target_date
        GROUP BY device_type
    ) device_breakdown;
    
    -- Get countries breakdown
    SELECT COALESCE(
        jsonb_agg(
            jsonb_build_object(
                'country', COALESCE(country, 'Unknown'),
                'visits', country_count
            ) ORDER BY country_count DESC
        ), '[]'::jsonb
    ) INTO countries_data
    FROM (
        SELECT COALESCE(country, 'Unknown') as country, COUNT(*) as country_count
        FROM page_views 
        WHERE DATE(created_at) = target_date
        GROUP BY country
        ORDER BY country_count DESC
        LIMIT 10
    ) country_breakdown;
    
    -- Insert or update analytics data
    INSERT INTO analytics_data (
        date, page_views, unique_visitors, total_time, bounce_rate,
        top_pages, referrers, devices, countries, updated_at
    ) VALUES (
        target_date, daily_page_views, daily_unique_visitors, 
        daily_avg_time, daily_bounce_rate,
        top_pages_data, referrers_data, devices_data, countries_data, NOW()
    )
    ON CONFLICT (date) 
    DO UPDATE SET
        page_views = EXCLUDED.page_views,
        unique_visitors = EXCLUDED.unique_visitors,
        total_time = EXCLUDED.total_time,
        bounce_rate = EXCLUDED.bounce_rate,
        top_pages = EXCLUDED.top_pages,
        referrers = EXCLUDED.referrers,
        devices = EXCLUDED.devices,
        countries = EXCLUDED.countries,
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Run aggregation for today to test
SELECT aggregate_daily_analytics(CURRENT_DATE);
SELECT aggregate_daily_analytics(CURRENT_DATE - INTERVAL '1 day');

SELECT 'Country tracking added to analytics system!' as result;