-- Ensure proper relationship between courses and categories
ALTER TABLE courses
DROP CONSTRAINT IF EXISTS courses_category_id_fkey,
ADD CONSTRAINT courses_category_id_fkey 
  FOREIGN KEY (category_id) 
  REFERENCES categories(id) 
  ON DELETE SET NULL;

-- Create indices to improve query performance
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_id ON categories(id);
