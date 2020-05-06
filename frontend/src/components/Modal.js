import React from 'react';
import '../stylesheets/Modal.css';
import Button from './Button';

const Modal = ({ message, onAccept, onClose }) => {
  return (
    <div className='modal'>
      {message}
      <div className='modal--button-wrapper'>
        <Button
          type='button'
          onClick={onClose}
          text={onAccept ? 'Cancel' : 'Close'}
        />
        {onAccept && <Button type='button' onClick={onAccept} text='OK' />}
      </div>
    </div>
  );
};

export default Modal;
