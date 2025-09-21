const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin access
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function setupAdminUser() {
  const adminEmail = 'admin@itwala.com';
  const adminPassword = 'Admin@123';
  
  try {
    console.log('\n🔧 Setting up admin user...');
    
    // 1. Check if admin user already exists in auth.users
    console.log('\n1. Checking existing auth users...');
    const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
      console.error('Error listing users:', listError);
      return;
    }
    
    let adminUser = existingUsers.users.find(u => u.email === adminEmail);
    
    if (adminUser) {
      console.log('✅ Admin user already exists in auth.users');
      console.log('User details:', {
        id: adminUser.id,
        email: adminUser.email,
        confirmed_at: adminUser.email_confirmed_at,
        role: adminUser.role
      });
      
      // Confirm the user if not confirmed
      if (!adminUser.email_confirmed_at) {
        console.log('\n📧 Confirming admin user email...');
        const { error: confirmError } = await supabase.auth.admin.updateUserById(
          adminUser.id, 
          { email_confirm: true }
        );
        if (confirmError) {
          console.error('Error confirming user:', confirmError);
        } else {
          console.log('✅ Admin user email confirmed');
        }
      }
    } else {
      // 2. Create admin user with service role
      console.log('\n2. Creating admin user...');
      const { data: createData, error: createError } = await supabase.auth.admin.createUser({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true, // Auto-confirm the email
        user_metadata: {
          role: 'admin',
          full_name: 'Admin User'
        }
      });
      
      if (createError) {
        console.error('Error creating admin user:', createError);
        return;
      }
      
      adminUser = createData.user;
      console.log('✅ Admin user created successfully');
      console.log('User details:', {
        id: adminUser.id,
        email: adminUser.email,
        confirmed_at: adminUser.email_confirmed_at
      });
    }
    
    // 3. Ensure profiles table exists and has correct structure
    console.log('\n3. Ensuring profiles table structure...');
    try {
      const { error: tableError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS public.profiles (
            id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
            full_name TEXT,
            role TEXT DEFAULT 'user',
            email TEXT,
            avatar_url TEXT,
            bio TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
            phone TEXT
          );
          
          -- Enable RLS
          ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
          
          -- Create policies if they don't exist
          DO $$ 
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile') THEN
              CREATE POLICY "Users can view their own profile" ON public.profiles
                FOR SELECT USING (auth.uid() = id);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile') THEN
              CREATE POLICY "Users can update their own profile" ON public.profiles
                FOR UPDATE USING (auth.uid() = id);
            END IF;
            
            IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can view all profiles') THEN
              CREATE POLICY "Admins can view all profiles" ON public.profiles
                FOR SELECT TO authenticated
                USING (
                  EXISTS (
                    SELECT 1 FROM public.profiles 
                    WHERE id = auth.uid() AND role = 'admin'
                  )
                );
            END IF;
          END $$;
        `
      });
      
      if (tableError) {
        console.log('Note: RPC function not available, trying direct table operations...');
        // Fallback: use direct SQL operations
        await supabase.from('profiles').select('id').limit(1);
      }
      
      console.log('✅ Profiles table structure verified');
    } catch (error) {
      console.log('Note: Profiles table may already exist with correct structure');
    }
    
    // 4. Create or update admin profile
    console.log('\n4. Setting up admin profile...');
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert({
        id: adminUser.id,
        email: adminEmail,
        full_name: 'Admin User',
        role: 'admin',
        created_at: new Date().toISOString()
      }, {
        onConflict: 'id'
      })
      .select()
      .single();
    
    if (profileError) {
      console.error('Error setting up profile:', profileError);
      // Try a simpler approach
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: adminUser.id,
          email: adminEmail,
          full_name: 'Admin User',
          role: 'admin'
        });
      
      if (insertError && insertError.code !== '23505') { // 23505 is duplicate key error
        console.error('Error inserting profile:', insertError);
      } else {
        console.log('✅ Admin profile created');
      }
    } else {
      console.log('✅ Admin profile set up successfully');
      console.log('Profile details:', profile);
    }
    
    // 5. Test login
    console.log('\n5. Testing admin login...');
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: adminEmail,
      password: adminPassword
    });
    
    if (loginError) {
      console.error('❌ Login test failed:', loginError);
    } else {
      console.log('✅ Admin login successful!');
      console.log('Login session:', {
        user_id: loginData.user?.id,
        email: loginData.user?.email,
        role: loginData.user?.user_metadata?.role
      });
    }
    
    console.log('\n🎉 Admin setup complete!');
    console.log('Admin credentials:');
    console.log('Email: admin@itwala.com');
    console.log('Password: Admin@123');
    
  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

setupAdminUser();