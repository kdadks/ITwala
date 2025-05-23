const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Create Supabase client with service role key
const supabase = createClient(
  'https://lyywvmoxtlovvxknpkpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function applyMigration(migrationFileName) {
  try {
    console.log('1. Reading migration SQL...');
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'migrations', migrationFileName),
      'utf8'
    );

    console.log('2. Applying migration...');
    const { error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) throw error;

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// Check if migration file name was provided
const migrationFileName = process.argv[2];
if (!migrationFileName) {
  console.error('Please provide a migration file name');
  process.exit(1);
}

// Run the migration
applyMigration(migrationFileName);
