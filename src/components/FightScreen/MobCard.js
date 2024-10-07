import React from 'react';
import defaultMobImage from '../../assets/mobs/spider_low_1.webp';

const MobCard = ({ mob, health, maxHealth, isAnimating }) => {
  const healthPercentage = maxHealth > 0 ? Math.max(0, Math.min(100, (health / maxHealth) * 100)) : 0;
  const displayHealth = Math.max(0, Math.round(health));

  return (
    <div className={`mob-card ${isAnimating ? 'attacking' : ''}`}>
      <img 
        src={`/assets/mobs/${mob.image_src}`} 
        alt={mob.name} 
        onError={(e) => {
          console.error('Failed to load mob image:', e);
          e.target.src = defaultMobImage;
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
        <p>Strength: {mob.strength}</p>
        <p>Defense: {mob.defense}</p>
        <p>Intelligence: {mob.intelligence}</p>
        <p>Dexterity: {mob.dexterity}</p>
      </div>
    </div>
  );
};

export default MobCard;