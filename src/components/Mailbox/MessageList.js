import React from 'react';
import MessageItem from './MessageItem';

const MessageList = ({ messages, onDeleteMessage }) => {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} onDelete={onDeleteMessage} />
      ))}
    </div>
  );
};

export default MessageList;