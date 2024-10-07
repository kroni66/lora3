import React from 'react';
import '../../styles/WheelOfFortune/PrizeAnnouncement.css';

const PrizeAnnouncement = ({ prize }) => {
  if (!prize) return null;

  return (
    <div className="prize-announcement">
      <h2>Congratulations!</h2>
      <p>You won: <span className="prize">{prize}</span></p>
    </div>
  );
};

export default PrizeAnnouncement;