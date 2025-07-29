-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Only admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Only admins can update courses" ON courses;
DROP POLICY IF EXISTS "Only admins can delete courses" ON courses;
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can create their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Reviews are viewable by everyone" ON course_reviews;
DROP POLICY IF EXISTS "Users can create their own reviews" ON course_reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON course_reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON course_reviews;

-- Create courses table if it doesn't exist
CREATE TABLE IF NOT EXISTS courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price INTEGER NOT NULL,
    original_price INTEGER,
    image TEXT NOT NULL,
    category TEXT NOT NULL,
    level TEXT NOT NULL,
    duration TEXT,
    status TEXT DEFAULT 'published',
    students INTEGER DEFAULT 0,
    enrollment_status TEXT DEFAULT 'Open',
    rating DECIMAL(3,2) DEFAULT 0,
    rating_count INTEGER DEFAULT 0,
    resources INTEGER DEFAULT 0,
    published_date DATE DEFAULT CURRENT_DATE,
    enrollments INTEGER DEFAULT 0,
    learning_outcomes JSONB DEFAULT '[]',
    requirements JSONB DEFAULT '[]',
    modules JSONB DEFAULT '[]',
    reviews JSONB DEFAULT '[]',
    instructor JSONB,
    faqs JSONB DEFAULT '[]',
    tags JSONB DEFAULT '[]',
    thumbnail TEXT,
    schedule TEXT,
    language TEXT DEFAULT 'English',
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    certification_included BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create enrollments table if it doesn't exist
CREATE TABLE IF NOT EXISTS enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    status TEXT DEFAULT 'active',
    UNIQUE(user_id, course_id)
);

-- Create course_reviews table if it doesn't exist
CREATE TABLE IF NOT EXISTS course_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, course_id)
);

-- Enable Row Level Security
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_reviews ENABLE ROW LEVEL SECURITY;

-- Policies for courses table
CREATE POLICY "Courses are viewable by everyone" ON courses
    FOR SELECT USING (true);

CREATE POLICY "Only admins can insert courses" ON courses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update courses" ON courses
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete courses" ON courses
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policies for enrollments table
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own enrollments" ON enrollments
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own enrollments" ON enrollments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments" ON enrollments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policies for course_reviews table
CREATE POLICY "Reviews are viewable by everyone" ON course_reviews
    FOR SELECT USING (true);

CREATE POLICY "Users can create their own reviews" ON course_reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" ON course_reviews
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" ON course_reviews
    FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_courses_category ON courses(category);
CREATE INDEX IF NOT EXISTS idx_courses_level ON courses(level);
CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status);
CREATE INDEX IF NOT EXISTS idx_courses_slug ON courses(slug);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_course_reviews_course_id ON course_reviews(course_id);

-- Function to update course rating when reviews are added/updated/deleted
CREATE OR REPLACE FUNCTION update_course_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses 
    SET 
        rating = (
            SELECT COALESCE(AVG(rating), 0) 
            FROM course_reviews 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        ),
        rating_count = (
            SELECT COUNT(*) 
            FROM course_reviews 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
        )
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for rating updates
DROP TRIGGER IF EXISTS trigger_update_course_rating_insert ON course_reviews;
CREATE TRIGGER trigger_update_course_rating_insert
    AFTER INSERT ON course_reviews
    FOR EACH ROW EXECUTE FUNCTION update_course_rating();

DROP TRIGGER IF EXISTS trigger_update_course_rating_update ON course_reviews;
CREATE TRIGGER trigger_update_course_rating_update
    AFTER UPDATE ON course_reviews
    FOR EACH ROW EXECUTE FUNCTION update_course_rating();

DROP TRIGGER IF EXISTS trigger_update_course_rating_delete ON course_reviews;
CREATE TRIGGER trigger_update_course_rating_delete
    AFTER DELETE ON course_reviews
    FOR EACH ROW EXECUTE FUNCTION update_course_rating();

-- Function to update enrollment count when enrollments are added/removed
CREATE OR REPLACE FUNCTION update_course_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE courses 
    SET 
        enrollments = (
            SELECT COUNT(*) 
            FROM enrollments 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
            AND status = 'active'
        ),
        students = (
            SELECT COUNT(*) 
            FROM enrollments 
            WHERE course_id = COALESCE(NEW.course_id, OLD.course_id)
            AND status = 'active'
        )
    WHERE id = COALESCE(NEW.course_id, OLD.course_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for enrollment count updates
DROP TRIGGER IF EXISTS trigger_update_enrollment_count_insert ON enrollments;
CREATE TRIGGER trigger_update_enrollment_count_insert
    AFTER INSERT ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

DROP TRIGGER IF EXISTS trigger_update_enrollment_count_update ON enrollments;
CREATE TRIGGER trigger_update_enrollment_count_update
    AFTER UPDATE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();

DROP TRIGGER IF EXISTS trigger_update_enrollment_count_delete ON enrollments;
CREATE TRIGGER trigger_update_enrollment_count_delete
    AFTER DELETE ON enrollments
    FOR EACH ROW EXECUTE FUNCTION update_course_enrollment_count();