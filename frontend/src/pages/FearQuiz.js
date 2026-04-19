import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Brain, Shield, Zap, CheckCircle, RotateCcw, AlertTriangle, Sparkles, Play, Clock, Award } from 'lucide-react';
import { useAuth } from '../AuthContext';
import QuasarBackground from '../components/QuasarBackground';

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
      <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} flex items-center justify-center px-4 relative`}>
        {/* Quasar Background */}
        <QuasarBackground />
        
        {/* Content Overlay */}
        <div className="max-w-lg w-full relative z-10">
          <div
            className={`p-8 rounded-3xl shadow-2xl text-center ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'}`}
            style={{ animation: 'revealSection 0.5s ease-out' }}
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary bg-opacity-15 flex items-center justify-center">
              <Brain className="w-8 h-8 text-primary" />
            </div>

            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Fear Score Assessment
            </h1>
            <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Discover your investing fear level in 60 seconds
            </p>

            {/* Quick info */}
            <div className={`flex items-center justify-center gap-6 mb-8 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>~60 sec</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>5 questions</span>
              </div>
              {attemptCount > 0 && (
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  <span>{attemptCount} attempts</span>
                </div>
              )}
            </div>

            <button
              onClick={startQuiz}
              className="w-full bg-primary hover:bg-primary-dark text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition hover:scale-105 hover:shadow-xl"
              style={{ boxShadow: '0 4px 20px rgba(37, 99, 235, 0.3)' }}
            >
              <Play className="w-5 h-5" />
              Start Quiz
            </button>

            {attemptCount > 0 && (
              <p className={`text-xs mt-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                You've taken this quiz {attemptCount} time{attemptCount > 1 ? 's' : ''} before
              </p>
            )}
          </div>
        </div>
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
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-8 px-4`}>
        {showConfirmRestart && <ConfirmModal />}
        <div className="max-w-2xl mx-auto">
          <div
            className={`p-8 sm:p-10 rounded-3xl shadow-2xl text-center ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'}`}
            style={{ animation: 'resultFadeIn 0.6s ease-out' }}
          >
            {/* Score Circle */}
            <div className="relative w-36 h-36 mx-auto mb-6">
              <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke={darkMode ? '#1C2640' : '#e5e7eb'} strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={result.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(displayScore / 120) * 352} 352`}
                  style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl">{result.emoji}</span>
                <span className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {displayScore}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ 120</span>
              </div>
            </div>

            {/* Result Level */}
            <div className={`inline-block px-5 py-1.5 rounded-full text-white font-bold text-base mb-5 bg-gradient-to-r ${result.gradient}`}>
              {result.level}
            </div>

            <h2 className={`text-2xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Your Fear Score Analysis
            </h2>
            <p className={`mb-5 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {result.message}
            </p>

            {/* Recommendation */}
            <div className={`p-4 rounded-2xl mb-6 ${darkMode ? 'bg-secondary' : 'bg-gray-50'} border-l-4`} style={{borderColor: result.color}}>
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 flex-shrink-0 mt-0.5 text-primary" />
                <div className="text-left">
                  <p className={`font-semibold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Recommended Next Step
                  </p>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {result.recommendation}
                  </p>
                </div>
              </div>
            </div>

            {/* AI Profile CTA */}
            {isAuthenticated && (
              <div
                className={`p-4 rounded-2xl mb-5 cursor-pointer transition-all hover:scale-[1.02] ${
                  darkMode ? 'bg-blue-900 bg-opacity-20 border border-blue-500 border-opacity-20' : 'bg-blue-50 border border-blue-200'
                }`}
                onClick={() => navigate('/dashboard')}
              >
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="w-8 h-8 rounded-lg bg-primary bg-opacity-20 flex items-center justify-center">
                    <span className="text-lg">🤖</span>
                  </div>
                  <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Unlock Your AI Profile
                  </p>
                </div>
                <p className={`text-xs text-left ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Get personalized investment recommendations powered by ML — based on your fear score, savings, and financial knowledge.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition hover:scale-105"
              >
                {isAuthenticated ? (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Explore AI Dashboard
                  </>
                ) : (
                  <>
                    Create Free Account
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
              <button
                onClick={handleRetake}
                className={`flex-1 py-3 rounded-xl font-bold transition hover:scale-105 flex items-center justify-center gap-2 ${
                  darkMode ? 'bg-secondary text-white hover:bg-quaternary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                Retake Quiz
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
  //  STATE 4: ACTIVE — Quiz in progress
  //  Only reached when user explicitly clicked Start
  // ═══════════════════════════════════════════
  const q = questions[currentQ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-black' : 'bg-gray-50'} py-6 px-4 relative`}>
      {/* Quasar Background */}
      <QuasarBackground />
      
      {/* Content Overlay */}
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            <h1 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Fear Score Assessment
            </h1>
          </div>
          <span className={`text-sm font-bold text-primary`}>
            {currentQ + 1}/{questions.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className={`h-2 rounded-full overflow-hidden ${darkMode ? 'bg-secondary' : 'bg-gray-200'}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card — compact layout so options are visible */}
        <div
          className={`p-6 rounded-2xl shadow-xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} transition-all duration-300`}
        >
          {/* Question — compact */}
          <div className="flex items-start gap-4 mb-5">
            <span className="text-3xl flex-shrink-0">{q.emoji}</span>
            <h2 className={`text-lg font-bold leading-snug ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {q.question}
            </h2>
          </div>

          {/* Options — compact spacing */}
          <div className="space-y-2.5 mb-5">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option.score)}
                className={`w-full text-left p-3.5 rounded-xl border-2 transition-all duration-200 hover:scale-[1.01] ${
                  selectedOption === option.score
                    ? 'border-primary bg-primary bg-opacity-10 shadow-md'
                    : darkMode
                      ? 'border-gray-700 hover:border-primary bg-secondary bg-opacity-50'
                      : 'border-gray-200 hover:border-primary bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedOption === option.score
                      ? 'border-primary bg-primary'
                      : darkMode ? 'border-gray-500' : 'border-gray-300'
                  }`}>
                    {selectedOption === option.score && (
                      <CheckCircle className="w-3.5 h-3.5 text-white" />
                    )}
                  </div>
                  <span className={`text-sm font-medium ${
                    selectedOption === option.score
                      ? 'text-primary'
                      : darkMode ? 'text-gray-200' : 'text-gray-700'
                  }`}>
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentQ === 0}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition disabled:opacity-30 disabled:cursor-not-allowed ${
                darkMode ? 'bg-secondary text-white hover:bg-quaternary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {currentQ + 1 >= questions.length ? 'See Results' : 'Next'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
