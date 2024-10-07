import React from 'react';
import HouseLvl1Icon from '../../assets/fortress/house_lvl1.png';
import HouseLvl2Icon from '../../assets/fortress/building_house2.png';
import GoldMachineIcon from '../../assets/fortress/gold_machine_lvl50.png';
import MiningOreIcon from '../../assets/fortress/mining_ore.png';
import LegendaryIcon from '../../assets/fortress/legendary_icon.png';
import ArmyIcon from '../../assets/fortress/army_icon.png';
import BuildingIcon from '../../assets/fortress/building_icon.png';
import MinersIcon from '../../assets/fortress/miners_icon.png';
// Import icons for miners and army units/buildings

const InventoryGrid = ({ onDragStart }) => (
  <div className="inventory-grid">
    <div className="inventory-section">
      <h3>
        <img src={BuildingIcon} alt="Buildings" className="section-icon" />
        Buildings
      </h3>
      <div className="inventory-items">
        <div className="inventory-item" draggable onDragStart={(e) => onDragStart(e, 'house1')}>
          <img src={HouseLvl1Icon} alt="House Level 1" className="inventory-icon" />
        </div>
        <div className="inventory-item" draggable onDragStart={(e) => onDragStart(e, 'house2')}>
          <img src={HouseLvl2Icon} alt="House Level 2" className="inventory-icon" />
        </div>
        <div className="inventory-item" draggable onDragStart={(e) => onDragStart(e, 'goldMachine')}>
          <img src={GoldMachineIcon} alt="Gold Machine" className="inventory-icon" />
        </div>
      </div>
    </div>
    <div className="inventory-section">
      <h3>
        <img src={MinersIcon} alt="Miners" className="section-icon" />
        Miners
      </h3>
      <div className="inventory-items">
        <div className="inventory-item" draggable onDragStart={(e) => onDragStart(e, 'miningOre')}>
          <img src={MiningOreIcon} alt="Mining Ore" className="inventory-icon" />
        </div>
      </div>
    </div>
    <div className="inventory-section">
      <h3>
        <img src={ArmyIcon} alt="Army" className="section-icon" />
        Army
      </h3>
      <div className="inventory-items">
        {/* Add army items here */}
      </div>
    </div>
    <div className="inventory-section">
      <h3>
        <img src={LegendaryIcon} alt="Legendary" className="section-icon" />
        Legendary
      </h3>
      <div className="inventory-items">
        {/* Add legendary items here when available */}
      </div>
    </div>
  </div>
);

export default InventoryGrid;