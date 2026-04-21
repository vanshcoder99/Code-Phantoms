// ────────────────────────────────────────────────────────
//  SmartSpinTrigger.jsx — Surprise Spin Pop-up
//  • Slides up from bottom center via GSAP
//  • Only renders when spinAvailable === true
//  • Glassmorphism dark card with reward-drop vibe
// ────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { gsap } from 'gsap';

export default function SmartSpinTrigger({ spinAvailable = false, onSpinNow, onDismiss }) {
  const cardRef = useRef(null);
  const overlayRef = useRef(null);
  const wheelEmojiRef = useRef(null);
  const [visible, setVisible] = useState(false);

  // ── Mount when spinAvailable becomes true ──
  useEffect(() => {
    if (!spinAvailable) return;

    // Delay so it feels like a "surprise drop", not instant
    const timer = setTimeout(() => setVisible(true), 900);
    return () => clearTimeout(timer);
  }, [spinAvailable]);

  // ── GSAP entrance once mounted ──
  useEffect(() => {
    if (!visible || !cardRef.current) return;

    const tl = gsap.timeline();

    // Fade in overlay
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    );

    // Slide card up from below + scale
    tl.fromTo(
      cardRef.current,
      { y: 120, opacity: 0, scale: 0.88 },
      { y: 0, opacity: 1, scale: 1, duration: 0.55, ease: 'back.out(1.6)' },
      '-=0.15'
    );

    // Spin the wheel emoji continuously
    gsap.to(wheelEmojiRef.current, {
      rotation: 360,
      duration: 2.5,
      ease: 'none',
      repeat: -1,
    });
  }, [visible]);

  const dismiss = () => {
    if (!cardRef.current) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onDismiss?.();
      },
    });

    tl.to(cardRef.current, {
      y: 100,
      opacity: 0,
      scale: 0.9,
      duration: 0.35,
      ease: 'power2.in',
    });
    tl.to(overlayRef.current, { opacity: 0, duration: 0.2, ease: 'power1.in' }, '-=0.1');
  };

  const handleSpinNow = () => {
    if (!cardRef.current) return;

    gsap.to(cardRef.current, {
      scale: 1.06,
      duration: 0.12,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
      onComplete: () => {
        setVisible(false);
        onSpinNow?.();
      },
    });
  };

  if (!spinAvailable || !visible) return null;

  return (
    <>
      {/* ── Soft scrim overlay ── */}
      <div
        ref={overlayRef}
        onClick={dismiss}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(2, 6, 23, 0.55)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          zIndex: 10000,
          opacity: 0,
          fontFamily: "'Montserrat', 'Inter', sans-serif",
        }}
      />

      {/* ── Main card ── */}
      <div
        ref={cardRef}
        style={{
          position: 'fixed',
          bottom: 40,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10001,
          width: 'min(420px, 92vw)',
          background: 'linear-gradient(145deg, rgba(10,17,40,0.92), rgba(2,6,23,0.97))',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(201,168,76,0.22)',
          borderRadius: 24,
          padding: '32px 28px 26px',
          boxShadow:
            '0 24px 64px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.06)',
          opacity: 0, // GSAP reveals it
          textAlign: 'center',
        }}
      >
        {/* ── Close button ── */}
        <button
          onClick={dismiss}
          style={{
            position: 'absolute',
            top: 14,
            right: 14,
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
            width: 30,
            height: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#64748B',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#F1F5F9';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            e.currentTarget.style.color = '#64748B';
          }}
        >
          <X size={14} />
        </button>

        {/* ── Gold glow top bar ── */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: '20%',
            right: '20%',
            height: 2,
            borderRadius: 2,
            background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)',
            boxShadow: '0 0 16px rgba(201,168,76,0.6)',
          }}
        />

        {/* ── Wheel emoji ── */}
        <div
          ref={wheelEmojiRef}
          style={{
            fontSize: '3.4rem',
            marginBottom: 8,
            display: 'inline-block',
            filter: 'drop-shadow(0 0 18px rgba(201,168,76,0.45))',
            lineHeight: 1,
          }}
        >
          🎡
        </div>

        {/* ── Eyebrow label ── */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '3px 12px',
            borderRadius: 20,
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.22)',
            color: '#C9A84C',
            fontSize: '0.62rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#C9A84C', display: 'inline-block', animation: 'stPing 1.2s ease-in-out infinite' }} />
          Smart Loot Engine
        </div>

        {/* ── Headline ── */}
        <h2
          style={{
            fontSize: '1.45rem',
            fontWeight: 900,
            color: '#F1F5F9',
            margin: '0 0 8px',
            lineHeight: 1.25,
            letterSpacing: '-0.02em',
          }}
        >
          The Smart Wheel{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #C9A84C, #F0D080)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            found you!
          </span>
        </h2>

        {/* ── Sub-copy ── */}
        <p
          style={{
            color: '#64748B',
            fontSize: '0.82rem',
            lineHeight: 1.6,
            margin: '0 auto 24px',
            maxWidth: 300,
          }}
        >
          Your financial habits unlocked a mystery reward. Spin to reveal — it could be Gold tier! 🏆
        </p>

        {/* ── Reward teaser pills ── */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 8,
            marginBottom: 26,
          }}
        >
          {[
            { label: 'RARE', color: '#C9A84C', bg: 'rgba(201,168,76,0.1)', border: 'rgba(201,168,76,0.25)' },
            { label: 'UNCOMMON', color: '#8B5CF6', bg: 'rgba(139,92,246,0.1)', border: 'rgba(139,92,246,0.25)' },
            { label: 'COMMON', color: '#3B82F6', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.25)' },
          ].map(tier => (
            <div
              key={tier.label}
              style={{
                padding: '4px 10px',
                borderRadius: 20,
                background: tier.bg,
                border: `1px solid ${tier.border}`,
                color: tier.color,
                fontSize: '0.58rem',
                fontWeight: 800,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              {tier.label}
            </div>
          ))}
        </div>

        {/* ── CTA Buttons ── */}
        <div style={{ display: 'flex', gap: 10 }}>
          {/* Later */}
          <button
            onClick={dismiss}
            style={{
              flex: 1,
              padding: '13px 0',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#64748B',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              letterSpacing: '0.03em',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
              e.currentTarget.style.color = '#94A3B8';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
              e.currentTarget.style.color = '#64748B';
            }}
          >
            Later
          </button>

          {/* SPIN NOW */}
          <button
            onClick={handleSpinNow}
            style={{
              flex: 2,
              padding: '13px 0',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #C9A84C, #A07830)',
              border: '1px solid rgba(201,168,76,0.4)',
              color: '#0C1222',
              fontSize: '0.88rem',
              fontWeight: 900,
              cursor: 'pointer',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              boxShadow: '0 0 20px rgba(201,168,76,0.25), 0 4px 16px rgba(0,0,0,0.3)',
              transition: 'all 0.25s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 7,
              animation: 'stSpinButtonPulse 2.5s ease-in-out infinite',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #D4B55C, #B08840)';
              e.currentTarget.style.boxShadow = '0 0 32px rgba(201,168,76,0.45), 0 4px 20px rgba(0,0,0,0.4)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #C9A84C, #A07830)';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(201,168,76,0.25), 0 4px 16px rgba(0,0,0,0.3)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <span style={{ fontSize: '1.1rem' }}>🎰</span>
            SPIN NOW
          </button>
        </div>

        {/* ── Fine print ── */}
        <p
          style={{
            color: '#334155',
            fontSize: '0.6rem',
            marginTop: 14,
            letterSpacing: '0.04em',
          }}
        >
          Reward wheel powered by your financial activity score
        </p>
      </div>

      {/* ── Scoped keyframes ── */}
      <style>{`
        @keyframes stPing {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        @keyframes stSpinButtonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(201,168,76,0.25), 0 4px 16px rgba(0,0,0,0.3); }
          50% { box-shadow: 0 0 36px rgba(201,168,76,0.5), 0 4px 24px rgba(0,0,0,0.4); }
        }
      `}</style>
    </>
  );
}
