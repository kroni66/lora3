import React from 'react';
import { X } from 'lucide-react';
import HouseLvl1Icon from '../../assets/fortress/house_lvl1.png';
import HouseLvl2Icon from '../../assets/fortress/building_house2.png';
import GoldMachineIcon from '../../assets/fortress/gold_machine_lvl50.png';
import MiningOreIcon from '../../assets/fortress/mining_ore.png';

const getBuildingIcon = (buildingType) => {
  switch (buildingType) {
    case 'house1':
      return HouseLvl1Icon;
    case 'house2':
      return HouseLvl2Icon;
    case 'goldMachine':
      return GoldMachineIcon;
    case 'miningOre':
      return MiningOreIcon;
    default:
      return HouseLvl1Icon; // Default icon
  }
};

const BuildingMenu = ({ building, onClose, onUpgrade, onRemove }) => {
  const buildingIcon = getBuildingIcon(building.type);

  return (
    <div className="building-menu">
      <div className="building-menu-header">
        <h3>{building.name}</h3>
        <button className="close-button" onClick={onClose}>
          <X size={24} />
        </button>
      </div>
      <div className="building-menu-content">
        <div className="building-info">
          <img src={buildingIcon} alt={building.name} className="building-icon" />
          <p>Level: {building.level}</p>
          <p>Production: {building.production}/hour</p>
        </div>
        <div className="building-actions">
          <button className="action-button upgrade" onClick={onUpgrade}>
            Upgrade
          </button>
          <button className="action-button remove" onClick={onRemove}>
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuildingMenu;