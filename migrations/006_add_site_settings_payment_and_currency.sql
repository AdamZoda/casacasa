-- Migration: add currency and payments_via_whatsapp_only to site_settings
BEGIN;

ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS currency VARCHAR(8) DEFAULT 'EUR',
  ADD COLUMN IF NOT EXISTS payments_via_whatsapp_only BOOLEAN DEFAULT false;

-- Set sensible defaults if not present
UPDATE site_settings SET currency = 'EUR' WHERE currency IS NULL;
UPDATE site_settings SET payments_via_whatsapp_only = false WHERE payments_via_whatsapp_only IS NULL;

COMMIT;

