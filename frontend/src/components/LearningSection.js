import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BookOpen, Heart, Gamepad2, TrendingUp, ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function LearningSection({ darkMode }) {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const gridRef = useRef(null);
  const ctaRef = useRef(null);

  const cards = [
    {
      icon: BookOpen,
      title: 'What is Risk?',
      description: 'Risk is the possibility of losing money. Higher returns usually come with higher risk. Understanding risk helps you make smart choices.',
      image: '/img-risk.png',
      color: '#3B82F6',
    },
    {
      icon: Heart,
      title: 'Why Fear is Normal',
      description: 'Everyone feels scared about investing. Fear is natural when dealing with money. The key is to understand it, not avoid it.',
      image: '/img-fear.png',
      color: '#F59E0B',
    },
    {
      icon: Gamepad2,
      title: 'How Simulation Helps',
      description: 'Practice with virtual money first. See how markets behave. Build confidence. Then invest real money with knowledge.',
      image: '/img-learn.png',
      color: '#8B5CF6',
    },
    {
      icon: TrendingUp,
      title: 'Long-term Wins',
      description: 'Markets go up and down daily, but historically trend upward over years. Time is your best friend in investing.',
      image: '/img-insights.png',
      color: '#10B981',
    },
  ];

  // Simple fade-in on mount — no scrollTrigger to avoid invisible cards
  useEffect(() => {
    if (headingRef.current) {
      headingRef.current.style.opacity = '1';
      headingRef.current.style.transform = 'translateY(0)';
    }
    if (gridRef.current) {
      Array.from(gridRef.current.children).forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0) scale(1)';
        }, 100 + i * 80);
      });
    }
    if (ctaRef.current) {
      setTimeout(() => {
        ctaRef.current.style.opacity = '1';
        ctaRef.current.style.transform = 'translateY(0)';
      }, 500);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      id="learning"
      style={{
        padding: '24px 16px',
        background: darkMode
          ? 'linear-gradient(180deg, #0C1222 0%, #0F172A 100%)'
          : 'linear-gradient(180deg, #fff 0%, #F8FAFC 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative orbs */}
      <div style={{ position: 'absolute', top: '-60px', left: '-60px', width: '300px', height: '300px', background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: '250px', height: '250px', background: 'radial-gradient(circle, rgba(124,58,237,0.05), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Heading */}
        <div ref={headingRef} style={{ textAlign: 'center', marginBottom: '16px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '8px 16px', borderRadius: '999px',
            background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(37,99,235,0.15)',
            marginBottom: 16,
          }}>
            <BookOpen style={{ width: 14, height: 14, color: '#3B82F6' }} />
            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Knowledge Base
            </span>
          </div>
          <h2 style={{
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800,
            color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 8,
          }}>
            Learning Hub
          </h2>
          <p style={{ fontSize: '0.9rem', color: darkMode ? '#64748B' : '#94A3B8', maxWidth: 500, margin: '0 auto' }}>
            Build your investment knowledge from the ground up
          </p>
        </div>

        {/* Cards Grid */}
        <div ref={gridRef} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '14px',
          marginBottom: '28px',
        }}>
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                style={{
                  borderRadius: '20px',
                  overflow: 'hidden',
                  background: darkMode ? 'rgba(15,23,42,0.6)' : 'rgba(255,255,255,0.95)',
                  border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}`,
                  backdropFilter: 'blur(12px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                }}
                onMouseEnter={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1.03, y: -6,
                    boxShadow: `0 20px 50px ${card.color}15`,
                    duration: 0.3, ease: 'power2.out',
                  });
                }}
                onMouseLeave={(e) => {
                  gsap.to(e.currentTarget, {
                    scale: 1, y: 0, boxShadow: 'none',
                    duration: 0.4, ease: 'elastic.out(1, 0.5)',
                  });
                }}
              >
                {/* Card Image */}
                <div style={{ position: 'relative', height: '130px', overflow: 'hidden' }}>
                  <img
                    src={card.image}
                    alt={card.title}
                    style={{
                      width: '100%', height: '100%',
                      objectFit: 'cover', display: 'block',
                      transition: 'transform 0.5s ease',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(transparent 30%, ${darkMode ? 'rgba(15,23,42,0.95)' : 'rgba(255,255,255,0.9)'} 100%)`,
                  }} />
                  {/* Icon badge */}
                  <div style={{
                    position: 'absolute', bottom: -18, left: 20,
                    width: 42, height: 42, borderRadius: '12px',
                    background: card.color,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 6px 20px ${card.color}40`,
                    zIndex: 2,
                  }}>
                    <Icon style={{ width: 20, height: 20, color: '#fff' }} />
                  </div>
                </div>

                {/* Card Content */}
                <div style={{ padding: '20px 16px 18px' }}>
                  <h3 style={{
                    fontSize: '1rem', fontWeight: 700, marginBottom: 6,
                    color: darkMode ? '#F1F5F9' : '#1E293B',
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    fontSize: '0.85rem', lineHeight: 1.7,
                    color: darkMode ? '#64748B' : '#6B7280',
                  }}>
                    {card.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          ref={ctaRef}
          style={{
            padding: '28px',
            borderRadius: '18px',
            textAlign: 'center',
            background: darkMode
              ? 'linear-gradient(135deg, rgba(37,99,235,0.08), rgba(124,58,237,0.06))'
              : 'linear-gradient(135deg, rgba(37,99,235,0.04), rgba(124,58,237,0.03))',
            border: `1px solid ${darkMode ? 'rgba(37,99,235,0.12)' : 'rgba(37,99,235,0.08)'}`,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Decorative image */}
          <div style={{
            position: 'absolute', right: -20, bottom: -20,
            width: '180px', height: '180px',
            opacity: 0.06,
            backgroundImage: 'url(/img-insights.png)',
            backgroundSize: 'cover',
            borderRadius: '50%',
            filter: 'blur(2px)',
            pointerEvents: 'none',
          }} />

          <h3 style={{
            fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)', fontWeight: 800,
            color: darkMode ? '#F1F5F9' : '#1E293B', marginBottom: 8,
          }}>
            Ready to Start Your Journey?
          </h3>
          <p style={{
            marginBottom: 24, fontSize: '1rem',
            color: darkMode ? '#94A3B8' : '#64748B', maxWidth: 500, margin: '0 auto 24px',
          }}>
            Use our simulator to practice, learn from AI, and build confidence.
          </p>
          <a
            href="#simulator"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 10,
              background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
              color: '#fff', padding: '14px 32px', borderRadius: '14px',
              fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
              boxShadow: '0 8px 28px rgba(37,99,235,0.3)',
              transition: 'all 0.3s',
            }}
          >
            Start Now
            <ArrowRight style={{ width: 18, height: 18 }} />
          </a>
        </div>
      </div>
    </section>
  );
}
