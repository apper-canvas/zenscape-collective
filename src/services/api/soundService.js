import soundsData from '../mockData/sounds.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SoundService {
  constructor() {
    this.sounds = [...soundsData];
    this.activeSounds = new Map();
  }

  async getAll() {
    await delay(200);
    return [...this.sounds];
  }

  async getById(id) {
    await delay(150);
    const sound = this.sounds.find(s => s.id === id);
    if (!sound) {
      throw new Error('Sound not found');
    }
    return { ...sound };
  }

  async playSound(id, volume = 0.5) {
    await delay(100);
    const sound = await this.getById(id);
    
    // For demo purposes, we'll simulate sound playback
    if (this.activeSounds.has(id)) {
      this.activeSounds.get(id).volume = volume;
    } else {
      this.activeSounds.set(id, {
        id,
        name: sound.name,
        volume,
        isPlaying: true,
        startTime: Date.now()
      });
    }
    
    return true;
  }

  async pauseSound(id) {
    await delay(100);
    if (this.activeSounds.has(id)) {
      this.activeSounds.get(id).isPlaying = false;
    }
    return true;
  }

  async stopSound(id) {
    await delay(100);
    this.activeSounds.delete(id);
    return true;
  }

  async setVolume(id, volume) {
    await delay(50);
    if (this.activeSounds.has(id)) {
      this.activeSounds.get(id).volume = Math.max(0, Math.min(1, volume));
    }
    return true;
  }

  getActiveSounds() {
    return Array.from(this.activeSounds.values());
  }

  async stopAllSounds() {
    await delay(100);
    this.activeSounds.clear();
    return true;
  }
}

export default new SoundService();