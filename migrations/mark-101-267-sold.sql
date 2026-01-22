-- Migration: Mark items 101 and 267 as SOLD
-- Date: 2026-01-15
-- Description: Update items 101 (Egg Smile) and 267 (Pie) to sold status
-- Pattern: Follows the same pattern as items 1, 2, 3 (sold_at timestamp set)

-- Mark item 101 as sold
UPDATE products
SET
  sold_at = NOW(),
  updated_at = NOW()
WHERE inventory_number = 101;

-- Mark item 267 as sold
UPDATE products
SET
  sold_at = NOW(),
  updated_at = NOW()
WHERE inventory_number = 267;

-- Verify the update
SELECT
  inventory_number,
  name,
  status,
  sold_at,
  square_order_id
FROM products
WHERE inventory_number IN (101, 267)
ORDER BY inventory_number;
