/**
 * Direct SQL execution for fixing invoice schema
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function executeDirectSQL() {
  console.log('🚀 Executing SQL commands directly...');
  
  try {
    // We'll use a workaround by trying to create a temporary test to verify if columns exist
    console.log('🔧 Step 1: Adding company_info column...');
    
    // Use a simple approach - try to query a column that doesn't exist to trigger an alter
    try {
      await supabase.from('invoices').select('company_info').limit(1);
      console.log('✅ company_info column already exists');
    } catch (error) {
      console.log('📝 company_info column needs to be added');
    }
    
    try {
      await supabase.from('invoices').select('client_info').limit(1);
      console.log('✅ client_info column already exists');
    } catch (error) {
      console.log('📝 client_info column needs to be added');
    }
    
    console.log('\n❌ Direct SQL execution not possible via JavaScript client');
    console.log('🔗 Please go to Supabase Dashboard → SQL Editor and run this SQL:');
    
    const sql = `
-- Fix invoices table schema for ITWala Academy
-- Add missing JSON columns and update structure

-- Add new columns
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS company_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS client_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS issue_date DATE,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0;

-- Update existing data
UPDATE invoices 
SET issue_date = COALESCE(issue_date, invoice_date)
WHERE issue_date IS NULL;

UPDATE invoices 
SET tax = COALESCE(tax, tax_amount, 0)
WHERE tax IS NULL OR tax = 0;

UPDATE invoices 
SET total = COALESCE(total, total_amount, 0)
WHERE total IS NULL OR total = 0;

-- Initialize JSON columns for existing records
UPDATE invoices 
SET company_info = COALESCE(company_info, '{}')
WHERE company_info IS NULL;

UPDATE invoices 
SET client_info = COALESCE(client_info, '{}')
WHERE client_info IS NULL;

-- Set defaults
ALTER TABLE invoices 
ALTER COLUMN company_info SET DEFAULT '{}',
ALTER COLUMN client_info SET DEFAULT '{}';

-- Test the structure by inserting a test record
INSERT INTO invoices (
  invoice_number,
  issue_date,
  due_date,
  status,
  company_info,
  client_info,
  items,
  subtotal,
  tax,
  tax_rate,
  total,
  notes
) VALUES (
  'TEST-SCHEMA-VALIDATION',
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'draft',
  '{"name": "ITWala Academy", "email": "admin@itwala.com"}',
  '{"name": "Test Client", "email": "client@test.com"}',
  '[{"id": "1", "description": "Test Course", "quantity": 1, "rate": 1000, "amount": 1000}]',
  1000.00,
  180.00,
  18.00,
  1180.00,
  'Schema validation test - safe to delete'
);

-- Verify the insert worked
SELECT invoice_number, company_info, client_info FROM invoices WHERE invoice_number = 'TEST-SCHEMA-VALIDATION';

-- Clean up test record
DELETE FROM invoices WHERE invoice_number = 'TEST-SCHEMA-VALIDATION';
`;

    console.log('\n' + '='.repeat(80));
    console.log(sql);
    console.log('='.repeat(80));
    
    console.log('\n📋 Steps to fix:');
    console.log('1. Open Supabase Dashboard');
    console.log('2. Go to SQL Editor');
    console.log('3. Paste the above SQL');
    console.log('4. Click "Run"');
    console.log('5. Verify the test record is created and deleted');
    console.log('6. Try saving invoices again');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

executeDirectSQL();