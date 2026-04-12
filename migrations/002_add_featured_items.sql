-- Migration: Add featured/principal items feature
-- Purpose: Allow activities and articles to be marked as featured/principal
-- These will display on the home page with infinite scroll

-- 1. Add featured columns to activities table
ALTER TABLE activities ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS featured_display_type VARCHAR(50) DEFAULT 'card' CHECK (featured_display_type IN ('card', 'hero', 'grid', 'carousel'));

-- 2. Add featured columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_display_type VARCHAR(50) DEFAULT 'card' CHECK (featured_display_type IN ('card', 'hero', 'grid', 'carousel'));

-- 3. Create indexes for featured items (faster queries)
CREATE INDEX IF NOT EXISTS idx_activities_is_featured ON activities(is_featured, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_is_featured ON articles(is_featured, created_at DESC);

-- 4. Create a view for featured items (combines activities and articles)
DROP VIEW IF EXISTS featured_items CASCADE;

CREATE VIEW featured_items AS
SELECT 
  'activity' AS item_type,
  id,
  title,
  description,
  image AS image_url,
  featured_display_type,
  is_featured,
  created_at,
  price::TEXT AS price,
  NULL AS activity_id,
  NULL AS price_type
FROM activities
WHERE is_featured = TRUE

UNION ALL

SELECT 
  'article' AS item_type,
  id,
  title,
  description,
  image AS image_url,
  featured_display_type,
  is_featured,
  created_at,
  price::TEXT AS price,
  activity_id,
  price_type
FROM articles
WHERE is_featured = TRUE
ORDER BY created_at DESC;

-- 5. Create a table to track featured items categories/collections
CREATE TABLE IF NOT EXISTS featured_collections (
  id TEXT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  display_style VARCHAR(50) DEFAULT 'infinite_scroll' CHECK (display_style IN ('infinite_scroll', 'carousel', 'grid', 'hero')),
  max_items INT DEFAULT 10,
  sort_by VARCHAR(50) DEFAULT 'featured_order' CHECK (sort_by IN ('featured_order', 'created_at', 'price', 'popularity')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create a junction table to assign items to collections
CREATE TABLE IF NOT EXISTS featured_collection_items (
  id TEXT PRIMARY KEY,
  collection_id TEXT NOT NULL REFERENCES featured_collections(id) ON DELETE CASCADE,
  item_type VARCHAR(20) NOT NULL CHECK (item_type IN ('activity', 'article')),
  item_id TEXT NOT NULL,
  position INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(collection_id, item_type, item_id)
);

-- 7. Create indexes for collection queries
CREATE INDEX IF NOT EXISTS idx_featured_collections_display_style ON featured_collections(display_style);
CREATE INDEX IF NOT EXISTS idx_featured_collection_items_collection_id ON featured_collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_featured_collection_items_item_id ON featured_collection_items(item_id);
CREATE INDEX IF NOT EXISTS idx_featured_collection_items_position ON featured_collection_items(position);

-- 8. Add metadata column for additional styling options
ALTER TABLE activities ADD COLUMN IF NOT EXISTS featured_metadata JSONB DEFAULT '{}';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS featured_metadata JSONB DEFAULT '{}';

-- Example featured metadata structure:
-- {
--   "backgroundColor": "#FF6B6B",
--   "textColor": "#FFFFFF",
--   "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
--   "customIcon": "star",
--   "badge": "Premium",
--   "animationStyle": "fade-in-up"
-- }

-- 9. Query examples for your frontend:

-- Get all featured activities ordered by creation date (newest first)
-- SELECT * FROM activities WHERE is_featured = TRUE ORDER BY created_at DESC;

-- Get all featured articles ordered by creation date (newest first)
-- SELECT * FROM articles WHERE is_featured = TRUE ORDER BY created_at DESC;

-- Get all featured items (both activities and articles) via view
-- SELECT * FROM featured_items;

-- Migration complete!
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. Update your admin interface to set is_featured = TRUE on activities/articles
-- 3. Choose featured_display_type (card, hero, grid, carousel) based on your design
-- 4. Items are automatically ordered by creation date (newest first)
-- 5. Images are automatically used from the activity/article
