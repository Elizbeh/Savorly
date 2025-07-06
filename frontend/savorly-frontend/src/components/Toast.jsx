import React, { useEffect } from 'react';
import './Toast.css';

const Toast = ({ message, onClose , type= 'info'}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  // Normalize message: extract string from object if necessary
  const getMessageText = (msg) => {
  if (!msg) return '';
  if (typeof msg === 'string') return msg;
  if (msg.text) return msg.text;
  if (msg.message) return msg.message;
  try {
    return JSON.stringify(msg);
  } catch {
    return 'An error occurred.';
  }
};


  return (
<div className={`toast-container`}>
      <div className={`toast toast-${type}`}>
        <span>{getMessageText(message)}</span>
        <button className="toast-close-btn" onClick={onClose} aria-label="Close">
          &times;
        </button>
      </div>
    </div>
  );
};

export default Toast;

