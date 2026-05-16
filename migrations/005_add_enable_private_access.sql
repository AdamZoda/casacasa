-- Migration: Add enable_private_access boolean to site_settings
-- Purpose: allow toggling the 'Accès Privilège' feature from settings

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS enable_private_access boolean DEFAULT true;

-- Optionally, set to false to disable the feature by default for existing sites:
-- UPDATE site_settings SET enable_private_access = false WHERE id = 1;

