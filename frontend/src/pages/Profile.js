import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Settings, LogOut, Edit2, Save, Shield, Calendar } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api';

export default function Profile({ darkMode }) {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const [formData, setFormData] = useState({
    name: '',
    risk_tolerance: '',
    investment_goal: '',
    experience: '',
  });

  // Password change
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        risk_tolerance: user.risk_tolerance || 'medium',
        investment_goal: user.investment_goal || 'Long-term wealth building',
        experience: user.experience || 'Beginner',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      const response = await api.put('/api/v1/auth/profile', formData);
      updateUser(response.data);
      setIsEditing(false);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to save profile' });
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    if (passwordData.new_password.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      return;
    }

    setSaving(true);
    setMessage({ type: '', text: '' });
    try {
      await api.put('/api/v1/auth/change-password', {
        current_password: passwordData.current_password,
        new_password: passwordData.new_password,
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setShowPasswordForm(false);
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to change password' });
    }
    setSaving(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-4xl font-bold mb-12 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Your Profile
        </h1>

        {/* Status Messages */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-xl border ${
            message.type === 'success'
              ? 'bg-green-500 bg-opacity-10 border-green-500 border-opacity-30 text-green-500'
              : 'bg-red-500 bg-opacity-10 border-red-500 border-opacity-30 text-red-500'
          }`}>
            <p className="text-sm text-center">{message.text}</p>
          </div>
        )}

        {/* Profile Card */}
        <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-8`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                  {user?.name || 'User'}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {user?.email}
                </p>
                {user?.created_at && (
                  <p className={`text-xs flex items-center gap-1 mt-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                    <Calendar className="w-3 h-3" />
                    Member since {new Date(user.created_at).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => {
                if (isEditing) handleSave();
                else setIsEditing(true);
              }}
              disabled={saving}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-xl flex items-center gap-2 transition disabled:opacity-50"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : isEditing ? (
                <Save className="w-5 h-5" />
              ) : (
                <Edit2 className="w-5 h-5" />
              )}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {/* Profile Fields */}
          <div className="space-y-6">
            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Full Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                />
              ) : (
                <p className={`p-3 rounded-xl ${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-50 text-gray-600'}`}>{user?.name}</p>
              )}
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              <p className={`p-3 rounded-xl ${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                {user?.email}
                <span className={`text-xs ml-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>(cannot change)</span>
              </p>
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Risk Tolerance
              </label>
              {isEditing ? (
                <select
                  name="risk_tolerance"
                  value={formData.risk_tolerance}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              ) : (
                <p className={`p-3 rounded-xl capitalize ${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  {user?.risk_tolerance || 'medium'}
                </p>
              )}
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Investment Goal
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="investment_goal"
                  value={formData.investment_goal}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                />
              ) : (
                <p className={`p-3 rounded-xl ${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  {user?.investment_goal || 'Long-term wealth building'}
                </p>
              )}
            </div>

            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Experience Level
              </label>
              {isEditing ? (
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              ) : (
                <p className={`p-3 rounded-xl ${darkMode ? 'bg-secondary text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                  {user?.experience || 'Beginner'}
                </p>
              )}
            </div>

            {isEditing && (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className={`px-6 py-3 rounded-xl font-bold transition ${
                    darkMode ? 'bg-secondary hover:bg-quaternary text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Security
          </h2>
          <div className="space-y-4">
            <div className={`p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <span className={darkMode ? 'text-white' : 'text-quaternary'}>Change Password</span>
              </div>
              <button
                onClick={() => setShowPasswordForm(!showPasswordForm)}
                className="text-primary hover:text-primary-dark font-semibold transition"
              >
                {showPasswordForm ? 'Cancel' : 'Update'}
              </button>
            </div>

            {showPasswordForm && (
              <form onSubmit={handlePasswordChange} className="space-y-4 pt-2">
                <input
                  type="password"
                  placeholder="Current password"
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({...passwordData, current_password: e.target.value})}
                  required
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode ? 'bg-secondary border-secondary text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:border-primary`}
                />
                <input
                  type="password"
                  placeholder="New password (min 6 chars)"
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({...passwordData, new_password: e.target.value})}
                  required
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode ? 'bg-secondary border-secondary text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:border-primary`}
                />
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({...passwordData, confirm_password: e.target.value})}
                  required
                  className={`w-full p-3 rounded-xl border-2 ${
                    darkMode ? 'bg-secondary border-secondary text-white' : 'bg-white border-gray-300 text-gray-900'
                  } focus:outline-none focus:border-primary`}
                />
                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </form>
            )}

            <div className={`p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className={darkMode ? 'text-white' : 'text-quaternary'}>Account Security</span>
              </div>
              <span className="text-green-500 text-sm font-medium">Active</span>
            </div>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
