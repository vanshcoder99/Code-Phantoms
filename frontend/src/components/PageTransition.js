import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { gsap } from 'gsap';

export default function PageTransition({ children }) {
  const location = useLocation();
  const contentRef = useRef(null);
  const ribbonsRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current === location.pathname) return;
    prevPath.current = location.pathname;
    setIsAnimating(true);

    const ribbons = ribbonsRef.current?.children;
    if (!ribbons || !contentRef.current) {
      setIsAnimating(false);
      return;
    }

    const tl = gsap.timeline({
      onComplete: () => {
        setIsAnimating(false);
        window.scrollTo({ top: 0 });
      },
    });

    // Ribbons sweep in from left
    tl.set(ribbons, { x: '-100%' });
    tl.to(ribbons, {
      x: '0%', duration: 0.35, ease: 'power3.inOut',
      stagger: 0.06,
    });

    // Fade out old content behind ribbons
    tl.set(contentRef.current, { opacity: 0 }, '-=0.1');

    // Ribbons sweep out to right
    tl.to(ribbons, {
      x: '100%', duration: 0.35, ease: 'power3.inOut',
      stagger: 0.06,
    }, '+=0.05');

    // Fade in new content
    tl.fromTo(contentRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
      '-=0.2'
    );
  }, [location.pathname]);

  const ribbonColors = [
    'linear-gradient(135deg, #2563EB, #3B82F6)',
    'linear-gradient(135deg, #7C3AED, #8B5CF6)',
    'linear-gradient(135deg, #1D4ED8, #2563EB)',
    'linear-gradient(135deg, #6D28D9, #7C3AED)',
    'linear-gradient(135deg, #1E40AF, #3B82F6)',
  ];

  return (
    <>
      {/* Ribbon overlay */}
      <div
        ref={ribbonsRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 9990,
          pointerEvents: isAnimating ? 'auto' : 'none',
          display: 'flex', flexDirection: 'column',
        }}
      >
        {ribbonColors.map((bg, i) => (
          <div
            key={i}
            style={{
              flex: 1, width: '100%',
              background: bg,
              transform: 'translateX(-100%)',
            }}
          />
        ))}
      </div>
      <div ref={contentRef}>{children}</div>
    </>
  );
}
