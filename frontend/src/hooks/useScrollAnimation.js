import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Custom hook for GSAP scroll-triggered animations.
 * 
 * @param {Object} options
 * @param {string} options.animation - Type: 'fadeUp', 'fadeLeft', 'fadeRight', 'scaleIn', 'stagger', 'parallax'
 * @param {number} options.delay - Animation delay in seconds
 * @param {number} options.duration - Animation duration in seconds
 * @param {string} options.start - ScrollTrigger start position
 * @param {string} options.staggerSelector - CSS selector for stagger children
 * @param {number} options.staggerAmount - Stagger delay between children
 * @param {boolean} options.scrub - Whether animation is tied to scroll position
 */
export default function useScrollAnimation(options = {}) {
  const ref = useRef(null);

  const {
    animation = 'fadeUp',
    delay = 0,
    duration = 1,
    start = 'top 85%',
    staggerSelector = null,
    staggerAmount = 0.15,
    scrub = false,
  } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let ctx = gsap.context(() => {
      const triggerConfig = {
        trigger: el,
        start: start,
        toggleActions: scrub ? undefined : 'play none none none',
        scrub: scrub ? 1 : false,
      };

      switch (animation) {
        case 'fadeUp':
          gsap.from(el, {
            y: 60,
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'fadeDown':
          gsap.from(el, {
            y: -60,
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'fadeLeft':
          gsap.from(el, {
            x: -80,
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'fadeRight':
          gsap.from(el, {
            x: 80,
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'scaleIn':
          gsap.from(el, {
            scale: 0.8,
            opacity: 0,
            duration,
            delay,
            ease: 'back.out(1.7)',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'rotateIn':
          gsap.from(el, {
            rotation: -5,
            scale: 0.9,
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'stagger':
          if (staggerSelector) {
            const children = el.querySelectorAll(staggerSelector);
            gsap.from(children, {
              y: 50,
              opacity: 0,
              duration: duration * 0.8,
              stagger: staggerAmount,
              ease: 'power3.out',
              delay,
              scrollTrigger: triggerConfig,
            });
          }
          break;

        case 'staggerScale':
          if (staggerSelector) {
            const children = el.querySelectorAll(staggerSelector);
            gsap.from(children, {
              scale: 0.7,
              opacity: 0,
              duration: duration * 0.8,
              stagger: staggerAmount,
              ease: 'back.out(1.4)',
              delay,
              scrollTrigger: triggerConfig,
            });
          }
          break;

        case 'parallax':
          gsap.from(el, {
            y: 100,
            ease: 'none',
            scrollTrigger: {
              ...triggerConfig,
              scrub: 1,
            },
          });
          break;

        case 'clipReveal':
          gsap.from(el, {
            clipPath: 'inset(100% 0 0 0)',
            opacity: 0,
            duration: duration * 1.2,
            delay,
            ease: 'power4.out',
            scrollTrigger: triggerConfig,
          });
          break;

        case 'counter':
          // Handled by the component itself
          break;

        default:
          gsap.from(el, {
            y: 40,
            opacity: 0,
            duration,
            delay,
            ease: 'power3.out',
            scrollTrigger: triggerConfig,
          });
      }
    }, el);

    return () => ctx.revert();
  }, [animation, delay, duration, start, staggerSelector, staggerAmount, scrub]);

  return ref;
}
