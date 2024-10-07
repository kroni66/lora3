import React, { useState } from 'react';
import './CreateClanForm.css';

const CreateClanForm = ({ player, onClanCreated }) => {
  const [clanName, setClanName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (player.gold < 500) {
      alert('Not enough gold to create a clan!');
      return;
    }

    try {
      await onClanCreated(clanName);
      setClanName('');
    } catch (error) {
      console.error('Error creating clan:', error);
      alert('Failed to create clan. Please try again.');
    }
  };

  return (
    <form className="create-clan-form" onSubmit={handleSubmit}>
      <input
        type="text"
        value={clanName}
        onChange={(e) => setClanName(e.target.value)}
        placeholder="Enter clan name"
        required
        className="clan-name-input"
      />
      <button type="submit" className="create-clan-button">
        Create Clan (500 Gold)
      </button>
    </form>
  );
};

export default CreateClanForm;