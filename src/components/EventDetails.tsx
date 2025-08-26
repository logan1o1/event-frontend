import React, { useState } from 'react';
import type { Event, User } from '../types';
import Modal from './Modal';
import { useAuth } from '../contexts/AuthContext';
import { useParticipants } from '../hooks/useParticipants';
import ParticipantList from './ParticipantList';

interface EventDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  event: Event;
  onUpdate: (event: Event) => void;
  onDelete: (eventId: number) => void;
}

const EventDetails: React.FC<EventDetailsProps> = ({ isOpen, onClose, event, onUpdate, onDelete }) => {
  const { user, token } = useAuth();
  const { applyToEvent, loading, error } = useParticipants();
  const [isParticipantListOpen, setIsParticipantListOpen] = useState(false);

  const isCreator = user && user.id === event.user_id;

  const handleApply = async () => {
    if (!token) return;
    const participant = await applyToEvent(event.id, token);
    if (participant) {
      onClose();
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title={event.title}>
        <div>
          <p className="mb-4">{event.description}</p>
          <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category.name}</p>

          <div className="mt-6 flex justify-end space-x-4">
            {isCreator ? (
              <>
                <button onClick={() => setIsParticipantListOpen(true)} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">View Participants</button>
                <button onClick={() => onUpdate(event)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Update</button>
                <button onClick={() => onDelete(event.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
              </>
            ) : (
              <>
                {user && (
                  <button onClick={handleApply} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50">{loading ? 'Applying...' : 'Apply'}</button>
                )}
              </>
            )}
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>
      </Modal>

      <ParticipantList
        isOpen={isParticipantListOpen}
        onClose={() => setIsParticipantListOpen(false)}
        eventId={event.id}
      />
    </>
  );
};

export default EventDetails;
