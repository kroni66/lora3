import React from 'react';

const FightLog = ({ log }) => (
  <div className="fight-log">
    {log.map((entry, index) => (
      <p key={index}>{entry}</p>
    ))}
  </div>
);

export default FightLog;