import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Brain, Shield, Zap, CheckCircle, RotateCcw, AlertTriangle, Sparkles, Play, Clock, Award, Target } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { gsap } from 'gsap';

const questions = [
  {
    id: 1,
    question: "When the stock market drops 10% in a week, what do you feel?",
    emoji: "📉",
    options: [
      { text: "Panic! I want to sell everything", score: 25 },
      { text: "Worried, but I'll wait and watch", score: 15 },
      { text: "It's normal, I'll hold my investments", score: 5 },
      { text: "Great! Time to buy more at a discount", score: 0 },
    ]
  },
  {
    id: 2,
    question: "How much of your savings would you invest in stocks?",
    emoji: "💰",
    options: [
      { text: "Nothing — too risky", score: 25 },
      { text: "Less than 20% — play it safe", score: 15 },
      { text: "30–50% — balanced approach", score: 8 },
      { text: "More than 50% — I believe in growth", score: 2 },
    ]
  },
  {
    id: 3,
    question: "Your friend made ₹50,000 in crypto. Your reaction?",
    emoji: "🚀",
    options: [
      { text: "That's gambling, not investing", score: 20 },
      { text: "Interesting, but I'd never try it", score: 15 },
      { text: "Maybe I should learn about it", score: 8 },
      { text: "I should have invested too!", score: 3 },
    ]
  },
  {
    id: 4,
    question: "How do you feel about investing money you might need in 5 years?",
    emoji: "⏳",
    options: [
      { text: "Never! What if I lose it all?", score: 25 },
      { text: "Only in FDs or savings accounts", score: 15 },
      { text: "I'd put some in mutual funds", score: 8 },
      { text: "I'd diversify across stocks and funds", score: 3 },
    ]
  },
  {
    id: 5,
    question: "What do you know about investing?",
    emoji: "📚",
    options: [
      { text: "Almost nothing — it scares me", score: 25 },
      { text: "Basic concepts like FD, SIP", score: 15 },
      { text: "I understand stocks and mutual funds", score: 5 },
      { text: "I can analyze companies and markets", score: 0 },
    ]
  },
];

function getResult(score) {
  if (score >= 80) return {
    level: "High Fear",
    color: "#EF4444",
    emoji: "😰",
    message: "You have significant investing anxiety — and that's totally okay! You're in the right place. Our simulator will help you understand risk without any real money on the line.",
    recommendation: "Start with our Risk Simulator to see how investments behave over time. Knowledge is your superpower!",
    gradient: "from-red-500 to-orange-500",
  };
  if (score >= 50) return {
    level: "Moderate Fear",
    color: "#F59E0B",
    emoji: "🤔",
    message: "You have a healthy respect for risk, but some anxiety is holding you back. With the right tools, you can turn that caution into smart decision-making.",
    recommendation: "Try our AI Portfolio Explainer to understand different investment options in simple language.",
    gradient: "from-yellow-500 to-orange-400",
  };
  if (score >= 25) return {
    level: "Low Fear",
    color: "#10B981",
    emoji: "😎",
    message: "You're already fairly comfortable with investing concepts. A bit more practice and you'll be making confident decisions!",
    recommendation: "Use the advanced simulation with high-risk scenarios to test your strategies.",
    gradient: "from-green-500 to-emerald-400",
  };
  return {
    level: "Fearless Investor",
    color: "#2563EB",
    emoji: "🦁",
    message: "Impressive! You understand that investing involves risk and you're ready to embrace it. Our tools can help you optimize your strategy.",
    recommendation: "Dive into the ML Investor Profile Predictor on your Dashboard for personalized allocation advice.",
    gradient: "from-blue-500 to-cyan-400",
  };
}

const STORAGE_KEY = 'fearQuiz_progress';
const HISTORY_KEY = 'fearQuizHistory';
const COMPLETED_KEY = 'fearQuiz_lastResult';

