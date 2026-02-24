-- Add multi-currency pricing and attendance management
-- Migration: 20260223000000_add_pricing_and_attendance.sql

-- ============================================
-- MULTI-CURRENCY PRICING
-- ============================================

-- Create course_pricing table for country/currency-specific pricing
CREATE TABLE IF NOT EXISTS course_pricing (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  country_code TEXT NOT NULL, -- ISO country code (US, GB, IN, etc.)
  currency TEXT NOT NULL, -- Currency code (USD, GBP, EUR, INR)
  price INTEGER NOT NULL, -- Price in smallest unit (cents, pence, etc.)
  original_price INTEGER, -- Original price for discounts
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(course_id, country_code)
);

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_course_pricing_course_country ON course_pricing(course_id, country_code);
CREATE INDEX IF NOT EXISTS idx_course_pricing_active ON course_pricing(is_active);

-- ============================================
-- ATTENDANCE MANAGEMENT
-- ============================================

-- Create attendance table
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  class_date DATE NOT NULL,
  class_number INTEGER NOT NULL, -- Which class/session number
  status TEXT NOT NULL DEFAULT 'absent', -- 'present', 'absent', 'late', 'excused'
  notes TEXT, -- Optional notes from admin
  marked_by UUID REFERENCES profiles(id), -- Admin who marked attendance
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, course_id, class_date, class_number)
);

-- Add indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_attendance_student ON attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_attendance_course ON attendance(course_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(class_date);
CREATE INDEX IF NOT EXISTS idx_attendance_student_course ON attendance(student_id, course_id);

-- ============================================
-- PROGRESS TRACKING IMPROVEMENTS
-- ============================================

-- Add class_number to progress table to track progress by class
ALTER TABLE progress
ADD COLUMN IF NOT EXISTS class_number INTEGER;

-- Add index for class-based progress tracking
CREATE INDEX IF NOT EXISTS idx_progress_class ON progress(course_id, class_number);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on new tables
ALTER TABLE course_pricing ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Course Pricing Policies
-- Anyone can view active pricing
CREATE POLICY "Anyone can view active course pricing"
  ON course_pricing FOR SELECT
  USING (is_active = true);

-- Only admins can insert/update/delete pricing
CREATE POLICY "Admins can manage course pricing"
  ON course_pricing FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Attendance Policies
-- Students can view their own attendance
CREATE POLICY "Students can view own attendance"
  ON attendance FOR SELECT
  USING (student_id = auth.uid());

-- Admins can view all attendance
CREATE POLICY "Admins can view all attendance"
  ON attendance FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Admins can insert/update/delete attendance
CREATE POLICY "Admins can manage attendance"
  ON attendance FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get attendance percentage for a student in a course
CREATE OR REPLACE FUNCTION get_attendance_percentage(
  p_student_id UUID,
  p_course_id UUID
) RETURNS NUMERIC AS $$
DECLARE
  total_classes INTEGER;
  present_classes INTEGER;
BEGIN
  -- Count total classes
  SELECT COUNT(*) INTO total_classes
  FROM attendance
  WHERE student_id = p_student_id
    AND course_id = p_course_id;

  -- Return 0 if no classes
  IF total_classes = 0 THEN
    RETURN 0;
  END IF;

  -- Count present classes (including late as present)
  SELECT COUNT(*) INTO present_classes
  FROM attendance
  WHERE student_id = p_student_id
    AND course_id = p_course_id
    AND status IN ('present', 'late');

  -- Calculate percentage
  RETURN ROUND((present_classes::NUMERIC / total_classes::NUMERIC) * 100, 2);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION get_attendance_percentage(UUID, UUID) TO authenticated;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE course_pricing IS 'Stores course pricing for different countries and currencies';
COMMENT ON TABLE attendance IS 'Tracks student attendance for each class session';
COMMENT ON COLUMN attendance.status IS 'Attendance status: present, absent, late, or excused';
COMMENT ON COLUMN attendance.class_number IS 'Sequential class number for the course';
COMMENT ON FUNCTION get_attendance_percentage IS 'Calculates attendance percentage for a student in a specific course';
