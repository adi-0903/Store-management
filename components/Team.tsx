'use client'

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { useRouter } from 'next/navigation';
import ThemeToggle from '@/components/ThemeToggle';

// Icons
const Icons = {
  dashboard: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>,
  products: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  analytics: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  settings: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  billing: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  logout: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  plus: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  edit: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  trash: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  mail: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  phone: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
};

export default function Team() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);
  const [teamMembers, setTeamMembers] = useState([
    {
      id: '1',
      name: 'John Smith',
      email: 'john@slooze.com',
      role: 'Manager',
      department: 'Management',
      status: 'Active',
      avatar: 'JS',
      joinDate: '2023-01-15',
      phone: '+1 234-567-8900',
      managedBy: null, // Managers are not managed by anyone
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      email: 'sarah@slooze.com',
      role: 'Store Keeper',
      department: 'Operations',
      status: 'Active',
      avatar: 'SJ',
      joinDate: '2023-03-20',
      phone: '+1 234-567-8901',
      managedBy: '1', // Managed by John Smith (Manager)
    },
    {
      id: '3',
      name: 'Mike Wilson',
      email: 'mike@slooze.com',
      role: 'Store Keeper',
      department: 'Operations',
      status: 'Active',
      avatar: 'MW',
      joinDate: '2023-06-10',
      phone: '+1 234-567-8902',
      managedBy: '1', // Managed by John Smith (Manager)
    },
    {
      id: '4',
      name: 'Emily Davis',
      email: 'emily@slooze.com',
      role: 'Manager',
      department: 'Management',
      status: 'Away',
      avatar: 'ED',
      joinDate: '2023-02-28',
      phone: '+1 234-567-8903',
      managedBy: null,
    },
    {
      id: '5',
      name: 'James Brown',
      email: 'james@slooze.com',
      role: 'Store Worker',
      department: 'Operations',
      status: 'Active',
      avatar: 'JB',
      joinDate: '2023-08-15',
      phone: '+1 234-567-8904',
      managedBy: '2', // Managed by Sarah Johnson (Store Keeper)
    },
    {
      id: '6',
      name: 'Lisa Garcia',
      email: 'lisa@slooze.com',
      role: 'Store Worker',
      department: 'Operations',
      status: 'Active',
      avatar: 'LG',
      joinDate: '2023-09-10',
      phone: '+1 234-567-8905',
      managedBy: '2', // Managed by Sarah Johnson (Store Keeper)
    },
    {
      id: '7',
      name: 'Tom Martinez',
      email: 'tom@slooze.com',
      role: 'Store Worker',
      department: 'Operations',
      status: 'Active',
      avatar: 'TM',
      joinDate: '2023-10-05',
      phone: '+1 234-567-8906',
      managedBy: '3', // Managed by Mike Wilson (Store Keeper)
    },
    {
      id: '8',
      name: 'Carlos Rodriguez',
      email: 'carlos@slooze.com',
      role: 'Sweeper',
      department: 'Operations',
      status: 'Active',
      avatar: 'CR',
      joinDate: '2023-11-10',
      phone: '+1 234-567-8907',
      managedBy: '2', // Managed by Sarah Johnson (Store Keeper)
    },
    {
      id: '9',
      name: 'Maria Chen',
      email: 'maria@slooze.com',
      role: 'Cleaner',
      department: 'Operations',
      status: 'Active',
      avatar: 'MC',
      joinDate: '2023-12-01',
      phone: '+1 234-567-8908',
      managedBy: '3', // Managed by Mike Wilson (Store Keeper)
    },
    {
      id: '10',
      name: 'Robert Johnson',
      email: 'robert@slooze.com',
      role: 'Security Guard',
      department: 'Operations',
      status: 'Active',
      avatar: 'RJ',
      joinDate: '2024-01-15',
      phone: '+1 234-567-8909',
      managedBy: '2', // Managed by Sarah Johnson (Store Keeper)
    },
    {
      id: '11',
      name: 'Amanda White',
      email: 'amanda@slooze.com',
      role: 'Cashier',
      department: 'Operations',
      status: 'Active',
      avatar: 'AW',
      joinDate: '2024-02-01',
      phone: '+1 234-567-8910',
      managedBy: '3', // Managed by Mike Wilson (Store Keeper)
    },
    {
      id: '12',
      name: 'David Lee',
      email: 'david@slooze.com',
      role: 'Stock Clerk',
      department: 'Operations',
      status: 'Active',
      avatar: 'DL',
      joinDate: '2024-02-15',
      phone: '+1 234-567-8911',
      managedBy: '2', // Managed by Sarah Johnson (Store Keeper)
    },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Store Worker',
    department: 'Operations',
    phone: '',
  });

  // Get current user's team member data
  const currentUserMember = teamMembers.find(m => m.email === user?.email);

  // Filter team members based on user role
  const filteredTeamMembers = useMemo(() => {
    if (!currentUserMember) return [];
    
    if (currentUserMember.role === 'Manager') {
      // Managers can see everyone
      return teamMembers;
    } else if (currentUserMember.role === 'Store Keeper') {
      // Store Keepers can see themselves and their assigned workers
      return teamMembers.filter(m => 
        m.managedBy === currentUserMember.id || m.id === currentUserMember.id
      );
    } else if (currentUserMember.role === 'Cashier') {
      // Cashiers can only see themselves
      return teamMembers.filter(m => m.id === currentUserMember.id);
    } else {
      // Other roles cannot see anyone (shouldn't happen with current auth)
      return [];
    }
  }, [teamMembers, currentUserMember]);

  // Check if current user can add new members
  const canAddMembers = currentUserMember?.role === 'Manager' || currentUserMember?.role === 'Store Keeper';

  // Get available roles based on current user's role
  const getAvailableRoles = () => {
    if (currentUserMember?.role === 'Manager') {
      return ['Manager', 'Store Keeper', 'Store Worker', 'Sweeper', 'Cleaner', 'Security Guard', 'Cashier', 'Stock Clerk'];
    } else if (currentUserMember?.role === 'Store Keeper') {
      return ['Store Worker', 'Sweeper', 'Cleaner', 'Security Guard', 'Cashier', 'Stock Clerk'];
    }
    return [];
  };

  useEffect(() => {
    setMounted(true);
    if (!user) router.push('/login');
  }, [user, router]);

  const openModal = (member?: any) => {
    if (member) {
      setEditingMember(member);
      setFormData({
        name: member.name,
        email: member.email,
        role: member.role,
        department: member.department,
        phone: member.phone,
      });
    } else {
      setEditingMember(null);
      setFormData({ 
        name: '', 
        email: '', 
        role: 'Store Worker', 
        department: 'Operations', 
        phone: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      setTeamMembers(members =>
        members.map(m =>
          m.id === editingMember.id
            ? { ...m, ...formData, avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase() }
            : m
        )
      );
    } else {
      const newMember = {
        id: Date.now().toString(),
        ...formData,
        status: 'Active',
        avatar: formData.name.split(' ').map(n => n[0]).join('').toUpperCase(),
        joinDate: new Date().toISOString().split('T')[0],
        managedBy: currentUserMember?.role === 'Store Keeper' ? currentUserMember.id : 
                   currentUserMember?.role === 'Manager' && formData.role === 'Store Keeper' ? null :
                   currentUserMember?.id || null, // Ensure it's never undefined
      };
      setTeamMembers([...teamMembers, newMember]);
    }
    setIsModalOpen(false);
  };

  const deleteMember = (id: string) => {
    setTeamMembers(members => members.filter(m => m.id !== id));
  };

  const stats = {
    total: filteredTeamMembers.length,
    active: filteredTeamMembers.filter(m => m.status === 'Active').length,
    managers: filteredTeamMembers.filter(m => m.role === 'Manager').length,
    departments: Array.from(new Set(filteredTeamMembers.map(m => m.department))).length,
  };

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
                  else if (item.id === 'settings') router.push('/settings');
                }}
                className={`w-full flex items-center justify-center p-3 rounded-xl transition-all ${
                  item.id === 'users'
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
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Team</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Manage your team members</p>
            </div>
            <div className="flex items-center space-x-3">
              <ThemeToggle />
              {canAddMembers && (
                <button
                  onClick={() => openModal()}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  {Icons.plus}
                  <span>Add Member</span>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'Total Members', value: stats.total, color: 'from-blue-500 to-cyan-500' },
              { label: 'Active Now', value: stats.active, color: 'from-green-500 to-emerald-500' },
              { label: 'Managers', value: stats.managers, color: 'from-purple-500 to-pink-500' },
              { label: 'Departments', value: stats.departments, color: 'from-orange-500 to-red-500' },
            ].map((stat, index) => (
              <div key={stat.label} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{stat.label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    {Icons.users}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Members */}
        <div className="px-6 pb-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 dark:bg-slate-700/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Member</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Role</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Department</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700 dark:text-slate-300">Join Date</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-slate-700 dark:text-slate-300">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {filteredTeamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                            {member.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-slate-900 dark:text-white">{member.name}</p>
                            <div className="flex items-center space-x-2 text-xs text-slate-500">
                              <span className="flex items-center space-x-1">
                                {Icons.mail}
                                <span>{member.email}</span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          member.role === 'Manager'
                            ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                            : member.role === 'Store Keeper'
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                            : member.role === 'Store Worker'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : member.role === 'Sweeper'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : member.role === 'Cleaner'
                            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                            : member.role === 'Security Guard'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                            : member.role === 'Cashier'
                            ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                            : member.role === 'Stock Clerk'
                            ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{member.department}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                          member.status === 'Active'
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                        }`}>
                          {member.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">{member.joinDate}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {canAddMembers && (
                            <>
                              <button
                                onClick={() => openModal(member)}
                                className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                              >
                                {Icons.edit}
                              </button>
                              <button
                                onClick={() => deleteMember(member.id)}
                                className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                              >
                                {Icons.trash}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg animate-scale-in">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingMember ? 'Edit Team Member' : 'Add New Member'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  >
                    {getAvailableRoles().map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Department</label>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                />
              </div>
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                >
                  {editingMember ? 'Save Changes' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
