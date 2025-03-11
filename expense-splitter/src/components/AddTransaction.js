// AddTransaction.js - Form for adding or editing transactions
import React, { useState, useEffect, useMemo } from 'react';
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
  const [participantShares, setParticipantShares] = useState({});
  const [splitMode, setSplitMode] = useState('equal'); // 'equal', 'percentage', 'custom'
  const [newParticipant, setNewParticipant] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Calculate total percentage and remaining percentage
  const totalPercentage = useMemo(() => {
    return Object.values(participantShares).reduce((sum, share) => sum + Number(share.percentage || 0), 0);
  }, [participantShares]);

  const remainingPercentage = useMemo(() => {
    return 100 - totalPercentage;
  }, [totalPercentage]);

  // Initialize participant shares when the participant list changes
  useEffect(() => {
    const newShares = {};
    participants.forEach(participant => {
      // Keep existing percentages if they exist
      if (participantShares[participant]) {
        newShares[participant] = participantShares[participant];
      } else {
        // Default to equal shares
        const equalPercentage = participants.length > 0 ? (100 / participants.length).toFixed(2) : 0;
        newShares[participant] = { included: true, percentage: equalPercentage };
      }
    });
    setParticipantShares(newShares);
  }, [participants]);

  // If in edit mode, find the transaction and populate the form
  useEffect(() => {
    if (isEditMode && id) {
      const transaction = transactions.find(t => t.id === id);
      if (transaction) {
        setPaidBy(transaction.paidBy);
        setAmount(transaction.amount.toString());
        setDescription(transaction.description || '');
        
        // If transaction has custom percentages, use them
        if (transaction.participantShares) {
          setParticipantShares(transaction.participantShares);
          setSplitMode('percentage');
        } else {
          // Otherwise, create equal percentages for the participants in this transaction
          const newShares = {};
          const equalPercentage = transaction.participants.length > 0 
            ? (100 / transaction.participants.length).toFixed(2) 
            : 0;
            
          participants.forEach(participant => {
            const isIncluded = transaction.participants.includes(participant);
            newShares[participant] = {
              included: isIncluded,
              percentage: isIncluded ? equalPercentage : '0'
            };
          });
          
          setParticipantShares(newShares);
          setSplitMode('equal');
        }
        
        setFormErrors({});
      }
    }
  }, [isEditMode, id, transactions, participants]);

  // Validate total percentage when submitting
  useEffect(() => {
    if (splitMode === 'percentage' && Math.abs(totalPercentage - 100) > 0.01) {
      setFormErrors(prev => ({
        ...prev,
        percentage: `Total percentage must equal 100%. Currently: ${totalPercentage.toFixed(2)}%`
      }));
    } else {
      setFormErrors(prev => {
        const { percentage, ...rest } = prev;
        return rest;
      });
    }
  }, [totalPercentage, splitMode]);

  const validateForm = () => {
    const errors = {};
    
    if (!paidBy) errors.paidBy = 'Please select who paid';
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      errors.amount = 'Please enter a valid amount greater than 0';
    }
    
    const includedParticipants = Object.entries(participantShares)
      .filter(([_, share]) => share.included && Number(share.percentage) > 0)
      .length;
      
    if (includedParticipants === 0) {
      errors.participants = 'Please include at least one participant';
    }
    
    if (splitMode === 'percentage' && Math.abs(totalPercentage - 100) > 0.01) {
      errors.percentage = `Total percentage must equal 100%. Currently: ${totalPercentage.toFixed(2)}%`;
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

    // Get participants who are included with percentages > 0
    const includedParticipants = Object.entries(participantShares)
      .filter(([_, share]) => share.included && Number(share.percentage) > 0)
      .map(([name]) => name);

    const transactionData = {
      paidBy,
      amount: parseFloat(amount),
      description,
      participants: includedParticipants,
      participantShares: participantShares,
      splitMode: splitMode
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
    setParticipantShares({});
    setSplitMode('equal');
    setIsSubmitting(false);
    navigate(`/trip/${tripId}`);
  };

  const handleSplitModeChange = (mode) => {
    setSplitMode(mode);
    
    // If switching to equal mode, reset percentages to equal
    if (mode === 'equal') {
      const includedParticipants = Object.entries(participantShares)
        .filter(([_, share]) => share.included)
        .length;
        
      if (includedParticipants > 0) {
        const equalPercentage = (100 / includedParticipants).toFixed(2);
        const newShares = { ...participantShares };
        
        Object.keys(newShares).forEach(participant => {
          if (newShares[participant].included) {
            newShares[participant].percentage = equalPercentage;
          } else {
            newShares[participant].percentage = '0';
          }
        });
        
        setParticipantShares(newShares);
      }
    }
  };

  const handleParticipantIncludeToggle = (participant) => {
    const newShares = { ...participantShares };
    const currentlyIncluded = newShares[participant].included;
    
    newShares[participant].included = !currentlyIncluded;
    
    if (!currentlyIncluded) {
      // If including a participant in equal mode, recalculate equal percentages
      if (splitMode === 'equal') {
        const newIncludedCount = Object.values(newShares).filter(share => share.included).length;
        const equalPercentage = (100 / newIncludedCount).toFixed(2);
        
        Object.keys(newShares).forEach(p => {
          if (newShares[p].included) {
            newShares[p].percentage = equalPercentage;
          } else {
            newShares[p].percentage = '0';
          }
        });
      } else {
        // In percentage mode, set to 0% when including
        newShares[participant].percentage = '0';
      }
    } else {
      // When excluding, set percentage to 0
      newShares[participant].percentage = '0';
      
      // In equal mode, recalculate percentages for remaining participants
      if (splitMode === 'equal') {
        const remainingIncluded = Object.values(newShares).filter(share => share.included).length;
        
        if (remainingIncluded > 0) {
          const equalPercentage = (100 / remainingIncluded).toFixed(2);
          Object.keys(newShares).forEach(p => {
            if (newShares[p].included) {
              newShares[p].percentage = equalPercentage;
            }
          });
        }
      }
    }
    
    setParticipantShares(newShares);
    setFormErrors({ ...formErrors, participants: '' });
  };

  const handlePercentageChange = (participant, value) => {
    // Ensure value is a valid number
    let numValue = parseFloat(value) || 0;
    
    // Cap at 100
    numValue = Math.min(100, numValue);
    
    const newShares = { ...participantShares };
    newShares[participant].percentage = numValue.toString();
    newShares[participant].included = numValue > 0;
    
    setParticipantShares(newShares);
    setSplitMode('percentage'); // Switch to percentage mode when manually editing
  };

  const distributeRemaining = () => {
    if (remainingPercentage <= 0) return;
    
    const newShares = { ...participantShares };
    const includedParticipants = Object.entries(newShares)
      .filter(([_, share]) => share.included && Number(share.percentage) < 100)
      .map(([name]) => name);
      
    if (includedParticipants.length === 0) return;
    
    const additionalPercentage = (remainingPercentage / includedParticipants.length).toFixed(2);
    
    includedParticipants.forEach(participant => {
      newShares[participant].percentage = (
        parseFloat(newShares[participant].percentage) + parseFloat(additionalPercentage)
      ).toFixed(2);
    });
    
    setParticipantShares(newShares);
  };

  const setEqualSplit = () => {
    const newShares = { ...participantShares };
    
    // Set all participants as included
    Object.keys(newShares).forEach(participant => {
      newShares[participant].included = true;
    });
    
    // Calculate equal percentage
    const equalPercentage = (100 / participants.length).toFixed(2);
    
    // Distribute evenly
    Object.keys(newShares).forEach(participant => {
      newShares[participant].percentage = equalPercentage;
    });
    
    setParticipantShares(newShares);
    setSplitMode('equal');
  };

  const calculateAmountForParticipant = (participant) => {
    if (!amount || isNaN(parseFloat(amount))) return '0.00';
    
    const totalAmount = parseFloat(amount);
    const percentage = parseFloat(participantShares[participant]?.percentage || 0);
    
    return ((totalAmount * percentage) / 100).toFixed(2);
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

        <div className="form-group split-options">
          <label>Split Method:</label>
          <div className="split-mode-selector">
            <button 
              type="button"
              className={`split-mode-button ${splitMode === 'equal' ? 'active' : ''}`}
              onClick={() => handleSplitModeChange('equal')}
            >
              Equal Split
            </button>
            <button 
              type="button"
              className={`split-mode-button ${splitMode === 'percentage' ? 'active' : ''}`}
              onClick={() => handleSplitModeChange('percentage')}
            >
              Custom Percentages
            </button>
          </div>
        </div>

        <div className="form-group">
          <div className="participants-header">
            <label>Split Between:</label>
            <div className="participants-actions">
              <button 
                type="button" 
                className="action-button"
                onClick={setEqualSplit}
              >
                Reset to Equal Split
              </button>
            </div>
          </div>
          
          {formErrors.participants && <div className="error-message">{formErrors.participants}</div>}
          {formErrors.percentage && <div className="error-message">{formErrors.percentage}</div>}
          
          <div className="percentage-status">
            <div className="percentage-bar">
              <div 
                className="percentage-fill" 
                style={{ 
                  width: `${Math.min(100, totalPercentage)}%`,
                  backgroundColor: Math.abs(totalPercentage - 100) < 0.01 ? '#4CAF50' : 
                                   totalPercentage < 100 ? '#2196F3' : '#F44336'
                }}
              ></div>
            </div>
            <div className="percentage-text">
              {totalPercentage.toFixed(2)}% allocated
              {remainingPercentage > 0 && (
                <button 
                  type="button" 
                  className="distribute-button"
                  onClick={distributeRemaining}
                >
                  Distribute remaining {remainingPercentage.toFixed(2)}%
                </button>
              )}
            </div>
          </div>
          
          <div className="participants-table">
            <div className="participant-row header">
              <div className="participant-name">Participant</div>
              <div className="participant-percentage">Percentage</div>
              <div className="participant-amount">Amount</div>
              <div className="participant-included">Include</div>
            </div>
            
            {participants.map(participant => (
              <div 
                key={participant} 
                className={`participant-row ${!participantShares[participant]?.included ? 'excluded' : ''}`}
              >
                <div className="participant-name">{participant}</div>
                <div className="participant-percentage">
                  <input 
                    type="number"
                    value={participantShares[participant]?.percentage || '0'}
                    onChange={(e) => handlePercentageChange(participant, e.target.value)}
                    min="0"
                    max="100"
                    step="0.01"
                    disabled={splitMode === 'equal'}
                    className={
                      participantShares[participant]?.included ? '' : 'disabled'
                    }
                  />
                  <span className="percentage-symbol">%</span>
                </div>
                <div className="participant-amount">
                  ${calculateAmountForParticipant(participant)}
                </div>
                <div className="participant-included">
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={participantShares[participant]?.included || false}
                      onChange={() => handleParticipantIncludeToggle(participant)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
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