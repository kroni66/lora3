import React from 'react';
import woodenFrameImage from '../../assets/clan/wooden_frame.webp';
import './ClanList.css';

const ClanList = ({ clans }) => {
  return (
    <div className="clan-list">
      <h3 className="clan-list-title">Clans of the Realm</h3>
      <div className="clan-grid">
        {clans.map((clan) => (
          <div key={clan.id} className="clan-item">
            <div className="clan-item-content">
              <h4>{clan.name}</h4>
              <p>Members: {clan.memberCount}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClanList;