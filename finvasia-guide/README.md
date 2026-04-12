# 🤖 FinBuddy — AI Investment Fear Reducer
### Built at Finvasia Hackathon by [Your Name] — Member 3 (AI Engineer)

---

## 🎯 What Is This Project? (Explain Like I'm 8th Standard)

Imagine you have ₹1,00,000 and want to invest it.
But you're **scared**. What if you lose it all?

**FinBuddy** fixes that fear. How?

```
Step 1 → App asks you 3 questions
         → Calculates your "Fear Score" out of 100

Step 2 → You practice investing with FAKE money
         → No real money. Zero risk.

Step 3 → You see market crash in simulation
         → AI friend explains "bhai this is normal!"

Step 4 → Your Fear Score drops
         → You feel confident to invest real money
```

**That's it. Simple but powerful.**

---

## 🏗️ What Did We Build? (3 Parts)

```
PART 1 — Frontend (What you SEE)
         Built with: React.js
         Like: The face of the app
         Who built it: Member 1

PART 2 — Backend (The ENGINE)
         Built with: Python + FastAPI
         Like: The brain behind the scenes
         Who built it: Member 2

PART 3 — AI Module (The SMART PART) ← THIS IS MY WORK
         Built with: Python + Groq AI
         Like: The friend who explains everything
         Who built it: Member 3 (Me!)
```

---

## 🤖 What I (Member 3) Built Specifically

I built the **AI brain** of the app. Here's what it does:

### Feature 1 — Portfolio Explainer
```
User picks stocks → I send it to AI → AI explains in simple Hindi-English

Example:
User picks: 40% Reliance, 40% HDFC, 20% Gold
AI says: "Bhai, your portfolio is like a balanced thali!
          Reliance is like chai — everyone needs it.
          HDFC is your safe piggy bank..."
```

### Feature 2 — Loss Reaction
```
User's fake money drops 15% → I send to AI → AI reacts warmly

AI says: "Arre, 15% fall hai, kya khushi hai? Don't panic!
          This is like cricket — sometimes you lose a wicket.
          But the match isn't over. Stay invested!"
```

### Feature 3 — FinBuddy Chatbot
```
User asks ANY investing question → AI answers simply

User: "What is SIP?"
AI: "SIP is like paying your Netflix subscription monthly.
     Instead of Netflix, you invest ₹500/month in stocks.
     Over 10 years, that ₹500 becomes ₹10 lakhs!"
```

### Feature 4 — Memory
```
AI remembers the whole conversation!
Like WhatsApp — it knows what you said before.
So answers make sense in context.
```

---

## 📁 Folder Structure (What File Does What)

```
finvasia-hack/
│
├── 📁 backend/                 ← Python AI Server (MY WORK)
│   ├── .env                    ← Secret API key (NEVER share this)
│   ├── requirements.txt        ← List of Python libraries needed
│   ├── main.py                 ← Starts the server
│   └── ai/
│       ├── llm_service.py      ← MAIN FILE — talks to Groq AI
│       ├── routes.py           ← Creates API endpoints
│       └── test_ai.py          ← Tests if AI is working
│
└── 📁 frontend/                ← React App (Member 1's work)
    └── src/
        ├── App.js              ← Main app with all screens
        └── App.css             ← All styling/design
```

---

## 🔧 Technologies Used

| Technology | What It Is | Why We Used It |
|---|---|---|
| **React.js** | JavaScript framework | Build the beautiful UI |
| **FastAPI** | Python web framework | Create AI server |
| **Groq API** | Free AI service | Powers FinBuddy brain |
| **Recharts** | Chart library | Show market graphs |
| **Axios** | HTTP client | Frontend talks to backend |
| **python-dotenv** | Secret manager | Keep API key safe |
| **uvicorn** | Server runner | Run FastAPI server |

---

## 🚀 How to Run This Project (Step by Step)

### Requirements
- Python installed (type `python --version` in terminal)
- Node.js installed (type `node --version` in terminal)
- VS Code installed
- Internet connection

---

### STEP 1 — Get the Project
Download and unzip the project folder.
Open VS Code → File → Open Folder → Select `finvasia-hack`

