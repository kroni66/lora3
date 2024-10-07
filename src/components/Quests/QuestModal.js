import React from 'react';
import './QuestModal.css';

const QuestModal = ({ quest, onClose, onAccept }) => {
  return (
    <div className="quest-modal-overlay">
      <div className="quest-modal">
        <h2>{quest.title}</h2>
        <p>{quest.description}</p>
        <div className="quest-reward">
          <h3>Reward:</h3>
          <p>{quest.reward}</p>
        </div>
        <div className="quest-modal-buttons">
          <button onClick={onAccept}>Accept Quest</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default QuestModal;