import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import "./App.css";

const STOCKS = [
  { id: "reliance", name: "Reliance", sector: "Energy", risk: "Medium", color: "#4FACFE", change: "+2.4%" },
  { id: "hdfc", name: "HDFC Bank", sector: "Banking", risk: "Low", color: "#00F5A0", change: "+0.8%" },
  { id: "tcs", name: "TCS", sector: "IT", risk: "Low", color: "#A78BFA", change: "+1.2%" },
  { id: "infosys", name: "Infosys", sector: "IT", risk: "Medium", color: "#FB923C", change: "-0.3%" },
  { id: "gold", name: "Gold ETF", sector: "Commodity", risk: "Low", color: "#FBBF24", change: "+0.5%" },
  { id: "nifty", name: "Nifty 50", sector: "Index", risk: "Medium", color: "#F472B6", change: "+1.7%" },
];

const QUIZ = [
  {
    emoji: "💰",
    question: "Have you ever invested money?",
    sub: "Stocks, mutual funds, or anything",
    options: ["Never tried", "Once or twice", "Yes, regularly"],
    scores: [30, 15, 0],
  },
  {
    emoji: "😰",
    question: "How scared are you of losing money?",
    sub: "Be honest — no judgement here",
    options: ["Terrified honestly", "A bit nervous", "Totally fine with it"],
    scores: [35, 20, 0],
  },
  {
    emoji: "📚",
    question: "How much do you know about investing?",
    sub: "Stocks, SIP, mutual funds etc.",
    options: ["Nothing at all", "Heard of it", "I understand basics"],
    scores: [20, 10, 0],
  },
];

function genSim(start = 100000) {
  const crash = Math.floor(Math.random() * 8) + 12;
  let v = start;
  return Array.from({ length: 31 }, (_, i) => {
    if (i === crash) v *= (1 - Math.random() * 0.15 - 0.08);
    else if (i > crash) v *= (1 + Math.random() * 0.018 - 0.003);
    else v *= (1 + Math.random() * 0.013 - 0.002);
    return { day: `D${i + 1}`, value: Math.round(v) };
  });
}

function genSIP(monthly, years) {
  return Array.from({ length: years }, (_, i) => {
    const y = i + 1;
    const invested = monthly * 12 * y;
    const total = monthly * (((Math.pow(1 + 0.01, y * 12) - 1) / 0.01) * 1.01);
    return { year: `${y}y`, invested: Math.round(invested), total: Math.round(total) };
  });
}

const FearRing = ({ score, size = 120 }) => {
  const r = 48, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const pct = score / 100;
  const color = score > 60 ? "#FF4757" : score > 30 ? "#FBBF24" : "#00F5A0";
  return (
    <svg width={size} height={size}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={circ * (1 - pct)}
        strokeLinecap="round" transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s ease, stroke 0.5s" }} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill="#F0F4FF" fontSize="22" fontWeight="800" fontFamily="Space Grotesk">{score}</text>
      <text x={cx} y={cy + 16} textAnchor="middle" fill="rgba(255,255,255,0.45)" fontSize="11" fontFamily="DM Sans">/ 100</text>
    </svg>
  );
};

