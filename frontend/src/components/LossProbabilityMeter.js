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
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <h2 className={`text-4xl font-bold mb-12 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Loss Probability Meter
        </h2>

        {/* Gauge */}
        <div className="mb-8">
          <div className={`relative w-48 h-48 mx-auto rounded-full bg-gradient-to-r ${getColor()} p-1 shadow-lg`}>
            <div className={`w-full h-full rounded-full ${darkMode ? 'bg-tertiary' : 'bg-white'} flex items-center justify-center`}>
              <div className="text-center">
                <div className="text-5xl font-bold text-primary">{probability}%</div>
                <div className={`text-sm font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Chance of Loss
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Label with Icon */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {getIcon()}
          <h3 className={`text-3xl font-bold ${
            probability <= 20 ? 'text-green-600' : probability <= 40 ? 'text-yellow-600' : 'text-red-600'
          }`}>
            {getRiskLabel()}
          </h3>
        </div>

        {/* Description */}
        <p className={`text-lg mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {getDescription()}
        </p>

        {/* Risk Spectrum */}
        <div className={`p-6 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'} shadow-md`}>
          <p className={`text-sm font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Risk Spectrum:
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-600 font-bold">Low</span>
            <span className="text-yellow-600 font-bold">Medium</span>
            <span className="text-red-600 font-bold">High</span>
          </div>
          <div className="w-full h-3 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full"></div>
          <div className="flex justify-between mt-2 text-xs">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Tip */}
        <div className={`mt-8 p-4 rounded-lg ${darkMode ? 'bg-primary' : 'bg-primary'} text-white border-l-4 border-primary-dark`}>
          <p className={`text-sm italic`}>
            Higher risk does not mean bad. It means more volatility. Choose based on your timeline and comfort level.
          </p>
        </div>
      </div>
    </section>
  );
}
