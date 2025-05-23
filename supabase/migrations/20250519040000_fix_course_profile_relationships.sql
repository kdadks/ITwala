-- Ensure proper relationships between courses and profiles

-- 1. Fix the instructor_id foreign key constraint in courses table
ALTER TABLE courses
DROP CONSTRAINT IF EXISTS courses_instructor_id_fkey,
ADD CONSTRAINT courses_instructor_id_fkey 
  FOREIGN KEY (instructor_id) 
  REFERENCES profiles(id) 
  ON DELETE SET NULL;

-- 2. Create index for better performance
CREATE INDEX IF NOT EXISTS idx_courses_instructor_id ON courses(instructor_id);

-- 3. Update course policies to ensure admin access
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

-- 4. Update instructor course policies
DROP POLICY IF EXISTS "Instructors can manage their own courses" ON courses;
CREATE POLICY "Instructors can manage their own courses"
  ON courses FOR ALL
  USING (
    auth.uid() = instructor_id
    OR
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'instructor'
      AND instructor_id = profiles.id
    )
  );
