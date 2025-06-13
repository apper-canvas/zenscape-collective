import journalData from '../mockData/journal.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class JournalService {
  constructor() {
    this.entries = [...journalData];
  }

  async getAll() {
    await delay(300);
    return [...this.entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  async getById(id) {
    await delay(250);
    const entry = this.entries.find(e => e.id === id);
    if (!entry) {
      throw new Error('Journal entry not found');
    }
    return { ...entry };
  }

  async create(entryData) {
    await delay(400);
    const newEntry = {
      id: Date.now().toString(),
      title: entryData.title || 'Untitled',
      content: entryData.content || '',
      mood: entryData.mood || 'neutral',
      tags: entryData.tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.entries.unshift(newEntry);
    return { ...newEntry };
  }

  async update(id, updates) {
    await delay(350);
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    this.entries[index] = { 
      ...this.entries[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    return { ...this.entries[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.entries.findIndex(e => e.id === id);
    if (index === -1) {
      throw new Error('Journal entry not found');
    }
    this.entries.splice(index, 1);
    return true;
  }

  async searchEntries(query) {
    await delay(250);
    const searchTerm = query.toLowerCase();
    return this.entries.filter(entry => 
      entry.title.toLowerCase().includes(searchTerm) ||
      entry.content.toLowerCase().includes(searchTerm) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }
}

export default new JournalService();