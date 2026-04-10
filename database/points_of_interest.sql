-- Create points_of_interest table
CREATE TABLE IF NOT EXISTS points_of_interest (
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
CREATE INDEX IF NOT EXISTS idx_points_of_interest_visible ON points_of_interest(visible);
CREATE INDEX IF NOT EXISTS idx_points_of_interest_type ON points_of_interest(type);
CREATE INDEX IF NOT EXISTS idx_points_of_interest_coords ON points_of_interest(latitude, longitude);

-- Enable Row Level Security
ALTER TABLE points_of_interest ENABLE ROW LEVEL SECURITY;

-- Allow public read access (viewing on the map)
CREATE POLICY "Allow public read access" ON points_of_interest
  FOR SELECT USING (visible = true);

-- Allow authenticated admin to manage all POIs
CREATE POLICY "Allow authenticated admin to manage" ON points_of_interest
  FOR ALL USING (
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.email IN (
        SELECT jsonb_array_elements_text(
          (SELECT value FROM site_settings WHERE key = 'admin_emails')
        )
      )
    )
  );
