// Export.js - Generate and export summary
import React, { useState, useEffect, useRef } from 'react';
import './Export.css';

const Export = ({ transactions, balances, debtPairs, participants }) => {
  const [summaryText, setSummaryText] = useState('');
  const [copyStatus, setCopyStatus] = useState(false);
  const statusTimeoutRef = useRef(null);
  
  // Generate the summary text whenever props change
  useEffect(() => {
    let text = "Summary of Expenses\n";
    text += "===================\n\n";
    
    // Add balance summary
    text += "BALANCES:\n";
    Object.entries(balances).forEach(([person, amount]) => {
      if (amount > 0) {
        text += `${person} is owed $${amount.toFixed(2)} in total.\n`;
      } else if (amount < 0) {
        text += `${person} owes $${Math.abs(amount).toFixed(2)} in total.\n`;
      } else {
        text += `${person} is settled (no balance).\n`;
      }
    });
    
    text += "\nDEBT RESOLUTION:\n";
    if (debtPairs.length === 0) {
      text += "All settled up! No payments needed.\n";
    } else {
      debtPairs.forEach(debt => {
        text += `${debt.from} owes ${debt.to} $${debt.amount.toFixed(2)}.\n`;
      });
    }
    
    text += "\nTRANSACTIONS:\n";
    if (transactions.length === 0) {
      text += "No transactions recorded.\n";
    } else {
      transactions.forEach((transaction, index) => {
        text += `${index + 1}. ${transaction.paidBy} paid $${transaction.amount.toFixed(2)} for ${transaction.description || 'Expense'} `;
        text += `(Split between: ${transaction.participants.join(', ')})\n`;
      });
    }
    
    setSummaryText(text);
  }, [transactions, balances, debtPairs, participants]);

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(summaryText)
      .then(() => {
        setCopyStatus(true);
        
        // Clear any existing timeout
        if (statusTimeoutRef.current) {
          clearTimeout(statusTimeoutRef.current);
        }
        
        // Set a new timeout to hide the status
        statusTimeoutRef.current = setTimeout(() => {
          setCopyStatus(false);
        }, 2000);
      })
      .catch(err => console.error('Failed to copy text: ', err));
  };

  const handleDownload = () => {
    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expense-summary.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="export-container">
      <div className="export-actions">
        <button onClick={handleCopyToClipboard} className="copy-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
          Copy to Clipboard
        </button>
        <button onClick={handleDownload} className="download-button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          Download as Text File
        </button>
      </div>
      
      <div className="summary-preview">
        <h3>
          Preview
          <span className="copy-hint">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="16" x2="12" y2="12"></line>
              <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
            Click in the box below to select all
          </span>
        </h3>
        <pre className="summary-text">{summaryText}</pre>
        <div className={`copy-status ${copyStatus ? 'visible' : ''}`}>
          Copied to clipboard!
        </div>
      </div>
    </div>
  );
};

export default Export;
