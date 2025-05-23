const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

async function applyMigration(migrationFileName) {
  try {
    console.log('1. Reading migration SQL...');
    const sql = fs.readFileSync(
      path.join(__dirname, '..', 'supabase', 'migrations', migrationFileName),
      'utf8'
    );

    console.log('2. Applying migration...');
    const response = await fetch('https://lyywvmoxtlovvxknpkpw.supabase.co/rest/v1/rpc/execute_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw`,
        'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw'
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to execute SQL: ${await response.text()}`);
    }

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
