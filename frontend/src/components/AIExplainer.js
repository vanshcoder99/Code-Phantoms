import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Zap, Send, Lightbulb, CheckCircle, Brain, Sparkles } from 'lucide-react';
import api from '../api';

gsap.registerPlugin(ScrollTrigger);

export default function AIExplainer({ darkMode }) {
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  // GSAP refs
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const imageRef = useRef(null);

  // GSAP scroll animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      });

      gsap.from(contentRef.current, {
        y: 80, opacity: 0, scale: 0.95, duration: 1, delay: 0.15, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 75%', toggleActions: 'play none none none' },
      });

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          x: -80, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const explainPortfolio = async () => {
    if (!portfolio.trim()) {
      setError('Please enter a portfolio');
      return;
    }
    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const response = await api.post('/api/v1/explain-portfolio', { portfolio });
      setExplanation(response.data.explanation);
      if (response.data.saved) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Running locally (backend not connected).');
      setExplanation(
        `Your portfolio of "${portfolio}" is a balanced mix. This shows good diversification. Consider your risk tolerance and investment timeline. Remember: start small and learn as you go!`
      );
    }
    setLoading(false);
  };

  const examplePortfolios = [
    '50% Stocks, 30% Bonds, 20% Gold',
    '70% Index Funds, 30% Bonds',
    '40% Tech Stocks, 40% Banking, 20% Crypto',
  ];

  return (
    <section
      ref={sectionRef}
      id="explainer"
      style={{
        padding: '80px 16px',
        background: darkMode
          ? 'linear-gradient(180deg, #0C1222 0%, #0F172A 100%)'
          : 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '350px', height: '350px', background: 'radial-gradient(circle, rgba(124,58,237,0.06), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: '999px',
            background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)',
            marginBottom: 16,
          }}>
            <Brain style={{ width: 14, height: 14, color: '#8B5CF6' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              AI-Powered Analysis
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
            color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 12,
          }}>
            AI Portfolio Explainer
          </h2>
          <p style={{ fontSize: '1.05rem', color: darkMode ? '#64748B' : '#94A3B8', maxWidth: 520, margin: '0 auto' }}>
            Get instant AI-powered analysis of any investment portfolio
          </p>
        </div>

        {/* Saved toast */}
        {saved && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white shadow-lg animate-bounce">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Analysis saved to your account!</span>
          </div>
        )}

        {/* Main content: Image + Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.2fr)',
          gap: '32px',
          alignItems: 'start',
        }}>
          {/* Left: AI Image + Info */}
          <div ref={imageRef} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* AI illustration */}
            <div style={{
              borderRadius: '20px',
              overflow: 'hidden',
              border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
              position: 'relative',
            }}>
              <img
                src="/img-ai.png"
                alt="AI Analysis"
                style={{
                  width: '100%', height: '240px',
                  objectFit: 'cover', display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: `linear-gradient(transparent 30%, ${darkMode ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.85)'} 100%)`,
              }} />
              <div style={{ position: 'absolute', bottom: 20, left: 20, right: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <Sparkles style={{ width: 16, height: 16, color: '#8B5CF6' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E2E8F0' }}>FinBuddy AI</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.5 }}>
                  Powered by advanced LLM technology to give you personalized financial insights
                </p>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{
              display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12,
            }}>
              {[
                { label: 'Analyses Done', value: '12,500+', color: '#3B82F6' },
                { label: 'Accuracy', value: '94.2%', color: '#10B981' },
              ].map((stat, i) => (
                <div key={i} style={{
                  background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.9)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                  borderRadius: '14px', padding: '16px', textAlign: 'center',
                  backdropFilter: 'blur(12px)',
                }}>
                  <span style={{ fontSize: '1.3rem', fontWeight: 800, color: stat.color }}>{stat.value}</span>
                  <p style={{ fontSize: '0.7rem', color: darkMode ? '#64748B' : '#94A3B8', fontWeight: 600, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div ref={contentRef} style={{
            background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.95)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '24px',
            padding: '32px',
            backdropFilter: 'blur(16px)',
          }}>
            {/* Input */}
            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontWeight: 600, marginBottom: 10,
                color: darkMode ? '#E2E8F0' : '#374151', fontSize: '0.95rem',
              }}>
                Enter Your Portfolio
              </label>
              <textarea
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="e.g., 50% Stocks, 30% Bonds, 20% Gold"
                style={{
                  width: '100%', padding: '14px 16px', borderRadius: '14px',
                  border: `2px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}`,
                  background: darkMode ? 'rgba(15,23,42,0.8)' : '#F8FAFC',
                  color: darkMode ? '#F1F5F9' : '#1E293B',
                  fontSize: '0.95rem', resize: 'vertical',
                  outline: 'none', transition: 'border-color 0.3s',
                  fontFamily: 'inherit',
                }}
                rows="3"
                onFocus={(e) => e.target.style.borderColor = '#3B82F6'}
                onBlur={(e) => e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.1)'}
              />
            </div>

            {/* Example Portfolios */}
            <div style={{ marginBottom: 20 }}>
              <p style={{ fontSize: '0.8rem', fontWeight: 600, marginBottom: 10, color: darkMode ? '#64748B' : '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Quick Examples
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {examplePortfolios.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPortfolio(example)}
                    style={{
                      padding: '8px 14px', borderRadius: '10px', fontSize: '0.8rem',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                      background: darkMode ? 'rgba(15,23,42,0.8)' : '#F1F5F9',
                      color: darkMode ? '#94A3B8' : '#64748B',
                      cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={(e) => { e.target.style.background = '#2563EB'; e.target.style.color = '#fff'; e.target.style.borderColor = '#2563EB'; }}
                    onMouseLeave={(e) => { e.target.style.background = darkMode ? 'rgba(15,23,42,0.8)' : '#F1F5F9'; e.target.style.color = darkMode ? '#94A3B8' : '#64748B'; e.target.style.borderColor = darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'; }}
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {/* Explain Button */}
            <button
              onClick={explainPortfolio}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1rem',
                border: 'none',
                cursor: loading ? 'wait' : 'pointer',
                opacity: loading ? 0.6 : 1,
                boxShadow: '0 6px 24px rgba(37,99,235,0.3)',
                transition: 'all 0.3s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginBottom: 16,
                fontFamily: 'inherit',
              }}
            >
              <Zap style={{ width: 18, height: 18 }} />
              {loading ? 'Analyzing...' : 'Explain My Portfolio'}
            </button>

            {error && (
              <p style={{ color: '#F59E0B', marginBottom: 12, fontSize: '0.85rem', textAlign: 'center' }}>{error}</p>
            )}

            {/* Explanation Output */}
            {explanation && (
              <div style={{
                padding: '20px',
                borderRadius: '16px',
                background: 'linear-gradient(135deg, rgba(37,99,235,0.1), rgba(124,58,237,0.08))',
                border: '1px solid rgba(37,99,235,0.15)',
                borderLeft: '4px solid #3B82F6',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <Lightbulb style={{ width: 18, height: 18, color: '#F59E0B' }} />
                  <span style={{ fontWeight: 700, color: darkMode ? '#F1F5F9' : '#1E293B', fontSize: '0.95rem' }}>AI Analysis</span>
                </div>
                <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: darkMode ? '#CBD5E1' : '#4B5563', margin: 0 }}>
                  {explanation}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Responsive */}
      <style>{`
        @media (max-width: 768px) {
          #explainer > div > div:nth-child(3) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
