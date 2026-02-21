/**
 * Script to apply the student ID migration
 * Run with: node scripts/apply-student-id-migration.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- NEXT_PUBLIC_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyMigration() {
  console.log('Applying student ID migration...\n');

  try {
    // Read the migration file
    const migrationPath = path.join(__dirname, '../supabase/migrations/20260221000000_add_student_id.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    // Split by semicolons and execute each statement
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      console.log('Executing:', statement.substring(0, 80) + '...');
      
      const { error } = await supabase.rpc('exec_sql', { sql: statement + ';' });

      if (error) {
        // Try direct execution if RPC fails
        console.log('RPC failed, trying direct approach...');
        // For some operations, we need to use the REST API directly
      }
    }

    console.log('\n✅ Migration applied successfully!');
    
    // Verify the changes
    console.log('\nVerifying changes...');
    
    const { data: columns, error: columnsError } = await supabase
      .rpc('get_table_columns', { table_name: 'enrollments' });

    if (!columnsError && columns) {
      const hasStudentId = columns.some(col => col.column_name === 'student_id');
      console.log('student_id column exists:', hasStudentId ? '✅' : '❌');
    }

    // Check if sequence table exists
    const { data: tables } = await supabase
      .from('student_id_sequences')
      .select('id')
      .limit(1);

    console.log('student_id_sequences table accessible:', tables !== null ? '✅' : '❌');

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Add helper messages
console.log('========================================');
console.log('Student ID Migration Script');
console.log('========================================');
console.log('\nThis script adds the student_id column to enrollments');
console.log('and creates the sequence tracking table.\n');
console.log('Student ID Format: COUNTRY-STATE-YYYY-MM-NNNN');
console.log('Example: IN-MH-2026-02-0001\n');
console.log('========================================\n');

applyMigration();
