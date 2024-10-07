import React from 'react';
import { FaArrowUp, FaTrash, FaTimes } from 'react-icons/fa';

function BuildingMenu({ building, onUpgrade, onRemove, onClose }) {
  return (
    <div className="building-menu">
      <div className="building-menu-header">
        <h3>{building.type} (Level {building.level || 1})</h3>
        <button className="close-button" onClick={onClose}>
          <FaTimes />
        </button>
      </div>
      <div className="building-menu-content">
        <div className="building-info">
          <img src={`/assets/buildings/${building.type.toLowerCase()}.png`} alt={building.type} className="building-icon" />
          <p>Production: {building.production}/hour</p>
          <p>Health: {building.health}/{building.maxHealth}</p>
        </div>
        <div className="building-actions">
          <button className="action-button upgrade" onClick={onUpgrade}>
            <FaArrowUp />
            <span>Upgrade</span>
          </button>
          <button className="action-button remove" onClick={onRemove}>
            <FaTrash />
            <span>Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default BuildingMenu;