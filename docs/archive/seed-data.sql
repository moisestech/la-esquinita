-- Seed Data for La Esquinita
-- Run this in your Supabase SQL Editor after running the security improvements

-- Insert sample products
INSERT INTO products (slug, name, price, description, image_urls, status, category, tags) VALUES
('miami-sugar-skull', 'I ❤️ Miami Sugar Skull', 600.00, 'Hand-painted ceramic skull with Miami kitsch aesthetic. Each piece is uniquely crafted with vibrant colors and intricate details that capture the essence of Miami''s artistic culture. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'], 'active', 'art', ARRAY['miami', 'skull', 'ceramic', 'hand-painted', 'discount']),
('palm-tree-dreamcatcher', 'Palm Tree Dreamcatcher', 600.00, 'Boho-chic dreamcatcher featuring palm tree motifs and Miami-inspired colors. Handcrafted with natural materials and adorned with beads, feathers, and palm tree charms. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=800&h=600&fit=crop'], 'active', 'home', ARRAY['boho', 'palm', 'dreamcatcher', 'natural', 'discount']),
('swamp-water-perfume', 'Swamp Water Perfume', 600.00, 'Artisanal fragrance inspired by Miami''s mysterious wetlands. A complex blend of earthy notes, tropical flowers, and the subtle hint of saltwater. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1541643600914-78b084683601?w=800&h=600&fit=crop'], 'active', 'beauty', ARRAY['perfume', 'swamp', 'artisanal', 'fragrance', 'discount']),
('neon-pink-sunglasses', 'Neon Pink Sunglasses', 600.00, 'Vibrant neon pink sunglasses with Miami kitsch charm. Perfect for those sunny Florida days when you want to make a statement. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&h=600&fit=crop'], 'active', 'fashion', ARRAY['sunglasses', 'neon', 'pink', 'miami', 'discount']),
('flamingo-pool-float', 'Flamingo Pool Float', 600.00, 'Inflatable flamingo pool float with Miami kitsch design. Perfect for pool parties and beach days. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'], 'active', 'lifestyle', ARRAY['pool', 'float', 'flamingo', 'summer', 'discount']),
('miami-vice-candle', 'Miami Vice Candle', 600.00, 'Scented candle with notes of coconut, lime, and ocean breeze. Inspired by the iconic Miami Vice aesthetic. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1603006905004-6f2c0c0c0c0c?w=800&h=600&fit=crop'], 'active', 'home', ARRAY['candle', 'scented', 'miami', 'vice', 'discount']),
('alligator-keychain', 'Alligator Keychain', 600.00, 'Handcrafted alligator keychain made from recycled materials. A perfect Miami souvenir that''s both cute and eco-friendly. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop'], 'active', 'accessories', ARRAY['alligator', 'keychain', 'recycled', 'miami', 'discount']),
('coconut-shell-bowl', 'Coconut Shell Bowl', 600.00, 'Natural coconut shell bowl hand-carved and polished. Perfect for serving tropical fruits or as a decorative piece. **SPECIAL DISCOUNT PRICE** - Originally valued at $1,800.', ARRAY['https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop'], 'active', 'home', ARRAY['coconut', 'bowl', 'natural', 'tropical', 'discount']);

-- Insert sample events
INSERT INTO events (title, description, start_at, end_at, type, location, max_capacity) VALUES
('Sugar & Swamp Rave', 'A night of Miami kitsch and electronic beats in the heart of the swamp. Experience the intersection of art, music, and Miami culture.', '2024-12-28 21:00:00+00', '2024-12-29 02:00:00+00', 'rave', 'La Esquinita Backstage', 150),
('Meet the Artist: Tara Long', 'An intimate evening with the creator of La Esquinita. Learn about the inspiration behind Miami kitsch and the art of convenience store curation.', '2025-01-05 19:00:00+00', '2025-01-05 21:00:00+00', 'talk', 'La Esquinita Gallery', 50),
('Speakeasy Opening', 'The grand opening of our hidden speakeasy experience. Enter through the secret door and discover Miami''s most artistic convenience store.', '2025-01-12 20:00:00+00', '2025-01-12 23:00:00+00', 'opening', 'La Esquinita Speakeasy', 75),
('Kitsch & Koffee Workshop', 'Learn the art of Miami kitsch in this hands-on workshop. Create your own kitsch masterpiece while sipping on locally roasted coffee.', '2025-01-19 14:00:00+00', '2025-01-19 16:00:00+00', 'workshop', 'La Esquinita Workshop Space', 30),
('Live Performance: Neon Dreams', 'An immersive performance combining Miami kitsch aesthetics with contemporary dance and electronic music.', '2025-01-26 20:00:00+00', '2025-01-26 22:00:00+00', 'performance', 'La Esquinita Performance Hall', 100);

-- Insert secret passes
INSERT INTO secret_passes (code, target_route, description, max_uses) VALUES
('FONDANT', '/speakeasy', 'Access to the hidden speakeasy', 100),
('BIGTECH', '/backstage', 'Access to the backstage area', 50),
('SUGAR', '/admin', 'Admin access', 10),
('MIAMI', '/vip', 'VIP access to exclusive events', 25),
('KITSCH', '/workshop', 'Access to kitsch workshop', 40);

-- Insert sample content
INSERT INTO content (key, title, content, type, is_published) VALUES
('homepage_hero', 'Welcome to La Esquinita', 'Miami''s most artistic convenience store', 'text', true),
('about_description', 'About La Esquinita', 'La Esquinita is an art project disguised as a convenience store, exploring the intersection of commerce and creativity in Miami''s vibrant culture. We curate unique experiences that blend Miami kitsch with contemporary art.', 'text', true),
('storefront_description', 'Our Storefront', 'Discover handcrafted items, artisanal products, and Miami kitsch treasures. Each item tells a story of Miami''s unique culture and artistic spirit.', 'text', true),
('events_description', 'Upcoming Events', 'Join us for exclusive events, workshops, and performances that celebrate Miami''s artistic community. From raves to talks, there''s always something happening at La Esquinita.', 'text', true),
('contact_info', 'Contact Information', 'Visit us at 123 Miami Kitsch Ave, Miami, FL 33101. Open daily from 10 AM to 10 PM. For special events and inquiries, email hello@laesquinita.com', 'text', true),
('newsletter_signup', 'Stay Connected', 'Subscribe to our newsletter for exclusive updates, event announcements, and Miami kitsch inspiration.', 'text', true); 