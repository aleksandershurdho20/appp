import React from 'react';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, title, onSave,onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" >
      <div className="modal-content">
        <div className="modal-header">
            <h2 className='modal-title'>{title}</h2>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>
        <div className="modal-body">
          {children}
        </div>

        <div className="modal-actions">
            <button onClick={onSave} className='modal-btn save'>Save</button>
            <button onClick={onCancel} className='modal-btn cancel'> Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
