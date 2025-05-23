-- Create admin profile if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'instructor');
    END IF;
END $$;

-- Update profiles table if it exists, or create it if it doesn't
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    role user_role DEFAULT 'user'::user_role,
    email TEXT,
    avatar_url TEXT,
    bio TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    phone TEXT
);

-- Create admin user if it doesn't exist
DO $$ 
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get first user from auth.users to make them admin
  SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    INSERT INTO profiles (id, full_name, role, created_at)
    VALUES (
      admin_user_id,
      'Admin User',
      'admin'::user_role,
      NOW()
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin'::user_role,
        full_name = 'Admin User';
  END IF;
END $$;
