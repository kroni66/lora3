import React, { useState, useEffect } from 'react';
import MailboxModal from './MailboxModal';
import MessageList from './MessageList';
import ComposeMessage from './ComposeMessage';
import './MailboxStyles.css';

const Mailbox = ({ isOpen, onClose, username, onMessageRead }) => {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (isOpen) {
      fetchMessages();
    }
  }, [isOpen]);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost/api/index.php/messages?username=${username}`);
      const data = await response.json();
      if (data.success) {
        setMessages(data.messages);
        // Mark messages as read
        data.messages.forEach(message => {
          if (!message.is_read) {
            markMessageAsRead(message.id);
          }
        });
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markMessageAsRead = async (messageId) => {
    try {
      await fetch(`http://localhost/api/index.php/messages/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messageId }),
      });
      onMessageRead();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const sendMessage = async (recipient, subject, content) => {
    try {
      const response = await fetch('http://localhost/api/index.php/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender: username,
          recipient,
          subject,
          content,
        }),
      });
      const data = await response.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const deleteMessage = async (messageId) => {
    try {
      const response = await fetch(`http://localhost/api/index.php/messages/${messageId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      if (data.success) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <MailboxModal isOpen={isOpen} onClose={onClose}>
      <h2>Mailbox</h2>
      <MessageList messages={messages} onDeleteMessage={deleteMessage} />
      <ComposeMessage onSend={sendMessage} />
    </MailboxModal>
  );
};

export default Mailbox;