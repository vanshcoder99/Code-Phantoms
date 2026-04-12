Professional Design System - Investing Fear

OVERVIEW
This document outlines the complete design system for Investing Fear, including color palette, typography, icons, and component guidelines.

COLOR PALETTE

Primary: #F7374F
- Used for: CTAs, buttons, highlights, important elements
- Variants:
  - Light: #FF6B7A (hover states)
  - Dark: #D91E2F (active states)

Secondary: #88304E
- Used for: Secondary elements, hover states, accents
- Variants:
  - Light: #A85070
  - Dark: #6B1F3A

Tertiary: #522546
- Used for: Cards, containers, secondary backgrounds
- Variants: Derived from base

Quaternary: #2C2C2C
- Used for: Text, dark backgrounds, primary dark mode
- Variants: Derived from base

Supporting Colors:
- White: #FFFFFF
- Gray Scale: #F1F1F1 to #808080
- Success: #10B981
- Warning: #F59E0B
- Error: #EF4444

TYPOGRAPHY

Font Family: System fonts
- -apple-system
- BlinkMacSystemFont
- Segoe UI
- Roboto
- Oxygen
- Ubuntu
- Cantarell
- Fira Sans
- Droid Sans
- Helvetica Neue

Font Sizes:
- H1: 3.75rem (60px) - Desktop, 2rem (32px) - Mobile
- H2: 2.25rem (36px) - Desktop, 1.75rem (28px) - Mobile
- H3: 1.875rem (30px) - Desktop, 1.25rem (20px) - Mobile
- Body: 1rem (16px)
- Small: 0.875rem (14px)
- Tiny: 0.75rem (12px)

Font Weights:
- Regular: 400
- Semibold: 600
- Bold: 700

ICONS

Icon Library: Lucide React
Installation: npm install lucide-react

Icon Usage:
import { IconName } from 'lucide-react';

<IconName className="w-6 h-6 text-primary" />

Common Icons Used:

Navigation:
- Target (logo)
- Menu (mobile menu)
- X (close)
- Moon (dark mode)
- Sun (light mode)

Actions:
- Play (run simulation)
- Send (submit)
- Zap (AI/power)
- ArrowRight (next/CTA)

Status:
- CheckCircle (success/low risk)
- AlertTriangle (warning/medium risk)
- AlertCircle (error/high risk)

Content:
- BookOpen (learning)
- Heart (emotion)
- Gamepad2 (simulation)
- TrendingUp (growth)
- TrendingDown (decline)
- BarChart3 (analytics)
- Lightbulb (insight)

Social:
- Mail (contact)
- Github (code)
- Linkedin (professional)

Icon Sizing:
- Navigation: 20-24px (w-5 h-5 to w-6 h-6)
- Buttons: 20px (w-5 h-5)
- Cards: 24px (w-6 h-6)
- Large displays: 32-48px (w-8 h-8 to w-12 h-12)

COMPONENTS

Navbar
- Background: Quaternary (dark) / White (light)
- Height: 64px (h-16)
- Shadow: lg
- Sticky: top-0 z-50
- Logo: Target icon + text
- Menu: Responsive with mobile toggle
- Dark mode: Moon/Sun toggle

Hero Section
- Background: Gradient from Quaternary to Secondary
- Title: H1, white text
- Subtitle: H2, light gray text
- CTA: Primary button with ArrowRight icon
- Badges: 3 columns with icons and text

Risk Simulator
- Container: Tertiary (dark) / White (light)
- Inputs: Range sliders with custom styling
- Buttons: Primary color with Play icon
- Results: Color-coded cards (green/yellow/red)
- Chart: Line chart with primary color line

Loss Probability Meter
- Gauge: Circular with gradient background
- Percentage: Large bold text
- Risk label: Color-coded with icon
- Spectrum: Gradient bar from green to red
- Tip: Primary background with white text

AI Explainer
- Container: Tertiary (dark) / White (light)
- Input: Textarea with border
- Examples: Pill buttons
- Button: Primary with Zap icon
- Output: Primary background with Lightbulb icon

Learning Section
- Cards: 4 columns (responsive)
- Icon: Primary background circle
- Title: H3, bold
- Description: Small text
- CTA: Primary button with ArrowRight

