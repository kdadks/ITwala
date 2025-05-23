const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

const config = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  SUPABASE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ADMIN_EMAIL: 'admin@itwala.com'
};

async function testRestAPI() {
  try {
    // Test 1: List users
    console.log('1. Testing auth API...');
    const usersResponse = await fetch(`${config.SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.SUPABASE_KEY}`,
        'apikey': config.SUPABASE_KEY
      }
    });

    console.log('Users response status:', usersResponse.status);
    const users = await usersResponse.json();
    console.log('Users data:', users);

  } catch (error) {
    console.error('Test failed:', error);
  }
}

testRestAPI();
