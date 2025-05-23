-- Enable the pgcrypto extension for UUID support
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create admin_execute_sql function with security definer
CREATE OR REPLACE FUNCTION admin_execute_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Only allow execution by service_role
  IF current_user = 'authenticator' AND current_setting('request.jwt.claim.role') = 'service_role' THEN
    EXECUTE sql_query;
  ELSE
    RAISE EXCEPTION 'Permission denied. Only service_role can execute this function.';
  END IF;
END;
$$;
