# 🏗️ Investing Fear - Architecture Documentation

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React)                         │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │   Navbar     │ HeroSection  │ RiskSimulator│ AIExplainer│ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │LossProbMeter │LearningCards │   Footer     │ Dark Mode  │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
                    Axios HTTP Requests
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Backend (FastAPI)                           │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                    CORS Middleware                        ││
│  └──────────────────────────────────────────────────────────┘│
│  ┌──────────────┬──────────────┬──────────────┬────────────┐ │
│  │ Simulation   │  Portfolio   │  Dashboard   │ AI Routes  │ │
│  │  Routes      │   Routes     │   Routes     │            │ │
│  └──────────────┴──────────────┴──────────────┴────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐│
│  │              Services Layer                              ││
│  │  ┌────────────────────┐  ┌──────────────────────────┐   ││
│  │  │ Simulation Engine  │  │  Groq AI Service         │   ││
│  │  │ - Generate data    │  │  - Portfolio explanation │   ││
│  │  │ - Calculate risk   │  │  - Loss reaction         │   ││
│  │  │ - Probability calc │  │  - Q&A support           │   ││
│  │  └────────────────────┘  └──────────────────────────┘   ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
                            ↓
                    External APIs
                            ↓
                    Groq LLaMA 3.1
```

## Component Hierarchy

```
App
├── Navbar
│   ├── Logo
│   ├── Navigation Links
│   └── Dark Mode Toggle
├── HeroSection
│   ├── Title
│   ├── Subtitle
│   ├── CTA Button
│   └── Trust Badges
├── RiskSimulator
│   ├── Input Form
│   │   ├── Amount Slider
│   │   ├── Time Period Slider
│   │   └── Risk Level Buttons
│   ├── Results Display
│   │   ├── Best Case Card
│   │   ├── Average Case Card
│   │   └── Worst Case Card
│   └── Chart
│       └── LineChart (Recharts)
├── LossProbabilityMeter
│   ├── Gauge Display
│   ├── Risk Label
│   ├── Description
│   └── Risk Spectrum
├── AIExplainer
│   ├── Input Textarea
│   ├── Example Buttons
│   ├── Explain Button
│   └── Output Display
├── LearningSection
│   ├── Card 1: What is Risk?
│   ├── Card 2: Why Fear is Normal
│   ├── Card 3: How Simulation Helps
│   ├── Card 4: Long-term Wins
│   └── CTA Section
└── Footer
    ├── About
    ├── Quick Links
    └── Contact
```

## Data Flow

### Risk Simulation Flow
```
User Input (Amount, Time, Risk)
    ↓
RiskSimulator Component
    ↓
POST /api/v1/simulate-risk
    ↓
Backend: simulation_engine.py
    ↓
Generate Monte Carlo simulation
    ↓
Calculate best/worst/average cases
    ↓
Return JSON with graph_data
    ↓
Frontend: Display results + chart
```

### Portfolio Explanation Flow
```
User Input (Portfolio string)
    ↓
AIExplainer Component
    ↓
POST /api/v1/explain-portfolio
    ↓
Backend: portfolio.py
    ↓
Call Groq AI API
    ↓
AI generates explanation
    ↓
Calculate risk_score
    ↓
Return explanation + suggestions
    ↓
Frontend: Display in blue box
```

### AI Chat Flow
```
User Question
    ↓
Chat Component
    ↓
POST /ai/chat
    ↓
Backend: llm_service.py
    ↓
Add to conversation_history
    ↓
Call Groq API with full history
    ↓
AI responds with context
    ↓
Add response to history
    ↓
Return reply
    ↓
Frontend: Display message
```

## Backend Structure

### Routes Layer
- `ai/routes.py` - AI endpoints (chat, portfolio, loss reaction)
- `routes/simulation.py` - Simulation endpoints
- `routes/portfolio.py` - Portfolio analysis endpoints
- `routes/dashboard.py` - Dashboard summary endpoints

### Services Layer
- `services/simulation_engine.py` - Monte Carlo simulation logic
- `ai/llm_service.py` - Groq AI integration

### Main Entry Point
- `main.py` - FastAPI app setup, CORS, route registration

## Frontend Structure

### Components
- Reusable, self-contained React components
- Props-based configuration
- Dark mode support via props
- Responsive design with Tailwind

### Styling
- Tailwind CSS utility classes
- Custom animations in App.css
- Dark mode via conditional classes
- Mobile-first responsive design

### State Management
- React hooks (useState, useEffect)
- Local component state
- Axios for API calls

## API Response Format

All endpoints return JSON:

```json
{
  "status": "success",
  "data": {
    // Endpoint-specific data
  },
  "error": null
}
```

Error responses:
```json
{
  "detail": "Error message"
}
```

## Security Considerations

1. **CORS** - Enabled for all origins (can be restricted)
2. **Input Validation** - Pydantic models validate all inputs
3. **Error Handling** - Try-catch blocks prevent crashes
4. **API Keys** - Groq API key stored in .env (not in code)
5. **Rate Limiting** - Can be added via middleware

## Performance Optimizations

1. **Frontend**
   - Code splitting with React.lazy()
   - Memoization for expensive components
   - Lazy loading images
   - Tailwind CSS purging

2. **Backend**
   - Async/await for non-blocking operations
   - Caching for repeated requests
   - Efficient simulation algorithm

## Scalability

### Current (MVP)
- Single server instance
- In-memory data
- No database

### Future
- Database (PostgreSQL)
- User authentication
- Session management
- Caching layer (Redis)
- Load balancing
- Microservices

## Testing Strategy

### Frontend
- Unit tests for components
- Integration tests for flows
- E2E tests with Cypress

### Backend
- Unit tests for simulation engine
- Integration tests for API endpoints
- Mock Groq API for testing

## Deployment Architecture

### Frontend
```
GitHub → Vercel/Netlify → CDN → Users
```

### Backend
```
GitHub → Docker → Heroku/Railway → Users
```

## Environment Configuration

### Development
```
GROQ_API_KEY=dev_key
DEBUG=True
CORS_ORIGINS=["http://localhost:3000"]
```

### Production
```
GROQ_API_KEY=prod_key
DEBUG=False
CORS_ORIGINS=["https://investing-fear.com"]
```

## Monitoring & Logging

### Frontend
- Console logs for debugging
- Error tracking (Sentry)
- Analytics (Google Analytics)

### Backend
- Structured logging
- Error tracking
- Performance monitoring
- API usage metrics

---

**Last Updated:** April 2024
