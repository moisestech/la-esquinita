# La Esquinita - Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git
- Supabase account
- Code editor (VS Code recommended)

### 1. Clone the Repository
```bash
git clone [repository-url]
cd la-esquinita
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Optional: Development overrides
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see the application.

---

## 🗄️ Supabase Setup

### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your project URL and anon key

### 2. Database Schema Setup
Run the following SQL in your Supabase SQL editor:

```sql
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Newsletter table (already exists)
CREATE TABLE IF NOT EXISTS newsletter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products table
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

-- Events table
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

-- Secret passes table
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

-- RSVPs table
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

-- Content table
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
```

### 3. Row Level Security (RLS)
Enable RLS and create policies:

```sql
-- Enable RLS on all tables
ALTER TABLE newsletter ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_passes ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;

-- Newsletter policies
CREATE POLICY "Allow public newsletter signups" ON newsletter
  FOR INSERT WITH CHECK (true);

-- Products policies
CREATE POLICY "Allow public read active products" ON products
  FOR SELECT USING (status = 'active');

-- Events policies
CREATE POLICY "Allow public read events" ON events
  FOR SELECT USING (true);

-- Secret passes policies
CREATE POLICY "Allow public read active passes" ON secret_passes
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > NOW()));

-- RSVPs policies
CREATE POLICY "Allow public RSVP" ON rsvps
  FOR INSERT WITH CHECK (true);

-- Content policies
CREATE POLICY "Allow public read published content" ON content
  FOR SELECT USING (is_published = true);
```

### 4. Generate TypeScript Types
Install Supabase CLI and generate types:

```bash
npm install -g supabase
supabase login
supabase gen types typescript --project-id your-project-id > types/supabase.ts
```

---

## 🎨 Design System Setup

### 1. Tailwind Configuration
Update `tailwind.config.js` with custom design tokens:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // La Esquinita color palette
        'sugar-pink': '#ffc7cf',
        'icing-white': '#fff8f2',
        'mint-rot': '#2d6e57',
        'stucco': '#e5d7c9',
        
        // Additional Miami-inspired colors
        'miami-blue': '#00d4ff',
        'miami-pink': '#ff69b4',
        'miami-yellow': '#ffd700',
        'swamp-green': '#2d5016',
      },
      fontFamily: {
        'skeleton': ['SkeletonBlood', 'serif'],
        'display': ['var(--font-sharp-grotesk)', 'sans-serif'],
      },
      animation: {
        'sprinkle': 'sprinkle 2s ease-in-out infinite',
        'crack': 'crack 0.5s ease-out',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        sprinkle: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(180deg)' },
        },
        crack: {
          '0%': { transform: 'scaleX(0)' },
          '100%': { transform: 'scaleX(1)' },
        },
        'neon-pulse': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.5 },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 2. Custom Fonts
Add the Skeleton Blood font to your project:

```css
/* In globals.css */
@font-face {
  font-family: 'SkeletonBlood';
  src: url('/fonts/skeleton-blood.woff2') format('woff2'),
       url('/fonts/skeleton-blood.woff') format('woff'),
       url('/fonts/skeleton-blood.ttf') format('truetype'),
       url('/fonts/skeleton-blood.otf') format('opentype');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
}
```

### 3. Component Library
The project uses shadcn/ui components. Install additional components as needed:

```bash
npx shadcn-ui@latest add [component-name]
```

---

## 🎭 3D Graphics Setup

### 1. Three.js Configuration
The project includes Three.js with React Three Fiber. Key files:

- `components/simple-3d.tsx` - Main 3D component
- `components/simple-3d-fallback.tsx` - Fallback for 3D failures
- `public/obj/` - 3D model files

### 2. Performance Optimization
3D components include:
- Lazy loading
- Error boundaries
- Fallback systems
- Performance monitoring

### 3. Asset Management
3D assets are stored in:
- `public/obj/` - 3D models (.obj, .mtl)
- `public/fonts/` - Custom fonts
- Cloudinary - Image and video assets

---

## 🔧 Development Workflow

### 1. Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks

### 2. Git Workflow
```bash
# Create feature branch
git checkout -b feature/ticket-number-description

# Make changes and commit
git add .
git commit -m "feat: implement [feature description]"

# Push and create PR
git push origin feature/ticket-number-description
```

### 3. Testing
```bash
# Run tests
npm run test

# Run linting
npm run lint

# Type checking
npm run type-check
```

### 4. Database Migrations
For database changes, create migration files:

```bash
# Create migration
supabase migration new [migration-name]

# Apply migrations
supabase db push
```

---

## 🚀 Deployment

### 1. Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### 2. Environment Variables for Production
```bash
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

### 3. Performance Monitoring
- Vercel Analytics
- Supabase Dashboard
- Custom error tracking

---

## 🐛 Troubleshooting

### Common Issues

#### 3D Components Not Loading
```bash
# Check WebGL support
npm run check-webgl

# Clear browser cache
# Disable 3D in development
NEXT_PUBLIC_DISABLE_3D=true
```

#### Supabase Connection Issues
```bash
# Verify environment variables
npm run check-env

# Test connection
npm run test-supabase
```

#### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
npm run build

# Check TypeScript errors
npm run type-check
```

### Debug Tools
- React Developer Tools
- Supabase Dashboard
- Vercel Analytics
- Browser DevTools

---

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Three.js Documentation](https://threejs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

### Project Links
- [La Esquinita Figma](link-to-be-added)
- [Project Trello](link-to-be-added)
- [Content Calendar](link-to-be-added)

### Team Communication
- Slack: #la-esquinita-dev
- Discord: La Esquinita Development
- Email: dev@la-esquinita.com

---

## 🎯 Next Steps

1. **Complete Setup**: Follow all steps above
2. **Review Tickets**: Check `docs/implementation-tickets.md`
3. **Join Team**: Get added to communication channels
4. **Start Development**: Pick up your first ticket
5. **Ask Questions**: Don't hesitate to reach out to the team

---

*This setup guide will be updated as the project evolves.* 