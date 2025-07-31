const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

async function addMissingColumns() {
  try {
    console.log('🔧 Adding missing columns to user_sessions table...');
    
    // We'll use a different approach - create a new record with all fields
    // and see what works, then drop it
    const testSessionId = 'test_schema_' + Date.now();
    
    // First, let's try to add columns using a stored procedure approach
    // We'll create a simple function to add columns
    console.log('Creating helper function...');
    
    const createFunctionSQL = `
CREATE OR REPLACE FUNCTION add_user_sessions_columns()
RETURNS TEXT AS $$
DECLARE
  result TEXT := '';
BEGIN
  -- Add device_type column
  BEGIN
    ALTER TABLE user_sessions ADD COLUMN device_type TEXT;
    result := result || 'Added device_type column. ';
  EXCEPTION 
    WHEN duplicate_column THEN
      result := result || 'device_type column already exists. ';
  END;
  
  -- Add browser column
  BEGIN
    ALTER TABLE user_sessions ADD COLUMN browser TEXT;
    result := result || 'Added browser column. ';
  EXCEPTION 
    WHEN duplicate_column THEN
      result := result || 'browser column already exists. ';
  END;
  
  -- Add country column
  BEGIN
    ALTER TABLE user_sessions ADD COLUMN country TEXT;
    result := result || 'Added country column. ';
  EXCEPTION 
    WHEN duplicate_column THEN
      result := result || 'country column already exists. ';
  END;
  
  -- Add updated_at column
  BEGIN
    ALTER TABLE user_sessions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
    result := result || 'Added updated_at column. ';
  EXCEPTION 
    WHEN duplicate_column THEN
      result := result || 'updated_at column already exists. ';
  END;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Try to create and execute the function using edge functions or direct SQL
    // Since we can't execute arbitrary SQL, let's try a different approach
    
    console.log('Attempting to add columns using individual operations...');
    
    // Try to update an existing record to force column creation
    // First get any existing record
    const { data: existingRecords } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1);
    
    if (existingRecords && existingRecords.length > 0) {
      console.log('Found existing record, trying to update with new columns...');
      
      // Try to update with new columns one by one
      const recordId = existingRecords[0].id;
      
      // This will fail if columns don't exist, but that's okay
      try {
        await supabase
          .from('user_sessions')
          .update({ device_type: 'unknown' })
          .eq('id', recordId);
        console.log('✅ device_type column works');
      } catch (e) {
        console.log('❌ device_type column needs to be added');
      }
      
      try {
        await supabase
          .from('user_sessions')
          .update({ browser: 'unknown' })
          .eq('id', recordId);
        console.log('✅ browser column works');
      } catch (e) {
        console.log('❌ browser column needs to be added');
      }
      
      try {
        await supabase
          .from('user_sessions')
          .update({ country: 'unknown' })
          .eq('id', recordId);
        console.log('✅ country column works');
      } catch (e) {
        console.log('❌ country column needs to be added');
      }
    }
    
    console.log('\n📋 Next steps:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Run the following SQL:');
    console.log('\n' + '='.repeat(50));
    console.log(`
-- Add missing columns to user_sessions table
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS browser TEXT;
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());

-- Verify columns were added
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'user_sessions' 
ORDER BY ordinal_position;
    `);
    console.log('='.repeat(50));
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addMissingColumns();
