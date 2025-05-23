const fs = require('fs').promises;
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

// Create admin client with service role key
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function directQuery(sql) {
  try {
    const { error } = await adminClient.rest.rpc('apply_migration', { sql });
    return { error };
  } catch (error) {
    return { error };
  }
}

async function applyMigrations() {
  try {
    // First create the apply_migration function
    console.log('Creating migration function...');
    const functionSql = await fs.readFile(
      path.join(__dirname, '..', 'supabase', 'migrations', '20250519020300_create_migration_function.sql'),
      'utf8'
    );
    
    const { error: fnError } = await directQuery(functionSql);
    if (fnError) {
      console.error('Error creating migration function:', fnError.message);
      return;
    }

    // Read migration files
    console.log('\nReading migration files...');
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const files = await fs.readdir(migrationsDir);
    
    // Filter and sort migration files
    const migrationFiles = files
      .filter(f => f.endsWith('.sql') && !f.endsWith('.bak') && f !== '20250519020300_create_migration_function.sql')
      .sort();

    // Apply each migration
    for (const file of migrationFiles) {
      console.log(`\nApplying migration: ${file}`);
      const filePath = path.join(migrationsDir, file);
      const sql = await fs.readFile(filePath, 'utf8');

      try {
        // Try RPC first
        const { error } = await adminClient.rpc('apply_migration', { sql });
        if (error) {
          console.error(`RPC Error for ${file}:`, error.message);
          // If RPC fails, try direct SQL
          console.log('Trying direct SQL...');
          const { error: directError } = await directQuery(sql);
          if (directError) {
            console.error(`Direct SQL Error for ${file}:`, directError.message);
          } else {
            console.log(`✓ Successfully applied ${file} using direct SQL`);
          }
        } else {
          console.log(`✓ Successfully applied ${file}`);
        }
      } catch (error) {
        console.error(`Error applying ${file}:`, error.message);
      }
    }

    console.log('\nMigrations completed!');

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Run migrations
applyMigrations();
