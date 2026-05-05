import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import NavbarUpgraded from '../components/Layout/Navbar';
import Footer from '../components/Layout/Footer';

const Settings = () => {
  const { isDark, toggleTheme } = useTheme();
  const [fontSize, setFontSize] = useState('14');
  const [fontFamily, setFontFamily] = useState('monospace');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col">
      <NavbarUpgraded />

      {/* Settings Container */}
      <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold mb-12">Settings</h1>

          {/* Appearance */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Appearance</h2>
            <div className="space-y-4">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-slate-400 text-sm">Switch between dark and light theme</p>
                </div>
                <button
                  onClick={toggleTheme}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    isDark ? 'bg-indigo-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      isDark ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Font Size */}
              <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <p className="font-medium mb-4">Editor Font Size</p>
                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="10"
                    max="20"
                    value={fontSize}
                    onChange={(e) => setFontSize(e.target.value)}
                    className="flex-1 accent-indigo-600"
                  />
                  <span className="text-indigo-400 font-medium">{fontSize}px</span>
                </div>
              </div>

              {/* Font Family */}
              <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <label className="block font-medium mb-3">Font Family</label>
                <select
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-indigo-500/50"
                >
                  <option value="monospace">Monospace</option>
                  <option value="courier">Courier</option>
                  <option value="fira">Fira Code</option>
                  <option value="inconsolata">Inconsolata</option>
                </select>
              </div>
            </div>
          </section>

          {/* Editor Settings */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Editor</h2>
            <div className="space-y-4">
              {/* Auto Save */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium">Auto Save</p>
                  <p className="text-slate-400 text-sm">Automatically save changes</p>
                </div>
                <button
                  onClick={() => setAutoSave(!autoSave)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    autoSave ? 'bg-indigo-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      autoSave ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Word Wrap */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium">Word Wrap</p>
                  <p className="text-slate-400 text-sm">Wrap long lines automatically</p>
                </div>
                <button className="relative w-14 h-8 rounded-full bg-indigo-600">
                  <span className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full translate-x-6" />
                </button>
              </div>

              {/* Minimap */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium">Show Minimap</p>
                  <p className="text-slate-400 text-sm">Display code minimap on the right</p>
                </div>
                <button className="relative w-14 h-8 rounded-full bg-slate-600">
                  <span className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </section>

          {/* Notifications */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Notifications</h2>
            <div className="space-y-4">
              {/* Push Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-slate-400 text-sm">Receive alerts for room activity</p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`relative w-14 h-8 rounded-full transition-all ${
                    notifications ? 'bg-indigo-600' : 'bg-slate-600'
                  }`}
                >
                  <span
                    className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                      notifications ? 'translate-x-6' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl">
                <div>
                  <p className="font-medium">Email Updates</p>
                  <p className="text-slate-400 text-sm">Receive weekly digest emails</p>
                </div>
                <button className="relative w-14 h-8 rounded-full bg-slate-600">
                  <span className="absolute top-1 left-1 w-6 h-6 bg-white rounded-full" />
                </button>
              </div>
            </div>
          </section>

          {/* Privacy & Security */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-indigo-500/50 transition-all">
                🔒 Two-Factor Authentication
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-indigo-500/50 transition-all">
                🔑 API Keys
              </button>
              <button className="w-full text-left px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:border-indigo-500/50 transition-all">
                🗑️ Delete Account
              </button>
            </div>
          </section>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button className="px-6 py-2 bg-slate-800/50 border border-slate-700/50 rounded-lg font-medium hover:bg-slate-700/50 transition-all">
              Cancel
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
              Save Changes
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Settings;
