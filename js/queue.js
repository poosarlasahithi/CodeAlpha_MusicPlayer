/* ================================================================
   Aurora Music Streaming Platform — Up-Next Queue Manager
   ================================================================ */

'use strict';

class QueueManager {
  constructor() {
    this.queue = window.storageManager?.getItem('queue', [...CATALOG_SONGS]) || [...CATALOG_SONGS];
    this.currentIndex = 0;

    window.addEventListener('trackChanged', (e) => {
      const song = e.detail;
      const idx = this.queue.findIndex(s => s.id === song.id);
      if (idx !== -1) {
        this.currentIndex = idx;
      } else {
        this.queue.splice(this.currentIndex + 1, 0, song);
        this.currentIndex += 1;
      }
      this.save();
      this.render();
    });
  }

  save() {
    window.storageManager?.setItem('queue', this.queue);
  }

  addTrack(song) {
    if (!song) return;
    this.queue.push(song);
    this.save();
    window.showToast('fa-solid fa-list-check', `Added "${song.title}" to Queue`);
    this.render();
  }

  addNext(song) {
    if (!song) return;
    this.queue.splice(this.currentIndex + 1, 0, song);
    this.save();
    window.showToast('fa-solid fa-play-next', `Play Next: "${song.title}"`);
    this.render();
  }

  removeTrack(index) {
    if (index < 0 || index >= this.queue.length) return;
    const removed = this.queue.splice(index, 1)[0];
    if (index < this.currentIndex) this.currentIndex--;
    this.save();
    window.showToast('fa-solid fa-trash', `Removed "${removed.title}" from Queue`);
    this.render();
  }

  moveTrack(fromIndex, toIndex) {
    if (fromIndex < 0 || fromIndex >= this.queue.length || toIndex < 0 || toIndex >= this.queue.length) return;
    const item = this.queue.splice(fromIndex, 1)[0];
    this.queue.splice(toIndex, 0, item);
    if (this.currentIndex === fromIndex) this.currentIndex = toIndex;
    else if (fromIndex < this.currentIndex && toIndex >= this.currentIndex) this.currentIndex--;
    else if (fromIndex > this.currentIndex && toIndex <= this.currentIndex) this.currentIndex++;
    this.save();
    this.render();
  }

  clearQueue() {
    if (this.queue.length <= 1) return;
    const current = this.queue[this.currentIndex];
    this.queue = current ? [current] : [];
    this.currentIndex = 0;
    this.save();
    window.showToast('fa-solid fa-broom', 'Queue cleared');
    this.render();
  }

  saveQueueAsPlaylist() {
    if (this.queue.length === 0) return;
    window.showPrompt('Save Queue as Playlist', 'Enter playlist title:', 'My Queued Mix', (title) => {
      if (!title) return;
      const newPl = {
        id: `pl-${Date.now()}`,
        title: title,
        description: 'Saved from play queue',
        cover: this.queue[0]?.cover || 'assets/images/cover1.png',
        songs: this.queue.map(s => s.id)
      };

      const userPlaylists = window.storageManager?.getItem('playlists', [...DEFAULT_PLAYLISTS]) || [...DEFAULT_PLAYLISTS];
      userPlaylists.push(newPl);
      window.storageManager?.setItem('playlists', userPlaylists);
      window.showToast('fa-solid fa-folder-plus', `Queue saved as "${title}"`);
      window.dispatchEvent(new CustomEvent('playlistsUpdated'));
    });
  }

  render() {
    const queueContainer = document.getElementById('queueListContainer');
    if (!queueContainer) return;
    queueContainer.innerHTML = '';

    // Queue Header & Actions
    const header = document.createElement('div');
    header.style.display = 'flex';
    header.style.alignItems = 'center';
    header.style.justifyContent = 'space-between';
    header.style.marginBottom = '12px';
    header.innerHTML = `
      <span style="font-size:0.8rem; color:var(--text-secondary); text-transform:uppercase; letter-spacing:0.5px;">Queue (${this.queue.length})</span>
      <div style="display:flex; gap:8px;">
        <button class="btn btn-ghost" id="btnSaveQueue" style="padding:4px 8px; font-size:0.75rem;" title="Save Queue"><i class="fa-solid fa-bookmark"></i> Save</button>
        <button class="btn btn-ghost" id="btnClearQueue" style="padding:4px 8px; font-size:0.75rem;" title="Clear Queue"><i class="fa-solid fa-trash"></i> Clear</button>
      </div>
    `;
    queueContainer.appendChild(header);

    header.querySelector('#btnClearQueue')?.addEventListener('click', () => this.clearQueue());
    header.querySelector('#btnSaveQueue')?.addEventListener('click', () => this.saveQueueAsPlaylist());

    if (this.queue.length === 0) {
      queueContainer.innerHTML += `<div style="text-align:center; padding:30px; color:var(--text-muted); font-size:0.85rem;">Queue is empty</div>`;
      return;
    }

    this.queue.forEach((song, idx) => {
      const isCurrent = idx === this.currentIndex;
      const item = document.createElement('div');
      item.className = `playlist-card visible ${isCurrent ? 'active' : ''}`;
      item.style.padding = '8px 10px';
      item.style.marginBottom = '6px';
      item.dataset.songId = song.id;
      item.dataset.queueIdx = idx;

      item.innerHTML = `
        <span class="card-number" style="font-size:0.75rem;">${isCurrent ? '<i class="fa-solid fa-volume-high" style="color:var(--accent);"></i>' : idx + 1}</span>
        <img src="${song.cover}" style="width:36px; height:36px; border-radius:4px; object-fit:cover;" />
        <div class="card-info" style="min-width:0; flex:1;">
          <div class="card-title" style="font-size:0.85rem; ${isCurrent ? 'color:var(--accent); font-weight:700;' : ''}">${song.title}</div>
          <div class="card-artist" style="font-size:0.75rem;">${song.artist}</div>
        </div>
        <div style="display:flex; align-items:center; gap:4px;">
          ${idx > 0 ? `<button class="btn-queue-move" data-dir="-1" title="Move Up"><i class="fa-solid fa-chevron-up"></i></button>` : ''}
          ${idx < this.queue.length - 1 ? `<button class="btn-queue-move" data-dir="1" title="Move Down"><i class="fa-solid fa-chevron-down"></i></button>` : ''}
          <button class="btn-queue-remove" title="Remove"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.btn-queue-remove')) {
          e.stopPropagation();
          this.removeTrack(idx);
          return;
        }
        if (e.target.closest('.btn-queue-move')) {
          e.stopPropagation();
          const dir = parseInt(e.target.closest('.btn-queue-move').dataset.dir);
          this.moveTrack(idx, idx + dir);
          return;
        }
        window.playerEngine?.playTrack(song);
      });

      queueContainer.appendChild(item);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.queueManager = new QueueManager();
});
