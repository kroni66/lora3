import React from 'react';
import './QuestMarker.css';

const QuestMarker = ({ quest, isActive, onClick, position }) => {
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`
  };

  return (
    <div 
      className={`quest-marker ${isActive ? 'active' : ''}`}
      style={style}
      onClick={isActive ? onClick : undefined}
    >
      ?
    </div>
  );
};

export default QuestMarker;