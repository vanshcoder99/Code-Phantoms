import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export default function Loader({ onComplete }) {
  const loaderRef = useRef(null);
  const logoRef = useRef(null);
  const progressBarRef = useRef(null);
  const textRef = useRef(null);
  const particlesRef = useRef(null);
  const ribbonsRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          // Ribbon exit animation
          const ribbons = ribbonsRef.current?.children;
          if (!ribbons) { onComplete && onComplete(); return; }

          const exitTl = gsap.timeline({ onComplete: () => onComplete && onComplete() });

          // Fade out loader content
          exitTl.to([logoRef.current, textRef.current, progressBarRef.current?.parentElement], {
            opacity: 0, y: -30, duration: 0.3, ease: 'power2.in', stagger: 0.05,
          });

          // Ribbons sweep in from left
          exitTl.set(ribbons, { x: '-100%' });
          exitTl.to(ribbons, {
            x: '0%', duration: 0.4, ease: 'power3.inOut', stagger: 0.07,
          }, '-=0.1');

          // Brief hold
          exitTl.to({}, { duration: 0.15 });

          // Ribbons sweep out to right
          exitTl.to(ribbons, {
            x: '100%', duration: 0.4, ease: 'power3.inOut', stagger: 0.07,
          });
        },
      });

      // Animate particles
      const particles = particlesRef.current?.children;
      if (particles) {
        gsap.set(particles, { opacity: 0, scale: 0 });
        gsap.to(particles, {
          opacity: 0.6, scale: 1, duration: 1.5, stagger: 0.1,
          ease: 'power2.out', repeat: -1, yoyo: true,
        });
        Array.from(particles).forEach((particle, i) => {
          gsap.to(particle, {
            x: `random(-100, 100)`, y: `random(-100, 100)`,
            duration: `random(3, 6)`, ease: 'sine.inOut',
            repeat: -1, yoyo: true, delay: i * 0.2,
          });
        });
      }

      // Logo entrance
      tl.from(logoRef.current, { scale: 0, rotation: -180, opacity: 0, duration: 1, ease: 'back.out(1.7)' });
      tl.to(logoRef.current, { scale: 1.1, duration: 0.4, ease: 'power2.out', yoyo: true, repeat: 1 });

      // Text reveal
      tl.from(textRef.current, { y: 30, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.3');

      // Progress bar 0→100
      tl.to(progressBarRef.current, {
        width: '100%', duration: 1.8, ease: 'power2.inOut',
        onUpdate: function () { setProgress(Math.round(this.progress() * 100)); },
      }, '-=0.2');

      // Brief hold
      tl.to({}, { duration: 0.3 });
    }, loaderRef);

    return () => ctx.revert();
  }, [onComplete]);

  const ribbonColors = [
    'linear-gradient(135deg, #2563EB, #3B82F6)',
    'linear-gradient(135deg, #7C3AED, #8B5CF6)',
    'linear-gradient(135deg, #1D4ED8, #2563EB)',
    'linear-gradient(135deg, #6D28D9, #7C3AED)',
    'linear-gradient(135deg, #1E40AF, #3B82F6)',
  ];

  return (
    <div
      ref={loaderRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0C1222 0%, #131B2E 40%, #1C2640 70%, #0C1222 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Particles */}
      <div ref={particlesRef} style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: `${6 + Math.random() * 10}px`, height: `${6 + Math.random() * 10}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(37,99,235,0.4)' : i % 3 === 1 ? 'rgba(124,58,237,0.3)' : 'rgba(59,130,246,0.3)',
            top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`,
            filter: 'blur(1px)',
          }} />
        ))}
      </div>

      {/* Orbiting Rings */}
      <div style={{ position: 'absolute', width: '300px', height: '300px', pointerEvents: 'none' }}>
        <div className="loader-orbit loader-orbit-1" />
        <div className="loader-orbit loader-orbit-2" />
        <div className="loader-orbit loader-orbit-3" />
      </div>

      {/* Logo */}
      <div ref={logoRef} style={{
        width: '90px', height: '90px', borderRadius: '24px',
        background: 'linear-gradient(135deg, #2563EB, #7C3AED)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 0 60px rgba(37,99,235,0.4), 0 0 120px rgba(124,58,237,0.2)',
        marginBottom: '28px', position: 'relative', zIndex: 2,
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          <polyline points="9 12 11 14 15 10" />
        </svg>
      </div>

      {/* Text */}
      <div ref={textRef} style={{ textAlign: 'center', marginBottom: '40px', position: 'relative', zIndex: 2 }}>
        <h1 style={{
          fontSize: '2rem', fontWeight: 800,
          background: 'linear-gradient(135deg, #fff, #93C5FD)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', marginBottom: '8px', letterSpacing: '-0.02em',
        }}>InvestSafe</h1>
        <p style={{ fontSize: '0.85rem', color: '#64748B', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
          Overcome Your Investment Fear
        </p>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '240px', position: 'relative', zIndex: 2 }}>
        <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
          <div ref={progressBarRef} style={{
            width: '0%', height: '100%',
            background: 'linear-gradient(90deg, #2563EB, #7C3AED, #3B82F6)',
            borderRadius: '4px', boxShadow: '0 0 20px rgba(37,99,235,0.5)',
          }} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '12px', fontSize: '0.75rem', color: '#64748B', fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
          {progress}%
        </div>
      </div>

      {/* Ribbon exit overlay */}
      <div ref={ribbonsRef} style={{
        position: 'absolute', inset: 0, zIndex: 100,
        display: 'flex', flexDirection: 'column', pointerEvents: 'none',
      }}>
        {ribbonColors.map((bg, i) => (
          <div key={i} style={{ flex: 1, width: '100%', background: bg, transform: 'translateX(-100%)' }} />
        ))}
      </div>
    </div>
  );
}
