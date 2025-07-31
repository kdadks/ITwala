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

async function checkUserSessionsSchema() {
  try {
    console.log('🔍 Checking user_sessions table schema...');
    
    // Get table schema by trying to insert a minimal record and seeing what fails
    const { data, error } = await supabase
      .from('user_sessions')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error accessing user_sessions:', error);
      return;
    }
    
    console.log('✅ Table accessible, checking columns...');
    
    // Try a simple insert to see which columns are expected
    const testSessionId = 'test_' + Date.now();
    const { error: insertError } = await supabase
      .from('user_sessions')
      .insert({
        session_id: testSessionId,
        user_agent: 'test',
        first_page: '/test'
      });
    
    if (insertError) {
      console.log('❌ Insert test failed:', insertError);
    } else {
      console.log('✅ Basic insert works');
      
      // Clean up test record
      await supabase
        .from('user_sessions')
        .delete()
        .eq('session_id', testSessionId);
    }
    
    // Try to get the actual table structure using a SQL query
    console.log('\n🔍 Getting table structure...');
    const { data: schemaData, error: schemaError } = await supabase.rpc('exec', {
      sql: `
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'user_sessions' 
        AND table_schema = 'public'
        ORDER BY ordinal_position;
      `
    });
    
    if (schemaError) {
      console.log('❌ Schema check failed:', schemaError);
    } else {
      console.log('📋 user_sessions table columns:');
      schemaData.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking schema:', error);
  }
}

checkUserSessionsSchema();
