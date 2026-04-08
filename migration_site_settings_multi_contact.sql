-- =============================================================================
-- site_settings : listes (plusieurs téléphones, plusieurs WhatsApp)
-- + rappel : social_links en JSON (tableaux par réseau, géré par l’app)
--
-- À exécuter dans Supabase → SQL Editor (une fois).
-- =============================================================================

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS phones jsonb NOT NULL DEFAULT '[]'::jsonb;

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS whatsapp_numbers jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Copie depuis phone / whatsapp_number si les nouveaux tableaux sont encore vides
UPDATE public.site_settings
SET
  phones = CASE
    WHEN jsonb_array_length(COALESCE(phones, '[]'::jsonb)) = 0
      AND COALESCE(trim(phone), '') <> ''
    THEN to_jsonb(ARRAY[trim(phone)])
    ELSE COALESCE(phones, '[]'::jsonb)
  END,
  whatsapp_numbers = CASE
    WHEN jsonb_array_length(COALESCE(whatsapp_numbers, '[]'::jsonb)) = 0
      AND COALESCE(trim(whatsapp_number), '') <> ''
    THEN to_jsonb(
      ARRAY[regexp_replace(trim(whatsapp_number), '\D', '', 'g')]
    )
    ELSE COALESCE(whatsapp_numbers, '[]'::jsonb)
  END
WHERE id = 1;

-- =============================================================================
-- social_links (jsonb existante) — format attendu après mise à jour du front :
-- {
--   "instagram": ["https://instagram.com/…", "https://…"],
--   "facebook":   ["https://facebook.com/…"],
--   "linkedin":   []
-- }
-- Aucune colonne SQL supplémentaire : migration éventuelle des anciennes chaînes
-- vers tableaux au premier enregistrement depuis l’admin (ou script manuel).
-- =============================================================================
