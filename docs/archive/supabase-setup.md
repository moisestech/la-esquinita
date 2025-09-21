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

## 🚀 Complete Database Implementation

### Step 1: Create All Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- 1. Products Table
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

-- 2. Events Table
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

-- 3. Secret Passes Table
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

-- 4. RSVPs Table
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  plus_ones INTEGER DEFAULT 0,
  dietary_restrictions TEXT,
  notes TEXT,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'waitlist')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(event_id, email)
);

-- 5. Content Table (for dynamic content management)
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT,
  content TEXT,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'html', 'markdown', 'json')),
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_created_at ON products(created_at);
CREATE INDEX idx_products_search ON products USING gin(to_tsvector('english', name || ' ' || COALESCE(description, '')));

CREATE INDEX idx_events_start_at ON events(start_at);
CREATE INDEX idx_events_type ON events(type);
CREATE INDEX idx_events_is_live ON events(is_live);
CREATE INDEX idx_events_date_range ON events(start_at, end_at);

CREATE INDEX idx_secret_passes_code ON secret_passes(code);
CREATE INDEX idx_secret_passes_target_route ON secret_passes(target_route);

CREATE INDEX idx_rsvps_event_id ON rsvps(event_id);
CREATE INDEX idx_rsvps_email ON rsvps(email);
CREATE INDEX idx_rsvps_status ON rsvps(status);

CREATE INDEX idx_content_key ON content(key);
CREATE INDEX idx_content_published ON content(is_published);
```

### Step 2: Create Database Functions

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_rsvps_updated_at BEFORE UPDATE ON rsvps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Step 3: Set Up Row Level Security (RLS)

```sql
-- Enable RLS on all tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Products: Public read, admin write
CREATE POLICY "Products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Products are insertable by admin" ON products FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Products are updatable by admin" ON products FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Products are deletable by admin" ON products FOR DELETE USING (auth.role() = 'authenticated');

-- Events: Public read, admin write
CREATE POLICY "Events are viewable by everyone" ON events FOR SELECT USING (true);
CREATE POLICY "Events are insertable by admin" ON events FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Events are updatable by admin" ON events FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Events are deletable by admin" ON events FOR DELETE USING (auth.role() = 'authenticated');

-- Secret Passes: Admin only
CREATE POLICY "Secret passes are viewable by admin" ON secret_passes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Secret passes are insertable by admin" ON secret_passes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Secret passes are updatable by admin" ON secret_passes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Secret passes are deletable by admin" ON secret_passes FOR DELETE USING (auth.role() = 'authenticated');

-- RSVPs: Public insert, admin read/write
CREATE POLICY "RSVPs are viewable by admin" ON rsvps FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "RSVPs are insertable by everyone" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "RSVPs are updatable by admin" ON rsvps FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "RSVPs are deletable by admin" ON rsvps FOR DELETE USING (auth.role() = 'authenticated');

-- Content: Public read published, admin write
CREATE POLICY "Published content is viewable by everyone" ON content FOR SELECT USING (is_published = true);
CREATE POLICY "Content is insertable by admin" ON content FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Content is updatable by admin" ON content FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Content is deletable by admin" ON content FOR DELETE USING (auth.role() = 'authenticated');
```

### Step 4: Seed Data

```sql
-- Insert sample products
INSERT INTO products (slug, name, price, description, image_urls, status, category, tags) VALUES
('miami-sugar-skull', 'I ❤️ Miami Sugar Skull', 19.99, 'Hand-painted ceramic skull with Miami kitsch aesthetic. Each piece is uniquely crafted with vibrant colors and intricate details that capture the essence of Miami''s artistic culture.', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'], 'active', 'art', ARRAY['miami', 'skull', 'ceramic', 'hand-painted']),
('palm-tree-dreamcatcher', 'Palm Tree Dreamcatcher', 29.99, 'Boho-chic dreamcatcher featuring palm tree motifs and Miami-inspired colors. Handcrafted with natural materials and adorned with beads, feathers, and palm tree charms.', ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop'], 'active', 'home', ARRAY['boho', 'palm', 'dreamcatcher', 'natural']),
('swamp-water-perfume', 'Swamp Water Perfume', 45.00, 'Artisanal fragrance inspired by Miami''s mysterious wetlands. A complex blend of earthy notes, tropical flowers, and the subtle hint of saltwater.', ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop'], 'active', 'beauty', ARRAY['perfume', 'swamp', 'artisanal', 'fragrance']);

-- Insert sample events
INSERT INTO events (title, description, start_at, end_at, type, location, max_capacity) VALUES
('Sugar & Swamp Rave', 'A night of Miami kitsch and electronic beats in the heart of the swamp', '2024-11-28 21:00:00+00', '2024-11-29 02:00:00+00', 'rave', 'La Esquinita Backstage', 150),
('Meet the Artist: Tara Long', 'An intimate evening with the creator of La Esquinita', '2024-12-05 19:00:00+00', '2024-12-05 21:00:00+00', 'talk', 'La Esquinita Gallery', 50),
('Speakeasy Opening', 'The grand opening of our hidden speakeasy experience', '2024-12-12 20:00:00+00', '2024-12-12 23:00:00+00', 'opening', 'La Esquinita Speakeasy', 75);

-- Insert secret passes
INSERT INTO secret_passes (code, target_route, description, max_uses) VALUES
('FONDANT', '/speakeasy', 'Access to the hidden speakeasy', 100),
('BIGTECH', '/backstage', 'Access to the backstage area', 50),
('SUGAR', '/admin', 'Admin access', 10);

-- Insert sample content
INSERT INTO content (key, title, content, type, is_published) VALUES
('homepage_hero', 'Welcome to La Esquinita', 'Miami''s most artistic convenience store', 'text', true),
('about_description', 'About La Esquinita', 'La Esquinita is an art project disguised as a convenience store, exploring the intersection of commerce and creativity in Miami''s vibrant culture.', 'text', true);
```

## 🔧 Environment Variables

Update your `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: For admin functionality
ADMIN_EMAIL=your_admin_email
```

## 📋 Implementation Checklist

- [ ] Run SQL scripts in Supabase SQL Editor
- [ ] Update environment variables
- [ ] Generate TypeScript types
- [ ] Update database operations in `lib/supabase.ts`
- [ ] Test all CRUD operations
- [ ] Verify RLS policies work correctly
- [ ] Test secret code validation
- [ ] Test RSVP functionality

## 🎯 Next Steps

1. **Run the SQL scripts** in your Supabase SQL Editor
2. **Generate TypeScript types** using Supabase CLI
3. **Update the frontend** to use the new database operations
4. **Test all functionality** end-to-end

Let me know when you've run the SQL scripts and I'll help you update the TypeScript implementation! 