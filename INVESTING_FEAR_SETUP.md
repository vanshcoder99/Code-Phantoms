# 🎯 Investing Fear - Complete Setup Guide

## Project Overview

**Investing Fear** is a modern web application that helps young investors overcome their fear of investing through:
- Interactive risk simulations with virtual money
- AI-powered portfolio explanations
- Visual loss probability meters
- Educational content about investing

## 🏗️ Project Structure

```
investing-fear/
├── frontend/                    # React + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js
│   │   │   ├── HeroSection.js
│   │   │   ├── RiskSimulator.js
│   │   │   ├── LossProbabilityMeter.js
│   │   │   ├── AIExplainer.js
│   │   │   ├── LearningSection.js
│   │   │   └── Footer.js
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                     # FastAPI + Python
│   ├── ai/
│   │   ├── llm_service.py      # Groq AI integration
│   │   ├── prompts.py
│   │   ├── routes.py
│   │   └── __init__.py
│   ├── routes/
│   │   ├── simulation.py        # Risk simulation endpoints
│   │   ├── portfolio.py         # Portfolio analysis endpoints
│   │   ├── dashboard.py         # Dashboard endpoints
│   │   └── __init__.py
│   ├── services/
│   │   ├── simulation_engine.py # Simulation logic
│   │   └── __init__.py
│   ├── main.py                  # Main server file
│   ├── requirements.txt
│   ├── .env
│   └── __init__.py
│
└── INVESTING_FEAR_SETUP.md      # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- Groq API Key (free at https://console.groq.com)

### Step 1: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file with your Groq API key
echo GROQ_API_KEY=your_api_key_here > .env

# Run the server
uvicorn main:app --reload
```

Backend will run on: `http://127.0.0.1:8000`

### Step 2: Frontend Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

Frontend will run on: `http://localhost:3000`

## 📚 API Endpoints

### Risk Simulation
```
POST /api/v1/simulate-risk
Body: {
  "initial_amount": 10000,
  "time_period": 12,
  "risk_level": "medium"
}
Response: {
  "best_case": 15000,
  "worst_case": 7000,
  "average_case": 11000,
  "graph_data": [...]
}
```

### Loss Probability
```
POST /api/v1/loss-probability
Body: {
  "risk_level": "medium"
}
Response: {
  "loss_probability": 35,
  "confidence": 0.85,
  "risk_level": "medium"
}
```

### Portfolio Explanation
```
POST /api/v1/explain-portfolio
Body: {
  "portfolio": "50% Stocks, 30% Bonds, 20% Gold"
}
Response: {
  "explanation": "Your portfolio is...",
  "risk_score": 0.5,
  "suggestions": "Consider..."
}
```

### AI Chat
```
POST /ai/chat
Body: {
  "question": "What is SIP?"
}
Response: {
  "reply": "SIP is..."
}
```

### Dashboard
```
GET /api/v1/dashboard
Response: {
  "total_simulations": 5,
  "avg_risk": 0.5,
  "recent_activity": [...],
  "stats": {...}
}
```

## 🎨 Frontend Features

### Components
1. **Navbar** - Navigation with dark mode toggle
2. **HeroSection** - Landing page with CTA
3. **RiskSimulator** - Interactive simulation tool
4. **LossProbabilityMeter** - Visual risk gauge
5. **AIExplainer** - Portfolio analysis
6. **LearningSection** - Educational cards
7. **Footer** - Footer with links

### Styling
- Tailwind CSS for responsive design
- Dark/Light mode support
- Smooth animations and transitions
- Mobile-first approach

## 🤖 AI Features

The backend uses **Groq's LLaMA 3.1** model for:
- Portfolio explanations in simple language
- Loss reaction support messages
- Investment Q&A
- Conversation memory

## 🔧 Configuration

### Environment Variables (.env)
```
GROQ_API_KEY=your_api_key_here
```

### Tailwind Configuration
- Customizable colors and animations
- Responsive breakpoints
- Dark mode support

## 📊 Data Flow

```
Frontend (React)
    ↓
API Calls (Axios)
    ↓
Backend (FastAPI)
    ↓
Groq AI / Simulation Engine
    ↓
Response JSON
    ↓
Frontend Display
```

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
pytest
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port $PORT" > Procfile

# Deploy
git push heroku main
```

## 🐛 Troubleshooting

### Backend not connecting
- Ensure backend is running on `http://127.0.0.1:8000`
- Check CORS is enabled
- Verify Groq API key is valid

### Frontend not loading
- Clear browser cache
- Check Node.js version (16+)
- Reinstall dependencies: `npm install`

### Groq API errors
- Verify API key in .env
- Check rate limits
- Ensure internet connection

## 📝 Future Enhancements

- [ ] User authentication
- [ ] Database persistence
- [ ] Advanced portfolio analytics
- [ ] Real market data integration
- [ ] Mobile app
- [ ] Multi-language support
- [ ] Community features

## 📄 License

MIT License - Feel free to use and modify

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for young investors**
