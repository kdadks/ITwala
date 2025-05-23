/*
  Fix database relationships

  1. Drop the incorrect enrollments table created by admin_features_fix
  2. Update any invalid foreign key references
*/

-- First, drop the conflicting enrollments table if it exists
DROP TABLE IF EXISTS enrollments;

-- Recreate the enrollments table with correct foreign key references
CREATE TABLE IF NOT EXISTS enrollments (
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

-- Enable RLS
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

-- Add policies
CREATE POLICY "Users can view their own enrollments" 
  ON enrollments FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can enroll themselves in courses" 
  ON enrollments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" 
  ON enrollments FOR UPDATE 
  USING (auth.uid() = user_id);

-- Update payments table to reference profiles instead of auth.users
ALTER TABLE IF EXISTS payments
  DROP CONSTRAINT IF EXISTS payments_user_id_fkey,
  ALTER COLUMN user_id SET DATA TYPE UUID,
  ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;
