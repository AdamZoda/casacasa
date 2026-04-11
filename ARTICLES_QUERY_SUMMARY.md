# Articles Query & Reservation Linking - Comprehensive Summary

## 1. DATABASE SCHEMA

### Articles Table (`articles`)
```sql
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id),
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  description TEXT,
  price_type VARCHAR(20) CHECK (price_type IN ('fixed', 'per_duration')),
  price DECIMAL(10, 2),  -- for fixed pricing
  duration_unit VARCHAR(20) CHECK (duration_unit IN ('day', 'night')),
  price_per_unit DECIMAL(10, 2),  -- for per_duration pricing
  availability_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Indexes:**
- `idx_articles_activity_id` (for filtering by activity)
- `idx_articles_price_type` (for price calculation logic)

### Reservations Table (Extended)
These columns were ADDED to the existing `reservations` table:
```sql
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS article_id TEXT REFERENCES articles(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS article_title VARCHAR(255);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS price_type VARCHAR(20);
```
**Indexes:**
- `idx_reservations_article_id` (for article lookups)
- `idx_reservations_price_type` (for price calculations)

---

## 2. TYPE DEFINITIONS

### Article Interface (`src/context/AppContext.tsx`)
```typescript
export interface Article {
  id: string;
  activityId: string;  // FK to activity
  title: string;
  image: string;
  description: string;
  priceType: 'fixed' | 'per_duration';
  price?: number;              // Fixed pricing
  durationUnit?: 'day' | 'night';
  pricePerUnit?: number;       // Per-duration pricing
  availabilityCount?: number;
}
```

### Reservation Interface (Extended) (`src/context/AppContext.tsx`)
```typescript
export interface Reservation {
  id: string;
  activity_id: string;
  activity_title: string;
  universe_id: string;
  date: string;
  end_date?: string;
  time: string;
  name: string;
  country?: string;
  phone_code?: string;
  phone?: string;
  email?: string;
  contact: string;
  people_count?: number;
  total_price?: number;
  receipt_base64?: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  channel: 'web' | 'whatsapp';
  message?: string;
  
  // ⚠️ ARTICLE LINKING (NEW FIELDS):
  article_id?: string;           // FK to articles table
  article_title?: string;        // Denormalized for display
  price_type?: 'fixed' | 'per_duration';
  
  created_at: string;
}
```

---

## 3. WHERE ARTICLES ARE BEING FETCHED

### A. Initial Load (AppContext)
**File:** [src/context/AppContext.tsx](src/context/AppContext.tsx#L450-L490)

```typescript
// Lines 450-490: Promise.all() loads all data on app startup
const [
  uRes,      // universes
  aRes,      // activities
  artRes,    // ARTICLES TABLE ← HERE
  pRes,      // products
  jRes,      // journal_posts
  rRes,      // reservations
  oRes,      // orders
  tRes,      // tickets
  tmRes,     // testimonials
  nsRes,     // newsletter_subscribers
] = await Promise.all([
  supabase.from('universes').select('*'),
  supabase.from('activities').select('*'),
  supabase.from('articles').select('*'),  // ← SIMPLE SELECT, NO JOIN
  // ... other tables
]);
```

**Query Structure:** 
- **Type:** Simple SELECT with NO JOIN
- **Full Query:** `SELECT * FROM articles`
- **Mapping:** Maps raw DB rows to Article[] with snake_case → camelCase conversion
- **Location:** Lines 466-489

```typescript
if (artRes.data?.length) {
  const mappedArticles = artRes.data.map((row: any) => ({
    id: row.id,
    activityId: row.activity_id,        // snake_case → camelCase
    title: row.title,
    image: row.image,
    description: row.description,
    priceType: row.price_type,
    price: row.price,
    durationUnit: row.duration_unit,
    pricePerUnit: row.price_per_unit,
    availabilityCount: row.availability_count,
  }));
  setArticles(mappedArticles);
}
```

---

### B. Get Articles by Activity ID
**File:** [src/context/AppContext.tsx](src/context/AppContext.tsx#L686)

```typescript
const getArticlesByActivityId = (activityId: string) => {
  return articles.filter((a) => a.activityId === activityId);
};
```

**Type:** In-memory filtering (NOT a database query)
**Used by:**
- [src/pages/ActivityArticles.tsx](src/pages/ActivityArticles.tsx#L13) - Display articles grid
- [src/pages/admin/ArticlesManager.tsx](src/pages/admin/ArticlesManager.tsx#L28) - Manage articles per activity
- [src/pages/Booking.tsx](src/pages/Booking.tsx#L32) - Optional, when switching activities

---

## 4. WHERE ARTICLES ARE DISPLAYED

### A. User Profile Page (Reservations Tab)
**File:** [src/pages/ProfilePage.tsx](src/pages/ProfilePage.tsx#L350-L390)

```typescript
// Lines 350-390
reservations.map((res) => {
  // 1. Find article by ID (if reservation has article_id)
  const article = res.article_id 
    ? articles.find((art: any) => art.id === res.article_id) 
    : null;
  
  // 2. Find associated activity
  const activity = activities.find((a: any) => a.id === res.activity_id);
  
  // 3. Use article image if available, else activity image
  const image = article?.image || activity?.image;
  
  // 4. Display article title if present
  return (
    <div key={res.id}>
      {/* Shows "📦 Article Réservé" vs "🎭 Expérience" */}
      <h3>{res.article_title ? `${res.activity_title} - ${res.article_title}` : res.activity_title}</h3>
    </div>
  );
});
```

**Query Pattern:** 
- Uses cached `articles` array from AppContext
- Uses `res.article_id` to look up article
- Falls back to `res.article_title` (denormalized) for display

---

### B. Admin Reservations Panel
**File:** [src/pages/admin/Reservations.tsx](src/pages/admin/Reservations.tsx#L54-L300+)

#### Overview Table (Lines 117-195)
```typescript
reservations.map(res => {
  const activity = activities.find(a => a.id === res.activity_id);
  // ... price calculation logic ...
  
  return (
    <tr key={res.id}>
      <td>
        {/* Show "📦 Article Réservé" badge */}
        {res.article_title && (
          <span className="block text-xs text-brand-gold">📦 {res.article_title}</span>
        )}
      </td>
    </tr>
  );
});
```

#### Detail Panel (Lines 250-330)
```typescript
{(() => {
  // 1. Fetch article by ID
  const article = selectedRes.article_id 
    ? articles.find((a: any) => a.id === selectedRes.article_id) 
    : null;
  
  // 2. Fetch activity
  const activity = activities.find((a: any) => a.id === selectedRes.activity_id);
  
  // 3. Display both images side-by-side if article exists
  if (article && activity) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {/* Activity Image */}
        <img src={activity.image} alt={activity.title} />
        
        {/* Article Image */}
        <img src={article.image} alt={article.title} />
      </div>
    );
  }
  
  // 4. Display article pricing info
  if (article) {
    return (
      <span>
        {article.priceType === 'fixed'
          ? `Prix fixe: ${article.price} DH`
          : `Tarif: ${article.pricePerUnit} DH/${article.durationUnit}`}
      </span>
    );
  }
})()}
```

**Query Pattern:** 
- Looks up `selectedRes.article_id` in cached `articles` array
- Displays article details from the `Article` object
- Price calculation differs based on `priceType`

---

### C. Booking Page
**File:** [src/pages/Booking.tsx](src/pages/Booking.tsx#L30-L390)

```typescript
// Line 32-36
const { universes, activities, articles, ..., getArticlesByActivityId } = useAppContext();
const universe = universes.find(u => u.id === universeId);
const activity = activities.find(a => a.id === activityId);
const article = articleId ? articles.find(ar => ar.id === articleId) : null;

