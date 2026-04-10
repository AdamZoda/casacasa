-- ============================================
-- POI TYPES MANAGEMENT TABLE
-- ============================================
-- Crée un système de gestion des types de POI dynamiques avec logos

-- Step 1: Créer la table des types
CREATE TABLE IF NOT EXISTS public.poi_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  emoji TEXT,
  color TEXT DEFAULT '#E5A93A',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW())
);

-- Step 2: Ajouter une foreign key à points_of_interest
ALTER TABLE public.points_of_interest 
  ADD COLUMN type_id UUID REFERENCES public.poi_types(id) ON DELETE RESTRICT;

-- Step 3: Créer les indexes
CREATE INDEX idx_poi_types_active ON public.poi_types(is_active);
CREATE INDEX idx_poi_types_sort ON public.poi_types(sort_order);

-- Step 4: Activer RLS
ALTER TABLE public.poi_types ENABLE ROW LEVEL SECURITY;

-- Step 5: RLS Policies pour poi_types
-- Lecture publique des types actifs
CREATE POLICY "Public read active types"
  ON public.poi_types
  FOR SELECT
  USING (is_active = true);

-- Accès complet pour utilisateurs authentifiés
CREATE POLICY "Authenticated full access to types"
  ON public.poi_types
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Step 6: Insérer les 5 types par défaut (sans emojis, avec placeholders pour logos)
INSERT INTO public.poi_types (name, slug, description, emoji, sort_order) VALUES
  ('Toilettes', 'toilettes', 'Toilettes publiques et installations sanitaires', '🚻', 1),
  ('Parking', 'parking', 'Parkings et places de stationnement', '🅿️', 2),
  ('Restaurant', 'restaurant', 'Restaurants et cafés', '🍽️', 3),
  ('Boutique', 'shop', 'Commerces et boutiques', '🛍️', 4),
  ('Autre', 'other', 'Autres points d''intérêt', '📍', 5)
ON CONFLICT DO NOTHING;

-- Vérification
SELECT id, name, slug, emoji FROM public.poi_types ORDER BY sort_order;
