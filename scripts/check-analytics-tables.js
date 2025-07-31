const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  }
);

async function checkAnalyticsTables() {
  try {
    console.log('🔍 Checking analytics tables...');
    
    // Check page_views table
    console.log('\n1. Checking page_views table...');
    const { data: pageViewsData, error: pageViewsError } = await supabase
      .from('page_views')
      .select('count')
      .limit(1);
    
    if (pageViewsError) {
      console.log('❌ page_views table error:', pageViewsError.message);
    } else {
      console.log('✅ page_views table exists');
    }
    
    // Check user_sessions table
    console.log('\n2. Checking user_sessions table...');
    const { data: sessionsData, error: sessionsError } = await supabase
      .from('user_sessions')
      .select('count')
      .limit(1);
    
    if (sessionsError) {
      console.log('❌ user_sessions table error:', sessionsError.message);
      
      if (sessionsError.message.includes('does not exist')) {
        console.log('\n🔧 Creating user_sessions table...');
        
        // Create the table
        const { error: createError } = await supabase.rpc('exec', {
          sql: `
            -- Create user_sessions table for tracking unique visitors
            CREATE TABLE IF NOT EXISTS user_sessions (
              id SERIAL PRIMARY KEY,
              session_id TEXT UNIQUE NOT NULL,
              user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
              user_agent TEXT,
              first_page TEXT,
              last_page TEXT,
              total_pages INTEGER DEFAULT 1,
              country TEXT,
              device_type TEXT,
              browser TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now())
            );

            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON user_sessions(session_id);
            CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);

            -- Enable RLS
            ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

            -- Create policies
            CREATE POLICY "Anyone can insert user_sessions" ON user_sessions FOR INSERT WITH CHECK (true);
            CREATE POLICY "Anyone can update user_sessions" ON user_sessions FOR UPDATE USING (true);
            CREATE POLICY "Admin can view user_sessions" ON user_sessions FOR SELECT TO authenticated USING (
              EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
              )
            );
          `
        });
        
        if (createError) {
          console.log('❌ Error creating user_sessions table:', createError);
        } else {
          console.log('✅ user_sessions table created successfully');
        }
      }
    } else {
      console.log('✅ user_sessions table exists');
    }
    
    console.log('\n📊 Analytics setup complete!');
    
  } catch (error) {
    console.error('❌ Error checking analytics tables:', error);
  }
}

checkAnalyticsTables();
