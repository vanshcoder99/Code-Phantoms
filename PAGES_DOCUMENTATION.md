Pages Documentation - Investing Fear

COMPLETE PAGE STRUCTURE

1. HOME PAGE (/)
   Location: src/pages/Home (integrated in App.js)
   Components:
   - HeroSection
   - RiskSimulator
   - LossProbabilityMeter
   - AIExplainer
   - LearningSection
   
   Features:
   - Landing page with compelling headline
   - Interactive risk simulator
   - Visual risk gauge
   - AI portfolio explainer
   - Educational content
   - Call-to-action buttons

2. DASHBOARD PAGE (/dashboard)
   Location: src/pages/Dashboard.js
   Purpose: User statistics and overview
   
   Features:
   - Total simulations count
   - Average risk level
   - Total invested amount
   - Gain/Loss statistics
   - Recent activity feed
   - Performance metrics
   
   Components:
   - Stats cards (4 columns)
   - Activity list with icons
   - Loading state
   - Mock data fallback
   
   API Integration:
   - GET /api/v1/dashboard

3. RESOURCES PAGE (/resources)
   Location: src/pages/Resources.js
   Purpose: Learning materials and guides
   
   Features:
   - Getting Started section
   - Video Tutorials section
   - Articles section
   - Community section
   - Quick Tips section
   
   Content Categories:
   - Investment Basics
   - Risk Management
   - Portfolio Building
   - Market Simulation Guide
   - AI Portfolio Analysis
   - Risk Assessment
   - Why Young Investors Fear Markets
   - Long-term vs Short-term Investing
   - Diversification Strategies
   - Discussion Forum
   - Success Stories
   - Expert Q&A
   
   Quick Tips:
   - Start Small
   - Diversify
   - Stay Consistent

4. PROFILE PAGE (/profile)
   Location: src/pages/Profile.js
   Purpose: User account management
   
   Features:
   - User information display
   - Editable profile fields
   - Settings management
   - Password change option
   - Email notifications toggle
   - Two-factor authentication
   - Logout button
   
   Editable Fields:
   - Full Name
   - Email Address
   - Risk Tolerance (Low/Medium/High)
   - Investment Goal
   - Experience Level (Beginner/Intermediate/Advanced)
   
   Settings:
   - Change Password
   - Email Notifications
   - Two-Factor Authentication

5. SIMULATION HISTORY PAGE (/history)
   Location: src/pages/SimulationHistory.js
   Purpose: View past simulations
   
   Features:
   - List of all simulations
   - Simulation details display
   - View Details button
   - Export button
   - Delete button
   - Empty state message
   - Loading state
   
   Displayed Information:
   - Date created
   - Initial amount
   - Time period
   - Risk level
   - Average result
   - Best/Worst case scenarios
   
   Actions:
   - View full simulation details
   - Export simulation data
   - Delete simulation
   
   API Integration:
   - GET /api/v1/simulations

6. ABOUT PAGE (/about)
   Location: src/pages/About.js
   Purpose: Company information
   
   Sections:
   - Hero section with mission statement
   - Mission statement
   - Core values (4 cards)
   - Team members (4 profiles)
   - Statistics section
   - Call-to-action
   
   Core Values:
   - Empathy
   - Clarity
   - Innovation
   - Community
   
   Team Members:
   - Sarah Chen (Founder & CEO)
   - Alex Kumar (Lead Developer)
   - Maya Patel (AI Specialist)
   - James Wilson (Financial Advisor)
   
   Statistics:
   - 10K+ Active Users
   - 50K+ Simulations Run
   - 95% User Satisfaction
   - Founded 2024

NAVIGATION STRUCTURE

Main Navigation Links:
- Home (/)
- Dashboard (/dashboard)
- Resources (/resources)
- History (/history)
- About (/about)
- Profile (/profile)

Mobile Navigation:
- Hamburger menu with all links
- Smooth transitions
- Touch-friendly buttons

ROUTING SETUP

