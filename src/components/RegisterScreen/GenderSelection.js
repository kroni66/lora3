import React from 'react';

function GenderSelection({ gender, setGender }) {
  return (
    <div className="gender-selection">
      <h3>Choose your gender:</h3>
      <div className="gender-options">
        <button type="button" onClick={() => setGender('m')} className={gender === 'm' ? 'selected' : ''}>Male</button>
        <button type="button" onClick={() => setGender('f')} className={gender === 'f' ? 'selected' : ''}>Female</button>
      </div>
    </div>
  );
}

export default GenderSelection;