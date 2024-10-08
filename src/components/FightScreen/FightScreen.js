import React, { useState, useEffect, useCallback } from "react";
import React, { useState, useEffect, useCallback } from 'react';
import PlayerCard from './PlayerCard';
import MobCard from './MobCard';
import { fetchMob, startFight, performTurn, endFight } from './fightAPI';
import './FightScreen.css';

const FightScreen = ({ player, onFightEnd }) => {
  const [mob, setMob] = useState(null);
  const [playerHealth, setPlayerHealth] = useState(player.maxHealth);
  const [mobHealth, setMobHealth] = useState(0);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [fightId, setFightId] = useState(null);
  const [isFightOver, setIsFightOver] = useState(false);
  const [fightResult, setFightResult] = useState(null);
  const [damageDealt, setDamageDealt] = useState(null);
  const [playerDamage, setPlayerDamage] = useState(null);
  const [mobDamage, setMobDamage] = useState(null);

  useEffect(() => {
    const initializeFight = async () => {
      try {
        const mobData = await fetchMob();
        setMob(mobData);
        setMobHealth(mobData.max_health);
        const newFightId = await startFight(player.id, mobData.id);
        setFightId(newFightId);
      } catch (error) {
        console.error('Error initializing fight:', error);
      }
    };
    initializeFight();
  }, [player.id]);

const memoizedHandleTurn = useCallback(memoizedHandleTurn, [fightId, mob, player]);
  const memoizedHandleTurn = useCallback(async () => {
    if (!mob || isAnimating || isFightOver) return;

    setIsAnimating(true);
    const result = await performTurn(fightId, isPlayerTurn, player, mob);

    if (isPlayerTurn) {
      setMobDamage(result.damage);
      setMobHealth(prevHealth => Math.max(0, prevHealth - result.damage));
    } else {
      setPlayerDamage(result.damage);
      setPlayerHealth(prevHealth => Math.max(0, prevHealth - result.damage));
    }

    setTimeout(() => {
      setIsAnimating(false);
      setIsPlayerTurn(!isPlayerTurn);
      setPlayerDamage(null);
      setMobDamage(null);

      if (mobHealth <= 0) {
        setIsFightOver(true);
        setFightResult('win');
        endFight(fightId);
      } else if (playerHealth <= 0) {
        setIsFightOver(true);
        setFightResult('lose');
        endFight(fightId);
      }
    }, 1000);
  }, [mob, isAnimating, isFightOver, fightId, isPlayerTurn, player, mobHealth, playerHealth]);

  useEffect(() => {
    if (fightId && mob && !isFightOver) {
      const turnInterval = setInterval(memoizedHandleTurn, 2000);
      return () => clearInterval(turnInterval);
    }
  }, [fightId, mob, isFightOver, memoizedHandleTurn]);

  const handleContinue = () => {
    onFightEnd(fightResult === 'win');
  };

  if (!mob) return <div>Loading...</div>;

  return (
    <div className="fight-screen">
      <div className="character-container">
        <PlayerCard 
          player={player} 
          health={playerHealth}
          maxHealth={player.maxHealth}
          isAnimating={isPlayerTurn && isAnimating} 
        />
        {playerDamage && (
          <div className="damage-text player-damage" key={`player-${Date.now()}`}>
            {playerDamage}
          </div>
        )}
      </div>
      <div className="character-container">
        <MobCard 
          mob={mob} 
          health={mobHealth}
          maxHealth={mob.max_health}
          isAnimating={!isPlayerTurn && isAnimating} 
        />
        {mobDamage && (
          <div className="damage-text mob-damage" key={`mob-${Date.now()}`}>
            {mobDamage}
          </div>
        )}
      </div>
      {isFightOver && (
        <div className="fight-result-modal">
          <h2>{fightResult === 'win' ? "Vítězství!" : "Porážka!"}</h2>
          <p>{fightResult === 'win' ? "Vyhráli jste bitvu!" : "Prohráli jste bitvu!"}</p>
          <button onClick={handleContinue}>Pokračovat</button>
        </div>
      )}
    </div>
  );
};

export default FightScreen;