-- Webinars: Special Events feature
-- Run this in the Supabase SQL editor

-- Main webinars table
CREATE TABLE IF NOT EXISTS webinars (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title               text        NOT NULL,
  slug                text        NOT NULL UNIQUE,
  description         text        NOT NULL,
  topics              text[]      NOT NULL DEFAULT '{}',
  learning_outcomes   text[]      NOT NULL DEFAULT '{}',
  date_time           timestamptz NOT NULL,
  duration_minutes    integer     NOT NULL DEFAULT 60,
  status              text        NOT NULL DEFAULT 'draft'
                        CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  speaker_name        text        NOT NULL,
  speaker_title       text,
  speaker_bio         text,
  speaker_image       text,
  media_url           text,
  media_type          text        CHECK (media_type IN ('youtube', 'link')),
  banner_image        text,
  registration_limit  integer,    -- NULL = unlimited
  custom_fields       jsonb       NOT NULL DEFAULT '[]',
  -- e.g. [{"label":"Company size","type":"select","required":true,"options":["1-10","11-50","50+"]}]
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

-- Registrations table
CREATE TABLE IF NOT EXISTS webinar_registrations (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  webinar_id          uuid        NOT NULL REFERENCES webinars(id) ON DELETE CASCADE,
  first_name          text        NOT NULL,
  last_name           text        NOT NULL,
  email               text        NOT NULL,
  phone               text,
  organization        text,
  job_title           text,
  custom_answers      jsonb       NOT NULL DEFAULT '{}',
  confirmation_sent   boolean     NOT NULL DEFAULT false,
  registered_at       timestamptz NOT NULL DEFAULT now(),
  UNIQUE (webinar_id, email)
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS webinars_updated_at ON webinars;
CREATE TRIGGER webinars_updated_at
  BEFORE UPDATE ON webinars
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE webinars ENABLE ROW LEVEL SECURITY;
ALTER TABLE webinar_registrations ENABLE ROW LEVEL SECURITY;

-- Public can read published webinars
DROP POLICY IF EXISTS "Public read published webinars" ON webinars;
CREATE POLICY "Public read published webinars"
  ON webinars FOR SELECT
  USING (status = 'published');

-- Anyone can insert a registration (anon key)
DROP POLICY IF EXISTS "Anyone can register" ON webinar_registrations;
CREATE POLICY "Anyone can register"
  ON webinar_registrations FOR INSERT
  WITH CHECK (true);

-- Service role key bypasses RLS for all admin operations

-- Useful index
CREATE INDEX IF NOT EXISTS webinars_status_date ON webinars (status, date_time);
CREATE INDEX IF NOT EXISTS webinar_registrations_webinar_id ON webinar_registrations (webinar_id);
CREATE INDEX IF NOT EXISTS webinar_registrations_email ON webinar_registrations (email);

-- Add location columns (run this if the table already exists without them)
ALTER TABLE webinar_registrations ADD COLUMN IF NOT EXISTS country text;
ALTER TABLE webinar_registrations ADD COLUMN IF NOT EXISTS state   text;
