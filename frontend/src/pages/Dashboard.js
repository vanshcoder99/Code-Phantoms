import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity, Award, DollarSign } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export default function Dashboard({ darkMode }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/v1/dashboard`);
      setStats(response.data);
    } catch (err) {
      console.error(err);
      setStats({
        total_simulations: 12,
        avg_risk: 0.6,
        stats: {
          total_invested: 50000,
          portfolio_value: 52500,
          gain_loss: 2500,
          gain_loss_percent: 5.0
        },
        recent_activity: [
          { action: 'simulation_run', risk_level: 'medium', timestamp: '2024-01-15T10:30:00' },
          { action: 'portfolio_explained', portfolio: '50% Stocks, 30% Bonds', timestamp: '2024-01-15T09:15:00' }
        ]
      });
    }
    setLoading(false);
  };

  // Mock data for charts
  const portfolioData = [
    { name: 'Stocks', value: 40, fill: '#F7374F' },
    { name: 'Bonds', value: 35, fill: '#88304E' },
    { name: 'Gold', value: 15, fill: '#FBBF24' },
    { name: 'Crypto', value: 10, fill: '#522546' }
  ];

  const performanceData = [
    { month: 'Jan', value: 50000, target: 50000 },
    { month: 'Feb', value: 51200, target: 51500 },
    { month: 'Mar', value: 52100, target: 53000 },
    { month: 'Apr', value: 51800, target: 54500 },
    { month: 'May', value: 52500, target: 56000 },
    { month: 'Jun', value: 52500, target: 57500 }
  ];

  const riskDistribution = [
    { name: 'Low Risk', value: 3, fill: '#10B981' },
    { name: 'Medium Risk', value: 6, fill: '#F59E0B' },
    { name: 'High Risk', value: 3, fill: '#EF4444' }
  ];

  const monthlyGrowth = [
    { month: 'Week 1', growth: 2.5 },
    { month: 'Week 2', growth: 1.8 },
    { month: 'Week 3', growth: 3.2 },
    { month: 'Week 4', growth: 2.1 },
    { month: 'Week 5', growth: 4.5 },
    { month: 'Week 6', growth: 3.8 }
  ];

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

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-7xl mx-auto">
        <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Your Dashboard
        </h1>
        <p className={`text-lg mb-12 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Track your investment journey and performance metrics
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Total Simulations */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Simulations
              </h3>
              <BarChart3 className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">{stats?.total_simulations || 0}</p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Practice sessions completed
            </p>
          </div>

          {/* Average Risk */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Average Risk
              </h3>
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">
              {Math.round((stats?.avg_risk || 0) * 100)}%
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Across all simulations
            </p>
          </div>

          {/* Total Invested */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Total Invested
              </h3>
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <p className="text-3xl font-bold text-primary">
              Rs {(stats?.stats?.total_invested || 0).toLocaleString()}
            </p>
            <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Virtual investment amount
            </p>
          </div>

          {/* Gain/Loss */}
          <div className={`p-6 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Gain/Loss
              </h3>
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <p className={`text-3xl font-bold ${stats?.stats?.gain_loss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              Rs {(stats?.stats?.gain_loss || 0).toLocaleString()}
            </p>
            <p className={`text-sm mt-2 ${stats?.stats?.gain_loss_percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats?.stats?.gain_loss_percent?.toFixed(2)}% return
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Portfolio Allocation */}
          <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Portfolio Allocation
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={portfolioData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {portfolioData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Performance vs Target */}
          <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Performance vs Target
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
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
                <Legend />
                <Line type="monotone" dataKey="value" stroke="#F7374F" strokeWidth={2} name="Actual" />
                <Line type="monotone" dataKey="target" stroke="#88304E" strokeWidth={2} name="Target" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* More Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Risk Distribution */}
          <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Risk Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={riskDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#522546' : '#e5e7eb'} />
                <XAxis dataKey="name" stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <YAxis stroke={darkMode ? '#9ca3af' : '#6b7280'} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: darkMode ? '#522546' : '#ffffff',
                    border: `1px solid ${darkMode ? '#88304E' : '#e5e7eb'}`,
                    color: darkMode ? '#ffffff' : '#000000'
                  }}
                />
                <Bar dataKey="value" fill="#F7374F" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly Growth */}
          <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
              Weekly Growth Rate
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyGrowth}>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
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
                  formatter={(value) => `${value.toFixed(2)}%`}
                />
                <Area type="monotone" dataKey="growth" stroke="#F7374F" fillOpacity={1} fill="url(#colorGrowth)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Recent Activity
          </h2>
          <div className="space-y-4">
            {stats?.recent_activity?.map((activity, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-l-4 border-primary ${
                  darkMode ? 'bg-secondary' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Award className="w-5 h-5 text-primary" />
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                        {activity.action === 'simulation_run' ? 'Simulation Run' : 'Portfolio Explained'}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {activity.risk_level || activity.portfolio}
                      </p>
                    </div>
                  </div>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {new Date(activity.timestamp).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights Section */}
        <div className={`mt-12 p-8 rounded-lg shadow-lg ${darkMode ? 'bg-gradient-to-r from-secondary to-tertiary' : 'bg-gradient-to-r from-gray-100 to-gray-50'}`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Key Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Portfolio Health
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your portfolio is well-diversified with a good balance between growth and stability assets.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Performance Trend
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your investments are performing above target with a 5% return rate this month.
              </p>
            </div>
            <div>
              <h3 className={`font-semibold mb-2 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                Risk Assessment
              </h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Your average risk level is moderate, suitable for long-term wealth building.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
