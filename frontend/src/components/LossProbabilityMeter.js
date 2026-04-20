import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AlertCircle, CheckCircle, AlertTriangle, Shield, TrendingUp, TrendingDown, Activity } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

/* ─── Animated SVG Ring Gauge ─── */
function RingGauge({ percentage, size = 220, strokeWidth = 14, darkMode }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const gaugeRef = useRef(null);

  const getColor = () => {
    if (percentage <= 20) return { main: '#10B981', glow: 'rgba(16,185,129,0.4)', bg: 'rgba(16,185,129,0.08)' };
    if (percentage <= 40) return { main: '#F59E0B', glow: 'rgba(245,158,11,0.4)', bg: 'rgba(245,158,11,0.08)' };
    return { main: '#EF4444', glow: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.08)' };
  };
  const colors = getColor();

  useEffect(() => {
    if (!gaugeRef.current) return;
    const circle = gaugeRef.current;
    gsap.fromTo(circle,
      { strokeDashoffset: circumference },
      {
        strokeDashoffset: offset,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: circle,
          start: 'top 85%',
          toggleActions: 'play none none none',
        },
      }
    );
  }, [circumference, offset]);

  return (
    <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)'}
          strokeWidth={strokeWidth}
        />
        {/* Animated gauge ring */}
        <circle
          ref={gaugeRef}
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={colors.main}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 12px ${colors.glow})`,
            transition: 'stroke 0.5s ease',
          }}
        />
        {/* Decorative ticks */}
        {[...Array(36)].map((_, i) => {
          const angle = (i / 36) * 360;
          const rad = (angle * Math.PI) / 180;
          const innerR = radius - strokeWidth / 2 - 6;
          const outerR = radius - strokeWidth / 2 - 2;
          const x1 = size / 2 + innerR * Math.cos(rad);
          const y1 = size / 2 + innerR * Math.sin(rad);
          const x2 = size / 2 + outerR * Math.cos(rad);
          const y2 = size / 2 + outerR * Math.sin(rad);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke={darkMode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}
              strokeWidth={i % 9 === 0 ? 2 : 0.5}
            />
          );
        })}
      </svg>
      {/* Center content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{
          fontSize: '3rem', fontWeight: 800,
          color: colors.main,
          lineHeight: 1,
          textShadow: `0 0 30px ${colors.glow}`,
        }}>
          {percentage}%
        </span>
        <span style={{
          fontSize: '0.75rem', fontWeight: 600,
          color: darkMode ? '#64748B' : '#94A3B8',
          textTransform: 'uppercase', letterSpacing: '0.1em',
          marginTop: 4,
        }}>
          Loss Chance
        </span>
      </div>
    </div>
  );
}

export default function LossProbabilityMeter({ darkMode, riskLevel = 'medium' }) {
  const [probability, setProbability] = useState(0);

  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const contentRef = useRef(null);
  const cardsRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const probabilities = { low: 15, medium: 35, high: 60 };
    setProbability(probabilities[riskLevel] || 35);
  }, [riskLevel]);

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

      if (cardsRef.current) {
        gsap.from(cardsRef.current.children, {
          y: 50, opacity: 0, scale: 0.9, duration: 0.7, stagger: 0.12, ease: 'back.out(1.3)',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }

      if (imageRef.current) {
        gsap.from(imageRef.current, {
          x: 80, opacity: 0, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: imageRef.current, start: 'top 85%', toggleActions: 'play none none none' },
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const getRiskLabel = () => {
    if (probability <= 20) return 'Low Risk';
    if (probability <= 40) return 'Medium Risk';
    return 'High Risk';
  };

  const getRiskColor = () => {
    if (probability <= 20) return '#10B981';
    if (probability <= 40) return '#F59E0B';
    return '#EF4444';
  };

  const getIcon = () => {
    if (probability <= 20) return <CheckCircle style={{ width: 20, height: 20, color: '#10B981' }} />;
    if (probability <= 40) return <AlertTriangle style={{ width: 20, height: 20, color: '#F59E0B' }} />;
    return <AlertCircle style={{ width: 20, height: 20, color: '#EF4444' }} />;
  };

  const riskFactors = [
    {
      icon: TrendingUp, label: 'Expected Return',
      value: probability <= 20 ? '+6-8%' : probability <= 40 ? '+10-15%' : '+18-25%',
      color: '#10B981',
    },
    {
      icon: TrendingDown, label: 'Max Drawdown',
      value: probability <= 20 ? '-5%' : probability <= 40 ? '-15%' : '-30%',
      color: '#EF4444',
    },
    {
      icon: Activity, label: 'Volatility',
      value: probability <= 20 ? 'Low' : probability <= 40 ? 'Moderate' : 'High',
      color: '#F59E0B',
    },
    {
      icon: Shield, label: 'Safety Score',
      value: probability <= 20 ? '9.2/10' : probability <= 40 ? '6.5/10' : '3.8/10',
      color: '#3B82F6',
    },
  ];

  return (
    <section
      ref={sectionRef}
      style={{
        padding: '80px 16px',
        background: darkMode
          ? 'linear-gradient(180deg, #0C1222 0%, #0F172A 50%, #131B2E 100%)'
          : 'linear-gradient(180deg, #F8FAFC 0%, #fff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative background orbs */}
      <div style={{ position: 'absolute', top: '-100px', right: '-100px', width: '400px', height: '400px', background: `radial-gradient(circle, ${getRiskColor()}15, transparent)`, borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-80px', left: '-80px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.08), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: '999px',
            background: `${getRiskColor()}12`, border: `1px solid ${getRiskColor()}25`,
            marginBottom: 16,
          }}>
            {getIcon()}
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: getRiskColor(), textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              {getRiskLabel()} Portfolio
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
            color: darkMode ? '#F1F5F9' : '#1E293B',
            marginBottom: 12,
          }}>
            Loss Probability Meter
          </h2>
          <p style={{ fontSize: '1.05rem', color: darkMode ? '#64748B' : '#94A3B8', maxWidth: 500, margin: '0 auto' }}>
            Understand your portfolio's risk profile through interactive analysis
          </p>
        </div>

        {/* Main content grid */}
        <div ref={contentRef} style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
          gap: '40px',
          alignItems: 'center',
          marginBottom: '48px',
        }}>
          {/* Left: Gauge + Info */}
          <div style={{
            background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.9)',
            border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
            borderRadius: '24px',
            padding: '40px 32px',
            backdropFilter: 'blur(16px)',
            textAlign: 'center',
          }}>
            <RingGauge percentage={probability} darkMode={darkMode} />

            <div style={{ marginTop: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              {getIcon()}
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: getRiskColor() }}>
                {getRiskLabel()}
              </span>
            </div>

            <p style={{
              marginTop: 12, fontSize: '0.95rem', lineHeight: 1.7,
              color: darkMode ? '#94A3B8' : '#64748B', maxWidth: 360, margin: '12px auto 0',
            }}>
              {probability <= 20
                ? 'Your portfolio has a low chance of losses. A conservative and steady approach.'
                : probability <= 40
                  ? 'Moderate risk with balanced growth potential. Some volatility expected.'
                  : 'High volatility portfolio with significant upside and downside potential.'}
            </p>

            {/* Spectrum Bar */}
            <div style={{ marginTop: 28 }}>
              <div style={{
                width: '100%', height: 8, borderRadius: 999, overflow: 'hidden',
                background: 'linear-gradient(90deg, #10B981, #F59E0B, #EF4444)',
                position: 'relative',
              }}>
                {/* Indicator needle */}
                <div style={{
                  position: 'absolute',
                  left: `${probability}%`,
                  top: -4, width: 16, height: 16,
                  borderRadius: '50%',
                  background: getRiskColor(),
                  border: `3px solid ${darkMode ? '#0F172A' : '#fff'}`,
                  boxShadow: `0 0 12px ${getRiskColor()}80`,
                  transform: 'translateX(-50%)',
                  transition: 'left 1s ease-out',
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 600 }}>Safe</span>
                <span style={{ fontSize: '0.7rem', color: '#F59E0B', fontWeight: 600 }}>Moderate</span>
                <span style={{ fontSize: '0.7rem', color: '#EF4444', fontWeight: 600 }}>Risky</span>
              </div>
            </div>
          </div>

          {/* Right: Image + Risk metrics */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Risk education image */}
            <div
              ref={imageRef}
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                position: 'relative',
              }}
            >
              <img
                src="/img-risk.png"
                alt="Risk Management"
                style={{
                  width: '100%', height: '220px',
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(transparent 40%, rgba(5,10,24,0.8) 100%)',
              }} />
              <div style={{
                position: 'absolute', bottom: 16, left: 20, right: 20,
              }}>
                <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 500 }}>
                  Understanding risk is the first step to conquering your investment fear
                </p>
              </div>
            </div>

            {/* Risk factor mini cards */}
            <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {riskFactors.map((factor, i) => {
                const Icon = factor.icon;
                return (
                  <div
                    key={i}
                    style={{
                      background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.9)',
                      border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                      borderRadius: '16px',
                      padding: '16px',
                      backdropFilter: 'blur(12px)',
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                    }}
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.04, y: -4, duration: 0.25, ease: 'power2.out' })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, y: 0, duration: 0.35, ease: 'elastic.out(1,0.5)' })}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                      <Icon style={{ width: 14, height: 14, color: factor.color }} />
                      <span style={{ fontSize: '0.7rem', color: darkMode ? '#64748B' : '#94A3B8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {factor.label}
                      </span>
                    </div>
                    <span style={{ fontSize: '1.3rem', fontWeight: 800, color: factor.color }}>
                      {factor.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Tip */}
        <div style={{
          background: darkMode
            ? 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.06))'
            : 'rgba(37,99,235,0.04)',
          border: `1px solid ${darkMode ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.1)'}`,
          borderRadius: '16px',
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          gap: 16,
        }}>
          <div style={{
            width: 40, height: 40, borderRadius: '12px',
            background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Shield style={{ width: 20, height: 20, color: '#fff' }} />
          </div>
          <p style={{ fontSize: '0.9rem', color: darkMode ? '#94A3B8' : '#64748B', lineHeight: 1.6, margin: 0 }}>
            <strong style={{ color: darkMode ? '#F1F5F9' : '#1E293B' }}>Pro tip:</strong> Higher risk doesn't mean bad — it means more volatility. Choose based on your investment timeline, financial goals, and personal comfort level.
          </p>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          section > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
