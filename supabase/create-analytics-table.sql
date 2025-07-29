-- Create analytics_data table for website analytics
CREATE TABLE IF NOT EXISTS analytics_data (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    date DATE NOT NULL,
    page_views INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    total_time INTEGER DEFAULT 0, -- in minutes
    bounce_rate DECIMAL(5,2) DEFAULT 0.00, -- percentage
    top_pages JSONB DEFAULT '[]',
    referrers JSONB DEFAULT '[]',
    devices JSONB DEFAULT '[]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Create page_views table for detailed tracking
CREATE TABLE IF NOT EXISTS page_views (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    page_url VARCHAR(500) NOT NULL,
    page_title VARCHAR(255),
    referrer VARCHAR(500),
    user_agent TEXT,
    ip_address VARCHAR(45),
    country VARCHAR(100),
    device_type VARCHAR(50), -- mobile, desktop, tablet
    browser VARCHAR(100),
    duration_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_sessions table for tracking unique visitors
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id VARCHAR(255) UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    first_page VARCHAR(500),
    last_page VARCHAR(500),
    total_pages INTEGER DEFAULT 1,
    total_duration_seconds INTEGER DEFAULT 0,
    is_bounce BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_analytics_data_date ON analytics_data(date);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_page_url ON page_views(page_url);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);

-- Enable Row Level Security
ALTER TABLE analytics_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analytics_data (admin only)
CREATE POLICY "Admin can view analytics_data" ON analytics_data FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Admin can manage analytics_data" ON analytics_data FOR ALL TO authenticated USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

-- Create RLS policies for page_views (admin only for reading)
CREATE POLICY "Admin can view page_views" ON page_views FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Anyone can insert page_views" ON page_views FOR INSERT WITH CHECK (true);

-- Create RLS policies for user_sessions (admin only for reading)
CREATE POLICY "Admin can view user_sessions" ON user_sessions FOR SELECT TO authenticated USING (
    EXISTS (
        SELECT 1 FROM profiles 
        WHERE profiles.id = auth.uid() 
        AND profiles.role = 'admin'
    )
);

CREATE POLICY "Anyone can insert user_sessions" ON user_sessions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update user_sessions" ON user_sessions FOR UPDATE USING (true);

-- Create function to aggregate daily analytics
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
    
    -- Insert or update analytics data
    INSERT INTO analytics_data (
        date, page_views, unique_visitors, total_time, bounce_rate,
        top_pages, referrers, devices, updated_at
    ) VALUES (
        target_date, daily_page_views, daily_unique_visitors, 
        daily_avg_time, daily_bounce_rate,
        top_pages_data, referrers_data, devices_data, NOW()
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
        updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_analytics_data_updated_at BEFORE UPDATE ON analytics_data 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for the last 30 days
DO $$
DECLARE
    i INTEGER;
    sample_date DATE;
BEGIN
    FOR i IN 0..29 LOOP
        sample_date := CURRENT_DATE - i;
        
        INSERT INTO analytics_data (
            date, page_views, unique_visitors, total_time, bounce_rate,
            top_pages, referrers, devices
        ) VALUES (
            sample_date,
            500 + (RANDOM() * 500)::INTEGER,
            200 + (RANDOM() * 300)::INTEGER,
            60 + (RANDOM() * 60)::INTEGER,
            20 + (RANDOM() * 30)::DECIMAL(5,2),
            '[{"page":"/courses","views":150},{"page":"/about","views":100},{"page":"/contact","views":75}]'::jsonb,
            '[{"referrer":"google.com","visits":200},{"referrer":"Direct","visits":150},{"referrer":"facebook.com","visits":50}]'::jsonb,
            '[{"device":"desktop","count":300},{"device":"mobile","count":180},{"device":"tablet","count":20}]'::jsonb
        )
        ON CONFLICT (date) DO NOTHING;
    END LOOP;
END $$;

SELECT 'Analytics tables created successfully! Added: analytics_data, page_views, user_sessions' as result;