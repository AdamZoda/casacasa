-- =================================================================
-- POINTS OF INTEREST - SQL FINAL ET COMPLET POUR SUPABASE
-- =================================================================
-- COPIE-COLLE CE CODE ENTIER DANS SUPABASE SQL EDITOR
-- EXÉCUTE EN UNE SEULE COMMANDE - NE DIVISE PAS EN PLUSIEURS!
-- =================================================================

DROP TABLE IF EXISTS public.points_of_interest CASCADE;

CREATE TABLE public.points_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('toilettes', 'parking', 'restaurant', 'shop', 'other')),
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

CREATE INDEX idx_poi_visible ON public.points_of_interest(visible);
CREATE INDEX idx_poi_type ON public.points_of_interest(type);
CREATE INDEX idx_poi_coords ON public.points_of_interest(latitude, longitude);

ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read policy"
  ON public.points_of_interest
  FOR SELECT
  USING (visible = true);

CREATE POLICY "Admin write policy"
  ON public.points_of_interest
  FOR ALL
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

INSERT INTO public.points_of_interest (name, description, latitude, longitude, type, visible) VALUES
('Toilettes Centre Casablanca', 'Qualtéité haute', 33.5731, -7.5898, 'toilettes', true),
('Parking Marché Médina', 'Parking souterrain', 33.5745, -7.6112, 'parking', true),
('Restaurant Dar Cherifa', 'Marocain traditionnel', 33.5689, -7.5935, 'restaurant', true),
('Boutique Artisanale Fes', 'Tapis et artisanat', 34.0637, -5.0058, 'shop', true),
('Toilettes Île Cité', 'Paris centre', 48.8530, 2.3499, 'toilettes', true),
('Parking Colosseum', 'Rome', 41.8902, 12.4924, 'parking', true),
('Restaurant La Bella', 'Italien', 41.9028, 12.4964, 'restaurant', true),
('Boutique Uffizi', 'Florence souvenirs', 43.7696, 11.2558, 'shop', true),
('Toilettes Tokyo', 'Modernes', 35.6762, 139.7674, 'toilettes', true),
('Parking Marina', 'Singapour', 1.2854, 103.8565, 'parking', true),
('Restaurant Bangkok', 'Cuisine Thaï', 13.7563, 100.5018, 'restaurant', true),
('Boutique Bazaar', 'Chiang Mai', 18.7883, 98.9853, 'shop', true),
('Toilettes Times', 'New York', 40.7580, -73.9855, 'toilettes', true),
('Parking LA', 'Los Angeles', 34.0522, -118.2437, 'parking', true),
('Restaurant Elote', 'Mexicain', 25.7617, -97.3964, 'restaurant', true),
('Boutique Mexico', 'Artisanat', 25.6866, -100.3161, 'shop', true),
('Toilettes Victoria', 'Zimbabwe', -17.9250, 25.8383, 'toilettes', true),
('Parking Kruger', 'Afrique du Sud', -24.0084, 31.5944, 'parking', true),
('Restaurant Nil', 'Égypte', 30.0444, 31.2357, 'restaurant', true),
('Boutique Caire', 'Souvenirs', 30.0626, 31.2588, 'shop', true),
('Toilettes Sydney', 'Opera House', -33.8568, 151.2153, 'toilettes', true),
('Parking Cairns', 'Australie', -16.2859, 145.7781, 'parking', true),
('Restaurant Wine', 'Sydney gastro', -33.8688, 151.2093, 'restaurant', true),
('Boutique Art', 'Aborigène', -33.8688, 151.2093, 'shop', true);

SELECT COUNT(*) as total_pois_created FROM public.points_of_interest;
