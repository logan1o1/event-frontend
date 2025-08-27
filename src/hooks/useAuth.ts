import { useState } from 'react';
import { API_BASE_URL, getHeaders } from '../config/api';
import type { UserLoginData, UserRegistrationData, AuthResponse, User } from '../types';
// import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // const navigate = useNavigate();

  const login = async (credentials: UserLoginData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(credentials)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: UserRegistrationData): Promise<AuthResponse | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ user: userData })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(', ') || 'Registration failed');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/logout`, {
        method: 'DELETE',
        headers: {
          ...getHeaders(),
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    clearError: () => setError(null)
  };
};
