import React, { useRef, useState, useEffect } from 'react';
import { FaHourglass } from 'react-icons/fa'; // Import the hourglass icon

const IsometricView = ({ buildingManager, resourceManager, onBuildingClick, onBuildingPlaced, selectedBuilding }) => {
  const isometricViewRef = useRef(null);
  const floorViewAngle = 30; // Adjusted to match CSS
  const [ghostBuilding, setGhostBuilding] = useState(null);
  const [, setCountdownTrigger] = useState(0);
  const [hoveredBuilding, setHoveredBuilding] = useState(null);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setCountdownTrigger(prev => prev + 1);
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    if (buildingManager.getDraggedBuilding()) {
      const { x, y, gridX, gridY } = buildingManager.calculateGridPosition(e, isometricViewRef.current);
      setGhostBuilding({ type: buildingManager.getDraggedBuilding(), x, y, gridX, gridY });
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    if (buildingManager.getDraggedBuilding()) {
      const { x, y, gridX, gridY } = buildingManager.calculateGridPosition(e, isometricViewRef.current);
      const success = await buildingManager.handleDrop(x, y, resourceManager);
      if (success) {
        onBuildingPlaced();
      }
      setGhostBuilding(null);
    }
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    if (buildingManager.getDraggedBuilding()) {
      const { x, y, gridX, gridY } = buildingManager.calculateGridPosition(e, isometricViewRef.current);
      setGhostBuilding({ type: buildingManager.getDraggedBuilding(), x, y, gridX, gridY });
    }
  };

  const handleDragLeave = () => {
    setGhostBuilding(null);
  };

  const renderBuildings = () => {
    return buildingManager.getBuildings().map((building) => {
      const buildingIcon = buildingManager.getBuildingIcon(building.type);
      const size = buildingManager.buildingSize[building.type] || { width: 1, height: 1 };
      const countdowns = buildingManager.getBuildingCountdowns();
      const isUnderConstruction = countdowns[building.id] > 0;

      const buildingStyle = {
        left: `${building.x}px`,
        top: `${building.y}px`,
        width: `${size.width * buildingManager.gridSize}px`,
        height: `${size.height * buildingManager.gridSize}px`,
        backgroundImage: `url(${buildingIcon})`,
        backgroundSize: 'contain',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        cursor: isUnderConstruction ? 'default' : 'pointer',
        transform: `
          translate(-50%, -50%)
          rotateX(${-floorViewAngle}deg)
          rotateZ(35deg)
          scale(${isUnderConstruction ? 1.4 : (hoveredBuilding === building.id ? 1.5 : 1.4)})
          translate3d(${-size.width * buildingManager.gridSize / 2}px, ${-size.height * buildingManager.gridSize / 2}px, 0)
        `,
        transformOrigin: 'center bottom',
      };

      return (
        <div 
          key={building.id} 
          className={`building ${isUnderConstruction ? 'under-construction' : ''}`}
          style={buildingStyle}
          onClick={() => onBuildingClick(building)}
          onMouseEnter={() => !isUnderConstruction && setHoveredBuilding(building.id)}
          onMouseLeave={() => !isUnderConstruction && setHoveredBuilding(null)}
        >
          {isUnderConstruction && (
            <div className="building-countdown-container">
              <FaHourglass className="hourglass-icon" />
              <div className="building-countdown">
                {countdowns[building.id]}s
              </div>
            </div>
          )}
        </div>
      );
    });
  };

  const renderGhostBuilding = () => {
    if (!ghostBuilding) return null;

    const buildingIcon = buildingManager.getBuildingIcon(ghostBuilding.type);
    const size = buildingManager.buildingSize[ghostBuilding.type] || { width: 1, height: 1 };

    const ghostStyle = {
      left: `${ghostBuilding.x}px`,
      top: `${ghostBuilding.y}px`,
      width: `${size.width * buildingManager.gridSize}px`,
      height: `${size.height * buildingManager.gridSize}px`,
      backgroundImage: `url(${buildingIcon})`,
      backgroundSize: 'contain',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      opacity: 0.5,
      transform: `
        translate(-50%, -50%)
        rotateX(${-floorViewAngle}deg)
        rotateZ(35deg)
        scale(1.4)
        translate3d(${-size.width * buildingManager.gridSize / 2}px, ${-size.height * buildingManager.gridSize / 2}px, 0)
      `,
      transformOrigin: 'center bottom',
    };

    return (
      <div
        className="building building-ghost"
        style={ghostStyle}
      />
    );
  };

  return (
    <div 
      ref={isometricViewRef}
      className="isometric-view" 
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      style={{
        transform: `rotateX(${floorViewAngle}deg) rotateZ(-45deg) scale(0.8)`,
      }}
    >
      <div className="grass-tile"></div>
      <div className="buildings-container">
        {renderBuildings()}
        {renderGhostBuilding()}
      </div>
    </div>
  );
};

export default IsometricView;