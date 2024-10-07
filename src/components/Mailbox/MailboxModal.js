import React from 'react';
import { X } from 'lucide-react';

const MailboxModal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="mailbox-overlay">
      <div className="mailbox-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default MailboxModal;