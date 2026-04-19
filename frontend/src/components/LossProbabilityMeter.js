import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
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

  const getRiskLabel = () => {
    if (probability <= 20) return 'Low Risk';
    if (probability <= 40) return 'Medium Risk';
    return 'High Risk';
  };

  const getDescription = () => {
    if (probability <= 20)
      return 'Your portfolio has a low chance of losses. Conservative approach.';
    if (probability <= 40)
      return 'Moderate risk. Expect some volatility but good growth potential.';
    return 'High risk. Significant volatility but higher potential returns.';
  };

  const getIcon = () => {
    if (probability <= 20) return <CheckCircle className="w-8 h-8 text-green-600" />;
    if (probability <= 40) return <AlertTriangle className="w-8 h-8 text-yellow-600" />;
    return <AlertCircle className="w-8 h-8 text-red-600" />;
  };

  return (
    <section className={`py-20 px-4 ${darkMode ? 'bg-black' : 'bg-white'} relative min-h-screen`}>
      {/* Pulse Background */}
      <PulseBackground />
      
      {/* Content Overlay */}
      <div className="max-w-4xl mx-auto relative z-10">
        <h2 className={`text-4xl font-bold mb-16 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Loss Probability Meter
        </h2>

        {/* Main Container - Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left: Gauge */}
          <div className="flex justify-center md:justify-end">
            <div className={`relative w-40 h-40 rounded-full bg-gradient-to-r ${getColor()} p-1 shadow-2xl`}>
              <div className={`w-full h-full rounded-full ${darkMode ? 'bg-black' : 'bg-white'} flex items-center justify-center`}>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary">{probability}%</div>
                  <div className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    Loss Risk
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center: Risk Info */}
          <div className="text-center">
            {/* Risk Label with Icon */}
            <div className="flex items-center justify-center gap-3 mb-6">
              {getIcon()}
              <h3 className={`text-2xl font-bold ${
                probability <= 20 ? 'text-green-600' : probability <= 40 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {getRiskLabel()}
              </h3>
            </div>

            {/* Description */}
            <p className={`text-sm leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {getDescription()}
            </p>

            {/* Tip */}
            <div className={`mt-6 p-3 rounded-lg ${darkMode ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'} border border-primary border-opacity-30`}>
              <p className={`text-xs italic ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                Higher risk = more volatility. Choose based on your timeline.
              </p>
            </div>
          </div>

          {/* Right: Risk Spectrum */}
          <div className={`p-5 rounded-xl ${darkMode ? 'bg-secondary bg-opacity-50' : 'bg-gray-50'} shadow-lg backdrop-blur-sm`}>
            <p className={`text-xs font-bold mb-4 uppercase tracking-wide ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Risk Spectrum
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-600 font-bold text-sm">Low</span>
                <span className="text-yellow-600 font-bold text-sm">Medium</span>
                <span className="text-red-600 font-bold text-sm">High</span>
              </div>
              <div className="w-full h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full shadow-lg"></div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
