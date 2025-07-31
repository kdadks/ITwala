-- Add missing columns to user_sessions table

-- Add device_type column
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS device_type TEXT;

-- Add browser column  
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS browser TEXT;

-- Add country column
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS country TEXT;

-- Add updated_at column
ALTER TABLE user_sessions ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now());
