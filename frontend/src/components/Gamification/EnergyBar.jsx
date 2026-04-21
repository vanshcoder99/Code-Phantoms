// ────────────────────────────────────────────────────────
//  EnergyBar.jsx — Floating Gamification Status Pill
//  • GSAP-animated points counter
//  • Streak flame display
//  • Pulsing "SPIN NOW" badge when spin is available
// ────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { Zap, Flame } from 'lucide-react';
import { gsap } from 'gsap';

export default function EnergyBar({
  points = 0,
  streak = 0,
  spinAvailable = false,
  onSpinClick,
}) {
  const barRef = useRef(null);
  const pointsRef = useRef(null);
  const counterObj = useRef({ val: 0 });
  const spinBadgeRef = useRef(null);
  const [displayPoints, setDisplayPoints] = useState(0);

  // ── Entrance animation ──
  useEffect(() => {
    if (!barRef.current) return;
    gsap.fromTo(
      barRef.current,
      { y: -60, opacity: 0, scale: 0.9 },
      { y: 0, opacity: 1, scale: 1, duration: 0.7, ease: 'back.out(1.7)', delay: 0.3 }
    );
  }, []);

  // ── GSAP count-up animation when `points` prop changes ──
  useEffect(() => {
    const from = counterObj.current.val;
    if (from === points) return;

    gsap.to(counterObj.current, {
      val: points,
      duration: 1.2,
      ease: 'power2.out',
      onUpdate: () => {
        setDisplayPoints(Math.round(counterObj.current.val));
      },
    });

    // Flash the points section on update
    if (pointsRef.current) {
      gsap.fromTo(
        pointsRef.current,
        { scale: 1.25, color: '#34D399' },
        { scale: 1, color: '#10B981', duration: 0.6, ease: 'elastic.out(1, 0.4)' }
      );
    }
  }, [points]);

  // ── Pulsing spin badge entrance ──
  useEffect(() => {
    if (spinAvailable && spinBadgeRef.current) {
      gsap.fromTo(
        spinBadgeRef.current,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2)', delay: 0.1 }
      );
    }
  }, [spinAvailable]);

  return (
    <>
      <div
        ref={barRef}
        style={{
          position: 'fixed',
          top: 16,
          right: 20,
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '8px 10px',
          borderRadius: 50,
          background: 'rgba(2, 6, 23, 0.65)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          boxShadow:
            '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
          fontFamily: "'Montserrat', 'Inter', sans-serif",
          opacity: 0, // GSAP handles reveal
        }}
      >
        {/* ── Points Capsule ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 30,
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.18)',
          }}
        >
          <Zap
            size={15}
            style={{
              color: '#10B981',
              filter: 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))',
            }}
          />
          <span
            ref={pointsRef}
            style={{
              color: '#10B981',
              fontWeight: 800,
              fontSize: '0.82rem',
              letterSpacing: '-0.02em',
              minWidth: 28,
              textAlign: 'right',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {displayPoints.toLocaleString()}
          </span>
          <span
            style={{
              color: '#64748B',
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            pts
          </span>
        </div>

        {/* ── Divider ── */}
        <div
          style={{
            width: 1,
            height: 20,
            background:
              'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
          }}
        />

        {/* ── Streak Capsule ── */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            padding: '5px 12px',
            borderRadius: 30,
            background:
              streak > 0
                ? 'rgba(249, 115, 22, 0.1)'
                : 'rgba(100, 116, 139, 0.08)',
            border: `1px solid ${
              streak > 0
                ? 'rgba(249, 115, 22, 0.18)'
                : 'rgba(100, 116, 139, 0.12)'
            }`,
          }}
        >
          <Flame
            size={15}
            style={{
              color: streak > 0 ? '#F97316' : '#64748B',
              filter:
                streak > 0
                  ? 'drop-shadow(0 0 4px rgba(249, 115, 22, 0.5))'
                  : 'none',
            }}
          />
          <span
            style={{
              color: streak > 0 ? '#FB923C' : '#64748B',
              fontWeight: 800,
              fontSize: '0.82rem',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {streak}
          </span>
          <span
            style={{
              color: '#64748B',
              fontSize: '0.65rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}
          >
            streak
          </span>
        </div>

        {/* ── SPIN NOW Badge (Conditional) ── */}
        {spinAvailable && (
          <>
            <div
              style={{
                width: 1,
                height: 20,
                background:
                  'linear-gradient(180deg, transparent, rgba(255,255,255,0.1), transparent)',
              }}
            />
            <button
              ref={spinBadgeRef}
              onClick={onSpinClick}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                padding: '5px 14px',
                borderRadius: 30,
                border: '1px solid rgba(201, 168, 76, 0.35)',
                background:
                  'linear-gradient(135deg, rgba(201, 168, 76, 0.15), rgba(201, 168, 76, 0.08))',
                color: '#C9A84C',
                fontWeight: 800,
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                animation: 'energyBarSpinPulse 2s ease-in-out infinite',
                transformOrigin: 'center',
                opacity: 0, // GSAP handles reveal
              }}
            >
              <span style={{ fontSize: '0.9rem' }}>🎰</span>
              SPIN NOW
            </button>
          </>
        )}
      </div>

      {/* ── Scoped Keyframes ── */}
      <style>{`
        @keyframes energyBarSpinPulse {
          0%, 100% {
            box-shadow:
              0 0 8px rgba(201, 168, 76, 0.2),
              0 0 20px rgba(201, 168, 76, 0.08);
          }
          50% {
            box-shadow:
              0 0 16px rgba(201, 168, 76, 0.4),
              0 0 40px rgba(201, 168, 76, 0.15);
          }
        }
      `}</style>
    </>
  );
}
