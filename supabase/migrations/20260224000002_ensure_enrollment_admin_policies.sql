-- Ensure admin RLS policies exist for enrollments table

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can insert their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;

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

-- Refresh schema cache so PostgREST recognizes all columns
NOTIFY pgrst, 'reload schema';
