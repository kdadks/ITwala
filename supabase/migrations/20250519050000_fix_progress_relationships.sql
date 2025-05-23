-- Fix relationships between progress and profiles/lessons

-- 1. Fix foreign key constraints
ALTER TABLE progress
DROP CONSTRAINT IF EXISTS progress_user_id_fkey,
ADD CONSTRAINT progress_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES profiles(id) 
  ON DELETE CASCADE;

ALTER TABLE progress
DROP CONSTRAINT IF EXISTS progress_lesson_id_fkey,
ADD CONSTRAINT progress_lesson_id_fkey 
  FOREIGN KEY (lesson_id) 
  REFERENCES lessons(id) 
  ON DELETE CASCADE;

-- 2. Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id ON progress(lesson_id);

-- 3. Update progress policies to ensure admin access
DROP POLICY IF EXISTS "Admins can view all progress" ON progress;
CREATE POLICY "Admins can view all progress"
  ON progress FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));

DROP POLICY IF EXISTS "Admins can manage all progress" ON progress;
CREATE POLICY "Admins can manage all progress"
  ON progress FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  ));
