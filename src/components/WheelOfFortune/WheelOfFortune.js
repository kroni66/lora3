import React, { useState, useEffect, useRef } from 'react';
import { sectors, rand, tot, PI, TAU, arc, friction, angVelMin } from './wheelConfig';
import { drawWheel, rotate } from './wheelUtils';
import '../../styles/WheelOfFortune/WheelOfFortune.css';

const WheelOfFortune = ({ onPrizeWon }) => {
  const [ang, setAng] = useState(0);
  const [angVel, setAngVel] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const wheelRef = useRef(null);
  const spinRef = useRef(null);
  const targetAngleRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    drawWheel(wheelRef.current);
    window.addEventListener('resize', () => drawWheel(wheelRef.current));
    return () => {
      window.removeEventListener('resize', () => drawWheel(wheelRef.current));
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  useEffect(() => {
    if (isSpinning) {
      animationRef.current = requestAnimationFrame(frame);
    }
    return () => cancelAnimationFrame(animationRef.current);
  }, [isSpinning, ang, angVel]);

  const getWinningIndex = (angle) => {
    // Adjust the angle calculation to match the wheel's rotation
    const normalizedAngle = (angle % TAU + TAU) % TAU; // Ensure positive angle
    const adjustedAngle = (normalizedAngle + PI / 2) % TAU; // Offset by PI/2 to align with sectors
    return (tot - Math.floor(adjustedAngle / arc)) % tot;
  };

  const finishSpinning = () => {
    setAngVel(0);
    const finalAngle = targetAngleRef.current % TAU;
    setAng(finalAngle);
    rotate(wheelRef.current, finalAngle);
    const winningIndex = getWinningIndex(finalAngle);
    const winningPrize = sectors[winningIndex].label;
    onPrizeWon(winningPrize);
    setIsSpinning(false);
  };

  const frame = () => {
    if (angVel > angVelMin) {
      setAngVel(prevAngVel => prevAngVel * friction);
      setAng(prevAng => prevAng + angVel);
      rotate(wheelRef.current, ang + angVel);
      animationRef.current = requestAnimationFrame(frame);
    } else {
      finishSpinning();
    }
  };

  const handleSpin = () => {
    if (!isSpinning) {
      const spinAngle = rand(4 * PI, 8 * PI);
      const targetAngle = ang + spinAngle;
      targetAngleRef.current = targetAngle;
      setAngVel(spinAngle / (TAU * 4));
      setIsSpinning(true);
    }
  };

  return (
    <div className="wheel-of-fortune">
      <div className={`wheel-container ${isSpinning ? 'spinning' : ''}`}>
        <canvas ref={wheelRef} id="wheel" width="400" height="400" />
        <button ref={spinRef} id="spin" onClick={handleSpin} disabled={isSpinning}>
          {isSpinning ? 'Spinning...' : 'SPIN'}
        </button>
        <div className="spin-arrow"></div>
      </div>
    </div>
  );
};

export default WheelOfFortune;