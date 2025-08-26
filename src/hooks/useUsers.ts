import { useState, useCallback } from 'react';
import { API_BASE_URL, getAuthHeaders } from '../config/api';
import type { User } from '../types';

export const useUsers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getUsers = useCallback(async (token: string): Promise<User[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: 'GET',
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getUsers,
    loading,
    error,
    clearError: () => setError(null)
  };
};
