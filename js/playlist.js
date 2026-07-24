/* ================================================================
   Aurora Music Streaming Platform — Playlist Management Engine
   ================================================================ */

'use strict';

class PlaylistManager {
  constructor() {
    const saved = window.storageManager?.getItem('playlists', null);
    this.playlists = saved || [...DEFAULT_PLAYLISTS];
    this.init();
  }

  init() {
    this.dom = {
      playlistListContainer: document.getElementById('sidebarPlaylists'),
      btnCreatePlaylist: document.getElementById('btnCreatePlaylist')
    };

    this.dom.btnCreatePlaylist?.addEventListener('click', () => this.createPlaylistPrompt());
    this.renderSidebarPlaylists();

    window.addEventListener('playlistsUpdated', () => {
      this.save();
      this.renderSidebarPlaylists();
    });
  }

  save() {
    window.storageManager?.setItem('playlists', this.playlists);
  }

  createPlaylistPrompt() {
    const bodyHtml = `
      <div style="margin-bottom:12px;">
        <label style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Playlist Name</label>
        <input type="text" id="plTitleInput" value="My New Mix" style="width:100%; padding:10px; border-radius:8px; background:var(--card); border:1px solid var(--card-border); color:var(--text);" autocomplete="off" />
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Description</label>
        <input type="text" id="plDescInput" value="Hand-picked favorites" style="width:100%; padding:10px; border-radius:8px; background:var(--card); border:1px solid var(--card-border); color:var(--text);" autocomplete="off" />
      </div>
      <div>
        <label style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Cover Image URL / Preset</label>
        <select id="plCoverSelect" style="width:100%; padding:10px; border-radius:8px; background:var(--card); border:1px solid var(--card-border); color:var(--text);">
          <option value="assets/images/cover1.png">Cover 1 — Synth Neon</option>
          <option value="assets/images/cover2.png">Cover 2 — Golden Horizon</option>
          <option value="assets/images/cover3.png">Cover 3 — Deep Blue</option>
          <option value="assets/images/cover4.png">Cover 4 — Electric Pulse</option>
          <option value="assets/images/cover5.png">Cover 5 — Velvet Skies</option>
          <option value="assets/images/cover7.png">Cover 7 — Solar Flare</option>
        </select>
      </div>
    `;

    window.showModal({
      title: 'Create New Playlist',
      bodyHtml: bodyHtml,
      confirmText: 'Create Playlist',
      onConfirm: () => {
        const title = document.getElementById('plTitleInput')?.value.trim() || 'Untitled Playlist';
        const desc = document.getElementById('plDescInput')?.value.trim() || 'User custom mix';
        const cover = document.getElementById('plCoverSelect')?.value || 'assets/images/cover1.png';

        const newPl = {
          id: `pl-${Date.now()}`,
          title: title,
          description: desc,
          cover: cover,
          songs: [1, 2, 4]
        };

        this.playlists.push(newPl);
        this.save();
        window.showToast('fa-solid fa-folder-plus', `Created Playlist "${title}"`);
        window.triggerConfetti();
        this.renderSidebarPlaylists();
        window.dispatchEvent(new CustomEvent('loadPlaylistView', { detail: newPl }));
      }
    });
  }

  editPlaylistPrompt(plId) {
    const pl = this.playlists.find(p => p.id === plId);
    if (!pl) return;

    const bodyHtml = `
      <div style="margin-bottom:12px;">
        <label style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Playlist Name</label>
        <input type="text" id="plTitleEdit" value="${pl.title}" style="width:100%; padding:10px; border-radius:8px; background:var(--card); border:1px solid var(--card-border); color:var(--text);" />
      </div>
      <div style="margin-bottom:12px;">
        <label style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Description</label>
        <input type="text" id="plDescEdit" value="${pl.description || ''}" style="width:100%; padding:10px; border-radius:8px; background:var(--card); border:1px solid var(--card-border); color:var(--text);" />
      </div>
      <div>
        <label style="font-size:0.8rem; color:var(--text-secondary); display:block; margin-bottom:4px;">Cover Artwork URL</label>
        <input type="text" id="plCoverEdit" value="${pl.cover}" style="width:100%; padding:10px; border-radius:8px; background:var(--card); border:1px solid var(--card-border); color:var(--text);" />
      </div>
    `;

    window.showModal({
      title: `Edit "${pl.title}"`,
      bodyHtml: bodyHtml,
      confirmText: 'Save Changes',
      onConfirm: () => {
        pl.title = document.getElementById('plTitleEdit')?.value.trim() || pl.title;
        pl.description = document.getElementById('plDescEdit')?.value.trim() || pl.description;
        pl.cover = document.getElementById('plCoverEdit')?.value.trim() || pl.cover;

        this.save();
        window.showToast('fa-solid fa-pen', 'Playlist details updated');
        this.renderSidebarPlaylists();
        window.dispatchEvent(new CustomEvent('loadPlaylistView', { detail: pl }));
      }
    });
  }

