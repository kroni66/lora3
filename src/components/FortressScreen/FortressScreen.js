import React from 'react';
import ResourceManager from './ResourceManager';
import BuildingManager from './BuildingManager';
import InventoryGrid from './InventoryGrid';
import IsometricView from './IsometricView';
import ResourcesTable from './ResourcesTable';
import BuildingMenu from '../BuildingMenu';
import '../../styles/FortressScreen.css';

class FortressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBuilding: null,
      resources: null,
    };
    this.resourceManager = new ResourceManager(props.username);
    this.buildingManager = new BuildingManager(props.username);
  }

  async componentDidMount() {
    await this.fetchResourcesAndBuildings();
  }

  fetchResourcesAndBuildings = async () => {
    try {
      await this.resourceManager.fetchResources();
      await this.buildingManager.fetchBuildings();
      this.setState({ resources: this.resourceManager.getResources() });
    } catch (error) {
      console.error('Error fetching resources and buildings:', error);
    }
  }

  handleBuildingClick = (building) => {
    if (!this.buildingManager.getBuildingCountdowns()[building.id]) {
      this.setState({ selectedBuilding: building });
    }
  };

  handleUpgradeBuilding = async () => {
    if (this.state.selectedBuilding) {
      // Implement upgrade logic here
      console.log('Upgrade building:', this.state.selectedBuilding);
      // After upgrading, you might want to refresh the building data
      await this.fetchResourcesAndBuildings();
      this.setState({ selectedBuilding: null });
    }
  };

  handleRemoveBuilding = async () => {
    if (this.state.selectedBuilding) {
      await this.buildingManager.removeBuilding(this.state.selectedBuilding.id);
      this.setState({ selectedBuilding: null });
      // Refresh resources after removing a building
      await this.fetchResourcesAndBuildings();
    }
  };

  handleBuildingPlaced = async () => {
    await this.fetchResourcesAndBuildings();
  };

  render() {
    if (!this.state.resources) {
      return <div>Loading...</div>;
    }

    return (
      <div className="fortress-screen">
        <InventoryGrid onDragStart={this.buildingManager.handleDragStart} />
        <div className="fortress-main">
          <IsometricView
            buildingManager={this.buildingManager}
            resourceManager={this.resourceManager}
            onBuildingClick={this.handleBuildingClick}
            onBuildingPlaced={this.handleBuildingPlaced}
            selectedBuilding={this.state.selectedBuilding}
          />
        </div>
        <ResourcesTable resources={this.state.resources} />
        {this.state.selectedBuilding && (
          <BuildingMenu
            building={this.state.selectedBuilding}
            onUpgrade={this.handleUpgradeBuilding}
            onRemove={this.handleRemoveBuilding}
            onClose={() => this.setState({ selectedBuilding: null })}
          />
        )}
      </div>
    );
  }
}

export default FortressScreen;