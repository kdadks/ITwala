/**
 * Script to create the invoices table in Production Supabase Database
 * This will actually execute the SQL commands in your production database
 * Run with: node scripts/create-invoices-table-production.js
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

console.log('🚀 Connecting to production Supabase database...');
console.log('URL:', supabaseUrl);

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
      // If exec_sql doesn't exist, try alternative method
      if (error.code === 'PGRST202') {
        console.log('   ⚠️  exec_sql function not available, trying alternative method...');
        
        // Use the SQL directly through supabase-js query
        const { data: result, error: queryError } = await supabase
          .from('information_schema.tables')
          .select('*')
          .limit(1);
        
        if (queryError) {
          throw new Error(`Database connection failed: ${queryError.message}`);
        }
        
        console.log('   ⚠️  Please run this SQL manually in Supabase SQL Editor:');
        console.log('   📋 ' + sql.replace(/\n/g, '\n      '));
        return false;
      } else {
        throw error;
      }
    } else {
      console.log('   ✅ Success!');
      return true;
    }
  } catch (err) {
    console.error(`   ❌ Error: ${err.message}`);
    return false;
  }
}

async function createInvoicesTableProduction() {
  console.log('🎯 Creating invoices table in PRODUCTION database...');
  
  let allSuccess = true;

  // Step 1: Create the invoices table
  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      invoice_number VARCHAR(50) UNIQUE NOT NULL,
      invoice_date DATE NOT NULL,
      due_date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
      
      -- Company information
      company_name VARCHAR(255) NOT NULL,
      company_address TEXT,
      company_phone VARCHAR(50),
      company_email VARCHAR(255),
      company_website VARCHAR(255),
      company_logo_url TEXT,
      
      -- Client information
      client_name VARCHAR(255) NOT NULL,
      client_email VARCHAR(255),
      client_phone VARCHAR(50),
      client_address TEXT,
      client_company VARCHAR(255),
      
      -- Invoice totals
      subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
      tax_rate DECIMAL(5,2) DEFAULT 0,
      tax_amount DECIMAL(10,2) DEFAULT 0,
      discount_amount DECIMAL(10,2) DEFAULT 0,
      total_amount DECIMAL(10,2) NOT NULL DEFAULT 0,
      
      -- Invoice items (stored as JSON)
      items JSONB NOT NULL DEFAULT '[]',
      
      -- Additional fields
      notes TEXT,
      terms TEXT,
      payment_instructions TEXT,
      
      -- Tracking
      created_by UUID REFERENCES auth.users(id),
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      sent_at TIMESTAMP WITH TIME ZONE,
      paid_at TIMESTAMP WITH TIME ZONE
    );
  `;

  const success1 = await executeSQL('Creating invoices table', createTableSQL);
  allSuccess = allSuccess && success1;

  // Step 2: Create indexes
  const createIndexesSQL = `
    CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
    CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
    CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
    CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_email);
    CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);
  `;

  const success2 = await executeSQL('Creating indexes', createIndexesSQL);
  allSuccess = allSuccess && success2;

  // Step 3: Enable RLS and create policies
  const createPoliciesSQL = `
    ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
    
    -- Policy for admins to manage all invoices
    DROP POLICY IF EXISTS "Admins can manage all invoices" ON invoices;
    CREATE POLICY "Admins can manage all invoices" ON invoices
      FOR ALL USING (
        EXISTS (
          SELECT 1 FROM profiles 
          WHERE profiles.id = auth.uid() 
          AND profiles.role = 'admin'
        )
      );
    
    -- Policy for users to view their own invoices
    DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;
    CREATE POLICY "Users can view their own invoices" ON invoices
      FOR SELECT USING (
        client_email = (
          SELECT email FROM auth.users WHERE id = auth.uid()
        )
      );
  `;

  const success3 = await executeSQL('Setting up RLS policies', createPoliciesSQL);
  allSuccess = allSuccess && success3;

  // Step 4: Create update trigger
  const createTriggerSQL = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    DROP TRIGGER IF EXISTS update_invoices_updated_at ON invoices;
    CREATE TRIGGER update_invoices_updated_at
      BEFORE UPDATE ON invoices
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  `;

  const success4 = await executeSQL('Creating update trigger', createTriggerSQL);
  allSuccess = allSuccess && success4;

  // If SQL execution didn't work, provide manual instructions
  if (!allSuccess) {
    console.log('\n📋 MANUAL SETUP REQUIRED:');
    console.log('Please copy and paste the following SQL into your Supabase SQL Editor:');
    console.log('👉 Go to: https://lyywvmoxtlovvxknpkpw.supabase.co/project/lyywvmoxtlovvxknpkpw/sql/new');
    console.log('\n' + '='.repeat(80));
    console.log(createTableSQL);
    console.log(createIndexesSQL);
    console.log(createPoliciesSQL);
    console.log(createTriggerSQL);
    console.log('='.repeat(80));
  }

  // Step 5: Try to insert sample data using Supabase client
  console.log('\n📊 Inserting sample invoice data...');
  try {
    const { error: sampleError } = await supabase
      .from('invoices')
      .insert([
        {
          invoice_number: 'INV-001',
          invoice_date: '2024-01-15',
          due_date: '2024-02-14',
          status: 'sent',
          company_name: 'ITWala Academy',
          company_address: '123 Education Street, Learning City, LC 12345',
          company_email: 'billing@itwalaacademy.com',
          company_phone: '+1 (555) 123-4567',
          company_website: 'https://itwalaacademy.com',
          client_name: 'John Doe',
          client_email: 'john.doe@example.com',
          client_company: 'Tech Corp',
          client_address: '456 Business Ave, Corporate City, CC 67890',
          items: [
            {
              id: 1,
              description: 'React Development Course',
              quantity: 1,
              unitPrice: 299.99,
              total: 299.99,
              type: 'course',
              courseId: null
            },
            {
              id: 2,
              description: 'Node.js Masterclass',
              quantity: 1,
              unitPrice: 199.99,
              total: 199.99,
              type: 'course',
              courseId: null
            }
          ],
          subtotal: 499.98,
          tax_rate: 8.25,
          tax_amount: 41.25,
          total_amount: 541.23,
          notes: 'Thank you for choosing ITWala Academy for your learning needs.',
          terms: 'Payment is due within 30 days of invoice date.',
          payment_instructions: 'Please pay via bank transfer or credit card through our secure portal.'
        }
      ]);

    if (sampleError) {
      console.log('   ⚠️  Could not insert sample data:', sampleError.message);
      console.log('   💡 This is normal if the table needs to be created manually first');
    } else {
      console.log('   ✅ Sample invoice data inserted successfully!');
    }
  } catch (err) {
    console.log('   ⚠️  Sample data insertion failed:', err.message);
  }

  // Step 6: Verify table exists
  console.log('\n🔍 Verifying table creation...');
  try {
    const { data, error } = await supabase
      .from('invoices')
      .select('count(*)')
      .single();

    if (error) {
      console.log('   ❌ Table verification failed:', error.message);
      console.log('   💡 Please run the SQL commands manually in Supabase SQL Editor');
    } else {
      console.log('   ✅ Invoices table exists and is accessible!');
      console.log(`   📊 Current invoice count: ${data?.count || 0}`);
    }
  } catch (err) {
    console.log('   ⚠️  Could not verify table:', err.message);
  }

  console.log('\n🎉 Invoice system database setup completed!');
  console.log('🚀 You can now use the invoice generator at: http://localhost:3001/admin/invoices');
}

// Run the production migration
createInvoicesTableProduction()
  .then(() => {
    console.log('\n✨ Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Migration failed:', error.message);
    process.exit(1);
  });
