/**
 * Test script to verify current user has admin access
 * Run with: node scripts/test-admin-access.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAdminAccess() {
  console.log('🔍 Testing admin access for invoice system...\n');

  try {
    // 1. First, try to sign in as admin
    console.log('1. Signing in as admin...');
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });

    if (signInError) {
      console.error('❌ Sign in failed:', signInError.message);
      return;
    }

    console.log('✅ Signed in successfully');
    console.log('User ID:', signInData.user.id);
    console.log('User email:', signInData.user.email);
    console.log('User metadata:', signInData.user.user_metadata);

    // 2. Check profile
    console.log('\n2. Checking user profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', signInData.user.id)
      .single();

    if (profileError) {
      console.error('❌ Profile check failed:', profileError.message);
      return;
    }

    console.log('✅ Profile found:');
    console.log('- ID:', profile.id);
    console.log('- Email:', profile.email);
    console.log('- Role:', profile.role);
    console.log('- Full Name:', profile.full_name);

    // 3. Test invoices table access
    console.log('\n3. Testing invoices table access...');
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('count(*)')
      .single();

    if (invoicesError) {
      console.error('❌ Invoices access failed:', invoicesError.message);
      console.log('\n💡 You need to run the RLS policy fix:');
      console.log('1. Go to Supabase SQL Editor');
      console.log('2. Run the contents of scripts/fix-invoices-rls-policies.sql');
      return;
    }

    console.log('✅ Invoices table accessible');
    console.log('Current invoice count:', invoices.count || 0);

    // 4. Test invoice creation (insert)
    console.log('\n4. Testing invoice creation...');
    const testInvoice = {
      invoice_number: 'TEST-' + Date.now(),
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: 'draft',
      company_name: 'ITWala Academy',
      company_email: 'test@itwalaacademy.com',
      client_name: 'Test Client',
      client_email: 'testclient@example.com',
      items: [
        {
          id: 1,
          description: 'Test Course',
          quantity: 1,
          unitPrice: 100,
          total: 100,
          type: 'course'
        }
      ],
      subtotal: 100,
      tax_rate: 0,
      tax_amount: 0,
      total_amount: 100,
      notes: 'Test invoice for system verification'
    };

    const { data: newInvoice, error: createError } = await supabase
      .from('invoices')
      .insert(testInvoice)
      .select()
      .single();

    if (createError) {
      console.error('❌ Invoice creation failed:', createError.message);
      return;
    }

    console.log('✅ Invoice created successfully');
    console.log('Test invoice ID:', newInvoice.id);

    // 5. Clean up test invoice
    console.log('\n5. Cleaning up test invoice...');
    const { error: deleteError } = await supabase
      .from('invoices')
      .delete()
      .eq('id', newInvoice.id);

    if (deleteError) {
      console.log('⚠️  Could not delete test invoice:', deleteError.message);
    } else {
      console.log('✅ Test invoice cleaned up');
    }

    console.log('\n🎉 All tests passed! Invoice system is ready to use.');
    console.log('🚀 You can now access: http://localhost:3001/admin/invoices');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminAccess()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });
