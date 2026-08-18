-- Fix module_id column type to support non-UUID module IDs

-- 1. Drop foreign key constraint if it exists
ALTER TABLE progress DROP CONSTRAINT IF EXISTS progress_module_id_fkey;

-- 2. Drop the module_id column
ALTER TABLE progress DROP COLUMN IF EXISTS module_id;

-- 3. Re-add module_id as TEXT to support module IDs from JSONB (e.g. "module-1781358792085")
ALTER TABLE progress ADD COLUMN IF NOT EXISTS module_id TEXT;

-- 4. Add index for module-based queries
CREATE INDEX IF NOT EXISTS idx_progress_module ON progress(module_id);
