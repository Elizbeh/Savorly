import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, onClose }) => {
  useEffect(() => {
    // Automatically close the toast after 4 seconds
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    // Clean up timer on component unmount
    return () => clearTimeout(timer);
  }, [message, onClose]);

  return (
    <div className="toast-container">
      <div className="toast">
        <span>{message}</span>
        <button className="toast-close-btn" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;
