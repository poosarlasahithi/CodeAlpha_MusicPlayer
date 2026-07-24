/* ================================================================
   Aurora Music Streaming Platform — SPA View Router & Main Renderer
   ================================================================ */

'use strict';

class NavigationRouter {
  constructor() {
    this.mainEl = document.querySelector('.app-main');
    this.currentView = 'home';
    this.currentParams = null;
    this.init();
  }

  init() {
    // Sidebar Navigation Click Handlers
    document.getElementById('navHome')?.addEventListener('click', () => this.navigate('home'));
    document.getElementById('navBrowse')?.addEventListener('click', () => this.navigate('browse'));
    document.getElementById('navLibrary')?.addEventListener('click', () => this.navigate('library'));
    document.getElementById('navFavorites')?.addEventListener('click', () => this.navigate('favorites'));
    document.getElementById('navRecent')?.addEventListener('click', () => this.navigate('recent'));
    document.getElementById('navDownloads')?.addEventListener('click', () => this.navigate('downloads'));

    // Custom Event Listeners for View Switching
    window.addEventListener('loadPlaylistView', (e) => this.navigate('playlistDetail', e.detail));
    window.addEventListener('loadAlbumView', (e) => this.navigate('albumDetail', e.detail));
    window.addEventListener('loadArtistView', (e) => this.navigate('artistDetail', e.detail));
    window.addEventListener('loadGenreView', (e) => this.navigate('genreDetail', e.detail));
  }

  navigate(viewName, params = null) {
    this.currentView = viewName;
    this.currentParams = params;

    // Update active state in sidebar nav
    const navItems = {
      home: 'navHome',
      browse: 'navBrowse',
      library: 'navLibrary',
      favorites: 'navFavorites',
      recent: 'navRecent',
      downloads: 'navDownloads'
    };

    document.querySelectorAll('.sidebar-nav .nav-item').forEach(el => el.classList.remove('active'));
    if (navItems[viewName]) {
      document.getElementById(navItems[viewName])?.classList.add('active');
    }

    // Smooth transition fade-out & re-render
    if (this.mainEl) {
      this.mainEl.style.opacity = '0';
      this.mainEl.style.transform = 'translateY(8px)';
      setTimeout(() => {
        this.renderCurrentView();
        this.mainEl.style.opacity = '1';
        this.mainEl.style.transform = 'translateY(0)';
      }, 150);
    }
  }

  renderCurrentView() {
    if (!this.mainEl) return;
    this.mainEl.innerHTML = '';

    // Render Global Search Header Bar
    const headerBar = document.createElement('div');
    headerBar.style.display = 'flex';
    headerBar.style.alignItems = 'center';
    headerBar.style.gap = '16px';
    headerBar.style.marginBottom = '24px';
    headerBar.innerHTML = `
      <div class="search-bar-wrapper" style="flex:1; margin-bottom:0;">
        <i class="fa-solid fa-magnifying-glass"></i>
        <input type="search" id="appSearchInput" placeholder="Search songs, artists, albums, or genres..." autocomplete="off" />
      </div>
      <button class="btn btn-ghost" onclick="window.voiceController?.toggle()" title="Voice Search" style="padding:12px 18px;">
        <i class="fa-solid fa-microphone" style="color:var(--accent);"></i>
      </button>
    `;
    this.mainEl.appendChild(headerBar);

    // Search Results Container Dropdown
    const searchContainer = document.createElement('div');
    searchContainer.id = 'searchResultsContainer';
    searchContainer.style.display = 'none';
    searchContainer.style.background = 'var(--bg-elevated)';
    searchContainer.style.border = '1px solid var(--glass-border)';
    searchContainer.style.borderRadius = 'var(--radius-sm)';
    searchContainer.style.padding = '16px';
    searchContainer.style.marginBottom = '24px';
    this.mainEl.appendChild(searchContainer);

    // Re-bind search input event
    if (window.searchEngine) {
      window.searchEngine.dom.searchInput = headerBar.querySelector('#appSearchInput');
      window.searchEngine.dom.searchResultsContainer = searchContainer;
      window.searchEngine.init();
    }

    // View Content Container
    const viewContainer = document.createElement('div');
    viewContainer.id = 'activeViewContainer';
    this.mainEl.appendChild(viewContainer);

    switch (this.currentView) {
      case 'home':
        this.renderHomeView(viewContainer);
        break;
      case 'browse':
        this.renderBrowseView(viewContainer, this.currentParams);
        break;
      case 'library':
        this.renderLibraryView(viewContainer, this.currentParams);
        break;
      case 'favorites':
        this.renderFavoritesView(viewContainer);
        break;
      case 'recent':
        this.renderRecentView(viewContainer);
        break;
      case 'downloads':
        this.renderDownloadsView(viewContainer);
        break;
      case 'playlistDetail':
        this.renderPlaylistDetailView(viewContainer, this.currentParams);
        break;
      case 'albumDetail':
        this.renderAlbumDetailView(viewContainer, this.currentParams);
        break;
      case 'artistDetail':
        this.renderArtistDetailView(viewContainer, this.currentParams);
        break;
      case 'genreDetail':
        this.renderGenreDetailView(viewContainer, this.currentParams);
        break;
      default:
        this.renderHomeView(viewContainer);
    }
  }

