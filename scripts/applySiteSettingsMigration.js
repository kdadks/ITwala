const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function applySiteSettingsMigration() {
  try {
    console.log('Applying site_settings migration...');

    // Create the site_settings table
    const { error: tableError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create site_settings table if it doesn't exist
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
      `
    });

    if (tableError) {
      console.error('Error creating table:', tableError);
      if (!tableError.message?.includes('already exists')) {
        throw tableError;
      }
    }

    // Enable RLS and set up policies
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Enable Row Level Security
        ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

        -- Create policies
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

        -- Create trigger for updated_at
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
      `
    });

    if (rlsError) {
      console.error('Error setting up RLS and policies:', rlsError);
      throw rlsError;
    }

    console.log('Site settings migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

applySiteSettingsMigration().then(() => process.exit(0));
