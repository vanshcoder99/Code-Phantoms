import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Target, BarChart3, BookOpen, User, History, Info, LogIn, LogOut, UserPlus, Brain } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const publicLinks = [
    { path: '/', label: 'Home', icon: Target },
    { path: '/fear-quiz', label: 'Fear Quiz', icon: Brain },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/about', label: 'About', icon: Info },
  ];

  const authLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/history', label: 'History', icon: History },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const navLinks = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks;

  return (
    <nav className={`${darkMode ? 'bg-quaternary text-white' : 'bg-white text-quaternary'} shadow-lg sticky top-0 z-50`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Target className="w-6 h-6 text-primary" />
            <span className="font-bold text-xl">Investing Fear</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-1 hover:text-primary transition text-sm"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2">
                {/* User Avatar */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className={`text-sm font-medium hidden lg:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden lg:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-2">
                <Link
                  to="/login"
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    darkMode
                      ? 'bg-tertiary hover:bg-secondary text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white text-sm font-medium transition"
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-gray-200'} transition`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-gray-200'} transition`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 space-y-1 ${darkMode ? 'bg-quaternary' : 'bg-white'}`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                    darkMode ? 'hover:bg-tertiary' : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-600 border-opacity-30 mt-2">
              {isAuthenticated ? (
                <>
                  <div className={`flex items-center gap-3 px-4 py-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                      <p className="text-xs">{user?.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-3 w-full text-left text-red-500 hover:bg-red-500 hover:bg-opacity-10 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${darkMode ? 'hover:bg-tertiary' : 'hover:bg-gray-100'}`}
                  >
                    <LogIn className="w-4 h-4 text-primary" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 mx-4 mt-1 rounded-lg bg-primary text-white text-center justify-center font-medium"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up Free</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
