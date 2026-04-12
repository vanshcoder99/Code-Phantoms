import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SimulatorDetails({ darkMode }) {
  const [activeTab, setActiveTab] = useState('overview');

  const mockData = [
    { month: 0, value: 10000 },
    { month: 3, value: 10500 },
    { month: 6, value: 11200 },
    { month: 9, value: 10800 },
    { month: 12, value: 12500 }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-5xl font-bold mb-12 text-center animate-fadeIn ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          📊 Simulation Details
        </h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 flex-wrap animate-slideUp">
          {['overview', 'analysis', 'recommendations'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-lg font-bold transition transform hover:scale-105 ${
                activeTab === tab
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : `${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'}`
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Simulation Results
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={mockData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" name="Portfolio Value" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className={`p-6 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-green-900' : 'bg-green-50'} border-l-4 border-green-500`}>
                <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Best Case</p>
                <p className="text-3xl font-bold text-green-500">₹15,000</p>
              </div>

              <div className={`p-6 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'} border-l-4 border-yellow-500`}>
                <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Average Case</p>
                <p className="text-3xl font-bold text-yellow-500">₹12,500</p>
              </div>

              <div className={`p-6 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-red-900' : 'bg-red-50'} border-l-4 border-red-500`}>
                <p className={`text-sm font-semibold mb-2 ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Worst Case</p>
                <p className="text-3xl font-bold text-red-500">₹8,500</p>
              </div>
            </div>
          </div>
        )}

        {/* Analysis Tab */}
        {activeTab === 'analysis' && (
          <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Detailed Analysis
            </h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Volatility Analysis</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Your portfolio shows moderate volatility with an average monthly change of 3.5%. This is typical for a medium-risk portfolio.
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Risk Assessment</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Based on the simulation, there's a 35% chance of experiencing losses in any given year. However, over a 5-year period, the probability of positive returns increases to 85%.
                </p>
              </div>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Expected Returns</h3>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  The simulation suggests an average annual return of 12%, which aligns with historical market performance for medium-risk portfolios.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Recommendations
            </h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${darkMode ? 'bg-blue-900' : 'bg-blue-50'}`}>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>✓ Increase Equity Allocation</h3>
                <p className={`${darkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  Consider increasing your equity allocation to 60% for better long-term growth potential.
                </p>
              </div>

              <div className={`p-4 rounded-lg border-l-4 border-green-500 ${darkMode ? 'bg-green-900' : 'bg-green-50'}`}>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-green-300' : 'text-green-700'}`}>✓ Diversify Across Sectors</h3>
                <p className={`${darkMode ? 'text-green-200' : 'text-green-600'}`}>
                  Add exposure to different sectors like IT, Banking, and Healthcare for better diversification.
                </p>
              </div>

              <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${darkMode ? 'bg-purple-900' : 'bg-purple-50'}`}>
                <h3 className={`font-bold mb-2 ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>✓ Start SIP Early</h3>
                <p className={`${darkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  Begin a monthly SIP of ₹5,000 to benefit from rupee cost averaging and compound growth.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
