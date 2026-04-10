# Map System Debugging Guide

## Current Status

✅ **Frontend Code**: Fully implemented and compiling successfully
✅ **Map Component**: Rendering correctly with Leaflet
❌ **Supabase Table**: Missing - THIS IS THE BLOCKER

## Issue Diagnosis

### Error Message You're Seeing

```
404 (Not Found)
Error code: PGRST205
Message: "Could not find the table 'public.points_of_interest' in the schema cache"
```

### Root Cause

The **migration file exists locally** (`database/points_of_interest.sql`) but **was never executed** in your Supabase dashboard. The SQL migration must be manually run in Supabase's SQL Editor.

## Recent Fixes Applied

### 1. Fixed Corrupted Map.tsx Component
- **Issue**: File had duplicated/corrupted lines causing syntax errors
- **Fix**: Cleaned up the entire file with proper error handling
- **Added**: Console logging for debugging (`[MapView]` prefixed logs)

### 2. Enhanced Logging Throughout
- **Map.tsx**: Added debug logs for initialization, marker creation, and errors
- **MapSection.tsx**: Added logs for POI loading and filtering
- **poiDb.ts**: Added detailed logs for all Supabase operations with error codes

### 3. Improved Map Rendering
- **Change**: Map now renders even when there are no POIs
- **Benefit**: You'll see the empty map with a message overlay instead of blank space
- **UX**: Clearer feedback that the system is working

## How to Fix the Blocker

### Step 1: Access Supabase Dashboard
1. Go to https://supabase.com
2. Sign in with your account
3. Select your project (should be `casacasa-main`)

### Step 2: Open SQL Editor
1. In the left sidebar, find "SQL Editor"
2. Click "New Query" or "Create a new query"

### Step 3: Copy the Migration SQL
Open `database/points_of_interest.sql` from your project and copy the entire contents.

**File Location**: `database/points_of_interest.sql`

### Step 4: Paste and Execute
1. Paste the SQL code into the Supabase SQL Editor
2. Click "Run" button or press `Ctrl+Enter`
3. Wait for success message

### Expected SQL Contents

```sql
-- Create the points_of_interest table
CREATE TABLE IF NOT EXISTS public.points_of_interest (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  type TEXT CHECK (type IN ('toilettes', 'parking', 'restaurant', 'shop', 'other')) NOT NULL,
  visible BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('UTC'::text, NOW())
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS points_of_interest_visible_idx ON public.points_of_interest(visible);
CREATE INDEX IF NOT EXISTS points_of_interest_type_idx ON public.points_of_interest(type);
CREATE INDEX IF NOT EXISTS points_of_interest_coordinates_idx ON public.points_of_interest(latitude, longitude);

-- Enable RLS (Row Level Security)
ALTER TABLE public.points_of_interest ENABLE ROW LEVEL SECURITY;

-- Policy for public read (visible POIs only)
CREATE POLICY "Public read access for visible POIs"
  ON public.points_of_interest FOR SELECT
  USING (visible = TRUE);

-- Policy for authenticated users (full access)
CREATE POLICY "Authenticated full access"
  ON public.points_of_interest
  FOR ALL
  USING (auth.role() = 'authenticated');
```

## Debugging Console Logs

After the table is created, check your browser console (F12) to see these logs:

### When Map Loads Successfully:
```
[MapView] Initializing with POIs: []
[MapView] Creating Leaflet map instance...
[MapView] Map created successfully
[MapView] Adding 0 POI markers
```

### When POIs Load:
```
[MapSection] Component mounted, loading POIs...
[MapSection] loadPOIs() called
[POI DB] Fetching visible POIs from Supabase...
[POI DB] Successfully fetched 0 POIs
[MapSection] POIs loaded successfully, count: 0
```

### If There's an Error:
```
[POI DB] Error fetching POIs: Could not find the table 'public.points_of_interest' in the schema cache [PGRST205]
[POI DB] Full error details: {...}
```

## What Happens After Table Creation

### Immediately After:
1. Refresh your browser at `http://localhost:3000/about`
2. You should see the Leaflet map loaded (instead of blank)
3. Message: "Aucun point d'intérêt pour le moment" (No points of interest yet)
4. Console logs should show `[POI DB] Successfully fetched 0 POIs`

### Add Your First POI:
1. Go to `http://localhost:3000/admin/points-of-interest`
2. Fill in the form:
   - **Name**: e.g., "Public Toilet"
   - **Description**: e.g., "Second floor restroom"
   - **Coordinates**: e.g., "33.5731, -7.5898" (automatically extracts latitude and longitude)
   - **Type**: Select from "Toilettes", "Parking", "Restaurant", "Boutique", "Autre"
   - **Visible**: Toggle if needed (default is ON)
3. Click "Ajouter le point" (Add Point)
4. Success message should appear
5. POI appears in list and on map

### Test the Map:
1. Go back to About page
2. Click on map markers
3. Click filter buttons to test filtering
4. Click on POI in the list to select it on the map

## Checklist for Complete Setup

- [ ] Execute SQL migration in Supabase SQL Editor
- [ ] Verify no errors appear during SQL execution
- [ ] Refresh browser at `/about` page
- [ ] See maps loads (Leaflet tiles visible)
- [ ] Check browser console for `[POI DB] Successfully fetched` log
- [ ] Know the `/admin/points-of-interest` route works
- [ ] Add at least one test POI via admin interface
- [ ] See POI appear on map on About page
- [ ] Test filter buttons (Toilettes, Parking, etc.)
- [ ] Test clicking on POI markers

## If You Still See Errors

1. **404 Still Shows**: Supabase table not created - verify SQL was executed successfully
2. **Map Doesn't Load at All**: Check browser console for network errors
3. **Can't Add POIs**: Check if you're connected to Supabase with correct credentials
4. **Filters Not Working**: This is likely a display issue - data fetching should be the priority

## Map System Files

**Frontend Components**:
- `src/components/Map.tsx` - Leaflet map renderer (FIXED)
- `src/components/MapSection.tsx` - Public map view with filters (FIXED)
- `src/pages/admin/PointsOfInterestManager.tsx` - Admin interface for POI management

**Database Layer**:
- `src/lib/poiDb.ts` - Supabase CRUD operations (ENHANCED with logging)

**Database Migration**:
- `database/points_of_interest.sql` - Schema (NOT YET CREATED IN SUPABASE)

**Documentation**:
- `MAP_SYSTEM_README.md` - System overview
- `MAP_DEBUGGING_GUIDE.md` - This file

## Next Steps

1. **Critical**: Execute the SQL migration in Supabase
2. Add some test POIs via the admin interface
3. Check the About page to see them on the map
4. Test filtering by different types
5. Test the visibility toggle in the admin interface
6. Review filter counts update correctly

## Contact & References

- **Map Library**: Leaflet 1.9.4 (https://leafletjs.com/)
- **Tile Provider**: OpenStreetMap (https://www.openstreetmap.org/)
- **Database**: Supabase PostgreSQL (https://supabase.com/)
- **React Component Docs**: See `MAP_SYSTEM_README.md`
