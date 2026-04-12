import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function SIPCalculator({ darkMode }) {
  const [monthlyAmount, setMonthlyAmount] = useState(5000);
  const [years, setYears] = useState(10);
  const [returnRate, setReturnRate] = useState(12);
  const [data, setData] = useState([]);
  const [results, setResults] = useState(null);

  useEffect(() => {
    calculateSIP();
  }, [monthlyAmount, years, returnRate]);

  const calculateSIP = () => {
    const months = years * 12;
    const monthlyRate = returnRate / 100 / 12;
    let totalInvested = 0;
    let totalValue = 0;
    const chartData = [];

    for (let month = 0; month <= months; month++) {
      totalInvested = monthlyAmount * month;
      totalValue = monthlyAmount * (((1 + monthlyRate) ** month - 1) / monthlyRate) * (1 + monthlyRate);

      if (month % 12 === 0) {
        chartData.push({
          month: `Year ${month / 12}`,
          invested: Math.round(totalInvested),
          value: Math.round(totalValue)
        });
      }
    }

    setData(chartData);
    setResults({
      totalInvested: Math.round(totalInvested),
      totalValue: Math.round(totalValue),
      gains: Math.round(totalValue - totalInvested)
    });
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-5xl font-bold mb-12 text-center animate-fadeIn ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💰 SIP Calculator
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Configure SIP
            </h2>

            {/* Monthly Amount */}
            <div className="mb-8">
              <label className={`block font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Monthly Investment: ₹{monthlyAmount.toLocaleString()}
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={monthlyAmount}
                onChange={(e) => setMonthlyAmount(Number(e.target.value))}
                className="w-full"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: ₹1,000 - ₹100,000
              </p>
            </div>

            {/* Years */}
            <div className="mb-8">
              <label className={`block font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Investment Period: {years} years
              </label>
              <input
                type="range"
                min="1"
                max="40"
                step="1"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                className="w-full"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: 1 - 40 years
              </p>
            </div>

            {/* Return Rate */}
            <div className="mb-8">
              <label className={`block font-semibold mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Expected Annual Return: {returnRate}%
              </label>
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={returnRate}
                onChange={(e) => setReturnRate(Number(e.target.value))}
                className="w-full"
              />
              <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Range: 5% - 30%
              </p>
            </div>

            {/* Results */}
            {results && (
              <div className="space-y-4 mt-8">
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} border-l-4 border-blue-500`}>
                  <p className={`text-sm ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>Total Invested</p>
                  <p className="text-3xl font-bold text-blue-500">₹{results.totalInvested.toLocaleString()}</p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900' : 'bg-green-50'} border-l-4 border-green-500`}>
                  <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-700'}`}>Final Value</p>
                  <p className="text-3xl font-bold text-green-500">₹{results.totalValue.toLocaleString()}</p>
                </div>

                <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900' : 'bg-purple-50'} border-l-4 border-purple-500`}>
                  <p className={`text-sm ${darkMode ? 'text-purple-300' : 'text-purple-700'}`}>Total Gains</p>
                  <p className="text-3xl font-bold text-purple-500">₹{results.gains.toLocaleString()}</p>
                </div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Growth Over Time
            </h2>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="invested"
                  stroke="#3b82f6"
                  name="Invested"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#10b981"
                  name="Portfolio Value"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tips */}
        <div className={`mt-12 p-8 rounded-lg shadow-lg animate-fadeIn ${darkMode ? 'bg-gradient-to-r from-blue-900 to-purple-900' : 'bg-gradient-to-r from-blue-50 to-purple-50'}`}>
          <h3 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            💡 SIP Tips
          </h3>
          <ul className={`space-y-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            <li>✓ Start early to benefit from compound interest</li>
            <li>✓ Invest consistently regardless of market conditions</li>
            <li>✓ Increase SIP amount as your income grows</li>
            <li>✓ Diversify across different asset classes</li>
            <li>✓ Review and rebalance portfolio annually</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