  // ===== 1. HOME VIEW =====
  renderHomeView(container) {
    const featuredSong = CATALOG_SONGS[0];
    const trendingSongs = CATALOG_SONGS.filter(s => s.trending).slice(0, 8);
    const recommendedSongs = CATALOG_SONGS.filter(s => s.featured).slice(0, 8);

    container.innerHTML = `
      <!-- Featured Banner -->
      <div style="background:linear-gradient(135deg, var(--accent-dim), var(--card)); border:1px solid var(--card-border); border-radius:var(--radius); padding:32px; margin-bottom:40px; display:flex; align-items:center; justify-content:space-between; backdrop-filter:blur(20px);">
        <div>
          <span style="font-size:0.8rem; color:var(--accent); font-weight:700; text-transform:uppercase; letter-spacing:1px;">FEATURED SPOTLIGHT</span>
          <h2 style="font-family:'Sora',sans-serif; font-size:2.2rem; margin:8px 0;">${featuredSong.album}</h2>
          <p style="color:var(--text-secondary); max-width:500px; margin-bottom:20px;">
            Immerse yourself in crisp high-fidelity retro synth melodies and electric pulse beats by ${featuredSong.artist}.
          </p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" id="btnPlayFeatured">
              <i class="fa-solid fa-play"></i> Play Now
            </button>
            <button class="btn btn-ghost" id="btnExploreFeaturedAlbum">
              <i class="fa-solid fa-compact-disc"></i> View Album
            </button>
          </div>
        </div>
        <img src="${featuredSong.cover}" style="width:160px; height:160px; border-radius:var(--radius); object-fit:cover; box-shadow:var(--shadow-lg);" />
      </div>

      <!-- Trending Section -->
      <div style="margin-bottom:40px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-family:'Sora',sans-serif; font-size:1.4rem;">Trending Songs</h3>
          <button class="btn btn-ghost" style="font-size:0.8rem;" id="btnViewAllTrending">View All</button>
        </div>
        <div class="scroll-feed" id="feedTrendingContainer"></div>
      </div>

      <!-- Recommended Music Section -->
      <div style="margin-bottom:40px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-family:'Sora',sans-serif; font-size:1.4rem;">Recommended For You</h3>
        </div>
        <div class="scroll-feed" id="feedRecommendedContainer"></div>
      </div>

      <!-- Browse Genres Feed -->
      <div style="margin-bottom:40px;">
        <h3 style="font-family:'Sora',sans-serif; font-size:1.4rem; margin-bottom:16px;">Explore Genres</h3>
        <div class="scroll-feed" id="feedGenresContainer"></div>
      </div>

      <!-- Continue Listening Section -->
      <div style="margin-bottom:40px;">
        <h3 style="font-family:'Sora',sans-serif; font-size:1.4rem; margin-bottom:16px;">Continue Listening</h3>
        <div id="continueListeningList"></div>
      </div>
    `;

    // Bind Home Actions
    container.querySelector('#btnPlayFeatured')?.addEventListener('click', () => window.playerEngine?.playTrack(featuredSong));
    container.querySelector('#btnExploreFeaturedAlbum')?.addEventListener('click', () => this.navigate('albumDetail', featuredSong.album));
    container.querySelector('#btnViewAllTrending')?.addEventListener('click', () => this.navigate('browse', { filter: 'trending' }));

    // Populate Trending Feed Cards
    const trendingFeed = container.querySelector('#feedTrendingContainer');
    trendingSongs.forEach(song => {
      const card = this.createSongCard(song);
      trendingFeed.appendChild(card);
    });

    // Populate Recommended Feed Cards
    const recFeed = container.querySelector('#feedRecommendedContainer');
    recommendedSongs.forEach(song => {
      const card = this.createSongCard(song);
      recFeed.appendChild(card);
    });

    // Populate Genres Cards
    const genreFeed = container.querySelector('#feedGenresContainer');
    GENRES_DATA.forEach(g => {
      const gCard = document.createElement('div');
      gCard.className = 'feed-card genre-card';
      gCard.style.background = g.gradient;
      gCard.innerHTML = `<i class="fa-solid ${g.icon}" style="font-size:1.5rem; margin-bottom:10px; opacity:0.9;"></i><h4 style="font-size:1.1rem; font-weight:700;">${g.name}</h4>`;
      gCard.addEventListener('click', () => this.navigate('genreDetail', g.id));
      genreFeed.appendChild(gCard);
    });

    // Populate Continue Listening Rows
    const continueContainer = container.querySelector('#continueListeningList');
    const recentHistory = window.historyManager?.getHistoryWithSongs().slice(0, 5) || [];
    if (recentHistory.length === 0) {
      CATALOG_SONGS.slice(0, 5).forEach((song, idx) => {
        continueContainer.appendChild(this.createSongRow(song, idx + 1));
      });
    } else {
      recentHistory.forEach((item, idx) => {
        continueContainer.appendChild(this.createSongRow(item.song, idx + 1));
      });
    }
  }

