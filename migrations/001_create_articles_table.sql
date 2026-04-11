-- Migration: Create articles table and update activities table
-- Purpose: Add support for activity articles/sub-products

-- 1. Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id TEXT PRIMARY KEY,
  activity_id TEXT NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255),
  description TEXT,
  price_type VARCHAR(20) NOT NULL CHECK (price_type IN ('fixed', 'per_duration')),
  price DECIMAL(10, 2),
  duration_unit VARCHAR(20) CHECK (duration_unit IN ('day', 'night')),
  price_per_unit DECIMAL(10, 2),
  availability_count INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_articles_activity_id ON articles(activity_id);
CREATE INDEX IF NOT EXISTS idx_articles_price_type ON articles(price_type);

-- 3. Update activities table to support article mode
ALTER TABLE activities ADD COLUMN IF NOT EXISTS has_articles BOOLEAN DEFAULT FALSE;
ALTER TABLE activities ADD COLUMN IF NOT EXISTS article_display_type VARCHAR(20) DEFAULT 'direct' CHECK (article_display_type IN ('direct', 'articles_only'));

-- 4. Update reservations table to track articles
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS article_id TEXT REFERENCES articles(id);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS article_title VARCHAR(255);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS price_type VARCHAR(20);

-- 5. Create indexes on reservations for article joins
CREATE INDEX IF NOT EXISTS idx_reservations_article_id ON reservations(article_id);
CREATE INDEX IF NOT EXISTS idx_reservations_price_type ON reservations(price_type);

-- 6. Enable RLS (Row Level Security) on articles if needed
-- ALTER TABLE articles ENABLE ROW LEVEL SECURITY;

-- If you're using RLS, add policies:
-- CREATE POLICY "Allow public read articles" ON articles FOR SELECT USING (true);
-- CREATE POLICY "Allow admin manage articles" ON articles FOR ALL USING (auth.role() = 'authenticated');

-- Migration complete!
-- Next steps:
-- 1. Run this migration in Supabase SQL Editor
-- 2. No data loss - all new columns have defaults
-- 3. Test article creation in admin interface
