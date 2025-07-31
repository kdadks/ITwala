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

async function checkPageViewsSchema() {
  try {
    console.log('🔍 Checking actual page_views table schema...');
    
    // Get the actual schema by selecting from the table
    const { data: existingRecords, error: selectError } = await supabase
      .from('page_views')
      .select('*')
      .limit(1);
    
    if (selectError) {
      console.error('❌ Error selecting from page_views:', selectError);
      return;
    }
    
    if (existingRecords && existingRecords.length > 0) {
      console.log('✅ Found existing records. Schema includes these columns:');
      console.log(Object.keys(existingRecords[0]));
    } else {
      console.log('ℹ️ No existing records found.');
    }
    
    // Test minimal insert
    console.log('\n🧪 Testing minimal page_views insert...');
    
    const testData = {
      session_id: 'test_session_' + Date.now(),
      page_url: '/test',
      page_title: 'Test Page',
      user_agent: 'test-browser'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('page_views')
      .insert(testData)
      .select();
    
    if (insertError) {
      console.log('❌ Minimal insert failed:', insertError);
    } else {
      console.log('✅ Minimal insert succeeded:', insertData);
      
      // Clean up test record
      await supabase
        .from('page_views')
        .delete()
        .eq('session_id', testData.session_id);
    }
    
    // Test additional columns
    console.log('\n🧪 Testing additional columns...');
    
    const testColumns = {
      user_id: null,
      referrer: 'https://example.com',
      country: 'United States',
      device_type: 'desktop',
      browser: 'Chrome',
      created_at: new Date().toISOString()
    };
    
    for (const [columnName, value] of Object.entries(testColumns)) {
      const testDataWithColumn = {
        ...testData,
        session_id: 'test_' + columnName + '_' + Date.now(),
        [columnName]: value
      };
      
      const { error } = await supabase
        .from('page_views')
        .insert(testDataWithColumn);
      
      if (error) {
        console.log(`❌ Column '${columnName}' failed:`, error.message);
      } else {
        console.log(`✅ Column '${columnName}' works`);
        // Clean up
        await supabase
          .from('page_views')
          .delete()
          .eq('session_id', testDataWithColumn.session_id);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPageViewsSchema();
