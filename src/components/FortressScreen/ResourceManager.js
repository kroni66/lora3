import { ReactComponent as WoodIcon } from '../../assets/wood-icon.svg';
import { ReactComponent as StoneIcon } from '../../assets/stone-icon.svg';
import { ReactComponent as IronIcon } from '../../assets/iron-icon.svg';
import { ReactComponent as GoldIcon } from '../../assets/gold-icon.svg';

class ResourceManager {
  constructor(username) {
    this.username = username;
    this.resources = {
      Wood: { amount: 0, icon: WoodIcon },
      Stone: { amount: 0, icon: StoneIcon },
      Iron: { amount: 0, icon: IronIcon },
      Gold: { amount: 0, icon: GoldIcon },
    };
  }

  async fetchResources() {
    try {
      const response = await fetch(`http://localhost/api/index.php/resources?username=${this.username}`);
      const data = await response.json();
      if (data.success) {
        this.setResources(data.resources);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  }

  setResources(newResources) {
    this.resources = {
      Wood: { ...this.resources.Wood, amount: newResources.wood },
      Stone: { ...this.resources.Stone, amount: newResources.stone },
      Iron: { ...this.resources.Iron, amount: newResources.iron },
      Gold: { ...this.resources.Gold, amount: newResources.gold },
    };
  }

  getResources() {
    return this.resources;
  }

  async updateResources(updatedResources) {
    try {
      const response = await fetch('http://localhost/api/index.php/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: this.username,
          resources: updatedResources,
        }),
      });
      const data = await response.json();
      if (data.success) {
        this.setResources(updatedResources);
      } else {
        console.error('Failed to update resources:', data.message);
      }
    } catch (error) {
      console.error('Error updating resources:', error);
    }
  }
}

export default ResourceManager;