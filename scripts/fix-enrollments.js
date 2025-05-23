const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Create Supabase client with service role key
const supabase = createClient(
  'https://lyywvmoxtlovvxknpkpw.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx5eXd2bW94dGxvdnZ4a25wa3B3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NzQ0MDM2MSwiZXhwIjoyMDYzMDE2MzYxfQ.QhrRDFxDayb5SbXhC_cOB-ONuRe-VpZQkguM1IOQapw',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function fixEnrollments() {
  try {
    console.log('Fixing enrollments table...');

    // Step 1: Backup existing data
    console.log('1. Backing up existing enrollments...');
    const { data: existingEnrollments, error: backupError } = await supabase
      .from('enrollments')
      .select('*');
    
    if (backupError) {
      console.log('No existing enrollments found or table does not exist');
    } else {
      console.log(`Found ${existingEnrollments.length} existing enrollments`);
    }

    // Step 2: Execute the SQL migration
    console.log('2. Applying table changes...');
    
    const response = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/rpc/execute_sql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
      },
      body: JSON.stringify({
        query: `
      -- First drop the existing table
      DROP TABLE IF EXISTS enrollments;

      -- Create the new enrollments table
      CREATE TABLE enrollments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
        course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
        enrolled_at TIMESTAMPTZ DEFAULT now(),
        status TEXT DEFAULT 'active',
        progress INTEGER DEFAULT 0,
        created_at TIMESTAMPTZ DEFAULT now(),
        updated_at TIMESTAMPTZ DEFAULT now(),
        UNIQUE(user_id, course_id)
      );

      -- Enable RLS
      ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

      -- Create policies
      CREATE POLICY "Users can view their own enrollments" 
        ON enrollments FOR SELECT 
        USING (auth.uid() = user_id);

      CREATE POLICY "Users can insert their own enrollments" 
        ON enrollments FOR INSERT 
        WITH CHECK (auth.uid() = user_id);

      CREATE POLICY "Users can update their own enrollments" 
        ON enrollments FOR UPDATE 
        USING (auth.uid() = user_id);

      CREATE POLICY "Admins can view all enrollments" 
        ON enrollments FOR SELECT
        USING (EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
      ));

      CREATE POLICY "Admins can manage all enrollments" 
        ON enrollments FOR ALL
        USING (EXISTS (
          SELECT 1 FROM profiles
          WHERE profiles.id = auth.uid()
          AND profiles.role = 'admin'
      ));
    `
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to execute SQL: ${await response.text()}`);
    }

    // Step 3: Restore data if we had a backup
    if (existingEnrollments && existingEnrollments.length > 0) {
      console.log('3. Restoring enrollment data...');
      for (const enrollment of existingEnrollments) {
        const { error: insertError } = await supabase
          .from('enrollments')
          .insert({
            ...enrollment,
            // Ensure user_id references a profile
            user_id: enrollment.user_id
          });
        
        if (insertError) {
          console.error('Error restoring enrollment:', insertError);
        }
      }
    }

    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Error:', error);
  }
}

fixEnrollments();
