import { useCallback, useState } from 'react';
import { API_BASE_URL } from '../config/api';
import type { Admin, DashboardStats, Event as EventType, Category, Participant } from '../types';


export const useAdmin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiCall = useCallback(async <T>(
    endpoint: string,
    method: 'GET' | 'POST' | 'DELETE',
    token?: string,
    body?: object
  ): Promise<T> => {
    setLoading(true);
    setError(null);

    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || responseData.message || 'An API error occurred');
      }

      if (endpoint === '/admins/sign_in') {
        const authToken = response.headers.get('Authorization')?.split(' ')[1];
        if (!authToken) throw new Error('Admin login failed: Token not provided');
        return { ...responseData, token: authToken } as T;
      }
      
      return responseData as T;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogin = useCallback(
    (credentials: { email: string, password: string }) =>
      apiCall<{ data: Admin, token: string }>('/admins/sign_in', 'POST', undefined, { admin: credentials }),
    [apiCall]
  );

  const adminLogout = useCallback(
    (token: string) => apiCall('/admins/sign_out', 'DELETE', token),
    [apiCall]
  );

  const getDashboardStats = useCallback(
    (token: string) => apiCall<DashboardStats>('/admin/dashboard', 'GET', token),
    [apiCall]
  );

  const getAdminEvents = useCallback(
    async (token: string): Promise<EventType[]> => {
      const response = await apiCall<{ events: EventType[] }>('/admin/events', 'GET', token);
      return response.events; 
    },
    [apiCall]
  );
  
  
  const deleteAdminEvent = useCallback(
    (eventId: number, token: string) => apiCall(`/admin/events/${eventId}`, 'DELETE', token),
    [apiCall]
  );

  const removeParticipant = useCallback(
    (participantId: number, token: string) => apiCall(`/admin/participants/${participantId}`, 'DELETE', token),
    [apiCall]
  );

  return {
    adminLogin,
    adminLogout,
    getDashboardStats,
    getAdminEvents,
    deleteAdminEvent,
    removeParticipant,
    loading,
    error,
    clearError: () => setError(null)
  };
};