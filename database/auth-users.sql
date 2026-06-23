-- AUTHORIZED USERS TABLE FOR ADMIN LOGIN
-- Run this once in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS authorized_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    access_level TEXT NOT NULL DEFAULT 'standard',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE authorized_users ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE schemaname = 'public'
          AND tablename = 'authorized_users'
          AND policyname = 'Allow all authorized users operations'
    ) THEN
        CREATE POLICY "Allow all authorized users operations"
        ON authorized_users
        FOR ALL
        USING (true)
        WITH CHECK (true);
    END IF;
END $$;

-- Optional seed account placeholder. You can add users from the new admin page instead.
-- INSERT INTO authorized_users (username, password_hash, full_name, role, department, access_level)
-- VALUES ('admin', '<SHA256_HASH>', 'Church Administrator', 'Administrator', 'admin', 'super_admin');
