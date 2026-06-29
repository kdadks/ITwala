-- Add breadcrumb_label field to portfolio_settings table
-- Run this if you've already created the portfolio_settings table

ALTER TABLE portfolio_settings 
ADD COLUMN IF NOT EXISTS breadcrumb_label TEXT NOT NULL DEFAULT 'Our Work · {count}+ Projects Delivered';

COMMENT ON COLUMN portfolio_settings.breadcrumb_label IS 'Breadcrumb text with {count} placeholder for dynamic project count (e.g., "Our Work · {count}+ Projects Delivered")';
