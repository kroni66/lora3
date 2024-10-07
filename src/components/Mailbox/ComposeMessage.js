import React, { useState } from 'react';

const ComposeMessage = ({ onSend }) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(recipient, subject, content);
    setRecipient('');
    setSubject('');
    setContent('');
  };

  return (
    <form className="compose-message" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        required
      />
      <textarea
        placeholder="Message"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
      ></textarea>
      <button type="submit">Send</button>
    </form>
  );
};

export default ComposeMessage;