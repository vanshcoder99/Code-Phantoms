import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { Play, TrendingUp, TrendingDown, BarChart3, CheckCircle, Sparkles, Shield, Target, Brain, AlertTriangle, ArrowRight, Zap } from 'lucide-react';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

export default function RiskSimulator({ darkMode }) {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [timePeriod, setTimePeriod] = useState(12);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // AI Deep Analysis state
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  // Sequential reveal state
  const [revealStep, setRevealStep] = useState(0); // 0=none, 1=scenarios, 2=chart, 3=ai-button
  const [revealMessage, setRevealMessage] = useState('');

  // GSAP refs
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const subtitleRef = useRef(null);
  const gridRef = useRef(null);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      gsap.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      });

      if (gridRef.current) {
        const panels = gridRef.current.children;
        gsap.from(panels, {
          y: 80,
          opacity: 0,
          scale: 0.95,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    setSaved(false);
    setAiAnalysis(null); // Reset AI analysis on new simulation
    setRevealStep(0);
    setRevealMessage('');
    try {
      const response = await api.post('/api/v1/simulate-risk', {
        initial_amount: initialAmount,
        time_period: timePeriod,
        risk_level: riskLevel,
      });
      setResults(response.data);
      if (response.data.saved) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
      // Save to localStorage for journey tracking
      try {
        const hist = JSON.parse(localStorage.getItem('simHistory') || '[]');
        hist.push({ date: new Date().toISOString(), risk: riskLevel, amount: initialAmount });
        localStorage.setItem('simHistory', JSON.stringify(hist.slice(-20)));
      } catch {}
      // Sequential reveal
      setRevealMessage('Analyzing your portfolio...');
      setRevealStep(1);
      setTimeout(() => {
        setRevealMessage('Comparing scenarios...');
        setRevealStep(2);
      }, 1200);
      setTimeout(() => {
        setRevealMessage('');
        setRevealStep(3);
      }, 2400);
    } catch (err) {
      // Fallback to local simulation if backend is down
      console.error(err);
      const mockData = generateMockData();
      const bestCase = Math.round(initialAmount * (1 + (timePeriod / 12) * 0.15));
      const worstCase = Math.round(initialAmount * (1 - (timePeriod / 12) * 0.10));
      const averageCase = Math.round(initialAmount * (1 + (timePeriod / 12) * 0.08));

      const mockResult = {
        best_case: bestCase,
        worst_case: Math.max(worstCase, Math.round(initialAmount * 0.5)),
        average_case: averageCase,
        graph_data: mockData,
        saved: false,
      };
      setResults(mockResult);
      setError('Running locally (backend not connected). Login to save results.');
      // Save to localStorage for journey tracking
      try {
        const hist = JSON.parse(localStorage.getItem('simHistory') || '[]');
        hist.push({ date: new Date().toISOString(), risk: riskLevel, amount: initialAmount });
        localStorage.setItem('simHistory', JSON.stringify(hist.slice(-20)));
      } catch {}
      // Sequential reveal
      setRevealMessage('Analyzing your portfolio...');
      setRevealStep(1);
      setTimeout(() => {
        setRevealMessage('Comparing scenarios...');
        setRevealStep(2);
      }, 1200);
      setTimeout(() => {
        setRevealMessage('');
        setRevealStep(3);
      }, 2400);
    }
    setLoading(false);
  };

  const runAIAnalysis = async () => {
    if (!results) return;
    setAiLoading(true);
    setAiError('');

    try {
      const response = await api.post('/ai/deep-risk-analysis', {
        initial_amount: initialAmount,
        time_period: timePeriod,
        risk_level: riskLevel,
        best_case: results.best_case,
        worst_case: results.worst_case,
        average_case: results.average_case,
      });
      // Artificial delay for UX
      setTimeout(() => {
        setAiAnalysis(response.data);
        setAiLoading(false);
      }, 800);
    } catch (err) {
      console.error(err);
      setAiError('AI analysis requires backend connection. Please ensure the server is running.');
      setAiLoading(false);
    }
  };

  const generateMockData = () => {
    const data = [];
    let value = initialAmount;
    const volatility = riskLevel === 'high' ? 0.05 : riskLevel === 'medium' ? 0.03 : 0.01;
    const trend = riskLevel === 'high' ? 0.015 : riskLevel === 'medium' ? 0.01 : 0.005;

    for (let i = 0; i <= timePeriod; i++) {
      const randomChange = (Math.random() - 0.5) * volatility + trend;
      value *= (1 + randomChange);
      data.push({
        month: i,
        value: Math.round(value),
        min: Math.round(value * 0.95),
        max: Math.round(value * 1.05)
      });
    }
    return data;
  };

  // Comparison data
  const comparisonData = results ? [
    { scenario: 'Worst Case', value: results.worst_case, fill: '#EF4444' },
    { scenario: 'Average Case', value: results.average_case, fill: '#F59E0B' },
    { scenario: 'Best Case', value: results.best_case, fill: '#10B981' }
  ] : [];

  // Risk level colors for AI analysis badges
  const riskBadgeColors = {
    'Low': { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', bgLight: 'bg-green-500/10' },
    'Medium': { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', bgLight: 'bg-yellow-500/10' },
    'High': { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', bgLight: 'bg-red-500/10' },
  };

  return (
    <section
      ref={sectionRef}
      id="simulator"
      className={`py-20 px-4 ${darkMode ? 'bg-quaternary' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 ref={headingRef} className={`text-4xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Risk Simulation Sandbox
        </h2>
        <p ref={subtitleRef} className={`text-lg text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Simulate different investment scenarios and see potential outcomes
        </p>

        {/* Saved toast */}
        {saved && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white shadow-lg transition-all animate-bounce">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Simulation saved to your account!</span>
          </div>
        )}

        <div ref={gridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Input Form */}
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Configure Your Simulation
            </h3>

            {/* Initial Amount */}
            <div className="mb-6">
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Initial Investment: ₹{initialAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: ₹1,000 - ₹1,00,000
              </p>
            </div>

            {/* Time Period */}
            <div className="mb-6">
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Period: {timePeriod} months
              </label>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: 1 - 60 months
              </p>
            </div>

            {/* Risk Level */}
            <div className="mb-8">
              <label className={`block font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Risk Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    className={`py-3 px-4 rounded-xl font-semibold transition ${
                      riskLevel === level
                        ? `bg-primary text-white`
                        : `${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-200 text-gray-700'}`
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={runSimulation}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {loading ? 'Running...' : 'Run Simulation'}
            </button>

            {error && (
              <p className="text-yellow-500 mt-4 text-sm text-center">{error}</p>
            )}

            {/* Info Box */}
            <div className={`mt-6 p-4 rounded-xl ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Tip:</strong> Higher risk levels show greater volatility but potentially higher returns over time.
              </p>
            </div>
          </div>

          {/* Results Summary */}
          <div className={`p-8 rounded-xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} shadow-lg lg:col-span-2`}>
            {results ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                    Simulation Results
                  </h3>
                  {revealMessage && (
                    <span className={`text-sm font-medium animate-pulse flex items-center gap-2 ${darkMode ? 'text-primary' : 'text-primary'}`}>
                      <div className="w-3 h-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      {revealMessage}
                    </span>
                  )}
                </div>

                {/* Outcome Cards — Step 1: Scenarios */}
                <div className="space-y-4 mb-6" style={{ opacity: revealStep >= 1 ? 1 : 0, transform: revealStep >= 1 ? 'translateY(0)' : 'translateY(20px)', transition: 'all 0.6s ease-out' }}>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-green-900/30' : 'bg-green-50'} border-l-4 border-green-600`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>🚀 Best Case Scenario</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          ₹{results.best_case?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Gain: ₹{(results.best_case - initialAmount).toLocaleString()} ({(((results.best_case - initialAmount) / initialAmount) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-50'} border-l-4 border-yellow-600`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>📊 Average Case Scenario</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                          ₹{results.average_case?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Gain: ₹{(results.average_case - initialAmount).toLocaleString()} ({(((results.average_case - initialAmount) / initialAmount) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-red-900/30' : 'bg-red-50'} border-l-4 border-red-600`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>⚠️ Worst Case Scenario</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                          ₹{results.worst_case?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Loss: ₹{(results.worst_case - initialAmount).toLocaleString()} ({(((results.worst_case - initialAmount) / initialAmount) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>

                {/* AI Deep Analysis CTA — Step 3: AI button */}
                {!aiAnalysis && !aiLoading && revealStep >= 3 && (
                  <button
                    onClick={runAIAnalysis}
                    className="w-full bg-gradient-to-r from-primary to-purple-500 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl hover:scale-[1.02] transform transition-all flex items-center justify-center gap-3 mt-4"
                    style={{ boxShadow: '0 4px 20px rgba(124, 58, 237, 0.3)', animation: 'revealSection 0.5s ease-out' }}
                  >
                    <Sparkles className="w-5 h-5" />
                    Get AI Deep Analysis
                    <ArrowRight className="w-5 h-5" />
                  </button>
                )}

                {aiError && <p className="text-red-500 mt-3 text-sm text-center">{aiError}</p>}

                {/* Motivational Message */}
                <div className={`p-4 rounded-xl bg-primary text-white border-l-4 border-primary-dark mt-4`}>
                  <p className={`text-sm italic`}>
                    Fear comes from uncertainty. Now you understand it.
                  </p>
                </div>
              </>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Configure and run a simulation to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* ============ AI DEEP ANALYSIS SECTION ============ */}
        {(aiLoading || aiAnalysis) && (
          <div className={`mb-12 p-8 rounded-2xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} shadow-xl overflow-hidden relative`}>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary opacity-5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 opacity-5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shadow-lg">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  AI Risk Intelligence Report
                </h3>
                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Powered by Groq LLM • Personalized Financial Analysis
                </p>
              </div>
            </div>

            {aiLoading && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                <p className={`font-bold animate-pulse ${darkMode ? 'text-primary' : 'text-primary-dark'}`}>
                  AI is analyzing your financial simulation...
                </p>
                <p className={`text-sm mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Evaluating risk patterns, behavior signals, and market projections
                </p>
              </div>
            )}

            {aiAnalysis && !aiLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* Risk Level Badge */}
                <div className={`ai-section-reveal p-6 rounded-2xl ${darkMode ? 'bg-secondary border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Shield className={`w-5 h-5 ${riskBadgeColors[aiAnalysis.risk_level]?.text || 'text-yellow-500'}`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Risk Level</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-3xl font-extrabold ${riskBadgeColors[aiAnalysis.risk_level]?.text || 'text-yellow-500'}`}>
                      {aiAnalysis.risk_level}
                    </span>
                    <div className={`px-3 py-1 rounded-full text-sm font-bold ${riskBadgeColors[aiAnalysis.risk_level]?.bgLight || 'bg-yellow-500/10'} ${riskBadgeColors[aiAnalysis.risk_level]?.text || 'text-yellow-500'}`}>
                      Risk
                    </div>
                  </div>
                </div>

                {/* Confidence Score */}
                <div className={`ai-section-reveal p-6 rounded-2xl ${darkMode ? 'bg-secondary border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Target className={`w-5 h-5 text-primary`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Confidence Score</p>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-4xl font-extrabold text-primary">{aiAnalysis.confidence_score}</span>
                    <span className={`text-xl mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full mt-3 ${darkMode ? 'bg-quaternary' : 'bg-gray-200'}`}>
                    <div
                      className="h-2 rounded-full bg-gradient-to-r from-primary to-purple-500 transition-all duration-1000"
                      style={{ width: `${aiAnalysis.confidence_score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Key Factors */}
                <div className={`ai-section-reveal p-6 rounded-2xl ${darkMode ? 'bg-secondary border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Zap className={`w-5 h-5 text-amber-500`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Key Factors</p>
                  </div>
                  <ul className="space-y-2">
                    {(aiAnalysis.key_factors || []).map((factor, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0"></span>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{factor}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Behavior Insight */}
                <div className={`ai-section-reveal p-6 rounded-2xl md:col-span-2 ${darkMode ? 'bg-gradient-to-br from-indigo-900/30 to-secondary border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className={`w-5 h-5 text-primary`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Behavior Insight</p>
                  </div>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {aiAnalysis.behavior_insight}
                  </p>
                </div>

                {/* AI Recommendations */}
                <div className={`ai-section-reveal p-6 rounded-2xl ${darkMode ? 'bg-secondary border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className={`w-5 h-5 text-green-500`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI Recommendations</p>
                  </div>
                  <ul className="space-y-2">
                    {(aiAnalysis.recommendations || []).map((rec, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0"></span>
                        <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Future Projection */}
                <div className={`ai-section-reveal p-6 rounded-2xl md:col-span-2 lg:col-span-2 ${darkMode ? 'bg-gradient-to-br from-purple-900/20 to-secondary border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className={`w-5 h-5 text-purple-500`} />
                    <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Future Projection</p>
                  </div>
                  <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {aiAnalysis.future_projection}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts — Step 2: Progressive reveal */}
        {results?.graph_data && revealStep >= 2 && (
          <>
            {/* Main Portfolio Growth Chart */}
            <div className={`mb-12 p-8 rounded-xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} shadow-lg`}
              style={{ animation: 'revealSection 0.6s ease-out' }}
            >
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Portfolio Growth Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={results.graph_data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1C2640' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1C2640' : '#ffffff',
                      border: `1px solid ${darkMode ? '#2A3655' : '#e5e7eb'}`,
                      color: darkMode ? '#ffffff' : '#000000',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#2563EB" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Scenario Comparison Chart */}
            <div className={`mb-12 p-8 rounded-xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Scenario Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1C2640' : '#e5e7eb'} />
                  <XAxis dataKey="scenario" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1C2640' : '#ffffff',
                      border: `1px solid ${darkMode ? '#2A3655' : '#e5e7eb'}`,
                      color: darkMode ? '#ffffff' : '#000000',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Bar dataKey="value" fill="#2563EB" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Volatility Range Chart */}
            <div className={`p-8 rounded-xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Volatility Range (Min-Max)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={results.graph_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#1C2640' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: darkMode ? '#1C2640' : '#ffffff',
                      border: `1px solid ${darkMode ? '#2A3655' : '#e5e7eb'}`,
                      color: darkMode ? '#ffffff' : '#000000',
                      borderRadius: '8px',
                    }}
                    formatter={(value) => `₹${value.toLocaleString()}`}
                  />
                  <Line type="monotone" dataKey="value" stroke="#2563EB" strokeWidth={2} name="Expected Value" />
                  <Line type="monotone" dataKey="max" stroke="#10B981" strokeWidth={1} strokeDasharray="5 5" name="Max Range" />
                  <Line type="monotone" dataKey="min" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" name="Min Range" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
