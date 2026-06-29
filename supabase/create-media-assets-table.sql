-- Media Library: central asset management table
CREATE TABLE IF NOT EXISTS media_assets (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  storage_path  TEXT NOT NULL UNIQUE,
  public_url    TEXT NOT NULL,
  type          TEXT NOT NULL CHECK (type IN ('image', 'video', 'document')),
  original_name TEXT NOT NULL,
  alt_text      TEXT NOT NULL DEFAULT '',
  description   TEXT NOT NULL DEFAULT '',
  mime_type     TEXT NOT NULL,
  file_size     BIGINT NOT NULL,
  uploaded_by   UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_media_assets_type    ON media_assets(type);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON media_assets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_assets_name    ON media_assets(original_name);

ALTER TABLE media_assets ENABLE ROW LEVEL SECURITY;

-- Admins have full access
CREATE POLICY "Admins can manage media" ON media_assets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Public read for frontend display
CREATE POLICY "Anyone can view media" ON media_assets
  FOR SELECT USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_media_assets_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS media_assets_updated_at ON media_assets;
CREATE TRIGGER media_assets_updated_at
  BEFORE UPDATE ON media_assets
  FOR EACH ROW EXECUTE FUNCTION update_media_assets_updated_at();

-- Create the 'media' storage bucket (run in SQL editor or via Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('media', 'media', true)
-- ON CONFLICT (id) DO NOTHING;
