-- Drop existing columns we're replacing
ALTER TABLE profiles
DROP COLUMN IF EXISTS address;

-- Add new address fields
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'India',
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS degree_name TEXT;
