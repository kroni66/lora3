import React, { useState, useEffect } from 'react';
import logoImage from '../assets/loralogo.png';
import { Trophy, Shield, Swords, Beer, Users, ScrollText, Castle, Home, Lock } from 'lucide-react';
import '../styles/GameMenu.css';
import defaultAvatarImage from '../assets/avatars/avatar1.png'; // Add a default avatar image
import { FaDharmachakra } from 'react-icons/fa';
import { calculateExperienceProgress, calculateExperienceNeeded, calculateExperiencePercentage, MAX_LEVEL } from '../utils/PlayerLevel';
import goldIcon from '../assets/icons/gold.webp';

function GameMenu({ currentLocation, onLocationChange, playerLevel, playerName, playerClass, experience, gold, onAvatarClick, avatarCode }) {
  const [levelUpEffect, setLevelUpEffect] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState('');

  useEffect(() => {
    if (playerLevel > 1) {
      setLevelUpEffect(true);
      const timer = setTimeout(() => setLevelUpEffect(false), 3000); // Effect lasts for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [playerLevel]);

  useEffect(() => {
    const loadAvatar = () => {
      const defaultAvatarCode = 'warrior_m_1'; // Set a default avatar code
      const code = avatarCode || defaultAvatarCode;
      const defaultClass = 'warrior'; // Set a default class
      const classToUse = playerClass || defaultClass;
      const src = `/assets/classes/avatar/${classToUse}/${code}.webp`;
      console.log('Attempting to load avatar from:', src);
      setAvatarSrc(src);
    };

    loadAvatar();
  }, [avatarCode, playerClass]);

  const menuItems = [
    { name: 'Tavern', icon: Beer },
    { name: 'Arena', icon: Swords, minLevel: 20 }, // Add minLevel property
    { name: 'Armory', icon: Shield },
    { name: 'Tower', icon: Castle },
    { name: 'Fortress', icon: Home },
    { name: 'Leaderboard', icon: Trophy },
    { name: 'Clan', icon: Users },
    { name: 'Friend List', icon: ScrollText },
    { name: 'Wheel of Fortune', icon: FaDharmachakra },
  ];

  // Experience calculations
  const experienceNeeded = calculateExperienceNeeded(playerLevel);
  const experienceProgress = calculateExperienceProgress(experience, playerLevel);
  const experiencePercentage = calculateExperiencePercentage(experience, playerLevel);
  const experienceToNextLevel = experienceNeeded - experienceProgress;

  return (
    <nav className="game-menu">
      <div className="game-logo">
        <img src={logoImage} alt="Game Logo" />
      </div>
      <div className={`avatar-container ${levelUpEffect ? 'level-up' : ''}`} onClick={onAvatarClick}>
        <img 
          src={avatarSrc} 
          alt="Player Avatar" 
          className="avatar-image" 
          onError={(e) => {
            console.error('Failed to load avatar:', e);
            e.target.src = defaultAvatarImage;
          }}
        />
        <div className="level-badge">{playerLevel}</div>
      </div>
      <div className="player-info">
        <div className="player-name">{playerName}</div>
        <div className="player-gold">
          <img src={goldIcon} alt="Gold" className="gold-icon" />
          <span>{gold !== undefined ? gold : 'N/A'}</span>
        </div>
        <div className="exp-bar-container">
          <div className="exp-bar">
            <div className="exp-fill" style={{ width: `${experiencePercentage}%` }}></div>
          </div>
          <div className="exp-text">
            <span className="current-exp">{experienceProgress}</span>
            <span className="max-exp">/ {experienceNeeded} XP</span>
          </div>
        </div>
        <div className="exp-details">
          <div>Next Level: {playerLevel < MAX_LEVEL ? `${experienceNeeded} XP` : 'Max Level'}</div>
          <div>Remaining: {playerLevel < MAX_LEVEL ? `${experienceToNextLevel} XP` : 'N/A'}</div>
          <div>Total XP: {experience}</div>
        </div>
      </div>
      <div className="menu-items">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          const isLocked = item.minLevel && playerLevel < item.minLevel;
          return (
            <button
              key={item.name}
              className={`menu-item ${currentLocation === item.name.toLowerCase() ? 'active' : ''} ${isLocked ? 'locked' : ''}`}
              onClick={() => !isLocked && onLocationChange(item.name.toLowerCase())}
              disabled={isLocked}
            >
              <span className="menu-icon">
                <IconComponent size={24} />
                {isLocked && <Lock size={16} className="lock-icon" />}
              </span>
              <span className="menu-text">
                {item.name}
                {isLocked && ` (Lvl ${item.minLevel}+)`}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default GameMenu;