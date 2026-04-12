import React from 'react';
import { BookOpen, Heart, Gamepad2, TrendingUp, ArrowRight } from 'lucide-react';

export default function LearningSection({ darkMode }) {
  const cards = [
    {
      icon: BookOpen,
      title: 'What is Risk?',
      description: 'Risk is the possibility of losing money. Higher returns usually come with higher risk. Understanding risk helps you make smart choices.',
    },
    {
      icon: Heart,
      title: 'Why Fear is Normal',
      description: 'Everyone feels scared about investing. Fear is natural when dealing with money. The key is to understand it, not avoid it.',
    },
    {
      icon: Gamepad2,
      title: 'How Simulation Helps',
      description: 'Practice with virtual money first. See how markets behave. Build confidence. Then invest real money with knowledge.',
    },
    {
      icon: TrendingUp,
      title: 'Long-term Wins',
      description: 'Markets go up and down daily, but historically trend upward over years. Time is your best friend in investing.',
    },
  ];

  return (
    <section
      id="learning"
      className={`py-20 px-4 ${darkMode ? 'bg-quaternary' : 'bg-white'}`}
    >
      <div className="max-w-6xl mx-auto">
        <h2 className={`text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Learning Hub
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <div
                key={idx}
                className={`p-6 rounded-lg shadow-lg hover:shadow-xl transition transform hover:scale-105 ${
                  darkMode ? 'bg-tertiary' : 'bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                  {card.title}
                </h3>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {card.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`mt-12 p-8 rounded-lg text-center ${darkMode ? 'bg-gradient-to-r from-secondary to-tertiary' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
          <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Ready to Start Your Journey?
          </h3>
          <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Use our simulator to practice, learn from AI, and build confidence.
          </p>
          <a
            href="#simulator"
            className="inline-block bg-primary hover:bg-primary-dark text-white px-8 py-3 rounded-lg font-bold hover:shadow-lg transition flex items-center justify-center gap-2"
          >
            Start Now
            <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
