# 🔧 Investing Fear - Backend

FastAPI + Python backend for risk simulation and AI portfolio analysis.

## 📦 Tech Stack

- **FastAPI** - Modern web framework
- **Uvicorn** - ASGI server
- **Groq** - AI API client
- **Pydantic** - Data validation
- **Python 3.8+**

## 🏗️ Project Structure

```
backend/
├── ai/
│   ├── llm_service.py      # Groq AI integration
│   ├── prompts.py          # AI prompts
│   ├── routes.py           # AI endpoints
│   ├── test_ai.py          # AI tests
│   └── __init__.py
├── routes/
│   ├── simulation.py       # Simulation endpoints
│   ├── portfolio.py        # Portfolio endpoints
│   ├── dashboard.py        # Dashboard endpoints
│   └── __init__.py
├── services/
│   ├── simulation_engine.py # Simulation logic
│   └── __init__.py
├── main.py                 # FastAPI app
├── requirements.txt        # Dependencies
├── .env                    # Environment variables
└── __init__.py
```

## 🚀 Getting Started

### 1. Setup Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Create `.env` file:
```
GROQ_API_KEY=your_api_key_here
```

### 4. Run Server

```bash
uvicorn main:app --reload
```

Server runs on: `http://127.0.0.1:8000`

## 📚 API Endpoints

### Simulation Endpoints

**POST /api/v1/simulate-risk**
- Run risk simulation
- Input: initial_amount, time_period, risk_level
- Output: best_case, worst_case, average_case, graph_data

**POST /api/v1/loss-probability**
- Calculate loss probability
- Input: risk_level
- Output: loss_probability, confidence, risk_level

**GET /api/v1/simulations**
- Get user's simulations
- Output: List of simulations

### Portfolio Endpoints

**POST /api/v1/explain-portfolio**
- Get AI explanation of portfolio
- Input: portfolio (string)
- Output: explanation, risk_score, suggestions

**GET /api/v1/portfolios**
- Get user's portfolios
- Output: List of portfolios

### Dashboard Endpoints

**GET /api/v1/dashboard**
- Get dashboard summary
- Output: total_simulations, avg_risk, recent_activity, stats

### AI Endpoints

**POST /ai/chat**
- Chat with AI
- Input: question
- Output: reply

**POST /ai/explain-portfolio**
- Explain portfolio (legacy)
- Input: portfolio
- Output: reply

**POST /ai/loss-reaction**
- Get AI reaction to loss
- Input: loss_percent
- Output: reply

**POST /ai/reset**
- Reset conversation memory
- Output: reply

## 🤖 AI Integration

### Groq LLaMA 3.1

The backend uses Groq's free LLaMA 3.1 model for:
- Portfolio explanations
- Investment Q&A
- Loss support messages
- Conversation memory

### System Prompt

```
You are FinBuddy, a friendly investment guide
for young Indian investors aged 18-25.
Talk like a helpful elder brother or sister.
Use Indian examples like chai, cricket, movies.
Keep replies under 100 words.
End with one encouraging line.
No difficult financial words.
```

## 🔧 Services

### Simulation Engine

Generates Monte Carlo simulations:
- Volatility based on risk level
- Trend calculation
- Crash probability
- Best/worst/average cases

```python
from services.simulation_engine import generate_simulation

result = generate_simulation(
    initial_amount=10000,
    time_period=12,
    risk_level='medium'
)
```

### LLM Service

Handles Groq API calls:
- Conversation history
- System prompts
- Response generation

```python
from ai.llm_service import ask_ai, explain_portfolio

explanation = explain_portfolio("50% Stocks, 30% Bonds")
```

## 🧪 Testing

### Run Tests

```bash
pytest
```

### Test AI Endpoints

```bash
python -m pytest ai/test_ai.py -v
```

### Manual Testing

Use FastAPI docs:
- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## 🔐 Security

### Input Validation
- Pydantic models validate all inputs
- Type checking
- Range validation

### Error Handling
- Try-catch blocks
- Meaningful error messages
- HTTP status codes

### CORS
- Enabled for all origins (can be restricted)
- Configurable in main.py

### API Keys
- Stored in .env (not in code)
- Never logged or exposed

## 📊 Data Models

### SimulationRequest
```python
{
    "initial_amount": float,
    "time_period": int,
    "risk_level": str  # "low", "medium", "high"
}
```

### PortfolioRequest
```python
{
    "portfolio": str  # e.g., "50% Stocks, 30% Bonds"
}
```

### LossProbabilityRequest
```python
{
    "risk_level": str  # "low", "medium", "high"
}
```

## 🚢 Deployment

### Heroku

```bash
# Create Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git push heroku main
```

### Docker

```dockerfile
FROM python:3.9-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Railway

```bash
# Connect GitHub repo
# Set GROQ_API_KEY environment variable
# Deploy
```

## 🐛 Debugging

### Enable Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Check Groq API

```bash
# Test API key
curl -H "Authorization: Bearer YOUR_KEY" https://api.groq.com/health
```

### View API Docs

- Swagger: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

## 📚 Resources

- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Groq API](https://console.groq.com)
- [Pydantic](https://docs.pydantic.dev)
- [Uvicorn](https://www.uvicorn.org)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit PR

## 📝 License

MIT License

---

**Built with ❤️ for young investors**
