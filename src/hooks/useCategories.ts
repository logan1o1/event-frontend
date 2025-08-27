import { useState, useCallback } from 'react';
import { API_BASE_URL, getHeaders } from '../config/api';
import type { Category } from '../types';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCategories = useCallback(async (): Promise<Category[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategories(data);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  const getCategory = useCallback(async (category_id: number): Promise<void> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/categories/${category_id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }

      const data = await response.json();
      setCategory(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    getCategory,
    category,
    categories,
    getCategories,
    loading,
    error,
    clearError: () => setError(null)
  };
};