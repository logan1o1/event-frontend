import { createContext, useContext } from 'react';
import type { User, Admin } from '../types';

interface AuthContextType {
  user: User | null;
  admin: Admin | null;
  token: string | null;
  isUserLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  userLogin: (user: User, token: string) => void;
  adminLogin: (admin: Admin, token: string) => void;
  userLogout: () => void;
  adminLogout: () => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};