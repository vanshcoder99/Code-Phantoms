import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Sparkles, Minimize2 } from 'lucide-react';
import api from '../api';

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
  const [pulseCount, setPulseCount] = useState(0);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Pulse the chat icon periodically to draw attention
  useEffect(() => {
    if (!isOpen && pulseCount < 3) {
      const timer = setTimeout(() => setPulseCount(p => p + 1), 8000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, pulseCount]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
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
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.reply
      }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having trouble connecting right now. Make sure the backend is running with a valid Groq API key! Meanwhile, feel free to explore the simulator."
      }]);
    }
    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-20 md:bottom-24 right-4 md:right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
          style={{
            maxHeight: 'calc(100svh - 100px)',
            animation: 'chatSlideUp 0.3s ease-out',
            background: darkMode
              ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
              : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
            border: `1px solid ${darkMode ? 'rgba(37,99,235,0.3)' : 'rgba(0,0,0,0.1)'}`,
          }}
        >
          {/* Header */}
          <div
            className="px-5 py-4 flex items-center justify-between"
            style={{
              background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
            }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">FinBuddy AI</h3>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white text-xs opacity-80">Online • Powered by LLaMA</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 flex items-center justify-center transition"
            >
              <Minimize2 className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Messages */}
          <div
            className="flex-1 min-h-[250px] md:h-[350px] overflow-y-auto px-4 py-4 space-y-4"
            style={{ scrollbarWidth: 'thin' }}
          >
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                style={{ animation: 'fadeInMsg 0.3s ease-out' }}
              >
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === 'user'
                      ? 'bg-primary text-white'
                      : 'bg-gradient-to-br from-primary to-secondary text-white'
                  }`}>
                    {msg.role === 'user'
                      ? <User className="w-4 h-4" />
                      : <Sparkles className="w-4 h-4" />
                    }
                  </div>
                  <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-primary text-white rounded-tr-md'
                      : darkMode
                        ? 'bg-white bg-opacity-10 text-gray-200 rounded-tl-md'
                        : 'bg-gray-100 text-gray-800 rounded-tl-md'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start" style={{ animation: 'fadeInMsg 0.3s ease-out' }}>
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className={`px-4 py-3 rounded-2xl rounded-tl-md ${darkMode ? 'bg-white bg-opacity-10' : 'bg-gray-100'}`}>
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                      <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2">
              <p className={`text-xs mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Quick questions:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickQuestions.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className={`text-xs px-3 py-1.5 rounded-full transition-all hover:scale-105 ${
                      darkMode
                        ? 'bg-white bg-opacity-10 text-gray-300 hover:bg-primary hover:text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-primary hover:text-white'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className={`px-4 py-3 border-t ${darkMode ? 'border-white border-opacity-10' : 'border-gray-200'}`}>
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about investing..."
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 ${
                  darkMode
                    ? 'bg-white bg-opacity-10 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-400'
                }`}
              />
              <button
                onClick={() => handleSend()}
                disabled={!input.trim() || loading}
                className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark text-white flex items-center justify-center transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => { setIsOpen(!isOpen); setPulseCount(3); }}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? 'bg-gray-800 rotate-0'
            : 'bg-gradient-to-br from-primary to-secondary'
        }`}
        style={{
          boxShadow: isOpen
            ? '0 4px 20px rgba(0,0,0,0.3)'
            : '0 4px 30px rgba(37,99,235,0.4)',
          animation: !isOpen && pulseCount < 3 ? 'chatPulse 2s ease-in-out infinite' : 'none',
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}

        {/* Notification dot */}
        {!isOpen && messages.length <= 1 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>
        )}
      </button>

      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInMsg {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes chatPulse {
          0%, 100% { transform: scale(1); box-shadow: 0 4px 30px rgba(37,99,235,0.4); }
          50% { transform: scale(1.08); box-shadow: 0 4px 40px rgba(37,99,235,0.6); }
        }
      `}</style>
    </>
  );
}
