'use client'

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  // Demo users for quick login
  const demoUsers = [
    { name: 'John Smith', email: 'john@slooze.com', role: 'Manager', password: 'password123' },
    { name: 'Emily Davis', email: 'emily@slooze.com', role: 'Manager', password: 'password123' },
    { name: 'Sarah Johnson', email: 'sarah@slooze.com', role: 'Store Keeper', password: 'password123' },
    { name: 'Mike Wilson', email: 'mike@slooze.com', role: 'Store Keeper', password: 'password123' },
    { name: 'Amanda White', email: 'amanda@slooze.com', role: 'Cashier', password: 'password123' },
  ];

  // Floating particles animation
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 10,
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    // Simulate network delay for premium feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const success = await login(email, password);
    if (success) {
      router.push('/dashboard');
    } else {
      setError('Invalid credentials');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Particles */}
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute bg-white/20 rounded-full animate-float"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              bottom: '-10px',
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div 
          className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20"
          style={{
            boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          }}
        >
          {/* Logo Section */}
          <div className="text-center mb-8">
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-xl opacity-50 animate-pulse" />
              <img 
                className="relative mx-auto h-16 w-auto drop-shadow-lg transform hover:scale-110 transition-transform duration-300" 
                src="/FFFFFF-1.png" 
                alt="Slooze" 
              />
            </div>
            <h2 className="mt-6 text-3xl font-bold bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Welcome Back
            </h2>
            <p className="mt-2 text-sm text-white/60">
              Sign in to manage your commodities
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="relative group">
              <label 
                htmlFor="email" 
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === 'email' || email 
                    ? '-top-2 text-xs text-purple-300 bg-slate-900/50 px-2 rounded' 
                    : 'top-3.5 text-sm text-white/50'
                }`}
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/10"
              />
              <div className="absolute right-4 top-3.5 text-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
            </div>

            {/* Password Field */}
            <div className="relative group">
              <label 
                htmlFor="password" 
                className={`absolute left-4 transition-all duration-300 pointer-events-none ${
                  focusedField === 'password' || password 
                    ? '-top-2 text-xs text-purple-300 bg-slate-900/50 px-2 rounded' 
                    : 'top-3.5 text-sm text-white/50'
                }`}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-transparent focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 transition-all duration-300 hover:bg-white/10"
              />
              <div className="absolute right-4 top-3.5 text-white/30">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 text-red-400 text-sm animate-shake">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
              {/* Button Shine Effect */}
              <div className="absolute inset-0 -translate-x-full group-hover:animate-shine bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </div>
              ) : (
                <span className="relative flex items-center space-x-2">
                  <span>Sign in</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              )}
            </button>
          </form>

          {/* Demo Credentials Dropdown */}
          <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-white/40">Quick Login</p>
              <svg className="w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <select 
              onChange={(e) => {
                const selectedUser = demoUsers.find(u => u.email === e.target.value);
                if (selectedUser) {
                  setEmail(selectedUser.email);
                  setPassword(selectedUser.password);
                }
              }}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400/20 transition-all"
            >
              <option value="" className="bg-slate-800">Select User...</option>
              <optgroup label="Managers" className="bg-slate-800 text-purple-300">
                {demoUsers.filter(u => u.role === 'Manager').map(user => (
                  <option key={user.email} value={user.email} className="bg-slate-800">
                    {user.name} - {user.role}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Store Keepers" className="bg-slate-800 text-blue-300">
                {demoUsers.filter(u => u.role === 'Store Keeper').map(user => (
                  <option key={user.email} value={user.email} className="bg-slate-800">
                    {user.name} - {user.role}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Cashier" className="bg-slate-800 text-pink-300">
                {demoUsers.filter(u => u.role === 'Cashier').map(user => (
                  <option key={user.email} value={user.email} className="bg-slate-800">
                    {user.name} - {user.role}
                  </option>
                ))}
              </optgroup>
            </select>
            <p className="text-xs text-white/30 mt-2 text-center">Password: password123</p>
          </div>
        </div>

        {/* Bottom Text */}
        <p className="mt-6 text-center text-sm text-white/40">
          © 2026 Slooze. All rights reserved.
        </p>
      </div>
    </div>
  );
}
