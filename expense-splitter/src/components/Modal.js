import React from 'react';
import './Modal.css';
import { XIcon } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children, actionButton }) => {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close-button" onClick={onClose}>
            <XIcon size={18} />
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>
        {actionButton && (
          <div className="modal-footer">
            {actionButton}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 