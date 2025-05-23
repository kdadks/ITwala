-- Drop any existing aggregated_enrollments view
DROP VIEW IF EXISTS aggregated_enrollments;

-- Create view for aggregated course enrollments
CREATE OR REPLACE VIEW aggregated_enrollments AS 
SELECT 
  course_id,
  COUNT(DISTINCT user_id) as enrollment_count
FROM enrollments
GROUP BY course_id;

-- Ensure the enrollments table has the correct structure and constraints
ALTER TABLE enrollments
ADD COLUMN IF NOT EXISTS progress INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active',
ADD COLUMN IF NOT EXISTS enrolled_at TIMESTAMPTZ DEFAULT now(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Add or modify the foreign key constraint for course_id
ALTER TABLE enrollments 
DROP CONSTRAINT IF EXISTS enrollments_course_id_fkey,
ADD CONSTRAINT enrollments_course_id_fkey 
  FOREIGN KEY (course_id) 
  REFERENCES courses(id) 
  ON DELETE CASCADE;

-- Add or modify the foreign key constraint for user_id
ALTER TABLE enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey,
ADD CONSTRAINT enrollments_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate enrollments
ALTER TABLE enrollments 
DROP CONSTRAINT IF EXISTS enrollments_user_course_unique,
ADD CONSTRAINT enrollments_user_course_unique 
  UNIQUE(user_id, course_id);

-- Enable RLS if not already enabled
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can insert their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

-- Recreate policies with proper permissions
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
