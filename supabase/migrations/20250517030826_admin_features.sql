-- Add columns to profiles table for instructors
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS specialization TEXT,
ADD COLUMN IF NOT EXISTS rating NUMERIC(3,2),
ADD COLUMN IF NOT EXISTS students_count INTEGER DEFAULT 0;

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_method TEXT,
    transaction_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create analytics table for tracking various metrics
CREATE TABLE IF NOT EXISTS analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name TEXT NOT NULL,
    metric_value JSONB NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(metric_name, date)
);

-- Enable RLS on new tables
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for payments
CREATE POLICY "Admins can view all payments"
    ON payments FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Students can view their own payments"
    ON payments FOR SELECT
    USING (student_id = auth.uid());

CREATE POLICY "Only admins can update payments"
    ON payments FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create policies for analytics
CREATE POLICY "Only admins can manage analytics"
    ON analytics FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create function to update instructor stats
CREATE OR REPLACE FUNCTION update_instructor_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update students count for instructor
    UPDATE profiles
    SET students_count = (
        SELECT COUNT(DISTINCT enrollments.user_id)
        FROM courses
        JOIN enrollments ON courses.id = enrollments.course_id
        WHERE courses.instructor_id = profiles.id
    )
    WHERE id = (SELECT instructor_id FROM courses WHERE id = NEW.course_id);

    -- Update instructor rating
    UPDATE profiles
    SET rating = (
        SELECT AVG(r.rating)
        FROM courses c
        JOIN reviews r ON c.id = r.course_id
        WHERE c.instructor_id = profiles.id
    )
    WHERE id = (SELECT instructor_id FROM courses WHERE id = NEW.course_id);

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers to update instructor stats
CREATE TRIGGER on_enrollment_update_instructor_stats
    AFTER INSERT OR UPDATE OR DELETE ON enrollments
    FOR EACH ROW
    EXECUTE FUNCTION update_instructor_stats();

CREATE TRIGGER on_review_update_instructor_stats
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_instructor_stats();
