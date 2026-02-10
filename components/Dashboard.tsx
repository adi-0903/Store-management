'use client'

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/lib/ProductContext';
import ThemeToggle from '@/components/ThemeToggle';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

// Icons
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  trendUp: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
  trendDown: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" /></svg>,
  notification: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>,
  dollar: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  package: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  alert: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  category: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>,
};

const generateSalesData = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(month => ({
    name: month,
    sales: Math.floor(Math.random() * 15000) + 5000,
    profit: Math.floor(Math.random() * 8000) + 2000,
  }));
};

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
    else if (user.role !== 'Manager') router.push('/products');
  }, [user, router]);

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
    const categories = Array.from(new Set(products.map(p => p.category)));
    return {
      totalProducts: products.length,
      totalValue,
      totalStock,
      categories: categories.length,
      lowStockItems: products.filter(p => p.stock < 20).length,
    };
  }, [products]);

  const salesData = useMemo(() => generateSalesData(), []);

  const categoryData = useMemo(() => {
    const distribution: Record<string, number> = {};
    products.forEach(p => { distribution[p.category] = (distribution[p.category] || 0) + p.stock; });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [products]);

  const topProducts = useMemo(() => {
    return [...products].map(p => ({ ...p, totalValue: p.price * p.stock }))
      .sort((a, b) => b.totalValue - a.totalValue).slice(0, 5);
  }, [products]);

  const recentActivity = [
    { id: 1, action: 'Added new product', item: 'Organic Honey', time: '5 min ago' },
    { id: 2, action: 'Updated stock', item: 'Rice', time: '20 min ago' },
    { id: 3, action: 'Price changed', item: 'Olive Oil', time: '1 hour ago' },
    { id: 4, action: 'New order #1234', item: '$450.00', time: '2 hours ago' },
    { id: 5, action: 'Low stock alert', item: 'Coffee Beans', time: '3 hours ago' },
  ];

  if (!user || user.role !== 'Manager') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/20 to-pink-50/20 dark:from-slate-900 dark:via-purple-900/20 dark:to-pink-900/20 flex">
      {/* Static Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      {/* Sidebar */}
      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 z-40 h-screen transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-20'} bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-r border-slate-200/50 dark:border-slate-700/50`}>
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-slate-200/50 dark:border-slate-700/50">
            <div className={`relative transition-all duration-300 ${sidebarOpen ? 'w-32' : 'w-10'}`}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <img src="/FFFFFF-1.png" alt="Slooze" className="w-6 h-auto" />
              </div>
            </div>
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: Icons.dashboard, requiredRole: 'Manager' },
              { id: 'products', label: 'Products', icon: Icons.products, onClick: () => router.push('/products') },
              { id: 'billing', label: 'Billing', icon: Icons.billing, onClick: () => router.push('/billing'), requiredRole: 'Cashier' },
              { id: 'analytics', label: 'Analytics', icon: Icons.analytics, onClick: () => router.push('/analytics'), requiredRole: 'Manager' },
              { id: 'users', label: 'Team', icon: Icons.users, onClick: () => router.push('/team') },
              { id: 'settings', label: 'Settings', icon: Icons.settings, onClick: () => router.push('/settings') },
            ]
            .filter(item => {
              if (item.requiredRole && user.role === item.requiredRole) return true;
              if (!item.requiredRole) return true;
              return false;
            })
            .map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); item.onClick?.(); }}
                className={`w-full flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-300 ${activeTab === item.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 scale-105' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-700/80 hover:scale-105'}`}>
                {item.icon}
                {sidebarOpen && <span className="font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200/50 dark:border-slate-700/50">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="w-full flex items-center justify-center p-3 rounded-xl text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 transition-all duration-300 hover:scale-105">
              <svg className={`w-5 h-5 transform transition-transform ${sidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" /></svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Dashboard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Welcome back, {user.email.split('@')[0]}</p>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="p-3 rounded-xl text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 relative transition-all duration-300 hover:scale-105">
                {Icons.notification}
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
              </button>
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/30">
                {user.email[0].toUpperCase()}
              </div>
              <button onClick={logout} className="p-3 text-slate-500 hover:text-red-500 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-all duration-300 hover:scale-105">{Icons.logout}</button>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Products', value: stats.totalProducts, change: '+12%', icon: '📦', color: 'from-blue-500 to-cyan-500', trend: 'up' },
              { label: 'Inventory Value', value: `$${stats.totalValue.toLocaleString()}`, change: '+8.2%', icon: '💰', color: 'from-purple-500 to-pink-500', trend: 'up' },
              { label: 'Categories', value: stats.categories, change: '+2', icon: '📊', color: 'from-green-500 to-emerald-500', trend: 'up' },
              { label: 'Low Stock Alert', value: stats.lowStockItems, change: stats.lowStockItems > 0 ? 'Action needed' : 'All good', icon: '⚠️', color: stats.lowStockItems > 0 ? 'from-orange-500 to-red-500' : 'from-green-500 to-emerald-500', trend: stats.lowStockItems > 0 ? 'down' : 'up' },
            ].map((stat, index) => (
              <div key={stat.label} className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    <div className="flex items-center mt-2 space-x-1">
                      <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>{stat.trend === 'up' ? Icons.trendUp : Icons.trendDown}</span>
                      <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>{stat.change}</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sales Chart */}
            <div className={`lg:col-span-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Revenue Overview</h3>
                <select className="px-4 py-2 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 text-sm border border-slate-200/50 dark:border-slate-600/50 backdrop-blur-sm outline-none focus:ring-2 focus:ring-purple-500/50">
                  <option>Last 6 Months</option>
                  <option>Last Year</option>
                </select>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/><stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/></linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/><stop offset="95%" stopColor="#ec4899" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                    <Area type="monotone" dataKey="sales" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorSales)" name="Revenue ($)" />
                    <Area type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={3} fill="url(#colorProfit)" name="Profit ($)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Pie Chart */}
            <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.5s' }}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Category Distribution</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 space-y-3">
                {categoryData.slice(0, 4).map((cat, index) => (
                  <div key={cat.name} className="flex items-center justify-between text-sm p-2 rounded-xl bg-slate-50/50 dark:bg-slate-700/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium">{cat.name}</span>
                    </div>
                    <span className="font-semibold text-slate-900 dark:text-white">{cat.value} units</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Products */}
            <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Top Products by Value</h3>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg">{index + 1}</div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{product.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">${product.totalValue.toLocaleString()}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{product.stock} units</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.7s' }}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Recent Activity</h3>
              <div className="space-y-4 max-h-64 overflow-y-auto">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50/50 dark:bg-slate-700/50 hover:bg-slate-100/50 dark:hover:bg-slate-600/50 transition-all duration-200">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-2 shadow-sm" />
                    <div className="flex-1">
                      <p className="text-sm text-slate-900 dark:text-white"><span className="font-semibold">{activity.action}</span></p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{activity.item} • {activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className={`bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50 ${mounted ? 'animate-slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button onClick={() => router.push('/products')} className="w-full flex items-center space-x-3 p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                  <span className="font-semibold">Add New Product</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 border border-slate-200/50 dark:border-slate-600/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                  <span className="font-medium">Export Report</span>
                </button>
                <button className="w-full flex items-center space-x-3 p-4 rounded-xl bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-200 border border-slate-200/50 dark:border-slate-600/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                  <span className="font-medium">Low Stock Items ({stats.lowStockItems})</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