React Router Configuration:
```javascript
<Router>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/resources" element={<Resources />} />
    <Route path="/profile" element={<Profile />} />
    <Route path="/history" element={<SimulationHistory />} />
    <Route path="/about" element={<About />} />
  </Routes>
</Router>
```

STYLING CONSISTENCY

All pages use:
- Professional color palette
- Lucide icons
- Tailwind CSS classes
- Dark/Light mode support
- Responsive design
- Consistent spacing
- Smooth transitions

COLOR USAGE BY PAGE

Dashboard:
- Primary: Stats cards, icons
- Tertiary: Card backgrounds
- Green: Positive metrics
- Red: Negative metrics

Resources:
- Primary: Category icons, links
- Tertiary: Card backgrounds
- Secondary: Hover states

Profile:
- Primary: Edit button, icons
- Tertiary: Card backgrounds
- Secondary: Settings items

History:
- Primary: Action buttons, icons
- Tertiary: Card backgrounds
- Risk colors: Green/Yellow/Red

About:
- Primary: Icons, buttons
- Tertiary: Card backgrounds
- Secondary: Team backgrounds

RESPONSIVE DESIGN

Mobile (< 640px):
- Single column layouts
- Full-width cards
- Stacked navigation
- Touch-friendly buttons

Tablet (640px - 1024px):
- 2 column layouts
- Optimized spacing
- Responsive grids

Desktop (> 1024px):
- Multi-column layouts
- Full feature set
- Optimized for large screens

ICONS USED BY PAGE

Dashboard:
- BarChart3 (stats)
- TrendingUp (growth)
- Activity (metrics)
- Award (achievements)
- Calendar (dates)
- DollarSign (money)

Resources:
- BookOpen (learning)
- Video (tutorials)
- FileText (articles)
- Users (community)
- ExternalLink (links)
- Zap (tips)

Profile:
- User (profile)
- Mail (email)
- Lock (password)
- Settings (settings)
- LogOut (logout)
- Edit2 (edit)
- Save (save)

History:
- Trash2 (delete)
- Eye (view)
- Download (export)
- Calendar (date)
- TrendingUp (results)

About:
- Heart (empathy)
- Target (clarity)
- Zap (innovation)
- Users (community)
- Award (achievements)
- TrendingUp (growth)

API ENDPOINTS USED

Dashboard:
- GET /api/v1/dashboard

Simulations:
- GET /api/v1/simulations

Portfolio:
- GET /api/v1/portfolios

LOADING STATES

All pages with API calls include:
- Loading spinner
- Loading message
- Fallback mock data
- Error handling

EMPTY STATES

Pages with lists include:
- Empty state message
- Helpful icon
- Call-to-action

FUTURE PAGES

Potential additions:
- Settings page (/settings)
- Notifications page (/notifications)
- Portfolio page (/portfolio)
- Community page (/community)
- Blog page (/blog)
- FAQ page (/faq)
- Contact page (/contact)

INSTALLATION & SETUP

1. Install React Router:
   npm install react-router-dom

2. Update App.js with routing

3. Create pages directory:
   mkdir src/pages

4. Create page files in src/pages/

5. Import pages in App.js

6. Update Navbar with links

7. Test all routes

BEST PRACTICES

- Use Link instead of <a> for internal navigation
- Implement loading states
- Handle errors gracefully
- Use consistent styling
- Maintain responsive design
- Test on multiple devices
- Keep pages modular
- Use reusable components

PERFORMANCE OPTIMIZATION

- Lazy load pages (optional)
- Optimize images
- Minimize API calls
- Cache data where possible
- Use React.memo for components
- Implement pagination for lists

ACCESSIBILITY

- Semantic HTML
- ARIA labels
- Keyboard navigation
- Focus indicators
- Color contrast
- Alt text for images
- Form labels

TESTING

Test each page for:
- Responsive design
- Dark/Light mode
- Navigation
- API integration
- Error states
- Loading states
- Empty states
- Form validation
