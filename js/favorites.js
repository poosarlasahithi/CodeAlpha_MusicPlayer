/* ================================================================
   Aurora Music Streaming Platform — Favorites Manager
   ================================================================ */

'use strict';

class FavoritesManager {
  constructor() {
    const savedFavs = window.storageManager?.getItem('favorites', [1, 2, 5, 7, 9]);
    this.favorites = new Set(savedFavs);
  }

  save() {
    window.storageManager?.setItem('favorites', [...this.favorites]);
  }

  has(songId) {
    return this.favorites.has(songId);
  }

  toggle(songId) {
    const id = parseInt(songId);
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      window.showToast('fa-regular fa-heart', 'Removed from Favorites');
    } else {
      this.favorites.add(id);
      window.showToast('fa-solid fa-heart', 'Added to Favorites');
      window.triggerConfetti();
    }
    this.save();
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
  }

  remove(songId) {
    const id = parseInt(songId);
    if (this.favorites.has(id)) {
      this.favorites.delete(id);
      this.save();
      window.showToast('fa-regular fa-heart', 'Removed from Favorites');
      window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    }
  }

  getFavoriteSongs() {
    return CATALOG_SONGS.filter(s => this.favorites.has(s.id));
  }

  playAll() {
    const favSongs = this.getFavoriteSongs();
    if (favSongs.length === 0) {
      window.showToast('fa-solid fa-triangle-exclamation', 'No favorite songs to play');
      return;
    }
    if (window.queueManager) {
      window.queueManager.queue = [...favSongs];
      window.queueManager.currentIndex = 0;
      window.queueManager.save();
      window.queueManager.render();
    }
    window.playerEngine?.playTrack(favSongs[0]);
    window.showToast('fa-solid fa-play', `Playing All Favorites (${favSongs.length} tracks)`);
  }

  shuffleAll() {
    const favSongs = this.getFavoriteSongs();
    if (favSongs.length === 0) {
      window.showToast('fa-solid fa-triangle-exclamation', 'No favorite songs to shuffle');
      return;
    }
    const shuffled = [...favSongs].sort(() => Math.random() - 0.5);
    if (window.queueManager) {
      window.queueManager.queue = [...shuffled];
      window.queueManager.currentIndex = 0;
      window.queueManager.save();
      window.queueManager.render();
    }
    window.playerEngine?.playTrack(shuffled[0]);
    window.showToast('fa-solid fa-shuffle', `Shuffling Favorites (${shuffled.length} tracks)`);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.favoritesManager = new FavoritesManager();
});
