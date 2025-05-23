const dotenv = require('dotenv');
dotenv.config();

console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('Service Role Key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('Service Role Key:', process.env.SUPABASE_SERVICE_ROLE_KEY);
