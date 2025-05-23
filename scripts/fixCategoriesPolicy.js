const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Required environment variables are missing');
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

async function fixCategoriesPolicy() {
  try {
    console.log('Applying categories policy fix...');

    // Drop existing policies
    await supabase.query(`
      DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
      DROP POLICY IF EXISTS "Categories are editable by admins" ON categories;
    `);

    // Create new SELECT policy
    await supabase.query(`
      CREATE POLICY "Categories are viewable by everyone" 
      ON categories FOR SELECT 
      USING (true);
    `);

    // Create new ALL policy for admins
    await supabase.query(`
      CREATE POLICY "Categories are editable by admins" 
      ON categories FOR ALL 
      USING (
        EXISTS (
          SELECT 1 FROM auth.users
          JOIN profiles ON profiles.id = auth.uid()
          WHERE 
            (profiles.role = 'admin' OR 
             auth.users.raw_user_meta_data->>'role' = 'admin' OR
             auth.users.email = 'admin@itwala.com')
        )
      );
    `);

    console.log('Categories policy has been updated successfully');
    console.log('Please sign out and sign back in to apply the new permissions');

  } catch (error) {
    console.error('Error fixing categories policy:', error.message);
    process.exit(1);
  }
}

fixCategoriesPolicy();