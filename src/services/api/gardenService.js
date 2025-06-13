import gardensData from '../mockData/gardens.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class GardenService {
  constructor() {
    this.gardens = [...gardensData];
  }

  async getAll() {
    await delay(300);
    return [...this.gardens];
  }

  async getById(id) {
    await delay(250);
    const garden = this.gardens.find(g => g.id === id);
    if (!garden) {
      throw new Error('Garden not found');
    }
    return { ...garden };
  }

  async create(gardenData) {
    await delay(400);
    const newGarden = {
      id: Date.now().toString(),
      name: gardenData.name || 'Untitled Garden',
      elements: gardenData.elements || [],
      createdAt: new Date().toISOString(),
      thumbnail: gardenData.thumbnail || null,
      sounds: gardenData.sounds || []
    };
    this.gardens.unshift(newGarden);
    return { ...newGarden };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.gardens.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Garden not found');
    }
    this.gardens[index] = { ...this.gardens[index], ...updates };
    return { ...this.gardens[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.gardens.findIndex(g => g.id === id);
    if (index === -1) {
      throw new Error('Garden not found');
    }
    this.gardens.splice(index, 1);
    return true;
  }

  async duplicate(id) {
    await delay(400);
    const garden = await this.getById(id);
    const duplicated = {
      ...garden,
      id: Date.now().toString(),
      name: `${garden.name} (Copy)`,
      createdAt: new Date().toISOString()
    };
    this.gardens.unshift(duplicated);
    return { ...duplicated };
  }
}

export default new GardenService();