function saveProgress(currentQ, answers, selectedOption) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      currentQ, answers, selectedOption,
      timestamp: Date.now(),
      isQuizStarted: true
    }));
  } catch (e) { /* ignore */ }
}

function loadProgress() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data && data.isQuizStarted && data.answers && data.answers.length > 0) {
      if (Date.now() - data.timestamp < 86400000) return data;
    }
  } catch (e) { /* ignore */ }
  return null;
}

function clearProgress() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
}

function saveToHistory(score, level) {
  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    history.push({ score, level, date: new Date().toISOString() });
    if (history.length > 20) history.splice(0, history.length - 20);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) { /* ignore */ }
}

function saveLastResult(score, level) {
  try {
    localStorage.setItem(COMPLETED_KEY, JSON.stringify({ score, level, date: new Date().toISOString() }));
  } catch (e) { /* ignore */ }
}

function loadLastResult() {
  try {
    return JSON.parse(localStorage.getItem(COMPLETED_KEY));
  } catch (e) { return null; }
}

function getAttemptCount() {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]').length;
  } catch { return 0; }
}

// ─── QUIZ LIFECYCLE STATES ───
// 'landing'  → user just navigated here, hasn't started
// 'resuming' → user has in-progress quiz, offered to resume
// 'active'   → user is actively taking the quiz
// 'result'   → quiz completed, showing results

