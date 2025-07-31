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

async function checkActualSchema() {
  try {
    console.log('🔍 Checking actual user_sessions table schema...');
    
    // Get the actual schema by trying to insert a test record and seeing what fails
    const testSessionId = 'schema_test_' + Date.now();
    
    // First, let's see what columns exist by selecting from the table
    const { data: existingRecords, error: selectError } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Error selecting from user_sessions:', selectError);
      return;
    }
    
    if (existingRecords && existingRecords.length > 0) {
      console.log('✅ Found existing records. Schema includes these columns:');
      console.log(Object.keys(existingRecords[0]));
    } else {
      console.log('ℹ️ No existing records found.');
    }
    
    // Now let's try to insert with minimal data to see what's required
    console.log('\n🧪 Testing minimal insert...');
    
    const minimalData = {
      session_id: testSessionId,
      user_agent: 'test-browser',
      first_page: '/test',
      last_page: '/test',
      total_pages: 1
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('user_sessions')
      .insert(minimalData)
      .select();
    
    if (insertError) {
      console.log('❌ Minimal insert failed:', insertError);
    } else {
      console.log('✅ Minimal insert succeeded:', insertData);
      
      // Clean up test record
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', testSessionId);
    }
    
    // Test what extra columns work
    console.log('\n🧪 Testing additional columns one by one...');
    
    const testColumns = {
      device_type: 'desktop',
      browser: 'Chrome',
      country: 'United States',
      updated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      user_id: null
    };
    
    for (const [columnName, value] of Object.entries(testColumns)) {
      const testData = {
        ...minimalData,
        session_id: testSessionId + '_' + columnName,
        [columnName]: value
      };
      
      const { error } = await supabase
        .from('user_sessions')
        .insert(testData);
      
      if (error) {
        console.log(`❌ Column '${columnName}' failed:`, error.message);
      } else {
        console.log(`✅ Column '${columnName}' works`);
        // Clean up
        await supabase
          .from('user_sessions')
          .delete()
          .eq('session_id', testData.session_id);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkActualSchema();
