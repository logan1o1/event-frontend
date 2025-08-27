import { useCallback, useState } from 'react';
import { API_BASE_URL, getAuthHeaders, getHeaders } from '../config/api';
import type { Participant } from '../types';

export const useParticipants = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEventParticipants =useCallback( async (eventId: number): Promise<Participant[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch participants');
      return [];
    } finally {
      setLoading(false);
    }
  }, [])

  const applyToEvent = useCallback( async (eventId: number, token: string): Promise<Participant | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${eventId}/participants`, {
        method: 'POST',
        headers: getAuthHeaders(token)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join event');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to join event');
      return null;
    } finally {
      setLoading(false);
    }
  }, [])

  const withdrawFromEvent = useCallback( async (participantId: number, token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/participants/${participantId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to leave event');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to leave event');
      return false;
    } finally {
      setLoading(false);
    }
  }, [])

  return {
    getEventParticipants,
    applyToEvent,
    withdrawFromEvent,
    loading,
    error,
    clearError: () => setError(null)
  };
};