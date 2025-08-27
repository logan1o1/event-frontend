import React, { useState, useEffect } from 'react';
import type { Participant } from '../types';
import { useParticipants } from '../hooks/useParticipants';
import { useAdmin } from '../hooks/useAdmin';
import { useAuth } from '../contexts/AuthContext';
import { FaUserCircle, FaTrash } from 'react-icons/fa';

interface ParticipantListProps {
  eventId: number;
  isAdmin?: boolean; // This prop controls whether the UI should show admin controls
}

const ParticipantList: React.FC<ParticipantListProps> = ({ eventId }) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const { getEventParticipants, loading, error } = useParticipants();
  const { removeParticipant, loading: isRemoving } = useAdmin();
  
  // Get both the admin object and the neutral token from the context.
  const { admin, token } = useAuth();

  useEffect(() => {
    const fetchParticipants = async () => {
      if (eventId) {
        const data = await getEventParticipants(eventId);
        setParticipants(data);
      }
    };
    fetchParticipants();
  }, [eventId, getEventParticipants]);

  const handleRemove = async (participantId: number) => {
    // This is the more secure check: ensure both an admin and a token exist.
    if (!admin || !token) {
      console.error("Admin action attempted without an active admin session.");
      return;
    }
    
    const success = await removeParticipant(participantId, token);
    if (success) {
      setParticipants(prev => prev.filter(p => p.id !== participantId));
    }
  };

  return (
    <div className="bg-gray-50 p-4 rounded-lg border h-full">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Participants</h3>
      {loading && <p className="text-sm text-gray-500">Loading...</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {!loading && !error && (
        <ul className="space-y-3">
          {participants.length > 0 ? (
            participants.map(p => (
              <li key={p.id} className="flex items-center justify-between">
                <div className="flex items-center">
                  <FaUserCircle className="h-6 w-6 text-gray-400 mr-3" />
                  <span className="text-gray-700">{p.user.username}</span>
                </div>
                
                {/* The UI is controlled by the isAdmin prop... */}
                {admin && (
                  <button
                    onClick={() => handleRemove(p.id)}
                    disabled={isRemoving}
                    className="text-red-500 hover:text-red-700 disabled:opacity-50"
                    title="Remove participant"
                  >
                    <FaTrash />
                  </button>
                )}
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