import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, BarChart, Bar, ComposedChart } from 'recharts';
import { Play, TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export default function RiskSimulator({ darkMode }) {
  const [initialAmount, setInitialAmount] = useState(10000);
  const [timePeriod, setTimePeriod] = useState(12);
  const [riskLevel, setRiskLevel] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');

  const runSimulation = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_BASE}/api/v1/simulate-risk`, {
        initial_amount: initialAmount,
        time_period: timePeriod,
        risk_level: riskLevel,
      });
      setResults(response.data);
    } catch (err) {
      setError('Failed to run simulation. Make sure backend is running.');
      console.error(err);
    }
    setLoading(false);
  };

  const generateMockData = () => {
    const data = [];
    let value = initialAmount;
    const volatility = riskLevel === 'high' ? 0.05 : riskLevel === 'medium' ? 0.03 : 0.01;
    const trend = riskLevel === 'high' ? 0.015 : riskLevel === 'medium' ? 0.01 : 0.005;
    
    for (let i = 0; i <= timePeriod; i++) {
      const randomChange = (Math.random() - 0.5) * volatility + trend;
      value *= (1 + randomChange);
      data.push({ 
        month: i, 
        value: Math.round(value),
        min: Math.round(value * 0.95),
        max: Math.round(value * 1.05)
      });
    }
    return data;
  };

  const handleSimulate = () => {
    runSimulation();
    setTimeout(() => {
      if (!results) {
        const mockData = generateMockData();
        const bestCase = Math.round(initialAmount * Math.pow(1 + (timePeriod / 12) * 0.15, 1));
        const worstCase = Math.round(initialAmount * Math.pow(1 - (timePeriod / 12) * 0.20, 1));
        const averageCase = Math.round(initialAmount * Math.pow(1 + (timePeriod / 12) * 0.08, 1));
        
        setResults({
          best_case: bestCase,
          worst_case: worstCase,
          average_case: averageCase,
          graph_data: mockData,
        });
      }
    }, 1000);
  };

  const riskColors = {
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-red-600',
  };

  // Comparison data
  const comparisonData = results ? [
    { scenario: 'Worst Case', value: results.worst_case, fill: '#EF4444' },
    { scenario: 'Average Case', value: results.average_case, fill: '#F59E0B' },
    { scenario: 'Best Case', value: results.best_case, fill: '#10B981' }
  ] : [];

  return (
    <section
      id="simulator"
      className={`py-20 px-4 ${darkMode ? 'bg-quaternary' : 'bg-gray-50'}`}
    >
      <div className="max-w-7xl mx-auto">
        <h2 className={`text-4xl font-bold mb-4 text-center ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Risk Simulation Sandbox
        </h2>
        <p className={`text-lg text-center mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Simulate different investment scenarios and see potential outcomes
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Input Form */}
          <div className={`p-8 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
            <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Configure Your Simulation
            </h3>

            {/* Initial Amount */}
            <div className="mb-6">
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Initial Investment: Rs {initialAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: Rs 1,000 - Rs 100,000
              </p>
            </div>

            {/* Time Period */}
            <div className="mb-6">
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Time Period: {timePeriod} months
              </label>
              <input
                type="range"
                min="1"
                max="60"
                step="1"
                value={timePeriod}
                onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: 1 - 60 months
              </p>
            </div>

            {/* Risk Level */}
            <div className="mb-8">
              <label className={`block font-semibold mb-4 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Risk Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                {['low', 'medium', 'high'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setRiskLevel(level)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      riskLevel === level
                        ? `bg-primary text-white`
                        : `${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-200 text-gray-700'}`
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Button */}
            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              {loading ? 'Running...' : 'Run Simulation'}
            </button>

            {error && (
              <p className="text-red-600 mt-4 text-sm">{error}</p>
            )}

            {/* Info Box */}
            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                <strong>Tip:</strong> Higher risk levels show greater volatility but potentially higher returns over time.
              </p>
            </div>
          </div>

          {/* Results Summary */}
          <div className={`p-8 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg lg:col-span-2`}>
            {results ? (
              <>
                <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                  Simulation Results
                </h3>

                {/* Outcome Cards */}
                <div className="space-y-4 mb-6">
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-50'} border-l-4 border-green-600`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Best Case Scenario</p>
                        <p className="text-2xl font-bold text-green-600 mt-1">
                          Rs {results.best_case?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-green-600" />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                      Gain: Rs {(results.best_case - initialAmount).toLocaleString()} ({(((results.best_case - initialAmount) / initialAmount) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900' : 'bg-yellow-50'} border-l-4 border-yellow-600`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>Average Case Scenario</p>
                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                          Rs {results.average_case?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-yellow-600" />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                      Gain: Rs {(results.average_case - initialAmount).toLocaleString()} ({(((results.average_case - initialAmount) / initialAmount) * 100).toFixed(1)}%)
                    </p>
                  </div>

                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900' : 'bg-red-50'} border-l-4 border-red-600`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${darkMode ? 'text-red-300' : 'text-red-700'}`}>Worst Case Scenario</p>
                        <p className="text-2xl font-bold text-red-600 mt-1">
                          Rs {results.worst_case?.toLocaleString() || 'N/A'}
                        </p>
                      </div>
                      <TrendingDown className="w-8 h-8 text-red-600" />
                    </div>
                    <p className={`text-xs mt-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                      Loss: Rs {(results.worst_case - initialAmount).toLocaleString()} ({(((results.worst_case - initialAmount) / initialAmount) * 100).toFixed(1)}%)
                    </p>
                  </div>
                </div>

                {/* Motivational Message */}
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-primary' : 'bg-primary'} text-white border-l-4 border-primary-dark`}>
                  <p className={`text-sm italic`}>
                    Fear comes from uncertainty. Now you understand it.
                  </p>
                </div>
              </>
            ) : (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Configure and run a simulation to see results</p>
              </div>
            )}
          </div>
        </div>

        {/* Charts */}
        {results?.graph_data && (
          <>
            {/* Main Portfolio Growth Chart */}
            <div className={`mb-12 p-8 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Portfolio Growth Over Time
              </h3>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={results.graph_data}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F7374F" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#F7374F" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#522546' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#522546' : '#ffffff',
                      border: `1px solid ${darkMode ? '#88304E' : '#e5e7eb'}`,
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                    formatter={(value) => `Rs ${value.toLocaleString()}`}
                  />
                  <Area type="monotone" dataKey="value" stroke="#F7374F" fillOpacity={1} fill="url(#colorValue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Scenario Comparison Chart */}
            <div className={`mb-12 p-8 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Scenario Comparison
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#522546' : '#e5e7eb'} />
                  <XAxis dataKey="scenario" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#522546' : '#ffffff',
                      border: `1px solid ${darkMode ? '#88304E' : '#e5e7eb'}`,
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                    formatter={(value) => `Rs ${value.toLocaleString()}`}
                  />
                  <Bar dataKey="value" fill="#F7374F" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Volatility Range Chart */}
            <div className={`p-8 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
              <h3 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Volatility Range (Min-Max)
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <ComposedChart data={results.graph_data}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#522546' : '#e5e7eb'} />
                  <XAxis dataKey="month" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: darkMode ? '#522546' : '#ffffff',
                      border: `1px solid ${darkMode ? '#88304E' : '#e5e7eb'}`,
                      color: darkMode ? '#ffffff' : '#000000'
                    }}
                    formatter={(value) => `Rs ${value.toLocaleString()}`}
                  />
                  <Line type="monotone" dataKey="value" stroke="#F7374F" strokeWidth={2} name="Expected Value" />
                  <Line type="monotone" dataKey="max" stroke="#10B981" strokeWidth={1} strokeDasharray="5 5" name="Max Range" />
                  <Line type="monotone" dataKey="min" stroke="#EF4444" strokeWidth={1} strokeDasharray="5 5" name="Min Range" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
