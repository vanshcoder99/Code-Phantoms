import React, { useState } from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

export default function Portfolio({ darkMode }) {
  const [portfolios, setPortfolios] = useState([
    { name: 'Stocks', value: 50, color: '#3b82f6' },
    { name: 'Bonds', value: 30, color: '#10b981' },
    { name: 'Gold', value: 20, color: '#f59e0b' }
  ]);

  const [newAsset, setNewAsset] = useState('');
  const [newValue, setNewValue] = useState('');

  const addAsset = () => {
    if (newAsset && newValue) {
      setPortfolios([...portfolios, { name: newAsset, value: parseInt(newValue), color: '#' + Math.floor(Math.random()*16777215).toString(16) }]);
      setNewAsset('');
      setNewValue('');
    }
  };

  const removeAsset = (idx) => {
    setPortfolios(portfolios.filter((_, i) => i !== idx));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} py-20 px-4`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-5xl font-bold mb-12 text-center animate-fadeIn ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          💼 Portfolio Builder
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Your Portfolio</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolios}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolios.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Asset Management */}
          <div className={`p-8 rounded-lg shadow-lg animate-slideUp ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Manage Assets</h2>

            {/* Add Asset */}
            <div className="mb-6 space-y-4">
              <input
                type="text"
                placeholder="Asset name (e.g., Tech Stocks)"
                value={newAsset}
                onChange={(e) => setNewAsset(e.target.value)}
                className={`w-full p-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:border-blue-500`}
              />
              <input
                type="number"
                placeholder="Allocation %"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className={`w-full p-3 rounded-lg border-2 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300 text-gray-900'
                } focus:outline-none focus:border-blue-500`}
              />
              <button
                onClick={addAsset}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-bold hover:shadow-lg transition transform hover:scale-105"
              >
                ➕ Add Asset
              </button>
            </div>

            {/* Asset List */}
            <div className="space-y-3">
              {portfolios.map((asset, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-lg flex justify-between items-center animate-slideUp ${
                    darkMode ? 'bg-gray-700' : 'bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: asset.color }}
                    ></div>
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {asset.name}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {asset.value}%
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeAsset(idx)}
                    className="text-red-500 hover:text-red-700 font-bold transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className={`mt-6 p-4 rounded-lg ${darkMode ? 'bg-blue-900' : 'bg-blue-50'} border-l-4 border-blue-500`}>
              <p className={`text-sm font-semibold ${darkMode ? 'text-blue-300' : 'text-blue-700'}`}>
                Total Allocation: {portfolios.reduce((sum, a) => sum + a.value, 0)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
