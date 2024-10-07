import HouseLvl1Icon from '../../assets/fortress/house_lvl1.png';
import HouseLvl2Icon from '../../assets/fortress/building_house2.png';
import GoldMachineIcon from '../../assets/fortress/gold_machine_lvl50.png'; // Add this line
import MiningOreIcon from '../../assets/fortress/mining_ore.png';

class BuildingManager {
  constructor(username) {
    this.username = username;
    this.buildings = [];
    this.buildingCountdowns = {};
    this.draggedBuilding = null;
    this.dragPosition = { x: 0, y: 0 };
    this.gridSize = 90;
    this.buildingSize = {
      house1: { width: 1, height: 1 },
      house2: { width: 2, height: 2 },
      goldMachine: { width: 2, height: 2 },
      miningOre: { width: 2, height: 2 } // Add this line
    };
    this.countdownInterval = null;
    this.buildingTime = 10000; // 10 seconds in milliseconds
  }

  async fetchBuildings() {
    try {
      const response = await fetch(`http://localhost/api/index.php/buildings?username=${this.username}`);
      const data = await response.json();
      if (data.success) {
        this.buildings = data.buildings;
        this.initializeBuildingCountdowns();
        this.startCountdownTimer();
      }
    } catch (error) {
      console.error('Error fetching buildings:', error);
    }
  }

  initializeBuildingCountdowns() {
    const now = new Date().getTime();
    this.buildingCountdowns = {};
    this.buildings.forEach(building => {
      const timeElapsed = now - building.start_time;
      const remainingTime = Math.max(0, this.buildingTime - timeElapsed);
      if (remainingTime > 0) {
        this.buildingCountdowns[building.id] = Math.ceil(remainingTime / 1000);
      }
    });
  }

  startCountdownTimer() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
    this.countdownInterval = setInterval(() => {
      let allCompleted = true;
      for (const [id, countdown] of Object.entries(this.buildingCountdowns)) {
        if (countdown > 0) {
          this.buildingCountdowns[id] = countdown - 1;
          allCompleted = false;
        }
      }
      if (allCompleted) {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
      }
    }, 1000);
  }

  handleDragStart = (e, buildingType) => {
    this.draggedBuilding = buildingType;
    e.dataTransfer.setDragImage(new Image(), 0, 0);
  };

  handleDragOver = (e, isometricViewRef) => {
    e.preventDefault();
    if (this.draggedBuilding) {
      const rect = isometricViewRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const gridX = Math.round((x / (this.gridSize / 2) + y / (this.gridSize / 4)) / 2);
      const gridY = Math.round((y / (this.gridSize / 4) - x / (this.gridSize / 2)) / 2);

      const highlightX = (gridX - gridY) * (this.gridSize / 2);
      const highlightY = (gridX + gridY) * (this.gridSize / 4);

      this.dragPosition = { x: highlightX, y: highlightY };
    }
  };

  async handleDrop(x, y, resourceManager) {
    if (this.draggedBuilding) {
      const resources = resourceManager.getResources();
      let canPlace = false;
      let resourceCost = {};

      switch (this.draggedBuilding) {
        case 'house1':
        case 'house2':
          canPlace = resources.Wood.amount >= 50 && resources.Stone.amount >= 30;
          resourceCost = { wood: 50, stone: 30, iron: 0, gold: 0 };
          break;
        case 'goldMachine':
          canPlace = resources.Wood.amount >= 100 && resources.Stone.amount >= 50 && resources.Iron.amount >= 20;
          resourceCost = { wood: 100, stone: 50, iron: 20, gold: 0 };
          break;
        case 'miningOre':
          canPlace = resources.Wood.amount >= 80 && resources.Stone.amount >= 40 && resources.Iron.amount >= 10;
          resourceCost = { wood: 80, stone: 40, iron: 10, gold: 0 };
          break;
        default:
          console.error('Unknown building type:', this.draggedBuilding);
          return false;
      }

      if (canPlace) {
        const updatedResources = {
          wood: resources.Wood.amount - resourceCost.wood,
          stone: resources.Stone.amount - resourceCost.stone,
          iron: resources.Iron.amount - resourceCost.iron,
          gold: resources.Gold.amount - resourceCost.gold,
        };

        const buildingStartTime = new Date().getTime();
        const newBuilding = { 
          type: this.draggedBuilding, 
          x, 
          y, 
          start_time: buildingStartTime 
        };

        try {
          const response = await fetch('http://localhost/api/index.php/buildings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: this.username, building: newBuilding }),
          });

          const data = await response.json();
          if (data.success) {
            const buildingWithId = { ...newBuilding, id: data.buildingId };
            this.buildings.push(buildingWithId);
            this.buildingCountdowns[data.buildingId] = this.buildingTime / 1000;
            this.startCountdownTimer();

            await resourceManager.updateResources(updatedResources);
            return true;
          } else {
            console.error('Failed to save building:', data.message);
            alert(`Failed to place building: ${data.message}`);
          }
        } catch (error) {
          console.error('Error saving building:', error);
          alert(`An error occurred while placing the building: ${error.message}`);
        }
      } else {
        alert('Not enough resources to build!');
      }
    }
    this.draggedBuilding = null;
    return false;
  }

  async removeBuilding(buildingId) {
    try {
      const response = await fetch('http://localhost/api/index.php/buildings', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: this.username, buildingId }),
      });
      const data = await response.json();
      if (data.success) {
        this.buildings = this.buildings.filter(b => b.id !== buildingId);
        // Update resources logic should be implemented here
      }
    } catch (error) {
      console.error('Error removing building:', error);
    }
  }

  getBuildingIcon(buildingType) {
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
  }

  getBuildings() {
    return this.buildings;
  }

  getBuildingCountdowns() {
    return this.buildingCountdowns;
  }

  getDraggedBuilding() {
    return this.draggedBuilding;
  }

  getDragPosition() {
    return this.dragPosition;
  }

  calculateGridPosition(e, isometricViewRef) {
    const rect = isometricViewRef.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Calculate grid coordinates
    const gridX = Math.round((x / (this.gridSize / 2) + y / (this.gridSize / 4)) / 2);
    const gridY = Math.round((y / (this.gridSize / 4) - x / (this.gridSize / 2)) / 2);

    // Convert grid coordinates back to pixel coordinates
    const buildingX = (gridX - gridY) * (this.gridSize / 2);
    const buildingY = (gridX + gridY) * (this.gridSize / 4);

    return { x: buildingX, y: buildingY, gridX, gridY };
  }

  // Remove the rotateBuilding method
  // Remove the updateBuildingOnServer method
}

export default BuildingManager;