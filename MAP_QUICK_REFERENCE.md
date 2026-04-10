# Map System Quick Reference

## Map Display on About Page (`/about`)

The map is displayed in the "Découvrez les points d'intérêt" (Discover Points of Interest) section.

### Features:
- **Large Interactive Map**: Shows all visible POIs with emoji markers
- **Filter Buttons**: Click to filter by type (Toilettes, Parking, Restaurant, Boutique, Autre)
- **POI List**: Shows filtered results with count for each type
- **Selection**: Click a marker or list item to highlight the POI
- **Details Panel**: Shows name, description, and link to Google Maps

### Map Behavior:
- Clicking a marker opens a popup with POI name and description
- Re-clicking shows the details panel on the right
- Filters update both the markers and the list
- Counts show `0` until POIs are added via admin

## Admin Interface (`/admin/points-of-interest`)

Access via: **Navigation Menu** → **Carte & Localités** OR directly at `/admin/points-of-interest`

### Adding a New POI

1. **Fill the Form**:
   - **Nom**: POI name (required)
   - **Description**: Details about the location (optional)
   - **Coordonnées**: Enter coordinates as "latitude, longitude"
     - Example: `33.5731, -7.5898`
     - The system extracts lat/lng automatically
   - **Type**: Choose from dropdown:
     - 🚻 Toilettes
     - 🅿️ Parking
     - 🍽️ Restaurant
     - 🛍️ Boutique (Shop)
     - 📍 Autre (Other)

2. **Map Preview**: Shows all POIs including ones being added/edited

3. **Submit**: Click "Ajouter le point" (Add Point)

4. **Feedback**: 
   - Success: "Point d'intérêt ajouté avec succès" with green checkmark
   - Error: Shows error message in red

### Editing a POI

1. Click on a POI in the list
2. Form fills with current data
3. Make changes
4. Click "Mettre à jour le point" (Update Point)

### Deleting a POI

1. Click the **trash icon** next to the POI in the list
2. POI is removed immediately
3. Map updates automatically

### Toggling Visibility

1. Click the **eye icon** next to the POI in the list
2. Changes the `visible` flag
3. Visible POIs appear on public map
4. Hidden POIs only show in admin list

## Coordinate Extraction

The system automatically parses coordinates from common formats:

**Supported Formats**:
```
33.5731, -7.5898          ✅
33.5731,-7.5898           ✅
33.5731 , -7.5898         ✅
(33.5731, -7.5898)        ❌ (parentheses not supported)
N 33.5731 W 7.5898        ❌ (non-decimal not supported)
```

**Extraction Regex**: `/(-?\d+\.?\d+),\s*(-?\d+\.?\d+)/`

## Troubleshooting

### Map Not Showing on About Page
1. Check browser console (F12)
2. Look for error message from Supabase (404)
3. If 404: Supabase table not created - run SQL migration
4. If no error: Leaflet CSS might not be loading

### Can't Access Admin Interface
1. Check if you're logged in (look for user icon)
2. Verify you have admin access to `/admin` pages
3. URL should be: `http://localhost:3000/admin/points-of-interest`

### POIs Don't Appear on Map
1. Check visibility toggle (eye icon shows if visible)
2. Check filter - make sure "Tous" (All) is selected
3. Check browser console for fetch errors
4. Refresh the page (Ctrl+R or Cmd+R)

### Coordinates Not Extracting
1. Try entering as: `33.5731, -7.5898` (with space after comma)
2. Verify you're using decimal format
3. Check that latitude is between -90 and 90
4. Check that longitude is between -180 and 180

## Default Coordinates

The map centers on this location by default:
- **Latitude**: 33.5731
- **Longitude**: -7.5898
- **Location**: Casablanca, Morocco
- **Zoom Level**: 12

## Keyboard Shortcuts (On Map)

- **+/−**: Zoom in/out
- **Arrow Keys**: Pan the map (on some browsers)
- **Double Click**: Zoom in to that point

## Performance Notes

- Map loads quickly even with many POIs
- Filtering is instant (client-side)
- New POIs appear on map immediately after adding
- Editing updates the map in real-time

## POI Type Guidelines

Choose the most appropriate type:

- **🚻 Toilettes**: Public restrooms
- **🅿️ Parking**: Parking lots and spaces
- **🍽️ Restaurant**: Food establishments
- **🛍️ Boutique**: Retail shops and stores
- **📍 Autre**: Everything else

## System Limits

- POI names: No character limit (but keep it short)
- Description: Can be long (supports multiple lines)
- Coordinates: Must be valid decimal degrees
- Types: Fixed 5 options (cannot add more without code changes)

## Browser Compatibility

The map works in:
- Chrome/Chromium ✅
- Firefox ✅
- Safari ✅
- Edge ✅

**Minimum Requirements**: 
- HTML5 support
- JavaScript enabled
- Modern browser (2015+)

## Data Privacy

- **Visible POIs**: Public (anyone can see on About page)
- **Hidden POIs**: Only visible to admins in admin interface
- **All Data**: Stored in Supabase PostgreSQL with encryption

## Caching

- Map doesn't cache (always fetches latest)
- Browser might cache tiles (Leaflet handles this)
- Filter changes are instant client-side
- New POIs appear immediately after adding

## API Endpoints Used

**Public API** (Read-only):
- `GET /rest/v1/points_of_interest?visible=eq.true`

**Admin API** (Full access):
- `GET /rest/v1/points_of_interest` (read all)
- `POST /rest/v1/points_of_interest` (create)
- `PATCH /rest/v1/points_of_interest?id=eq.UUID` (update)
- `DELETE /rest/v1/points_of_interest?id=eq.UUID` (delete)

**All requests authenticated** via Supabase Auth
