const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

async function testConnection() {
  console.log('Testing Supabase connection...');
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('Service Role Key (first 10 chars):', process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 10));

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

  try {
    const { data, error } = await supabase
      .from('categories')
      .select('count')
      .limit(1);

    if (error) throw error;
    console.log('Connection successful!');
    console.log('Test query result:', data);
  } catch (error) {
    console.error('Connection failed:', error.message);
  }
}

testConnection();