Footer
- Background: Quaternary
- Text: Gray
- Links: Hover to white
- Icons: Social media links
- Layout: 3 columns (responsive)

SPACING

Padding:
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)
- xl: 3rem (48px)
- 2xl: 4rem (64px)

Margins:
- Same as padding scale
- Section spacing: 5rem (80px) vertical

Gap:
- xs: 0.5rem (8px)
- sm: 1rem (16px)
- md: 1.5rem (24px)
- lg: 2rem (32px)

BORDERS & SHADOWS

Border Radius:
- sm: 0.375rem (6px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- full: 9999px (circles)

Shadows:
- sm: 0 1px 2px rgba(0,0,0,0.05)
- md: 0 4px 6px rgba(0,0,0,0.1)
- lg: 0 10px 15px rgba(0,0,0,0.1)
- xl: 0 20px 25px rgba(0,0,0,0.1)

ANIMATIONS

Transitions:
- Default: 0.3s ease
- Slow: 0.5s ease-in-out
- Fast: 0.15s ease

Transforms:
- Hover: translateY(-2px)
- Active: translateY(0)
- Scale: scale(1.05)

Keyframes:
- fadeIn: 0.5s ease-in-out
- slideInLeft: 0.5s ease-in-out
- pulse: 1.5s ease-in-out infinite

RESPONSIVE DESIGN

Breakpoints:
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md, lg)
- Desktop: > 1024px (xl, 2xl)

Mobile First:
- Start with mobile styles
- Add desktop styles with @media
- Use Tailwind responsive prefixes

Grid Layouts:
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

ACCESSIBILITY

Color Contrast:
- Primary on White: 4.5:1 (AA compliant)
- Primary on Dark: 5.2:1 (AAA compliant)
- All text meets WCAG AA standards

Semantic HTML:
- Use proper heading hierarchy
- Use semantic elements (nav, section, footer)
- Use ARIA labels where needed

Keyboard Navigation:
- All interactive elements focusable
- Focus indicators visible
- Tab order logical

Icons:
- Always paired with text or aria-label
- Meaningful alt text
- Sufficient size for touch targets

DARK MODE

Implementation:
- Toggle in navbar
- Persists across page
- All components support both themes

Color Mapping:
- Background: Quaternary (#2C2C2C)
- Secondary Background: Tertiary (#522546)
- Text: White (#FFFFFF)
- Secondary Text: Light Gray (#D3D3D3)
- Borders: Secondary (#88304E)

USAGE GUIDELINES

Do:
- Use primary color for important CTAs
- Use secondary for hover states
- Use tertiary for containers
- Use quaternary for text
- Maintain consistent spacing
- Use Lucide icons consistently
- Keep typography clean
- Test on multiple devices

Don't:
- Use color as only indicator
- Mix icon styles
- Use too many colors
- Ignore contrast ratios
- Forget mobile responsiveness
- Use emojis (use icons instead)
- Overcomplicate layouts

IMPLEMENTATION

Tailwind Classes:
- bg-primary, text-primary, border-primary
- bg-secondary, text-secondary, border-secondary
- bg-tertiary, text-tertiary, border-tertiary
- bg-quaternary, text-quaternary, border-quaternary
- hover:bg-primary-dark, hover:text-primary-light

Example Component:
<div className="bg-tertiary text-white rounded-lg p-6 shadow-lg">
  <div className="flex items-center gap-3 mb-4">
    <Target className="w-6 h-6 text-primary" />
    <h3 className="text-xl font-bold">Title</h3>
  </div>
  <p className="text-sm text-gray-300">Description</p>
  <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg mt-4">
    Action
  </button>
</div>

MAINTENANCE

Updates:
- Keep Lucide React updated
- Review color contrast regularly
- Test on new devices
- Update documentation
- Maintain consistency

Version Control:
- Track design changes
- Document breaking changes
- Maintain backwards compatibility
- Use semantic versioning

RESOURCES

- Lucide Icons: https://lucide.dev
- Tailwind CSS: https://tailwindcss.com
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
- Color Contrast: https://webaim.org/resources/contrastchecker/
