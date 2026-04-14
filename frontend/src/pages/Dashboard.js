import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, TrendingUp, Activity, Award, DollarSign, Briefcase, Brain, Zap, ArrowRight, Clock, Target, Sparkles, ChevronRight, Shield, CheckCircle, Circle, Play } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import api from '../api';
import { useAuth } from '../AuthContext';

const HISTORY_KEY = 'fearQuizHistory';
const AI_HISTORY_KEY = 'aiProfileHistory';

function getScoreHistory() {
  try { return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function getAIHistory() {
  try { return JSON.parse(localStorage.getItem(AI_HISTORY_KEY) || '[]'); }
  catch { return []; }
}

function saveAIHistory(entry) {
  try {
    const history = getAIHistory();
    history.push({ ...entry, date: new Date().toISOString() });
    if (history.length > 20) history.splice(0, history.length - 20);
    localStorage.setItem(AI_HISTORY_KEY, JSON.stringify(history));
  } catch { /* ignore */ }
}

function getScoreTrend(history) {
  if (history.length < 2) return 'neutral';
  const recent = history.slice(-3);
  const first = recent[0].score;
  const last = recent[recent.length - 1].score;
  if (last < first - 5) return 'improving';
  if (last > first + 5) return 'worsening';
  return 'stable';
}

// ─── Journey step completion checker ───
function getJourneyStatus() {
  const quizDone = getScoreHistory().length > 0;
  const simsDone = (() => { try { return JSON.parse(localStorage.getItem('simHistory') || '[]').length > 0; } catch { return false; } })();
  const aiDone = getAIHistory().length > 0;
  return { quizDone, simsDone, aiDone };
}

export default function Dashboard({ darkMode }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [predictionResult, setPredictionResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictStep, setPredictStep] = useState(''); // loading message
  const { user } = useAuth();
  const navigate = useNavigate();
  const scoreHistory = getScoreHistory();
  const aiHistory = getAIHistory();
  const scoreTrend = getScoreTrend(scoreHistory);
  const journey = getJourneyStatus();
  const predictorRef = useRef(null);

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/api/v1/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError('Dashboard data unavailable — using local data.');
    }
    setLoading(false);
  };

  const riskDistribution = stats?.risk_distribution ? [
    { name: 'Low', value: stats.risk_distribution.low || 0, fill: '#10B981' },
    { name: 'Medium', value: stats.risk_distribution.medium || 0, fill: '#F59E0B' },
    { name: 'High', value: stats.risk_distribution.high || 0, fill: '#EF4444' }
  ].filter(d => d.value > 0) : [];

  const scoreChartData = scoreHistory.map((entry, idx) => ({
    attempt: `#${idx + 1}`,
    score: entry.score,
    date: new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
  }));

  const aiChartData = aiHistory.map((entry, idx) => ({
    attempt: `#${idx + 1}`,
    confidence: entry.confidence || 0,
    date: new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
    profile: entry.profile || 'N/A',
  }));

  // Completed steps count
  const completedSteps = [journey.quizDone, journey.simsDone, journey.aiDone].filter(Boolean).length;

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const isEmpty = stats && stats.total_simulations === 0 && stats.total_portfolios === 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-8 px-4`}>
      <div className="max-w-7xl mx-auto">

        {/* ═══════════════════════════════════════════
            HERO BANNER — AI-First Welcome
        ═══════════════════════════════════════════ */}
        <div
          className={`relative p-8 rounded-2xl mb-8 overflow-hidden ${
            darkMode ? 'bg-gradient-to-br from-tertiary via-quaternary to-tertiary border border-gray-800' : 'bg-gradient-to-br from-white to-blue-50'
          }`}
          style={{ animation: 'revealSection 0.5s ease-out' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-primary opacity-[0.06] rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-52 h-52 bg-purple-500 opacity-[0.04] rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex-1">
              <p className={`text-sm font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-primary' : 'text-primary'}`}>
                Welcome back
              </p>
              <h1 className={`text-3xl lg:text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {user?.name?.split(' ')[0] || 'Investor'} 👋
              </h1>
              <p className={`text-base ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {completedSteps === 3
                  ? 'All steps complete! Explore your insights and keep learning.'
                  : completedSteps === 0
                    ? 'Start your AI-powered investment journey below.'
                    : `${completedSteps}/3 steps completed — keep going!`
                }
              </p>
            </div>

            {/* Primary CTA — AI Profile */}
            <button
              onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}
              className="group flex items-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              style={{ boxShadow: '0 4px 25px rgba(37, 99, 235, 0.35)' }}
            >
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-sm opacity-80">Start Here</p>
                <p className="text-base font-bold">Get AI Investment Analysis →</p>
              </div>
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-lg bg-yellow-500 bg-opacity-10 border border-yellow-500 border-opacity-30">
            <p className="text-yellow-500 text-center text-sm">{error}</p>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            JOURNEY TRACKER — Step Progress
        ═══════════════════════════════════════════ */}
        <div className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-sm'}`}
          style={{ animation: 'revealSection 0.5s ease-out 0.1s forwards', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className={`text-lg font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              <Target className="w-5 h-5 text-primary" />
              Your Investment Journey
            </h2>
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              completedSteps === 3 ? 'bg-green-500 bg-opacity-15 text-green-500'
              : 'bg-primary bg-opacity-15 text-primary'
            }`}>
              {completedSteps}/3 Complete
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: 1,
                title: 'Assess Your Fear',
                desc: 'Take the 60-second quiz to understand your risk personality',
                done: journey.quizDone,
                action: () => navigate('/fear-quiz'),
                cta: journey.quizDone ? 'View Results →' : 'Take Quiz →',
                icon: Brain,
                accentColor: journey.quizDone ? 'text-green-500' : 'text-primary',
                glowColor: journey.quizDone ? 'rgba(16,185,129,0.15)' : 'rgba(37,99,235,0.1)',
              },
              {
                step: 2,
                title: 'Simulate Investments',
                desc: 'Test scenarios with virtual money — zero real risk',
                done: journey.simsDone || (stats?.total_simulations || 0) > 0,
                action: () => navigate('/'),
                cta: (journey.simsDone || (stats?.total_simulations || 0) > 0) ? 'Run Again →' : 'Start Simulation →',
                icon: BarChart3,
                accentColor: (journey.simsDone || (stats?.total_simulations || 0) > 0) ? 'text-green-500' : 'text-primary',
                glowColor: (journey.simsDone || (stats?.total_simulations || 0) > 0) ? 'rgba(16,185,129,0.15)' : 'rgba(37,99,235,0.1)',
              },
              {
                step: 3,
                title: 'Get AI Analysis',
                desc: 'Our ML model predicts your ideal investor profile',
                done: journey.aiDone,
                action: () => predictorRef.current?.scrollIntoView({ behavior: 'smooth' }),
                cta: journey.aiDone ? 'Analyze Again →' : 'Get AI Insights →',
                icon: Sparkles,
                accentColor: journey.aiDone ? 'text-green-500' : 'text-purple-500',
                glowColor: journey.aiDone ? 'rgba(16,185,129,0.15)' : 'rgba(124,58,237,0.1)',
              },
            ].map((item, i) => {
              const Icon = item.icon;
              const stepDone = item.done;
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className={`group relative p-5 rounded-xl text-left transition-all duration-300 hover:scale-[1.03] hover:-translate-y-1 ${
                    darkMode
                      ? 'bg-secondary border border-gray-700 hover:border-primary'
                      : 'bg-gray-50 border border-gray-200 hover:border-primary'
                  }`}
                  style={{
                    animation: `revealSection 0.4s ease-out ${0.2 + i * 0.1}s forwards`,
                    opacity: 0,
                    boxShadow: stepDone ? `0 0 20px ${item.glowColor}` : 'none',
                  }}
                >
                  {/* Step number badge */}
                  <div className={`absolute -top-2.5 -left-2.5 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-md ${
                    stepDone
                      ? 'bg-green-500 text-white'
                      : 'bg-primary text-white'
                  }`}>
                    {stepDone ? <CheckCircle className="w-4 h-4" /> : item.step}
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      stepDone ? 'bg-green-500 bg-opacity-15' : 'bg-primary bg-opacity-10'
                    }`}>
                      <Icon className={`w-5 h-5 ${item.accentColor}`} />
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-sm mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                        {item.title}
                      </p>
                      <p className={`text-xs mb-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        {item.desc}
                      </p>
                      <span className={`text-xs font-bold flex items-center gap-1 transition-all group-hover:gap-2 ${
                        stepDone ? 'text-green-500' : 'text-primary'
                      }`}>
                        {item.cta}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            STATS GRID — Key Metrics
        ═══════════════════════════════════════════ */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          style={{ animation: 'revealSection 0.5s ease-out 0.3s forwards', opacity: 0 }}
        >
          {[
            { label: 'Simulations', value: stats?.total_simulations || 0, icon: BarChart3, color: 'text-primary', bg: 'bg-primary', sub: 'Practice sessions' },
            { label: 'AI Analyses', value: aiHistory.length, icon: Sparkles, color: 'text-purple-500', bg: 'bg-purple-500', sub: 'ML predictions run' },
            { label: 'Invested (Virtual)', value: `₹${(stats?.stats?.total_invested || 0).toLocaleString()}`, icon: DollarSign, color: 'text-blue-400', bg: 'bg-blue-400', sub: 'Virtual portfolio' },
            {
              label: 'Avg Return',
              value: `${(stats?.stats?.gain_loss_percent || 0).toFixed(1)}%`,
              icon: TrendingUp,
              color: (stats?.stats?.gain_loss_percent || 0) >= 0 ? 'text-green-500' : 'text-red-500',
              bg: (stats?.stats?.gain_loss_percent || 0) >= 0 ? 'bg-green-500' : 'bg-red-500',
              sub: (stats?.stats?.gain_loss_percent || 0) >= 0 ? 'Portfolio gain' : 'Portfolio loss',
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div key={i} className={`p-5 rounded-xl transition-all hover:scale-105 ${
                darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-sm'
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-semibold uppercase tracking-wide ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    {stat.label}
                  </span>
                  <div className={`w-8 h-8 ${stat.bg} bg-opacity-15 rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                </div>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  {stat.sub}
                </p>
              </div>
            );
          })}
        </div>

        {/* ═══════════════════════════════════════════
            AI RISK INSIGHT — Quick Summary Panel
        ═══════════════════════════════════════════ */}
        {(scoreHistory.length > 0 || aiHistory.length > 0) && (
          <div className={`p-6 rounded-2xl mb-8 relative overflow-hidden ${
            darkMode ? 'bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-500/20' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
          }`}
            style={{ animation: 'revealSection 0.5s ease-out 0.35s forwards', opacity: 0 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-purple-500/5 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold mb-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  AI Insight Summary
                </p>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {aiHistory.length > 0
                    ? `Your latest AI profile: ${aiHistory[aiHistory.length - 1].profile} (${aiHistory[aiHistory.length - 1].confidence}% confidence). ${
                        aiHistory.length > 1
                          ? `You've run ${aiHistory.length} analyses — track your progress below.`
                          : 'Run more analyses to track your risk progression.'
                      }`
                    : scoreHistory.length > 0
                      ? `Your latest fear score: ${scoreHistory[scoreHistory.length - 1].score}/120 (${scoreHistory[scoreHistory.length - 1].level}). Try the AI Profile Predictor for deeper insights.`
                      : 'Complete your journey steps to get personalized AI insights.'
                  }
                </p>
              </div>
              <button
                onClick={() => predictorRef.current?.scrollIntoView({ behavior: 'smooth' })}
                className="text-sm font-bold text-primary hover:text-primary-dark flex items-center gap-1 flex-shrink-0 transition"
              >
                Get AI Insights <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            FEAR SCORE HISTORY — Chart + List
        ═══════════════════════════════════════════ */}
        <div id="score-history" className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-sm'}`}
          style={{ animation: 'revealSection 0.5s ease-out 0.4s forwards', opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className={`text-xl font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Brain className="w-5 h-5 text-primary" />
                Fear Score History
              </h2>
              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                Track your investing confidence over time
              </p>
            </div>
            {scoreHistory.length >= 2 && (
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                scoreTrend === 'improving' ? 'bg-green-500/15 text-green-500'
                : scoreTrend === 'worsening' ? 'bg-red-500/15 text-red-500'
                : 'bg-yellow-500/15 text-yellow-500'
              }`}>
                {scoreTrend === 'improving' ? '📈 Improving' : scoreTrend === 'worsening' ? '📉 Needs Work' : '➡️ Stable'}
              </span>
            )}
          </div>

          {scoreHistory.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={scoreChartData}>
                  <defs>
                    <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.6}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1C2640' : '#e5e7eb'} />
                  <XAxis dataKey="date" stroke={darkMode ? '#64748B' : '#9ca3af'} fontSize={11} />
                  <YAxis domain={[0, 120]} stroke={darkMode ? '#64748B' : '#9ca3af'} fontSize={11} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1C2640' : '#fff',
                      border: `1px solid ${darkMode ? '#2A3655' : '#e5e7eb'}`,
                      color: darkMode ? '#fff' : '#000',
                      borderRadius: '10px', fontSize: '12px',
                    }}
                    formatter={(value) => [`${value}/120`, 'Fear Score']}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2563EB" fill="url(#scoreGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>

              <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                {[...scoreHistory].reverse().map((entry, idx) => (
                  <div key={idx} className={`p-3 rounded-lg flex items-center justify-between border-l-3 ${
                    entry.level === 'High Fear' ? 'border-l-red-500' : entry.level === 'Moderate Fear' ? 'border-l-yellow-500' : entry.level === 'Low Fear' ? 'border-l-green-500' : 'border-l-blue-500'
                  } ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}
                  style={{ borderLeftWidth: '3px' }}
                  >
                    <div>
                      <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.score}/120</span>
                      <span className={`text-xs ml-2 ${
                        entry.level === 'High Fear' ? 'text-red-500' : entry.level === 'Moderate Fear' ? 'text-yellow-500' : entry.level === 'Low Fear' ? 'text-green-500' : 'text-blue-500'
                      }`}>{entry.level}</span>
                    </div>
                    <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                      {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
              <Brain className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-medium text-sm">No quiz history yet</p>
              <button
                onClick={() => navigate('/fear-quiz')}
                className="mt-3 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition inline-flex items-center gap-2"
              >
                Take Fear Quiz <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            ACHIEVEMENTS — Compact badges
        ═══════════════════════════════════════════ */}
        <div className={`p-6 rounded-2xl mb-8 ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-sm'}`}
          style={{ animation: 'revealSection 0.5s ease-out 0.45s forwards', opacity: 0 }}
        >
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
            <Award className="w-5 h-5 text-yellow-500" /> Achievements
          </h2>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { emoji: '🚀', title: 'First Sim', unlocked: (stats?.total_simulations || 0) >= 1 },
              { emoji: '📊', title: 'Analyst', unlocked: (stats?.total_portfolios || 0) >= 1 },
              { emoji: '🔥', title: '5 Sims', unlocked: (stats?.total_simulations || 0) >= 5 },
              { emoji: '💎', title: 'Diversifier', unlocked: (stats?.risk_distribution?.low > 0 && stats?.risk_distribution?.medium > 0 && stats?.risk_distribution?.high > 0) },
              { emoji: '🏆', title: '10 Sims', unlocked: (stats?.total_simulations || 0) >= 10 },
              { emoji: '🦁', title: 'Fearless', unlocked: (stats?.risk_distribution?.high || 0) >= 1 },
            ].map((badge, i) => (
              <div key={i} className={`p-3 rounded-xl text-center transition-all ${
                badge.unlocked
                  ? `${darkMode ? 'bg-primary/15 border border-primary/30' : 'bg-primary/10 border border-primary/20'} hover:scale-105`
                  : `${darkMode ? 'bg-secondary opacity-40' : 'bg-gray-100 opacity-50'}`
              }`}>
                <span className={`text-2xl block mb-1 ${badge.unlocked ? '' : ''}`} style={badge.unlocked ? {} : {filter: 'grayscale(1)'}}>{badge.emoji}</span>
                <p className={`text-[10px] font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{badge.title}</p>
                {badge.unlocked && <p className="text-[9px] text-green-500 font-bold">✓ Unlocked</p>}
              </div>
            ))}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            CHARTS — Risk Distribution + Activity
        ═══════════════════════════════════════════ */}
        {!isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
            style={{ animation: 'revealSection 0.5s ease-out 0.5s forwards', opacity: 0 }}
          >
            {riskDistribution.length > 0 && (
              <div className={`p-6 rounded-2xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-sm'}`}>
                <h3 className={`text-base font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Risk Distribution</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1C2640' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={darkMode ? '#64748B' : '#9ca3af'} fontSize={12} />
                    <YAxis stroke={darkMode ? '#64748B' : '#9ca3af'} allowDecimals={false} fontSize={12} />
                    <Tooltip contentStyle={{ backgroundColor: darkMode ? '#1C2640' : '#fff', border: `1px solid ${darkMode ? '#2A3655' : '#e5e7eb'}`, borderRadius: '8px', color: darkMode ? '#fff' : '#000' }} />
                    <Bar dataKey="value" name="Simulations" radius={[6,6,0,0]}>
                      {riskDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Recent Activity */}
            <div className={`p-6 rounded-2xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-sm'}`}>
              <h3 className={`text-base font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>Recent Activity</h3>
              {stats?.recent_activity?.length > 0 ? (
                <div className="space-y-2.5 max-h-[250px] overflow-y-auto pr-1">
                  {stats.recent_activity.map((activity, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex items-center gap-3 transition hover:translate-x-1 ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        activity.action === 'simulation_run' ? 'bg-primary/15' : 'bg-purple-500/15'
                      }`}>
                        {activity.action === 'simulation_run'
                          ? <Activity className="w-4 h-4 text-primary" />
                          : <Award className="w-4 h-4 text-purple-500" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                          {activity.action === 'simulation_run' ? 'Simulation Run' : 'Portfolio Analyzed'}
                        </p>
                        <p className={`text-xs truncate ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                          {activity.risk_level
                            ? `${activity.risk_level.charAt(0).toUpperCase() + activity.risk_level.slice(1)} risk • ₹${(activity.amount || 0).toLocaleString()}`
                            : activity.portfolio}
                        </p>
                      </div>
                      <span className={`text-[10px] flex-shrink-0 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : ''}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={`text-center py-8 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                  <Activity className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <p className="text-sm">No activity yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            AI PROFILE PREDICTOR — The Star Feature
            Visually dominant with glow + gradient border
        ═══════════════════════════════════════════ */}
        <div ref={predictorRef} id="ai-predictor"
          className={`p-8 rounded-2xl relative overflow-hidden ${
            darkMode
              ? 'bg-gradient-to-br from-tertiary to-quaternary'
              : 'bg-gradient-to-br from-white to-blue-50'
          }`}
          style={{
            border: darkMode ? '1px solid rgba(124,58,237,0.25)' : '1px solid rgba(37,99,235,0.15)',
            boxShadow: darkMode ? '0 0 40px rgba(124,58,237,0.08)' : '0 4px 20px rgba(0,0,0,0.06)',
            animation: 'revealSection 0.5s ease-out 0.55s forwards',
            opacity: 0,
          }}
        >
          {/* Decorative glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500 opacity-[0.04] rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary opacity-[0.04] rounded-full blur-3xl pointer-events-none -translate-x-1/3 translate-y-1/3"></div>

          {/* Header */}
          <div className="relative z-10 mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Profile Predictor
                </h2>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Gradient Boosting ML • 1000+ Investor Profiles
                </p>
              </div>
            </div>
          </div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Form */}
            <div className={`lg:col-span-5 p-6 rounded-xl ${darkMode ? 'bg-secondary/60 backdrop-blur-sm' : 'bg-white shadow-md'}`}>
              <div className="grid grid-cols-2 gap-4 mb-5">
                {[
                  { id: 'ml-age', label: 'Age', default: 28, icon: '👤' },
                  { id: 'ml-savings', label: 'Monthly Savings (₹)', default: 15000, icon: '💰' },
                  { id: 'ml-fear', label: 'Fear Score (0-100)', default: 45, icon: '😰' },
                  { id: 'ml-knowledge', label: 'Knowledge (0-100)', default: 70, icon: '📚' },
                ].map(field => (
                  <div key={field.id} className="space-y-1">
                    <label className={`text-xs font-bold flex items-center gap-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>{field.icon}</span> {field.label}
                    </label>
                    <input id={field.id} type="number" defaultValue={field.default}
                      className={`w-full p-3 rounded-lg text-sm font-medium focus:ring-2 focus:ring-primary focus:outline-none transition ${
                        darkMode ? 'bg-quaternary text-white border border-gray-700' : 'bg-gray-50 text-gray-900 border border-gray-200'
                      }`}
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={async () => {
                  setPredicting(true);
                  setPredictionResult(null);
                  setPredictStep('Collecting your data...');

                  try {
                    const params = {
                      age: Number(document.getElementById('ml-age').value),
                      monthly_savings: Number(document.getElementById('ml-savings').value),
                      fear_score: Number(document.getElementById('ml-fear').value),
                      knowledge_score: Number(document.getElementById('ml-knowledge').value),
                    };

                    setTimeout(() => setPredictStep('Running Gradient Boosting Classifier...'), 500);
                    const res = await api.post('/ai/predict-profile', params);

                    setPredictStep('Generating AI insights...');
                    setTimeout(() => {
                      setPredictionResult(res.data);
                      setPredicting(false);
                      setPredictStep('');
                      // Save to AI history
                      saveAIHistory({
                        profile: res.data.profile_type,
                        confidence: res.data.confidence_percent,
                        ...params,
                      });
                    }, 800);
                  } catch(e) {
                    setPredicting(false);
                    setPredictStep('');
                    document.getElementById('ml-error').innerText = 'Backend connection required.';
                  }
                }}
                disabled={predicting}
                className="w-full bg-gradient-to-r from-primary to-purple-500 text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-[1.02] transform transition-all disabled:opacity-70 disabled:hover:scale-100"
                style={{ boxShadow: '0 4px 20px rgba(124,58,237,0.25)' }}
              >
                {predicting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {predictStep || 'Analyzing...'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Run AI Analysis
                  </span>
                )}
              </button>
              <p id="ml-error" className="text-red-500 mt-2 text-center text-xs font-semibold"></p>
            </div>

            {/* Results Panel */}
            <div className="lg:col-span-7">
              {!predictionResult && !predicting && (
                <div className={`h-full min-h-[250px] flex flex-col items-center justify-center rounded-xl border-2 border-dashed ${
                  darkMode ? 'border-gray-700 text-gray-600' : 'border-gray-300 text-gray-400'
                }`}>
                  <Sparkles className="w-12 h-12 mb-3 opacity-30" />
                  <p className="text-base font-medium">Awaiting Your Data</p>
                  <p className="text-xs">Enter your metrics and click "Run AI Analysis"</p>
                </div>
              )}

              {predicting && !predictionResult && (
                <div className="h-full min-h-[250px] flex flex-col justify-center items-center">
                  <div className="w-14 h-14 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className={`font-bold text-sm animate-pulse ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    {predictStep || 'Processing...'}
                  </p>
                  <p className={`text-xs mt-2 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                    AI is analyzing your investor profile
                  </p>
                </div>
              )}

              {predictionResult && !predicting && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full" style={{ animation: 'revealSection 0.5s ease-out' }}>
                  {/* Persona Card — Full Width */}
                  <div className={`md:col-span-2 p-5 rounded-xl ${
                    darkMode ? 'bg-gradient-to-r from-secondary to-tertiary border border-gray-700' : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200'
                  } shadow-lg`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-[10px] font-bold text-purple-500 uppercase tracking-wider mb-1">AI Determined Profile</p>
                        <h3 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          {predictionResult.profile_type}
                        </h3>
                      </div>
                      <div className="text-right">
                        <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-green-500/15 text-green-500 font-bold text-sm border border-green-500/30">
                          {predictionResult.confidence_percent.toFixed(0)}%
                        </div>
                        <p className={`text-[9px] mt-1 font-semibold uppercase ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Confidence</p>
                      </div>
                    </div>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                      {predictionResult.description}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-quaternary/60' : 'bg-white shadow-sm'}`}>
                        <p className="text-[10px] text-gray-500 font-bold mb-0.5">EXPECTED RETURN</p>
                        <p className="font-bold text-green-500 text-base">{predictionResult.expected_return}</p>
                      </div>
                      <div className={`p-3 rounded-lg ${darkMode ? 'bg-quaternary/60' : 'bg-white shadow-sm'}`}>
                        <p className="text-[10px] text-gray-500 font-bold mb-0.5">RECOMMENDED SIP</p>
                        <p className="font-bold text-purple-500 text-sm">{predictionResult.sip_suggestion?.split(' ').slice(0, 2).join(' ')}</p>
                      </div>
                    </div>
                  </div>

                  {/* Allocation */}
                  <div className={`p-5 rounded-xl ${darkMode ? 'bg-secondary/60' : 'bg-white shadow-md'}`}>
                    <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide flex items-center gap-2`}>
                      <Briefcase className="w-3.5 h-3.5" /> Portfolio Allocation
                    </h4>
                    <ul className="space-y-2.5">
                      {predictionResult.recommended_allocation.split(', ').map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm font-medium">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0"></span>
                          <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* ML Class Distribution */}
                  <div className={`p-5 rounded-xl ${darkMode ? 'bg-secondary/60' : 'bg-white shadow-md'}`}>
                    <h4 className={`text-xs font-bold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wide flex items-center gap-2`}>
                      <Activity className="w-3.5 h-3.5" /> ML Confidence
                    </h4>
                    <div className="space-y-2.5">
                      {Object.entries(predictionResult.profile_distribution || {}).map(([type, prob], idx) => (
                        <div key={idx}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className={`font-semibold ${type === predictionResult.profile_type ? 'text-primary' : (darkMode ? 'text-gray-400' : 'text-gray-600')}`}>{type}</span>
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{prob}%</span>
                          </div>
                          <div className={`w-full h-1.5 rounded-full ${darkMode ? 'bg-quaternary' : 'bg-gray-200'}`}>
                            <div
                              className={`h-1.5 rounded-full transition-all duration-700 ${type === predictionResult.profile_type ? 'bg-gradient-to-r from-primary to-purple-500' : 'bg-gray-500'}`}
                              style={{ width: `${prob}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* AI Profile History — Only show if has history */}
          {aiHistory.length > 1 && (
            <div className="relative z-10 mt-8 pt-6 border-t" style={{ borderColor: darkMode ? 'rgba(42,54,85,0.5)' : 'rgba(0,0,0,0.08)' }}>
              <h3 className={`text-base font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                <Clock className="w-4 h-4 text-purple-500" /> AI Profile History
                <span className={`text-xs font-normal ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  {aiHistory.length} analyses
                </span>
              </h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={aiChartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1C2640' : '#e5e7eb'} />
                    <XAxis dataKey="date" stroke={darkMode ? '#64748B' : '#9ca3af'} fontSize={11} />
                    <YAxis domain={[0, 100]} stroke={darkMode ? '#64748B' : '#9ca3af'} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1C2640' : '#fff',
                        border: `1px solid ${darkMode ? '#2A3655' : '#e5e7eb'}`,
                        color: darkMode ? '#fff' : '#000',
                        borderRadius: '8px', fontSize: '12px',
                      }}
                      formatter={(value, name, props) => [`${value}% (${props.payload.profile})`, 'Confidence']}
                    />
                    <Line type="monotone" dataKey="confidence" stroke="#7C3AED" strokeWidth={2} dot={{ fill: '#7C3AED', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {[...aiHistory].reverse().map((entry, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex items-center justify-between ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}
                      style={{ borderLeft: '3px solid #7C3AED' }}
                    >
                      <div>
                        <span className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{entry.profile}</span>
                        <span className="text-xs text-purple-500 ml-2">{entry.confidence}%</span>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
                        {new Date(entry.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
