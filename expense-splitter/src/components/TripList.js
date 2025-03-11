// TripList.js - Home screen showing all trips/groups
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './TripList.css';
import { TrashIcon } from 'lucide-react';

const TripList = ({ trips, onDeleteTrip, onAddTrip }) => {
  const [newTripName, setNewTripName] = useState('');
  const [showForm, setShowForm] = useState(false);
  
  const handleAddTrip = () => {
    if (newTripName.trim()) {
      onAddTrip(newTripName.trim());
      setNewTripName('');
      setShowForm(false);
    }
  };

  return (
    <div className="trip-list-container">
      <div className="trip-list-header">
        <h2>Your Trips & Groups</h2>
        <button 
          className="add-trip-button" 
          onClick={() => setShowForm(true)}
        >
          + New Trip
        </button>
      </div>
      
      {showForm && (
        <div className="new-trip-form">
          <input
            type="text"
            value={newTripName}
            onChange={(e) => setNewTripName(e.target.value)}
            placeholder="Trip name (e.g., Summer Vacation, Roommates)"
            autoFocus
          />
          <div className="form-actions">
            <button 
              className="cancel-button" 
              onClick={() => {
                setShowForm(false);
                setNewTripName('');
              }}
            >
              Cancel
            </button>
            <button 
              className="submit-button" 
              onClick={handleAddTrip}
              disabled={!newTripName.trim()}
            >
              Create Trip
            </button>
          </div>
        </div>
      )}
      
      {trips.length === 0 && !showForm ? (
        <div className="no-trips">
          <p>You haven't created any trips yet. Get started by creating your first trip!</p>
          <button 
            className="add-trip-button-centered" 
            onClick={() => setShowForm(true)}
          >
            + Create Your First Trip
          </button>
        </div>
      ) : (
        <div className="trip-cards">
          {trips.map(trip => (
            <div key={trip.id} className="trip-card">
              <Link 
                to={`/trip/${trip.id}`} 
                state={{ fromTripList: true }}
                className="trip-card-link"
              >
                <div className="trip-card-header">
                  <h3>{trip.name}</h3>
                  <div className="trip-card-header-right">
                    <span className="trip-date">
                      {new Date(trip.dateCreated).toLocaleDateString()}
                    </span>
                    <button 
                      className="delete-trip-button-icon"
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation when clicking delete
                        if (window.confirm(`Are you sure you want to delete "${trip.name}"? This action cannot be undone.`)) {
                          onDeleteTrip(trip.id);
                        }
                      }}
                      aria-label="Delete trip"
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="trip-card-details">
                  <div className="trip-stats">
                    <div className="stat-item">
                      <span className="stat-label">Expenses:</span>
                      <span className="stat-value">{trip.transactions.length}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Participants:</span>
                      <span className="stat-value">{trip.participants.length}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TripList;