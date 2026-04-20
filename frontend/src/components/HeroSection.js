import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight, BookOpen, Zap, TrendingUp, Shield, Brain, Users, BarChart3, PieChart, Activity, Sparkles, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import P5Background from './P5Background';

gsap.registerPlugin(ScrollTrigger);

function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (counterRef.current) observer.observe(counterRef.current);
    return () => observer.disconnect();
  }, [started]);

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

  return <span ref={counterRef}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

/* ─── Mini Sparkline SVG Chart ─── */
function MiniSparkline({ data, color = '#3B82F6', width = 120, height = 40 }) {
  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * width},${height - (v / Math.max(...data)) * height}`)
    .join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={`grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#grad-${color.replace('#', '')})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Glowing dot at end */}
      {data.length > 0 && (
        <>
          <circle
            cx={width}
            cy={height - (data[data.length - 1] / Math.max(...data)) * height}
            r="3"
            fill={color}
          >
            <animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
          </circle>
        </>
      )}
    </svg>
  );
}

export default function HeroSection({ darkMode, onStartSimulation }) {
  const [currentWord, setCurrentWord] = useState(0);
  const { isAuthenticated } = useAuth();
  const rotatingWords = ["Investing", "Markets", "Risk", "Uncertainty"];

  // Refs for GSAP
  const sectionRef = useRef(null);
  const badgeRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const captionRef = useRef(null);
  const ctaRef = useRef(null);
  const statsRef = useRef(null);
  const cardsRef = useRef(null);
  const graphPanelRef = useRef(null);

  // Sparkline data
  const sparklineData1 = [20, 35, 28, 45, 38, 55, 48, 62, 58, 72, 65, 78, 85];
  const sparklineData2 = [40, 35, 42, 30, 45, 38, 50, 42, 55, 60, 52, 65, 70];
  const sparklineData3 = [10, 25, 18, 30, 22, 40, 35, 48, 42, 55, 50, 58, 62];

  // Rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord(prev => (prev + 1) % rotatingWords.length);
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // GSAP Hero entrance timeline
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Main entrance timeline
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, delay: 0.3 });

      // Badge drops in
      tl.from(badgeRef.current, {
        y: -40,
        opacity: 0,
        scale: 0.8,
        duration: 0.7,
      });

      // Title
      if (titleRef.current) {
        tl.from(titleRef.current, {
          y: 80,
          opacity: 0,
          skewY: 3,
          duration: 1,
          ease: 'power4.out',
        }, '-=0.3');
      }

      // Subtitle slides up
      tl.from(subtitleRef.current, {
        y: 40,
        opacity: 0,
        duration: 0.8,
      }, '-=0.5');

      // Caption slides up
      tl.from(captionRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.7,
      }, '-=0.4');

      // CTA buttons scale in
      if (ctaRef.current) {
        const buttons = ctaRef.current.children;
        tl.from(buttons, {
          y: 30,
          opacity: 0,
          scale: 0.9,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.4)',
        }, '-=0.3');
      }

      // Graph panel slides from right
      if (graphPanelRef.current) {
        tl.from(graphPanelRef.current.children, {
          x: 60,
          opacity: 0,
          scale: 0.9,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
        }, '-=0.4');
      }

      // Lower hero elements removed from GSAP to prevent "stuck at zero opacity" gap bug.

      // Parallax on scroll
      gsap.to(sectionRef.current, {
        backgroundPositionY: '30%',
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Magnetic hover effect for buttons
  const handleMagneticHover = (e) => {
    const btn = e.currentTarget;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(btn, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
  };

  const handleMagneticLeave = (e) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative overflow-hidden text-center"
      style={{
        background: darkMode
          ? '#050A18'
          : 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #DBEAFE 100%)',
      }}
    >
      {/* ─── City Background Image with dark overlay ─── */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: darkMode ? 'url(/hero-bg.png)' : 'none',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Dark gradient overlays */}
        <div
          className="absolute inset-0"
          style={{
            background: darkMode
              ? 'linear-gradient(180deg, rgba(5,10,24,0.55) 0%, rgba(5,10,24,0.8) 50%, rgba(5,10,24,0.97) 100%)'
              : 'transparent',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: darkMode
              ? 'linear-gradient(135deg, rgba(37,99,235,0.07) 0%, transparent 50%, rgba(124,58,237,0.05) 100%)'
              : 'transparent',
          }}
        />
      </div>

      {/* ─── P5.js Animated Graph Background ─── */}
      <P5Background darkMode={darkMode} />

      {/* ─── Main Content ─── */}
      <div className="relative z-10 hero-content" style={{ paddingTop: '56px', paddingBottom: '32px' }}>
        <div className="mx-auto px-4" style={{ maxWidth: '1200px' }}>

          {/* Badge */}
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full mb-6"
            style={{
              background: 'rgba(37, 99, 235, 0.1)',
              border: '1px solid rgba(37, 99, 235, 0.2)',
              backdropFilter: 'blur(12px)',
              padding: '6px 16px',
            }}
          >
            <div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#93C5FD', fontSize: '13px', fontWeight: 600, letterSpacing: '0.03em' }}>
              AI-Powered Investment Education
            </span>
          </div>

          {/* Main Title */}
          <h1
            ref={titleRef}
            style={{
              fontSize: '2.5rem',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '1rem',
              letterSpacing: '-0.03em',
              transformOrigin: 'center bottom',
            }}
          >
            <span style={{ color: darkMode ? '#fff' : '#1E293B', fontSize: 'min(56px, 10vw)', fontWeight: 800 }}>Overcome Your </span>
            <br />
            <span
              style={{
                fontSize: 'min(60px, 11vw)',
                background: 'linear-gradient(135deg, #3B82F6, #8B5CF6, #06B6D4)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Fear of Investing
            </span>
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            style={{
              fontSize: '18px',
              color: darkMode ? '#94A3B8' : '#64748B',
              marginBottom: '0',
              fontWeight: 500,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            Simulate risk. Understand outcomes. Invest smarter.
          </p>

          {/* Dynamic rotating caption */}
          <p
            ref={captionRef}
            style={{
              fontSize: '18px',
              color: darkMode ? '#64748B' : '#94A3B8',
              marginBottom: '32px',
              marginTop: '4px',
              maxWidth: '600px',
              marginLeft: 'auto',
              marginRight: 'auto',
              lineHeight: 1.6,
            }}
          >
            Fear comes from{' '}
            <span
              key={currentWord}
              style={{
                color: '#3B82F6',
                fontWeight: 700,
                display: 'inline-block',
                animation: 'wordSwap 0.5s ease-out',
              }}
            >
              {rotatingWords[currentWord]}
            </span>
            . Experience market scenarios with virtual money — no real risk, pure learning.
          </p>

          {/* CTA Buttons */}
          <div
            ref={ctaRef}
            style={{ display: 'flex', justifyContent: 'center', marginBottom: '40px' }}
          >
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <button
              onClick={onStartSimulation}
              onMouseMove={handleMagneticHover}
              onMouseLeave={handleMagneticLeave}
              className="group flex items-center gap-3"
              style={{
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: '#fff',
                padding: '14px 36px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '17px',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 0 24px rgba(99, 102, 241, 0.5)',
                transition: 'box-shadow 0.3s, transform 0.3s',
              }}
            >
              Start Simulation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <Link
              to="/fear-quiz"
              onMouseMove={handleMagneticHover}
              onMouseLeave={handleMagneticLeave}
              className="group flex items-center gap-3"
              style={{
                padding: '14px 36px',
                borderRadius: '50px',
                fontWeight: 700,
                fontSize: '17px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                background: darkMode ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.9)',
                color: darkMode ? '#E2E8F0' : '#374151',
                backdropFilter: 'blur(12px)',
                cursor: 'pointer',
                textDecoration: 'none',
                transition: 'all 0.3s',
              }}
            >
              <Brain className="w-5 h-5" style={{ color: '#3B82F6' }} />
              Take Fear Quiz
              <ArrowRight className="w-5 h-5 opacity-0 -ml-2 group-hover:opacity-100 group-hover:ml-0 transition-all" />
            </Link>
            </div>
          </div>

          {/* ─── Live Graph Dashboard Mini-Cards ─── */}
          <div
            ref={graphPanelRef}
            className="grid grid-cols-1 md:grid-cols-3 gap-[24px] mb-8 w-full mx-auto"
            style={{ width: '100%' }}
          >
            {[
              { label: 'Portfolio Growth', value: '+24.8%', data: sparklineData1, color: '#10B981', icon: TrendingUp },
              { label: 'Risk Index', value: '32.5', data: sparklineData2, color: '#3B82F6', icon: Activity },
              { label: 'Fear Score', value: 'Low', data: sparklineData3, color: '#8B5CF6', icon: PieChart },
            ].map((chart, i) => (
              <div
                key={i}
                style={{
                  background: darkMode ? 'rgba(15, 23, 42, 0.6)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${darkMode ? 'rgba(37, 99, 235, 0.12)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '16px',
                  padding: '20px 24px',
                  backdropFilter: 'blur(16px)',
                  textAlign: 'left',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <chart.icon style={{ width: 16, height: 16, color: chart.color }} />
                    <span style={{ fontSize: '11px', color: darkMode ? '#64748B' : '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
                      {chart.label}
                    </span>
                  </div>
                  <span style={{ fontSize: '22px', fontWeight: 700, color: chart.color }}>
                    {chart.value}
                  </span>
                </div>
                <MiniSparkline data={chart.data} color={chart.color} width={280} height={80} />
              </div>
            ))}
          </div>

          {/* Trust Strip */}
          <div 
            className="flex flex-col md:flex-row items-center justify-center gap-6 mx-auto mb-8" 
            style={{ 
              padding: '20px', 
              borderRadius: '12px', 
              background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255,255,255,0.8)', 
              border: darkMode ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)', 
              backdropFilter: 'blur(8px)',
              maxWidth: 'fit-content'
            }}
          >
            <div className="flex items-center gap-3"><Shield className="w-6 h-6 text-blue-500" /> <span className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Zero Real Risk</span></div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-400 opacity-30"></div>
            <div className="flex items-center gap-3"><TrendingUp className="w-6 h-6 text-green-500" /> <span className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Real Market Data</span></div>
            <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-gray-400 opacity-30"></div>
            <div className="flex items-center gap-3"><Brain className="w-6 h-6 text-purple-500" /> <span className={`font-semibold text-sm ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>AI-Powered Coaching</span></div>
          </div>

          {/* Stats Counter */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6"
          >
            {[
              { icon: Users, value: 2500, suffix: '+', label: 'Learners' },
              { icon: TrendingUp, value: 10000, suffix: '+', label: 'Simulations Run' },
              { icon: Brain, value: 95, suffix: '%', label: 'Fear Reduced' },
              { icon: Shield, value: 0, suffix: '₹', label: 'Real Money Risked', prefix: '' },
            ].map((stat, i) => (
              <div
                key={i}
                className="stat-card"
                style={{
                  padding: '14px',
                  borderRadius: '16px',
                  background: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.85)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.3s',
                }}
              >
                <stat.icon style={{ width: 24, height: 24, color: '#3B82F6', margin: '0 auto 8px' }} />
                <p style={{ fontSize: '1.5rem', fontWeight: 800, color: darkMode ? '#fff' : '#1E293B' }}>
                  {stat.value === 0
                    ? <span>{stat.prefix}{stat.suffix}</span>
                    : <AnimatedCounter target={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
                  }
                </p>
                <p style={{ fontSize: '0.8rem', marginTop: '4px', color: darkMode ? '#64748B' : '#94A3B8', fontWeight: 500 }}>{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Feature Cards with Images */}
          <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: BookOpen, title: 'Learn Risk-Free',
                desc: 'Practice with virtual money — zero real risk',
                gradient: 'linear-gradient(135deg, #3B82F6, #06B6D4)',
                image: '/img-learn.png',
              },
              {
                icon: Zap, title: 'AI Guidance',
                desc: 'Get personalized explanations from FinBuddy AI',
                gradient: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                image: '/img-ai.png',
              },
              {
                icon: BarChart3, title: 'Real Insights',
                desc: 'Understand probability through Monte Carlo simulations',
                gradient: 'linear-gradient(135deg, #10B981, #059669)',
                image: '/img-insights.png',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="feature-card group"
                style={{
                  borderRadius: '20px',
                  background: darkMode ? 'rgba(15, 23, 42, 0.5)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  overflow: 'hidden',
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, { scale: 1.04, y: -6, duration: 0.3, ease: 'power2.out' });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
                }}
              >
                {/* Card Image */}
                <div style={{ position: 'relative', height: '140px', overflow: 'hidden' }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    className="group-hover:scale-110"
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(transparent 20%, ${darkMode ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.85)'} 100%)`,
                  }} />
                  {/* Icon overlay */}
                  <div
                    style={{
                      position: 'absolute', bottom: -16, left: '50%', transform: 'translateX(-50%)',
                      width: 44, height: 44,
                      background: card.gradient,
                      borderRadius: '14px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      boxShadow: '0 8px 24px rgba(37, 99, 235, 0.25)',
                      zIndex: 2,
                    }}
                  >
                    <card.icon style={{ width: 24, height: 24, color: '#fff' }} />
                  </div>
                </div>
                {/* Card text */}
                <div style={{ padding: '24px 20px 20px', textAlign: 'center' }}>
                  <p style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '8px', color: darkMode ? '#F1F5F9' : '#1E293B' }}>{card.title}</p>
                  <p style={{ fontSize: '0.85rem', color: darkMode ? '#64748B' : '#6B7280', lineHeight: 1.6 }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Bottom gradient fade to next section ─── */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: '30px',
          background: darkMode
            ? 'linear-gradient(transparent, #0C1222)'
            : 'linear-gradient(transparent, #F8FAFC)',
          pointerEvents: 'none',
          zIndex: 5,
        }}
      />

      <style>{`
        @keyframes wordSwap {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </section>
  );
}
