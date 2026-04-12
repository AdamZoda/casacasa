-- Migration: Add article hierarchy and reservability feature
-- Purpose: Allow articles to have child articles and be reservable
-- This enables creating article collections/packages with sub-articles

-- 1. Add new columns to articles table
ALTER TABLE articles ADD COLUMN IF NOT EXISTS content TEXT DEFAULT '';
ALTER TABLE articles ADD COLUMN IF NOT EXISTS parent_article_id TEXT REFERENCES articles(id) ON DELETE CASCADE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS is_reservable BOOLEAN DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS article_type VARCHAR(50) DEFAULT 'standalone' CHECK (article_type IN ('standalone', 'parent', 'child'));

-- 2. Create indexes for hierarchy queries
CREATE INDEX IF NOT EXISTS idx_articles_parent_id ON articles(parent_article_id);
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles(article_type);
CREATE INDEX IF NOT EXISTS idx_articles_parent_type ON articles(parent_article_id, article_type);

-- 3. Create a view for article hierarchy (get parent with child count)
CREATE OR REPLACE VIEW article_hierarchy AS
SELECT 
  a.id,
  a.title,
  a.description,
  a.image,
  a.content,
  a.is_reservable,
  a.article_type,
  a.parent_article_id,
  COUNT(CASE WHEN child.id IS NOT NULL THEN 1 END) as child_count,
  a.created_at,
  a.updated_at
FROM articles a
LEFT JOIN articles child ON child.parent_article_id = a.id AND child.article_type = 'child'
GROUP BY a.id, a.title, a.description, a.image, a.content, a.is_reservable, a.article_type, a.parent_article_id, a.created_at, a.updated_at;

-- 4. Migration complete!
-- Sample queries:
-- Get all parent articles with child count
-- SELECT * FROM article_hierarchy WHERE article_type = 'parent';

-- Get all children of a parent article
-- SELECT * FROM articles WHERE parent_article_id = 'parent-id' AND article_type = 'child' ORDER BY created_at ASC;

-- Get all reservable articles
-- SELECT * FROM articles WHERE is_reservable = TRUE ORDER BY created_at DESC;
