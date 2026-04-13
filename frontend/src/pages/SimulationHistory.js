import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Download, Calendar, TrendingUp } from 'lucide-react';
import axios from 'axios';

const API_BASE = 'https://investsafe-backend.onrender.com';

export default function SimulationHistory({ darkMode }) {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/ai/simulations`);
      setSimulations(response.data.simulations || []);
    } catch (err) {
      console.error(err);
      setSimulations([
        {
          id: 1,
          initial_amount: 10000,
          time_period: 12,
          risk_level: 'medium',
          created_at: '2024-01-15',
          result: { best_case: 15000, worst_case: 7000, average_case: 11000 }
        },
        {
          id: 2,
          initial_amount: 50000,
          time_period: 24,
          risk_level: 'high',
          created_at: '2024-01-14',
          result: { best_case: 75000, worst_case: 35000, average_case: 55000 }
        },
      ]);
    }
    setLoading(false);
  };

  const handleDelete = (id) => {
    setSimulations(simulations.filter(sim => sim.id !== id));
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={darkMode ? 'text-white' : 'text-quaternary'}>Loading simulations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <h1 className={`text-4xl font-bold mb-12 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Simulation History
        </h1>

        {simulations.length === 0 ? (
          <div className={`p-12 rounded-lg text-center ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No simulations yet. Start by running your first simulation!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Date */}
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Date</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                        {new Date(sim.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Initial Amount */}
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Initial Amount</p>
                    <p className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      Rs {sim.initial_amount.toLocaleString()}
                    </p>
                  </div>

                  {/* Time Period */}
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Time Period</p>
                    <p className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      {sim.time_period} months
                    </p>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Risk Level</p>
                    <p className={`font-semibold text-lg ${getRiskColor(sim.risk_level)}`}>
                      {sim.risk_level.charAt(0).toUpperCase() + sim.risk_level.slice(1)}
                    </p>
                  </div>

                  {/* Average Result */}
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Avg Result</p>
                    <p className={`font-semibold text-lg text-primary`}>
                      Rs {sim.result?.average_case?.toLocaleString() || 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-600">
                  <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-secondary hover:bg-secondary-dark text-white rounded-lg transition">
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    onClick={() => handleDelete(sim.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition ml-auto"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
