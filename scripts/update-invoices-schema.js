/**
 * Script to update the invoices table schema to support JSON company_info and client_info
 * This fixes the "Could not find the 'client_info' column" error
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Make sure you have NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

console.log('🚀 Connecting to Supabase database...');
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function executeSQL(description, sql) {
  console.log(`\n📝 ${description}...`);
  
  try {
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.log('   ⚠️  Using alternative method...');
      // Try direct query if exec_sql doesn't work
      throw error;
    } else {
      console.log('   ✅ Success!');
      return true;
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    console.log('   💡 Please run this SQL manually in Supabase SQL Editor:');
    console.log('   📋 ' + sql.replace(/\n/g, '\n      '));
    return false;
  }
}

async function updateInvoicesSchema() {
  console.log('🔧 Updating invoices table schema...');
  
  let allSuccess = true;

  // Step 1: Add new JSON columns for structured data
  const addColumnsSQL = `
    -- Add new JSON columns for company and client info
    ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS company_info JSONB DEFAULT '{}',
    ADD COLUMN IF NOT EXISTS client_info JSONB DEFAULT '{}';

    -- Update column names to match the application
    ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS issue_date DATE,
    ADD COLUMN IF NOT EXISTS tax DECIMAL(10,2) DEFAULT 0,
    ADD COLUMN IF NOT EXISTS tax_rate DECIMAL(5,2) DEFAULT 0;

    -- Copy existing data to new columns if they exist
    UPDATE invoices 
    SET issue_date = invoice_date 
    WHERE issue_date IS NULL AND invoice_date IS NOT NULL;

    UPDATE invoices 
    SET tax = tax_amount 
    WHERE tax IS NULL AND tax_amount IS NOT NULL;

    UPDATE invoices 
    SET tax_rate = COALESCE(tax_rate, 0)
    WHERE tax_rate IS NULL;
  `;

  const success1 = await executeSQL('Adding new JSON columns', addColumnsSQL);
  allSuccess = allSuccess && success1;

  // Step 2: Migrate existing data to new structure
  const migrateDataSQL = `
    -- Migrate existing company data to JSON structure
    UPDATE invoices 
    SET company_info = jsonb_build_object(
      'name', COALESCE(company_name, ''),
      'address', COALESCE(company_address, ''),
      'email', COALESCE(company_email, ''),
      'phone', COALESCE(company_phone, ''),
      'website', COALESCE(company_website, ''),
      'logo', COALESCE(company_logo_url, ''),
      'city', '',
      'zipCode', '',
      'country', '',
      'GSTIN', ''
    )
    WHERE company_info = '{}' OR company_info IS NULL;

    -- Migrate existing client data to JSON structure
    UPDATE invoices 
    SET client_info = jsonb_build_object(
      'name', COALESCE(client_name, ''),
      'email', COALESCE(client_email, ''),
      'address', COALESCE(client_address, ''),
      'phone', COALESCE(client_phone, ''),
      'company', COALESCE(client_company, ''),
      'city', '',
      'zipCode', '',
      'country', ''
    )
    WHERE client_info = '{}' OR client_info IS NULL;
  `;

  const success2 = await executeSQL('Migrating existing data to JSON structure', migrateDataSQL);
  allSuccess = allSuccess && success2;

  // Step 3: Update column constraints and defaults
  const updateConstraintsSQL = `
    -- Update total column name if needed
    ALTER TABLE invoices 
    ADD COLUMN IF NOT EXISTS total DECIMAL(10,2) DEFAULT 0;

    UPDATE invoices 
    SET total = total_amount 
    WHERE total IS NULL OR total = 0;

    -- Make sure required JSON columns are not null
    UPDATE invoices 
    SET company_info = '{}' 
    WHERE company_info IS NULL;

    UPDATE invoices 
    SET client_info = '{}' 
    WHERE client_info IS NULL;

    -- Set default values for new columns
    ALTER TABLE invoices 
    ALTER COLUMN company_info SET DEFAULT '{}',
    ALTER COLUMN client_info SET DEFAULT '{}';
  `;

  const success3 = await executeSQL('Updating constraints and defaults', updateConstraintsSQL);
  allSuccess = allSuccess && success3;

  // Step 4: Verify the updated structure
  console.log('\n🔍 Verifying table structure...');
  try {
    const { data: columns, error } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable')
      .eq('table_name', 'invoices')
      .order('ordinal_position');

    if (error) {
      console.log('   ⚠️  Could not verify structure:', error.message);
    } else {
      console.log('   ✅ Current table structure:');
      columns?.forEach(col => {
        console.log(`      - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
    }
  } catch (err) {
    console.log('   ⚠️  Could not verify structure:', err.message);
  }

  // Step 5: Test insert with new structure
  console.log('\n🧪 Testing invoice insert with new structure...');
  try {
    const testInvoice = {
      invoice_number: 'TEST-' + Date.now(),
      issue_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      company_info: {
        name: 'ITWala Academy',
        email: 'billing@itwalaacademy.com',
        address: '123 Test St',
        city: 'Test City',
        zipCode: '12345',
        country: 'India',
        phone: '+91 9876543210',
        GSTIN: 'TEST123456789'
      },
      client_info: {
        name: 'Test Client',
        email: 'client@test.com',
        address: '456 Client St',
        city: 'Client City',
        zipCode: '67890',
        country: 'India',
        phone: '+91 9876543211'
      },
      items: [
        {
          id: '1',
          description: 'Test Course',
          quantity: 1,
          rate: 1000,
          amount: 1000
        }
      ],
      subtotal: 1000,
      tax: 180,
      tax_rate: 18,
      total: 1180,
      notes: 'Test invoice for schema validation',
      terms: 'Payment due in 30 days'
    };

    const { data: insertedInvoice, error: insertError } = await supabase
      .from('invoices')
      .insert([testInvoice])
      .select()
      .single();

    if (insertError) {
      console.log('   ❌ Test insert failed:', insertError.message);
      allSuccess = false;
    } else {
      console.log('   ✅ Test insert successful!');
      console.log(`   📋 Test invoice ID: ${insertedInvoice.id}`);
      
      // Clean up test data
      await supabase
        .from('invoices')
        .delete()
        .eq('id', insertedInvoice.id);
      console.log('   🧹 Test data cleaned up');
    }
  } catch (err) {
    console.log('   ❌ Test insert failed:', err.message);
    allSuccess = false;
  }

  if (allSuccess) {
    console.log('\n🎉 Invoice schema update completed successfully!');
    console.log('✅ The invoices table now supports the current application structure.');
    console.log('🔄 You can now save draft invoices without errors.');
  } else {
    console.log('\n⚠️  Some operations failed. Please run the SQL commands manually.');
  }

  return allSuccess;
}

// Run the schema update
updateInvoicesSchema()
  .then((success) => {
    if (success) {
      console.log('\n✨ Schema update completed successfully!');
    } else {
      console.log('\n💥 Schema update completed with warnings. Check the logs above.');
    }
    process.exit(success ? 0 : 1);
  })
  .catch((error) => {
    console.error('\n💥 Schema update failed:', error.message);
    process.exit(1);
  });