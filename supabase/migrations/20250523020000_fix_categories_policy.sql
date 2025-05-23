-- Drop existing policies
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON categories;
DROP POLICY IF EXISTS "Categories are editable by admins" ON categories;

-- Recreate policies with improved admin check
CREATE POLICY "Categories are viewable by everyone" 
  ON categories FOR SELECT 
  USING (true);

CREATE POLICY "Categories are editable by admins" 
  ON categories FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      JOIN profiles ON profiles.id = auth.uid()
      WHERE 
        -- Check both profile role and user metadata
        (profiles.role = 'admin' OR 
         auth.users.raw_user_meta_data->>'role' = 'admin' OR
         auth.users.email = 'admin@itwala.com')
    )
  );