// Lines 350-390: Display selected article/activity in booking widget
<h3>
  {article 
    ? `${activity.title} - ${article.title}` 
    : activity.title}
</h3>

{/* Price calculation differs by type */}
<span>
  {article
    ? article.priceType === 'fixed'
      ? `${article.price} DH`
      : `${article.pricePerUnit} DH/${article.durationUnit === 'night' ? 'nuit' : 'jour'}`
    : activity.price
  }
</span>

// Lines 265-275: Submit reservation with article data
addReservation({
  activity_id: activity.id,
  activity_title: activity.title,
  universe_id: universe.id,
  // ... other fields ...
  article_id: article?.id,            // ← FK to articles
  article_title: article?.title,      // ← Denormalized
  price_type: priceType,              // ← 'fixed' or 'per_duration'
});
```

---

## 5. HOW RESERVATIONS ARE LINKED TO ARTICLES

### A. Creating a Reservation with Article
**File:** [src/pages/Booking.tsx](src/pages/Booking.tsx#L265-L280)

```typescript
const handleFinalSubmit = (channel: 'web' | 'whatsapp') => {
  addReservation({
    activity_id: activity.id,           // Required
    activity_title: activity.title,     // Required
    universe_id: universe.id,           // Required
    date: format(formData.startDate!, 'yyyy-MM-dd'),  // Required
    end_date: format(formData.endDate!, 'yyyy-MM-dd'),
    time: formData.time,                // Required
    name: formData.name,                // Required
    contact: `${formData.phoneCode} ${formData.phone}`,  // Required
    message: formData.message,
    channel,                            // Required: 'web' | 'whatsapp'
    
    // ← ARTICLE LINKING:
    article_id: article?.id,            // Optional FK to articles(id)
    article_title: article?.title,      // Optional: Denormalized for quick access
    price_type: priceType,              // 'fixed' | 'per_duration'
    
    // ... person count, pricing, receipt, etc ...
  });
};
```

**Database Insert (via Supabase):**
```typescript
// src/context/AppContext.tsx, lines 519-525
const row = reservationInputToDbRow(data, id);
const { data: insertedData, error } = await supabase
  .from('reservations')
  .insert([row])
  .select()
  .single();
