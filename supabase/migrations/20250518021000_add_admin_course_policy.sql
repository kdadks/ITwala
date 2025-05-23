-- Add policy for admin course management
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;

CREATE POLICY "Admins can manage all courses"
  ON courses FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );
