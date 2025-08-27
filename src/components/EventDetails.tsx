import React, { useEffect, useState } from 'react';
import type { Event, Participant } from '../types';
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
  const { withdrawFromEvent, applyToEvent, loading, error } = useParticipants();

  const [participants, setParticipants] = useState<Participant[]>([]);
  const { getEventParticipants } = useParticipants();

  useEffect(() => {
    const fetchParticipants = async () => {
      if (event.id) {
        const data = await getEventParticipants(event.id);
        setParticipants(data);
      }
    };
    fetchParticipants();
  }, [event.id, getEventParticipants, withdrawFromEvent]);

  const currentUserParticipation = participants.find(p => p.user_id === user?.id);
  const isParticipant = !!currentUserParticipation;

  const isCreator = user && user.id === event.user_id;

  const handleApply = async () => {
    if (!token) return;
    const participant = await applyToEvent(event.id, token);
    if (participant) {
      onClose();
    }
  };

  const handleWithdraw = async () => {
    if (!token || !currentUserParticipation) return;
    const success = await withdrawFromEvent(currentUserParticipation.id, token);
    if (success) {
      onClose();
    }
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={event.title} maxWidth="4xl">
      <div className="flex flex-col md:flex-row md:space-x-8 ">
        
        <div className="md:w-2/3">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
            <img
              src={event.poster_url || 'https://via.placeholder.com/400x225?text=Event+Poster'}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>
          <p className="mb-4">{event.description}</p>
          <p><strong>Date:</strong> {formatDate(event.date)}</p>
          <p><strong>Location:</strong> {event.location}</p>
          <p><strong>Category:</strong> {event.category?.name || 'Unknown'}</p>
          
          <div className="mt-6 flex justify-end space-x-4">
            {isCreator ? (
              <>
                <button onClick={() => onUpdate(event)} className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Update</button>
                <button onClick={() => onDelete(event.id)} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
              </>
            ) : (
              <>
                {user && (
                  isParticipant ? (
                    <button onClick={handleWithdraw} disabled={loading} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50">
                      {loading ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  ) : (
                    <button onClick={handleApply} disabled={loading} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50">
                      {loading ? 'Applying...' : 'Apply'}
                    </button>
                  )
                )}
              </>
            )}
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Close</button>
          </div>
          {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        </div>

        <div className="md:w-1/3 mt-8 md:mt-0">
          <ParticipantList eventId={event.id} />
        </div>

      </div>
    </Modal>
  );
};

export default EventDetails;