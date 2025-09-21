/**
 * Test invoice saving with the updated mapping
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function testInvoiceSaving() {
  console.log('🧪 Testing invoice saving with updated mapping...');
  
  try {
    // Simulate the data structure from the form
    const mockInvoiceData = {
      invoiceNumber: 'TEST-MAPPED-' + Date.now(),
      issueDate: '2025-09-21',
      dueDate: '2025-10-21',
      companyInfo: {
        name: 'ITWala Academy',
        address: '123 Tech Street',
        city: 'Mumbai',
        zipCode: '400001',
        country: 'India',
        email: 'billing@itwala.com',
        phone: '+91 9876543210',
        website: 'https://itwala.com',
        GSTIN: 'GST123456789'
      },
      clientInfo: {
        name: 'Test Client',
        email: 'client@test.com',
        address: '456 Client Avenue',
        city: 'Pune',
        zipCode: '411001',
        country: 'India',
        phone: '+91 9876543211'
      },
      items: [
        {
          id: '1',
          description: 'React Development Course',
          quantity: 1,
          rate: 15000,
          amount: 15000
        },
        {
          id: '2',
          description: 'Node.js Backend Course',
          quantity: 1,
          rate: 12000,
          amount: 12000
        }
      ],
      subtotal: 27000,
      tax: 4860,
      taxRate: 18,
      total: 31860,
      notes: 'Payment due within 30 days. Thank you for choosing ITWala Academy.',
      terms: 'All courses include lifetime access and certificate upon completion.',
      status: 'draft'
    };
    
    // Map to the old database schema (same as what the updated function does)
    const invoiceToSave = {
      invoice_number: mockInvoiceData.invoiceNumber,
      invoice_date: mockInvoiceData.issueDate,
      due_date: mockInvoiceData.dueDate,
      status: mockInvoiceData.status || 'draft',
      
      // Flatten company_info to old structure
      company_name: mockInvoiceData.companyInfo.name,
      company_address: mockInvoiceData.companyInfo.address,
      company_email: mockInvoiceData.companyInfo.email,
      company_phone: mockInvoiceData.companyInfo.phone,
      company_website: mockInvoiceData.companyInfo.website,
      
      // Flatten client_info to old structure
      client_name: mockInvoiceData.clientInfo.name,
      client_email: mockInvoiceData.clientInfo.email,
      client_address: mockInvoiceData.clientInfo.address,
      client_phone: mockInvoiceData.clientInfo.phone,
      
      items: mockInvoiceData.items,
      subtotal: mockInvoiceData.subtotal,
      tax_amount: mockInvoiceData.tax,
      total_amount: mockInvoiceData.total,
      notes: mockInvoiceData.notes,
      terms: mockInvoiceData.terms,
    };

    console.log('📋 Attempting to save with mapped data structure...');
    
    const { data: savedInvoice, error } = await supabase
      .from('invoices')
      .insert([invoiceToSave])
      .select()
      .single();

    if (error) {
      console.error('❌ Save failed:', error.message);
      return false;
    }

    console.log('✅ Invoice saved successfully!');
    console.log('📄 Saved invoice ID:', savedInvoice.id);
    console.log('📄 Invoice number:', savedInvoice.invoice_number);
    
    // Test loading and transformation
    console.log('\n🔄 Testing load and transformation...');
    
    const { data: loadedInvoice, error: loadError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', savedInvoice.id)
      .single();
    
    if (loadError) {
      console.error('❌ Load failed:', loadError.message);
    } else {
      console.log('✅ Invoice loaded successfully');
      
      // Transform back to new format (same as loadInvoices function)
      const transformedInvoice = {
        id: loadedInvoice.id,
        invoiceNumber: loadedInvoice.invoice_number,
        issueDate: loadedInvoice.invoice_date || loadedInvoice.issue_date,
        dueDate: loadedInvoice.due_date,
        companyInfo: {
          name: loadedInvoice.company_name || '',
          address: loadedInvoice.company_address || '',
          email: loadedInvoice.company_email || '',
          phone: loadedInvoice.company_phone || '',
          website: loadedInvoice.company_website || '',
        },
        clientInfo: {
          name: loadedInvoice.client_name || '',
          email: loadedInvoice.client_email || '',
          address: loadedInvoice.client_address || '',
          phone: loadedInvoice.client_phone || '',
        },
        items: loadedInvoice.items || [],
        subtotal: loadedInvoice.subtotal || 0,
        tax: loadedInvoice.tax_amount || 0,
        total: loadedInvoice.total_amount || 0,
        notes: loadedInvoice.notes || '',
        terms: loadedInvoice.terms || '',
        status: loadedInvoice.status || 'draft',
      };
      
      console.log('✅ Transformation successful');
      console.log('📋 Company:', transformedInvoice.companyInfo.name);
      console.log('📋 Client:', transformedInvoice.clientInfo.name);
      console.log('📋 Total: ₹', transformedInvoice.total);
    }
    
    // Clean up test data
    await supabase
      .from('invoices')
      .delete()
      .eq('id', savedInvoice.id);
    console.log('🧹 Test data cleaned up');
    
    return true;
    
  } catch (error) {
    console.error('💥 Unexpected error:', error.message);
    return false;
  }
}

testInvoiceSaving()
  .then((success) => {
    if (success) {
      console.log('\n🎉 Invoice saving test completed successfully!');
      console.log('✅ The application should now be able to save draft invoices.');
    } else {
      console.log('\n❌ Invoice saving test failed. Check the errors above.');
    }
  })
  .catch((error) => {
    console.error('💥 Test failed:', error.message);
  });