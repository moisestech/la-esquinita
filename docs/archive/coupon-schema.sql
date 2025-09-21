-- Coupon System Database Schema
-- This file contains the SQL commands to create the coupon tables and sample data

-- Create coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_amount DECIMAL(10,2) NOT NULL,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  description TEXT,
  active BOOLEAN DEFAULT true,
  max_uses INTEGER,
  used_count INTEGER DEFAULT 0,
  min_order_amount DECIMAL(10,2) DEFAULT 0,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create coupon_usage table to track usage
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_code VARCHAR(50) NOT NULL REFERENCES coupons(code),
  order_id UUID NOT NULL,
  user_id UUID,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  discount_applied DECIMAL(10,2) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_active ON coupons(active);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_coupon_code ON coupon_usage(coupon_code);
CREATE INDEX IF NOT EXISTS idx_coupon_usage_order_id ON coupon_usage(order_id);

-- Enable Row Level Security
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies for coupons table
CREATE POLICY "Coupons are viewable by everyone" ON coupons
  FOR SELECT USING (active = true);

CREATE POLICY "Coupons can be updated by authenticated users" ON coupons
  FOR UPDATE USING (auth.role() = 'authenticated');

-- RLS Policies for coupon_usage table
CREATE POLICY "Coupon usage viewable by order owner" ON coupon_usage
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Coupon usage insertable by authenticated users" ON coupon_usage
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Function to increment usage count
CREATE OR REPLACE FUNCTION increment_usage_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE coupons 
  SET used_count = used_count + 1,
      updated_at = NOW()
  WHERE code = NEW.coupon_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically increment usage count
CREATE TRIGGER increment_coupon_usage
  AFTER INSERT ON coupon_usage
  FOR EACH ROW
  EXECUTE FUNCTION increment_usage_count();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at timestamp
CREATE TRIGGER update_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Insert sample coupon data
INSERT INTO coupons (code, discount_amount, discount_type, description, max_uses, min_order_amount, expires_at) VALUES
  ('MIAMI10', 10.00, 'percentage', '10% off your Miami kitsch order', 100, 25.00, '2025-12-31 23:59:59'),
  ('WELCOME5', 5.00, 'fixed', '$5 off your first order', 50, 10.00, '2025-12-31 23:59:59'),
  ('SUGAR20', 20.00, 'percentage', '20% off sugar-themed items', 25, 50.00, '2025-06-30 23:59:59'),
  ('SPRINKLE15', 15.00, 'percentage', '15% off sprinkle collection', 75, 30.00, '2025-12-31 23:59:59'),
  ('FONDANT25', 25.00, 'fixed', '$25 off fondant sculptures', 10, 100.00, '2025-12-31 23:59:59'),
  ('KITSCH50', 50.00, 'fixed', '$50 off orders over $200', 5, 200.00, '2025-12-31 23:59:59');

-- Grant necessary permissions
GRANT SELECT ON coupons TO anon, authenticated;
GRANT INSERT, UPDATE ON coupons TO authenticated;
GRANT SELECT ON coupon_usage TO authenticated;
GRANT INSERT ON coupon_usage TO authenticated; 