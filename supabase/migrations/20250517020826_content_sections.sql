-- Create content_sections table for managing website content
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing content
CREATE POLICY "Content sections are viewable by everyone" 
    ON content_sections FOR SELECT 
    USING (true);

-- Create policy for editing content (admin only)
CREATE POLICY "Only admins can edit content sections" 
    ON content_sections FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert initial content sections
INSERT INTO content_sections (name, content) VALUES
    ('Home Hero', '{"title": "Learn from Industry Experts", "subtitle": "Master the skills that drive innovation", "description": "Join our expert-led courses and transform your career with cutting-edge skills in technology, business, and design."}'),
    ('About Page', '{"mission": "Our mission is to provide world-class education that is accessible, affordable, and industry-relevant.", "vision": "We envision a world where quality education breaks down barriers and opens doors to opportunity.", "values": ["Excellence", "Innovation", "Accessibility", "Community"]}'),
    ('Course Page', '{"banner": {"title": "Explore Our Courses", "description": "Find the perfect course to advance your career"}, "categories": ["Technology", "Business", "Design", "Data Science"]}'),
    ('Contact Info', '{"address": "123 Education Street, Tech Park, Bangalore 560001", "phone": "+91 80 1234 5678", "email": "contact@itwala.com", "hours": "Monday - Friday, 9:00 AM - 6:00 PM"}'),
    ('Footer Content', '{"company": "ITwala Academy", "tagline": "Empowering Future Tech Leaders", "social": {"facebook": "itwala", "twitter": "itwala", "linkedin": "itwala-academy"}}')
ON CONFLICT (name) DO NOTHING;
