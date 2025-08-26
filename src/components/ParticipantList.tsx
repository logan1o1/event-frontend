import React, { useState, useEffect } from 'react';
import type { Participant } from '../types';
import Modal from './Modal';
import { useParticipants } from '../hooks/useParticipants';

interface ParticipantListProps {
  isOpen: boolean;
  onClose: () => void;
  eventId: number;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ isOpen, onClose, eventId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { getEventParticipants, loading, error } = useParticipants();

  useEffect(() => {
    if (isOpen) {
      const fetchParticipants = async () => {
        const data = await getEventParticipants(eventId);
        setParticipants(data);
      };
      fetchParticipants();
    }
  }, [isOpen, eventId, getEventParticipants]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Participants">
      <div>
        {loading && <p>Loading participants...</p>}
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {participants.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {participants.map(participant => (
              <li key={participant.id} className="py-4 flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900">{participant.user.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No participants yet.</p>
        )}
      </div>
    </Modal>
  );
};

export default ParticipantList;
