# 🪟 Windows Setup Guide - Investing Fear

## ⚡ Quick Setup (Windows)

### Step 1: Backend Setup (2 minutes)

```powershell
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies (simple version - no build issues)
pip install fastapi uvicorn groq python-dotenv

# Create .env file with your Groq API key
echo GROQ_API_KEY=your_api_key_here > .env

# Run the server
python -m uvicorn main:app --reload
```

✅ Backend running on: `http://127.0.0.1:8000`

### Step 2: Frontend Setup (1 minute)

Open a **new PowerShell window**:

```powershell
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

✅ Frontend running on: `http://localhost:3000`

### Step 3: Visit the App

Open your browser and go to: **http://localhost:3000** 🎉

---

## 🔑 Get Groq API Key

1. Visit https://console.groq.com
2. Sign up (free)
3. Create API key
4. Copy the key
5. Paste in `.env` file

---

## ✅ Verify Installation

### Backend Check
```powershell
python -c "import fastapi, uvicorn, groq; print('✅ Backend ready!')"
```

### Frontend Check
```powershell
npm --version  # Should be 8+
node --version # Should be 16+
```

---

## 🎯 Features to Try

1. **Risk Simulator** - Adjust sliders and run simulation
2. **AI Explainer** - Enter a portfolio and get AI analysis
3. **Loss Probability** - See risk gauge
4. **Learning Hub** - Read educational cards
5. **Dark Mode** - Toggle in navbar

---

## 🐛 Troubleshooting

### Backend won't start?

**Error: "uvicorn not found"**
```powershell
# Make sure venv is activated
venv\Scripts\activate

# Reinstall
pip install uvicorn
```

**Error: "GROQ_API_KEY not found"**
```powershell
# Create .env file
echo GROQ_API_KEY=your_key_here > .env

# Verify it exists
type .env
```

### Frontend won't start?

**Error: "npm not found"**
- Install Node.js from https://nodejs.org (LTS version)
- Restart PowerShell

**Error: "Port 3000 already in use"**
```powershell
# Kill the process using port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### API not responding?

- Check backend is running on port 8000
- Verify Groq API key is correct
- Check internet connection

---

## 📝 File Locations

```
C:\Users\YourName\Downloads\hack\finvasia-hack\
├── backend\
│   ├── venv\              (virtual environment)
│   ├── main.py
│   ├── requirements.txt
│   └── .env               (your API key here)
│
└── frontend\
    ├── node_modules\      (npm packages)
    ├── src\
    ├── package.json
    └── public\
```

---

## 🚀 Running Both Servers

### Terminal 1 (Backend)
```powershell
cd backend
venv\Scripts\activate
python -m uvicorn main:app --reload
```

### Terminal 2 (Frontend)
```powershell
cd frontend
npm start
```

### Terminal 3 (Optional - for testing)
```powershell
# Test API
curl http://127.0.0.1:8000/

# Should return:
# {"status":"Investing Fear API is running!","version":"1.0.0","docs":"/docs"}
```

---

## 📊 API Testing

### Test Simulation Endpoint
```powershell
$body = @{
    initial_amount = 10000
    time_period = 12
    risk_level = "medium"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://127.0.0.1:8000/api/v1/simulate-risk" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

### View API Docs
- Swagger UI: http://127.0.0.1:8000/docs
- ReDoc: http://127.0.0.1:8000/redoc

---

## 💡 Tips

1. **Keep both terminals open** - One for backend, one for frontend
2. **Auto-reload enabled** - Changes to code reload automatically
3. **Check console** - Look for errors in both terminals
4. **Clear cache** - If frontend looks weird, clear browser cache (Ctrl+Shift+Delete)
5. **Restart if needed** - Sometimes restarting both servers helps

---

## 🎉 You're Ready!

Visit http://localhost:3000 and start simulating!

---

**Questions?** Check QUICK_START.md or INVESTING_FEAR_SETUP.md for more details.
