import meditationData from '../mockData/meditations.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MeditationService {
  constructor() {
    this.sessions = [...meditationData];
    this.history = JSON.parse(localStorage.getItem('meditation-history') || '[]');
  }

  async getAllSessions() {
    await delay(250);
    return [...this.sessions];
  }

  async getHistory() {
    await delay(200);
    return [...this.history];
  }

  async recordSession(sessionData) {
    await delay(300);
    const session = {
      id: Date.now().toString(),
      duration: sessionData.duration,
      type: sessionData.type || 'timer',
      completedAt: new Date().toISOString(),
      notes: sessionData.notes || ''
    };
    this.history.unshift(session);
    localStorage.setItem('meditation-history', JSON.stringify(this.history));
    return { ...session };
  }

  async getSessionById(id) {
    await delay(200);
    const session = this.sessions.find(s => s.id === id);
    if (!session) {
      throw new Error('Session not found');
    }
    return { ...session };
  }
}

export default new MeditationService();