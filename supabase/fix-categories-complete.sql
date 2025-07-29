-- Complete fix for categories table access and data synchronization
-- This script addresses both admin access issues and category data mismatch

-- 1. First, ensure RLS is enabled on categories table
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies if they exist
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

-- 3. Create public read access for categories (needed for website to display)
CREATE POLICY "Anyone can view categories" ON categories
    FOR SELECT USING (true);

-- 4. Create admin policies for categories management
CREATE POLICY "Only admins can insert categories" ON categories
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update categories" ON categories
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete categories" ON categories
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 5. Insert missing categories that are used in the website
-- First, let's add all the categories from the course data
INSERT INTO categories (name, slug, description)
SELECT * FROM (
    VALUES
        ('Prompt Engineering', 'prompt-engineering', 'Master the art of crafting effective prompts for AI models'),
        ('Agentic AI', 'agentic-ai', 'Build autonomous AI agents that can perform complex tasks'),
        ('Artificial Intelligence', 'artificial-intelligence', 'Explore machine learning, deep learning, and AI applications'),
        ('Product Management', 'product-management', 'Learn to define, build, and launch successful IT products'),
        ('Software Development', 'software-development', 'Master programming languages and development practices'),
        ('Machine Learning', 'machine-learning', 'Learn algorithms and techniques for building intelligent systems')
) AS new_categories(name, slug, description)
WHERE NOT EXISTS (
    SELECT 1 FROM categories
    WHERE categories.name = new_categories.name
);

-- 6. Also ensure courses admin policies are properly set
DROP POLICY IF EXISTS "Anyone can view courses" ON courses;
DROP POLICY IF EXISTS "Only admins can insert courses" ON courses;
DROP POLICY IF EXISTS "Only admins can update courses" ON courses;
DROP POLICY IF EXISTS "Only admins can delete courses" ON courses;

-- Create public read access for courses
CREATE POLICY "Anyone can view courses" ON courses
    FOR SELECT USING (true);

-- Create admin policies for courses
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

-- 7. Fix enrollments admin access for the students page
DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
DROP POLICY IF EXISTS "Admins can update all enrollments" ON enrollments;

-- Create user access policy for enrollments
CREATE POLICY "Users can view their own enrollments" ON enrollments
    FOR SELECT USING (auth.uid() = user_id);

-- Create admin access policies for enrollments
CREATE POLICY "Admins can view all enrollments" ON enrollments
    FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can update all enrollments" ON enrollments
    FOR UPDATE USING (
        auth.uid() = user_id OR
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- 8. Verification queries to check the fix
-- Check if categories were added correctly
SELECT 'Categories in database:' as info;
SELECT id, name, created_at FROM categories ORDER BY name;

-- Check if all website categories are present
SELECT 'Missing categories check:' as info;
SELECT * FROM (
    VALUES 
        ('Prompt Engineering'),
        ('Agentic AI'),
        ('Artificial Intelligence'),
        ('Product Management'),
        ('Software Development'),
        ('Machine Learning')
) AS required_categories(name)
WHERE NOT EXISTS (
    SELECT 1 FROM categories 
    WHERE categories.name = required_categories.name
);

-- Check policies are applied
SELECT 'RLS status check:' as info;
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('categories', 'courses', 'enrollments');

-- End of script
SELECT 'Categories fix completed successfully!' as result;