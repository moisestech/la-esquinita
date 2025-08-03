# La Esquinita - Miami Artistic Convenience Store

## 🎨 Project Overview

**La Esquinita** is an immersive web experience that transforms the digital space into a Miami artistic convenience store. Created by Tara Long for Locust Projects 2025, this project explores the themes of **Seduction → Exposure → Rebirth** through a three-act narrative structure.

### Core Concept
Think of it as an artistic dollar store that exists both physically in Miami and digitally as an interactive web experience. The project plays with the contrast between sugar-coated fantasy and the underlying decay, creating a Miami tourist kitsch aesthetic that reveals deeper artistic commentary.

### Brand Identity
- **Logo**: [La Esquinita Logo](https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892032/la-esquinita/LE-logo-tara_jdjyo9.png)
- **Alternative Logo**: [La Esquinita Logo 2](https://res.cloudinary.com/dck5rzi4h/image/upload/v1753892200/la-esquinita/LE-logo-tara-2_aurodr.png)
- **Theme**: Miami tourist kitsch meets artistic commentary
- **Aesthetic**: Sugar fantasy vs. rot, glossy pastels vs. cracked textures

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

#### Act 1: Seduction (Storefront)
- **Route**: `/` (default landing)
- **Experience**: Welcoming bodega-style interface
- **Elements**: 
  - Sugar-icing marquee with animated sprinkles
  - Product grid with Miami kitsch items
  - Fake cart system (no actual checkout)
  - Hidden door CTA for secret access

#### Act 2: Exposure (Backstage Cake)
- **Route**: `/cake` (hidden, requires secret code)
- **Experience**: Behind-the-scenes artistic content
- **Elements**:
  - Full-bleed hero video of breathing cake
  - Ritual gallery with performer clips
  - Visual crack textures
  - Progressive disclosure of content

#### Act 3: Rebirth (Speakeasy)
- **Route**: `/speakeasy` (time-gated or code-accessed)
- **Experience**: Dark, swampy underground space
- **Elements**:
  - Dark mode with neon accents
  - Live event streaming
  - RSVP functionality
  - Exclusive content access

### Additional Routes
- `/events` - Calendar and event management
- `/about` - Artist statement and project ethos
- `/admin` - Content management (auth-gated)

## 🎨 Design System

### Color Palette
```css
--color-sugar-pink: #ffc7cf      /* Primary accent */
--color-icing-white: #fff8f2     /* Light backgrounds */
--color-mint-rot: #2d6e57        /* Swamp accents */
--color-stucco: #e5d7c9          /* Alternative backgrounds */
```

### Typography
- **Display Font**: Skeleton Blood (custom font)
- **Body Font**: System fonts with fallbacks
- **Accent Fonts**: Miami-style decorative elements

### Micro-Interactions
- **Hover Sprinkle**: Sugar grains fall and dissolve on product hover
- **Rot Timer**: Cracks widen after 45s idle on cake page
- **Speakeasy Fog**: WebGL noise overlay for atmospheric effect

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
- **Artist**: Tara Long
- **Technical Lead**: [To be assigned]
- **Design Lead**: [To be assigned]
- **Content Manager**: [To be assigned]

### Resources
- [Project Figma](link-to-be-added)
- [Content Calendar](link-to-be-added)
- [Asset Library](link-to-be-added)
- [Development Environment Setup](docs/setup.md)

---

*This documentation is a living document and will be updated as the project evolves.* 