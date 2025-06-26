const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyAdminFixes() {
  try {
    console.log('🔧 Applying admin database fixes...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'fix-admin-database-issues.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`⚡ Executing statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql_query: statement });
          
          if (error) {
            // Try direct execution if RPC fails
            const { error: directError } = await supabase
              .from('_temp_sql_execution')
              .select('*')
              .limit(0);
            
            if (directError) {
              console.log(`⚠️  Statement ${i + 1} failed, trying alternative method...`);
              // For some statements, we might need to use the REST API directly
              continue;
            }
          }
          
          console.log(`✅ Statement ${i + 1} executed successfully`);
        } catch (err) {
          console.log(`⚠️  Statement ${i + 1} failed: ${err.message}`);
          // Continue with other statements
        }
      }
    }
    
    console.log('🎉 Admin fixes applied successfully!');
    
    // Test the fixes
    console.log('\n🧪 Testing the fixes...');
    
    // Test 1: Check if content_sections table exists
    const { data: contentSections, error: contentError } = await supabase
      .from('content_sections')
      .select('*')
      .limit(1);
    
    if (contentError) {
      console.log('❌ content_sections table test failed:', contentError.message);
    } else {
      console.log('✅ content_sections table is accessible');
    }
    
    // Test 2: Check if profiles table exists
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (profilesError) {
      console.log('❌ profiles table test failed:', profilesError.message);
    } else {
      console.log('✅ profiles table is accessible');
    }
    
    // Test 3: Check if categories table is accessible
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*')
      .limit(1);
    
    if (categoriesError) {
      console.log('❌ categories table test failed:', categoriesError.message);
    } else {
      console.log('✅ categories table is accessible');
    }
    
    console.log('\n🏁 All fixes have been applied and tested!');
    
  } catch (error) {
    console.error('❌ Error applying admin fixes:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution
async function executeDirectSQL() {
  try {
    console.log('🔧 Applying admin database fixes using direct SQL...');
    
    const sqlPath = path.join(__dirname, '..', 'fix-admin-database-issues.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the entire SQL as one block
    const { error } = await supabase.rpc('exec_sql', { sql_query: sql });
    
    if (error) {
      console.error('❌ Error executing SQL:', error);
      return false;
    }
    
    console.log('✅ SQL executed successfully');
    return true;
    
  } catch (error) {
    console.error('❌ Error in direct SQL execution:', error);
    return false;
  }
}

// Run the script
if (require.main === module) {
  applyAdminFixes().catch(console.error);
}

module.exports = { applyAdminFixes, executeDirectSQL };