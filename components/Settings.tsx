'use client'

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

// Premium Icons
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  save: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
  bell: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  lock: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>,
  globe: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  database: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" /></svg>,
  shield: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  zap: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
  cloud: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>,
  creditCard: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>,
  userCheck: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10l-2 2m0 0l-2-2m2 2v-3" /></svg>,
  mail: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  smartphone: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  monitor: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  moon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>,
  sun: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  checkCircle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  alertCircle: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  info: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
};

export default function Settings() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    companyName: 'Slooze Careers',
    email: user?.email || '',
    language: 'en',
    timezone: 'UTC',
    notifications: true,
    twoFactor: false,
    autoBackup: true,
    dataRetention: '365',
    theme: 'light',
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    marketingEmails: false,
    securityAlerts: true,
    weeklyReports: true,
    monthlyReports: false,
  });

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
  }, [user, router]);

  const handleSave = () => {
    console.log('Settings saved:', formData);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Icons.globe, color: 'from-blue-500 to-cyan-500' },
    { id: 'security', label: 'Security', icon: Icons.shield, color: 'from-green-500 to-emerald-500' },
    { id: 'notifications', label: 'Notifications', icon: Icons.bell, color: 'from-purple-500 to-pink-500' },
    { id: 'data', label: 'Data Management', icon: Icons.database, color: 'from-orange-500 to-red-500' },
    { id: 'billing', label: 'Billing', icon: Icons.creditCard, color: 'from-indigo-500 to-blue-500' },
    { id: 'appearance', label: 'Appearance', icon: Icons.moon, color: 'from-pink-500 to-rose-500' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20 flex">
      {/* Static Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
              <img src="/FFFFFF-1.png" alt="Slooze" className="w-6 h-auto" />
            </div>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1">
            {[
              { id: 'dashboard', icon: Icons.dashboard, requiredRole: 'Manager' },
              { id: 'products', icon: Icons.products },
              { id: 'billing', icon: Icons.billing, requiredRole: 'Cashier' },
              { id: 'analytics', icon: Icons.analytics, requiredRole: 'Manager' },
              { id: 'users', icon: Icons.users },
              { id: 'settings', icon: Icons.settings },
            ]
            .filter(item => {
              if (item.requiredRole && user.role === item.requiredRole) return true;
              if (!item.requiredRole) return true;
              return false;
            })
            .map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'dashboard') router.push('/dashboard');
                  else if (item.id === 'products') router.push('/products');
                  else if (item.id === 'billing') router.push('/billing');
                  else if (item.id === 'analytics') router.push('/analytics');
                  else if (item.id === 'users') router.push('/team');
                }}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                  item.id === 'settings'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 hover:scale-105'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 transition-all duration-300 hover:scale-105"
            >
              {Icons.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Settings</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your application preferences and configuration</p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
              >
                {Icons.save}
                <span className="font-medium">Save Changes</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Premium Tabs */}
          <div className="flex space-x-1 mb-8 bg-white/60 dark:bg-slate-800/60 backdrop-blur-lg p-2 rounded-2xl shadow-xl border border-slate-200/50 dark:border-slate-700/50 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  activeTab === tab.id
                    ? `bg-gradient-to-r ${tab.color} text-white shadow-lg transform scale-105`
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <div className={`p-2 rounded-lg ${
                  activeTab === tab.id 
                    ? 'bg-white/20 backdrop-blur-sm' 
                    : 'bg-slate-100 dark:bg-slate-700'
                }`}>
                  {tab.icon}
                </div>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 dark:border-slate-700/50 p-8">
            {activeTab === 'general' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                    {Icons.globe}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">General Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400">Configure your basic application preferences</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {Icons.userCheck}
                      <span>Company Name</span>
                    </label>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      {Icons.mail}
                      <span>Email Address</span>
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>🌐</span>
                      <span>Language</span>
                    </label>
                    <select
                      value={formData.language}
                      onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    >
                      <option value="en">English</option>
                      <option value="es">Spanish</option>
                      <option value="fr">French</option>
                      <option value="de">German</option>
                      <option value="ja">Japanese</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>🕐</span>
                      <span>Timezone</span>
                    </label>
                    <select
                      value={formData.timezone}
                      onChange={(e) => setFormData({ ...formData, timezone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    >
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                      <option value="GMT">Greenwich Mean Time</option>
                      <option value="CET">Central European Time</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>💰</span>
                      <span>Currency</span>
                    </label>
                    <select
                      value={formData.currency}
                      onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="JPY">JPY - Japanese Yen</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>📅</span>
                      <span>Date Format</span>
                    </label>
                    <select
                      value={formData.dateFormat}
                      onChange={(e) => setFormData({ ...formData, dateFormat: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30">
                    {Icons.shield}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Security Settings</h2>
                    <p className="text-slate-500 dark:text-slate-400">Protect your account with advanced security features</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-green-500/20 rounded-xl">
                          {Icons.lock}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">Two-Factor Authentication</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Add an extra layer of security to your account</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, twoFactor: !formData.twoFactor })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          formData.twoFactor ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            formData.twoFactor ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          {Icons.smartphone}
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Connected Devices</h3>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs">
                              💻
                            </div>
                            <div>
                              <p className="text-sm font-medium">MacBook Pro</p>
                              <p className="text-xs text-slate-500">Chrome • New York</p>
                            </div>
                          </div>
                          <span className="text-xs text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-lg">Current</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white dark:bg-slate-800 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white text-xs">
                              📱
                            </div>
                            <div>
                              <p className="text-sm font-medium">iPhone 14</p>
                              <p className="text-xs text-slate-500">Safari • New York</p>
                            </div>
                          </div>
                          <button className="text-xs text-red-600 hover:text-red-700">Remove</button>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                          {Icons.zap}
                        </div>
                        <h3 className="font-semibold text-slate-900 dark:text-white">Security Score</h3>
                      </div>
                      <div className="text-center">
                        <div className="relative w-32 h-32 mx-auto mb-4">
                          <svg className="w-32 h-32 transform -rotate-90">
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" className="text-slate-200 dark:text-slate-700" />
                            <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="none" strokeDasharray={`${2 * Math.PI * 56 * 0.85} ${2 * Math.PI * 56}`} className="text-green-500" />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">85%</span>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Your account is well protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30">
                    {Icons.bell}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                    <p className="text-slate-500 dark:text-slate-400">Control how and when you receive notifications</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-purple-500/20 rounded-xl">
                        {Icons.mail}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Email Notifications</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Receive updates via email</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, emailNotifications: !formData.emailNotifications })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          formData.emailNotifications ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            formData.emailNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-blue-500/20 rounded-xl">
                        {Icons.smartphone}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Push Notifications</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Get instant alerts</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, pushNotifications: !formData.pushNotifications })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          formData.pushNotifications ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            formData.pushNotifications ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-green-500/20 rounded-xl">
                        {Icons.checkCircle}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Security Alerts</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Important security updates</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, securityAlerts: !formData.securityAlerts })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          formData.securityAlerts ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            formData.securityAlerts ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-orange-500/20 rounded-xl">
                        {Icons.alertCircle}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Marketing Emails</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Promotional content</p>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, marketingEmails: !formData.marketingEmails })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          formData.marketingEmails ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            formData.marketingEmails ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'data' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 text-white shadow-lg shadow-orange-500/30">
                    {Icons.database}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Data Management</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your data storage and retention policies</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-blue-500/20 rounded-xl">
                          {Icons.cloud}
                        </div>
                        <div>
                          <h3 className="font-semibold text-slate-900 dark:text-white">Auto Backup</h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400">Automatically backup your data daily</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFormData({ ...formData, autoBackup: !formData.autoBackup })}
                        className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 ${
                          formData.autoBackup ? 'bg-gradient-to-r from-blue-500 to-cyan-500' : 'bg-slate-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                            formData.autoBackup ? 'translate-x-7' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                        {Icons.info}
                        <span>Data Retention Period (days)</span>
                      </label>
                      <input
                        type="number"
                        value={formData.dataRetention}
                        onChange={(e) => setFormData({ ...formData, dataRetention: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                      />
                    </div>

                    <div className="p-6 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                      <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Storage Usage</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Used</span>
                          <span className="font-medium text-slate-900 dark:text-white">2.4 GB</span>
                        </div>
                        <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full w-3/5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-600 dark:text-slate-400">Available</span>
                          <span className="font-medium text-slate-900 dark:text-white">1.6 GB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'billing' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30">
                    {Icons.creditCard}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Subscription</h2>
                    <p className="text-slate-500 dark:text-slate-400">Manage your subscription and payment methods</p>
                  </div>
                </div>
                
                <div className="p-6 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-2xl border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Professional Plan</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400">$29/month • Billed monthly</p>
                    </div>
                    <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm font-medium">Active</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">∞</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Products</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">10</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Team Members</p>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl">
                      <p className="text-2xl font-bold text-slate-900 dark:text-white">100GB</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Storage</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-8">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-500/30">
                    {Icons.moon}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Appearance</h2>
                    <p className="text-slate-500 dark:text-slate-400">Customize the look and feel of your application</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 rounded-2xl border border-pink-200 dark:border-pink-800">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-pink-500/20 rounded-xl">
                        {formData.theme === 'dark' ? Icons.moon : Icons.sun}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-white">Theme</h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Choose your preferred theme</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => setFormData({ ...formData, theme: 'light' })}
                        className={`flex-1 p-3 rounded-xl transition-all ${
                          formData.theme === 'light'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {Icons.sun}
                        <span className="ml-2">Light</span>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, theme: 'dark' })}
                        className={`flex-1 p-3 rounded-xl transition-all ${
                          formData.theme === 'dark'
                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {Icons.moon}
                        <span className="ml-2">Dark</span>
                      </button>
                    </div>
                  </div>

                  <div className="p-6 bg-slate-50/50 dark:bg-slate-700/50 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="p-2 bg-purple-500/20 rounded-lg">
                        {Icons.monitor}
                      </div>
                      <h3 className="font-semibold text-slate-900 dark:text-white">Device Preview</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <button className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        {Icons.monitor}
                      </button>
                      <button className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        {Icons.smartphone}
                      </button>
                      <button className="p-3 bg-white dark:bg-slate-800 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
