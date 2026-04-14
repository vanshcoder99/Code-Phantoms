import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Brain, TrendingDown, Shield, Zap, CheckCircle } from 'lucide-react';
import { useAuth } from '../AuthContext';
import api from '../api';

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
    color: "#3B82F6",
    emoji: "🦁",
    message: "Impressive! You understand that investing involves risk and you're ready to embrace it. Our tools can help you optimize your strategy.",
    recommendation: "Dive into the ML Investor Profile Predictor on your Dashboard for personalized allocation advice.",
    gradient: "from-blue-500 to-cyan-400",
  };
}

export default function FearQuiz({ darkMode }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [animating, setAnimating] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const totalScore = answers.reduce((sum, a) => sum + a, 0);
  const result = getResult(totalScore);
  const progress = ((currentQ) / questions.length) * 100;

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
        setShowResult(true);
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

  const handleRestart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setSelectedOption(null);
    setShowResult(false);
  };

  if (showResult) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
        <div className="max-w-2xl mx-auto">
          <div
            className={`p-10 rounded-3xl shadow-2xl text-center ${darkMode ? 'bg-tertiary' : 'bg-white'}`}
            style={{ animation: 'resultFadeIn 0.6s ease-out' }}
          >
            {/* Score Circle */}
            <div className="relative w-40 h-40 mx-auto mb-8">
              <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="56" fill="none" stroke={darkMode ? '#333' : '#e5e7eb'} strokeWidth="8" />
                <circle
                  cx="64" cy="64" r="56" fill="none"
                  stroke={result.color}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(totalScore / 120) * 352} 352`}
                  style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl">{result.emoji}</span>
                <span className={`text-2xl font-bold mt-1 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                  {totalScore}
                </span>
                <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/ 120</span>
              </div>
            </div>

            {/* Result Level */}
            <div
              className={`inline-block px-6 py-2 rounded-full text-white font-bold text-lg mb-6 bg-gradient-to-r ${result.gradient}`}
            >
              {result.level}
            </div>

            <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Your Fear Score Analysis
            </h2>
            <p className={`text-lg mb-6 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {result.message}
            </p>

            {/* Recommendation */}
            <div className={`p-5 rounded-2xl mb-8 ${darkMode ? 'bg-secondary' : 'bg-gray-50'} border-l-4`} style={{borderColor: result.color}}>
              <div className="flex items-start gap-3">
                <img src="/favicon.png" alt="Recommendation" className="w-5 h-5 flex-shrink-0 mt-0.5" />
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/signup')}
                className="flex-1 bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition hover:scale-105"
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Create Free Account'}
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={handleRestart}
                className={`flex-1 py-3.5 rounded-xl font-bold transition hover:scale-105 ${
                  darkMode ? 'bg-secondary text-white hover:bg-quaternary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
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

  const q = questions[currentQ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Brain className="w-8 h-8 text-primary" />
            <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              Fear Score Assessment
            </h1>
          </div>
          <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover your investing fear level in 60 seconds
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Question {currentQ + 1} of {questions.length}
            </span>
            <span className={`text-sm font-bold text-primary`}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className={`h-2.5 rounded-full overflow-hidden ${darkMode ? 'bg-secondary' : 'bg-gray-200'}`}>
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div
          className={`p-8 rounded-3xl shadow-2xl ${darkMode ? 'bg-tertiary' : 'bg-white'} ${animating ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'} transition-all duration-300`}
        >
          {/* Question */}
          <div className="text-center mb-8">
            <span className="text-5xl mb-4 block">{q.emoji}</span>
            <h2 className={`text-xl font-bold leading-relaxed ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleSelect(option.score)}
                className={`w-full text-left p-4 rounded-2xl border-2 transition-all duration-200 hover:scale-[1.02] ${
                  selectedOption === option.score
                    ? 'border-primary bg-primary bg-opacity-10 shadow-lg'
                    : darkMode
                      ? 'border-secondary hover:border-primary bg-secondary bg-opacity-50'
                      : 'border-gray-200 hover:border-primary bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    selectedOption === option.score
                      ? 'border-primary bg-primary'
                      : darkMode ? 'border-gray-500' : 'border-gray-300'
                  }`}>
                    {selectedOption === option.score && (
                      <CheckCircle className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <span className={`font-medium ${
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
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition disabled:opacity-30 disabled:cursor-not-allowed ${
                darkMode ? 'bg-secondary text-white hover:bg-quaternary' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={selectedOption === null}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold transition hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
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
