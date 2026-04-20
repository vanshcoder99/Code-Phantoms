import React, { useState, useRef, useCallback } from 'react';
import { BookOpen, Video, FileText, ExternalLink, Users, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import SectionRibbon from '../components/SectionRibbon';
import { gsap } from 'gsap';

export default function Resources({ darkMode }) {
  const [expandedCategory, setExpandedCategory] = useState(null);

  const resources = [
    {
      category: 'Getting Started',
      icon: BookOpen,
      items: [
        { 
          title: 'Investment Basics', 
          description: 'Learn fundamental concepts of investing including stocks, bonds, and mutual funds',
          content: 'Investing is the process of putting your money into financial assets with the goal of growing your wealth over time. Start with understanding different asset classes and how they work.',
          link: 'https://www.investopedia.com/articles/basics/11/3-s-simple-investing.asp'
        },
        { 
          title: 'Risk Management', 
          description: 'Understand how to manage investment risk and protect your portfolio',
          content: 'Risk management involves identifying potential losses and taking steps to minimize them. Diversification is key to managing risk effectively.',
          link: 'https://www.investopedia.com/terms/r/riskmanagement.asp'
        },
        { 
          title: 'Portfolio Building', 
          description: 'Create a balanced investment portfolio tailored to your goals',
          content: 'A well-built portfolio balances growth potential with risk management. Consider your age, goals, and risk tolerance when building your portfolio.',
          link: 'https://www.investopedia.com/terms/p/portfolio.asp'
        },
        {
          title: 'Emergency Fund Basics',
          description: 'Why you need an emergency fund before investing',
          content: 'An emergency fund should cover 3-6 months of living expenses. Keep it in a liquid, safe account before investing in the market.',
          link: 'https://www.nerdwallet.com/article/banking/emergency-fund-why-it-matters'
        },
      ]
    },
    {
      category: 'Video Tutorials',
      icon: Video,
      items: [
        { 
          title: 'Stock Market for Beginners', 
          description: 'Step-by-step guide to understanding the stock market',
          content: 'Learn how the stock market works, how to buy your first shares, and key strategies for beginners.',
          link: 'https://www.youtube.com/watch?v=ZCFkWDdmXG8'
        },
        { 
          title: 'How to Build a Portfolio', 
          description: 'Learn portfolio construction from scratch',
          content: 'Use the AI explainer to understand your portfolio composition. Get personalized insights about your investment strategy.',
          link: 'https://www.youtube.com/watch?v=foqswDDlhKI'
        },
        { 
          title: 'Understanding Mutual Funds', 
          description: 'Complete guide to mutual funds and SIPs',
          content: 'Your risk tolerance depends on your age, financial goals, and comfort level. Mutual funds are a great way for beginners to start.',
          link: 'https://www.youtube.com/watch?v=ngfKkEGQ5Q0'
        },
        {
          title: 'Reading Market Charts',
          description: 'How to interpret investment charts and graphs',
          content: 'Learn to read candlestick charts, line graphs, and other market visualizations to make informed decisions.',
          link: 'https://www.youtube.com/watch?v=eynxyoKgpng'
        },
      ]
    },
    {
      category: 'Articles',
      icon: FileText,
      items: [
        { 
          title: 'Why Young Investors Fear Markets', 
          description: 'Understanding investment anxiety and how to overcome it',
          content: 'Fear of investing is natural, especially for beginners. Understanding market volatility and historical trends can help reduce anxiety.',
          link: 'https://www.forbes.com/advisor/investing/how-to-start-investing/'
        },
        { 
          title: 'Long-term vs Short-term Investing', 
          description: 'Choosing the right strategy for your goals',
          content: 'Long-term investing focuses on wealth building over decades. Short-term trading is riskier and requires more active management.',
          link: 'https://www.bankrate.com/investing/long-term-investing-vs-short-term-trading/'
        },
        { 
          title: 'Diversification Strategies', 
          description: 'Spreading your investments wisely across different assets',
          content: 'Diversification reduces risk by spreading investments across different asset classes, sectors, and geographies.',
          link: 'https://www.investopedia.com/terms/d/diversification.asp'
        },
        {
          title: 'Compound Interest Magic',
          description: 'How compound interest can multiply your wealth',
          content: 'Compound interest is earning returns on your returns. Starting early and staying invested is key to maximizing compound growth.',
          link: 'https://www.investopedia.com/terms/c/compoundinterest.asp'
        },
      ]
    },
    {
      category: 'Community',
      icon: Users,
      items: [
        { 
          title: 'Reddit — Personal Finance', 
          description: 'Connect with other young investors and share experiences',
          content: 'Join the Reddit personal finance community to ask questions, share insights, and learn from other investors at all levels.',
          link: 'https://www.reddit.com/r/personalfinance/'
        },
        { 
          title: 'Bogleheads Forum', 
          description: 'Learn from others who follow time-tested investing strategies',
          content: 'Read inspiring discussions from investors who follow the Bogleheads philosophy of simple, low-cost investing.',
          link: 'https://www.bogleheads.org/forum/index.php'
        },
        { 
          title: 'Moneycontrol Q&A', 
          description: 'Ask questions to investment experts and financial advisors',
          content: 'Get answers to your investment questions from certified financial advisors and investment professionals.',
          link: 'https://www.moneycontrol.com/forum/'
        },
        {
          title: 'Zerodha Varsity',
          description: 'Free stock market courses and webinars',
          content: 'Access comprehensive free courses on stock markets, trading, and personal finance by Zerodha Varsity.',
          link: 'https://zerodha.com/varsity/'
        },
      ]
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'}`}>
      {/* Hero banner */}
      <div style={{ padding: '48px 16px 32px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: 250, height: 250, background: 'radial-gradient(circle, rgba(37,99,235,0.06), transparent)', borderRadius: '50%', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ width: 64, height: 64, margin: '0 auto 20px', borderRadius: 16, overflow: 'hidden', border: `1px solid ${darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)'}` }}>
          <img src="/img-learn.png" alt="Learn" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Learning Resources
        </h1>
        <p className={`text-lg mb-4 max-w-2xl mx-auto ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Comprehensive guides and tutorials to help you master investing and overcome your fears
        </p>
      </div>

      <SectionRibbon variant="wave" darkMode={darkMode} />

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Resource Categories */}
        <div className="space-y-6 mb-12">
          {resources.map((category, idx) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === idx;
            
            return (
              <div key={idx} className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
                <button
                  onClick={() => {
                    if (isExpanded) {
                      // Collapse animation
                      const panel = document.getElementById(`panel-${idx}`);
                      if (panel) {
                        gsap.to(panel, {
                          height: 0, opacity: 0, duration: 0.35, ease: 'power2.inOut',
                          onComplete: () => setExpandedCategory(null),
                        });
                      } else {
                        setExpandedCategory(null);
                      }
                    } else {
                      setExpandedCategory(idx);
                      // Expand animation runs after render via setTimeout
                      setTimeout(() => {
                        const panel = document.getElementById(`panel-${idx}`);
                        if (panel) {
                          gsap.fromTo(panel,
                            { height: 0, opacity: 0 },
                            { height: 'auto', opacity: 1, duration: 0.4, ease: 'power3.out' }
                          );
                          // Stagger cards inside
                          const cards = panel.querySelectorAll('.resource-card');
                          gsap.fromTo(cards,
                            { y: 20, opacity: 0 },
                            { y: 0, opacity: 1, duration: 0.35, stagger: 0.08, ease: 'power2.out', delay: 0.1 }
                          );
                        }
                      }, 10);
                    }
                  }}
                  className={`w-full p-6 flex items-center justify-between hover:opacity-80 transition ${
                    darkMode ? 'hover:bg-secondary' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #2563EB, #7C3AED)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(37,99,235,0.25)', transition: 'transform 0.3s', transform: isExpanded ? 'scale(1.1)' : 'scale(1)' }}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      {category.category}
                    </h2>
                  </div>
                  <div style={{ transition: 'transform 0.3s ease', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown className="w-6 h-6 text-primary" />
                  </div>
                </button>

                {isExpanded && (
                  <div id={`panel-${idx}`} className={`border-t ${darkMode ? 'border-secondary' : 'border-gray-200'} p-6 space-y-4`} style={{ overflow: 'hidden' }}>
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className={`resource-card p-4 rounded-lg border-l-4 border-primary transition ${
                          darkMode ? 'bg-secondary hover:bg-secondary-light' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                        style={{ cursor: 'pointer', transition: 'transform 0.2s, box-shadow 0.2s' }}
                        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateX(6px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,99,235,0.1)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateX(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                            {item.title}
                          </h3>
                          <a href={item.link} target="_blank" rel="noopener noreferrer" title={`Open ${item.title}`} className="hover:opacity-70 transition">
                            <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-1 cursor-pointer" />
                          </a>
                        </div>
                        <p className={`text-sm mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {item.description}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                          {item.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <SectionRibbon variant="diagonal" darkMode={darkMode} />

        {/* Quick Tips */}
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-12`}>
          <div className="flex items-center gap-3 mb-6">
            <Zap className="w-8 h-8 text-primary" />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Quick Tips for Success
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Start Small
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Begin with small investments to build confidence and experience. You don't need a lot of money to start investing.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Diversify
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Spread investments across different assets to reduce risk. Don't put all your money in one place.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Stay Consistent
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Regular investments over time build wealth through compound growth. Consistency matters more than timing.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Educate Yourself
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Knowledge is power. The more you learn about investing, the more confident you'll become.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Think Long-term
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Don't panic during market downturns. History shows markets recover and grow over time.
              </p>
            </div>

            <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <h3 className={`font-semibold mb-3 text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Review Regularly
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Check your portfolio periodically but avoid making emotional decisions based on short-term fluctuations.
              </p>
            </div>
          </div>
        </div>

        <SectionRibbon variant="split" darkMode={darkMode} />

        {/* Common Mistakes */}
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gradient-to-r from-secondary to-tertiary' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Common Mistakes to Avoid
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Trying to Time the Market
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Even professionals can't consistently predict market movements. Focus on long-term investing instead.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Panic Selling
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Selling during market downturns locks in losses. Stay the course and remember your long-term goals.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Lack of Diversification
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Putting all your money in one investment is risky. Spread your investments across different assets.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Ignoring Fees
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                High fees can significantly reduce your returns over time. Choose low-cost investment options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
