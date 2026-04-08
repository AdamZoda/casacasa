-- Add contact fields to orders table if they don't exist
-- This allows storing phone and country information with each order

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS user_phone text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS country text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS phone_code text DEFAULT NULL;

-- Verify the columns were added/exist
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'orders' 
  AND column_name IN ('user_phone', 'country', 'phone_code')
ORDER BY ordinal_position;
