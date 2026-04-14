import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Signup({ darkMode }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordChecks = {
    length: password.length >= 6,
    match: password === confirmPassword && password.length > 0,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create account. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} flex items-center justify-center px-4 py-12`}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img src="/favicon.png" alt="InvestSafe" className="w-8 h-8" />
          </div>
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Create Account
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Start your risk-free investment journey today
          </p>
        </div>

        {/* Signup Form */}
        <div className={`p-8 rounded-2xl shadow-2xl ${darkMode ? 'bg-tertiary' : 'bg-white'} border ${darkMode ? 'border-secondary' : 'border-gray-200'}`}>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-lg bg-red-500 bg-opacity-10 border border-red-500 border-opacity-30">
                <p className="text-red-500 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Name */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              <div className="relative">
                <User className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white placeholder-gray-500 focus:border-primary'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20`}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <div className="relative">
                <Mail className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="signup-email"
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
                  id="signup-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
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

            {/* Confirm Password */}
            <div>
              <label className={`block text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Confirm Password
              </label>
              <div className="relative">
                <Lock className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  id="signup-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 transition-all duration-200 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white placeholder-gray-500 focus:border-primary'
                      : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary'
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-20`}
                />
              </div>
            </div>

            {/* Password validation hints */}
            {password.length > 0 && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Check className={`w-4 h-4 ${passwordChecks.length ? 'text-green-500' : 'text-gray-500'}`} />
                  <span className={`text-xs ${passwordChecks.length ? 'text-green-500' : darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    At least 6 characters
                  </span>
                </div>
                {confirmPassword.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Check className={`w-4 h-4 ${passwordChecks.match ? 'text-green-500' : 'text-red-500'}`} />
                    <span className={`text-xs ${passwordChecks.match ? 'text-green-500' : 'text-red-500'}`}>
                      Passwords match
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              id="signup-submit"
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-dark text-white py-3.5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating Account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="mt-8 pt-6 border-t border-gray-600 border-opacity-30 text-center">
            <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-primary hover:text-primary-dark font-semibold transition-colors inline-flex items-center gap-1"
              >
                Sign In <ArrowRight className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Footer text */}
        <p className={`text-center mt-6 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
          Join thousands of investors overcoming their fear of investing
        </p>
      </div>
    </div>
  );
}
