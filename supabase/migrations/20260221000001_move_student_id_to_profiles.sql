-- Move student_id from enrollments to profiles (1:1 with student, not per enrollment)
-- Student ID format: {CountryISO}-{StateISO}-{YYYY}-{MM}-{NNNN}
-- Example: IN-MH-2026-02-0001

-- Add student_id column to profiles table (1:1 relationship with student)
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_student_id ON profiles(student_id);

-- Update the sequence table comment
COMMENT ON TABLE student_id_sequences IS 'Tracks student ID sequence numbers by region and date prefix';

-- Update the generate_student_id function to work with profiles
CREATE OR REPLACE FUNCTION generate_student_id(
  country_code TEXT,
  state_code TEXT
) RETURNS TEXT AS $$
DECLARE
  current_prefix TEXT;
  next_number INTEGER;
  new_student_id TEXT;
BEGIN
  -- Generate prefix: COUNTRY-STATE-YEAR-MONTH
  current_prefix := country_code || '-' || state_code || '-' || 
                    EXTRACT(YEAR FROM CURRENT_DATE)::TEXT || '-' || 
                    LPAD(EXTRACT(MONTH FROM CURRENT_DATE)::TEXT, 2, '0');
  
  -- Lock the row for update to prevent race conditions
  INSERT INTO student_id_sequences (prefix, last_number)
  VALUES (current_prefix, 0)
  ON CONFLICT (prefix) DO NOTHING;
  
  -- Get and increment the sequence number
  UPDATE student_id_sequences
  SET last_number = last_number + 1,
      updated_at = now()
  WHERE prefix = current_prefix
  RETURNING last_number INTO next_number;
  
  -- Generate the full student ID with 4-digit padded number
  new_student_id := current_prefix || '-' || LPAD(next_number::TEXT, 4, '0');
  
  RETURN new_student_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION generate_student_id(TEXT, TEXT) TO authenticated;

-- Comment on the function
COMMENT ON FUNCTION generate_student_id IS 'Generates a unique student ID in format: COUNTRY-STATE-YYYY-MM-NNNN for profiles table';

-- Optional: Remove student_id from enrollments table if it exists
-- (Keeping it commented out in case you want to keep historical data)
-- ALTER TABLE enrollments DROP COLUMN IF EXISTS student_id;
