/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // La Esquinita Sugar Colors
        'sugar-pink': '#ffc7cf',
        'icing-white': '#fff8f2',
        'mint-rot': '#2d6e57',
        'stucco': '#e5d7c9',
        'fondant-blue': '#b8e6e6',
        
        // Miami Kitsch Colors
        'miami-pink': '#ff69b4',
        'miami-blue': '#00d4ff',
        'miami-yellow': '#ffd700',
        'miami-purple': '#8a2be2',
        'miami-orange': '#ff8c00',
        
        // Supporting Colors
        'neon-green': '#39ff14',
        'sunset-orange': '#ff6b35',
        'ocean-teal': '#008080',
        'sand-beige': '#f4d03f',
        'coral-pink': '#ff7f50',
        
        // shadcn/ui required colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        'skeleton': ['SkeletonBlood', 'serif'],
        'display': ['var(--font-sharp-grotesk)', 'sans-serif'],
      },
      animation: {
        'sprinkle': 'sprinkle 2s ease-in-out infinite',
        'crack': 'crack 0.5s ease-out',
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'marquee': 'marquee 20s linear infinite',
        'palm-sway': 'palm-sway 3s ease-in-out infinite',
        'candy-shimmer': 'candy-shimmer 1.5s ease-in-out infinite',
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
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        'palm-sway': {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        'candy-shimmer': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 },
        },
      },
      boxShadow: {
        'neon-pink': '0 0 20px rgba(255, 105, 180, 0.6)',
        'neon-blue': '0 0 20px rgba(0, 212, 255, 0.6)',
        'neon-yellow': '0 0 20px rgba(255, 215, 0, 0.6)',
        'sugar-glow': '0 0 30px rgba(255, 199, 207, 0.4)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

