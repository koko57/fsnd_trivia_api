import React from 'react';
import '../stylesheets/Modal.css';

const Modal = ({ message, onAccept, onClose }) => {
  return (
    <div className='modal'>
      {message}
      <div className='modal--button-wrapper'>
        <button type='button' onClick={onClose}>
          {onAccept ? 'Cancel' : 'Close'}
        </button>
        {onAccept && (
          <button type='button' onClick={onAccept}>
            OK
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