```

### B. Mapping to DB Columns
**File:** [src/lib/tableMappers.ts](src/lib/tableMappers.ts#L163-L190)

```typescript
export function reservationInputToDbRow(
  data: Omit<Reservation, 'id' | 'created_at' | 'status'>,
  id: string
): Record<string, unknown> {
  return {
    id,
    activity_id: data.activity_id || null,
    activity_title: data.activity_title || null,
    universe_id: data.universe_id || null,
    selected_date: data.date,
    selected_time: data.time,
    user_name: data.name,
    // ... other mappings ...
    
    // ⚠️ ARTICLE FIELDS NOT BEING MAPPED!
    // article_id, article_title, price_type are in the Reservation interface
    // but NOT mapped in reservationInputToDbRow!
    
    status: 'pending',
  };
}
```

**⚠️ CRITICAL ISSUE IDENTIFIED:**
The `reservationInputToDbRow` function does NOT map the article-related fields:
- `article_id` → `article_id` (column exists in DB but not mapped)
- `article_title` → `article_title` (column exists in DB but not mapped)
- `price_type` → `price_type` (column exists in DB but not mapped)

---

## 6. CURRENT QUERY STRUCTURE SUMMARY

| Operation | Query Type | Location | Details |
|-----------|-----------|----------|---------|
| **Load articles on startup** | SELECT * FROM articles | [AppContext.tsx:450-490](src/context/AppContext.tsx#L450-L490) | Full table load, no JOIN, simple in-memory filter |
| **Get articles for activity** | In-memory filter | [AppContext.tsx:686](src/context/AppContext.tsx#L686) | `articles.filter(a => a.activityId === id)` |
| **Get article in booking** | In-memory lookup | [Booking.tsx:35](src/pages/Booking.tsx#L35) | `articles.find(ar => ar.id === articleId)` |
| **Display article in profile** | In-memory lookup | [ProfilePage.tsx:356](src/pages/ProfilePage.tsx#L356) | `articles.find((art) => art.id === res.article_id)` |
| **Display article in admin** | In-memory lookup | [Reservations.tsx:255](src/pages/admin/Reservations.tsx#L255) | `articles.find((a) => a.id === selectedRes.article_id)` |
| **Link article to reservation** | INSERT with data | [Booking.tsx:267](src/pages/Booking.tsx#L267) | Creates reservation with `article_id`, `article_title`, `price_type` |
| **Retrieve reservation** | SELECT * FROM reservations | [AppContext.tsx:456](src/context/AppContext.tsx#L456) | Full load, ORDER BY created_at DESC |

---

## 7. POTENTIAL ISSUES & GAPS

### Issue 1: Article Data Not Persisted in Reservations
**Problem:** `reservationInputToDbRow()` doesn't map article fields to database columns

**Location:** [src/lib/tableMappers.ts](src/lib/tableMappers.ts#L163-L190)

**Current Code:**
```typescript
export function reservationInputToDbRow(data, id) {
  return {
    // ✓ Maps: activity_id, activity_title, universe_id, etc.
    // ✗ MISSING: article_id, article_title, price_type
    id,
    activity_id: data.activity_id || null,
    activity_title: data.activity_title || null,
    // ... but no mapping for article_id, article_title, price_type
  };
}
```

**Impact:** Article information is lost after page refresh. Only stored in activity_title denormally.

**Fix Needed:**
```typescript
export function reservationInputToDbRow(data, id) {
  return {
    // ... existing mappings ...
    article_id: data.article_id || null,         // ADD THIS
    article_title: data.article_title || null,   // ADD THIS
    price_type: data.price_type || null,         // ADD THIS
  };
}
```

### Issue 2: Article Data Not Mapped from DB Rows
**Problem:** `dbRowToReservation()` doesn't extract article fields from database

**Location:** [src/lib/tableMappers.ts](src/lib/tableMappers.ts#L195-L230)

**Current Code:**
```typescript
export function dbRowToReservation(row: ReservationRow): Reservation {
  return {
    // ✓ Maps: activity_id, activity_title, universe_id, etc.
    // ✗ MISSING: article_id, article_title, price_type
    id: String(row.id),
    activity_id: String(row.activity_id ?? ''),
    // ... but no extraction of article_id, article_title, price_type
    created_at: String(row.created_at ?? ''),
  };
}
```

**Impact:** Even if article data is stored in DB, it's ignored on retrieval.

**Fix Needed:**
```typescript
export function dbRowToReservation(row: ReservationRow): Reservation {
  return {
    // ... existing mappings ...
    article_id: row.article_id != null ? String(row.article_id) : undefined,    // ADD THIS
    article_title: row.article_title != null ? String(row.article_title) : undefined,  // ADD THIS
    price_type: (row.price_type as Reservation['price_type']) || undefined,     // ADD THIS
  };
}
```

---

## 8. COMPONENTS OVERVIEW

| Component | File | Purpose | Uses Articles? |
|-----------|------|---------|-----------------|
| ProfilePage (Reservations tab) | [src/pages/ProfilePage.tsx](src/pages/ProfilePage.tsx) | Show user's reservations | ✓ Looks up article by ID |
| Booking | [src/pages/Booking.tsx](src/pages/Booking.tsx) | Create reservation with optional article | ✓ Displays & submits with article |
| Reservations Admin | [src/pages/admin/Reservations.tsx](src/pages/admin/Reservations.tsx) | Manage all reservations | ✓ Shows article details in detail panel |
| ArticlesManager Admin | [src/pages/admin/ArticlesManager.tsx](src/pages/admin/ArticlesManager.tsx) | CRUD articles | ✓ Lists, creates, edits, deletes |
| ActivityArticles | [src/pages/ActivityArticles.tsx](src/pages/ActivityArticles.tsx) | Show articles for activity | ✓ Filters by activityId |
| ArticlesSection | [src/components/ArticlesSection.tsx](src/components/ArticlesSection.tsx) | Display article grid | ✓ Renders articles with images |

---

## 9. KEY OBSERVATIONS

1. **Architecture:** All articles are loaded into React state on app startup (no pagination)
2. **Lookup Pattern:** Articles are always looked up from cached array, not queried from DB
3. **Denormalization:** Article title is stored in reservations table for quick access
4. **Pricing Logic:** Differs between fixed and per_duration types, calculated client-side
5. **Foreign Key:** Uses `article_id` to reference articles, but NOT enforced in TypeScript mapping
6. **Data Flow:** Article data flows from DB → AppContext state → Components

---

## 10. QUICK REFERENCE TABLE

### Current State
```
┌─────────────────────────────────────────────────────────────┐
│                   ARTICLES DATA FLOW                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Supabase DB                                                │
│  ├─ articles table                                          │
│  │  └─ [id, activity_id, title, price_type, ...]           │
│  │                                                          │
│  └─ reservations table                                      │
│     └─ [id, activity_id, article_id, article_title, ...]   │
│                                                              │
│        ↓ SELECT * (no JOIN)                                 │
│                                                              │
│  AppContext (React State)                                   │
│  ├─ articles: Article[]     ← All articles in memory        │
│  └─ reservations: Res[]     ← All reservations in memory    │
│                                                              │
│        ↓ In-memory lookups                                  │
│                                                              │
│  Components                                                 │
│  ├─ ProfilePage        → articles.find(id)                  │
│  ├─ Booking            → articles.find(id)                  │
│  ├─ Reservations Admin → articles.find(id)                  │
│  └─ ArticlesManager    → getArticlesByActivityId()          │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 11. NEXT STEPS / RECOMMENDATIONS

1. **Fix Mapper Functions** - Add article_id, article_title, price_type to both functions
2. **Add Article History** - Consider storing article details at reservation time for historical accuracy
3. **Optimize Queries** - For large datasets, consider lazy-loading or client-side pagination
4. **Add Validation** - Ensure article_id references valid article before creating reservation
5. **Test Data Persistence** - Verify article data survives page refresh after creating reservation
