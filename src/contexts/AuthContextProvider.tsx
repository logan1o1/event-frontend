import React, { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import type { User, Admin } from '../types';

interface AuthContextProviderProps {
  children: React.ReactNode;
}

export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedAdmin = localStorage.getItem('admin');

    if (storedToken) {
      setToken(storedToken);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      if (storedAdmin) {
        setAdmin(JSON.parse(storedAdmin));
      }
    }
  }, []);

  const isUserLoggedIn = !!user && !!token;
  const isAdminLoggedIn = !!admin && !!token;

  const userLogin = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('token', token);
  };

  const adminLogin = (admin: Admin, token: string) => {
    setAdmin(admin);
    setToken(token);
    localStorage.setItem('admin', JSON.stringify(admin));
    localStorage.setItem('token', token);
  };

  const userLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const adminLogout = () => {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  const logout = () => {
    setUser(null);
    setAdmin(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    localStorage.removeItem('token');
  };

  const value = {
    user,
    admin,
    token,
    isUserLoggedIn,
    isAdminLoggedIn,
    userLogin,
    adminLogin,
    userLogout,
    adminLogout,
    logout,
  };

  return <AuthContext.Provider value={value}>
    {children}
  </AuthContext.Provider>;
};
