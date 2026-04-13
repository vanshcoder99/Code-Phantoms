import React, { useState } from 'react';
import { Zap, Send, Lightbulb, CheckCircle } from 'lucide-react';
import api from '../api';

export default function AIExplainer({ darkMode }) {
  const [portfolio, setPortfolio] = useState('');
  const [loading, setLoading] = useState(false);
  const [explanation, setExplanation] = useState(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const explainPortfolio = async () => {
    if (!portfolio.trim()) {
      setError('Please enter a portfolio');
      return;
    }

    setLoading(true);
    setError('');
    setSaved(false);
    try {
      const response = await api.post('/api/v1/explain-portfolio', {
        portfolio: portfolio,
      });
      setExplanation(response.data.explanation);
      if (response.data.saved) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      console.error(err);
      setError('Running locally (backend not connected).');
      setExplanation(
        `Your portfolio of "${portfolio}" is a balanced mix. This shows good diversification. Consider your risk tolerance and investment timeline. Remember: start small and learn as you go!`
      );
    }
    setLoading(false);
  };

  const examplePortfolios = [
    '50% Stocks, 30% Bonds, 20% Gold',
    '70% Index Funds, 30% Bonds',
    '40% Tech Stocks, 40% Banking, 20% Crypto',
  ];

  return (
    <section
      id="explainer"
      className={`py-20 px-4 ${darkMode ? 'bg-quaternary' : 'bg-gray-50'}`}
    >
      <div className="max-w-4xl mx-auto">
        <h2 className={`text-4xl font-bold mb-12 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          AI Portfolio Explainer
        </h2>

        {/* Saved toast */}
        {saved && (
          <div className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500 text-white shadow-lg animate-bounce">
            <CheckCircle className="w-5 h-5" />
            <span className="font-medium">Analysis saved to your account!</span>
          </div>
        )}

        <div className={`p-8 rounded-xl ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
          {/* Input */}
          <div className="mb-6">
            <label className={`block font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Enter Your Portfolio
            </label>
            <textarea
              value={portfolio}
              onChange={(e) => setPortfolio(e.target.value)}
              placeholder="e.g., 50% Stocks, 30% Bonds, 20% Gold"
              className={`w-full p-4 rounded-xl border-2 ${
                darkMode
                  ? 'bg-secondary border-secondary text-white'
                  : 'bg-white border-gray-300 text-gray-900'
              } focus:outline-none focus:border-primary`}
              rows="3"
            />
          </div>

          {/* Example Portfolios */}
          <div className="mb-6">
            <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Quick Examples:
            </p>
            <div className="flex flex-wrap gap-2">
              {examplePortfolios.map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setPortfolio(example)}
                  className={`px-3 py-2 rounded-xl text-sm transition ${
                    darkMode
                      ? 'bg-secondary hover:bg-primary hover:text-white text-gray-300'
                      : 'bg-gray-200 hover:bg-primary hover:text-white text-gray-700'
                  }`}
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Explain Button */}
          <button
            onClick={explainPortfolio}
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold hover:shadow-lg transition disabled:opacity-50 mb-6 flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5" />
            {loading ? 'Analyzing...' : 'Explain My Portfolio'}
          </button>

          {error && (
            <p className="text-yellow-500 mb-4 text-sm text-center">{error}</p>
          )}

          {/* Explanation Output */}
          {explanation && (
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-primary' : 'bg-primary'} text-white border-l-4 border-primary-dark`}>
              <div className="flex items-start gap-3 mb-3">
                <Lightbulb className="w-5 h-5 flex-shrink-0 mt-1" />
                <h3 className={`font-bold`}>
                  AI Analysis:
                </h3>
              </div>
              <p className={`leading-relaxed`}>
                {explanation}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
