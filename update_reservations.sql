-- ==========================================
-- SCRIPT DE MIGRATION FORCEE POUR CASA PRIVILEGE
-- Objectif : Résoudre les erreurs 400 (Bad Request)
-- ==========================================

-- 1. On s'assure que toutes les NOUVELLES colonnes existent
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS country TEXT;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS phone_code TEXT;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS people_count INTEGER DEFAULT 1;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS total_price NUMERIC;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS receipt_base64 TEXT;
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'whatsapp';

-- 2. On renomme les anciennes colonnes SI elles existent encore au format camelCase
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='createdAt') THEN
    ALTER TABLE public.reservations RENAME COLUMN "createdAt" TO created_at;
  END IF;
  
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='activityId') THEN
    ALTER TABLE public.reservations RENAME COLUMN "activityId" TO activity_id;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='activityTitle') THEN
    ALTER TABLE public.reservations RENAME COLUMN "activityTitle" TO activity_title;
  END IF;

  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='reservations' AND column_name='universeId') THEN
    ALTER TABLE public.reservations RENAME COLUMN "universeId" TO universe_id;
  END IF;
END $$;

-- 3. On s'assure que created_at existe (si ni camelCase ni snake_case n'étaient là)
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 4. On s'assure que les colonnes de statut et canal existent
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending';
ALTER TABLE public.reservations ADD COLUMN IF NOT EXISTS channel TEXT DEFAULT 'whatsapp';
