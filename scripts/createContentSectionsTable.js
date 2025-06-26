const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createContentSectionsTable() {
  try {
    console.log('🔧 Creating content_sections table...');
    
    // First, let's try to create the table using a simple approach
    // We'll use the REST API to create the table structure
    
    // Check if table already exists
    const { data: existingData, error: checkError } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1);
    
    if (!checkError) {
      console.log('✅ content_sections table already exists');
      return;
    }
    
    console.log('📝 Table does not exist, creating it...');
    
    // Since we can't execute DDL through the client, let's create a simple workaround
    // We'll create an API endpoint to handle this
    
    console.log('⚠️  Cannot create table directly through client.');
    console.log('📋 Please run the following SQL in your Supabase SQL editor:');
    console.log(`
-- Create content_sections table
CREATE TABLE IF NOT EXISTS content_sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE content_sections ENABLE ROW LEVEL SECURITY;

-- Create policies for admin access
CREATE POLICY "Only admins can view content sections" ON content_sections
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can insert content sections" ON content_sections
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can update content sections" ON content_sections
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete content sections" ON content_sections
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Insert some default content sections
INSERT INTO content_sections (name, content) VALUES 
  ('home_hero', '{"title": "Welcome to ITwala Academy", "subtitle": "Learn technology skills that matter"}'),
  ('about_mission', '{"mission": "To provide world-class technology education accessible to everyone"}'),
  ('contact_info', '{"email": "info@itwala.academy", "phone": "+1-234-567-8900"}')
ON CONFLICT (name) DO NOTHING;
    `);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Also create a function to test admin access
async function testAdminAccess() {
  try {
    console.log('\n🧪 Testing admin access...');
    
    // Test categories access
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (catError) {
      console.log('❌ Categories access failed:', catError.message);
    } else {
      console.log('✅ Categories table accessible');
    }
    
    // Test profiles access
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profileError) {
      console.log('❌ Profiles access failed:', profileError.message);
    } else {
      console.log('✅ Profiles table accessible');
    }
    
    // Test enrollments access
    const { data: enrollments, error: enrollError } = await supabase
      .from('enrollments')
      .select(`
        id,
        enrolled_at,
        status,
        progress,
        courses(id, title)
      `)
      .limit(1);
    
    if (enrollError) {
      console.log('❌ Enrollments with courses join failed:', enrollError.message);
      console.log('🔍 This might be the profiles-enrollments relationship issue');
    } else {
      console.log('✅ Enrollments table with courses join working');
    }
    
  } catch (error) {
    console.error('❌ Error testing admin access:', error);
  }
}

// Run the functions
if (require.main === module) {
  createContentSectionsTable()
    .then(() => testAdminAccess())
    .catch(console.error);
}

module.exports = { createContentSectionsTable, testAdminAccess };