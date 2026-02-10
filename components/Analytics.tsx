'use client'

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/lib/ProductContext';
import ThemeToggle from '@/components/ThemeToggle';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts';

// Icons
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  download: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
};

const COLORS = ['#8b5cf6', '#ec4899', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

export default function Analytics() {
  const { user, logout } = useAuth();
  const { products } = useProducts();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [timeRange, setTimeRange] = useState('6months');

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
  }, [user, router]);

  // Generate mock analytics data
  const salesData = useMemo(() => {
    const months = timeRange === '6months' 
      ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
      : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    return months.map(month => ({
      name: month,
      revenue: Math.floor(Math.random() * 50000) + 20000,
      profit: Math.floor(Math.random() * 20000) + 8000,
      orders: Math.floor(Math.random() * 500) + 200,
      customers: Math.floor(Math.random() * 200) + 100,
    }));
  }, [timeRange]);

  const categoryData = useMemo(() => {
    const distribution: Record<string, number> = {};
    products.forEach(p => {
      distribution[p.category] = (distribution[p.category] || 0) + p.stock;
    });
    return Object.entries(distribution).map(([name, value]) => ({ name, value }));
  }, [products]);

  const performanceData = useMemo(() => {
    return [
      { name: 'Product A', sales: 4000, target: 3500 },
      { name: 'Product B', sales: 3000, target: 3200 },
      { name: 'Product C', sales: 2000, target: 2100 },
      { name: 'Product D', sales: 2780, target: 2400 },
      { name: 'Product E', sales: 1890, target: 2200 },
    ];
  }, []);

  const topProducts = useMemo(() => {
    return [...products]
      .map(p => ({ ...p, totalValue: p.price * p.stock }))
      .sort((a, b) => b.totalValue - a.totalValue)
      .slice(0, 5);
  }, [products]);

  const stats = useMemo(() => {
    const totalRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
    const totalProfit = salesData.reduce((sum, d) => sum + d.profit, 0);
    const totalOrders = salesData.reduce((sum, d) => sum + d.orders, 0);
    const totalCustomers = salesData.reduce((sum, d) => sum + d.customers, 0);
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    
    return {
      totalRevenue,
      totalProfit,
      totalOrders,
      totalCustomers,
      avgOrderValue,
      profitMargin: totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0,
    };
  }, [salesData]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700">
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center justify-center border-b border-slate-200 dark:border-slate-700">
            <img src="/FFFFFF-1.png" alt="Slooze" className="w-10 h-auto" />
          </div>
          <nav className="flex-1 py-6 px-3 space-y-1">
            {[
              { id: 'dashboard', icon: Icons.dashboard },
              { id: 'products', icon: Icons.products },
              { id: 'analytics', icon: Icons.analytics },
              { id: 'users', icon: Icons.users },
              { id: 'settings', icon: Icons.settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  if (item.id === 'dashboard') router.push('/dashboard');
                  else if (item.id === 'products') router.push('/products');
                  else if (item.id === 'users') router.push('/team');
                  else if (item.id === 'settings') router.push('/settings');
                }}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${
                  item.id === 'analytics'
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                {item.icon}
              </button>
            ))}
          </nav>
          <div className="p-3 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={logout}
              className="w-full flex items-center justify-center p-3 rounded-xl text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
            >
              {Icons.logout}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-20">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-700">
          <div className="px-6 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Deep insights into your business performance</p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm"
              >
                <option value="6months">Last 6 Months</option>
                <option value="1year">Last Year</option>
              </select>
              <ThemeToggle />
              <button className="flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-all">
                {Icons.download}
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Revenue', value: `$${stats.totalRevenue.toLocaleString()}`, change: '+12.5%', color: 'from-green-500 to-emerald-500' },
              { label: 'Total Profit', value: `$${stats.totalProfit.toLocaleString()}`, change: '+8.2%', color: 'from-purple-500 to-pink-500' },
              { label: 'Total Orders', value: stats.totalOrders.toLocaleString(), change: '+15.3%', color: 'from-blue-500 to-cyan-500' },
              { label: 'Customers', value: stats.totalCustomers.toLocaleString(), change: '+6.7%', color: 'from-orange-500 to-red-500' },
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Revenue & Profit Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Revenue & Profit Trends</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesData}>
                    <defs>
                      <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ec4899" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#ec4899" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fill="url(#colorRevenue)" name="Revenue" />
                    <Area type="monotone" dataKey="profit" stroke="#ec4899" strokeWidth={3} fill="url(#colorProfit)" name="Profit" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Distribution */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Category Distribution</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Performance & Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Sales Performance</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                    <Bar dataKey="sales" fill="#8b5cf6" name="Actual Sales" />
                    <Bar dataKey="target" fill="#ec4899" name="Target" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Orders & Customers */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Orders & Customers</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={salesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#fff' }} />
                    <Legend />
                    <Line type="monotone" dataKey="orders" stroke="#3b82f6" strokeWidth={3} name="Orders" />
                    <Line type="monotone" dataKey="customers" stroke="#10b981" strokeWidth={3} name="Customers" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-6">Top Products by Value</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {topProducts.map((product, index) => (
                <div key={product.id} className="text-center">
                  <div className="w-16 h-16 mx-auto rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl mb-3">
                    📦
                  </div>
                  <h4 className="font-medium text-slate-900 dark:text-white">{product.name}</h4>
                  <p className="text-sm text-slate-500">{product.category}</p>
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-2">
                    ${product.totalValue.toLocaleString()}
                  </p>
                  <p className="text-xs text-slate-500">{product.stock} units</p>
                </div>
              ))}
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Average Order Value</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">${stats.avgOrderValue.toFixed(2)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+5.2% from last month</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Profit Margin</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{stats.profitMargin.toFixed(1)}%</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2">+2.1% from last month</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Conversion Rate</h3>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">3.2%</p>
              <p className="text-sm text-red-600 dark:text-red-400 mt-2">-0.5% from last month</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
