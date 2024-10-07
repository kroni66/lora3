import React from 'react';
import defaultAvatarImage from '../../assets/avatars/avatar1.png';

const PlayerCard = ({ player, health, maxHealth, isAnimating }) => {
  const healthPercentage = maxHealth > 0 ? Math.max(0, Math.min(100, (health / maxHealth) * 100)) : 0;
  const displayHealth = Math.max(0, Math.round(health));

  return (
    <div className={`player-card ${isAnimating ? 'attacking' : ''}`}>
      <img 
        src={player.avatarSrc} 
        alt="Player" 
        onError={(e) => {
          console.error('Failed to load player avatar:', e);
          e.target.src = defaultAvatarImage;
        }}
      />
      <div className="health-bar">
        <div 
          className="health-fill" 
          style={{ width: `${healthPercentage}%` }}
        ></div>
      </div>
      <div className="health-text">
        {displayHealth} / {maxHealth}
      </div>
      <div className="attributes">
        <p>Strength: {player.strength}</p>
        <p>Defense: {player.defense}</p>
        <p>Intelligence: {player.intelligence}</p>
        <p>Dexterity: {player.dexterity}</p>
      </div>
    </div>
  );
};

export default PlayerCard;