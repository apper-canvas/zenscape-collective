import elementsData from '../mockData/elements.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ElementService {
  constructor() {
    this.elements = [...elementsData];
  }

  async getAll() {
    await delay(200);
    return [...this.elements];
  }

  async getByCategory(category) {
    await delay(200);
    return this.elements.filter(element => element.category === category);
  }

  async getById(id) {
    await delay(150);
    const element = this.elements.find(e => e.id === id);
    if (!element) {
      throw new Error('Element not found');
    }
    return { ...element };
  }
}

export default new ElementService();