-- Create profiles table if it doesn't exist
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

-- Create admin user if not exists
DO $$
DECLARE
  new_user_id UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'admin@itwala.com') THEN
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      raw_app_meta_data,
      aud,
      role
    )
    VALUES (
      gen_random_uuid(),
      'admin@itwala.com',
      crypt('Admin@123', gen_salt('bf')),
      now(),
      '{"provider": "email"}',
      '{"provider": "email", "providers": ["email"]}',
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO new_user_id;

    -- Create profile for the admin user
    INSERT INTO profiles (id, full_name, role)
    VALUES (new_user_id, 'Admin User', 'admin'::user_role);
  END IF;
END $$;

-- Add role and email columns if they don't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user',
ADD COLUMN IF NOT EXISTS email TEXT;

-- Update admin profile
UPDATE public.profiles 
SET role = 'admin', 
    full_name = 'Admin User' 
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'admin@itwala.com'
);

-- Ensure row level security (RLS) is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admin can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admin can update all profiles" ON public.profiles;

-- Create default profile access policies
CREATE POLICY "Users can view their own profile"
ON public.profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Create admin-specific policies
CREATE POLICY "Admin can view all profiles"
ON public.profiles FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin can update all profiles"
ON public.profiles FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
