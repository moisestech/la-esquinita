# Supabase Setup & Database Architecture

## 🗄️ Current Database State

### Existing Tables

#### Newsletter Subscriptions
```sql
-- Current table structure
CREATE TABLE newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX idx_newsletter_email ON newsletter(email);
CREATE INDEX idx_newsletter_created_at ON newsletter(created_at);
```

### Current Implementation
- **Location**: `lib/supabase.ts`
- **Types**: `types/supabase.ts`
- **Constants**: `lib/constants/tables.ts`
- **Operations**: Newsletter subscription management

## 🚀 Planned Database Schema

### 1. Products Table
```sql
-- Storefront products
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  description TEXT,
  image_urls TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'coming_soon', 'archived')),
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at);

-- Full-text search
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));
```

### 2. Events Table
```sql
-- Exhibition and event schedule
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('opening', 'rave', 'talk', 'workshop', 'performance')),
  location TEXT,
  rsvp_url TEXT,
  max_capacity INTEGER,
  current_rsvps INTEGER DEFAULT 0,
  is_live BOOLEAN DEFAULT FALSE,
  stream_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_is_live ON events(is_live);
CREATE INDEX idx_events_date_range ON events(start_at, end_at);
```

### 3. Secret Passes Table
```sql
-- Access control for hidden routes
CREATE TABLE secret_passes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  target_route TEXT NOT NULL,
  description TEXT,
  max_uses INTEGER DEFAULT 1,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_secret_passes_code ON secret_passes(code);
CREATE INDEX idx_secret_passes_target_route ON secret_passes(target_route);
CREATE INDEX idx_secret_passes_expires_at ON secret_passes(expires_at);
CREATE INDEX idx_secret_passes_is_active ON secret_passes(is_active);
```

### 4. RSVP Table
```sql
-- Event RSVPs
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  guest_count INTEGER DEFAULT 1,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'waitlist', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- Indexes
CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_email ON rsvps(email);
CREATE INDEX idx_rsvps_status ON rsvps(status);
```

### 5. Content Table
```sql
-- Dynamic content management
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'html', 'markdown', 'json')),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_content_key ON content(key);
CREATE INDEX idx_content_is_published ON content(is_published);
```

## 🔐 Row Level Security (RLS)

### Newsletter Table
```sql
-- Enable RLS
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;

-- Allow public inserts
CREATE POLICY "Allow public newsletter signups" ON newsletter
  FOR INSERT WITH CHECK (true);

-- Allow admins to read all
CREATE POLICY "Allow admin read access" ON newsletter
  FOR SELECT USING (auth.role() = 'admin');
```

### Products Table
```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Allow public read active products" ON products
  FOR SELECT USING (status = 'active');

-- Allow admins full access
CREATE POLICY "Allow admin full access" ON products
  FOR ALL USING (auth.role() = 'admin');
```

### Events Table
```sql
-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read events" ON events
  FOR SELECT USING (true);

-- Allow admins full access
CREATE POLICY "Allow admin full access" ON events
  FOR ALL USING (auth.role() = 'admin');
```

### Secret Passes Table
```sql
-- Enable RLS
ALTER TABLE secret_passes ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active passes
CREATE POLICY "Allow public read active passes" ON secret_passes
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- Allow admins full access
CREATE POLICY "Allow admin full access" ON secret_passes
  FOR ALL USING (auth.role() = 'admin');
```

## 🔧 Database Functions

### Update Timestamps
```sql
-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON rsvps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### RSVP Management
```sql
-- Function to handle RSVP with capacity checking
CREATE OR REPLACE FUNCTION create_rsvp(
  p_event_id UUID,
  p_email TEXT,
  p_name TEXT DEFAULT NULL,
  p_guest_count INTEGER DEFAULT 1
)
RETURNS JSON AS $$
DECLARE
  event_record events%ROWTYPE;
  rsvp_record rsvps%ROWTYPE;
  result JSON;
BEGIN
  -- Get event details
  SELECT * INTO event_record FROM events WHERE id = p_event_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Event not found');
  END IF;
  
  -- Check if already RSVP'd
  SELECT * INTO rsvp_record FROM rsvps WHERE event_id = p_event_id AND email = p_email;
  
  IF FOUND THEN
    RETURN json_build_object('success', false, 'error', 'Already RSVP\'d for this event');
  END IF;
  
  -- Check capacity
  IF event_record.max_capacity IS NOT NULL AND 
     event_record.current_rsvps + p_guest_count > event_record.max_capacity THEN
    -- Add to waitlist
    INSERT INTO rsvps (event_id, email, name, guest_count, status)
    VALUES (p_event_id, p_email, p_name, p_guest_count, 'waitlist');
    
    RETURN json_build_object('success', true, 'status', 'waitlist', 'message', 'Added to waitlist');
  ELSE
    -- Confirm RSVP
    INSERT INTO rsvps (event_id, email, name, guest_count, status)
    VALUES (p_event_id, p_email, p_name, p_guest_count, 'confirmed');
    
    -- Update event RSVP count
    UPDATE events SET current_rsvps = current_rsvps + p_guest_count WHERE id = p_event_id;
    
    RETURN json_build_object('success', true, 'status', 'confirmed', 'message', 'RSVP confirmed');
  END IF;
