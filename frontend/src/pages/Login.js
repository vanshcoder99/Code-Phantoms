import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, Lock, Eye, EyeOff, Target, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Login({ darkMode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to login. Please check your credentials.');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center px-4 py-12`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Target className="w-8 h-8 text-white" />
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Welcome Back
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Sign in to continue your investment journey
          </p>
        </div>

        {/* Login Form */}
        <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-tertiary' : 'bg-white'} border ${darkMode ? 'border-secondary' : 'border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white placeholder-gray-500 focus:border-primary'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20`}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  className={`w-full pl-11 pr-12 py-3 rounded-xl border-2 transition-all duration-200 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white placeholder-gray-500 focus:border-primary'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-600 border-opacity-30 text-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className="text-primary hover:text-primary-dark font-semibold transition-colors inline-flex items-center gap-1"
              >
                Create Account <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Practice investing risk-free with AI-powered guidance
        </p>
      </div>
    </div>
  );
}
