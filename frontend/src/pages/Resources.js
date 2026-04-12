import React, { useState } from 'react';
import { BookOpen, Video, FileText, ExternalLink, Users, Zap, ChevronDown, ChevronUp } from 'lucide-react';

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
          content: 'Investing is the process of putting your money into financial assets with the goal of growing your wealth over time. Start with understanding different asset classes and how they work.'
        },
        { 
          title: 'Risk Management', 
          description: 'Understand how to manage investment risk and protect your portfolio',
          content: 'Risk management involves identifying potential losses and taking steps to minimize them. Diversification is key to managing risk effectively.'
        },
        { 
          title: 'Portfolio Building', 
          description: 'Create a balanced investment portfolio tailored to your goals',
          content: 'A well-built portfolio balances growth potential with risk management. Consider your age, goals, and risk tolerance when building your portfolio.'
        },
        {
          title: 'Emergency Fund Basics',
          description: 'Why you need an emergency fund before investing',
          content: 'An emergency fund should cover 3-6 months of living expenses. Keep it in a liquid, safe account before investing in the market.'
        },
      ]
    },
    {
      category: 'Video Tutorials',
      icon: Video,
      items: [
        { 
          title: 'Market Simulation Guide', 
          description: 'Step-by-step guide to using the simulator effectively',
          content: 'Learn how to configure different scenarios and interpret the results. Practice with various risk levels and time periods.'
        },
        { 
          title: 'AI Portfolio Analysis', 
          description: 'How to get the most from AI explanations',
          content: 'Use the AI explainer to understand your portfolio composition. Get personalized insights about your investment strategy.'
        },
        { 
          title: 'Risk Assessment', 
          description: 'Understanding your risk tolerance and investment timeline',
          content: 'Your risk tolerance depends on your age, financial goals, and comfort level. Younger investors can typically take more risk.'
        },
        {
          title: 'Reading Market Charts',
          description: 'How to interpret investment charts and graphs',
          content: 'Learn to read candlestick charts, line graphs, and other market visualizations to make informed decisions.'
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
          content: 'Fear of investing is natural, especially for beginners. Understanding market volatility and historical trends can help reduce anxiety.'
        },
        { 
          title: 'Long-term vs Short-term Investing', 
          description: 'Choosing the right strategy for your goals',
          content: 'Long-term investing focuses on wealth building over decades. Short-term trading is riskier and requires more active management.'
        },
        { 
          title: 'Diversification Strategies', 
          description: 'Spreading your investments wisely across different assets',
          content: 'Diversification reduces risk by spreading investments across different asset classes, sectors, and geographies.'
        },
        {
          title: 'Compound Interest Magic',
          description: 'How compound interest can multiply your wealth',
          content: 'Compound interest is earning returns on your returns. Starting early and staying invested is key to maximizing compound growth.'
        },
      ]
    },
    {
      category: 'Community',
      icon: Users,
      items: [
        { 
          title: 'Discussion Forum', 
          description: 'Connect with other young investors and share experiences',
          content: 'Join our community forum to ask questions, share insights, and learn from other investors at all levels.'
        },
        { 
          title: 'Success Stories', 
          description: 'Learn from others who overcame fear and started investing',
          content: 'Read inspiring stories from young investors who started with fear and built successful investment portfolios.'
        },
        { 
          title: 'Expert Q&A', 
          description: 'Ask questions to investment experts and financial advisors',
          content: 'Get answers to your investment questions from certified financial advisors and investment professionals.'
        },
        {
          title: 'Weekly Webinars',
          description: 'Join live sessions on investing topics',
          content: 'Attend weekly webinars covering various investment topics, market analysis, and portfolio management strategies.'
        },
      ]
    },
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Learning Resources
        </h1>
        <p className={`text-lg mb-12 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Comprehensive guides and tutorials to help you master investing and overcome your fears
        </p>

        {/* Resource Categories */}
        <div className="space-y-6 mb-12">
          {resources.map((category, idx) => {
            const Icon = category.icon;
            const isExpanded = expandedCategory === idx;
            
            return (
              <div key={idx} className={`rounded-lg shadow-lg overflow-hidden ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
                <button
                  onClick={() => setExpandedCategory(isExpanded ? null : idx)}
                  className={`w-full p-6 flex items-center justify-between hover:opacity-80 transition ${
                    darkMode ? 'hover:bg-secondary' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      {category.category}
                    </h2>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-6 h-6 text-primary" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-primary" />
                  )}
                </button>

                {isExpanded && (
                  <div className={`border-t ${darkMode ? 'border-secondary' : 'border-gray-200'} p-6 space-y-4`}>
                    {category.items.map((item, itemIdx) => (
                      <div
                        key={itemIdx}
                        className={`p-4 rounded-lg border-l-4 border-primary transition ${
                          darkMode ? 'bg-secondary hover:bg-secondary-light' : 'bg-gray-50 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                            {item.title}
                          </h3>
                          <ExternalLink className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
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
