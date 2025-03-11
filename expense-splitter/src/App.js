// App.js - Main component with routing and state management
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TripList from './components/TripList';
import TripDetails from './components/TripDetails';
import { saveToLocalStorage, loadFromLocalStorage } from './utils/storage';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

function App() {
  // Main state for the application
  const [trips, setTrips] = useState([]);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    const savedData = loadFromLocalStorage('trips');
    if (savedData) {
      setTrips(savedData || []);
    }
  }, []);
  
  // Save trips to localStorage whenever they change
  useEffect(() => {
    saveToLocalStorage('trips', trips);
  }, [trips]);
  
  // Add a new trip
  const addTrip = (name) => {
    const newTrip = {
      id: uuidv4(),
      name,
      dateCreated: new Date().toISOString(),
      participants: [],
      transactions: []
    };
    
    const updatedTrips = [...trips, newTrip];
    setTrips(updatedTrips);
    saveToLocalStorage('trips', updatedTrips);
  };
  
  // Delete a trip
  const deleteTrip = (id) => {
    const updatedTrips = trips.filter(trip => trip.id !== id);
    setTrips(updatedTrips);
    saveToLocalStorage('trips', updatedTrips);
  };
  
  // Update a trip
  const updateTrip = (id, updatedTrip) => {
    const updatedTrips = trips.map(trip => 
      trip.id === id ? { ...trip, ...updatedTrip } : trip
    );
    setTrips(updatedTrips);
    saveToLocalStorage('trips', updatedTrips);
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>ExpenseSplitter</h1>
        </header>

        <main className="app-content">
          <Routes>
            {/* Home route - show trip list */}
            <Route 
              path="/" 
              element={
                <TripList 
                  trips={trips} 
                  onAddTrip={addTrip}
                  onDeleteTrip={deleteTrip}
                />
              } 
            />
            
            {/* Trip details routes */}
            <Route 
              path="/trip/:tripId/*" 
              element={
                <TripDetails 
                  trips={trips}
                  onUpdateTrip={updateTrip}
                />
              } 
            />
            
            {/* Redirect legacy routes to home */}
            <Route path="/add" element={<Navigate to="/" replace />} />
            <Route path="/edit/:id" element={<Navigate to="/" replace />} />
            <Route path="/balances" element={<Navigate to="/" replace />} />
            <Route path="/export" element={<Navigate to="/" replace />} />
            
            {/* Catch all for unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>ExpenseSplitter - A Free, Offline Bill-Splitting App</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;