  // ===== 2. BROWSE VIEW =====
  renderBrowseView(container, params = {}) {
    let currentFilter = (typeof params === 'string' ? params : params?.filter) || 'all';
    let currentSort = params?.sort || 'title';

    container.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:24px;">
        <h2 style="font-family:'Sora',sans-serif; font-size:2rem;">Browse Music Catalog</h2>
        <select id="browseSortSelect" style="background:var(--card); color:var(--text); border:1px solid var(--card-border); padding:8px 14px; border-radius:var(--radius-xs); cursor:pointer; font-size:0.85rem;">
          <option value="title" ${currentSort === 'title' ? 'selected' : ''}>Sort by Title</option>
          <option value="artist" ${currentSort === 'artist' ? 'selected' : ''}>Sort by Artist</option>
          <option value="duration" ${currentSort === 'duration' ? 'selected' : ''}>Sort by Duration</option>
          <option value="year" ${currentSort === 'year' ? 'selected' : ''}>Sort by Year</option>
        </select>
      </div>

      <!-- Filter Tabs Bar -->
      <div style="display:flex; gap:10px; margin-bottom:24px; overflow-x:auto; padding-bottom:8px;">
        ${['all', 'albums', 'artists', 'genres', 'new-releases', 'top-charts', 'trending'].map(f => `
          <button class="btn ${currentFilter === f ? 'btn-primary' : 'btn-ghost'}" data-filter="${f}" style="padding:8px 18px; font-size:0.85rem; text-transform:capitalize;">
            ${f.replace('-', ' ')}
          </button>
        `).join('')}
      </div>

      <div id="browseContentGrid"></div>
    `;

    const grid = container.querySelector('#browseContentGrid');
    const sortSelect = container.querySelector('#browseSortSelect');

    const renderFilteredSongs = () => {
      let filtered = [...CATALOG_SONGS];

      if (currentFilter === 'new-releases') filtered = filtered.filter(s => s.year >= 2024);
      else if (currentFilter === 'top-charts') filtered = filtered.filter(s => s.topChart !== null);
      else if (currentFilter === 'trending') filtered = filtered.filter(s => s.trending);

      // Sort
      if (currentSort === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title));
      else if (currentSort === 'artist') filtered.sort((a, b) => a.artist.localeCompare(b.artist));
      else if (currentSort === 'duration') filtered.sort((a, b) => b.durationSec - a.durationSec);
      else if (currentSort === 'year') filtered.sort((a, b) => b.year - a.year);

      grid.innerHTML = '';

      if (currentFilter === 'albums') {
        // Group by album
        const albumsMap = {};
        CATALOG_SONGS.forEach(s => {
          if (!albumsMap[s.album]) albumsMap[s.album] = s;
        });
        const albumGrid = document.createElement('div');
        albumGrid.className = 'grid-4';
        Object.values(albumsMap).forEach(s => {
          const card = document.createElement('div');
          card.className = 'feed-card';
          card.innerHTML = `<img src="${s.cover}" /><div style="font-weight:700;">${s.album}</div><div style="font-size:0.8rem; color:var(--text-secondary);">${s.artist} • ${s.year}</div>`;
          card.addEventListener('click', () => this.navigate('albumDetail', s.album));
          albumGrid.appendChild(card);
        });
        grid.appendChild(albumGrid);
      } else if (currentFilter === 'artists') {
        // Group by artist
        const artistGrid = document.createElement('div');
        artistGrid.className = 'grid-4';
        Object.values(ARTISTS_DATA).forEach(art => {
          const card = document.createElement('div');
          card.className = 'feed-card';
          card.innerHTML = `<img src="${art.photo}" style="border-radius:50%;" /><div style="font-weight:700; text-align:center;">${art.name}</div><div style="font-size:0.8rem; color:var(--text-secondary); text-align:center;">${art.followers} followers</div>`;
          card.addEventListener('click', () => this.navigate('artistDetail', art.name));
          artistGrid.appendChild(card);
        });
        grid.appendChild(artistGrid);
      } else if (currentFilter === 'genres') {
        const genreGrid = document.createElement('div');
        genreGrid.className = 'grid-4';
        GENRES_DATA.forEach(g => {
          const card = document.createElement('div');
          card.className = 'feed-card';
          card.style.background = g.gradient;
          card.innerHTML = `<i class="fa-solid ${g.icon}" style="font-size:1.8rem; margin-bottom:12px;"></i><h4 style="font-size:1.2rem; font-weight:700;">${g.name}</h4>`;
          card.addEventListener('click', () => this.navigate('genreDetail', g.id));
          genreGrid.appendChild(card);
        });
        grid.appendChild(genreGrid);
      } else {
        // List of Songs Table
        filtered.forEach((song, idx) => {
          grid.appendChild(this.createSongRow(song, idx + 1));
        });
      }
    };

    renderFilteredSongs();

    // Event listeners
    container.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        currentFilter = e.target.dataset.filter;
        container.querySelectorAll('[data-filter]').forEach(b => {
          b.className = b.dataset.filter === currentFilter ? 'btn btn-primary' : 'btn btn-ghost';
          b.style.padding = '8px 18px';
          b.style.fontSize = '0.85rem';
        });
        renderFilteredSongs();
      });
    });

    sortSelect?.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderFilteredSongs();
    });
  }

  // ===== 3. LIBRARY VIEW =====
  renderLibraryView(container) {
    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <h2 style="font-family:'Sora',sans-serif; font-size:2rem;">Your Library</h2>
        <button class="btn btn-primary" onclick="window.playlistManager?.createPlaylistPrompt()">
          <i class="fa-solid fa-plus"></i> New Playlist
        </button>
      </div>

      <!-- Library Sub-tabs -->
      <div style="display:flex; gap:12px; margin-bottom:24px; border-bottom:1px solid var(--card-border); padding-bottom:12px;">
        <button class="btn btn-primary" id="libTabPlaylists">Created Playlists</button>
        <button class="btn btn-ghost" id="libTabFavs">Favorite Songs</button>
        <button class="btn btn-ghost" id="libTabRecent">Recently Played</button>
        <button class="btn btn-ghost" id="libTabDownloads">Downloads</button>
      </div>

      <div id="libContentArea"></div>
    `;

    const area = container.querySelector('#libContentArea');
    const tabPlaylists = container.querySelector('#libTabPlaylists');
    const tabFavs = container.querySelector('#libTabFavs');
    const tabRecent = container.querySelector('#libTabRecent');
    const tabDownloads = container.querySelector('#libTabDownloads');

    const switchLibTab = (tab) => {
      [tabPlaylists, tabFavs, tabRecent, tabDownloads].forEach(t => {
        t.className = 'btn btn-ghost';
      });
      area.innerHTML = '';

      if (tab === 'playlists') {
        tabPlaylists.className = 'btn btn-primary';
        const plGrid = document.createElement('div');
        plGrid.className = 'grid-4';

        const userPls = window.playlistManager?.playlists || [];
        userPls.forEach(pl => {
          const card = document.createElement('div');
          card.className = 'feed-card';
          card.innerHTML = `
            <img src="${pl.cover}" />
            <div style="font-weight:700;">${pl.title}</div>
            <div style="font-size:0.8rem; color:var(--text-secondary);">${pl.songs.length} Tracks • Playlist</div>
          `;
          card.addEventListener('click', () => this.navigate('playlistDetail', pl));
          plGrid.appendChild(card);
        });
        area.appendChild(plGrid);
      } else if (tab === 'favs') {
        tabFavs.className = 'btn btn-primary';
        this.renderFavoritesView(area);
      } else if (tab === 'recent') {
        tabRecent.className = 'btn btn-primary';
        this.renderRecentView(area);
      } else if (tab === 'downloads') {
        tabDownloads.className = 'btn btn-primary';
        this.renderDownloadsView(area);
      }
    };

    tabPlaylists.addEventListener('click', () => switchLibTab('playlists'));
    tabFavs.addEventListener('click', () => switchLibTab('favs'));
    tabRecent.addEventListener('click', () => switchLibTab('recent'));
    tabDownloads.addEventListener('click', () => switchLibTab('downloads'));

    switchLibTab('playlists');
  }

