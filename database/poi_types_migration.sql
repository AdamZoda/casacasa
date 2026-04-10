-- ============================================
-- POI TYPES SYSTEM - MIGRATION
-- ============================================
-- Execute this migration to set up dynamic POI types

-- Step 1: Create poi_types table
CREATE TABLE IF NOT EXISTS public.poi_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT UNIQUE,
  description TEXT DEFAULT '',
  emoji TEXT DEFAULT '📍',
  color TEXT DEFAULT '#E5A93A',
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::TEXT, NOW())
);

-- Step 2: Create indexes for poi_types
CREATE INDEX IF NOT EXISTS idx_poi_types_active ON public.poi_types(is_active);
CREATE INDEX IF NOT EXISTS idx_poi_types_sort ON public.poi_types(sort_order);
CREATE INDEX IF NOT EXISTS idx_poi_types_slug ON public.poi_types(slug);

-- Step 3: Enable RLS for poi_types
ALTER TABLE public.poi_types ENABLE ROW LEVEL SECURITY;

-- Step 4: RLS Policies for poi_types
DROP POLICY IF EXISTS "Enable read access for all users" ON public.poi_types;
DROP POLICY IF EXISTS "Enable full access for authenticated users" ON public.poi_types;

CREATE POLICY "Enable read access for all users" ON public.poi_types
  FOR SELECT USING (is_active = true);

CREATE POLICY "Enable full access for authenticated users" ON public.poi_types
  FOR ALL USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Step 5: Drop old type constraint and make nullable
ALTER TABLE public.points_of_interest
DROP CONSTRAINT IF EXISTS points_of_interest_type_check;

ALTER TABLE public.points_of_interest
ALTER COLUMN type DROP NOT NULL;

-- Step 6: Add type_id column to points_of_interest (if not already there)
ALTER TABLE public.points_of_interest 
ADD COLUMN IF NOT EXISTS type_id UUID;

-- Step 7: Create foreign key constraint
ALTER TABLE public.points_of_interest
DROP CONSTRAINT IF EXISTS fk_poi_type;

ALTER TABLE public.points_of_interest
ADD CONSTRAINT fk_poi_type FOREIGN KEY (type_id) 
REFERENCES public.poi_types(id) ON DELETE SET NULL;

-- Step 8: Create index for type_id
CREATE INDEX IF NOT EXISTS idx_poi_type_id ON public.points_of_interest(type_id);

-- Step 9: Logo uploads use the existing "media" bucket
-- The media bucket is already public and configured
-- Logos will be stored in: media/poi-logos/[typeId]-[timestamp]

-- No additional bucket creation needed!
