// AddTransaction.js - Form for adding or editing transactions
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './AddTransaction.css';

const AddTransaction = ({ 
  participants,
  transactions,
  onAddTransaction,
  onEditTransaction,
  onAddParticipant,
  isEditMode = false
}) => {
  const { id, tripId } = useParams();
  const navigate = useNavigate();

  // Form state
  const [paidBy, setPaidBy] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedParticipants, setSelectedParticipants] = useState(isEditMode ? [] : [...participants]);
  const [newParticipant, setNewParticipant] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // If in edit mode, find the transaction and populate the form
  useEffect(() => {
    if (isEditMode && id) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setPaidBy(transaction.paidBy);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description);
        setSelectedParticipants(transaction.participants);
        setFormErrors({});
      }
    }
  }, [isEditMode, id, transactions]);
  
  // Update selected participants when the participants list changes (for new expenses)
  useEffect(() => {
    if (!isEditMode) {
      setSelectedParticipants([...participants]);
    }
  }, [participants, isEditMode]);

  const validateForm = () => {
    const errors = {};
    
    if (!paidBy) errors.paidBy = 'Please select who paid';
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
    }
    if (selectedParticipants.length === 0) {
      errors.participants = 'Please select at least one participant';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    const transactionData = {
      paidBy,
      amount: parseFloat(amount),
      description,
      participants: selectedParticipants,
    };

    if (isEditMode && id) {
      onEditTransaction(id, transactionData);
    } else {
      onAddTransaction(transactionData);
    }

    // Reset form and navigate back to trip expenses page
    setPaidBy('');
    setAmount('');
    setDescription('');
    setSelectedParticipants([]);
    setIsSubmitting(false);
    navigate(`/trip/${tripId}`);
  };

  const handleParticipantToggle = (participant) => {
    setSelectedParticipants(prev => 
      prev.includes(participant)
        ? prev.filter(p => p !== participant)
        : [...prev, participant]
    );
  };

  const handleSelectAll = () => {
    if (participants.length === selectedParticipants.length) {
      setSelectedParticipants([]);
    } else {
      setSelectedParticipants([...participants]);
    }
  };

  const handleCancel = () => {
    navigate(`/trip/${tripId}`);
  };

  return (
    <div className="add-transaction-container">
      <h2>{isEditMode ? 'Edit Expense' : 'Add New Expense'}</h2>
      
      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="paidBy">Paid By:</label>
          <select 
            id="paidBy" 
            value={paidBy} 
            onChange={(e) => {
              setPaidBy(e.target.value);
              setFormErrors({...formErrors, paidBy: ''});
            }}
            className={formErrors.paidBy ? 'error' : ''}
          >
            <option value="">Select who paid</option>
            {participants.map(participant => (
              <option key={participant} value={participant}>
                {participant}
              </option>
            ))}
          </select>
          {formErrors.paidBy && <div className="error-message">{formErrors.paidBy}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input 
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value);
              setFormErrors({...formErrors, amount: ''});
            }}
            min="0.01"
            step="0.01"
            placeholder="0.00"
            className={formErrors.amount ? 'error' : ''}
          />
          {formErrors.amount && <div className="error-message">{formErrors.amount}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <input 
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Dinner, Groceries, Taxi"
          />
        </div>

        <div className="form-group">
          <div className="participants-header">
            <label>Split Between:</label>
            <button 
              type="button" 
              onClick={handleSelectAll}
              className="select-all-button"
            >
              {participants.length === selectedParticipants.length ? 'Unselect All' : 'Select All'}
            </button>
          </div>
          
          {formErrors.participants && <div className="error-message">{formErrors.participants}</div>}
          
          <div className="participants-list">
            {participants.map(participant => (
              <div 
                key={participant} 
                className="participant-checkbox"
                onClick={() => {
                  handleParticipantToggle(participant);
                  setFormErrors({...formErrors, participants: ''});
                }}
              >
                <input 
                  type="checkbox"
                  id={`participant-${participant}`}
                  checked={selectedParticipants.includes(participant)}
                  onChange={() => {}} // Keep empty to avoid double toggling
                />
                <label htmlFor={`participant-${participant}`}>{participant}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-button" 
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isEditMode ? 'Save Changes' : 'Add Expense'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddTransaction;
