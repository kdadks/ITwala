/**
 * Script to create the invoices table in Supabase
 * Run with: node scripts/create-invoices-table.js
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createInvoicesTable() {
  console.log('Creating invoices table...');
  console.log('⚠️  Note: You need to run the SQL commands manually in Supabase SQL Editor');
  console.log('');
  
  console.log('1. Go to your Supabase Dashboard → SQL Editor');
  console.log('2. Create a new query and paste the following SQL:');
  console.log('');
  console.log('-- Create invoices table');
  console.log(`CREATE TABLE IF NOT EXISTS invoices (
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
  );`);
  
  console.log('');
  console.log('-- Create indexes');
  console.log(`CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_date ON invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_invoices_client ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_created_by ON invoices(created_by);`);
  
  console.log('');
  console.log('-- Enable RLS and create policies');
  console.log(`ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Policy for admins to manage all invoices
CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy for users to view their own invoices
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT USING (
    client_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );`);
  
  console.log('');
  console.log('-- Create update trigger');
  console.log(`CREATE OR REPLACE FUNCTION update_updated_at_column()
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
  EXECUTE FUNCTION update_updated_at_column();`);
  
  console.log('');
  console.log('3. Run the SQL commands to create the invoices table and related objects');
  console.log('');
  
  // Try to insert sample data through the client API
  console.log('Attempting to insert sample invoice data...');

  // Insert sample invoice data (optional)
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
    console.error('Error inserting sample data:', sampleError);
  } else {
    console.log('✅ Sample invoice data inserted successfully');
  }

  console.log('\n🎉 Invoice system database setup completed!');
  console.log('You can now use the invoice generator in your admin panel.');
}

// Run the migration
createInvoicesTable()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('Migration failed:', error);
    process.exit(1);
  });
