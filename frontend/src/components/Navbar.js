import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, BarChart3, BookOpen, User, History, Info, LogIn, LogOut, UserPlus, Brain, Swords, ChevronDown, Settings, Gift } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setProfileDropdown(false);
    navigate('/');
  };

  const publicLinks = [
    { path: '/', label: 'Home', icon: Brain },
    { path: '/simulator', label: 'Arena', icon: Swords },
    { path: '/fear-quiz', label: 'Fear Quiz', icon: Brain },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/about', label: 'About', icon: Info },
  ];

  const authLinks = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/rewards', label: 'Rewards', icon: Gift },
    { path: '/history', label: 'History', icon: History },
  ];

  const navLinks = isAuthenticated ? [...publicLinks, ...authLinks] : publicLinks;

  return (
    <nav className={`${darkMode ? 'bg-quaternary text-white' : 'bg-white text-quaternary'} shadow-lg sticky top-0 z-50`}
      style={{ borderBottom: darkMode ? '1px solid rgba(59,130,246,0.08)' : '1px solid rgba(0,0,0,0.06)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/favicon.png" alt="InvestSafe" className="w-6 h-6" />
            <span className="font-bold text-xl">InvestSafe</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              const isArena = link.path === '/simulator';
              const isRewards = link.path === '/rewards';
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-1.5 transition text-sm px-3 py-2 rounded-lg"
                  style={
                    isActive
                      ? { background: 'rgba(99,102,241,0.12)', color: '#4F46E5', fontWeight: 600 }
                      : isArena
                        ? { color: darkMode ? '#A78BFA' : '#7C3AED', fontWeight: 600 }
                        : isRewards
                          ? { color: darkMode ? '#FBBF24' : '#D97706', fontWeight: 600 }
                          : { color: darkMode ? '#9CA3AF' : '#374151' }
                  }
                >
                  <Icon className="w-4 h-4" style={{ color: isActive ? '#4F46E5' : isArena ? '#A78BFA' : isRewards ? '#FBBF24' : undefined }} />
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Auth Section */}
            {isAuthenticated ? (
              <div className="relative ml-3" ref={dropdownRef}>
                {/* Avatar + Name (clickable dropdown) */}
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition ${
                    darkMode
                      ? 'hover:bg-white hover:bg-opacity-5'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                  >
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className={`text-sm font-medium hidden lg:block ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    {user?.name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileDropdown ? 'rotate-180' : ''} ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                </button>

                {/* Dropdown Menu */}
                {profileDropdown && (
                  <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-xl overflow-hidden ${
                    darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'
                  }`} style={{ zIndex: 60 }}>
                    {/* User Info Header */}
                    <div className={`px-4 py-3 ${darkMode ? 'bg-slate-700/50' : 'bg-gray-50'}`}>
                      <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                    </div>
                    {/* Menu Items */}
                    <div className="py-1">
                      <Link
                        to="/profile"
                        onClick={() => setProfileDropdown(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                          darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Settings className="w-4 h-4" />
                        Profile Settings
                      </Link>
                      <Link
                        to="/portfolio"
                        onClick={() => setProfileDropdown(false)}
                        className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition ${
                          darkMode ? 'text-gray-300 hover:bg-slate-700' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <BarChart3 className="w-4 h-4" />
                        My Portfolio
                      </Link>
                    </div>
                    {/* Logout */}
                    <div className={`border-t ${darkMode ? 'border-slate-700' : 'border-gray-100'}`}>
                      <button
                        onClick={handleLogout}
                        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 transition ${
                          darkMode ? 'hover:bg-red-500/10' : 'hover:bg-red-50'
                        }`}
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-3">
                <Link
                  to="/login"
                  className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    darkMode
                      ? 'text-gray-300 hover:text-white hover:bg-white hover:bg-opacity-5'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1 px-4 py-2 rounded-lg text-white text-sm font-semibold transition"
                  style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                >
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ml-1 transition ${darkMode ? 'hover:bg-white hover:bg-opacity-5 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
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
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'font-semibold border-l-4'
                      : (darkMode ? 'hover:bg-tertiary text-gray-300' : 'hover:bg-gray-100 text-[#374151]')
                  }`}
                  style={isActive ? { background: 'rgba(99,102,241,0.12)', color: '#4F46E5', borderColor: '#4F46E5' } : {}}
                >
                  <Icon className="w-4 h-4" style={isActive ? { color: '#4F46E5' } : {}} />
                  <span className={isActive ? 'font-semibold' : ''}>{link.label}</span>
                </Link>
              );
            })}

            {/* Mobile Auth */}
            <div className="pt-2 border-t border-gray-600 border-opacity-30 mt-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${darkMode ? 'hover:bg-tertiary' : 'hover:bg-gray-50'}`}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                      style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
                    >
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{user?.email}</p>
                    </div>
                  </Link>
                  <Link
                    to="/portfolio"
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg transition ${darkMode ? 'hover:bg-tertiary text-gray-300' : 'hover:bg-gray-100 text-gray-700'}`}
                  >
                    <BarChart3 className="w-4 h-4 text-gray-400" />
                    <span>My Portfolio</span>
                  </Link>
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
                    className="flex items-center gap-2 px-4 py-3 mx-4 mt-1 rounded-lg text-white text-center justify-center font-medium"
                    style={{ background: 'linear-gradient(135deg, #2563EB, #7C3AED)' }}
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
