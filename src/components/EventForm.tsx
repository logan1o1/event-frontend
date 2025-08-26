import React, { useState, useEffect } from 'react';
import { useEvents } from '../hooks/useEvents';
import { useCategories } from '../hooks/useCategories';
import type { Event, Category, EventFormData } from '../types';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onEventCreated: (event: Event) => void;
  onEventUpdated: (event: Event) => void;
}

const EventForm: React.FC<EventFormProps> = ({ isOpen, onClose, event, onEventCreated, onEventUpdated }) => {
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    location: '',
    category_id: 0,
    poster_url: ''
  });

  const { createEvent, updateEvent, loading, error } = useEvents();
  const { categories, getCategories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { token } = useAuth();

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        date: new Date(event.date).toISOString().split('T')[0],
        location: event.location,
        category_id: event.category_id,
        poster_url: event.poster_url
      });
    } else {
      setFormData({
        title: '',
        description: '',
        date: '',
        location: '',
        category_id: 0,
        poster_url: ''
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    const eventData = { ...formData, category_id: Number(formData.category_id) };
    let response: Event | null = null;
    if (event) {
      response = await updateEvent(event.id, eventData, token);
      if (response) {
        onEventUpdated(response);
      }
    } else {
      response = await createEvent(eventData, token);
      if (response) {
        onEventCreated(response);
      }
    }
    if (response) {
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event ? 'Update Event' : 'Create Event'}>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
            <input type="text" name="title" id="title" value={formData.title} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea name="description" id="description" value={formData.description} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
            <input type="date" name="date" id="date" value={formData.date} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
            <input type="text" name="location" id="location" value={formData.location} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required />
          </div>
          <div>
            <label htmlFor="poster_url" className="block text-sm font-medium text-gray-700">Poster URL</label>
            <input type="text" name="poster_url" id="poster_url" value={formData.poster_url} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
          </div>
          <div>
            <label htmlFor="category_id" className="block text-sm font-medium text-gray-700">Category</label>
            <select name="category_id" id="category_id" value={formData.category_id} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" required>
              <option value={0}>Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
            {categoriesLoading && <p>Loading categories...</p>}
            {categoriesError && <p className="text-red-500 text-sm">{categoriesError}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end space-x-4">
          <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save'}</button>
        </div>
        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
      </form>
    </Modal>
  );
};

export default EventForm;
