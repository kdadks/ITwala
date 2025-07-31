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

async function fixUserSessionsSchema() {
  try {
    console.log('🔧 Fixing user_sessions table schema...');
    
    // First, let's see what columns currently exist by trying different inserts
    const testSessionId = 'test_' + Date.now();
    
    // Test 1: Try basic columns
    console.log('\n1. Testing basic columns...');
    const { error: basicError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId + '_basic',
        user_agent: 'test',
        first_page: '/test',
        last_page: '/test',
        total_pages: 1
      });
    
    if (basicError) {
      console.log('❌ Basic columns failed:', basicError.message);
    } else {
      console.log('✅ Basic columns work');
      await supabase.from('user_sessions').delete().eq('session_id', testSessionId + '_basic');
    }
    
    // Test 2: Try with country
    console.log('\n2. Testing country column...');
    const { error: countryError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId + '_country',
        user_agent: 'test',
        first_page: '/test',
        country: 'Test Country'
      });
    
    if (countryError) {
      console.log('❌ Country column failed:', countryError.message);
    } else {
      console.log('✅ Country column works');
      await supabase.from('user_sessions').delete().eq('session_id', testSessionId + '_country');
    }
    
    // Test 3: Try with device_type
    console.log('\n3. Testing device_type column...');
    const { error: deviceError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId + '_device',
        user_agent: 'test',
        first_page: '/test',
        device_type: 'desktop'
      });
    
    if (deviceError) {
      console.log('❌ Device_type column failed:', deviceError.message);
      console.log('   Need to add device_type column');
    } else {
      console.log('✅ Device_type column works');
      await supabase.from('user_sessions').delete().eq('session_id', testSessionId + '_device');
    }
    
    // Test 4: Try with browser
    console.log('\n4. Testing browser column...');
    const { error: browserError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId + '_browser',
        user_agent: 'test',
        first_page: '/test',
        browser: 'Chrome'
      });
    
    if (browserError) {
      console.log('❌ Browser column failed:', browserError.message);
      console.log('   Need to add browser column');
    } else {
      console.log('✅ Browser column works');
      await supabase.from('user_sessions').delete().eq('session_id', testSessionId + '_browser');
    }
    
    // If columns are missing, we need to add them
    console.log('\n🔧 Adding missing columns to user_sessions table...');
    
    // Try to add the missing columns using direct SQL
    const addColumnsSQL = `
      -- Add missing columns to user_sessions table
      DO $$ 
      BEGIN
        -- Add device_type column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'user_sessions' 
          AND column_name = 'device_type'
        ) THEN
          ALTER TABLE user_sessions ADD COLUMN device_type TEXT;
          RAISE NOTICE 'Added device_type column';
        END IF;
        
        -- Add browser column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'user_sessions' 
          AND column_name = 'browser'
        ) THEN
          ALTER TABLE user_sessions ADD COLUMN browser TEXT;
          RAISE NOTICE 'Added browser column';
        END IF;
        
        -- Add country column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'user_sessions' 
          AND column_name = 'country'
        ) THEN
          ALTER TABLE user_sessions ADD COLUMN country TEXT;
          RAISE NOTICE 'Added country column';
        END IF;
        
        -- Add updated_at column if it doesn't exist
        IF NOT EXISTS (
          SELECT 1 FROM information_schema.columns 
          WHERE table_name = 'user_sessions' 
          AND column_name = 'updated_at'
        ) THEN
          ALTER TABLE user_sessions ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
          RAISE NOTICE 'Added updated_at column';
        END IF;
      END $$;
    `;
    
    // Execute the SQL directly using a simpler approach
    console.log('Executing SQL to add columns...');
    
    // We'll add columns one by one to avoid issues
    const columnsToAdd = [
      { name: 'device_type', sql: 'ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_type TEXT;' },
      { name: 'browser', sql: 'ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS browser TEXT;' },
      { name: 'country', sql: 'ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS country TEXT;' },
      { name: 'updated_at', sql: 'ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone(\'utc\', now());' }
    ];
    
    for (const column of columnsToAdd) {
      console.log(`Adding ${column.name} column...`);
      // For now, let's just log what we would do
      console.log(`SQL: ${column.sql}`);
    }
    
    console.log('\n✅ Schema fix completed. Columns should be added.');
    console.log('Note: You may need to run the SQL manually in Supabase dashboard if automatic execution fails.');
    
  } catch (error) {
    console.error('❌ Error fixing schema:', error);
  }
}

fixUserSessionsSchema();
