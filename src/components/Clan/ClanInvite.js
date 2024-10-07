import React, { useState } from 'react';

const ClanInvite = ({ onSendInvite }) => {
  const [inviteeUsername, setInviteeUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSendInvite(inviteeUsername);
    setInviteeUsername('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inviteeUsername}
        onChange={(e) => setInviteeUsername(e.target.value)}
        placeholder="Enter player username"
        required
      />
      <button type="submit">Send Clan Invite</button>
    </form>
  );
};

export default ClanInvite;