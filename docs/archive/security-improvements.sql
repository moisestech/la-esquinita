-- Security Improvements for La Esquinita Database
-- Run these commands in your Supabase SQL Editor

-- 1. Enable RLS on remaining tables
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

-- 2. Create comprehensive RLS policies

-- Content: Public read published, admin write
CREATE POLICY "Published content is viewable by everyone" ON content 
  FOR SELECT USING (is_published = true);

CREATE POLICY "Content is insertable by admin" ON content 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Content is updatable by admin" ON content 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Content is deletable by admin" ON content 
  FOR DELETE USING (auth.role() = 'authenticated');

-- Secret Passes: Admin only
CREATE POLICY "Secret passes are viewable by admin" ON secret_passes 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Secret passes are insertable by admin" ON secret_passes 
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Secret passes are updatable by admin" ON secret_passes 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Secret passes are deletable by admin" ON secret_passes 
  FOR DELETE USING (auth.role() = 'authenticated');

-- RSVPs: Public insert, admin read/write
CREATE POLICY "RSVPs are viewable by admin" ON rsvps 
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "RSVPs are insertable by everyone" ON rsvps 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "RSVPs are updatable by admin" ON rsvps 
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "RSVPs are deletable by admin" ON rsvps 
  FOR DELETE USING (auth.role() = 'authenticated');

-- 3. Create functions with fixed search path for security

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER SET search_path = public;

-- Function to create RSVP and update event count
CREATE OR REPLACE FUNCTION create_rsvp(
  p_event_id UUID,
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_plus_ones INTEGER DEFAULT 0,
  p_dietary_restrictions TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_rsvp_id UUID;
  v_max_capacity INTEGER;
  v_current_rsvps INTEGER;
BEGIN
  -- Get event capacity info
  SELECT max_capacity, current_rsvps 
  INTO v_max_capacity, v_current_rsvps
  FROM events 
  WHERE id = p_event_id;
  
  -- Check if event exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Event not found';
  END IF;
  
  -- Check capacity
  IF v_max_capacity IS NOT NULL AND (v_current_rsvps + 1 + p_plus_ones) > v_max_capacity THEN
    RAISE EXCEPTION 'Event is at capacity';
  END IF;
  
  -- Create RSVP
  INSERT INTO rsvps (event_id, email, name, plus_ones, dietary_restrictions, notes)
  VALUES (p_event_id, p_email, p_name, p_plus_ones, p_dietary_restrictions, p_notes)
  ON CONFLICT (event_id, email) DO UPDATE SET
    name = EXCLUDED.name,
    plus_ones = EXCLUDED.plus_ones,
    dietary_restrictions = EXCLUDED.dietary_restrictions,
    notes = EXCLUDED.notes,
    updated_at = NOW()
  RETURNING id INTO v_rsvp_id;
  
  -- Update event RSVP count
  UPDATE events 
  SET current_rsvps = (
    SELECT COALESCE(SUM(1 + plus_ones), 0) 
    FROM rsvps 
    WHERE event_id = p_event_id AND status = 'confirmed'
  )
  WHERE id = p_event_id;
  
  RETURN v_rsvp_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Function to validate secret codes
CREATE OR REPLACE FUNCTION validate_secret_code(
  p_code TEXT,
  p_target_route TEXT
)
RETURNS BOOLEAN AS $$
DECLARE
  v_pass RECORD;
BEGIN
  SELECT * INTO v_pass
  FROM secret_passes
  WHERE code = p_code 
    AND target_route = p_target_route
    AND is_active = TRUE
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  IF FOUND THEN
    -- Increment usage count
    UPDATE secret_passes 
    SET current_uses = current_uses + 1
    WHERE id = v_pass.id;
    
    RETURN TRUE;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 4. Create triggers for updated_at
CREATE TRIGGER update_products_updated_at 
  BEFORE UPDATE ON products 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at 
  BEFORE UPDATE ON events 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at 
  BEFORE UPDATE ON rsvps 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at 
  BEFORE UPDATE ON content 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 5. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at);
CREATE INDEX IF NOT EXISTS idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX IF NOT EXISTS idx_events_start_at ON events(start_at);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type);
CREATE INDEX IF NOT EXISTS idx_events_is_live ON events(is_live);
CREATE INDEX IF NOT EXISTS idx_events_date_range ON events(start_at, end_at);

CREATE INDEX IF NOT EXISTS idx_secret_passes_code ON secret_passes(code);
CREATE INDEX IF NOT EXISTS idx_secret_passes_target_route ON secret_passes(target_route);

CREATE INDEX IF NOT EXISTS idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX IF NOT EXISTS idx_rsvps_email ON rsvps(email);
CREATE INDEX IF NOT EXISTS idx_rsvps_status ON rsvps(status);

CREATE INDEX IF NOT EXISTS idx_content_key ON content(key);
CREATE INDEX IF NOT EXISTS idx_content_published ON content(is_published); 