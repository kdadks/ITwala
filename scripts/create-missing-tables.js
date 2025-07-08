const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createMissingTables() {
  try {
    console.log('Creating missing course management tables...');
    
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'create-missing-course-tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split the SQL into individual statements (rough split by semicolon)
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i].trim();
      if (!statement) continue;
      
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      
      const { error } = await supabase.rpc('exec_sql', { 
        sql_query: statement + ';' 
      });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error);
        console.error('Statement was:', statement);
        // Continue with other statements instead of stopping
      } else {
        console.log(`✓ Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('\n✅ Database table creation completed!');
    console.log('The following tables should now exist:');
    console.log('- modules');
    console.log('- lessons');
    console.log('- progress');
    console.log('- reviews');
    
  } catch (error) {
    console.error('Error creating tables:', error);
    process.exit(1);
  }
}

// Alternative method using direct SQL execution if RPC doesn't work
async function createTablesDirectly() {
  try {
    console.log('Creating missing tables using direct SQL execution...');
    
    // Create modules table
    console.log('Creating modules table...');
    const { error: modulesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_name', 'modules')
      .single();
    
    if (modulesError && modulesError.code === 'PGRST116') {
      // Table doesn't exist, create it
      const createModulesSQL = `
        CREATE TABLE modules (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          course_id UUID REFERENCES "Courses"(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          order_index INTEGER NOT NULL DEFAULT 0,
          duration_minutes INTEGER DEFAULT 0,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `;
      
      const { error } = await supabase.rpc('exec_sql', { sql_query: createModulesSQL });
      if (error) {
        console.error('Error creating modules table:', error);
      } else {
        console.log('✓ Modules table created');
      }
    }
    
    // Check if tables exist by trying to query them
    console.log('\nChecking created tables...');
    
    const tables = ['modules', 'lessons', 'progress', 'reviews'];
    for (const table of tables) {
      try {
        const { error } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (error) {
          console.log(`❌ ${table} table: ${error.message}`);
        } else {
          console.log(`✅ ${table} table: exists`);
        }
      } catch (err) {
        console.log(`❌ ${table} table: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error in direct table creation:', error);
  }
}

// Run the script
if (require.main === module) {
  console.log('Starting table creation process...');
  createMissingTables()
    .then(() => createTablesDirectly())
    .catch(console.error);
}

module.exports = { createMissingTables, createTablesDirectly };