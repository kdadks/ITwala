const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env.local file manually
const envPath = path.resolve(__dirname, '../.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

// Parse environment variables
envContent.split('\n').forEach(line => {
  if (line && !line.startsWith('#')) {
    const [key, value] = line.split('=');
    if (key && value) {
      envVars[key.trim()] = value.trim();
    }
  }
});

const SUPABASE_URL = envVars.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables:');
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!SUPABASE_URL);
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!SERVICE_ROLE_KEY);
  process.exit(1);
}

console.log('Using Supabase URL:', SUPABASE_URL);

// Create Supabase client with service role key
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function fixEnrollments() {
  try {
    console.log('Applying enrollment fixes...');

    // First verify we can connect with admin privileges
    const { data: testData, error: testError } = await supabase
      .from('profiles')
      .select('count');

    if (testError) {
      throw new Error(`Connection test failed: ${testError.message}`);
    }

    console.log('Connected successfully with admin privileges');

    // Drop existing policies to start fresh
    await supabase.rpc('execute_sql', {
      query: `
        DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Users can insert their own enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
        DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;
      `
    });

    // Update foreign key constraints
    await supabase.rpc('execute_sql', {
      query: `
        -- Make sure the enrollments table uses profiles for foreign key
        ALTER TABLE enrollments 
        DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey,
        ADD CONSTRAINT enrollments_user_id_fkey 
          FOREIGN KEY (user_id) 
          REFERENCES profiles(id) 
          ON DELETE CASCADE;
      `
    });

    // Enable RLS and create policies
    await supabase.rpc('execute_sql', {
      query: `
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
    });

    console.log('Successfully applied all fixes!');

  } catch (error) {
    console.error('Error applying fixes:', error);
    process.exit(1);
  }
}

fixEnrollments();
