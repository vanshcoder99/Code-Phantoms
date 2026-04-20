import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';
import { Mail, GitBranch, Linkedin } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

export default function Footer({ darkMode }) {
  const footerRef = useRef(null);
  const gridRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (gridRef.current) {
        const cols = gridRef.current.children;
        gsap.from(cols, {
          y: 50,
          opacity: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: footerRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        });
      }

      gsap.from(bottomRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.7,
        delay: 0.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className={`${darkMode ? 'bg-quaternary text-gray-400' : 'bg-quaternary text-gray-400'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4">About InvestSafe</h3>
            <p className="text-sm">
              We help young investors overcome fear through simulation, education, and AI guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-4">Quick Links</h3>
            <ul className="text-sm space-y-2">
              <li><Link to="/" className="hover:text-white transition">Home</Link></li>
              <li><Link to="/resources" className="hover:text-white transition">Resources</Link></li>
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/sip" className="hover:text-white transition">SIP Calculator</Link></li>
              <li><Link to="/fear-quiz" className="hover:text-white transition">Fear Quiz</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold mb-4">Get in Touch</h3>
            <div className="flex gap-4">
              <a href="mailto:contact@investingfear.com" className="hover:text-white transition" title="Email Us">
                <Mail className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="GitHub">
                <GitBranch className="w-5 h-5" />
              </a>
              <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div ref={bottomRef} className="border-t border-gray-700 pt-8 text-center text-sm">
          <p>Copyright 2026 InvestSafe. All rights reserved. Built for young investors</p>
        </div>
      </div>
    </footer>
  );
}
