--- Drop and recreate all course policies to ensure correct order and permissions
DO $$
BEGIN
    -- First check if RLS is enabled
    IF NOT EXISTS (
        SELECT 1
        FROM pg_tables
        WHERE tablename = 'courses'
        AND rowsecurity = true
    ) THEN
        -- Enable RLS if not already enabled
        ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Drop all existing course policies to avoid conflicts
DROP POLICY IF EXISTS "Courses are viewable by everyone" ON courses;
DROP POLICY IF EXISTS "Instructors can insert courses" ON courses;
DROP POLICY IF EXISTS "Instructors can update their own courses" ON courses;
DROP POLICY IF EXISTS "Admins can manage all courses" ON courses;
DROP POLICY IF EXISTS "Admin course management" ON courses;

-- 1. Allow anyone to view published courses
CREATE POLICY "Courses are viewable by everyone" 
    ON courses FOR SELECT 
    USING (
        CASE
            WHEN status = 'published' THEN true
            WHEN auth.uid() IS NOT NULL THEN EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND (profiles.role = 'admin' OR profiles.id = courses.instructor_id)
            )
            ELSE false
        END
    );

-- 2. Allow instructors to insert their own courses and admins to insert any course
CREATE POLICY "Course creation policy" 
    ON courses FOR INSERT 
    WITH CHECK (
        auth.uid() = instructor_id 
        OR 
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 3. Allow instructors to update their own courses and admins to update any course
CREATE POLICY "Course update policy" 
    ON courses FOR UPDATE
    USING (
        auth.uid() = instructor_id 
        OR 
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- 4. Allow only admins to delete courses
CREATE POLICY "Course deletion policy" 
    ON courses FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
