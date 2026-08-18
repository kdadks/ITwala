-- Add module-level progress tracking to progress table

-- 1. Add module_id column for module-level progress entries
ALTER TABLE progress 
ADD COLUMN IF NOT EXISTS module_id UUID;

-- 2. Make lesson_id nullable to support module-level entries without lessons
ALTER TABLE progress 
ALTER COLUMN lesson_id DROP NOT NULL;

-- 3. Drop existing module_id foreign key constraint if it exists
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_module_id_fkey;

-- 4. Add foreign key constraint for module_id
ALTER TABLE progress 
ADD CONSTRAINT progress_module_id_fkey 
  FOREIGN KEY (module_id) 
  REFERENCES modules(id) 
  ON DELETE CASCADE;

-- 4. Drop existing unique constraint on (user_id, lesson_id)
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_user_id_lesson_id_key;

-- 5. Drop old partial indexes if they exist (from previous migration attempt)
DROP INDEX IF EXISTS idx_progress_user_lesson;
DROP INDEX IF EXISTS idx_progress_user_module;

-- 6. Create regular unique index on (user_id, lesson_id)
--    PostgreSQL unique indexes allow multiple NULLs, so module-level entries
--    (where lesson_id IS NULL) won't conflict with each other or with lesson entries
CREATE UNIQUE INDEX IF NOT EXISTS idx_progress_user_lesson 
  ON progress(user_id, lesson_id);

-- 7. Add index for module-based queries
CREATE INDEX IF NOT EXISTS idx_progress_module ON progress(module_id);
