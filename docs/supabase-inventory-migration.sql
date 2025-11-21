-- Inventory Upgrade for La Esquinita storefront
-- Run inside Supabase SQL Editor before ingesting the 250 numbered objects.

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS inventory_number integer,
  ADD COLUMN IF NOT EXISTS display_number text,
  ADD COLUMN IF NOT EXISTS primary_image text,
  ADD COLUMN IF NOT EXISTS underside_image text,
  ADD COLUMN IF NOT EXISTS square_catalog_object_id text,
  ADD COLUMN IF NOT EXISTS square_order_id text,
  ADD COLUMN IF NOT EXISTS square_sku text,
  ADD COLUMN IF NOT EXISTS dimensions text,
  ADD COLUMN IF NOT EXISTS sold_at timestamptz,
  ADD COLUMN IF NOT EXISTS is_unique boolean DEFAULT true;

-- Ensure we can look up pieces quickly from the gallery floor.
CREATE UNIQUE INDEX IF NOT EXISTS idx_products_inventory_number
  ON products (inventory_number);

-- Backfill helper for existing sample data (optional).
UPDATE products
SET
  display_number = CONCAT('No. ', inventory_number),
  is_unique = COALESCE(is_unique, true)
WHERE display_number IS NULL;

-- Performance check template (run in Supabase SQL Editor when needed)
-- EXPLAIN ANALYZE SELECT slug, name, price
-- FROM products
-- WHERE inventory_number = 123;
