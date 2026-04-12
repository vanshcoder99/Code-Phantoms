Design Update - Professional Color Palette & Lucide Icons

CHANGES MADE:

1. COLOR PALETTE UPDATED
   Primary:      #F7374F (Vibrant Red)
   Secondary:    #88304E (Deep Burgundy)
   Tertiary:     #522546 (Dark Purple)
   Quaternary:   #2C2C2C (Charcoal Black)

2. LUCIDE ICONS INTEGRATED
   Navbar:
   - Target icon for logo
   - Menu/X icons for mobile menu
   - Moon/Sun icons for dark mode toggle

   Hero Section:
   - BookOpen icon for "Learn Risk-Free"
   - Zap icon for "AI Guidance"
   - TrendingUp icon for "Real Insights"

   Risk Simulator:
   - Play icon for "Run Simulation"
   - TrendingUp icon for best case
   - TrendingDown icon for worst case
   - BarChart3 icon for average case

   Loss Probability Meter:
   - CheckCircle icon for low risk
   - AlertTriangle icon for medium risk
   - AlertCircle icon for high risk

   AI Explainer:
   - Zap icon for "Explain" button
   - Lightbulb icon for AI analysis

   Learning Section:
   - BookOpen icon for "What is Risk?"
   - Heart icon for "Why Fear is Normal"
   - Gamepad2 icon for "How Simulation Helps"
   - TrendingUp icon for "Long-term Wins"
   - ArrowRight icon for CTA

   Footer:
   - Mail icon for contact
   - Github icon for social
   - Linkedin icon for social

3. EMOJIS REMOVED
   All emoji characters replaced with Lucide icons
   Professional appearance maintained

4. TAILWIND CONFIG UPDATED
   Added custom color palette to theme.extend.colors
   Colors available as:
   - bg-primary, text-primary
   - bg-secondary, text-secondary
   - bg-tertiary, text-tertiary
   - bg-quaternary, text-quaternary
   - Plus light and dark variants

5. COMPONENT UPDATES
   All 7 components updated:
   - Navbar.js
   - HeroSection.js
   - RiskSimulator.js
   - LossProbabilityMeter.js
   - AIExplainer.js
   - LearningSection.js
   - Footer.js

6. PACKAGE.JSON UPDATED
   Added lucide-react dependency: ^0.263.1

INSTALLATION:
npm install lucide-react

USAGE EXAMPLE:
import { Target, Menu, X, Moon, Sun } from 'lucide-react';

<Target className="w-6 h-6 text-primary" />

BENEFITS:
- Professional appearance
- Consistent icon system
- Better visual hierarchy
- Improved accessibility
- Modern design language
- Easy to maintain and update

COLOR USAGE GUIDELINES:
- Primary (#F7374F): CTAs, highlights, important elements
- Secondary (#88304E): Hover states, secondary elements
- Tertiary (#522546): Cards, containers, backgrounds
- Quaternary (#2C2C2C): Text, dark backgrounds

RESPONSIVE DESIGN:
All components remain fully responsive
Icons scale appropriately on mobile
Touch-friendly button sizes maintained
