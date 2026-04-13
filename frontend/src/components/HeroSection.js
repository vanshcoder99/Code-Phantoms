import React, { useState, useEffect } from 'react';
import { ArrowRight, BookOpen, Zap, TrendingUp, Shield, Brain, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStarted(true), 300);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration / 16);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(interval);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(interval);
  }, [started, target, duration]);

  return <span>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export default function HeroSection({ darkMode, onStartSimulation }) {
  const [typedText, setTypedText] = useState('');
  const [currentWord, setCurrentWord] = useState(0);
  const { isAuthenticated } = useAuth();
  const fullText = "Overcome Your Fear of Investing";
  const rotatingWords = ["Investing", "Markets", "Risk", "Uncertainty"];

  // Typewriter effect
  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx <= fullText.length) {
        setTypedText(fullText.slice(0, idx));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  return (
    <section
      id="hero"
      className="relative overflow-hidden py-24 px-4 text-center"
      style={{
        background: darkMode
          ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%)'
          : 'linear-gradient(135deg, #f8f9fa 0%, #e8eaf6 50%, #f3e5f5 100%)',
      }}
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute rounded-full opacity-20 blur-3xl"
          style={{
            width: '500px', height: '500px',
            background: 'radial-gradient(circle, #F7374F, transparent)',
            top: '-100px', right: '-100px',
            animation: 'floatOrb1 8s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full opacity-15 blur-3xl"
          style={{
            width: '400px', height: '400px',
            background: 'radial-gradient(circle, #88304E, transparent)',
            bottom: '-50px', left: '-50px',
            animation: 'floatOrb2 10s ease-in-out infinite',
          }}
        />
        <div
          className="absolute rounded-full opacity-10 blur-2xl"
          style={{
            width: '300px', height: '300px',
            background: 'radial-gradient(circle, #522546, transparent)',
            top: '30%', left: '50%',
            animation: 'floatOrb3 12s ease-in-out infinite',
          }}
        />

        {/* Floating Particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full opacity-30"
            style={{
              top: `${20 + i * 12}%`,
              left: `${10 + i * 15}%`,
              animation: `floatParticle ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-sm"
          style={{
            background: darkMode ? 'rgba(247,55,79,0.15)' : 'rgba(247,55,79,0.1)',
            border: '1px solid rgba(247,55,79,0.3)',
            animation: 'fadeInDown 0.6s ease-out',
          }}
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-primary font-semibold text-sm">AI-Powered Investment Education</span>
        </div>

        {/* Main Title with Typewriter */}
        <h1
          className={`text-5xl md:text-7xl font-extrabold mb-6 leading-tight ${darkMode ? 'text-white' : 'text-gray-800'}`}
          style={{ animation: 'fadeInUp 0.8s ease-out' }}
        >
          <span>{typedText}</span>
          <span className="animate-pulse text-primary">|</span>
        </h1>

        {/* Subtitle with rotating words */}
        <p
          className={`text-xl md:text-2xl mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
          style={{ animation: 'fadeInUp 1s ease-out' }}
        >
          Simulate risk. Understand outcomes. Invest smarter.
        </p>

        {/* Dynamic rotating caption */}
        <p
          className={`text-lg mb-10 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
          style={{ animation: 'fadeInUp 1.2s ease-out' }}
        >
          Fear comes from{' '}
          <span
            className="text-primary font-bold inline-block"
            key={currentWord}
            style={{ animation: 'wordSwap 0.5s ease-out' }}
          >
            {rotatingWords[currentWord]}
          </span>
          . Our interactive simulator lets you experience market scenarios with virtual money — no real risk, pure learning.
        </p>

        {/* CTA Buttons */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          style={{ animation: 'fadeInUp 1.4s ease-out' }}
        >
          <button
            onClick={onStartSimulation}
            className="group bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-primary text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center gap-3 hover:scale-105"
            style={{ boxShadow: '0 8px 30px rgba(247,55,79,0.4)' }}
          >
            Start Simulation
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <Link
            to="/fear-quiz"
            className={`group px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 flex items-center gap-3 hover:scale-105 ${
              darkMode
                ? 'bg-white bg-opacity-10 text-white hover:bg-opacity-20 backdrop-blur-sm border border-white border-opacity-20'
                : 'bg-white text-gray-700 hover:bg-gray-100 border-2 border-gray-200 shadow-lg'
            }`}
          >
            <Brain className="w-5 h-5 text-primary" />
            Take Fear Quiz
            <ArrowRight className="w-5 h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
          </Link>
        </div>

        {/* Stats Counter */}
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          style={{ animation: 'fadeInUp 1.6s ease-out' }}
        >
          {[
            { icon: Users, value: 2500, suffix: '+', label: 'Learners' },
            { icon: TrendingUp, value: 10000, suffix: '+', label: 'Simulations Run' },
            { icon: Brain, value: 95, suffix: '%', label: 'Fear Reduced' },
            { icon: Shield, value: 0, suffix: '₹', label: 'Real Money Risked', prefix: '' },
          ].map((stat, i) => (
            <div
              key={i}
              className={`p-5 rounded-2xl backdrop-blur-sm transition-all hover:scale-105 ${
                darkMode
                  ? 'bg-white bg-opacity-5 border border-white border-opacity-10'
                  : 'bg-white bg-opacity-80 border border-gray-200 shadow-md'
              }`}
            >
              <stat.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <p className={`text-2xl md:text-3xl font-extrabold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                {stat.value === 0
                  ? <span>{stat.prefix}{stat.suffix}</span>
                  : <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
                }
              </p>
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6" style={{ animation: 'fadeInUp 1.8s ease-out' }}>
          {[
            {
              icon: BookOpen, title: 'Learn Risk-Free',
              desc: 'Practice with virtual money — zero real risk',
              gradient: 'from-blue-500 to-cyan-400',
            },
            {
              icon: Zap, title: 'AI Guidance',
              desc: 'Get personalized explanations from FinBuddy AI',
              gradient: 'from-primary to-secondary',
            },
            {
              icon: TrendingUp, title: 'Real Insights',
              desc: 'Understand probability through Monte Carlo simulations',
              gradient: 'from-green-500 to-emerald-400',
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`group p-7 rounded-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-2 cursor-pointer ${
                darkMode
                  ? 'bg-white bg-opacity-5 border border-white border-opacity-10 hover:bg-opacity-10'
                  : 'bg-white border border-gray-200 shadow-lg hover:shadow-2xl'
              }`}
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${card.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <card.icon className="w-7 h-7 text-white" />
              </div>
              <p className={`font-bold text-lg mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>{card.title}</p>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes floatOrb1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-30px, 30px) scale(1.1); }
        }
        @keyframes floatOrb2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(30px, -20px) scale(1.05); }
        }
        @keyframes floatOrb3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, 20px); }
        }
        @keyframes floatParticle {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-20px) scale(1.5); opacity: 0.6; }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes wordSwap {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
