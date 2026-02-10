'use client'

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import { useProducts } from '@/lib/ProductContext';
import { Product } from '@/lib/products';
import ThemeToggle from '@/components/ThemeToggle';

// Icons
const Icons = {
  search: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  download: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>,
  plus: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  edit: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
};

type SortField = 'name' | 'category' | 'price' | 'stock';
type SortOrder = 'asc' | 'desc';

export default function Products() {
  const { user, logout } = useAuth();
  const { products, deleteProduct, addProduct, editProduct } = useProducts();
  const router = useRouter();
  
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItemsPerPage, setSelectedItemsPerPage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({ name: '', category: '', price: 0, stock: 0, description: '' });

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
  }, [user, router]);

  const categories = useMemo(() => Array.from(new Set(products.map(p => p.category))), [products]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(term) ||
        p.category.toLowerCase().includes(term)
      );
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];
      if (sortOrder === 'asc') return aVal > bVal ? 1 : -1;
      return aVal < bVal ? 1 : -1;
    });
    return result;
  }, [products, searchTerm, selectedCategory, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredProducts.length / selectedItemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * selectedItemsPerPage,
    currentPage * selectedItemsPerPage
  );

  const stats = useMemo(() => {
    const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.stock < 20).length;
    const categories = Array.from(new Set(products.map(p => p.category))).length;
    return { totalValue, total: products.length, totalProducts, lowStockItems, categories };
  }, [products]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === paginatedProducts.length) {
      setSelectedProducts(new Set());
    } else {
      setSelectedProducts(new Set(paginatedProducts.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedProducts);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedProducts(newSet);
  };

  const handleDeleteSelected = () => {
    selectedProducts.forEach(id => deleteProduct(id));
    setSelectedProducts(new Set());
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Category', 'Price', 'Stock'].join(','),
      ...filteredProducts.map(p => [p.name, p.category, p.price, p.stock].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products.csv';
    a.click();
  };

  const openModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({ name: product.name, category: product.category, price: product.price, stock: product.stock, description: product.description });
    } else {
      setEditingProduct(null);
      setFormData({ name: '', category: '', price: 0, stock: 0, description: '' });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProduct) {
      editProduct(editingProduct.id, formData);
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
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
                  else if (item.id === 'settings') router.push('/settings');
                }}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all duration-300 ${
                  item.id === 'products'
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
          <div className="px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Products</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{filteredProducts.length} items • ${stats.totalValue.toLocaleString()} total value</p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              <button 
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-3 bg-slate-100/80 dark:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200/80 dark:hover:bg-slate-600/80 transition-all duration-300 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
              >
                {Icons.download}
                <span className="hidden sm:inline">Export</span>
              </button>
              <button 
                onClick={() => openModal()}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105"
              >
                {Icons.plus}
                <span className="font-medium">Add Product</span>
              </button>
            </div>
          </div>
        </header>

          <div className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Products', value: stats.totalProducts, change: '+12%', color: 'from-blue-500 to-cyan-500', icon: '📦' },
              { label: 'Total Value', value: `$${stats.totalValue.toLocaleString()}`, change: '+8%', color: 'from-green-500 to-emerald-500', icon: '💰' },
              { label: 'Low Stock Items', value: stats.lowStockItems, change: '-5%', color: 'from-orange-500 to-red-500', icon: '⚠️' },
              { label: 'Categories', value: stats.categories, change: '+2', color: 'from-purple-500 to-pink-500', icon: '📊' },
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                    <p className="text-sm text-green-600 dark:text-green-400 mt-2">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {Icons.search}
                </div>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                />
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg transform scale-105'
                        : 'bg-slate-100/80 dark:bg-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-200/80 dark:hover:bg-slate-600/80 border border-slate-200/50 dark:border-slate-600/50'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedProducts.size > 0 && (
            <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <span className="text-sm text-purple-700 dark:text-purple-300">
                {selectedProducts.size} items selected
              </span>
              <button
                onClick={handleDeleteSelected}
                className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
              >
                {Icons.trash}
                <span>Delete Selected</span>
              </button>
            </div>
          )}

          {/* Products Table */}
          <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50/80 dark:bg-slate-700/50 backdrop-blur-sm">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Category</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Price</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Stock</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="px-6 py-4 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/50 dark:divide-slate-700/50">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/50 transition-colors duration-200">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white">{product.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">{product.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          product.category === 'Grains' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                          product.category === 'Beverages' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                          product.category === 'Oils' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                          product.category === 'Sweeteners' ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400' :
                          product.category === 'Spices' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                          product.category === 'Dairy' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' :
                          product.category === 'Fruits' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                          product.category === 'Nuts' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400'
                        }`}>
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900 dark:text-white">${product.price}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-medium text-slate-900 dark:text-white">{product.stock}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-xl text-xs font-medium ${
                          product.stock < 20
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        }`}>
                          {product.stock < 20 ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openModal(product)}
                            className="p-2 text-blue-600 hover:bg-blue-50/80 dark:hover:bg-blue-900/20 rounded-xl transition-all duration-200"
                          >
                            {Icons.edit}
                          </button>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50/80 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200"
                          >
                            {Icons.trash}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Items per page:</span>
                <select
                  value={selectedItemsPerPage}
                  onChange={(e) => {
                    setSelectedItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm backdrop-blur-sm"
                >
                  {[10, 25, 50].map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm disabled:opacity-50 backdrop-blur-sm transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/80"
                >
                  Previous
                </button>
                <span className="text-sm text-slate-600 dark:text-slate-400 px-3 py-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl text-sm disabled:opacity-50 backdrop-blur-sm transition-all duration-200 hover:bg-slate-100/80 dark:hover:bg-slate-700/80"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Premium Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-2xl transform transition-all duration-300 scale-100 animate-pulse">
              <div className="flex items-center justify-between p-8 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    {Icons.plus}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {editingProduct ? 'Edit Product' : 'Add New Product'}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {editingProduct ? 'Update product information' : 'Create a new product entry'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>📦</span>
                      <span>Product Name</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                      placeholder="Enter product name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>🏷️</span>
                      <span>Category</span>
                    </label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>💰</span>
                      <span>Price ($)</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      <span>📊</span>
                      <span>Stock Quantity</span>
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all"
                      placeholder="0"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    <span>📝</span>
                    <span>Description</span>
                  </label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-700/80 border border-slate-200/50 dark:border-slate-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 backdrop-blur-sm transition-all resize-none"
                    placeholder="Enter product description"
                  />
                </div>
                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-700/50 rounded-xl transition-all duration-200 font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 transform hover:scale-105 font-medium"
                  >
                    {editingProduct ? '💾 Save Changes' : '➕ Add Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
