import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Decorative ribbon divider between sections.
 * variant: 'wave' | 'diagonal' | 'split' | 'stagger'
 */
export default function SectionRibbon({ variant = 'wave', darkMode }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) return;
    const ribbons = ref.current.children;

    const ctx = gsap.context(() => {
      if (variant === 'wave') {
        gsap.fromTo(ribbons,
          { scaleX: 0, transformOrigin: 'left center' },
          { scaleX: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } }
        );
      } else if (variant === 'diagonal') {
        gsap.fromTo(ribbons,
          { x: '-110%', rotation: -2 },
          { x: '0%', rotation: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out',
            scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } }
        );
      } else if (variant === 'split') {
        Array.from(ribbons).forEach((r, i) => {
          gsap.fromTo(r,
            { x: i % 2 === 0 ? '-110%' : '110%' },
            { x: '0%', duration: 0.7, ease: 'power3.out',
              scrollTrigger: { trigger: ref.current, start: 'top 90%', toggleActions: 'play none none none' } }
          );
        });
      } else if (variant === 'stagger') {
        gsap.fromTo(ribbons,
          { scaleX: 0, transformOrigin: 'center center' },
          { scaleX: 1, duration: 0.6, stagger: 0.12, ease: 'elastic.out(1, 0.6)',
            scrollTrigger: { trigger: ref.current, start: 'top 92%', toggleActions: 'play none none none' } }
        );
      }
    }, ref);

    return () => ctx.revert();
  }, [variant]);

  const palettes = {
    wave: [
      'linear-gradient(90deg, #2563EB, #3B82F6, transparent)',
      'linear-gradient(90deg, transparent, #7C3AED, #8B5CF6, transparent)',
      'linear-gradient(90deg, transparent, #2563EB, #06B6D4)',
    ],
    diagonal: [
      'linear-gradient(135deg, #2563EB, #7C3AED)',
      'linear-gradient(135deg, #7C3AED, #EC4899)',
      'linear-gradient(135deg, #06B6D4, #2563EB)',
    ],
    split: [
      'linear-gradient(90deg, #2563EB, transparent)',
      'linear-gradient(270deg, #7C3AED, transparent)',
      'linear-gradient(90deg, #10B981, transparent)',
      'linear-gradient(270deg, #F59E0B, transparent)',
    ],
    stagger: [
      'linear-gradient(90deg, transparent, #2563EB, transparent)',
      'linear-gradient(90deg, transparent, #7C3AED, transparent)',
      'linear-gradient(90deg, transparent, #06B6D4, transparent)',
    ],
  };

  const colors = palettes[variant] || palettes.wave;
  const heights = variant === 'split' ? ['2px', '3px', '2px', '3px'] : ['3px', '2px', '3px'];

  return (
    <div ref={ref} style={{ padding: '12px 0', overflow: 'hidden', position: 'relative' }}>
      {colors.map((bg, i) => (
        <div key={i} style={{
          height: heights[i] || '2px',
          background: bg,
          marginBottom: i < colors.length - 1 ? 6 : 0,
          borderRadius: 999,
          opacity: darkMode ? 0.5 : 0.35,
        }} />
      ))}
    </div>
  );
}
