-- Add category_id column to courses if it doesn't exist
ALTER TABLE courses 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id) ON DELETE SET NULL;

-- Recreate constraint to ensure it's properly defined
ALTER TABLE courses
DROP CONSTRAINT IF EXISTS courses_category_id_fkey,
ADD CONSTRAINT courses_category_id_fkey 
  FOREIGN KEY (category_id) 
  REFERENCES categories(id) 
  ON DELETE SET NULL;
