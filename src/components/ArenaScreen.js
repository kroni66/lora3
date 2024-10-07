import React from 'react';
import '../styles/ArenaScreen.css';
import gladiatorForeground from '../assets/arena/gladiator_foreground.png';

function ArenaScreen({ strength, defense, intelligence, dexterity }) {
  return (
    <div className="arena-screen">
      <h2>Arena</h2>
      <div className="arena-content">
        <button className="arena-button challenge-button">
          Vyzvat nepřítele
        </button>
        <button className="arena-button attack-button">
          Napadnout nepřítele
        </button>
      </div>
      <div className="gladiator-container">
        <img src={gladiatorForeground} alt="Gladiator" className="gladiator-foreground" />
        <div className="chat-bubble">
          Vítej v Aréně, zde poměříš své bojové schopnosti s ostatními!
        </div>
      </div>
    </div>
  );
}

export default ArenaScreen;