export default function App() {
  const [screen, setScreen] = useState("quiz");
  const [quizStep, setQuizStep] = useState(0);
  const [fearScore, setFearScore] = useState(0);
  const [tab, setTab] = useState("home");
  const [selected, setSelected] = useState([]);
  const [aiReply, setAiReply] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [simData, setSimData] = useState([]);
  const [fullSim, setFullSim] = useState([]);
  const [simIdx, setSimIdx] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [lossReply, setLossReply] = useState("");
  const [lossLoading, setLossLoading] = useState(false);
  const [fearAfter, setFearAfter] = useState(null);
  const [sipMonthly, setSipMonthly] = useState(1000);
  const [sipYears, setSipYears] = useState(10);
  const [messages, setMessages] = useState([
    { role: "ai", text: "Namaste! 👋 I'm FinBuddy. Ask me anything about investing — no silly questions here!" }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [answers, setAnswers] = useState({});
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!simRunning) return;
    if (simIdx >= fullSim.length) { setSimRunning(false); doLossReact(); return; }
    const t = setTimeout(() => {
      setSimData(p => [...p, fullSim[simIdx]]);
      setSimIdx(i => i + 1);
    }, 90);
    return () => clearTimeout(t);
  }, [simRunning, simIdx, fullSim]);

  const answerQuiz = (idx) => {
    const q = QUIZ[quizStep];
    const newAns = { ...answers, [quizStep]: idx };
    setAnswers(newAns);
    if (quizStep < QUIZ.length - 1) {
      setQuizStep(s => s + 1);
    } else {
      const total = QUIZ.reduce((s, _, i) => s + QUIZ[i].scores[newAns[i] ?? 0], 0);
      setFearScore(Math.min(99, total));
      setScreen("app");
    }
  };

  const toggleStock = (s) => {
    setSelected(p => p.find(x => x.id === s.id)
      ? p.filter(x => x.id !== s.id)
      : p.length < 4 ? [...p, s] : p);
    setAiReply("");
  };

  const explainPortfolio = async () => {
    if (!selected.length) return;
    setAiLoading(true); setAiReply("");
    const txt = selected.map(s => `${Math.round(100 / selected.length)}% ${s.name}`).join(", ");
    try {
      const r = await axios.post("http://127.0.0.1:8000/ai/explain-portfolio", { portfolio: txt });
      setAiReply(r.data.reply);
    } catch { setAiReply("AI server offline. Run: uvicorn main:app --reload"); }
    setAiLoading(false);
  };

  const startSim = () => {
    const data = genSim();
    setFullSim(data); setSimData([data[0]]);
    setSimIdx(1); setSimRunning(true);
    setLossReply(""); setFearAfter(null);
  };

  const doLossReact = async () => {
    if (!fullSim.length) return;
    const loss = (((fullSim[0].value - fullSim[fullSim.length - 1].value) / fullSim[0].value) * 100).toFixed(1);
    setLossLoading(true);
    try {
      const r = await axios.post("http://127.0.0.1:8000/ai/loss-reaction", { loss_percent: parseFloat(loss) });
      setLossReply(r.data.reply);
    } catch { setLossReply("Market dips are normal! Every crash in history has recovered. Stay invested. 💪"); }
    setFearAfter(Math.max(12, fearScore - Math.floor(Math.random() * 18 + 12)));
    setLossLoading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    setMessages(p => [...p, { role: "user", text: chatInput }]);
    setChatInput(""); setChatLoading(true);
    try {
      const r = await axios.post("http://127.0.0.1:8000/ai/chat", { question: chatInput });
      setMessages(p => [...p, { role: "ai", text: r.data.reply }]);
    } catch { setMessages(p => [...p, { role: "ai", text: "Server offline! Run uvicorn." }]); }
    setChatLoading(false);
  };

  const sipData = genSIP(sipMonthly, sipYears);
  const sipFinal = sipData[sipData.length - 1];
  const pieData = selected.map(s => ({ name: s.name, value: Math.round(100 / selected.length) }));
  const curVal = simData.length ? simData[simData.length - 1].value : 100000;
  const pnl = curVal - 100000;
  const pnlPct = ((pnl / 100000) * 100).toFixed(1);
  const riskScore = !selected.length ? 0 : selected.every(s => s.risk === "Low") ? 22 : selected.filter(s => s.risk === "Medium").length >= 2 ? 58 : 78;

  // ── QUIZ ──
  if (screen === "quiz") {
    const q = QUIZ[quizStep];
    return (
      <div className="app dark-app">
        <div className="quiz-screen">
          <div className="quiz-dots">
            {QUIZ.map((_, i) => <div key={i} className={`qdot ${i <= quizStep ? "qdot-on" : ""} ${i < quizStep ? "qdot-done" : ""}`} />)}
          </div>
          <div className="quiz-emoji">{q.emoji}</div>
          <p className="quiz-step-lbl">Question {quizStep + 1} of {QUIZ.length}</p>
          <h2 className="quiz-title">{q.question}</h2>
          <p className="quiz-sub">{q.sub}</p>
          <div className="quiz-opts">
            {q.options.map((opt, i) => (
              <button key={i} className="quiz-opt" onClick={() => answerQuiz(i)}>
                <span className="opt-num">{String.fromCharCode(65 + i)}</span>
                {opt}
              </button>
            ))}
          </div>
          <p className="quiz-bottom">Calculating your Fear Score...</p>
        </div>
      </div>
    );
  }

  // ── MAIN APP ──
  return (
    <div className="app dark-app">
      <div className="dark-header">
        <div className="d-logo">FB</div>
        <div className="d-htxt">
          <h1>FinBuddy</h1>
          <p>Beat your investing fear</p>
        </div>
        {tab !== "home" && <button className="d-back" onClick={() => setTab("home")}>← Back</button>}
        {tab === "home" && <div className="d-fear-pill" style={{ color: fearScore > 60 ? "#FF4757" : fearScore > 30 ? "#FBBF24" : "#00F5A0" }}>😨 {fearScore}</div>}
      </div>

      {/* HOME */}
      {tab === "home" && (
        <div className="dark-scroll">
          <div className="fear-hero">
            <div className="fear-ring-wrap">
              <FearRing score={fearAfter ?? fearScore} />
              {fearAfter && <div className="fear-delta">-{fearScore - fearAfter} pts</div>}
            </div>
            <div className="fear-info">
              <p className="fear-title-txt">Your Fear Score</p>
              <p className="fear-desc-txt">
                {(fearAfter ?? fearScore) > 60 ? "High fear — let's fix this! 💪"
                  : (fearAfter ?? fearScore) > 30 ? "Getting braver! 🙌"
                  : "Confident investor! 🚀"}
              </p>
              {fearAfter && (
                <div className="fear-badge">
                  🏆 Reduced by {fearScore - fearAfter} points!
                </div>
              )}
            </div>
          </div>

          <div className="dark-grid">
            {[
              { icon: "📊", title: "Portfolio Builder", desc: "Pick stocks + AI analysis", key: "portfolio", accent: "#4FACFE" },
              { icon: "📉", title: "Risk Simulator", desc: "Live market experience", key: "simulator", accent: "#FF4757" },
              { icon: "💰", title: "SIP Calculator", desc: "See your money grow", key: "sip", accent: "#00F5A0" },
              { icon: "🤖", title: "Ask FinBuddy", desc: "AI in Hindi-English", key: "chat", accent: "#A78BFA" },
            ].map(c => (
              <div key={c.key} className="dark-card" onClick={() => setTab(c.key)}
                style={{ "--accent": c.accent }}>
                <div className="dc-icon">{c.icon}</div>
                <p className="dc-title">{c.title}</p>
                <p className="dc-desc">{c.desc}</p>
                <div className="dc-arrow" style={{ color: c.accent }}>→</div>
              </div>
            ))}
          </div>

          <div className="market-ticker">
            {STOCKS.map(s => (
              <div key={s.id} className="tick-item">
                <span className="tick-name">{s.name}</span>
                <span className="tick-change" style={{ color: s.change.startsWith("+") ? "#00F5A0" : "#FF4757" }}>{s.change}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PORTFOLIO */}
      {tab === "portfolio" && (
        <div className="dark-scroll">
          <div className="section-head">
            <h2 className="dark-title">Portfolio Builder</h2>
            <p className="dark-sub">Select up to 4 stocks. AI will analyze your picks.</p>
          </div>

          <div className="dark-stocks">
            {STOCKS.map(s => {
              const sel = !!selected.find(x => x.id === s.id);
              return (
                <div key={s.id} className={`dstock ${sel ? "dstock-sel" : ""}`}
                  style={{ "--sc": s.color, borderColor: sel ? s.color : "transparent" }}
                  onClick={() => toggleStock(s)}>
                  <div className="dstock-dot" style={{ background: s.color }} />
                  <div className="dstock-info">
                    <p className="dstock-name">{s.name}</p>
                    <p className="dstock-sector">{s.sector}</p>
                  </div>
                  <div className="dstock-right">
                    <span className="dstock-change" style={{ color: s.change.startsWith("+") ? "#00F5A0" : "#FF4757" }}>{s.change}</span>
                    <span className={`dstock-risk ${s.risk === "Low" ? "risk-l" : "risk-m"}`}>{s.risk}</span>
                  </div>
                  {sel && <div className="dstock-check" style={{ background: s.color }}>✓</div>}
                </div>
              );
            })}
          </div>

          {selected.length > 0 && (
            <>
              <div className="dpie-row">
                <PieChart width={140} height={140}>
                  <Pie data={pieData} cx={65} cy={65} innerRadius={38} outerRadius={60} dataKey="value" startAngle={90} endAngle={-270}>
                    {pieData.map((_, i) => <Cell key={i} fill={selected[i]?.color} />)}
                  </Pie>
                </PieChart>
                <div className="dpie-legend">
                  {selected.map(s => (
                    <div key={s.id} className="dl-row">
                      <span className="dl-dot" style={{ background: s.color }} />
                      <span className="dl-name">{s.name}</span>
                      <span className="dl-pct">{Math.round(100 / selected.length)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="drisk-card">
                <div className="drisk-top">
                  <span className="drisk-lbl">Risk Level</span>
                  <span className="drisk-val" style={{
                    color: riskScore < 40 ? "#00F5A0" : riskScore < 65 ? "#FBBF24" : "#FF4757"
                  }}>
                    {riskScore < 40 ? "Conservative ●" : riskScore < 65 ? "Balanced ●" : "Aggressive ●"}
                  </span>
                </div>
                <div className="drisk-track">
                  <div className="drisk-zones">
                    <div style={{ background: "#00F5A020", flex: 1 }} />
                    <div style={{ background: "#FBBF2420", flex: 1 }} />
                    <div style={{ background: "#FF475720", flex: 1 }} />
                  </div>
                  <div className="drisk-thumb" style={{ left: `calc(${riskScore}% - 8px)` }} />
                </div>
                <div className="drisk-labels">
                  <span style={{ color: "#00F5A0" }}>Low</span>
                  <span style={{ color: "#FBBF24" }}>Medium</span>
                  <span style={{ color: "#FF4757" }}>High</span>
                </div>
              </div>

              <button className="glow-btn" onClick={explainPortfolio} disabled={aiLoading}>
                {aiLoading ? <span className="btn-loading">Analyzing<span>.</span><span>.</span><span>.</span></span> : "🤖 Explain My Portfolio"}
              </button>

              {aiReply && (
                <div className="dark-ai-box">
                  <div className="dai-avatar">🤖</div>
                  <p>{aiReply}</p>
                </div>
              )}
            </>
          )}

          {!selected.length && (
            <div className="dark-hint">👆 Tap stocks above to start building</div>
          )}
        </div>
      )}

      {/* SIMULATOR */}
      {tab === "simulator" && (
        <div className="dark-scroll">
          <div className="section-head">
            <h2 className="dark-title">Risk Simulator</h2>
            <p className="dark-sub">₹1,00,000 virtual money — real market behavior</p>
          </div>

          <div className="sim-stats">
            <div className="sim-stat">
              <p className="ss-lbl">Starting</p>
              <p className="ss-val">₹1,00,000</p>
            </div>
            <div className="sim-stat">
              <p className="ss-lbl">Current</p>
              <p className="ss-val">₹{curVal.toLocaleString("en-IN")}</p>
            </div>
            <div className="sim-stat" style={{ background: pnl >= 0 ? "rgba(0,245,160,0.1)" : "rgba(255,71,87,0.1)" }}>
              <p className="ss-lbl">P&L</p>
              <p className="ss-val" style={{ color: pnl >= 0 ? "#00F5A0" : "#FF4757" }}>
                {pnl >= 0 ? "+" : ""}{pnlPct}%
              </p>
            </div>
          </div>

          <div className="dark-chart-box">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={simData} margin={{ top: 8, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={pnl >= 0 ? "#00F5A0" : "#FF4757"} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={pnl >= 0 ? "#00F5A0" : "#FF4757"} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fontSize: 9, fill: "#8892A4" }} interval={5} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 9, fill: "#8892A4" }} width={42} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: "#1A2035", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12, color: "#F0F4FF" }}
                  formatter={v => [`₹${v.toLocaleString("en-IN")}`, "Value"]}
                />
                <Area type="monotone" dataKey="value"
                  stroke={pnl >= 0 ? "#00F5A0" : "#FF4757"}
                  fill="url(#simGrad)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <button className="glow-btn" onClick={startSim} disabled={simRunning}
            style={{ "--gbg": simRunning ? "#333" : "linear-gradient(135deg,#FF4757,#C0392B)" }}>
            {simRunning ? "⏳ Market is live..." : simData.length > 1 ? "🔄 Run Again" : "▶ Start Simulation"}
          </button>

          {fearAfter !== null && (
            <div className="fear-result">
              <p className="fr-head">🎯 Your Fear Score Changed!</p>
              <div className="fr-scores">
                <div className="fr-s">
                  <p className="fr-lbl">Before</p>
                  <div className="fr-ring-sm">
                    <FearRing score={fearScore} size={80} />
                  </div>
                </div>
                <div className="fr-arrow">→</div>
                <div className="fr-s">
                  <p className="fr-lbl">After</p>
                  <FearRing score={fearAfter} size={80} />
                </div>
              </div>
              <p className="fr-msg">Fear reduced by <strong style={{ color: "#00F5A0" }}>{fearScore - fearAfter} points</strong> after experiencing a real crash safely!</p>
            </div>
          )}

          {lossLoading && <div className="dark-ai-box"><div className="dai-avatar">🤖</div><p>Analyzing your market experience...</p></div>}
          {lossReply && !lossLoading && <div className="dark-ai-box"><div className="dai-avatar">🤖</div><p>{lossReply}</p></div>}
        </div>
      )}

      {/* SIP */}
      {tab === "sip" && (
        <div className="dark-scroll">
          <div className="section-head">
            <h2 className="dark-title">SIP Calculator</h2>
            <p className="dark-sub">The magic of ₹500/month over time</p>
          </div>

          <div className="sip-cards">
            <div className="sip-ctrl-card">
              <div className="scc-top">
                <span className="scc-lbl">Monthly SIP</span>
                <span className="scc-val">₹{sipMonthly.toLocaleString("en-IN")}</span>
              </div>
              <input type="range" min="500" max="50000" step="500" value={sipMonthly}
                onChange={e => setSipMonthly(Number(e.target.value))} className="dark-slider" />
              <div className="scc-ends"><span>₹500</span><span>₹50k</span></div>
            </div>
            <div className="sip-ctrl-card">
              <div className="scc-top">
                <span className="scc-lbl">Duration</span>
                <span className="scc-val">{sipYears} years</span>
              </div>
              <input type="range" min="1" max="30" step="1" value={sipYears}
                onChange={e => setSipYears(Number(e.target.value))} className="dark-slider" />
              <div className="scc-ends"><span>1 yr</span><span>30 yrs</span></div>
            </div>
          </div>

          <div className="sip-result-row">
            <div className="sip-rcard">
              <p className="sr-lbl">Total Invested</p>
              <p className="sr-val">₹{sipFinal?.invested.toLocaleString("en-IN")}</p>
            </div>
            <div className="sip-rcard accent-card">
              <p className="sr-lbl">Final Value</p>
              <p className="sr-val" style={{ color: "#00F5A0" }}>₹{sipFinal?.total.toLocaleString("en-IN")}</p>
            </div>
            <div className="sip-rcard">
              <p className="sr-lbl">Returns</p>
              <p className="sr-val" style={{ color: "#00F5A0" }}>
                +{sipFinal ? Math.round(((sipFinal.total - sipFinal.invested) / sipFinal.invested) * 100) : 0}%
              </p>
            </div>
          </div>

          <div className="dark-chart-box">
            <div className="chart-legend">
              <span><span className="cl-dot" style={{ background: "#8892A4" }} />Invested</span>
              <span><span className="cl-dot" style={{ background: "#00F5A0" }} />Returns</span>
            </div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={sipData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="sipG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00F5A0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00F5A0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fontSize: 9, fill: "#8892A4" }} interval={Math.max(1, Math.floor(sipYears / 5))} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => v >= 100000 ? `₹${Math.round(v / 100000)}L` : `₹${Math.round(v / 1000)}k`} tick={{ fontSize: 9, fill: "#8892A4" }} width={42} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "#1A2035", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, fontSize: 12, color: "#F0F4FF" }} formatter={v => [`₹${Math.round(v).toLocaleString("en-IN")}`, ""]} />
                <Area type="monotone" dataKey="invested" stroke="#8892A4" fill="rgba(136,146,164,0.1)" strokeWidth={1.5} dot={false} />
                <Area type="monotone" dataKey="total" stroke="#00F5A0" fill="url(#sipG)" strokeWidth={2.5} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="sip-insight-dark">
            <span style={{ fontSize: 20 }}>💡</span>
            <p>Starting at 20, investing ₹{sipMonthly.toLocaleString("en-IN")}/month for {sipYears} years gives you <strong style={{ color: "#00F5A0" }}>₹{sipFinal?.total.toLocaleString("en-IN")}</strong> by age {20 + sipYears}!</p>
          </div>
        </div>
      )}

      {/* CHAT */}
      {tab === "chat" && (
        <>
          <div className="dark-chat" ref={chatRef}>
            {messages.map((m, i) => (
              <div key={i} className={`dmsg ${m.role}`}>
                {m.role === "ai" && <div className="dav">🤖</div>}
                <div className={`dbubble ${m.role}`}>{m.text}</div>
              </div>
            ))}
            {chatLoading && (
              <div className="dmsg ai">
                <div className="dav">🤖</div>
                <div className="dbubble ai loading"><span>.</span><span>.</span><span>.</span></div>
              </div>
            )}
          </div>
          <div className="dark-input">
            <input value={chatInput} onChange={e => setChatInput(e.target.value)}
              onKeyPress={e => e.key === "Enter" && sendChat()}
              placeholder="Ask anything..." />
            <button onClick={sendChat}>↑</button>
          </div>
        </>
      )}
    </div>
  );
}