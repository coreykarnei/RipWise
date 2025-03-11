// TripDetails.js - Container for a specific trip's details
import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { ReceiptIcon, ScaleIcon, FileUpIcon, UsersIcon } from 'lucide-react';
import Home from './Home';
import AddTransaction from './AddTransaction';
import Balances from './Balances';
import Export from './Export';
import Participants from './Participants';
import { calculateBalances, getDebtPairs } from '../utils/calculations';
import { ExpandableTabs } from './ui/ExpandableTabs';
import './TripDetails.css';
import './ui/ExpandableTabs.css';

const TripDetails = ({ trips, onUpdateTrip }) => {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Current trip state
  const [currentTrip, setCurrentTrip] = useState(null);
  const [balances, setBalances] = useState({});
  const [debtPairs, setDebtPairs] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  
  const navTabs = [
    { title: "Expenses", icon: ReceiptIcon },
    { title: "Participants", icon: UsersIcon },
    { title: "Balances", icon: ScaleIcon },
    { title: "Export", icon: FileUpIcon }
  ];
  
  // Find the current trip based on URL param
  useEffect(() => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) {
      navigate('/');
      return;
    }
    setCurrentTrip(trip);
    
    // Check if we're coming from the trip list page
    const isFromTripList = location.state?.fromTripList === true;
    
    // If coming from trip list and no participants, navigate to participants tab
    if (isFromTripList && trip.participants.length === 0) {
      navigate(`/trip/${tripId}/participants`, { state: {} }); // Clear the state
      return;
    }
    
    // Determine which tab should be active based on current URL
    const path = window.location.pathname;
    
    // Keep the "Expenses" tab active even when on add/edit routes
    if (path.includes('/add') || path.includes('/edit')) {
      setActiveTab(0); // Expenses tab
    } else if (path.includes('/participants')) {
      setActiveTab(1); 
    } else if (path.includes('/balances')) {
      setActiveTab(2);
    } else if (path.includes('/export')) {
      setActiveTab(3);
    } else {
      setActiveTab(0);
    }
  }, [tripId, trips, navigate, location]);
  
  // Calculate balances whenever the current trip changes
  useEffect(() => {
    if (currentTrip) {
      const newBalances = calculateBalances(
        currentTrip.transactions, 
        currentTrip.participants
      );
      setBalances(newBalances);
      setDebtPairs(getDebtPairs(newBalances));
    }
  }, [currentTrip]);
  
  // If no trip is loaded yet, show loading indicator
  if (!currentTrip) {
    return <div className="loading">Loading trip details...</div>;
  }
  
  // Handle nav tab selection
  const handleNavChange = (index) => {
    // Navigate to appropriate tab without restrictions
    if (index === 0) navigate(`/trip/${tripId}`);
    else if (index === 1) navigate(`/trip/${tripId}/participants`);
    else if (index === 2) navigate(`/trip/${tripId}/balances`);
    else if (index === 3) navigate(`/trip/${tripId}/export`);
  };
  
  // Functions for managing trip data
  const addTransaction = (transaction) => {
    // Generate a unique ID
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    
    const updatedTrip = {
      ...currentTrip,
      transactions: [...currentTrip.transactions, newTransaction]
    };
    
    setCurrentTrip(updatedTrip);
    onUpdateTrip(tripId, updatedTrip);
  };
  
  const editTransaction = (id, updatedTransaction) => {
    const newTransactions = currentTrip.transactions.map(transaction => 
      transaction.id === id ? { ...transaction, ...updatedTransaction } : transaction
    );
    
    const updatedTrip = {
      ...currentTrip,
      transactions: newTransactions
    };
    
    setCurrentTrip(updatedTrip);
    onUpdateTrip(tripId, updatedTrip);
  };
  
  const deleteTransaction = (id) => {
    const updatedTrip = {
      ...currentTrip,
      transactions: currentTrip.transactions.filter(t => t.id !== id)
    };
    
    setCurrentTrip(updatedTrip);
    onUpdateTrip(tripId, updatedTrip);
  };
  
  const addParticipant = (name) => {
    if (!currentTrip.participants.includes(name)) {
      const updatedTrip = {
        ...currentTrip,
        participants: [...currentTrip.participants, name]
      };
      
      setCurrentTrip(updatedTrip);
      onUpdateTrip(tripId, updatedTrip);
    }
  };
  
  const removeParticipant = (name) => {
    // Check if participant is used in any transaction
    const isUsed = currentTrip.transactions.some(
      t => t.paidBy === name || t.participants.includes(name)
    );
    
    if (isUsed) {
      alert(`Cannot remove ${name} as they are involved in one or more transactions.`);
      return;
    }
    
    const updatedTrip = {
      ...currentTrip,
      participants: currentTrip.participants.filter(p => p !== name)
    };
    
    setCurrentTrip(updatedTrip);
    onUpdateTrip(tripId, updatedTrip);
  };
  
  // Inner component for Home page with useNavigate hook
  const HomeWrapper = () => {
    const navigateInner = useNavigate();
    return (
      <Home 
        transactions={currentTrip.transactions}
        balances={balances}
        participants={currentTrip.participants}
        onDeleteTransaction={deleteTransaction}
        onEditTransaction={(id) => navigateInner(`/trip/${tripId}/edit/${id}`)}
        onAddTransaction={() => navigateInner(`/trip/${tripId}/add`)}
      />
    );
  };
  
  return (
    <div className="trip-details-container">
      <div className="trip-details-header">
        <div className="trip-title">
          <h2>{currentTrip.name}</h2>
          <span className="trip-participants">
            {currentTrip.participants.length} participants
          </span>
        </div>
        <Link to="/" className="back-to-trips">
          ← Back to All Trips
        </Link>
      </div>
      
      <div className="trip-nav-wrapper">
        <ExpandableTabs 
          tabs={navTabs}
          onChange={handleNavChange}
          activeColor="active-tab"
          defaultSelected={activeTab}
        />
      </div>
      
      <div className="trip-content">
        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          
          <Route path="/add" element={
            <AddTransaction 
              participants={currentTrip.participants}
              onAddTransaction={addTransaction}
              onAddParticipant={addParticipant}
            />
          } />
          
          <Route path="/edit/:transactionId" element={
            <AddTransaction 
              participants={currentTrip.participants}
              transactions={currentTrip.transactions}
              onEditTransaction={editTransaction}
              onAddParticipant={addParticipant}
              isEditMode={true}
            />
          } />
          
          <Route path="/balances" element={
            <Balances 
              balances={balances}
              debtPairs={debtPairs}
              participants={currentTrip.participants}
            />
          } />
          
          <Route path="/export" element={
            <Export 
              transactions={currentTrip.transactions}
              balances={balances}
              debtPairs={debtPairs}
              participants={currentTrip.participants}
            />
          } />
          
          <Route path="/participants" element={
            <Participants 
              participants={currentTrip.participants}
              onAddParticipant={addParticipant}
              onRemoveParticipant={removeParticipant}
            />
          } />
        </Routes>
      </div>
    </div>
  );
};

export default TripDetails; 