---

### STEP 2 — Get Free AI API Key
```
1. Go to: console.groq.com
2. Sign up with Google account (FREE)
3. Click "API Keys" → "Create API Key"
4. Copy the key (looks like: gsk_xxxxxxxxxxxx)
```

---

### STEP 3 — Setup Backend (AI Server)

Open Terminal in VS Code (`Ctrl + ~`)

```bash
cd backend
pip install -r requirements.txt
```

Create `.env` file in backend folder:
```
GROQ_API_KEY=paste-your-groq-key-here
```

---

### STEP 4 — Start AI Server

```bash
cd backend
uvicorn main:app --reload
```

You should see:
```
INFO: Uvicorn running on http://127.0.0.1:8000 ✅
```

**Keep this terminal open!**

---

### STEP 5 — Setup Frontend (React App)

Open a **NEW terminal** (click + button in terminal panel)

```bash
cd frontend
npm install
npm start
```

Browser opens at `http://localhost:3000` 🎉

---

### STEP 6 — Use the App!

```
Both terminals must be running at same time:
Terminal 1 → uvicorn main:app --reload  (AI Server)
Terminal 2 → npm start                   (React App)
```

---

## 🌐 API Endpoints (For Developers)

These are the 4 "doors" that frontend uses to talk to AI:

| Endpoint | Method | What It Does | Example Input |
|---|---|---|---|
| `/ai/chat` | POST | Answer any question | `{"question": "What is SIP?"}` |
| `/ai/explain-portfolio` | POST | Explain stocks | `{"portfolio": "40% Reliance"}` |
| `/ai/loss-reaction` | POST | React to loss | `{"loss_percent": 15}` |
| `/ai/reset` | POST | Clear AI memory | `{}` |

Test them at: `http://127.0.0.1:8000/docs`

---

## 📱 App Screens

```
1. Quiz Screen      → 3 questions → calculates Fear Score
2. Home Screen      → Fear Score ring + 4 feature cards
3. Portfolio Builder → Pick stocks + AI explanation + pie chart
4. Risk Simulator   → Watch ₹1,00,000 move in fake market
5. SIP Calculator   → See ₹500/month grow over 10-30 years
6. FinBuddy Chat    → WhatsApp-style AI chatbot
```

---

## 💡 Key Concepts Explained Simply

**What is an API?**
> Like a waiter in a restaurant. Frontend (customer) tells waiter what it wants. Waiter goes to kitchen (backend/AI) and brings back the food (response).

**What is FastAPI?**
> Software that creates the "waiter". It listens for requests and sends back responses.

**What is Groq?**
> A free AI service (like ChatGPT but free). We send it questions, it sends back smart answers.

**What is React?**
> JavaScript tool for building beautiful websites with buttons, animations, and live updates.

**What is an API Key?**
> Like a password that proves we're allowed to use Groq AI. Keep it secret!

**What is uvicorn?**
> The thing that "runs" our Python server. Like pressing Play on a video.

---

## ⚠️ Common Problems & Fixes

| Problem | Fix |
|---|---|
| `pip not found` | Install Python from python.org |
| `npm not found` | Install Node.js from nodejs.org |
| `API key invalid` | Check .env file has correct Groq key |
| `Connection refused` | Make sure uvicorn is running in Terminal 1 |
| `Oops something went wrong` | Restart uvicorn server |
| `Module not found` | Run `pip install -r requirements.txt` again |

---

## 🏆 What Makes This Special

```
✅ Real AI — not hardcoded responses
✅ Hinglish — talks like a real Indian friend
✅ Fear Score — measurable impact (unique feature!)
✅ SIP Calculator — shows power of investing early
✅ Dark UI — looks like professional fintech app
✅ Free to run — no money needed for API
```

---

## 📊 Problem → Solution

```
PROBLEM:  67% of Indian youth never invest due to fear
SOLUTION: Let them experience loss SAFELY with fake money
          + AI explains everything in simple language
          + Fear Score shows measurable confidence growth
RESULT:   User goes from scared → confident → ready to invest
```

---

*Built with ❤️ at Finvasia University Hackathon*
*Member 3 — AI Engineer*
