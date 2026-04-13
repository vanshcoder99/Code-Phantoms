import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Award, DollarSign, Briefcase } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import api from '../api';
import { useAuth } from '../AuthContext';

export default function Dashboard({ darkMode }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchDashboard();
    // eslint-disable-next-line
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await api.get('/api/v1/dashboard');
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load dashboard data');
    }
    setLoading(false);
  };

  // Build chart data from real stats
  const riskDistribution = stats?.risk_distribution ? [
    { name: 'Low Risk', value: stats.risk_distribution.low || 0, fill: '#10B981' },
    { name: 'Medium Risk', value: stats.risk_distribution.medium || 0, fill: '#F59E0B' },
    { name: 'High Risk', value: stats.risk_distribution.high || 0, fill: '#EF4444' }
  ].filter(d => d.value > 0) : [];

  const portfolioData = [
    { name: 'Simulations', value: stats?.total_simulations || 0, fill: '#F7374F' },
    { name: 'Portfolios', value: stats?.total_portfolios || 0, fill: '#88304E' },
  ].filter(d => d.value > 0);

  if (loading) {
    return (
      <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className={darkMode ? 'text-white' : 'text-quaternary'}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Empty state if no data yet
  const isEmpty = stats && stats.total_simulations === 0 && stats.total_portfolios === 0;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-12">
          <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Welcome back, {user?.name?.split(' ')[0] || 'Investor'} 👋
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {isEmpty
              ? 'Start by running a simulation or analyzing a portfolio!'
              : 'Track your investment journey and performance metrics'}
          </p>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30">
            <p className="text-red-500 text-center">{error}</p>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Simulations
              </h3>
              <div className="w-10 h-10 bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-3xl font-bold text-primary">{stats?.total_simulations || 0}</p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Practice sessions completed
            </p>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Portfolios Analyzed
              </h3>
              <div className="w-10 h-10 bg-purple-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-purple-500">{stats?.total_portfolios || 0}</p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              AI-powered analyses
            </p>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Invested (Virtual)
              </h3>
              <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-green-500">
              ₹{(stats?.stats?.total_invested || 0).toLocaleString()}
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Virtual investment amount
            </p>
          </div>

          <div className={`p-6 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Avg Gain/Loss
              </h3>
              <div className={`w-10 h-10 ${(stats?.stats?.gain_loss || 0) >= 0 ? 'bg-green-500' : 'bg-red-500'} bg-opacity-20 rounded-lg flex items-center justify-center`}>
                <TrendingUp className={`w-5 h-5 ${(stats?.stats?.gain_loss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              </div>
            </div>
            <p className={`text-3xl font-bold ${(stats?.stats?.gain_loss || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ₹{(stats?.stats?.gain_loss || 0).toLocaleString()}
            </p>
            <p className={`text-sm mt-2 ${(stats?.stats?.gain_loss_percent || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {(stats?.stats?.gain_loss_percent || 0).toFixed(2)}% return
            </p>
          </div>
        </div>

        {/* Achievement Badges */}
        <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-12`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Achievements
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { emoji: '🚀', title: 'First Sim', desc: 'Run your first simulation', unlocked: (stats?.total_simulations || 0) >= 1 },
              { emoji: '📊', title: 'Analyst', desc: 'Analyze a portfolio', unlocked: (stats?.total_portfolios || 0) >= 1 },
              { emoji: '🔥', title: '5 Sims', desc: 'Run 5 simulations', unlocked: (stats?.total_simulations || 0) >= 5 },
              { emoji: '💎', title: 'Diversifier', desc: 'Try all risk levels', unlocked: (stats?.risk_distribution?.low > 0 && stats?.risk_distribution?.medium > 0 && stats?.risk_distribution?.high > 0) },
              { emoji: '🏆', title: '10 Sims', desc: 'Run 10 simulations', unlocked: (stats?.total_simulations || 0) >= 10 },
              { emoji: '🦁', title: 'Fearless', desc: 'Try high risk', unlocked: (stats?.risk_distribution?.high || 0) >= 1 },
            ].map((badge, i) => (
              <div
                key={i}
                className={`p-4 rounded-xl text-center transition-all ${
                  badge.unlocked
                    ? `${darkMode ? 'bg-primary bg-opacity-20 border-2 border-primary' : 'bg-primary bg-opacity-10 border-2 border-primary'} hover:scale-105`
                    : `${darkMode ? 'bg-secondary opacity-40' : 'bg-gray-100 opacity-50'}`
                }`}
              >
                <span className={`text-3xl block mb-2 ${badge.unlocked ? '' : 'grayscale filter'}`} style={badge.unlocked ? {} : {filter: 'grayscale(1)'}}>{badge.emoji}</span>
                <p className={`text-xs font-bold ${darkMode ? 'text-white' : 'text-gray-800'}`}>{badge.title}</p>
                <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{badge.desc}</p>
                {badge.unlocked && <p className="text-xs text-primary font-bold mt-1">Unlocked!</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        {!isEmpty && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Risk Distribution */}
            {riskDistribution.length > 0 && (
              <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                  Risk Distribution
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={riskDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#522546' : '#e5e7eb'} />
                    <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                    <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#522546' : '#ffffff',
                        border: `1px solid ${darkMode ? '#88304E' : '#e5e7eb'}`,
                        color: darkMode ? '#ffffff' : '#000000',
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="value" name="Simulations">
                      {riskDistribution.map((entry, index) => (
                        <Cell key={index} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Activity Breakdown */}
            {portfolioData.length > 0 && (
              <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                  Activity Breakdown
                </h2>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={portfolioData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {portfolioData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => value} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        )}

        {/* Recent Activity */}
        <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-12`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Recent Activity
          </h2>
          {stats?.recent_activity?.length > 0 ? (
            <div className="space-y-3">
              {stats.recent_activity.map((activity, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border-l-4 border-primary transition-all hover:translate-x-1 ${
                    darkMode ? 'bg-secondary' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        activity.action === 'simulation_run' ? 'bg-primary bg-opacity-20' : 'bg-purple-500 bg-opacity-20'
                      }`}>
                        {activity.action === 'simulation_run'
                          ? <Activity className="w-4 h-4 text-primary" />
                          : <Award className="w-4 h-4 text-purple-500" />
                        }
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                          {activity.action === 'simulation_run' ? 'Simulation Run' : 'Portfolio Analyzed'}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {activity.risk_level
                            ? `${activity.risk_level.charAt(0).toUpperCase() + activity.risk_level.slice(1)} risk • ₹${(activity.amount || 0).toLocaleString()}`
                            : activity.portfolio
                          }
                        </p>
                      </div>
                    </div>
                    <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      {activity.timestamp ? new Date(activity.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      }) : 'N/A'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={`text-center py-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No activity yet. Run a simulation or analyze a portfolio to get started!</p>
            </div>
          )}
        </div>

        {/* ML Investor Profile Predictor */}
        <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            🤖 ML Investor Profile Predictor
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Powered by Random Forest Classifier (scikit-learn)
          </p>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Age</label>
              <input id="ml-age" type="number" defaultValue="20"
                className={`w-full p-3 rounded-xl mt-1 ${darkMode ? 'bg-quaternary text-white border border-gray-600' : 'bg-gray-100 text-gray-900 border border-gray-300'}`} />
            </div>
            <div>
              <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Monthly Savings (₹)</label>
              <input id="ml-savings" type="number" defaultValue="1000"
                className={`w-full p-3 rounded-xl mt-1 ${darkMode ? 'bg-quaternary text-white border border-gray-600' : 'bg-gray-100 text-gray-900 border border-gray-300'}`} />
            </div>
            <div>
              <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Fear Score (0-100)</label>
              <input id="ml-fear" type="number" defaultValue="60"
                className={`w-full p-3 rounded-xl mt-1 ${darkMode ? 'bg-quaternary text-white border border-gray-600' : 'bg-gray-100 text-gray-900 border border-gray-300'}`} />
            </div>
            <div>
              <label className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Knowledge Score (0-100)</label>
              <input id="ml-knowledge" type="number" defaultValue="20"
                className={`w-full p-3 rounded-xl mt-1 ${darkMode ? 'bg-quaternary text-white border border-gray-600' : 'bg-gray-100 text-gray-900 border border-gray-300'}`} />
            </div>
          </div>
          <button
            onClick={async () => {
              try {
                const res = await api.post('/ai/predict-profile', {
                  age: Number(document.getElementById('ml-age').value),
                  monthly_savings: Number(document.getElementById('ml-savings').value),
                  fear_score: Number(document.getElementById('ml-fear').value),
                  knowledge_score: Number(document.getElementById('ml-knowledge').value),
                });
                const data = res.data;
                document.getElementById('ml-result').innerHTML = `
                  <p class="text-xl font-bold" style="color:var(--primary)">${data.profile_type}</p>
                  <p style="color:#9ca3af;margin-top:8px;font-size:13px">${data.description}</p>
                  <div style="margin-top:12px;padding:12px;border-radius:12px;background:rgba(255,71,87,0.1);border:1px solid rgba(255,71,87,0.2)">
                    <p style="color:#d1d5db;font-size:13px"><strong>Allocation:</strong> ${data.recommended_allocation}</p>
                    <p style="color:#06D6A0;margin-top:6px;font-size:13px"><strong>Expected Return:</strong> ${data.expected_return}</p>
                    <p style="color:#FFD93D;margin-top:6px;font-size:13px"><strong>SIP Suggestion:</strong> ${data.sip_suggestion || 'N/A'}</p>
                  </div>
                  <div style="margin-top:12px;display:flex;gap:16px;flex-wrap:wrap">
                    <span style="color:#06D6A0;font-size:12px">Confidence: ${data.confidence_percent}%</span>
                    <span style="color:#9ca3af;font-size:12px">Train: ${data.train_accuracy}% | Test: ${data.test_accuracy}%</span>
                    <span style="color:#6b7280;font-size:12px">${data.ml_model_used} (${data.n_estimators} trees)</span>
                  </div>
                  <p style="color:#4b5563;margin-top:8px;font-size:11px">Dataset: ${data.dataset_size} investors | Features: ${(data.features_used || []).length} | Framework: ${data.framework}</p>
                `;
              } catch(e) {
                document.getElementById('ml-result').innerHTML = '<p style="color:#FF4757">Make sure backend is running!</p>';
              }
            }}
            className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:opacity-90 transition mb-4"
          >
            Predict My Investor Profile
          </button>
          <div id="ml-result" className={`p-4 rounded-xl min-h-16 ${darkMode ? 'bg-quaternary' : 'bg-gray-100'}`}></div>
        </div>
      </div>
    </div>
  );
}
