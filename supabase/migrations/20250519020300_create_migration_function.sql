-- This function allows applying SQL migrations through RPC
CREATE OR REPLACE FUNCTION apply_migration(sql text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  EXECUTE sql;
END;
$$;
