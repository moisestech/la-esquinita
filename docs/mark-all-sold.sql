-- Mark all remaining unsold products as sold
-- Run this in the Supabase SQL Editor to update production data
-- This sets sold_at on all rows that don't already have one

UPDATE products SET sold_at = NOW() WHERE sold_at IS NULL;
