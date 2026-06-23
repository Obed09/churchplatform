-- Add optional image support for announcement templates
-- Run once in Supabase SQL Editor

ALTER TABLE announcements
ADD COLUMN IF NOT EXISTS image_url TEXT;
