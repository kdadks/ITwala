-- Create an enum for tracking update operations
CREATE TYPE update_operation AS ENUM ('INSERT', 'UPDATE');

-- Create site_settings table
CREATE TABLE IF NOT EXISTS public.site_settings (
    id uuid DEFAULT extensions.uuid_generate_v4() PRIMARY KEY,
    site_name text NOT NULL DEFAULT 'ITwala Academy',
    contact_email text NOT NULL DEFAULT 'sales@it-wala.com',
    support_phone text NOT NULL DEFAULT '+91 7982303199',
    maintenance_mode boolean NOT NULL DEFAULT false,
    enrollments_enabled boolean NOT NULL DEFAULT true,
    created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for site_settings table
DO $$
BEGIN
    -- Drop existing policies if they exist
    DROP POLICY IF EXISTS "Public read access to site_settings" ON public.site_settings;
    DROP POLICY IF EXISTS "Admin users can manage site_settings" ON public.site_settings;

    -- Create new policies
    CREATE POLICY "Public read access to site_settings"
        ON public.site_settings
        FOR SELECT
        USING (true);

    CREATE POLICY "Admin users can manage site_settings"
        ON public.site_settings
        FOR ALL
        USING (
            auth.uid() IN (
                SELECT id FROM public.profiles
                WHERE role = 'admin'
            )
        );
END $$;

-- Create trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_site_settings_updated_at
    BEFORE UPDATE ON public.site_settings
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Insert default settings if none exist
INSERT INTO public.site_settings (site_name, contact_email, support_phone, maintenance_mode, enrollments_enabled)
SELECT 'ITwala Academy', 'sales@it-wala.com', '+91 7982303199', false, true
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Grant appropriate permissions
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
