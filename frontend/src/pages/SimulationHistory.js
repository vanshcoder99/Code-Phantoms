import React, { useState, useEffect } from 'react';
import { Trash2, Eye, Calendar, TrendingUp, AlertCircle } from 'lucide-react';
import api from '../api';

export default function SimulationHistory({ darkMode }) {
  const [simulations, setSimulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchSimulations();
  }, []);

  const fetchSimulations = async () => {
    try {
      const response = await api.get('/api/v1/simulations');
      setSimulations(response.data.simulations || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load simulation history');
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this simulation?')) return;

    setDeleting(id);
    try {
      await api.delete(`/api/v1/simulations/${id}`);
      setSimulations(simulations.filter(sim => sim.id !== id));
    } catch (err) {
      setError('Failed to delete simulation');
    }
    setDeleting(null);
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'high': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getRiskBg = (level) => {
    switch(level) {
      case 'low': return 'bg-green-500 bg-opacity-10';
      case 'medium': return 'bg-yellow-500 bg-opacity-10';
      case 'high': return 'bg-red-500 bg-opacity-10';
      default: return 'bg-gray-500 bg-opacity-10';
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
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Simulation History
            </h1>
            <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {simulations.length} simulation{simulations.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {simulations.length === 0 ? (
          <div className={`p-16 rounded-xl text-center ${darkMode ? 'bg-tertiary' : 'bg-white'} shadow-lg`}>
            <TrendingUp className={`w-16 h-16 mx-auto mb-6 ${darkMode ? 'text-gray-600' : 'text-gray-300'}`} />
            <h3 className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              No simulations yet
            </h3>
            <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Go to the home page and run your first simulation to see it here!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {simulations.map((sim) => (
              <div
                key={sim.id}
                className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} hover:shadow-xl transition-all duration-300`}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Date */}
                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                        {sim.created_at
                          ? new Date(sim.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                          : 'N/A'
                        }
                      </p>
                    </div>
                  </div>

                  {/* Initial Amount */}
                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Invested</p>
                    <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      ₹{(sim.initial_amount || 0).toLocaleString()}
                    </p>
                  </div>

                  {/* Time Period */}
                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Duration</p>
                    <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                      {sim.time_period} months
                    </p>
                  </div>

                  {/* Risk Level */}
                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Risk</p>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(sim.risk_level)} ${getRiskBg(sim.risk_level)}`}>
                      {sim.risk_level ? sim.risk_level.charAt(0).toUpperCase() + sim.risk_level.slice(1) : 'N/A'}
                    </span>
                  </div>

                  {/* Result */}
                  <div>
                    <p className={`text-xs uppercase font-semibold mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Result</p>
                    <p className="font-bold text-lg text-primary">
                      ₹{(sim.average_case || 0).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-opacity-20 border-gray-500">
                  <button
                    onClick={() => handleDelete(sim.id)}
                    disabled={deleting === sim.id}
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition ml-auto disabled:opacity-50 text-sm"
                  >
                    {deleting === sim.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
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
