# La Esquinita - Sugar-Laced Parable About Power

## 🎨 Project Overview

**La Esquinita** is the debut solo exhibition by Miami-based artist Tara Long at Locust Projects (November 2025 - January 2026). This digital experience serves as both a companion to and extension of the physical installation, exploring Miami's cycles of exploitation from "Big Sugar" to Big Tech.

### Core Concept
A 2,500 sq ft walk-through installation that juxtaposes Florida's early 20th-century "Big Sugar" land grab with today's influx of Big Tech capital, showing how both sweeten—and hollow—local culture. The materials oscillate between confectionery fantasy and rot: fondant-like plaster, glossy ceramic "snacks," cracked stucco, and projected spores.

### Brand Identity
- **Logo**: [La Esquinita Logo](https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png)
- **Alternative Logo**: [La Esquinita Logo 2](https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png)
- **Theme**: Sugar-coated critique of power and consumption
- **Aesthetic**: Confectionery fantasy vs. decay, sugar sculptures vs. cracked stucco

## 🏗️ Technical Architecture

### Current Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS + shadcn/ui components
- **3D Graphics**: Three.js with @react-three/fiber
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Vercel (recommended)
- **Animations**: Framer Motion

### Project Structure
```
la-esquinita/
├── app/                    # Next.js App Router pages
├── components/             # React components
│   ├── ui/                # shadcn/ui components
│   ├── magicui/           # Custom animated components
│   └── [feature]/         # Feature-specific components
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Database operations
│   └── constants/         # App constants
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
├── public/                # Static assets
└── docs/                  # Project documentation
```

## 🎭 Experience Design

### Three-Act Narrative Structure

#### Act 1: Facade & Storefront (Seduction)
- **Route**: `/storefront`
- **Experience**: Corner-store mural blends bodega graphics with dripping icing
- **Elements**:
  - Sugar-icing marquee with animated sprinkles
  - Hand-made ceramic "sugar-coated" souvenirs
  - Shopping cart (checkout opens November 19th)
  - Clean product display with art-speak descriptions

#### Act 2: Backstage (Exposure)
- **Route**: `/cake-hall`
- **Experience**: Hidden door reveals consumption's darker appetite
- **Elements**:
  - Monumental cake sculpture (part stage, part crumbling high-rise)
  - Three performers embody female archetypes—maiden mother crone
  - Sacred clown imagery and performance documentation
  - Background audio accompaniment

#### Act 3: Speakeasy (Collapse / Rebirth)
- **Route**: `/mosquito-bar` (Mosquito Lounge)
- **Experience**: Rear lounge overrun by swamp life
- **Elements**:
  - Dark atmospheric design with projected Everglades
  - Craft cocktails inspired by Miami's swamp consumption
  - Nature's primacy and resilience themes
  - Secret speakeasy ambiance

### Additional Routes
- `/events` - Exhibition events and performances
- `/about` - Artist statement, bio, and project context
- Home page with immersive landing experience

## 🎨 Design System

### Color Palette
```css
--color-sugar-pink: #ffc7cf      /* Primary accent */
--color-icing-white: #fff8f2     /* Light backgrounds */
--color-mint-rot: #2d6e57        /* Swamp accents */
--color-stucco: #e5d7c9          /* Alternative backgrounds */
```

### Typography
- **Display Font**: Skeleton Blood (custom dripping font)
- **Product Titles**: Arial/Helvetica Bold (clean, non-dripping)
- **Body Font**: System fonts with fallbacks
- **Navigation**: Clean sans-serif matching scrolling banner

### Micro-Interactions
- **Sprinkle Animations**: Sugar particles on product interactions
- **Floating Elements**: Animated backgrounds and atmospheric particles
- **Neon Effects**: Glowing borders and hover states
- **Audio Integration**: Background music in Cake Hall

## 🗄️ Database Schema

### Current Tables
```sql
-- Newsletter subscriptions
newsletter (
  id: uuid PRIMARY KEY,
  email: text UNIQUE,
  created_at: timestamptz
)
```

### Planned Tables
```sql
-- Products for storefront
products (
  id: uuid PRIMARY KEY,
  slug: text UNIQUE,
  name: text,
  price: numeric,
  description: text,
  image_urls: text[],
  status: text DEFAULT 'active'
);

-- Event schedule
events (
  id: uuid PRIMARY KEY,
  title: text,
  start_at: timestamptz,
  end_at: timestamptz,
  type: text,
  location: text,
  rsvp_url: text
);

-- Secret access codes
secret_passes (
  id: uuid PRIMARY KEY,
  code: text UNIQUE,
  target_route: text,
  expires_at: timestamptz
);
```

## 🚀 Implementation Roadmap

### Phase 1: Foundation (Week 1-2)
- [ ] Complete Supabase schema setup
- [ ] Implement authentication system
- [ ] Create basic routing structure
- [ ] Set up design tokens and component library

### Phase 2: Storefront (Week 3-4)
- [ ] Build product grid and cards
- [ ] Implement fake cart system
- [ ] Create sugar-icing marquee
- [ ] Add hidden door functionality

### Phase 3: Backstage Cake (Week 5-6)
- [ ] Develop secret code system
- [ ] Build video hero section
- [ ] Create ritual gallery
- [ ] Implement crack texture effects

### Phase 4: Speakeasy (Week 7-8)
- [ ] Build time-gated access system
- [ ] Create dark mode interface
- [ ] Implement live streaming integration
- [ ] Add RSVP functionality

### Phase 5: Polish & Launch (Week 9-10)
- [ ] Performance optimization
- [ ] Mobile responsiveness
- [ ] Content population
- [ ] Launch preparation

## 🎯 Success Metrics

### User Experience
- Time spent on each act of the narrative
- Secret code discovery rate
- Event RSVP conversion
- Newsletter signup rate

### Technical Performance
- Page load times < 3 seconds
- 3D component stability
- Mobile performance scores
- Accessibility compliance

### Artistic Impact
- Social media engagement
- Press coverage
- Community feedback
- Exhibition attendance

## 🔧 Development Guidelines

### Code Standards
- TypeScript for type safety
- ESLint + Prettier for code formatting
- Component-driven development
- Comprehensive error handling

### Performance Considerations
- Lazy loading for 3D components
- Image optimization with Next.js
- Database query optimization
- CDN usage for static assets

### Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support

## 📞 Contact & Resources

### Team
- **Artist**: Tara Long (b. 1984, Miami)
- **Institution**: Locust Projects, Little River, Miami
- **Exhibition**: November 2025 - January 2026
- **Contact**: egodeathllc@gmail.com

### Resources
- [Project Figma](link-to-be-added)
- [Content Calendar](link-to-be-added)
- [Asset Library](link-to-be-added)
- [Development Environment Setup](docs/setup.md)

---

*This documentation is a living document and will be updated as the project evolves.* 
