import React, { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minimize2 } from 'lucide-react';
import api from '../api';

const BTN_SIZE = 64;

export default function FloatingChatbot({ darkMode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm FinBuddy 🤖 Your friendly investment guide. Ask me anything about investing, risk, or portfolios!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const btnRef = useRef(null);

  // ── Drag state (using top/left absolute pixel positions) ──
  const [pos, setPos] = useState(null); // null = use CSS default (bottom-right)
  const isDragging = useRef(false);
  const hasMoved = useRef(false);
  const dragOffset = useRef({ dx: 0, dy: 0 });

  // Initialize position on mount
  useEffect(() => {
    // Default: bottom-right corner with 24px padding
    setPos({
      left: window.innerWidth - BTN_SIZE - 24,
      top: window.innerHeight - BTN_SIZE - 100, // 100px from bottom to avoid footer overlap
    });
  }, []);

  // ── Mouse handlers ──
  const onPointerDown = useCallback((e) => {
    if (isOpen) return;
    e.preventDefault();
    e.stopPropagation();
    isDragging.current = true;
    hasMoved.current = false;

    const rect = btnRef.current.getBoundingClientRect();
    dragOffset.current = {
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  }, [isOpen]);

  const onPointerMove = useCallback((e) => {
    if (!isDragging.current) return;
    e.preventDefault();

    const dx = e.clientX - dragOffset.current.dx;
    const dy = e.clientY - dragOffset.current.dy;

    // Distance check — require 5px before registering as drag
    if (!hasMoved.current) {
      const startLeft = pos?.left ?? (window.innerWidth - BTN_SIZE - 24);
      const startTop = pos?.top ?? (window.innerHeight - BTN_SIZE - 100);
      if (Math.abs(dx - startLeft) > 5 || Math.abs(dy - startTop) > 5) {
        hasMoved.current = true;
      } else {
        return;
      }
    }

    // Clamp to viewport boundaries
    const newLeft = Math.max(0, Math.min(window.innerWidth - BTN_SIZE, dx));
    const newTop = Math.max(0, Math.min(window.innerHeight - BTN_SIZE, dy));

    setPos({ left: newLeft, top: newTop });
  }, [pos]);

  const onPointerUp = useCallback((e) => {
    isDragging.current = false;
    document.removeEventListener('pointermove', onPointerMove);
    document.removeEventListener('pointerup', onPointerUp);

    if (!hasMoved.current) {
      setIsOpen(prev => !prev);
    }
  }, [onPointerMove]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  // Recalculate position on window resize
  useEffect(() => {
    const handleResize = () => {
      setPos(prev => {
        if (!prev) return prev;
        return {
          left: Math.min(prev.left, window.innerWidth - BTN_SIZE),
          top: Math.min(prev.top, window.innerHeight - BTN_SIZE),
        };
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const quickQuestions = [
    "What is SIP?",
    "How to start investing?",
    "Is stock market risky?",
    "Best investment for beginners?"
  ];

  const handleSend = async (text = input) => {
    if (!text.trim()) return;
    const userMessage = { role: 'user', content: text.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const response = await api.post('/ai/chat', { question: text.trim() });
      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Make sure the backend is running!"
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  // Compute chat window position
  const chatStyle = pos ? {
    position: 'fixed',
    left: Math.min(pos.left, window.innerWidth - 350),
    top: Math.max(8, pos.top - 470),
    zIndex: 10000,
  } : {
    position: 'fixed',
    right: 24,
    bottom: 108,
    zIndex: 10000,
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          style={{
            ...chatStyle,
            width: 340,
            maxWidth: 'calc(100vw - 1rem)',
            maxHeight: 'min(460px, calc(100vh - 100px))',
            borderRadius: 16,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
            background: darkMode
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: `1px solid ${darkMode ? 'rgba(37,99,235,0.3)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {/* Header */}
          <div style={{ padding: '10px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'linear-gradient(135deg, #2563EB, #1D4ED8)', flexShrink: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 30, height: 30, background: 'rgba(255,255,255,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bot style={{ width: 16, height: 16, color: '#fff' }} />
              </div>
              <div>
                <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.75rem' }}>FinBuddy AI</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{ width: 5, height: 5, background: '#4ade80', borderRadius: '50%' }} />
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.6rem' }}>Online</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{ width: 26, height: 26, borderRadius: 6, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}
            >
              <Minimize2 style={{ width: 13, height: 13, color: '#fff' }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px', minHeight: 180, scrollbarWidth: 'thin' }}>
            {messages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6, maxWidth: '85%', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2,
                    background: msg.role === 'user' ? '#2563EB' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
                  }}>
                    {msg.role === 'user' ? <User style={{ width: 12, height: 12, color: '#fff' }} /> : <Sparkles style={{ width: 12, height: 12, color: '#fff' }} />}
                  </div>
                  <div style={{
                    padding: '6px 10px', borderRadius: 10, fontSize: '0.72rem', lineHeight: 1.5,
                    background: msg.role === 'user' ? '#2563EB' : (darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6'),
                    color: msg.role === 'user' ? '#fff' : (darkMode ? '#e2e8f0' : '#1f2937'),
                  }}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <div style={{ width: 22, height: 22, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}>
                    <Sparkles style={{ width: 12, height: 12, color: '#fff' }} />
                  </div>
                  <div style={{ padding: '8px 12px', borderRadius: 10, background: darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6', display: 'flex', gap: 4 }}>
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B82F6', animation: 'bounce 1s infinite 0s' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B82F6', animation: 'bounce 1s infinite 0.15s' }} />
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#3B82F6', animation: 'bounce 1s infinite 0.3s' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div style={{ padding: '4px 12px 6px' }}>
              <p style={{ fontSize: '0.6rem', color: darkMode ? '#9ca3af' : '#6b7280', marginBottom: 4 }}>Quick questions:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    style={{
                      fontSize: '0.6rem', padding: '3px 8px', borderRadius: 999, border: 'none', cursor: 'pointer',
                      background: darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
                      color: darkMode ? '#d1d5db' : '#4b5563',
                    }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '8px 12px', borderTop: `1px solid ${darkMode ? 'rgba(255,255,255,0.1)' : '#e5e7eb'}`, display: 'flex', gap: 8, flexShrink: 0 }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              style={{
                flex: 1, padding: '7px 10px', borderRadius: 8, fontSize: '0.72rem', border: 'none', outline: 'none',
                background: darkMode ? 'rgba(255,255,255,0.1)' : '#f3f4f6',
                color: darkMode ? '#fff' : '#1f2937',
              }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                width: 30, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer',
                background: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: (!input.trim() || loading) ? 0.5 : 1,
              }}
            >
              <Send style={{ width: 13, height: 13, color: '#fff' }} />
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Draggable Button ── */}
      <div
        ref={btnRef}
        onPointerDown={onPointerDown}
        style={{
          position: 'fixed',
          left: pos ? pos.left : undefined,
          top: pos ? pos.top : undefined,
          right: pos ? undefined : 24,
          bottom: pos ? undefined : 100,
          zIndex: 10000,
          cursor: isOpen ? 'pointer' : (isDragging.current ? 'grabbing' : 'grab'),
          userSelect: 'none',
          touchAction: 'none',
        }}
        onClick={(e) => { if (isOpen) { e.stopPropagation(); setIsOpen(false); } }}
      >
        <div
          style={{
            width: BTN_SIZE,
            height: BTN_SIZE,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: isOpen ? '#1f2937' : 'linear-gradient(135deg, #2563EB, #7C3AED)',
            boxShadow: isOpen ? '0 4px 16px rgba(0,0,0,0.3)' : '0 4px 20px rgba(37,99,235,0.4)',
            transition: 'background 0.2s',
          }}
        >
          {isOpen ? (
            <X style={{ width: 28, height: 28, color: '#fff' }} />
          ) : (
            <MessageCircle style={{ width: 32, height: 32, color: '#fff' }} />
          )}
        </div>
        {/* Notification dot */}
        {!isOpen && messages.length <= 1 && (
          <span style={{
            position: 'absolute', top: -1, right: -1,
            width: 10, height: 10, background: '#22c55e', borderRadius: '50%', border: '2px solid #0C1222',
          }} />
        )}
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}
