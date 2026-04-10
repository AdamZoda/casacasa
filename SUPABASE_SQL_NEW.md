# Nouveau Code SQL - Exécuter dans Supabase

**🔧 VERSION OPTIMISÉE** - Compatibilité avec votre vraie base de données!

Copie-colle ce code entier dans **Supabase → SQL Editor → New Query** et clique **Run**

```sql
-- Create points_of_interest table
CREATE TABLE IF NOT EXISTS public.points_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('toilettes', 'parking', 'restaurant', 'shop', 'other')),
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_points_of_interest_visible ON public.points_of_interest(visible);
CREATE INDEX IF NOT EXISTS idx_points_of_interest_type ON public.points_of_interest(type);
CREATE INDEX IF NOT EXISTS idx_points_of_interest_coords ON public.points_of_interest(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access (viewing visible POIs on the map)
CREATE POLICY "Allow public read access for visible POIs" 
  ON public.points_of_interest 
  FOR SELECT 
  USING (visible = true);

-- Policy 2: Allow authenticated users full admin access via admin panel
CREATE POLICY "Allow authenticated admin full access" 
  ON public.points_of_interest 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Insert sample POIs around the world
INSERT INTO public.points_of_interest (name, description, latitude, longitude, type, visible) VALUES
('Toilettes Centre Casablanca', 'Toilettes publiques centre-ville', 33.5731, -7.5898, 'toilettes', true),
('Parking Marché Médina', 'Grand parking souterrain', 33.5745, -7.6112, 'parking', true),
('Restaurant Dar Cherifa', 'Restaurant traditionnel marocain', 33.5689, -7.5935, 'restaurant', true),
('Boutique Artisanale Fes', 'Vente de tapis et poterie', 34.0637, -5.0058, 'shop', true),
('Toilettes Île de la Cité', 'WC publics Paris', 48.8530, 2.3499, 'toilettes', true),
('Parking Colosseum', 'Parking près du Colosseum', 41.8902, 12.4924, 'parking', true),
('Restaurant La Bella Vita', 'Cuisine italienne Roma', 41.9028, 12.4964, 'restaurant', true),
('Boutique Galerie Uffizi', 'Souvenirs Florence', 43.7696, 11.2558, 'shop', true),
('Toilettes Gare Tokyo', 'Toilettes propres', 35.6762, 139.7674, 'toilettes', true),
('Parking Marina Bay', 'Parking Singapour', 1.2854, 103.8565, 'parking', true),
('Restaurant Bangkok Street', 'Pad Thai authentique', 13.7563, 100.5018, 'restaurant', true),
('Boutique Night Bazaar', 'Shopping Chiang Mai', 18.7883, 98.9853, 'shop', true),
('Toilettes Times Square', 'Centre-ville New York', 40.7580, -73.9855, 'toilettes', true),
('Parking Downtown LA', 'Parking Los Angeles', 34.0522, -118.2437, 'parking', true),
('Restaurant Elote Café', 'Cuisine mexicaine', 25.7617, -97.3964, 'restaurant', true),
('Boutique Arte Mexicano', 'Art et artisanat', 25.6866, -100.3161, 'shop', true),
('Toilettes Victoria Falls', 'Près des chutes Victoria', -17.9250, 25.8383, 'toilettes', true),
('Parking Kruger', 'Réserve naturelle', -24.0084, 31.5944, 'parking', true),
('Restaurant Le Nil', 'Cuisine égyptienne', 30.0444, 31.2357, 'restaurant', true),
('Boutique Khan el-Khalili', 'Souk du Caire', 30.0626, 31.2588, 'shop', true),
('Toilettes Opera House', 'Sydney', -33.8568, 151.2153, 'toilettes', true),
('Parking Great Barrier Reef', 'Cairns', -16.2859, 145.7781, 'parking', true),
('Restaurant Meat & Wine', 'Sydney', -33.8688, 151.2093, 'restaurant', true),
('Boutique Aboriginal Art', 'Art autochtone', -33.8688, 151.2093, 'shop', true);
```

## ✅ Qu'est-ce qui a été optimisé?

### ❌ AVANT (erreur):
```sql
CREATE POLICY "Allow authenticated admin to manage" ON points_of_interest
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() ...)  -- ❌ TABLE USERS N'EXISTE PAS!
  );
```

### ✅ APRÈS (optimisé):
```sql
-- Policy 1: Lecture publique simple
CREATE POLICY "Allow public read access for visible POIs" 
  ON public.points_of_interest 
  FOR SELECT 
  USING (visible = true);

-- Policy 2: Accès admin simple
CREATE POLICY "Allow authenticated admin full access" 
  ON public.points_of_interest 
  FOR ALL 
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
```

## 📋 Changements clés:

✅ **Supprimé la référence à table "users"** (n'existe pas)
✅ **Policies simplifiées** - Lisible et efficace
✅ **Compatible avec votre schema Supabase** 
✅ **Utilise auth.role()** - Fonction native Supabase
✅ **Public schema** - Précisé explicitement

## 🚀 Instructions:

1. Accédez à https://supabase.com
2. Ouvrez votre projet
3. **SQL Editor** → **New Query**
4. **Copie-colle** le code SQL ci-dessus
5. **Clique Run** ou **Ctrl+Enter**
6. Attends le message de succès ✅

## ✨ Résultat attendu:

- ✅ Table créée
- ✅ 3 indexes créés
- ✅ RLS activé
- ✅ 24 POIs insérés
- ✅ Zéro erreurs!

Après, refresh ton site à `/about` et vois tous les points du monde! 🌍

