-- Migration: Add labeled contact emails to site_settings
-- Purpose: Allow admins to manage multiple contact emails with a role/purpose label

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS contact_emails JSONB DEFAULT '[]'::jsonb;

-- Optional index if you later query the JSON structure in SQL.
-- CREATE INDEX IF NOT EXISTS idx_site_settings_contact_emails ON site_settings USING GIN (contact_emails);

