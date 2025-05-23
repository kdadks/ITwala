const fetch = require('node-fetch');

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
const SUPABASE_KEY = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('Using Supabase URL:', SUPABASE_URL);
console.log('Using service role key starting with:', SUPABASE_KEY.slice(0, 10) + '...');

async function executeSQL(query) {
  const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/execute_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'apikey': SUPABASE_KEY
    },
    body: JSON.stringify({ query })
  });

  if (!response.ok) {
    throw new Error(`Failed to execute SQL: ${await response.text()}`);
  }

  return await response.json();
}

async function fixEnrollments() {
  try {
    console.log('Applying enrollment fixes...');

    // Drop existing policies
    const dropPoliciesQuery = `
      DROP POLICY IF EXISTS "Users can view their own enrollments" ON enrollments;
      DROP POLICY IF EXISTS "Users can insert their own enrollments" ON enrollments;
      DROP POLICY IF EXISTS "Users can update their own enrollments" ON enrollments;
      DROP POLICY IF EXISTS "Admins can view all enrollments" ON enrollments;
      DROP POLICY IF EXISTS "Admins can manage all enrollments" ON enrollments;
    `;
    await executeSQL(dropPoliciesQuery);
    console.log('✓ Dropped existing policies');

    // Fix foreign key constraints
    const fkQuery = `
      ALTER TABLE enrollments 
      DROP CONSTRAINT IF EXISTS enrollments_user_id_fkey,
      ADD CONSTRAINT enrollments_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES profiles(id) 
        ON DELETE CASCADE;
    `;
    await executeSQL(fkQuery);
    console.log('✓ Fixed foreign key constraints');

    // Enable RLS and create policies
    const policiesQuery = `
      ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;

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
    `;
    await executeSQL(policiesQuery);
    console.log('✓ Created RLS policies');

    console.log('Successfully applied all fixes!');

  } catch (error) {
    console.error('Error applying fixes:', error);
    process.exit(1);
  }
}

fixEnrollments();
