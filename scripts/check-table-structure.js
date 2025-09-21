/**
 * Check current invoices table structure
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkTableStructure() {
  console.log('🔍 Checking invoices table structure...');
  
  try {
    // Try to query the table to see what columns are available
    const { data, error } = await supabase
      .from('invoices')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error querying invoices table:', error.message);
      return;
    }
    
    console.log('✅ Table query successful');
    
    if (data && data.length > 0) {
      console.log('📋 Sample record structure:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('📋 Table is empty, checking with sample insert...');
      
      // Try inserting with old structure
      const oldStructureTest = {
        invoice_number: 'TEST-OLD-' + Date.now(),
        invoice_date: '2025-09-21',
        due_date: '2025-10-21',
        status: 'draft',
        company_name: 'Test Company',
        company_email: 'test@company.com',
        client_name: 'Test Client',
        client_email: 'test@client.com',
        items: [{ id: '1', description: 'Test', quantity: 1, rate: 100, amount: 100 }],
        subtotal: 100,
        tax_amount: 18,
        total_amount: 118,
        notes: 'Old structure test'
      };
      
      console.log('\n🧪 Testing old structure insert...');
      const { data: oldResult, error: oldError } = await supabase
        .from('invoices')
        .insert([oldStructureTest])
        .select();
      
      if (oldError) {
        console.log('❌ Old structure failed:', oldError.message);
      } else {
        console.log('✅ Old structure works');
        if (oldResult && oldResult[0]) {
          await supabase.from('invoices').delete().eq('id', oldResult[0].id);
          console.log('🧹 Test record cleaned up');
        }
      }
      
      // Try inserting with new structure
      const newStructureTest = {
        invoice_number: 'TEST-NEW-' + Date.now(),
        issue_date: '2025-09-21',
        due_date: '2025-10-21',
        status: 'draft',
        company_info: { name: 'Test Company', email: 'test@company.com' },
        client_info: { name: 'Test Client', email: 'test@client.com' },
        items: [{ id: '1', description: 'Test', quantity: 1, rate: 100, amount: 100 }],
        subtotal: 100,
        tax: 18,
        total: 118,
        notes: 'New structure test'
      };
      
      console.log('\n🧪 Testing new structure insert...');
      const { data: newResult, error: newError } = await supabase
        .from('invoices')
        .insert([newStructureTest])
        .select();
      
      if (newError) {
        console.log('❌ New structure failed:', newError.message);
        console.log('💡 This confirms the schema needs updating');
      } else {
        console.log('✅ New structure works');
        if (newResult && newResult[0]) {
          await supabase.from('invoices').delete().eq('id', newResult[0].id);
          console.log('🧹 Test record cleaned up');
        }
      }
    }
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
  }
}

checkTableStructure();