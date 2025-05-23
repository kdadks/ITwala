-- Execute this in the Supabase SQL editor
BEGIN;

-- Update course-profile relationships
DO $$ 
BEGIN
  ALTER TABLE courses
  DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey;

  ALTER TABLE courses
  ADD CONSTRAINT courses_instructor_id_fkey 
    FOREIGN KEY (instructor_id) 
    REFERENCES profiles(id) 
    ON DELETE SET NULL;

  CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);
EXCEPTION 
  WHEN others THEN 
    RAISE NOTICE 'Error in step 1: %', SQLERRM;
END $$;

-- Drop and recreate enrollments table
DO $$ 
BEGIN
  DROP TABLE IF EXISTS enrollments CASCADE;

  CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMPTZ DEFAULT now(),
    status TEXT DEFAULT 'active',
    progress INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, course_id)
  );
EXCEPTION 
  WHEN others THEN 
    RAISE NOTICE 'Error in step 2: %', SQLERRM;
END $$;

-- Enable Row Level Security
DO $$
BEGIN
  ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
EXCEPTION 
  WHEN others THEN 
    RAISE NOTICE 'Error in step 3: %', SQLERRM;
END $$;

-- Create policies (dropping existing ones first)
DO $$
BEGIN
  -- Drop existing policies
  DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
  DROP POLICY IF EXISTS "Course creation policy" ON courses;
  DROP POLICY IF EXISTS "Course update policy" ON courses;
  DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
  DROP POLICY IF EXISTS "Instructors can manage their own courses" ON courses;
  
  DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
  DROP POLICY IF EXISTS "Users can insert their own enrollments" ON enrollments;
  DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
  DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
  DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

  -- Create course policies
  CREATE POLICY "Courses are viewable by everyone" 
    ON courses FOR SELECT 
    USING (
      CASE
        WHEN status = 'published' THEN true
        WHEN auth.uid() IS NOT NULL THEN EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND (profiles.role = 'admin' OR profiles.id = courses.instructor_id)
        )
        ELSE false
      END
    );

  CREATE POLICY "Admins can manage all courses"
    ON courses FOR ALL
    USING (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ));

  CREATE POLICY "Instructors can manage their own courses"
    ON courses FOR ALL
    USING (
      auth.uid() = instructor_id
      OR EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'instructor'
        AND instructor_id = profiles.id
      )
    );

  -- Create enrollment policies
  CREATE POLICY "Users can view their own enrollments" 
    ON enrollments FOR SELECT 
    USING (auth.uid() = user_id);

  CREATE POLICY "Users can insert their own enrollments" 
    ON enrollments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

  CREATE POLICY "Users can update their own enrollments" 
    ON enrollments FOR UPDATE 
    USING (auth.uid() = user_id);

  CREATE POLICY "Admins can view all enrollments" 
    ON enrollments FOR SELECT
    USING (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ));

  CREATE POLICY "Admins can manage all enrollments" 
    ON enrollments FOR ALL
    USING (EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    ));
EXCEPTION 
  WHEN others THEN 
    RAISE NOTICE 'Error in step 4: %', SQLERRM;
END $$;

COMMIT;
