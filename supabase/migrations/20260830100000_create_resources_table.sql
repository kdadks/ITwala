-- Migration: Create resources database table for Blog & Resources Hub

CREATE TABLE IF NOT EXISTS public.resources (
  id               uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  slug             text         NOT NULL UNIQUE,
  title            text         NOT NULL,
  description      text         NOT NULL,
  quick_answer     text         DEFAULT '',
  primary_goal     text         DEFAULT '',
  category         text         NOT NULL DEFAULT 'AI & Business Strategy',
  read_time        text         NOT NULL DEFAULT '5 min read',
  difficulty       text         NOT NULL DEFAULT 'Beginner',
  status           text         NOT NULL DEFAULT 'published',
  featured_image   text         DEFAULT '',
  keywords         text[]       DEFAULT '{}',
  schema_type      text         DEFAULT 'TechArticle',
  author           jsonb        NOT NULL DEFAULT '{"name": "ITWala Team", "role": "AI Specialist", "avatar": "/images/IT - WALA_logo (1).png"}',
  cta              jsonb        NOT NULL DEFAULT '{"title": "Get Started", "text": "Transform with ITWala.", "linkText": "Contact Us", "linkUrl": "/contact", "variant": "consulting"}',
  key_takeaways    text[]       DEFAULT '{}',
  faqs             jsonb        DEFAULT '[]',
  sections         jsonb        DEFAULT '[]',
  publish_date     date         DEFAULT CURRENT_DATE,
  updated_date     date         DEFAULT CURRENT_DATE,
  created_at       timestamptz  NOT NULL DEFAULT now(),
  updated_at       timestamptz  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_resources_slug ON public.resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_category ON public.resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_status ON public.resources(status);

ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read access to published resources" ON public.resources;
CREATE POLICY "Public read access to published resources"
  ON public.resources FOR SELECT
  USING (status = 'published');

DROP POLICY IF EXISTS "Admin full access to resources" ON public.resources;
CREATE POLICY "Admin full access to resources"
  ON public.resources FOR ALL
  USING (true)
  WITH CHECK (true);
