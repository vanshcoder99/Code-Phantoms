import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { AlertTriangle, Heart } from 'lucide-react';

export default function MarketEventBanner({ crashes, message, onDismiss }) {
  const bannerRef = useRef(null);

  useEffect(() => {
    if (bannerRef.current) {
      // Shake animation on mount
      gsap.fromTo(bannerRef.current,
        { x: -8 },
        {
          x: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)',
          onStart: () => {
            gsap.to(bannerRef.current, {
              x: '+=6', yoyo: true, repeat: 5, duration: 0.08, ease: 'power1.inOut',
            });
          },
        }
      );
    }
  }, []);

  const handleDismiss = () => {
    if (bannerRef.current) {
      gsap.to(bannerRef.current, { y: -80, opacity: 0, duration: 0.3, ease: 'power2.in', onComplete: onDismiss });
    } else {
      onDismiss();
    }
  };

  if (!crashes || crashes.length === 0) return null;

  return (
    <div ref={bannerRef} style={{
      background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(220,38,38,0.08))',
      border: '1px solid rgba(239,68,68,0.25)',
      borderRadius: '16px', padding: '16px 20px', marginBottom: '20px',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Animated pulse background */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: '16px',
        background: 'radial-gradient(circle at 20% 50%, rgba(239,68,68,0.08), transparent 70%)',
        animation: 'pulse 2s ease-in-out infinite',
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <AlertTriangle style={{ width: 22, height: 22, color: '#EF4444' }} />
          <h3 style={{ color: '#FCA5A5', fontWeight: 800, fontSize: '1rem', margin: 0 }}>
            Market Crash Alert
          </h3>
        </div>

        {/* Affected assets */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
          {crashes.map((crash, i) => (
            <span key={i} style={{
              padding: '4px 12px', borderRadius: '8px',
              background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#FCA5A5', fontSize: '0.8rem', fontWeight: 700,
            }}>
              {crash.symbol} −{crash.drop_pct}%
            </span>
          ))}
        </div>

        {/* FinBuddy message */}
        {message && (
          <div style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.12)',
            borderRadius: '12px', padding: '10px 14px', marginBottom: '12px', position: 'relative',
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#3B82F6', position: 'absolute', top: -4, left: 12 }} />
            <p style={{ color: '#CBD5E1', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>
              {message}
            </p>
          </div>
        )}

        {/* Don't Panic button */}
        <button onClick={handleDismiss} style={{
          padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
          background: 'rgba(255,255,255,0.06)', color: '#FCA5A5', fontWeight: 700,
          fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px',
          transition: 'background 0.2s',
        }}>
          <Heart style={{ width: 14, height: 14 }} /> Don't Panic — I'm Fine
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
