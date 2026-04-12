import React, { useState } from 'react';
import { User, Mail, Lock, Settings, LogOut, Edit2, Save } from 'lucide-react';

export default function Profile({ darkMode }) {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Investor',
    email: 'john@example.com',
    riskTolerance: 'medium',
    investmentGoal: 'Long-term wealth building',
    experience: 'Beginner',
  });

  const [formData, setFormData] = useState(profile);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setProfile(formData);
    setIsEditing(false);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-quaternary' : 'bg-gray-50'} py-12 px-4`}>
      <div className="max-w-2xl mx-auto">
        <h1 className={`text-4xl font-bold mb-12 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
          Your Profile
        </h1>

        {/* Profile Card */}
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-8`}>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-quaternary'}`}>
                  {profile.name}
                </h2>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {profile.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
            >
              {isEditing ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              {isEditing ? 'Save' : 'Edit'}
            </button>
          </div>

          {/* Profile Information */}
          <div className="space-y-6">
            {/* Name */}
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
                  className={`w-full p-3 rounded-lg border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                />
              ) : (
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Email Address
              </label>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                />
              ) : (
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.email}</p>
              )}
            </div>

            {/* Risk Tolerance */}
            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Risk Tolerance
              </label>
              {isEditing ? (
                <select
                  name="riskTolerance"
                  value={formData.riskTolerance}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border-2 ${
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
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.riskTolerance}</p>
              )}
            </div>

            {/* Investment Goal */}
            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Investment Goal
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="investmentGoal"
                  value={formData.investmentGoal}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border-2 ${
                    darkMode
                      ? 'bg-secondary border-secondary text-white'
                      : 'bg-white border-gray-300 text-quaternary'
                  } focus:outline-none focus:border-primary`}
                />
              ) : (
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.investmentGoal}</p>
              )}
            </div>

            {/* Experience */}
            <div>
              <label className={`block font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Experience Level
              </label>
              {isEditing ? (
                <select
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  className={`w-full p-3 rounded-lg border-2 ${
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
                <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{profile.experience}</p>
              )}
            </div>

            {isEditing && (
              <button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary-dark text-white py-3 rounded-lg font-bold transition"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* Settings */}
        <div className={`p-8 rounded-lg shadow-lg ${darkMode ? 'bg-tertiary' : 'bg-white'} mb-8`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-quaternary'}`}>
            Settings
          </h2>

          <div className="space-y-4">
            <div className={`p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-primary" />
                <span className={darkMode ? 'text-white' : 'text-quaternary'}>Change Password</span>
              </div>
              <button className="text-primary hover:text-primary-dark transition">Update</button>
            </div>

            <div className={`p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary" />
                <span className={darkMode ? 'text-white' : 'text-quaternary'}>Email Notifications</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className={`p-4 rounded-lg flex items-center justify-between ${darkMode ? 'bg-secondary' : 'bg-gray-50'}`}>
              <div className="flex items-center gap-3">
                <Settings className="w-5 h-5 text-primary" />
                <span className={darkMode ? 'text-white' : 'text-quaternary'}>Two-Factor Authentication</span>
              </div>
              <input type="checkbox" className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Logout */}
        <button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition">
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
}
