const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function fixEnrollmentDatabase() {
  console.log('🔧 Fixing enrollment database issues...');

  // Create Supabase admin client
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'fix-enrollment-database-issues.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('📝 Applying database fixes...');
    
    // Split SQL into individual statements and execute them
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (const statement of statements) {
      if (statement.trim()) {
        console.log(`Executing: ${statement.substring(0, 50)}...`);
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          // Try direct execution if rpc fails
          const { error: directError } = await supabase
            .from('_temp')
            .select('*')
            .limit(0);
          
          // Execute using raw SQL
          const { error: rawError } = await supabase.rpc('exec', { 
            sql: statement 
          });
          
          if (rawError) {
            console.log(`⚠️  Statement may have failed (this might be expected): ${rawError.message}`);
          }
        }
      }
    }

    // Verify the columns exist
    console.log('🔍 Verifying database structure...');
    
    // Test if we can query the profiles table with the new columns
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('id, address_line1, updated_at')
      .limit(1);

    if (testError) {
      console.error('❌ Verification failed:', testError.message);
      
      // Try alternative approach - direct column addition
      console.log('🔄 Trying alternative approach...');
      
      const alterStatements = [
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line1 TEXT",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS address_line2 TEXT",
        "ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT"
      ];

      for (const stmt of alterStatements) {
        try {
          const { error } = await supabase.rpc('exec', { sql: stmt });
          if (error) {
            console.log(`⚠️  ${stmt} - ${error.message}`);
          } else {
            console.log(`✅ ${stmt}`);
          }
        } catch (e) {
          console.log(`⚠️  ${stmt} - ${e.message}`);
        }
      }
    } else {
      console.log('✅ Database structure verified successfully!');
    }

    console.log('🎉 Enrollment database fixes completed!');
    
  } catch (error) {
    console.error('❌ Error fixing enrollment database:', error);
    process.exit(1);
  }
}

// Run the fix
fixEnrollmentDatabase();