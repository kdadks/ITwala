require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs').promises;
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create Supabase client with admin privileges
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function applyMigration() {
  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250523001000_add_site_settings.sql');
    const migrationSQL = await fs.readFile(migrationPath, 'utf8');

    // Split the migration into individual statements
    const statements = migrationSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);

    console.log('Applying migration...');

    // Execute each statement
    for (const statement of statements) {
      const { error } = await supabase
        .from('_migrations')
        .insert({
          name: '20250519090000_fix_tables_and_policies',
          sql: statement
        });

      if (error) {
        console.error('Error with statement:', statement);
        throw error;
      }
    }

    console.log('Migration applied successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error applying migration:', error.message);
    process.exit(1);
  }
}

applyMigration();
