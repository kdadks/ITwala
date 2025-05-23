const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('Missing environment variables');
  process.exit(1);
}

console.log('Using Supabase URL:', SUPABASE_URL);

async function applyMigration() {
  try {
    // Read the migration SQL
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/20250519000000_fix_enrollments.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    // Make direct HTTP request to Supabase's SQL endpoint
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to execute SQL: ${error}`);
    }

    const result = await response.json();
    console.log('Migration applied successfully:', result);

    // Verify the changes
    console.log('\nVerifying table and policies...');
    const verifyResponse = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'apikey': SUPABASE_KEY
      },
      body: JSON.stringify({
        query: `
          SELECT table_name, has_rls_enabled 
          FROM information_schema.tables 
          WHERE table_name = 'enrollments';
          
          SELECT * FROM pg_policies 
          WHERE tablename = 'enrollments';
        `
      })
    });

    if (!verifyResponse.ok) {
      throw new Error('Failed to verify changes');
    }

    const verifyResult = await verifyResponse.json();
    console.log('Verification result:', verifyResult);

  } catch (error) {
    console.error('Error applying migration:', error);
    process.exit(1);
  }
}

applyMigration();