  deletePlaylist(plId) {
    const pl = this.playlists.find(p => p.id === plId);
    if (!pl) return;

    window.showModal({
      title: 'Delete Playlist?',
      bodyHtml: `<p style="color:var(--text-secondary);">Are you sure you want to delete playlist <strong>"${pl.title}"</strong>? This action cannot be undone.</p>`,
      confirmText: 'Delete Playlist',
      onConfirm: () => {
        this.playlists = this.playlists.filter(p => p.id !== plId);
        this.save();
        window.showToast('fa-solid fa-trash', `Deleted "${pl.title}"`);
        this.renderSidebarPlaylists();
        window.navigationRouter?.navigate('home');
      }
    });
  }

  addSongToPlaylist(plId, songId) {
    const pl = this.playlists.find(p => p.id === plId);
    if (!pl) return;
    const id = parseInt(songId);
    if (!pl.songs.includes(id)) {
      pl.songs.push(id);
      this.save();
      window.showToast('fa-solid fa-plus', `Added to "${pl.title}"`);
      window.dispatchEvent(new CustomEvent('playlistsUpdated'));
    } else {
      window.showToast('fa-solid fa-check', `Already in "${pl.title}"`);
    }
  }

  removeSongFromPlaylist(plId, songId) {
    const pl = this.playlists.find(p => p.id === plId);
    if (!pl) return;
    const id = parseInt(songId);
    pl.songs = pl.songs.filter(sId => sId !== id);
    this.save();
    window.showToast('fa-solid fa-minus', `Removed from "${pl.title}"`);
    window.dispatchEvent(new CustomEvent('playlistsUpdated'));
    window.dispatchEvent(new CustomEvent('loadPlaylistView', { detail: pl }));
  }

  reorderPlaylistSongs(plId, fromIndex, toIndex) {
    const pl = this.playlists.find(p => p.id === plId);
    if (!pl || fromIndex < 0 || toIndex < 0 || fromIndex >= pl.songs.length || toIndex >= pl.songs.length) return;
    const moved = pl.songs.splice(fromIndex, 1)[0];
    pl.songs.splice(toIndex, 0, moved);
    this.save();
    window.showToast('fa-solid fa-arrows-up-down', 'Playlist order updated');
    window.dispatchEvent(new CustomEvent('loadPlaylistView', { detail: pl }));
  }

  renderSidebarPlaylists() {
    if (!this.dom.playlistListContainer) return;
    this.dom.playlistListContainer.innerHTML = '';

    this.playlists.forEach(pl => {
      const item = document.createElement('div');
      item.className = 'sidebar-playlist-item';
      item.dataset.plId = pl.id;
      item.innerHTML = `
        <i class="fa-solid fa-compact-disc"></i>
        <span class="pl-name">${pl.title}</span>
        <button class="pl-action-btn" title="Delete"><i class="fa-solid fa-trash"></i></button>
      `;

      item.addEventListener('click', (e) => {
        if (e.target.closest('.pl-action-btn')) {
          e.stopPropagation();
          this.deletePlaylist(pl.id);
          return;
        }
        window.dispatchEvent(new CustomEvent('loadPlaylistView', { detail: pl }));
      });

      this.dom.playlistListContainer.appendChild(item);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.playlistManager = new PlaylistManager();
});
