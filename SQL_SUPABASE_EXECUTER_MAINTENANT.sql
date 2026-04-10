-- ============================================
-- POINTS OF INTEREST - SETUP COMPLET CORRIGÉ
-- ============================================
-- ⚠️ EXÉCUTE CE SCRIPT EN ENTIER D'UN COUP dans Supabase SQL Editor
-- NE divise PAS en plusieurs requêtes!

-- Step 1: Supprimer la table si elle existe
DROP TABLE IF EXISTS public.points_of_interest CASCADE;

-- Step 2: Créer la table
CREATE TABLE public.points_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('toilettes', 'parking', 'restaurant', 'shop', 'other')),
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW())
);

-- Step 3: Créer les indexes
CREATE INDEX idx_poi_visible ON public.points_of_interest(visible);
CREATE INDEX idx_poi_type ON public.points_of_interest(type);
CREATE INDEX idx_poi_coords ON public.points_of_interest(latitude, longitude);

-- Step 4: Activer Row Level Security
ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;

-- Step 5: Policy 1 - Lecture publique (visible = true)
CREATE POLICY "Enable read access for all users"
  ON public.points_of_interest
  FOR SELECT
  USING (visible = true);

-- Step 6: Policy 2 - Accès complet pour utilisateurs authentifiés
-- ✅ FIX: Utilise auth.uid() au lieu de auth.role()
CREATE POLICY "Enable full access for authenticated users"
  ON public.points_of_interest
  FOR ALL
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

-- Step 7: Insérer les 24 POIs de démonstration
INSERT INTO public.points_of_interest (name, description, latitude, longitude, type, visible) VALUES
-- ===== MAROC (4 POIs) =====
('Toilettes Centre Casablanca', 'Toilettes publiques haute qualité', 33.5731, -7.5898, 'toilettes', true),
('Parking Marché Médina', 'Grand parking souterrain', 33.5745, -7.6112, 'parking', true),
('Restaurant Dar Cherifa', 'Cuisine marocaine authentique', 33.5689, -7.5935, 'restaurant', true),
('Boutique Artisanale Fes', 'Tapis et poterie', 34.0637, -5.0058, 'shop', true),

-- ===== EUROPE (4 POIs) =====
('Toilettes Île de la Cité', 'Près Notre-Dame Paris', 48.8530, 2.3499, 'toilettes', true),
('Parking Colosseum Roma', 'Sécurisé et couvert', 41.8902, 12.4924, 'parking', true),
('Restaurant La Bella Vita', 'Cuisine italienne Roma', 41.9028, 12.4964, 'restaurant', true),
('Boutique Galerie Uffizi', 'Souvenirs Florence', 43.7696, 11.2558, 'shop', true),

-- ===== ASIE (4 POIs) =====
('Toilettes Gare Tokyo', 'Propres et modernes', 35.6762, 139.7674, 'toilettes', true),
('Parking Marina Bay', 'Climatisé Singapour', 1.2854, 103.8565, 'parking', true),
('Restaurant Bangkok Street', 'Thai authentique', 13.7563, 100.5018, 'restaurant', true),
('Boutique Night Bazaar', 'Shopping Chiang Mai', 18.7883, 98.9853, 'shop', true),

-- ===== AMÉRIQUE (4 POIs) =====
('Toilettes Times Square', 'NYC centre-ville', 40.7580, -73.9855, 'toilettes', true),
('Parking Downtown LA', 'Los Angeles', 34.0522, -118.2437, 'parking', true),
('Restaurant Elote Café', 'Mexique authentique', 25.7617, -97.3964, 'restaurant', true),
('Boutique Arte Mexicano', 'Art mexicain', 25.6866, -100.3161, 'shop', true),

-- ===== AFRIQUE (4 POIs) =====
('Toilettes Victoria Falls', 'Chutes Victoria', -17.9250, 25.8383, 'toilettes', true),
('Parking Kruger Reserve', 'Réserve naturelle', -24.0084, 31.5944, 'parking', true),
('Restaurant Le Nil', 'Égyptienne Le Caire', 30.0444, 31.2357, 'restaurant', true),
('Boutique Khan el-Khalili', 'Souk du Caire', 30.0626, 31.2588, 'shop', true),

-- ===== OCÉANIE (4 POIs) =====
('Toilettes Opera House', 'Sydney', -33.8568, 151.2153, 'toilettes', true),
('Parking Great Barrier Reef', 'Cairns', -16.2859, 145.7781, 'parking', true),
('Restaurant Meat & Wine', 'Sydney gastro', -33.8688, 151.2093, 'restaurant', true),
('Boutique Aboriginal Art', 'Art aborigène', -33.8688, 151.2093, 'shop', true);

-- ✅ Vérification: Doit afficher 24 POIs
SELECT COUNT(*) as total_pois, 
       COUNT(CASE WHEN type = 'toilettes' THEN 1 END) as toilettes_count,
       COUNT(CASE WHEN type = 'parking' THEN 1 END) as parking_count,
       COUNT(CASE WHEN type = 'restaurant' THEN 1 END) as restaurant_count,
       COUNT(CASE WHEN type = 'shop' THEN 1 END) as shop_count
FROM public.points_of_interest;
