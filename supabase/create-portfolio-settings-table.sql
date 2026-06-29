-- Portfolio Page Settings Table
-- Stores editable header content for the portfolio page

CREATE TABLE IF NOT EXISTS portfolio_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Page Header
  page_title TEXT NOT NULL DEFAULT 'Our Success Stories',
  page_subtitle TEXT NOT NULL DEFAULT 'Transforming ideas into digital excellence',
  tagline TEXT NOT NULL DEFAULT 'trusted by 50+ businesses worldwide',
  breadcrumb_label TEXT NOT NULL DEFAULT 'Our Work · {count}+ Projects Delivered',
  
  -- Metrics (stored as JSONB array for flexibility)
  metrics JSONB NOT NULL DEFAULT '[
    {"value": "10K+", "label": "Active Users"},
    {"value": "95%", "label": "Client Satisfaction"},
    {"value": "10+", "label": "Projects Delivered"},
    {"value": "7", "label": "Industries Served"}
  ]'::jsonb,
  
  -- Section Header
  featured_section_title TEXT NOT NULL DEFAULT 'Featured Projects',
  featured_section_subtitle TEXT NOT NULL DEFAULT 'Real solutions, real impact. Filter by category to explore our work.',
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create a single row for settings (singleton pattern)
INSERT INTO portfolio_settings (id) VALUES ('00000000-0000-0000-0000-000000000001')
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE portfolio_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read settings
CREATE POLICY "Anyone can view portfolio settings"
  ON portfolio_settings
  FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "Admins can update portfolio settings"
  ON portfolio_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Prevent deletion and insertion (singleton pattern)
CREATE POLICY "No one can delete portfolio settings"
  ON portfolio_settings
  FOR DELETE
  USING (false);

CREATE POLICY "No one can insert new portfolio settings"
  ON portfolio_settings
  FOR INSERT
  WITH CHECK (false);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_portfolio_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  NEW.updated_by = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER portfolio_settings_updated_at
  BEFORE UPDATE ON portfolio_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_portfolio_settings_updated_at();

COMMENT ON TABLE portfolio_settings IS 'Editable settings for the portfolio page header and metrics (singleton)';
