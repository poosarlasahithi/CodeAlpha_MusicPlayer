/* ================================================================
   Aurora Music Streaming Platform — Instant Search Engine
   ================================================================ */

'use strict';

class SearchEngine {
  constructor() {
    this.dom = {
      searchInput: document.getElementById('appSearchInput'),
      searchResultsContainer: document.getElementById('searchResultsContainer')
    };

    this.init();
  }

  init() {
    if (!this.dom.searchInput) {
      this.dom.searchInput = document.getElementById('appSearchInput');
    }
    if (!this.dom.searchResultsContainer) {
      this.dom.searchResultsContainer = document.getElementById('searchResultsContainer');
    }

    if (this.dom.searchInput) {
      this.dom.searchInput.addEventListener('input', (e) => {
        this.performSearch(e.target.value);
      });
    }
  }

  performSearch(query) {
    const q = query.trim().toLowerCase();
    if (!this.dom.searchResultsContainer) return;

    if (!q) {
      this.dom.searchResultsContainer.innerHTML = '';
      this.dom.searchResultsContainer.style.display = 'none';
      return;
    }

    const songMatches = CATALOG_SONGS.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.artist.toLowerCase().includes(q) ||
      s.album.toLowerCase().includes(q) ||
      s.genre.toLowerCase().includes(q)
    ).slice(0, 8);

    const artistMatches = Object.values(ARTISTS_DATA).filter(a => a.name.toLowerCase().includes(q)).slice(0, 3);
    const genreMatches = GENRES_DATA.filter(g => g.name.toLowerCase().includes(q) || g.id.toLowerCase().includes(q)).slice(0, 3);
    const playlistMatches = (window.playlistManager?.playlists || []).filter(p => p.title.toLowerCase().includes(q)).slice(0, 3);

    this.dom.searchResultsContainer.style.display = 'block';
    this.dom.searchResultsContainer.innerHTML = `
      <div style="font-size:0.75rem; color:var(--accent); font-weight:700; text-transform:uppercase; margin-bottom:12px;">Instant Search Results</div>
    `;

    const totalMatches = songMatches.length + artistMatches.length + genreMatches.length + playlistMatches.length;

    if (totalMatches === 0) {
      this.dom.searchResultsContainer.innerHTML += `
        <div style="color:var(--text-muted); padding:12px; font-size:0.85rem;">No results found matching "${query}"</div>
      `;
      return;
    }

    // Render Songs Results
    if (songMatches.length > 0) {
      songMatches.forEach(song => {
        const item = document.createElement('div');
        item.className = 'search-result-item';
        item.dataset.songId = song.id;
        item.innerHTML = `
          <img src="${song.cover}" class="search-thumb" />
          <div class="search-info">
            <div class="search-title">${this.highlightText(song.title, q)}</div>
            <div class="search-artist">${this.highlightText(song.artist, q)} • ${song.album}</div>
          </div>
          <span class="search-duration">${song.duration}</span>
        `;
        item.addEventListener('click', () => {
          window.playerEngine?.playTrack(song);
          this.dom.searchResultsContainer.style.display = 'none';
        });
        this.dom.searchResultsContainer.appendChild(item);
      });
    }

    // Render Artists Results
    artistMatches.forEach(art => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <img src="${art.photo}" class="search-thumb" style="border-radius:50%;" />
        <div class="search-info">
          <div class="search-title">${this.highlightText(art.name, q)} <span style="font-size:0.65rem; color:var(--accent); border:1px solid var(--accent); padding:1px 4px; border-radius:4px; margin-left:6px;">ARTIST</span></div>
          <div class="search-artist">${art.followers} followers</div>
        </div>
      `;
      item.addEventListener('click', () => {
        window.navigationRouter?.navigate('artistDetail', art.name);
        this.dom.searchResultsContainer.style.display = 'none';
      });
      this.dom.searchResultsContainer.appendChild(item);
    });

    // Render Genre Results
    genreMatches.forEach(g => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <div style="width:36px; height:36px; border-radius:6px; background:${g.gradient}; display:flex; align-items:center; justify-content:center; color:#FFF; font-size:0.9rem;"><i class="fa-solid ${g.icon}"></i></div>
        <div class="search-info">
          <div class="search-title">${this.highlightText(g.name, q)} <span style="font-size:0.65rem; color:var(--accent2); border:1px solid var(--accent2); padding:1px 4px; border-radius:4px; margin-left:6px;">GENRE</span></div>
        </div>
      `;
      item.addEventListener('click', () => {
        window.navigationRouter?.navigate('genreDetail', g.id);
        this.dom.searchResultsContainer.style.display = 'none';
      });
      this.dom.searchResultsContainer.appendChild(item);
    });

    // Render Playlist Results
    playlistMatches.forEach(pl => {
      const item = document.createElement('div');
      item.className = 'search-result-item';
      item.innerHTML = `
        <img src="${pl.cover}" class="search-thumb" />
        <div class="search-info">
          <div class="search-title">${this.highlightText(pl.title, q)} <span style="font-size:0.65rem; color:#EC4899; border:1px solid #EC4899; padding:1px 4px; border-radius:4px; margin-left:6px;">PLAYLIST</span></div>
          <div class="search-artist">${pl.songs.length} tracks</div>
        </div>
      `;
      item.addEventListener('click', () => {
        window.navigationRouter?.navigate('playlistDetail', pl);
        this.dom.searchResultsContainer.style.display = 'none';
      });
      this.dom.searchResultsContainer.appendChild(item);
    });
  }

  highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.searchEngine = new SearchEngine();
});
