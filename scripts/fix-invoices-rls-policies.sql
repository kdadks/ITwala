-- Fix Invoice Table RLS Policies
-- This SQL fixes the permission issues with the invoices table

-- First, drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can manage all invoices" ON invoices;
DROP POLICY IF EXISTS "Users can view their own invoices" ON invoices;

-- Create correct policies that work with your database structure
-- Policy for admins to manage all invoices
CREATE POLICY "Admins can manage all invoices" ON invoices
  FOR ALL 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Policy for users to view invoices where they are the client
CREATE POLICY "Users can view their own invoices" ON invoices
  FOR SELECT 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.email = invoices.client_email
    )
  );

-- Grant basic permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON invoices TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

-- Create a function to check if user is admin (helpful for debugging)
CREATE OR REPLACE FUNCTION is_user_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Test the function and policies
SELECT 'Policy test completed. You can now test the invoice system.' as status;
