import { useCallback, useState } from 'react';
import { API_BASE_URL, getAuthHeaders, getHeaders } from '../config/api';
import type { Event, EventFormData } from '../types';

export const useEvents = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getEvents = useCallback( async (): Promise<Event[]> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch events');
      return [];
    } finally {
      setLoading(false);
    }
  }, [])

  const getEvent = async (id: number): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event');
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (eventData: EventFormData, token: string): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ event: eventData })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.errors?.join(', ') || 'Failed to create event');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateEvent = async (id: number, eventData: EventFormData, token: string): Promise<Event | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(token),
        body: JSON.stringify({ event: eventData })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.errors?.join(', ') || 'Failed to update event');
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update event');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id: number, token: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(token)
      });

      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    getEvents,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    loading,
    error,
    clearError: () => setError(null)
  };
};
