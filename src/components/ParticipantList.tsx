import React, { useState, useEffect } from 'react';
import type { Participant } from '../types';
import { useParticipants } from '../hooks/useParticipants';
import { FaUserCircle } from 'react-icons/fa';

interface ParticipantListProps {
  eventId: number;
}

const ParticipantList: React.FC<ParticipantListProps> = ({ eventId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  // I've renamed `getEventParticipants` to `getParticipants` to match the hook I provided earlier.
  const { getEventParticipants, loading, error } = useParticipants();

  useEffect(() => {
    // Since this is always open, we just fetch the data when the component mounts.
    const fetchParticipants = async () => {
      if (eventId) {
        const data = await getEventParticipants(eventId);
        setParticipants(data);
      }
    };
    fetchParticipants();
  }, [eventId]);

  // This component now returns a simple div instead of a Modal.
  return (
    <div className="bg-gray-50 p-4 rounded-lg border h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Participants</h3>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {!loading && !error && (
        <ul className="space-y-3">
          {participants.length > 0 ? (
            participants.map(p => (
              <li key={p.id} className="flex items-center">
                <FaUserCircle className="h-6 w-6 text-gray-400 mr-3" />
                <span className="text-gray-700">{p.user.username}</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500 text-sm">No one has applied yet.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default ParticipantList;