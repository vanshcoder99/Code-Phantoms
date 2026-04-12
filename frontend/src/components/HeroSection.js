import React from 'react';
import { ArrowRight, BookOpen, Zap, TrendingUp } from 'lucide-react';

export default function HeroSection({ darkMode, onStartSimulation }) {
  return (
    <section
      id="hero"
      className={`${
        darkMode ? 'bg-gradient-to-br from-quaternary via-secondary to-quaternary' : 'bg-gradient-to-br from-gray-50 via-white to-gray-50'
      } py-20 px-4 text-center`}
    >
      <div className="max-w-4xl mx-auto">
        {/* Main Title */}
        <h1 className={`text-5xl md:text-6xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Overcome Your Fear of Investing
        </h1>

        {/* Subtitle */}
        <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          Simulate risk. Understand outcomes. Invest smarter.
        </p>

        {/* Description */}
        <p className={`text-lg mb-12 max-w-2xl mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Fear comes from uncertainty. Our interactive simulator lets you experience market scenarios with virtual money—no real risk, pure learning.
        </p>

        {/* CTA Button */}
        <button
          onClick={onStartSimulation}
          className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-lg font-bold text-lg hover:shadow-lg hover:scale-105 transition transform duration-300 flex items-center justify-center gap-2 mx-auto"
        >
          Start Simulation
          <ArrowRight className="w-5 h-5" />
        </button>

        {/* Trust Badges */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-md`}>
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>Learn Risk-Free</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Practice with virtual money</p>
          </div>
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-md`}>
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>AI Guidance</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Personalized explanations</p>
          </div>
          <div className={`p-6 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-md`}>
            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <p className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>Real Insights</p>
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Understand probability</p>
          </div>
        </div>
      </div>
    </section>
  );
}
