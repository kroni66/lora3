import React from 'react';

function Building({ building, onClick }) {
  return (
    <div className="building" onClick={onClick}>
      <h3>{building.name}</h3>
      <p>Level: {building.level}</p>
    </div>
  );
}

export default Building;