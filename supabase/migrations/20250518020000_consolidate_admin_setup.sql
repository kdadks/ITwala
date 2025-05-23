-- Ensure everything related to admin setup is in one place

-- Create user_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'instructor');
    END IF;
END $$;

-- Update profiles table to use enum
ALTER TABLE public.profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- Drop all admin-related policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
DROP POLICY IF EXISTS "Admins have full access" ON public.profiles;

-- Create new unified set of policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Admins have full access"
  ON public.profiles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p2
      WHERE p2.id = auth.uid()
      AND p2.role = 'admin'::user_role
    )
  );

-- Ensure admin user exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- First check if we already have an admin user
  IF NOT EXISTS (SELECT 1 FROM profiles WHERE role = 'admin'::user_role) THEN
    -- If no admin exists, get the first user from auth.users
    SELECT id INTO admin_user_id FROM auth.users LIMIT 1;
    
    IF admin_user_id IS NOT NULL THEN
      -- Update or insert admin profile
      INSERT INTO profiles (id, full_name, role, created_at)
      VALUES (
        admin_user_id,
        'Admin User',
        'admin'::user_role,
        NOW()
      )
      ON CONFLICT (id) DO UPDATE
      SET role = 'admin'::user_role,
          full_name = CASE 
            WHEN public.profiles.full_name IS NULL THEN 'Admin User'
            ELSE public.profiles.full_name
          END;
    END IF;
  END IF;
END $$;
