import React, { useState, useEffect, useRef } from 'react';
import { ReactComponent as BeerIcon } from '../beer-icon.svg';
import { ReactComponent as FireAnimation } from '../fire-animation.svg';
import tavernImage from '../tavern.jpg';
import '../styles/TavernScreen.css';
import QuestMarker from './Quests/QuestMarker';
import QuestModal from './Quests/QuestModal';
import FightScreen from './FightScreen/FightScreen';
import { useQuests } from './Quests/QuestContext';

// Add this function to fetch mob ID for a quest
const fetchMobIdForQuest = async (questId) => {
  // Replace this with actual API call to fetch mob ID for the quest
  // For now, we'll return a mock mob ID
  console.log(`Fetching mob ID for quest ${questId}`);
  return new Promise((resolve) => {
    setTimeout(() => resolve(Math.floor(Math.random() * 5) + 1), 500);
  });
};

function TavernScreen({ player, level, experience, shakeIcon, onBeerClick, desireForAdventure }) {
  const { quests, activeQuest, completeQuest, fetchQuests } = useQuests();
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [showFightScreen, setShowFightScreen] = useState(false);
  const [fightMobId, setFightMobId] = useState(null);
  const tavernImageRef = useRef(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const updateImageSize = () => {
      if (tavernImageRef.current) {
        setImageSize({
          width: tavernImageRef.current.offsetWidth,
          height: tavernImageRef.current.offsetHeight
        });
      }
    };

    updateImageSize();
    window.addEventListener('resize', updateImageSize);

    return () => window.removeEventListener('resize', updateImageSize);
  }, []);

  const calculateMarkerPosition = (x, y) => {
    const scaleX = imageSize.width / 1200;
    const scaleY = imageSize.height / 675;
    return {
      x: x * scaleX,
      y: y * scaleY
    };
  };

  const handleQuestComplete = async (questId) => {
    const quest = quests.find(q => q.id === questId);
    setSelectedQuest(quest);
    // Fetch mob ID for the quest
    const mobId = quest.mobId || await fetchMobIdForQuest(questId);
    setFightMobId(mobId);
    setShowFightScreen(true);
  };

  const handleFightEnd = (playerWon) => {
    setShowFightScreen(false);
    if (playerWon && selectedQuest) {
      completeQuest(selectedQuest.id);
      fetchQuests();
    }
    setSelectedQuest(null);
    setFightMobId(null);
  };

  if (showFightScreen) {
    return <FightScreen 
      player={player} 
      mobId={fightMobId}
      onFightEnd={handleFightEnd} 
    />;
  }

  return (
    <div className="tavern">
      <div className="tavern-image-container">
        <img 
          ref={tavernImageRef}
          src={tavernImage} 
          alt="Tavern" 
          className="tavern-image"
        />
        {quests.map((quest) => {
          const position = calculateMarkerPosition(quest.position_x, quest.position_y);
          return (
            <QuestMarker
              key={quest.id}
              quest={quest}
              isActive={activeQuest && activeQuest.id === quest.id}
              onClick={() => activeQuest && activeQuest.id === quest.id && setSelectedQuest(quest)}
              position={position}
            />
          );
        })}
        <div className="fire-container">
          <FireAnimation className="fire-animation" />
        </div>
        <div className="desire-meter">
          <div className="desire-fill" style={{ width: `${desireForAdventure}%` }}></div>
          <span className="desire-text">Desire for Adventure: {desireForAdventure}%</span>
        </div>
      </div>
      <div className={`beer-container ${shakeIcon ? 'shake' : ''}`} onClick={onBeerClick}>
        <BeerIcon className="beer-icon" />
      </div>
      <p>Click on quest markers to interact with characters!</p>
      {selectedQuest && (
        <QuestModal
          quest={selectedQuest}
          onClose={() => setSelectedQuest(null)}
          onAccept={() => handleQuestComplete(selectedQuest.id)}
        />
      )}
    </div>
  );
}

export default TavernScreen;