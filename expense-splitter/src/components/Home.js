// Home.js - Main dashboard with transaction list and balance summary
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './Home.css';
import { CalendarIcon, UserIcon, UsersIcon, TrashIcon } from 'lucide-react';
import Modal from './Modal';

const Home = ({ transactions, onDeleteTransaction, onEditTransaction, onAddTransaction, participants = [] }) => {
  // Track which card is being hovered
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { tripId } = useParams();
  const navigate = useNavigate();

  const handleAddExpenseClick = () => {
    // Check if participants exist
    if (participants.length === 0) {
      // Show the modal if no participants
      setShowModal(true);
    } else {
      // Otherwise proceed to add transaction
      onAddTransaction();
    }
  };

  const handleTransactionClick = (id) => {
    onEditTransaction(id);
  };

  const handleDeleteClick = (e, id) => {
    // Stop event propagation to prevent navigation
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this transaction? This action cannot be undone.')) {
      onDeleteTransaction(id);
    }
  };

  return (
    <div className="home-container">
      <div className="section-header">
        <button 
          className="add-button" 
          onClick={handleAddExpenseClick}
        >
          + Add Expense
        </button>
      </div>
      
      <div className="transaction-list">
        {transactions.length === 0 ? (
          <div className="empty-state">
            {participants.length === 0 ? (
              <>
                <p className="no-transactions">No participants added yet</p>
                <p className="helper-text">You need to add participants before tracking expenses</p>
                <button 
                  className="action-button"
                  onClick={() => navigate(`/trip/${tripId}/participants`)}
                >
                  Add Participants
                </button>
              </>
            ) : (
              <p className="no-transactions">No transactions yet. Add your first expense!</p>
            )}
          </div>
        ) : (
          <div className="transaction-list-table">
            {transactions.map(transaction => (
              <div 
                key={transaction.id} 
                className={`transaction-item ${hoveredCard === transaction.id ? 'hovered' : ''}`}
                onMouseEnter={() => setHoveredCard(transaction.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleTransactionClick(transaction.id)}
              >
                <div className="transaction-content">
                  <div className="transaction-main">
                    <div className="transaction-details">
                      <div className="transaction-name-amount">
                        <h3>{transaction.description || 'Untitled Expense'}</h3>
                        <span className="transaction-amount">${transaction.amount.toFixed(2)}</span>
                      </div>
                      
                      <div className="transaction-metadata">
                        <div className="metadata-item">
                          <UserIcon size={18} />
                          <span>{transaction.paidBy}</span>
                        </div>
                        
                        <div className="metadata-item">
                          <CalendarIcon size={18} />
                          <span>{new Date(transaction.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="delete-transaction-button">
                      <button 
                        onClick={(e) => handleDeleteClick(e, transaction.id)}
                        className="delete-trip-button-icon"
                        aria-label="Delete transaction"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="transaction-participants">
                    <div className="participants-label">Split between:</div>
                    <div className="participants-list">
                      {transaction.participants.map((person, index) => (
                        <span key={index} className="participant-tag">
                          {person}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Participants Required"
        actionButton={
          <button 
            className="action-button"
            onClick={() => {
              setShowModal(false);
              navigate(`/trip/${tripId}/participants`);
            }}
          >
            Add Participants
          </button>
        }
      >
        <p>You need to add at least one participant before you can add expenses.</p>
        <p>Participants are the people who are part of this trip or group and will be sharing expenses.</p>
      </Modal>
    </div>
  );
};

export default Home;
