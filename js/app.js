/* ================================================================
   Aurora Music Streaming Platform — Master Orchestrator & Context Menu
   ================================================================ */

'use strict';

class AppState {
  constructor() {
    this.currentTrack = CATALOG_SONGS[0];
    this.currentIndex = 0;
    this.isPlaying = false;
    this.repeatMode = 'off'; // 'off', 'all', 'one'
    this.isShuffled = false;
    this.playbackSpeed = 1.0;
    this.isVinylMode = false;
  }
}

window.appState = new AppState();

// ===== Context Menu System =====
class ContextMenuSystem {
  constructor() {
    this.menuEl = null;
    this.targetSongId = null;
    this.init();
  }

  init() {
    this.menuEl = document.createElement('div');
    this.menuEl.className = 'context-menu';
    this.menuEl.innerHTML = `
      <div class="context-menu-item" data-action="play"><i class="fa-solid fa-play"></i> Play Now</div>
      <div class="context-menu-item" data-action="queue"><i class="fa-solid fa-list-check"></i> Add to Queue</div>
      <div class="context-menu-item" data-action="playlist"><i class="fa-solid fa-folder-plus"></i> Add to Playlist</div>
      <div class="context-menu-item" data-action="fav"><i class="fa-solid fa-heart"></i> Toggle Favorite</div>
      <div class="context-menu-item" data-action="info"><i class="fa-solid fa-circle-info"></i> Track Information</div>
      <div class="context-menu-item" data-action="share"><i class="fa-solid fa-share-nodes"></i> Share Track</div>
    `;
    document.body.appendChild(this.menuEl);

    document.addEventListener('click', () => this.hide());
    document.addEventListener('contextmenu', (e) => {
      const songItem = e.target.closest('[data-song-id]');
      if (songItem) {
        e.preventDefault();
        this.targetSongId = parseInt(songItem.dataset.songId);
        this.show(e.clientX, e.clientY);
      } else {
        this.hide();
      }
    });

    this.menuEl.addEventListener('click', (e) => {
      const item = e.target.closest('.context-menu-item');
      if (!item || !this.targetSongId) return;
      const action = item.dataset.action;
      const song = CATALOG_SONGS.find(s => s.id === this.targetSongId);
      if (!song) return;

      if (action === 'play') {
        window.playerEngine?.playTrack(song);
      } else if (action === 'queue') {
        window.queueManager?.addTrack(song);
      } else if (action === 'playlist') {
        const userPls = window.playlistManager?.playlists || [];
        if (userPls.length === 0) {
          window.playlistManager?.createPlaylistPrompt();
        } else {
          const plNames = userPls.map((p, idx) => `${idx + 1}. ${p.title}`).join('\n');
          const choice = prompt(`Select playlist number to add "${song.title}":\n${plNames}`, '1');
          if (choice) {
            const idx = parseInt(choice) - 1;
            if (userPls[idx]) {
              window.playlistManager?.addSongToPlaylist(userPls[idx].id, song.id);
            }
          }
        }
      } else if (action === 'fav') {
        window.favoritesManager?.toggle(song.id);
      } else if (action === 'info') {
        const infoHtml = `
          <div style="display:flex; gap:16px; align-items:center; margin-bottom:16px;">
            <img src="${song.cover}" style="width:80px; height:80px; border-radius:8px; object-fit:cover;" />
            <div>
              <h4 style="font-size:1.1rem; margin-bottom:4px;">${song.title}</h4>
              <p style="font-size:0.85rem; color:var(--text-secondary);">${song.artist}</p>
            </div>
          </div>
          <table style="width:100%; font-size:0.85rem; color:var(--text-secondary); border-collapse:collapse;">
            <tr><td style="padding:4px 0; font-weight:600;">Album:</td><td>${song.album}</td></tr>
            <tr><td style="padding:4px 0; font-weight:600;">Genre:</td><td>${song.genre}</td></tr>
            <tr><td style="padding:4px 0; font-weight:600;">Release Year:</td><td>${song.year}</td></tr>
            <tr><td style="padding:4px 0; font-weight:600;">Duration:</td><td>${song.duration}</td></tr>
          </table>
        `;
        window.showModal({ title: 'Track Metadata', bodyHtml: infoHtml, confirmText: 'Close', cancelText: '' });
      } else if (action === 'share') {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(window.location.href);
        }
        window.showToast('fa-solid fa-share-nodes', `Copied link for "${song.title}" to clipboard!`);
      }
      this.hide();
    });
  }

  show(x, y) {
    this.menuEl.style.left = `${Math.min(x, window.innerWidth - 200)}px`;
    this.menuEl.style.top = `${Math.min(y, window.innerHeight - 240)}px`;
    this.menuEl.classList.add('active');
  }

  hide() {
    this.menuEl.classList.remove('active');
  }
}

// ===== Right Panel Tab Switching (Lyrics / Queue / Analytics) =====
function setupRightPanelTabs() {
  const tabBtnLyrics = document.getElementById('tabBtnLyrics');
  const tabBtnQueue = document.getElementById('tabBtnQueue');
  const tabBtnStats = document.getElementById('tabBtnStats');

  const panelLyrics = document.getElementById('panelLyrics');
  const panelQueue = document.getElementById('panelQueue');
  const panelStats = document.getElementById('panelStats');

  function switchRightPanel(activeTab) {
    [tabBtnLyrics, tabBtnQueue, tabBtnStats].forEach(b => b?.classList.remove('active'));
    [panelLyrics, panelQueue, panelStats].forEach(p => p && (p.style.display = 'none'));

    if (activeTab === 'lyrics') {
      tabBtnLyrics?.classList.add('active');
      if (panelLyrics) panelLyrics.style.display = 'flex';
    } else if (activeTab === 'queue') {
      tabBtnQueue?.classList.add('active');
      if (panelQueue) panelQueue.style.display = 'block';
      window.queueManager?.render();
    } else if (activeTab === 'stats') {
      tabBtnStats?.classList.add('active');
      if (panelStats) panelStats.style.display = 'block';
      window.analyticsEngine?.renderDashboard();
    }
  }

  tabBtnLyrics?.addEventListener('click', () => switchRightPanel('lyrics'));
  tabBtnQueue?.addEventListener('click', () => switchRightPanel('queue'));
  tabBtnStats?.addEventListener('click', () => switchRightPanel('stats'));
}

// ===== Global Initialization =====
document.addEventListener('DOMContentLoaded', () => {
  window.contextMenu = new ContextMenuSystem();
  setupRightPanelTabs();

  // Floating background notes
  const notesContainer = document.getElementById('floatingNotesContainer');
  if (notesContainer) {
    const noteIcons = ['fa-music', 'fa-note-sticky', 'fa-compact-disc', 'fa-sliders', 'fa-headphones'];
    for (let i = 0; i < 15; i++) {
      const note = document.createElement('i');
      note.className = `fa-solid ${noteIcons[i % noteIcons.length]} floating-note`;
      note.style.left = `${Math.random() * 95}vw`;
      note.style.animationDelay = `${Math.random() * 8}s`;
      note.style.animationDuration = `${6 + Math.random() * 6}s`;
      notesContainer.appendChild(note);
    }
  }

  // Hydrate initial home view
  window.navigationRouter?.navigate('home');
});