END;
$$ LANGUAGE plpgsql;
```

### Secret Code Validation
```sql
-- Function to validate secret codes
CREATE OR REPLACE FUNCTION validate_secret_code(
  p_code TEXT,
  p_target_route TEXT
)
RETURNS JSON AS $$
DECLARE
  pass_record secret_passes%ROWTYPE;
  result JSON;
BEGIN
  -- Find the secret pass
  SELECT * INTO pass_record FROM secret_passes 
  WHERE code = p_code AND target_route = p_target_route;
  
  IF NOT FOUND THEN
    RETURN json_build_object('valid', false, 'error', 'Invalid code');
  END IF;
  
  -- Check if expired
  IF pass_record.expires_at IS NOT NULL AND pass_record.expires_at < NOW() THEN
    RETURN json_build_object('valid', false, 'error', 'Code expired');
  END IF;
  
  -- Check if inactive
  IF NOT pass_record.is_active THEN
    RETURN json_build_object('valid', false, 'error', 'Code inactive');
  END IF;
  
  -- Check usage limits
  IF pass_record.max_uses IS NOT NULL AND pass_record.current_uses >= pass_record.max_uses THEN
    RETURN json_build_object('valid', false, 'error', 'Code usage limit reached');
  END IF;
  
  -- Increment usage count
  UPDATE secret_passes SET current_uses = current_uses + 1 WHERE id = pass_record.id;
  
  RETURN json_build_object('valid', true, 'description', pass_record.description);
END;
$$ LANGUAGE plpgsql;
```

## 📊 Sample Data

### Products Seed Data
```sql
INSERT INTO products (slug, name, price, description, image_urls, category, tags) VALUES
('miami-sugar-skull', 'I ❤️ Miami Sugar Skull', 19.99, 'Hand-painted ceramic skull with Miami kitsch aesthetic', ARRAY['https://example.com/skull-1.jpg', 'https://example.com/skull-2.jpg'], 'art', ARRAY['miami', 'skull', 'ceramic']),
('palm-tree-dreamcatcher', 'Palm Tree Dreamcatcher', 29.99, 'Boho-chic dreamcatcher with palm tree motifs', ARRAY['https://example.com/dreamcatcher-1.jpg'], 'home', ARRAY['boho', 'palm', 'dreamcatcher']),
('swamp-water-perfume', 'Swamp Water Perfume', 45.00, 'Artisanal fragrance inspired by Miami wetlands', ARRAY['https://example.com/perfume-1.jpg'], 'beauty', ARRAY['perfume', 'swamp', 'artisanal']),
('fondant-cake-sculpture', 'Fondant Cake Sculpture', 150.00, 'Edible art piece - three-tier cake with breathing animation', ARRAY['https://example.com/cake-1.jpg'], 'art', ARRAY['cake', 'fondant', 'sculpture']),
('neon-mosquito-lamp', 'Neon Mosquito Lamp', 75.00, 'LED lamp with animated mosquito swarm effect', ARRAY['https://example.com/lamp-1.jpg'], 'lighting', ARRAY['neon', 'mosquito', 'led']);
```

### Events Seed Data
```sql
INSERT INTO events (title, description, start_at, end_at, type, location, rsvp_url, max_capacity) VALUES
('La Esquinita Grand Opening', 'Experience the magic of Miami''s artistic convenience store', '2025-01-15 18:00:00+00', '2025-01-15 22:00:00+00', 'opening', 'Locust Projects, Miami', 'https://eventbrite.com/la-esquinita-opening', 100),
('Sugar & Swamp Rave', 'Underground electronic music event in the speakeasy', '2025-01-28 21:00:00+00', '2025-01-29 02:00:00+00', 'rave', 'La Esquinita Speakeasy', 'https://eventbrite.com/sugar-swamp-rave', 50),
('Meet the Artist: Tara Long', 'Intimate conversation about the artistic process behind La Esquinita', '2025-02-05 19:00:00+00', '2025-02-05 20:30:00+00', 'talk', 'La Esquinita Gallery', 'https://eventbrite.com/meet-tara-long', 30);
```

### Secret Passes Seed Data
```sql
INSERT INTO secret_passes (code, target_route, description, max_uses, expires_at) VALUES
('FONDANT', '/cake', 'Access to the backstage cake experience', 1000, '2025-12-31 23:59:59+00'),
('BIGTECH', '/speakeasy', 'Access to the underground speakeasy', 500, '2025-12-31 23:59:59+00'),
('SUGAR', '/cake', 'Alternative access code for cake experience', 100, '2025-06-30 23:59:59+00');
```

## 🔧 Implementation Notes

### Environment Variables
```bash
# Required Supabase environment variables
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # For admin functions
```

### TypeScript Types
The database types should be generated using Supabase CLI:
```bash
supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

### Real-time Subscriptions
Consider implementing real-time features for:
- Live event updates
- RSVP count changes
- Speakeasy access status

### Backup Strategy
- Daily automated backups
- Point-in-time recovery
- Cross-region replication for disaster recovery

---

*This documentation should be updated as the database schema evolves.* 