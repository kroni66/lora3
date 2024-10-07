import React, { useState } from 'react';
import WheelOfFortune from './WheelOfFortune';
import PrizeAnnouncement from './PrizeAnnouncement';
import '../../styles/WheelOfFortune/WheelOfFortuneScreen.css';
import merchantImage from '../../assets/merchant_wheel.png';

const WheelOfFortuneScreen = ({ onPrizeWon }) => {
  const [lastPrize, setLastPrize] = useState(null);

  const handlePrizeWon = (prize) => {
    setLastPrize(prize);
    onPrizeWon(prize);
  };

  return (
    <div className="wheel-of-fortune-screen">
      <h1 className="game-title">Wheel of Fortune</h1>
      <div className="wheel-of-fortune-container">
        <WheelOfFortune onPrizeWon={handlePrizeWon} />
      </div>
      <img src={merchantImage} alt="Merchant" className="merchant-image" />
      <PrizeAnnouncement prize={lastPrize} />
    </div>
  );
};

export default WheelOfFortuneScreen;