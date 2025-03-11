import React, { useState } from 'react';
import { UserMinusIcon } from 'lucide-react';
import './Participants.css';

const Participants = ({ participants, onAddParticipant, onRemoveParticipant }) => {
  const [newParticipant, setNewParticipant] = useState('');
  
  const handleAddParticipant = (e) => {
    e.preventDefault();
    if (newParticipant.trim()) {
      onAddParticipant(newParticipant.trim());
      setNewParticipant('');
    }
  };
  
  return (
    <div className="participants-container">
      <div className="add-participant-form">
        <form onSubmit={handleAddParticipant}>
          <input
            type="text"
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            placeholder="Add a new participant"
            aria-label="Participant name"
          />
          <button type="submit" disabled={!newParticipant.trim()}>
            Add Person
          </button>
        </form>
      </div>
      
      <div className="participants-list">
        <h3>Group Members ({participants.length})</h3>
        
        {participants.length === 0 ? (
          <p className="no-participants">No participants added yet. Add someone to get started!</p>
        ) : (
          <ul>
            {participants.map(participant => (
              <li key={participant}>
                <span className="participant-name">{participant}</span>
                <button 
                  className="remove-participant-button"
                  onClick={() => onRemoveParticipant(participant)}
                  aria-label={`Remove ${participant}`}
                >
                  <UserMinusIcon size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Participants; 