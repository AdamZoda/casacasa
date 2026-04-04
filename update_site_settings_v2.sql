-- Ajout des colonnes pour la gestion dynamique du RIB
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS bank_name TEXT DEFAULT '';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS bank_beneficiary TEXT DEFAULT 'COMANE EXCELLENCE SARL';
ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS bank_rib TEXT DEFAULT '';
