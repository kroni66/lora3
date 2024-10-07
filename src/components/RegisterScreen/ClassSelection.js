import React from 'react';
import warriorIcon from '../../assets/classes/warrior_class.png';
import berserkIcon from '../../assets/classes/berserk_class.png';
import druidIcon from '../../assets/classes/druid_class.png';
import mageIcon from '../../assets/classes/mage_class.png';
import warrior from '../../assets/classes/warrior_bg.png';
import berserk from '../../assets/classes/berserk_bg.png';
import druid from '../../assets/classes/druid_bg.png';
import mage from '../../assets/classes/mage_bg.png';

const classes = [
  { id: 1, name: 'Warrior', icon: warriorIcon, bg: warrior },
  { id: 2, name: 'Berserk', icon: berserkIcon, bg: berserk },
  { id: 3, name: 'Druid', icon: druidIcon, bg: druid },
  { id: 4, name: 'Mage', icon: mageIcon, bg: mage },
];

function ClassSelection({ selectedClass, setSelectedClass }) {
  return (
    <div className="class-selection">
      <h3>Choose your class:</h3>
      <div className="class-options">
        {classes.map((classOption) => (
          <div
            key={classOption.id}
            className={`class-option ${selectedClass && selectedClass.id === classOption.id ? 'selected' : ''}`}
            onClick={() => setSelectedClass(classOption)}
          >
            <img src={classOption.icon} alt={classOption.name} className="class-icon" />
            <span>{classOption.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassSelection;