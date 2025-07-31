const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

async function clearSessionConflicts() {
  try {
    console.log('🔄 Clearing session conflicts...');
    
    // Sign out any existing sessions
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.log('Note: Error signing out (expected if no session):', error.message);
    } else {
      console.log('✅ Successfully cleared any existing sessions');
    }
    
    console.log('\n📋 Session cleanup complete');
    console.log('You can now try logging in again.');
    
  } catch (error) {
    console.error('❌ Error during session cleanup:', error.message);
  }
}

clearSessionConflicts();
