import React from 'react';
import { Trash2 } from 'lucide-react';

const MessageItem = ({ message, onDelete }) => {
  return (
    <div className="message-item">
      <div className="message-header">
        <div className="message-info">
          <span className="message-sender">{message.sender}</span>
          <span className="message-date">{new Date(message.timestamp).toLocaleString()}</span>
        </div>
        <button className="delete-button" onClick={() => onDelete(message.id)}>
          <Trash2 size={16} />
        </button>
      </div>
      <div className="message-subject">{message.subject}</div>
      <div className="message-content">{message.content}</div>
    </div>
  );
};

export default MessageItem;