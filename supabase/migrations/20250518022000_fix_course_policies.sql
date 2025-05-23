-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Instructors can insert courses" ON courses;
DROP POLICY IF EXISTS "Instructors can update their own courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;

-- Recreate policies in correct order
CREATE POLICY "Courses are viewable by everyone" 
  ON courses FOR SELECT 
  USING (true);

CREATE POLICY "Instructors can insert courses" 
  ON courses FOR INSERT 
  WITH CHECK (
    auth.uid() = instructor_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Instructors and admins can update courses" 
  ON courses FOR UPDATE 
  USING (
    auth.uid() = instructor_id
    OR EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can delete courses"
  ON courses FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
