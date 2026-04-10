-- Cleanup script: Remove default POI types
-- Exécutez ce script dans Supabase SQL Editor pour nettoyer les types par défaut

DELETE FROM public.poi_types 
WHERE name IN ('Toilettes', 'Parking', 'Restaurant', 'Boutique', 'Autre');
  