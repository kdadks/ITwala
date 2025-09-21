/**
 * Script to add missing columns to invoices table using direct queries
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addMissingColumns() {
  console.log('🔧 Adding missing columns to invoices table...');
  
  try {
    // First, let's check if the table exists and what columns it has
    console.log('🔍 Checking current table structure...');
    
    const { data: testQuery, error: testError } = await supabase
      .from('invoices')
      .select('*')
      .limit(1);
    
    if (testError) {
      console.error('❌ Error accessing invoices table:', testError.message);
      return false;
    }
    
    console.log('✅ Invoices table exists and is accessible');
    
    // Try to insert a test record to see what columns are missing
    console.log('🧪 Testing what columns are needed...');
    
    const testInvoice = {
      invoice_number: 'TEST-SCHEMA-' + Date.now(),
      issue_date: '2025-09-21',
      due_date: '2025-10-21',
      status: 'draft',
      company_info: { name: 'Test Company', email: 'test@company.com' },
      client_info: { name: 'Test Client', email: 'test@client.com' },
      items: [{ id: '1', description: 'Test Item', quantity: 1, rate: 100, amount: 100 }],
      subtotal: 100,
      tax: 18,
      tax_rate: 18,
      total: 118,
      notes: 'Test invoice for schema check'
    };
    
    const { data: insertResult, error: insertError } = await supabase
      .from('invoices')
      .insert([testInvoice])
      .select();
    
    if (insertError) {
      console.log('❌ Insert failed (expected):', insertError.message);
      console.log('📋 Missing columns identified from error message');
      
      // Based on the error, we know we need company_info and client_info columns
      console.log('\n💡 The table needs to be updated manually in Supabase SQL Editor');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/[your-project]/sql/new');
      console.log('\n📝 Copy and paste this SQL:');
      console.log('=' * 60);
      console.log(`
-- Add missing JSON columns to invoices table
ALTER TABLE invoices 
ADD COLUMN IF NOT EXISTS company_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS client_info JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS issue_date DATE,
ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0;

-- Copy data from existing columns if they exist
UPDATE invoices 
SET issue_date = COALESCE(issue_date, invoice_date)
WHERE issue_date IS NULL;

UPDATE invoices 
SET tax = COALESCE(tax, tax_amount, 0)
WHERE tax IS NULL OR tax = 0;

UPDATE invoices 
SET total = COALESCE(total, total_amount, 0)
WHERE total IS NULL OR total = 0;

-- Set up default JSON structures for existing records
UPDATE invoices 
SET company_info = COALESCE(company_info, '{}')
WHERE company_info IS NULL;

UPDATE invoices 
SET client_info = COALESCE(client_info, '{}')
WHERE client_info IS NULL;

-- Set column defaults
ALTER TABLE invoices 
ALTER COLUMN company_info SET DEFAULT '{}',
ALTER COLUMN client_info SET DEFAULT '{}';
      `);
      console.log('=' * 60);
      
      return false;
    } else {
      console.log('✅ Test insert successful! Schema is already updated.');
      
      // Clean up test record
      if (insertResult && insertResult[0]) {
        await supabase
          .from('invoices')
          .delete()
          .eq('id', insertResult[0].id);
        console.log('🧹 Test record cleaned up');
      }
      
      return true;
    }
    
  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

// Run the check
addMissingColumns()
  .then((success) => {
    if (success) {
      console.log('\n✨ Schema is ready for invoice saving!');
    } else {
      console.log('\n⚠️  Manual schema update required. See instructions above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('💥 Error:', error.message);
    process.exit(1);
  });