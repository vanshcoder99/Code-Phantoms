# ⚡ Quick Start - Investing Fear

Get the app running in 5 minutes!

## 1️⃣ Get Groq API Key (2 min)

1. Go to https://console.groq.com
2. Sign up (free)
3. Create API key
4. Copy the key

## 2️⃣ Backend Setup (2 min)

```bash
cd backend

# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Install & Run
pip install -r requirements.txt
echo GROQ_API_KEY=your_key_here > .env
uvicorn main:app --reload
```

✅ Backend running on `http://127.0.0.1:8000`

## 3️⃣ Frontend Setup (1 min)

```bash
cd frontend
npm install
npm start
```

✅ Frontend running on `http://localhost:3000`

## 🎉 Done!

Visit `http://localhost:3000` and start simulating!

## 📝 Features to Try

1. **Risk Simulator** - Adjust sliders and run simulation
2. **AI Explainer** - Enter a portfolio and get AI analysis
3. **Loss Probability** - See risk gauge
4. **Learning Hub** - Read about investing
5. **Dark Mode** - Toggle in navbar

## 🆘 Troubleshooting

**Backend not connecting?**
- Check backend is running on port 8000
- Verify Groq API key in .env

**Frontend not loading?**
- Clear browser cache
- Check Node.js version: `node --version` (need 16+)

**Groq API error?**
- Verify API key is correct
- Check internet connection

## 📚 Next Steps

- Read `INVESTING_FEAR_SETUP.md` for detailed setup
- Read `ARCHITECTURE.md` for system design
- Check API endpoints in `INVESTING_FEAR_SETUP.md`

---

**Questions?** Check the docs or open an issue!
