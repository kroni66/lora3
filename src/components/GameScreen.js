import React, { useState, useEffect } from 'react';
import GameMenu from './GameMenu';
import TavernScreen from './TavernScreen';
import FortressScreen from './FortressScreen/FortressScreen';
import WheelOfFortuneScreen from './WheelOfFortune/WheelOfFortuneScreen';
import ArenaScreen from './ArenaScreen';
import CharacterScreen from './CharacterScreen';
import LeaderBoardScreen from './LeaderBoard/LeaderBoardScreen';
import ClanScreen from './Clan/ClanScreen'; // Import the ClanScreen component
import '../styles/GameScreen.css';
import avatarImage from '../assets/avatars/avatar1.png';
import FightScreen from './FightScreen/FightScreen'; // Assuming this is the correct import path

function GameScreen({ username, experience, level, desireForAdventure, playerClass, onBeerClick, onLogout, onLocationChange, strength, defense, intelligence, dexterity, onUpdateAttributes, gold, avatarCode }) {
  const [currentLocation, setCurrentLocation] = useState('tavern');
  const [shakeIcon, setShakeIcon] = useState(false);
  const [showCharacterScreen, setShowCharacterScreen] = useState(false);
  const [showFightScreen, setShowFightScreen] = useState(false); // Assuming this is the correct state variable

  useEffect(() => {
    if (level > 1) {
      setShakeIcon(true);
      const timer = setTimeout(() => setShakeIcon(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [level]);

  const handleLocationChange = (location) => {
    if (location === 'arena' && level < 20) {
      alert('You need to be at least level 20 to access the Arena!');
      return;
    }
    console.log('Changing location to:', location);
    setCurrentLocation(location);
    onLocationChange(location);
  };

  const handlePrizeWon = (prize) => {
    console.log(`Player won: ${prize}`);
    // Here you can add logic to update the player's resources based on the prize
    // For example:
    if (prize.includes('Gold')) {
      const goldAmount = parseInt(prize);
      // Update player's gold
      console.log(`Adding ${goldAmount} gold to player's inventory`);
    } else if (prize.includes('XP')) {
      const xpAmount = parseInt(prize);
      // Update player's XP
      console.log(`Adding ${xpAmount} XP to player's experience`);
    }
    // You might want to call a function passed from props to update the player's state in the parent component
  };

  const handleAvatarClick = () => {
    setShowCharacterScreen(true);
  };

  const handleSendInvite = async (inviteeUsername) => {
    // This function will be implemented in the ClanScreen component
    console.log(`Sending clan invite to ${inviteeUsername}`);
  };

  const player = {
    id: username, // Assuming username is unique and can be used as ID
    username: username,
    maxHealth: 100, // You may want to calculate this based on level or other factors
    strength,
    defense,
    intelligence,
    dexterity,
    avatarSrc: `../assets/classes/avatar/${playerClass}/${avatarCode}.webp`,
  };

  const handleFightEnd = () => {
    setShowFightScreen(false);
  };

  return (
    <div className="game-screen-wrapper">
      <div className="game-screen">
        <GameMenu
          currentLocation={currentLocation}
          onLocationChange={handleLocationChange}
          playerLevel={level}
          playerName={username}
          playerClass={playerClass} // Ensure this prop is being passed
          experience={experience}
          gold={gold} // Make sure this prop is passed
          onAvatarClick={() => setShowCharacterScreen(true)}
          avatarCode={avatarCode}
        />
        <main className="game-content">
          <div className="content-header">
            <h2>{currentLocation.charAt(0).toUpperCase() + currentLocation.slice(1)}</h2>
          </div>
          <div className="content-body">
            {currentLocation === 'tavern' && (
              <TavernScreen
                player={player}
                level={level}
                experience={experience}
                shakeIcon={shakeIcon}
                onBeerClick={onBeerClick}
                desireForAdventure={desireForAdventure}
              />
            )}
            {currentLocation === 'fortress' && <FortressScreen username={username} />}
            {currentLocation === 'wheel of fortune' && <WheelOfFortuneScreen onPrizeWon={handlePrizeWon} />}
            {currentLocation === 'arena' && (
              <ArenaScreen
                strength={strength}
                defense={defense}
                intelligence={intelligence}
                dexterity={dexterity}
              />
            )}
            {currentLocation === 'leaderboard' && <LeaderBoardScreen />}
            {currentLocation === 'clan' && (
              <ClanScreen
                player={{ username, level, gold }}
                onSendInvite={handleSendInvite}
              />
            )}
            {showFightScreen && <FightScreen player={player} onFightEnd={handleFightEnd} />}
          </div>
        </main>
      </div>
      {showCharacterScreen && (
        <CharacterScreen
          onClose={() => setShowCharacterScreen(false)}
          avatarCode={avatarCode}
          strength={strength}
          defense={defense}
          intelligence={intelligence}
          dexterity={dexterity}
          experience={experience}
          level={level}
          onUpdateAttributes={onUpdateAttributes}
        />
      )}
    </div>
  );
}

export default GameScreen;