-- ============================================================
-- Course Performance Indexes Migration
-- Run this in the Supabase SQL Editor BEFORE deploying the
-- updated API code (api/courses/index.ts uses search_vector).
-- ============================================================

-- 1. Covering indexes for common filter + sort combinations
--    All scoped to status = 'published' (partial indexes — smaller, faster)

CREATE INDEX IF NOT EXISTS idx_courses_published_enrollments
  ON courses(enrollments DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_courses_published_category_enrollments
  ON courses(category, enrollments DESC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_courses_published_price_asc
  ON courses(price ASC)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_courses_published_date
  ON courses(published_date DESC)
  WHERE status = 'published';

-- 2. Full-text search: generated tsvector column + GIN index
--    Covers title + description searches without ILIKE table scans.

ALTER TABLE courses
  ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (
    to_tsvector('english',
      coalesce(title, '') || ' ' || coalesce(description, '')
    )
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_courses_search_vector
  ON courses USING gin(search_vector);

-- 3. course_pricing lookup — covers the batch fetch by course_id + country
CREATE INDEX IF NOT EXISTS idx_course_pricing_lookup
  ON course_pricing(course_id, country_code)
  WHERE is_active = true;
