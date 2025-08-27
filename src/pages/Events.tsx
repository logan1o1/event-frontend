import React, { useState, useEffect, useMemo } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useCategories } from '../hooks/useCategories';
import { useAuth as useAuthAPI } from '../hooks/useAuth';
import { useAuth } from '../contexts/AuthContext';
import { FaPlus, FaCalendarAlt, FaMapMarkerAlt, FaUser, FaTag } from 'react-icons/fa';
import type { Event, Category, User } from '../types';
import EventForm from '../components/EventForm';
import EventDetails from '../components/EventDetails';

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [isEventDetailsOpen, setIsEventDetailsOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  const { getEvents, deleteEvent } = useEvents();
  const { getCategories } = useCategories();
  const { isUserLoggedIn, token } = useAuth();
  const {getUsers} = useAuthAPI();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventsData, categoriesData, userData] = await Promise.all([
          getEvents(),
          getCategories(),
          getUsers()
        ]);
        setEvents(eventsData);
        setCategories(categoriesData);
        setUsers(userData)
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const userMap = useMemo(() => {
    const map = new Map<number, string>();
    users.forEach(user => {
      map.set(user.id, user.username);
    });
    return map;
  }, [users]);

  const categoryMap = useMemo(() => {
    const map = new Map<number, string>();
    categories.forEach(cat => {
      map.set(cat.id, cat.name); // Assumes category object has `name` property
    });
    return map;
  }, [categories]);

  const handleEventCreated = (event: Event) => {
    setEvents(prev => [event, ...prev]);
  };

  const handleEventUpdated = (updatedEvent: Event) => {
    setEvents(prev => prev.map(event => event.id === updatedEvent.id ? updatedEvent : event));
  };

  const handleEventDeleted = async (eventId: number) => {
    if (!token) return;
    const success = await deleteEvent(eventId, token);
    if (success) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setIsEventDetailsOpen(false);
    }
  };

  const openCreateEventForm = () => {
    setEditingEvent(null);
    setIsEventFormOpen(true);
  };

  const openUpdateEventForm = (event: Event) => {
    setEditingEvent(event);
    setIsEventDetailsOpen(false);
    setIsEventFormOpen(true);
  };

  const openEventDetails = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'UTC' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Events</h1>
            <p className="text-gray-600">Discover and join amazing events</p>
          </div>
          {isUserLoggedIn && (
            <button
              onClick={openCreateEventForm}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <FaPlus className="mr-2" />
              Add Event
            </button>
          )}
        </div>

        {events.length === 0 ? (
          <div className="text-center py-12">
            <FaCalendarAlt className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
            <p className="text-gray-500">Be the first to create an event!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                onClick={() => openEventDetails(event)}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer transform hover:-translate-y-1 border border-gray-200"
              >
                <div className="aspect-w-16 aspect-h-9 rounded-t-lg overflow-hidden">
                  <img
                    src={event.poster_url || 'https://via.placeholder.com/400x225?text=Event+Poster'}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                <div className="inline-flex items-center ...">
                    <FaTag className="mr-1" />
                    {categoryMap.get(event.category_id) || 'Unknown Category'}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {event.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <FaCalendarAlt className="mr-2 text-blue-500" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaMapMarkerAlt className="mr-2 text-red-500" />
                      {event.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <FaUser className="mr-2 text-green-500" />
                      {userMap.get(event.user_id) || 'Unknown User'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => setIsEventFormOpen(false)}
        event={editingEvent || undefined}
        onEventCreated={handleEventCreated}
        onEventUpdated={handleEventUpdated}
      />

      {selectedEvent && (
        <EventDetails
          isOpen={isEventDetailsOpen}
          onClose={() => setIsEventDetailsOpen(false)}
          event={selectedEvent}
          onUpdate={openUpdateEventForm}
          onDelete={handleEventDeleted}
        />
      )}
    </div>
  );
};

export default Events;
