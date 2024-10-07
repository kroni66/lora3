import React, { useState, useEffect } from 'react';
import { X, ArrowUp, ArrowDown } from 'lucide-react';
import '../styles/CharacterScreen.css';
import defaultAvatarImage from '../assets/avatars/avatar1.png';

function CharacterScreen({ onClose, avatarCode, strength, defense, intelligence, dexterity, experience, level, onUpdateAttributes }) {
  const [avatarSrc, setAvatarSrc] = useState(defaultAvatarImage);

  useEffect(() => {
    const loadAvatar = async () => {
      if (avatarCode) {
        const [className, gender, number] = avatarCode.split('_');
        try {
          const avatarModule = await import(`../assets/classes/avatar/${className}/${avatarCode}.webp`);
          setAvatarSrc(avatarModule.default);
        } catch (error) {
          console.error(`Failed to load avatar image: ${error.message}`);
          setAvatarSrc(defaultAvatarImage);
        }
      } else {
        setAvatarSrc(defaultAvatarImage);
      }
    };

    loadAvatar();
  }, [avatarCode]);

  const [allocatedPoints, setAllocatedPoints] = useState({
    strength: 0,
    defense: 0,
    intelligence: 0,
    dexterity: 0,
  });

  const totalAllocatedPoints = Object.values(allocatedPoints).reduce((a, b) => a + b, 0);
  const availablePoints = Math.floor(experience / 100) - (level - 1);

  const handleAllocatePoint = (stat, value) => {
    setAllocatedPoints((prev) => ({
      ...prev,
      [stat]: Math.max(0, prev[stat] + value),
    }));
  };

  const handleConfirm = () => {
    onUpdateAttributes({
      strength: strength + allocatedPoints.strength,
      defense: defense + allocatedPoints.defense,
      intelligence: intelligence + allocatedPoints.intelligence,
      dexterity: dexterity + allocatedPoints.dexterity,
    }, totalAllocatedPoints);
    onClose();
  };

  return (
    <div className="character-screen-overlay">
      <div className="character-screen-modal">
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="character-header">
          <img src={avatarSrc} alt="Avatar" className="avatar-image-large" />
          <div className="character-info">
            <h2>Character Attributes</h2>
            <p className="level-display">Level {level}</p>
            <div className="exp-bar">
              <div className="exp-fill" style={{ width: `${(experience % 100) / 100 * 100}%` }}></div>
            </div>
            <p className="exp-text">{experience % 100} / 100 XP</p>
          </div>
        </div>
        <p className="available-points">Available Points: {availablePoints - totalAllocatedPoints}</p>
        <div className="attributes-container">
          {['strength', 'defense', 'intelligence', 'dexterity'].map((attr) => (
            <div key={attr} className="attribute-row">
              <span className="attribute-name">{attr.charAt(0).toUpperCase() + attr.slice(1)}</span>
              <div className="attribute-value-container">
                <span className="attribute-value">{eval(attr) + allocatedPoints[attr]}</span>
                <div className="attribute-buttons">
                  <button 
                    onClick={() => handleAllocatePoint(attr, 1)} 
                    disabled={totalAllocatedPoints >= availablePoints}
                    className="attribute-button increment-button"
                    aria-label={`Increase ${attr}`}
                  >
                    <ArrowUp size={16} />
                  </button>
                  <button 
                    onClick={() => handleAllocatePoint(attr, -1)} 
                    disabled={allocatedPoints[attr] <= 0}
                    className="attribute-button decrement-button"
                    aria-label={`Decrease ${attr}`}
                  >
                    <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button 
          onClick={handleConfirm} 
          disabled={totalAllocatedPoints === 0}
          className="confirm-button"
        >
          Confirm Changes
        </button>
      </div>
    </div>
  );
}

export default CharacterScreen;