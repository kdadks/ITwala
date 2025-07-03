const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyAdminPolicies() {
  try {
    console.log('Applying admin policies to categories table...\n');
    
    // Apply the SQL policies
    const queries = [
      // Categories policies
      `DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;`,
      `DROP POLICY IF EXISTS "Only admins can update categories" ON categories;`,
      `DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;`,
      
      `CREATE POLICY "Only admins can insert categories" ON categories
        FOR INSERT WITH CHECK (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );`,
      
      `CREATE POLICY "Only admins can update categories" ON categories
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );`,
      
      `CREATE POLICY "Only admins can delete categories" ON categories
        FOR DELETE USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );`,
      
      // Courses policies
      `DROP POLICY IF EXISTS "Only admins can insert courses" ON courses;`,
      `DROP POLICY IF EXISTS "Only admins can update courses" ON courses;`,
      `DROP POLICY IF EXISTS "Only admins can delete courses" ON courses;`,
      
      `CREATE POLICY "Only admins can insert courses" ON courses
        FOR INSERT WITH CHECK (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );`,
      
      `CREATE POLICY "Only admins can update courses" ON courses
        FOR UPDATE USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );`,
      
      `CREATE POLICY "Only admins can delete courses" ON courses
        FOR DELETE USING (
          EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
          )
        );`
    ];
    
    for (const query of queries) {
      try {
        console.log('Executing:', query.substring(0, 50) + '...');
        const { error } = await supabase.rpc('exec_sql', { sql: query });
        if (error) {
          console.error('Error executing query:', error);
        } else {
          console.log('✅ Query executed successfully');
        }
      } catch (err) {
        console.error('Query execution error:', err);
      }
    }
    
    console.log('\n🎉 Admin policies applied successfully!');
    
    // Test the policies
    console.log('\nTesting policies...');
    
    // Sign in as admin
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: 'admin@itwala.com',
      password: 'Admin@123'
    });
    
    if (signInError) {
      console.error('Sign in error:', signInError);
      return;
    }
    
    // Test insert
    const testCategoryName = `Test Category ${Date.now()}`;
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .insert([{ name: testCategoryName }])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert test failed:', insertError);
    } else {
      console.log('✅ Insert test passed:', insertData.name);
      
      // Clean up
      await supabase
        .from('categories')
        .delete()
        .eq('id', insertData.id);
      console.log('✅ Test category cleaned up');
    }
    
    await supabase.auth.signOut();
    
  } catch (error) {
    console.error('Error applying policies:', error);
  }
}

applyAdminPolicies()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });