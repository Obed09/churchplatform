-- Add optional image support for announcement templates
-- Run once in Supabase SQL Editor
-- This script is safe to run multiple times.

-- Ensure table exists first (fixes: relation "announcements" does not exist)
CREATE TABLE IF NOT EXISTS public.announcements (
	id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	title TEXT NOT NULL,
	content TEXT NOT NULL,
	priority TEXT DEFAULT 'normal',
	start_date DATE,
	end_date DATE,
	is_active BOOLEAN DEFAULT TRUE,
	created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add image column for template cards
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Optional metadata for non-image template files
ALTER TABLE public.announcements
ADD COLUMN IF NOT EXISTS asset_name TEXT,
ADD COLUMN IF NOT EXISTS asset_type TEXT;

-- Keep RLS aligned with current project mode (open anon access)
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_policies
		WHERE schemaname = 'public'
		  AND tablename = 'announcements'
		  AND policyname = 'Allow all announcements operations'
	) THEN
		CREATE POLICY "Allow all announcements operations"
		ON public.announcements
		FOR ALL
		USING (true)
		WITH CHECK (true);
	END IF;
END $$;