export default function FearQuiz({ darkMode }) {
  const [quizState, setQuizState] = useState('landing'); // GATE: nothing runs until user clicks
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [showConfirmRestart, setShowConfirmRestart] = useState(false);
  const [savedProgress, setSavedProgress] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // ─── ON MOUNT: determine which state to show ───
  // This does NOT auto-start the quiz. It only decides
  // which screen to render.
  useEffect(() => {
    const progress = loadProgress();
    const lastResult = loadLastResult();

    if (progress && progress.answers.length > 0 && progress.currentQ < questions.length) {
      // Has in-progress quiz → show resume offer
      setSavedProgress(progress);
      setQuizState('resuming');
    } else if (lastResult) {
      // Has completed quiz → show result with retake option
      setQuizState('result');
      setAnswers([]); // Clear — we use lastResult for display
    } else {
      // Fresh user → show landing page
      setQuizState('landing');
    }
    // eslint-disable-next-line
  }, []);

  // ─── SAVE progress ONLY when quiz is active ───
  useEffect(() => {
    if (quizState === 'active' && currentQ > 0) {
      saveProgress(currentQ, answers, selectedOption);
    }
  }, [currentQ, answers, selectedOption, quizState]);

  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const result = quizState === 'result' && answers.length === 0
    ? getResult(loadLastResult()?.score || 0)
    : getResult(totalScore);
  const displayScore = quizState === 'result' && answers.length === 0
    ? (loadLastResult()?.score || 0)
    : totalScore;
  const progress = ((currentQ) / questions.length) * 100;

  // ─── USER ACTIONS ───
  const startQuiz = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    clearProgress();
    setQuizState('active');
  };

  const resumeQuiz = () => {
    if (savedProgress) {
      setCurrentQ(savedProgress.currentQ);
      setAnswers(savedProgress.answers);
      setSelectedOption(savedProgress.selectedOption);
      setQuizState('active');
    }
  };

  const handleSelect = (score) => {
    setSelectedOption(score);
  };

  const handleNext = () => {
    if (selectedOption === null) return;
    setAnimating(true);

    setTimeout(() => {
      const newAnswers = [...answers, selectedOption];
      setAnswers(newAnswers);

      if (currentQ + 1 >= questions.length) {
        const finalScore = newAnswers.reduce((sum, a) => sum + a, 0);
        const finalResult = getResult(finalScore);
        saveToHistory(finalScore, finalResult.level);
        saveLastResult(finalScore, finalResult.level);
        clearProgress();
        setQuizState('result');
      } else {
        setCurrentQ(currentQ + 1);
      }
      setSelectedOption(null);
      setAnimating(false);
    }, 300);
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setAnimating(true);
      setTimeout(() => {
        const newAnswers = answers.slice(0, -1);
        setAnswers(newAnswers);
        setCurrentQ(currentQ - 1);
        setSelectedOption(null);
        setAnimating(false);
      }, 300);
    }
  };

  const handleRetake = () => {
    setShowConfirmRestart(true);
  };

  const confirmRetake = () => {
    setShowConfirmRestart(false);
    startQuiz();
  };

  // ─── CONFIRMATION MODAL ───
  const ConfirmModal = () => (
    <div className="modal-overlay" onClick={() => setShowConfirmRestart(false)}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-500 bg-opacity-20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            Retake Quiz?
          </h3>
        </div>
        <p className={`text-sm mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          This will start a fresh quiz. Your previous score is saved in your history.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setShowConfirmRestart(false)}
            className={`flex-1 py-2.5 rounded-xl font-medium transition ${
              darkMode ? 'bg-secondary text-gray-300 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={confirmRetake}
            className="flex-1 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Yes, Retake
          </button>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════
  //  STATE 1: LANDING PAGE — Quiz has NOT started
  //  User must click "Start Quiz" to begin
  // ═══════════════════════════════════════════
  if (quizState === 'landing') {
    const attemptCount = getAttemptCount();
    return (
      <div style={{ minHeight: '100vh', background: darkMode ? 'linear-gradient(180deg, #050A18 0%, #0F172A 100%)' : '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(37,99,235,0.1), transparent)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '960px', width: '100%', position: 'relative', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center' }}>
          {/* Left: Images */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 260, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
              <img src="/img-fear.png" alt="Overcome Fear" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 20%, ${darkMode ? 'rgba(5,10,24,0.85)' : 'rgba(255,255,255,0.8)'} 100%)` }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 999, background: 'rgba(37,99,235,0.15)', border: '1px solid rgba(37,99,235,0.2)', marginBottom: 8 }}>
                  <Target style={{ width: 12, height: 12, color: '#3B82F6' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em' }}>AI Assessment</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: darkMode ? '#94A3B8' : '#64748B', lineHeight: 1.5 }}>Understand your relationship with money and risk</p>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: 130, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                <img src="/img-risk.png" alt="Risk" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 30%, ${darkMode ? 'rgba(5,10,24,0.9)' : 'rgba(255,255,255,0.85)'} 100%)` }} />
                <p style={{ position: 'absolute', bottom: 10, left: 12, fontSize: '0.75rem', fontWeight: 700, color: darkMode ? '#E2E8F0' : '#1E293B' }}>Risk Analysis</p>
              </div>
              <div style={{ borderRadius: 16, overflow: 'hidden', position: 'relative', height: 130, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
                <img src="/img-ai.png" alt="AI" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 30%, ${darkMode ? 'rgba(5,10,24,0.9)' : 'rgba(255,255,255,0.85)'} 100%)` }} />
                <p style={{ position: 'absolute', bottom: 10, left: 12, fontSize: '0.75rem', fontWeight: 700, color: darkMode ? '#E2E8F0' : '#1E293B' }}>AI Insights</p>
              </div>
            </div>
          </div>

          {/* Right: Quiz Info */}
          <div style={{ background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.95)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 28, padding: '40px 36px', backdropFilter: 'blur(16px)', animation: 'revealSection 0.6s ease-out' }}>
            <div style={{ width: 56, height: 56, margin: '0 auto 20px', borderRadius: 16, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(37,99,235,0.35)' }}>
              <Brain style={{ width: 28, height: 28, color: '#fff' }} />
            </div>

            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 8, textAlign: 'center' }}>Fear Score Assessment</h1>
            <p style={{ color: darkMode ? '#64748B' : '#94A3B8', marginBottom: 20, fontSize: '0.95rem', textAlign: 'center' }}>Discover your investing fear level in 60 seconds</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 24 }}>
              {[{ icon: Clock, text: '~60 sec' }, { icon: Zap, text: '5 questions' }, ...(attemptCount > 0 ? [{ icon: Award, text: `${attemptCount}x` }] : [])].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.78rem', color: darkMode ? '#475569' : '#94A3B8', fontWeight: 500 }}>
                  <item.icon style={{ width: 13, height: 13 }} /><span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Feature highlights */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { icon: Shield, text: 'Personalized risk profile', color: '#10B981' },
                { icon: Brain, text: 'AI-powered recommendations', color: '#3B82F6' },
                { icon: Sparkles, text: 'Track your progress over time', color: '#8B5CF6' },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 12, background: darkMode ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'}` }}>
                  <f.icon style={{ width: 16, height: 16, color: f.color, flexShrink: 0 }} />
                  <span style={{ fontSize: '0.82rem', color: darkMode ? '#94A3B8' : '#64748B', fontWeight: 500 }}>{f.text}</span>
                </div>
              ))}
            </div>

            <button onClick={startQuiz} style={{ width: '100%', padding: '16px', borderRadius: 16, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', fontWeight: 700, fontSize: '1.05rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 32px rgba(37,99,235,0.35)', transition: 'all 0.3s', fontFamily: 'inherit' }}>
              <Play style={{ width: 18, height: 18 }} /> Start Quiz
            </button>

            {attemptCount > 0 && <p style={{ fontSize: '0.72rem', marginTop: 12, color: darkMode ? '#334155' : '#CBD5E1', textAlign: 'center' }}>Taken {attemptCount} time{attemptCount > 1 ? 's' : ''} before</p>}
          </div>
        </div>

        <style>{`@media(max-width:768px){div[style*="grid-template-columns: 1fr 1fr"]{grid-template-columns:1fr!important;}}`}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  STATE 2: RESUME BANNER — Has in-progress quiz
  //  User chooses to resume or start fresh
  // ═══════════════════════════════════════════
  if (quizState === 'resuming') {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center px-4`}>
        <div className="max-w-lg w-full">
          <div
            className={`p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'}`}
            style={{ animation: 'revealSection 0.5s ease-out' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                Welcome Back!
              </h2>
            </div>
            <p className={`mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              You have an unfinished quiz from earlier.
            </p>
            <p className={`mb-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              Progress: Question {(savedProgress?.currentQ || 0) + 1} of {questions.length} • 
              {' '}{savedProgress?.answers?.length || 0} answered
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={resumeQuiz}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition hover:scale-105"
              >
                <ArrowRight className="w-5 h-5" />
                Continue Quiz
              </button>
              <button
                onClick={startQuiz}
                className={`flex-1 py-3.5 rounded-xl font-bold transition hover:scale-105 ${
                  darkMode ? 'bg-secondary text-white hover:bg-quaternary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Start Fresh
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  //  STATE 3: RESULT — Quiz completed
  //  Shows score + retake option (with confirmation)
  // ═══════════════════════════════════════════
  if (quizState === 'result') {
    return (
      <div style={{ minHeight: '100vh', background: darkMode ? 'linear-gradient(180deg, #050A18 0%, #0F172A 100%)' : '#F8FAFC', padding: '32px 16px', position: 'relative', overflow: 'hidden' }}>
        {showConfirmRestart && <ConfirmModal />}
        <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: `radial-gradient(circle, ${result.color}15, transparent)`, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div style={{ background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.95)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`, borderRadius: '28px', padding: '40px 36px', backdropFilter: 'blur(16px)', textAlign: 'center', animation: 'resultFadeIn 0.6s ease-out' }}>
            {/* Score Circle */}
            <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 24px' }}>
              <svg width="140" height="140" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke={darkMode ? 'rgba(255,255,255,0.05)' : '#e5e7eb'} strokeWidth="8" />
                <circle cx="64" cy="64" r="56" fill="none" stroke={result.color} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(displayScore / 120) * 352} 352`} style={{ transition: 'stroke-dasharray 1.5s ease-out', filter: `drop-shadow(0 0 8px ${result.color}60)` }} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '2rem' }}>{result.emoji}</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#1E293B' }}>{displayScore}</span>
                <span style={{ fontSize: '0.7rem', color: darkMode ? '#475569' : '#94A3B8' }}>/ 120</span>
              </div>
            </div>

            <div style={{ display: 'inline-block', padding: '6px 20px', borderRadius: 999, color: '#fff', fontWeight: 700, fontSize: '0.85rem', marginBottom: 20, background: `linear-gradient(135deg, ${result.color}, ${result.color}CC)`, boxShadow: `0 4px 16px ${result.color}40` }}>
              {result.level}
            </div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 12 }}>Your Fear Score Analysis</h2>
            <p style={{ marginBottom: 20, lineHeight: 1.7, color: darkMode ? '#94A3B8' : '#64748B', fontSize: '0.95rem' }}>{result.message}</p>

            {/* Recommendation */}
            <div style={{ padding: '16px 20px', borderRadius: 16, background: darkMode ? 'rgba(37,99,235,0.06)' : 'rgba(37,99,235,0.04)', border: `1px solid ${darkMode ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.08)'}`, borderLeft: `4px solid ${result.color}`, textAlign: 'left', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <Sparkles style={{ width: 18, height: 18, flexShrink: 0, marginTop: 2, color: '#3B82F6' }} />
                <div>
                  <p style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 4, color: darkMode ? '#F1F5F9' : '#1E293B' }}>Recommended Next Step</p>
                  <p style={{ fontSize: '0.85rem', color: darkMode ? '#94A3B8' : '#64748B', lineHeight: 1.6 }}>{result.recommendation}</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')} style={{ flex: 1, padding: '14px', borderRadius: 14, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 24px rgba(37,99,235,0.3)', fontFamily: 'inherit' }}>
                {isAuthenticated ? <><Sparkles style={{ width: 16, height: 16 }} />AI Dashboard</> : <>Create Account<ArrowRight style={{ width: 16, height: 16 }} /></>}
              </button>
              <button onClick={handleRetake} style={{ flex: 1, padding: '14px', borderRadius: 14, background: darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0', color: darkMode ? '#E2E8F0' : '#374151', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit' }}>
                <RotateCcw style={{ width: 14, height: 14 }} /> Retake
              </button>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes resultFadeIn {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>
      </div>
    );
  }

  // ═══════════════════════════════════════════
  const questionImages = ['/img-risk.png', '/img-learn.png', '/img-insights.png', '/img-ai.png', '/img-fear.png'];
  const q = questions[currentQ];

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? 'linear-gradient(180deg, #050A18 0%, #0F172A 100%)' : '#F8FAFC', padding: '24px 16px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Brain style={{ width: 18, height: 18, color: '#fff' }} />
            </div>
            <span style={{ fontSize: '1rem', fontWeight: 700, color: darkMode ? '#F1F5F9' : '#1E293B' }}>Fear Assessment</span>
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#3B82F6' }}>{currentQ + 1}/{questions.length}</span>
        </div>

        {/* Progress Bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ height: 6, borderRadius: 999, background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 999, width: `${progress}%`, background: 'linear-gradient(90deg, #2563EB, #7C3AED)', transition: 'width 0.5s ease-out', boxShadow: '0 0 12px rgba(37,99,235,0.4)' }} />
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }}>
          {/* Left sidebar: Image + step indicators */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ borderRadius: 20, overflow: 'hidden', position: 'relative', height: 200, border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
              <img src={questionImages[currentQ]} alt="Context" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'opacity 0.3s' }} />
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(transparent 30%, ${darkMode ? 'rgba(5,10,24,0.9)' : 'rgba(255,255,255,0.85)'} 100%)` }} />
              <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#93C5FD', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Q{currentQ + 1} of {questions.length}</span>
              </div>
            </div>

            {/* Step dots */}
            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              {questions.map((_, i) => (
                <div key={i} style={{
                  width: i === currentQ ? 28 : 10, height: 10, borderRadius: 999,
                  background: i < currentQ ? '#10B981' : i === currentQ ? 'linear-gradient(90deg, #2563EB, #7C3AED)' : (darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'),
                  transition: 'all 0.3s ease',
                }} />
              ))}
            </div>

            {/* Quick tip */}
            <div style={{ padding: '14px 16px', borderRadius: 14, background: darkMode ? 'rgba(15,23,42,0.5)' : 'rgba(255,255,255,0.9)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.06)'}` }}>
              <p style={{ fontSize: '0.72rem', color: darkMode ? '#475569' : '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>💡 Tip</p>
              <p style={{ fontSize: '0.78rem', color: darkMode ? '#64748B' : '#94A3B8', lineHeight: 1.5 }}>There are no wrong answers — be honest for the most accurate result.</p>
            </div>
          </div>

          {/* Right: Question Card */}
          <div style={{ background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.95)', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`, borderRadius: 24, padding: '28px', backdropFilter: 'blur(16px)', opacity: animating ? 0 : 1, transform: animating ? 'translateY(16px)' : 'translateY(0)', transition: 'all 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 24 }}>
              <span style={{ fontSize: '2.2rem', flexShrink: 0 }}>{q.emoji}</span>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700, lineHeight: 1.4, color: darkMode ? '#F1F5F9' : '#1E293B' }}>{q.question}</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {q.options.map((option, idx) => (
                <button key={idx} onClick={() => handleSelect(option.score)} style={{ width: '100%', textAlign: 'left', padding: '14px 16px', borderRadius: 14, border: `2px solid ${selectedOption === option.score ? '#3B82F6' : darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`, background: selectedOption === option.score ? (darkMode ? 'rgba(37,99,235,0.1)' : 'rgba(37,99,235,0.05)') : (darkMode ? 'rgba(15,23,42,0.5)' : '#F8FAFC'), cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${selectedOption === option.score ? '#3B82F6' : darkMode ? '#475569' : '#CBD5E1'}`, background: selectedOption === option.score ? '#3B82F6' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                    {selectedOption === option.score && <CheckCircle style={{ width: 14, height: 14, color: '#fff' }} />}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: 500, color: selectedOption === option.score ? '#3B82F6' : (darkMode ? '#E2E8F0' : '#374151') }}>{option.text}</span>
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button onClick={handleBack} disabled={currentQ === 0} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 12, fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: currentQ === 0 ? 'not-allowed' : 'pointer', opacity: currentQ === 0 ? 0.3 : 1, background: darkMode ? 'rgba(255,255,255,0.06)' : '#E2E8F0', color: darkMode ? '#E2E8F0' : '#374151', transition: 'all 0.2s', fontFamily: 'inherit' }}>
                <ArrowLeft style={{ width: 14, height: 14 }} /> Back
              </button>
              <button onClick={handleNext} disabled={selectedOption === null} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 22px', borderRadius: 12, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', color: '#fff', fontWeight: 700, fontSize: '0.9rem', border: 'none', cursor: selectedOption === null ? 'not-allowed' : 'pointer', opacity: selectedOption === null ? 0.5 : 1, boxShadow: '0 4px 16px rgba(37,99,235,0.3)', transition: 'all 0.3s', fontFamily: 'inherit' }}>
                {currentQ + 1 >= questions.length ? 'See Results' : 'Next'}
                <ArrowRight style={{ width: 14, height: 14 }} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:768px){div[style*="grid-template-columns: 280px"]{grid-template-columns:1fr!important;}}`}</style>
    </div>
  );
}

