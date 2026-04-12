import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun, Target, BarChart3, BookOpen, User, History, Info } from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { path: '/', label: 'Home', icon: Target },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/resources', label: 'Resources', icon: BookOpen },
    { path: '/history', label: 'History', icon: History },
    { path: '/about', label: 'About', icon: Info },
    { path: '/profile', label: 'Profile', icon: User },
  ];

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
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className="flex items-center gap-1 hover:text-primary transition"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
            
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-tertiary' : 'bg-gray-200'} transition`}
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden pb-4 space-y-2 ${darkMode ? 'bg-tertiary' : 'bg-gray-100'}`}>
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-primary hover:text-white rounded transition"
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}
