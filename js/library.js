/* ================================================================
   Aurora Music Streaming Platform — Library & Downloads View Controller
   ================================================================ */

'use strict';

class LibraryController {
  constructor() {
    this.downloadedSongIds = window.storageManager?.getItem('downloads', [1, 2, 4, 5, 7, 9]) || [1, 2, 4, 5, 7, 9];
    this.downloadProgress = 100;
  }

  getDownloadedSongs() {
    return CATALOG_SONGS.filter(s => this.downloadedSongIds.includes(s.id));
  }

  downloadSong(songId) {
    const id = parseInt(songId);
    if (this.downloadedSongIds.includes(id)) {
      window.showToast('fa-solid fa-circle-check', 'Track already available offline');
      return;
    }

    window.showToast('fa-solid fa-circle-down', 'Downloading track for offline playback...');
    setTimeout(() => {
      this.downloadedSongIds.push(id);
      window.storageManager?.setItem('downloads', this.downloadedSongIds);
      window.showToast('fa-solid fa-circle-check', 'Track downloaded successfully!');
      window.dispatchEvent(new CustomEvent('downloadsUpdated'));
    }, 1200);
  }

  removeDownload(songId) {
    const id = parseInt(songId);
    this.downloadedSongIds = this.downloadedSongIds.filter(i => i !== id);
    window.storageManager?.setItem('downloads', this.downloadedSongIds);
    window.showToast('fa-solid fa-trash', 'Removed from downloads');
    window.dispatchEvent(new CustomEvent('downloadsUpdated'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.libraryController = new LibraryController();
});
