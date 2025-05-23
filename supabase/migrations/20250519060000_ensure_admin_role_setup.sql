-- Ensure proper role enum and admin access setup

-- 1. Create user_role enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('user', 'admin', 'instructor');
    END IF;
END $$;

-- 2. Ensure profiles table uses the enum
ALTER TABLE profiles 
ALTER COLUMN role TYPE user_role USING role::user_role;

-- 3. Ensure admin role policies are correct
DROP POLICY IF EXISTS "Admins have full access" ON profiles;
CREATE POLICY "Admins have full access"
  ON profiles FOR ALL
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'::user_role
  ));

-- 4. Create admin helper function
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
