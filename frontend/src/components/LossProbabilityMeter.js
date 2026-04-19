import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, TrendingUp, BarChart3, Zap } from 'lucide-react';
import PulseBackground from './PulseBackground';

export default function LossProbabilityMeter({ darkMode, riskLevel = 'medium' }) {
  const [probability, setProbability] = useState(0);

  useEffect(() => {
    const probabilities = {
      low: 15,
      medium: 35,
      high: 60,
    };
    setProbability(probabilities[riskLevel] || 35);
  }, [riskLevel]);

  const getColor = () => {
    if (probability <= 20) return 'from-green-400 to-green-600';
    if (probability <= 40) return 'from-yellow-400 to-yellow-600';
    return 'from-red-400 to-red-600';
  };

  const getColorClass = () => {
    if (probability <= 20) return 'text-green-500';
    if (probability <= 40) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskLabel = () => {
    if (probability <= 20) return 'Low Risk';
    if (probability <= 40) return 'Medium Risk';
    return 'High Risk';
  };

  const getDescription = () => {
    if (probability <= 20)
      return 'Your portfolio has a low chance of losses. Conservative approach with steady growth.';
    if (probability <= 40)
      return 'Moderate risk with balanced volatility. Good growth potential with manageable downside.';
    return 'High risk with significant volatility. Higher potential returns but expect sharp swings.';
  };

  const getIcon = () => {
    if (probability <= 20) return <CheckCircle className="w-12 h-12 text-green-500" />;
    if (probability <= 40) return <AlertTriangle className="w-12 h-12 text-yellow-500" />;
    return <AlertCircle className="w-12 h-12 text-red-500" />;
  };

  return (
    <section className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-white'} relative min-h-screen`}>
      {/* Pulse Background */}
      <PulseBackground />
      
      {/* Content Overlay */}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Loss Probability Meter
          </h2>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Understand your portfolio's risk profile and potential downside
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Left: Gauge */}
          <div className={`lg:col-span-1 p-8 rounded-3xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-lg'}`}>
            <div className="flex flex-col items-center">
              {/* Circular Gauge */}
              <div className="relative w-40 h-40 mb-6">
                <svg className="w-40 h-40" viewBox="0 0 120 120">
                  {/* Background circle */}
                  <circle cx="60" cy="60" r="50" fill="none" stroke={darkMode ? '#374151' : '#e5e7eb'} strokeWidth="8" />
                  
                  {/* Progress circle */}
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke={probability <= 20 ? '#10b981' : probability <= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(probability / 100) * 314} 314`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 1s ease-out' }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-bold text-primary">{probability}%</span>
                  <span className={`text-xs font-semibold mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loss Risk
                  </span>
                </div>
              </div>

              {/* Risk Label */}
              <div className="flex items-center gap-3 mb-4">
                {getIcon()}
                <span className={`text-2xl font-bold ${getColorClass()}`}>
                  {getRiskLabel()}
                </span>
              </div>

              {/* Risk Spectrum Bar */}
              <div className="w-full">
                <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full mb-2"></div>
                <div className="flex justify-between text-xs font-semibold">
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>Low</span>
                  <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>High</span>
                </div>
              </div>
            </div>
          </div>

          {/* Middle: Description & Details */}
          <div className={`lg:col-span-1 p-8 rounded-3xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-lg'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Risk Profile
            </h3>
            <p className={`text-sm leading-relaxed mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getDescription()}
            </p>

            {/* Key Metrics */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <TrendingUp className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getColorClass()}`} />
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Expected Return
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {probability <= 20 ? '6-8% annually' : probability <= 40 ? '10-12% annually' : '15-20% annually'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <BarChart3 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getColorClass()}`} />
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Volatility
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {probability <= 20 ? 'Low (5-10%)' : probability <= 40 ? 'Moderate (10-15%)' : 'High (20%+)'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Zap className={`w-5 h-5 flex-shrink-0 mt-0.5 ${getColorClass()}`} />
                <div>
                  <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-800'}`}>
                    Time Horizon
                  </p>
                  <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {probability <= 20 ? '3-5 years' : probability <= 40 ? '5-10 years' : '10+ years'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Recommendations */}
          <div className={`lg:col-span-1 p-8 rounded-3xl ${darkMode ? 'bg-tertiary border border-gray-800' : 'bg-white shadow-lg'}`}>
            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Recommendations
            </h3>

            <div className="space-y-3">
              {probability <= 20 ? (
                <>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900 bg-opacity-20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      ✓ Ideal for Conservative Investors
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900 bg-opacity-20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      ✓ Good for Retirement Planning
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-green-900 bg-opacity-20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      ✓ Stable & Predictable
                    </p>
                  </div>
                </>
              ) : probability <= 40 ? (
                <>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900 bg-opacity-20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      ⚠ Balanced Growth Strategy
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900 bg-opacity-20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      ⚠ Suitable for Mid-Term Goals
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900 bg-opacity-20 border border-yellow-700' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                      ⚠ Rebalance Quarterly
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 bg-opacity-20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                      ⚡ Aggressive Growth Only
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 bg-opacity-20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                      ⚡ Long-Term Commitment Required
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-red-900 bg-opacity-20 border border-red-700' : 'bg-red-50 border border-red-200'}`}>
                    <p className={`text-sm font-semibold ${darkMode ? 'text-red-400' : 'text-red-700'}`}>
                      ⚡ Monitor Regularly
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Bottom: Insight Card */}
        <div className={`p-6 rounded-2xl ${darkMode ? 'bg-gradient-to-r from-primary to-blue-600 bg-opacity-20 border border-primary border-opacity-30' : 'bg-gradient-to-r from-primary to-blue-600 bg-opacity-10 border border-primary border-opacity-20'}`}>
          <div className="flex items-start gap-4">
            <Zap className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className={`font-semibold mb-1 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                💡 Pro Tip
              </p>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Higher risk doesn't mean bad investments. It means more volatility. Choose based on your timeline, financial goals, and comfort level with market swings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
