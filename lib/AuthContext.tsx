'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  role: 'Manager' | 'Store Keeper' | 'Cashier';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication with only Managers, Store Keepers, and Cashier
    const users: User[] = [
      { id: '1', email: 'john@slooze.com', role: 'Manager' },
      { id: '2', email: 'sarah@slooze.com', role: 'Store Keeper' },
      { id: '3', email: 'mike@slooze.com', role: 'Store Keeper' },
      { id: '4', email: 'emily@slooze.com', role: 'Manager' },
      { id: '11', email: 'amanda@slooze.com', role: 'Cashier' },
    ];

    const foundUser = users.find(u => u.email === email);
    if (foundUser && password === 'password123') { // Updated password
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
