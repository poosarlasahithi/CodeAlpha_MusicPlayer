/* ================================================================
   Aurora Music Streaming Platform — Listening History & Recently Played
   ================================================================ */

'use strict';

class HistoryManager {
  constructor() {
    this.history = window.storageManager?.getItem('history', [
      { songId: 1, lastPlayed: Date.now() - 300000, playCount: 8 },
      { songId: 2, lastPlayed: Date.now() - 1800000, playCount: 5 },
      { songId: 5, lastPlayed: Date.now() - 7200000, playCount: 12 },
      { songId: 7, lastPlayed: Date.now() - 86400000, playCount: 3 }
    ]) || [];

    window.addEventListener('trackChanged', (e) => {
      const song = e.detail;
      this.recordPlay(song.id);
    });
  }

  save() {
    window.storageManager?.setItem('history', this.history);
  }

  recordPlay(songId) {
    const id = parseInt(songId);
    const existing = this.history.find(h => h.songId === id);
    if (existing) {
      existing.lastPlayed = Date.now();
      existing.playCount = (existing.playCount || 0) + 1;
      this.history = [existing, ...this.history.filter(h => h.songId !== id)];
    } else {
      this.history.unshift({ songId: id, lastPlayed: Date.now(), playCount: 1 });
    }

    if (this.history.length > 50) this.history = this.history.slice(0, 50);
    this.save();
    window.dispatchEvent(new CustomEvent('historyUpdated'));
  }

  getHistoryWithSongs() {
    return this.history.map(item => {
      const song = CATALOG_SONGS.find(s => s.id === item.songId);
      return song ? { ...item, song } : null;
    }).filter(Boolean);
  }

  clearHistory() {
    this.history = [];
    this.save();
    window.showToast('fa-solid fa-broom', 'Listening history cleared');
    window.dispatchEvent(new CustomEvent('historyUpdated'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.historyManager = new HistoryManager();
});