  // ===== 4. FAVORITES VIEW =====
  renderFavoritesView(container) {
    const favSongs = window.favoritesManager?.getFavoriteSongs() || [];

    container.innerHTML = `
      <!-- Favorites Banner -->
      <div style="background:linear-gradient(135deg, rgba(236, 72, 153, 0.2), var(--card)); border:1px solid var(--card-border); border-radius:var(--radius); padding:32px; margin-bottom:32px; display:flex; align-items:center; gap:28px;">
        <div style="width:140px; height:140px; border-radius:var(--radius-sm); background:linear-gradient(135deg, #EC4899, #8B5CF6); display:flex; align-items:center; justify-content:center; font-size:3.5rem; color:#FFF; box-shadow:var(--shadow-lg);">
          <i class="fa-solid fa-heart"></i>
        </div>
        <div>
          <span style="font-size:0.8rem; font-weight:700; color:#EC4899; text-transform:uppercase;">YOUR COLLECTION</span>
          <h2 style="font-family:'Sora',sans-serif; font-size:2.5rem; margin:6px 0;">Favorite Songs</h2>
          <p style="color:var(--text-secondary); margin-bottom:16px;">${favSongs.length} Liked Tracks • Always synced to Local Storage</p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" id="btnFavPlayAll"><i class="fa-solid fa-play"></i> Play All</button>
            <button class="btn btn-ghost" id="btnFavShuffle"><i class="fa-solid fa-shuffle"></i> Shuffle</button>
          </div>
        </div>
      </div>

      <!-- Favorites Filter Input -->
      <div style="margin-bottom:20px; max-width:400px;">
        <input type="search" id="favSearchInput" placeholder="Filter favorite songs..." style="width:100%; padding:10px 16px; border-radius:20px; background:var(--card); border:1px solid var(--card-border); color:var(--text); font-size:0.85rem;" />
      </div>

      <div id="favSongsList"></div>
    `;

    const listEl = container.querySelector('#favSongsList');
    const searchInput = container.querySelector('#favSearchInput');

    const renderFavList = (query = '') => {
      listEl.innerHTML = '';
      const q = query.toLowerCase().trim();
      const filtered = favSongs.filter(s => !q || s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q));

      if (filtered.length === 0) {
        listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No favorite songs match "${query}".</div>`;
        return;
      }

      filtered.forEach((song, idx) => {
        const row = this.createSongRow(song, idx + 1);
        listEl.appendChild(row);
      });
    };

    renderFavList();

    searchInput?.addEventListener('input', (e) => renderFavList(e.target.value));
    container.querySelector('#btnFavPlayAll')?.addEventListener('click', () => window.favoritesManager?.playAll());
    container.querySelector('#btnFavShuffle')?.addEventListener('click', () => window.favoritesManager?.shuffleAll());
  }

  // ===== 5. RECENTLY PLAYED VIEW =====
  renderRecentView(container) {
    const historyItems = window.historyManager?.getHistoryWithSongs() || [];

    container.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:24px;">
        <div>
          <h2 style="font-family:'Sora',sans-serif; font-size:2rem;">Listening History</h2>
          <p style="color:var(--text-secondary); font-size:0.85rem;">Tracks you listened to recently, updated in real time</p>
        </div>
        <button class="btn btn-ghost" id="btnClearHistoryBtn"><i class="fa-solid fa-trash"></i> Clear History</button>
      </div>

      <div id="recentSongsList"></div>
    `;

    const listEl = container.querySelector('#recentSongsList');
    container.querySelector('#btnClearHistoryBtn')?.addEventListener('click', () => {
      window.historyManager?.clearHistory();
      this.renderRecentView(container);
    });

    if (historyItems.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No listening history recorded yet.</div>`;
      return;
    }

    historyItems.forEach((item, idx) => {
      const song = item.song;
      const row = document.createElement('div');
      row.className = 'playlist-card visible';
      row.style.marginBottom = '8px';
      row.dataset.songId = song.id;

      row.innerHTML = `
        <span class="card-number">${idx + 1}</span>
        <img src="${song.cover}" class="card-thumb" />
        <div class="card-info">
          <div class="card-title">${song.title}</div>
          <div class="card-artist">${song.artist} • ${song.album}</div>
        </div>
        <div style="font-size:0.75rem; color:var(--text-muted); margin-right:16px; text-align:right;">
          <div>${window.formatTimestamp(item.lastPlayed)}</div>
          <div>${item.playCount || 1} plays</div>
        </div>
        <button class="btn btn-ghost" style="padding:6px 12px; font-size:0.75rem; margin-right:12px;">Continue</button>
        <span class="card-duration">${song.duration}</span>
      `;

      row.addEventListener('click', () => window.playerEngine?.playTrack(song));
      listEl.appendChild(row);
    });
  }

  // ===== 6. DOWNLOADS VIEW (UI ONLY) =====
  renderDownloadsView(container) {
    const downloadedSongs = window.libraryController?.getDownloadedSongs() || [];

    container.innerHTML = `
      <div style="background:linear-gradient(135deg, rgba(6, 182, 212, 0.2), var(--card)); border:1px solid var(--card-border); border-radius:var(--radius); padding:32px; margin-bottom:32px; backdrop-filter:blur(20px);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <div>
            <span style="font-size:0.8rem; font-weight:700; color:var(--accent2); text-transform:uppercase;">OFFLINE STORAGE</span>
            <h2 style="font-family:'Sora',sans-serif; font-size:2.2rem; margin:4px 0;">Downloaded Tracks</h2>
            <p style="color:var(--text-secondary); font-size:0.85rem;">Cached locally for offline playback without internet connection</p>
          </div>
          <div style="text-align:right;">
            <div style="font-size:1.5rem; font-weight:700; color:var(--accent2);">2.4 GB / 15 GB</div>
            <div style="font-size:0.75rem; color:var(--text-muted);">Storage Used</div>
          </div>
        </div>

        <!-- Storage Progress Meter Bar -->
        <div style="height:8px; background:rgba(255,255,255,0.1); border-radius:4px; overflow:hidden; margin-bottom:12px;">
          <div style="height:100%; width:16%; background:linear-gradient(90deg, #06B6D4, #3B82F6); border-radius:4px;"></div>
        </div>
      </div>

      <h3 style="font-size:1.2rem; font-weight:700; margin-bottom:16px;">Offline Song Cache (${downloadedSongs.length})</h3>
      <div id="downloadsList"></div>
    `;

    const listEl = container.querySelector('#downloadsList');

    if (downloadedSongs.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No songs downloaded yet.</div>`;
      return;
    }

    downloadedSongs.forEach((song, idx) => {
      const row = document.createElement('div');
      row.className = 'playlist-card visible';
      row.style.marginBottom = '8px';
      row.dataset.songId = song.id;

      row.innerHTML = `
        <span class="card-number">${idx + 1}</span>
        <img src="${song.cover}" class="card-thumb" />
        <div class="card-info">
          <div class="card-title">${song.title} <span style="font-size:0.65rem; background:rgba(6, 182, 212, 0.2); color:var(--accent2); padding:2px 6px; border-radius:4px; margin-left:6px;">OFFLINE</span></div>
          <div class="card-artist">${song.artist} • Lossless Audio</div>
        </div>
        <button class="btn btn-ghost" style="padding:6px 10px; font-size:0.75rem; margin-right:12px;" title="Remove Download" onclick="event.stopPropagation(); window.libraryController?.removeDownload(${song.id}); window.navigationRouter?.renderCurrentView();">
          <i class="fa-solid fa-trash" style="color:var(--text-muted);"></i>
        </button>
        <span class="card-duration">${song.duration}</span>
      `;

      row.addEventListener('click', () => window.playerEngine?.playTrack(song));
      listEl.appendChild(row);
    });
  }

  // ===== 7. PLAYLIST DETAIL VIEW =====
  renderPlaylistDetailView(container, pl) {
    if (!pl) return;
    const plSongs = CATALOG_SONGS.filter(s => pl.songs.includes(s.id));

    container.innerHTML = `
      <!-- Playlist Header Banner -->
      <div style="background:linear-gradient(135deg, var(--accent-dim), var(--card)); border:1px solid var(--card-border); border-radius:var(--radius); padding:32px; margin-bottom:32px; display:flex; align-items:center; gap:28px;">
        <img src="${pl.cover}" style="width:160px; height:160px; border-radius:var(--radius-sm); object-fit:cover; box-shadow:var(--shadow-lg);" />
        <div style="flex:1;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--accent); text-transform:uppercase;">PLAYLIST</span>
          <h2 style="font-family:'Sora',sans-serif; font-size:2.5rem; margin:6px 0;">${pl.title}</h2>
          <p style="color:var(--text-secondary); margin-bottom:16px;">${pl.description || 'User created playlist'} • ${plSongs.length} Tracks</p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" id="btnPlPlayAll"><i class="fa-solid fa-play"></i> Play All</button>
            <button class="btn btn-ghost" id="btnPlEdit"><i class="fa-solid fa-pen"></i> Edit</button>
            <button class="btn btn-ghost" id="btnPlDelete"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </div>
      </div>

      <div id="playlistTracksList"></div>
    `;

    const listEl = container.querySelector('#playlistTracksList');
    container.querySelector('#btnPlPlayAll')?.addEventListener('click', () => {
      if (plSongs.length > 0) {
        if (window.queueManager) {
          window.queueManager.queue = [...plSongs];
          window.queueManager.currentIndex = 0;
          window.queueManager.save();
          window.queueManager.render();
        }
        window.playerEngine?.playTrack(plSongs[0]);
      }
    });

    container.querySelector('#btnPlEdit')?.addEventListener('click', () => window.playlistManager?.editPlaylistPrompt(pl.id));
    container.querySelector('#btnPlDelete')?.addEventListener('click', () => window.playlistManager?.deletePlaylist(pl.id));

    if (plSongs.length === 0) {
      listEl.innerHTML = `<div style="text-align:center; padding:40px; color:var(--text-muted);">No songs in this playlist yet. Right click any song to add it!</div>`;
      return;
    }

    plSongs.forEach((song, idx) => {
      const row = this.createSongRow(song, idx + 1);
      // Remove from playlist button inside row
      const rmBtn = document.createElement('button');
      rmBtn.className = 'btn btn-ghost';
      rmBtn.style.padding = '6px 10px';
      rmBtn.style.fontSize = '0.75rem';
      rmBtn.style.marginRight = '8px';
      rmBtn.innerHTML = `<i class="fa-solid fa-xmark"></i>`;
      rmBtn.title = 'Remove from playlist';
      rmBtn.onclick = (e) => {
        e.stopPropagation();
        window.playlistManager?.removeSongFromPlaylist(pl.id, song.id);
      };
      row.insertBefore(rmBtn, row.querySelector('.card-duration'));

      listEl.appendChild(row);
    });
  }

  // ===== 8. ALBUM DETAIL VIEW =====
  renderAlbumDetailView(container, albumTitle) {
    const albumSongs = CATALOG_SONGS.filter(s => s.album === albumTitle);
    const sample = albumSongs[0] || CATALOG_SONGS[0];

    container.innerHTML = `
      <div style="background:linear-gradient(135deg, var(--card-hover), var(--card)); border:1px solid var(--card-border); border-radius:var(--radius); padding:32px; margin-bottom:32px; display:flex; align-items:center; gap:28px;">
        <img src="${sample.cover}" style="width:160px; height:160px; border-radius:var(--radius-sm); object-fit:cover; box-shadow:var(--shadow-lg);" />
        <div>
          <span style="font-size:0.8rem; font-weight:700; color:var(--accent); text-transform:uppercase;">ALBUM</span>
          <h2 style="font-family:'Sora',sans-serif; font-size:2.5rem; margin:6px 0;">${albumTitle}</h2>
          <p style="color:var(--text-secondary); margin-bottom:16px;">By <a href="#" id="albumArtistLink" style="color:var(--accent); text-decoration:none;">${sample.artist}</a> • ${sample.year} • ${albumSongs.length} Tracks</p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" id="btnAlbumPlay"><i class="fa-solid fa-play"></i> Play Album</button>
            <button class="btn btn-ghost" id="btnAlbumShuffle"><i class="fa-solid fa-shuffle"></i> Shuffle</button>
          </div>
        </div>
      </div>

      <div id="albumTracksList"></div>
    `;

    container.querySelector('#albumArtistLink')?.addEventListener('click', (e) => {
      e.preventDefault();
      this.navigate('artistDetail', sample.artist);
    });

    container.querySelector('#btnAlbumPlay')?.addEventListener('click', () => {
      if (albumSongs.length > 0) window.playerEngine?.playTrack(albumSongs[0]);
    });

    const listEl = container.querySelector('#albumTracksList');
    albumSongs.forEach((song, idx) => {
      listEl.appendChild(this.createSongRow(song, idx + 1));
    });
  }

  // ===== 9. ARTIST DETAIL VIEW =====
  renderArtistDetailView(container, artistName) {
    const art = ARTISTS_DATA[artistName] || {
      name: artistName,
      photo: 'assets/images/cover1.png',
      bio: 'Popular international streaming artist with millions of fans across the globe.',
      followers: '1,200,000',
      popularSongs: [1, 2, 4],
      albums: ['Synthwave Journeys'],
      related: ['Sunset Waves', 'Deep Blue']
    };

    const artistSongs = CATALOG_SONGS.filter(s => s.artist === artistName);

    container.innerHTML = `
      <div style="background:linear-gradient(135deg, rgba(139, 92, 246, 0.2), var(--card)); border:1px solid var(--card-border); border-radius:var(--radius); padding:32px; margin-bottom:32px; display:flex; align-items:center; gap:28px;">
        <img src="${art.photo}" style="width:160px; height:160px; border-radius:50%; object-fit:cover; box-shadow:var(--shadow-lg);" />
        <div style="flex:1;">
          <span style="font-size:0.8rem; font-weight:700; color:var(--accent2); text-transform:uppercase;">VERIFIED ARTIST</span>
          <h2 style="font-family:'Sora',sans-serif; font-size:2.8rem; margin:4px 0;">${art.name}</h2>
          <p style="color:var(--text-secondary); max-width:600px; margin-bottom:16px; font-size:0.9rem;">${art.bio}</p>
          <div style="display:flex; align-items:center; gap:16px;">
            <button class="btn btn-primary" id="btnArtistPlay"><i class="fa-solid fa-play"></i> Play Artist</button>
            <button class="btn btn-ghost" id="btnArtistFollow"><i class="fa-solid fa-user-plus"></i> Follow (${art.followers})</button>
          </div>
        </div>
      </div>

      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:16px;">Popular Tracks</h3>
      <div id="artistPopularList"></div>
    `;

    const listEl = container.querySelector('#artistPopularList');
    artistSongs.forEach((song, idx) => {
      listEl.appendChild(this.createSongRow(song, idx + 1));
    });

    container.querySelector('#btnArtistPlay')?.addEventListener('click', () => {
      if (artistSongs.length > 0) window.playerEngine?.playTrack(artistSongs[0]);
    });

    const followBtn = container.querySelector('#btnArtistFollow');
    followBtn?.addEventListener('click', () => {
      followBtn.classList.toggle('btn-primary');
      followBtn.innerHTML = followBtn.classList.contains('btn-primary')
        ? `<i class="fa-solid fa-check"></i> Following`
        : `<i class="fa-solid fa-user-plus"></i> Follow (${art.followers})`;
      window.showToast('fa-solid fa-user-check', `Followed ${art.name}`);
    });
  }

  // ===== 10. GENRE DETAIL VIEW =====
  renderGenreDetailView(container, genreId) {
    const genreObj = GENRES_DATA.find(g => g.id === genreId || g.name === genreId) || {
      id: genreId,
      name: genreId,
      gradient: 'linear-gradient(135deg, #1DB954, #047857)',
      icon: 'fa-music'
    };

    const genreSongs = CATALOG_SONGS.filter(s => s.genre.toLowerCase() === genreObj.id.toLowerCase() || s.genre.toLowerCase() === genreObj.name.toLowerCase());

    container.innerHTML = `
      <div style="background:${genreObj.gradient}; border-radius:var(--radius); padding:40px; margin-bottom:32px; display:flex; align-items:center; justify-content:space-between; box-shadow:var(--shadow-lg);">
        <div>
          <span style="font-size:0.8rem; font-weight:700; color:rgba(255,255,255,0.8); text-transform:uppercase;">GENRE DISCOVERY</span>
          <h2 style="font-family:'Sora',sans-serif; font-size:3rem; margin:6px 0;">${genreObj.name}</h2>
          <p style="color:rgba(255,255,255,0.9); margin-bottom:20px;">Top hand-curated ${genreObj.name} soundscapes and track releases.</p>
          <div style="display:flex; gap:12px;">
            <button class="btn btn-primary" id="btnGenrePlay" style="background:#FFF; color:#000;"><i class="fa-solid fa-play"></i> Play Genre</button>
            <button class="btn btn-ghost" id="btnGenreShuffle" style="color:#FFF; border-color:rgba(255,255,255,0.4);"><i class="fa-solid fa-shuffle"></i> Shuffle</button>
          </div>
        </div>
        <i class="fa-solid ${genreObj.icon}" style="font-size:6rem; color:rgba(255,255,255,0.25);"></i>
      </div>

      <h3 style="font-size:1.3rem; font-weight:700; margin-bottom:16px;">Top ${genreObj.name} Tracks (${genreSongs.length})</h3>
      <div id="genreTracksList"></div>
    `;

    const listEl = container.querySelector('#genreTracksList');
    genreSongs.forEach((song, idx) => {
      listEl.appendChild(this.createSongRow(song, idx + 1));
    });

    container.querySelector('#btnGenrePlay')?.addEventListener('click', () => {
      if (genreSongs.length > 0) window.playerEngine?.playTrack(genreSongs[0]);
    });
  }

  // ===== REUSABLE DOM COMPONENT HELPERS =====
  createSongCard(song) {
    const card = document.createElement('div');
    card.className = 'feed-card';
    card.dataset.songId = song.id;
    card.innerHTML = `
      <img src="${song.cover}" />
      <div style="font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${song.title}</div>
      <div style="font-size:0.8rem; color:var(--text-secondary); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${song.artist}</div>
    `;
    card.addEventListener('click', () => window.playerEngine?.playTrack(song));
    return card;
  }

  createSongRow(song, idx) {
    const row = document.createElement('div');
    row.className = 'playlist-card visible';
    row.style.marginBottom = '8px';
    row.dataset.songId = song.id;

    const isFav = window.favoritesManager?.has(song.id);

    row.innerHTML = `
      <span class="card-number">${idx}</span>
      <img src="${song.cover}" class="card-thumb" />
      <div class="card-info">
        <div class="card-title">${song.title}</div>
        <div class="card-artist">${song.artist} • ${song.album}</div>
      </div>
      <button class="card-fav ${isFav ? 'favorited' : ''}" onclick="event.stopPropagation(); window.favoritesManager?.toggle(${song.id}); this.classList.toggle('favorited'); this.querySelector('i').className = this.classList.contains('favorited') ? 'fa-solid fa-heart' : 'fa-regular fa-heart';">
        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
      </button>
      <span class="card-duration">${song.duration}</span>
    `;

    row.addEventListener('click', () => window.playerEngine?.playTrack(song));
    return row;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.navigationRouter = new NavigationRouter();
});
