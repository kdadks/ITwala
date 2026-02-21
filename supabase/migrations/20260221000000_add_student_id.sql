-- Add student_id column to enrollments table
-- Student ID format: {CountryISO}-{StateISO}-{YYYY}-{MM}-{NNNN}
-- Example: IN-MH-2026-02-0001

-- Add student_id column to enrollments table
ALTER TABLE enrollments 
ADD COLUMN IF NOT EXISTS student_id TEXT UNIQUE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_enrollments_student_id ON enrollments(student_id);

-- Create a sequence table to track student ID numbers by country-state-year-month
CREATE TABLE IF NOT EXISTS student_id_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prefix TEXT NOT NULL UNIQUE,  -- e.g., "IN-MH-2026-02"
  last_number INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on sequence table
ALTER TABLE student_id_sequences ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Admin can manage student_id_sequences"
  ON student_id_sequences
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Create function to generate the next student ID
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
COMMENT ON FUNCTION generate_student_id IS 'Generates a unique student ID in format: COUNTRY-STATE-YYYY-MM-NNNN';
