/* ================================================================
   Aurora Music Player — Script
   ================================================================
   Modular ES6+ Vanilla JS. Central state object, event-driven
   architecture, Web Audio API visualizer, localStorage persistence.
   ================================================================ */

'use strict';

// ===== Song Data =====
// Using SoundHelix royalty-free sample tracks for real audio playback
const songs = [
  {
    title: 'Neon Dreams',
    artist: 'Aurora Synth',
    album: 'Synthwave Collection',
    duration: '6:14',
    cover: 'assets/images/cover1.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
  },
  {
    title: 'Golden Hour',
    artist: 'Sunset Waves',
    album: 'Ambient Horizons',
    duration: '5:46',
    cover: 'assets/images/cover2.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  {
    title: 'Midnight Ocean',
    artist: 'Deep Blue',
    album: 'Underwater Echoes',
    duration: '7:08',
    cover: 'assets/images/cover3.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  {
    title: 'Electric Pulse',
    artist: 'Circuit Breaker',
    album: 'Digital Frontiers',
    duration: '5:30',
    cover: 'assets/images/cover4.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  {
    title: 'Velvet Skies',
    artist: 'Cosmic Drift',
    album: 'Nebula Dreams',
    duration: '6:42',
    cover: 'assets/images/cover5.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
  {
    title: 'Crystal Rain',
    artist: 'Glass Echoes',
    album: 'Urban Melancholy',
    duration: '7:20',
    cover: 'assets/images/cover6.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3'
  },
  {
    title: 'Solar Flare',
    artist: 'Helios',
    album: 'Stellar Ignition',
    duration: '5:58',
    cover: 'assets/images/cover7.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3'
  },
  {
    title: 'Arctic Wind',
    artist: 'Fjord',
    album: 'Frozen Horizons',
    duration: '6:35',
    cover: 'assets/images/cover8.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
  },
  {
    title: 'Urban Echo',
    artist: 'Noir Collective',
    album: 'City Shadows',
    duration: '5:15',
    cover: 'assets/images/cover9.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3'
  },
  {
    title: 'Dream Cascade',
    artist: 'Ethereal Flow',
    album: 'Lucid Visions',
    duration: '8:02',
    cover: 'assets/images/cover10.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3'
  }
];

// ===== Central State =====
const state = {
  currentIndex: 0,
  isPlaying: false,
  repeatMode: 'off',        // 'off' | 'all' | 'one'
  isShuffled: false,
  shuffleOrder: [],
  isMuted: false,
  volume: 0.8,
  favorites: new Set(),
  recentlyPlayed: [],
  searchQuery: '',
  activeTab: 'all',          // 'all' | 'favorites' | 'recent'
  isDragging: false,
  volumeTimeout: null,
  toastTimeout: null,
  animationFrame: null,
  audioContext: null,
  analyser: null,
  sourceNode: null,
  bgActiveSlot: 1,           // alternates between 1 and 2 for crossfade
};

// ===== DOM References =====
const dom = {
  // Background
  bgImage1: document.getElementById('bgImage1'),
  bgImage2: document.getElementById('bgImage2'),
  // Artwork
  artwork: document.getElementById('artwork'),
  artworkGlow: document.getElementById('artworkGlow'),
  artworkShimmer: document.getElementById('artworkShimmer'),
  artworkWrapper: document.getElementById('artworkWrapper'),
  // Song info
  songTitle: document.getElementById('songTitle'),
  songArtist: document.getElementById('songArtist'),
  songAlbum: document.getElementById('songAlbum'),
  songInfo: document.getElementById('songInfo'),
  trackCurrent: document.getElementById('trackCurrent'),
  trackTotal: document.getElementById('trackTotal'),
  // Progress
  progressBar: document.getElementById('progressBar'),
  progressFill: document.getElementById('progressFill'),
  progressThumb: document.getElementById('progressThumb'),
  progressTooltip: document.getElementById('progressTooltip'),
  currentTime: document.getElementById('currentTime'),
  totalTime: document.getElementById('totalTime'),
  // Controls
  btnPlay: document.getElementById('btnPlay'),
  playIcon: document.getElementById('playIcon'),
  btnPrev: document.getElementById('btnPrev'),
  btnNext: document.getElementById('btnNext'),
  btnShuffle: document.getElementById('btnShuffle'),
  btnRepeat: document.getElementById('btnRepeat'),
  repeatIcon: document.getElementById('repeatIcon'),
  // Volume
  btnMute: document.getElementById('btnMute'),
  volumeIcon: document.getElementById('volumeIcon'),
  volumeSlider: document.getElementById('volumeSlider'),
  volumeLabel: document.getElementById('volumeLabel'),
  // Playlist
  playlistContainer: document.getElementById('playlistContainer'),
  searchInput: document.getElementById('searchInput'),
  // Tabs
  tabAll: document.getElementById('tabAll'),
  tabFavorites: document.getElementById('tabFavorites'),
  tabRecent: document.getElementById('tabRecent'),
  // Mini player
  miniPlayer: document.getElementById('miniPlayer'),
  miniArtwork: document.getElementById('miniArtwork'),
  miniTitle: document.getElementById('miniTitle'),
  miniArtist: document.getElementById('miniArtist'),
  miniBtnPlay: document.getElementById('miniBtnPlay'),
  miniPlayIcon: document.getElementById('miniPlayIcon'),
  miniBtnPrev: document.getElementById('miniBtnPrev'),
  miniBtnNext: document.getElementById('miniBtnNext'),
  miniProgressFill: document.getElementById('miniProgressFill'),
  // Visualizer
  visualizer: document.getElementById('visualizer'),
  vizBars: document.querySelectorAll('.viz-bar'),
  // Toast
  toast: document.getElementById('toast'),
  toastIcon: document.getElementById('toastIcon'),
  toastText: document.getElementById('toastText'),
  // App
  player: document.getElementById('player'),
};

// ===== Audio Element =====
const audio = new Audio();
audio.preload = 'metadata';
// Note: crossOrigin is NOT set by default.
// SoundHelix (and many CDNs) don't send CORS headers, so setting
// crossOrigin='anonymous' would block playback entirely.
// The visualizer uses a smooth simulated fallback when the Web Audio
// API can't access cross-origin audio data.
audio.volume = state.volume;

// ===== Initialization =====
function init() {
  loadFavorites();
  loadRecentlyPlayed();
  renderPlaylist();
  loadSong(state.currentIndex, false);
  setupEventListeners();
  dom.trackTotal.textContent = songs.length;
}

// ===== Load Song =====
function loadSong(index, autoplay = true) {
  const song = songs[index];
  if (!song) return;

  state.currentIndex = index;

  // Show shimmer while loading
  dom.artworkShimmer.classList.add('loading');

  // Animate song info change (cascade)
  dom.songInfo.classList.add('changing');

  setTimeout(() => {
    // Update text
    dom.songTitle.textContent = song.title;
    dom.songArtist.textContent = song.artist;
    dom.songAlbum.textContent = song.album;

    // Remove changing class to trigger fade-in
    dom.songInfo.classList.remove('changing');
  }, 280);

  // Update track counter
  dom.trackCurrent.textContent = index + 1;

  // Update artwork with crossfade
  updateArtwork(song.cover);

  // Update background with crossfade
  updateBackground(song.cover);

  // Update artwork glow
  dom.artworkGlow.style.backgroundImage = `url(${song.cover})`;

  // Update mini player
  dom.miniArtwork.src = song.cover;
  dom.miniTitle.textContent = song.title;
  dom.miniArtist.textContent = song.artist;

  // Load audio
  audio.src = song.audio;
  audio.load();

  // Reset progress
  dom.progressFill.style.width = '0%';
  dom.progressThumb.style.left = '0%';
  dom.currentTime.textContent = '0:00';
  dom.totalTime.textContent = song.duration;

  // Highlight in playlist
  highlightCurrentSong();

  // Add to recently played
  addToRecentlyPlayed(index);

  // Auto-play if requested
  if (autoplay) {
    // Small delay for smooth transition
    setTimeout(() => playSong(), 100);
  }

  // Handle image load
  const img = new Image();
  img.onload = () => {
    dom.artworkShimmer.classList.remove('loading');
  };
  img.src = song.cover;
}

// ===== Artwork Crossfade =====
function updateArtwork(coverSrc) {
  dom.artwork.style.opacity = '0';
  setTimeout(() => {
    dom.artwork.src = coverSrc;
    dom.artwork.style.opacity = '1';
  }, 300);
}

// ===== Background Crossfade =====
function updateBackground(coverSrc) {
  const incoming = state.bgActiveSlot === 1 ? dom.bgImage2 : dom.bgImage1;
  const outgoing = state.bgActiveSlot === 1 ? dom.bgImage1 : dom.bgImage2;

  incoming.style.backgroundImage = `url(${coverSrc})`;
  incoming.classList.add('active');
  outgoing.classList.remove('active');

  state.bgActiveSlot = state.bgActiveSlot === 1 ? 2 : 1;
}

// ===== Play / Pause =====
function playSong() {
  const playPromise = audio.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      state.isPlaying = true;
      updatePlayButton();
      startAlbumSpin();
      dom.progressFill.classList.add('playing');
      startVisualizerLoop();
      initAudioContext();
    }).catch(err => {
      console.warn('Playback was prevented:', err);
    });
  }
}

function pauseSong() {
  audio.pause();
  state.isPlaying = false;
  updatePlayButton();
  stopAlbumSpin();
  dom.progressFill.classList.remove('playing');
}

function togglePlay() {
  if (state.isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

// ===== Update Play/Pause Button Icons =====
function updatePlayButton() {
  const icon = state.isPlaying ? 'fa-pause' : 'fa-play';
  const label = state.isPlaying ? 'Pause' : 'Play';

  // Animate icon swap (quick scale crossfade)
  [dom.playIcon, dom.miniPlayIcon].forEach(el => {
    el.style.transform = 'scale(0)';
    el.style.opacity = '0';
    setTimeout(() => {
      el.className = `fa-solid ${icon}`;
      el.style.transform = 'scale(1)';
      el.style.opacity = '1';
    }, 150);
  });

  dom.btnPlay.setAttribute('aria-label', label);
  dom.miniBtnPlay.setAttribute('aria-label', label);

  // Update playlist equalizer animation state
  document.querySelectorAll('.mini-eq').forEach(eq => {
    if (state.isPlaying) {
      eq.classList.remove('paused');
    } else {
      eq.classList.add('paused');
    }
  });
}

// ===== Album Spin =====
function startAlbumSpin() {
  dom.artwork.classList.remove('spin-easing');
  dom.artwork.classList.add('spinning');
}

function stopAlbumSpin() {
  // Get current rotation for smooth ease-out
  const computed = getComputedStyle(dom.artwork);
  const matrix = computed.transform;
  let angle = 0;

  if (matrix && matrix !== 'none') {
    const values = matrix.split('(')[1].split(')')[0].split(',');
    const a = parseFloat(values[0]);
    const b = parseFloat(values[1]);
    angle = Math.round(Math.atan2(b, a) * (180 / Math.PI));
  }

  dom.artwork.style.setProperty('--current-rotation', `${angle}deg`);
  dom.artwork.classList.remove('spinning');
  dom.artwork.classList.add('spin-easing');
}

// ===== Next / Previous =====
function nextSong() {
  let nextIndex;

  if (state.repeatMode === 'one') {
    nextIndex = state.currentIndex;
  } else if (state.isShuffled && state.shuffleOrder.length > 0) {
    const currentShufflePos = state.shuffleOrder.indexOf(state.currentIndex);
    const nextShufflePos = (currentShufflePos + 1) % state.shuffleOrder.length;
    nextIndex = state.shuffleOrder[nextShufflePos];
  } else {
    nextIndex = (state.currentIndex + 1) % songs.length;
  }

  loadSong(nextIndex, true);
}

function previousSong() {
  // If more than 3 seconds in, restart; otherwise go to previous
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }

  let prevIndex;

  if (state.isShuffled && state.shuffleOrder.length > 0) {
    const currentShufflePos = state.shuffleOrder.indexOf(state.currentIndex);
    const prevShufflePos = (currentShufflePos - 1 + state.shuffleOrder.length) % state.shuffleOrder.length;
    prevIndex = state.shuffleOrder[prevShufflePos];
  } else {
    prevIndex = (state.currentIndex - 1 + songs.length) % songs.length;
  }

  loadSong(prevIndex, true);
}

// ===== Progress Bar =====
function updateProgress() {
  if (state.isDragging || !audio.duration) return;

  const pct = (audio.currentTime / audio.duration) * 100;
  dom.progressFill.style.width = `${pct}%`;
  dom.progressThumb.style.left = `${pct}%`;
  dom.currentTime.textContent = formatTime(audio.currentTime);

  // Update mini player progress
  dom.miniProgressFill.style.width = `${pct}%`;

  // Update ARIA
  dom.progressBar.setAttribute('aria-valuenow', Math.round(pct));
}

function seekSong(e) {
  const rect = dom.progressBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const pct = x / rect.width;
  const time = pct * (audio.duration || 0);

  audio.currentTime = time;
  dom.progressFill.style.width = `${pct * 100}%`;
  dom.progressThumb.style.left = `${pct * 100}%`;
  dom.currentTime.textContent = formatTime(time);
}

function showSeekPreview(e) {
  const rect = dom.progressBar.getBoundingClientRect();
  const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
  const pct = x / rect.width;
  const previewTime = pct * (audio.duration || 0);

  dom.progressTooltip.textContent = formatTime(previewTime);
  dom.progressThumb.style.left = `${pct * 100}%`;

  if (state.isDragging) {
    dom.progressFill.style.width = `${pct * 100}%`;
    dom.currentTime.textContent = formatTime(previewTime);
  }
}

// ===== Volume Control =====
function changeVolume(val) {
  state.volume = val / 100;
  audio.volume = state.volume;
  state.isMuted = val === 0;

  updateVolumeIcon();
  updateVolumeSliderFill(val);
  showVolumeLabel(val);
}

function toggleMute() {
  if (state.isMuted) {
    state.isMuted = false;
    audio.volume = state.volume || 0.8;
    dom.volumeSlider.value = Math.round(audio.volume * 100);
  } else {
    state.isMuted = true;
    audio.volume = 0;
    dom.volumeSlider.value = 0;
  }

  updateVolumeIcon();
  updateVolumeSliderFill(dom.volumeSlider.value);
  showVolumeLabel(dom.volumeSlider.value);
}

function updateVolumeIcon() {
  const vol = audio.volume;
  let iconClass;

  if (vol === 0 || state.isMuted) {
    iconClass = 'fa-volume-xmark';
  } else if (vol < 0.4) {
    iconClass = 'fa-volume-low';
  } else {
    iconClass = 'fa-volume-high';
  }

  // Crossfade icon
  dom.volumeIcon.style.opacity = '0';
  dom.volumeIcon.style.transform = 'scale(0.8)';
  setTimeout(() => {
    dom.volumeIcon.className = `fa-solid ${iconClass}`;
    dom.volumeIcon.style.opacity = '1';
    dom.volumeIcon.style.transform = 'scale(1)';
  }, 120);
}

function updateVolumeSliderFill(val) {
  dom.volumeSlider.style.setProperty('--volume-pct', `${val}%`);
}

function showVolumeLabel(val) {
  dom.volumeLabel.textContent = `${Math.round(val)}%`;
  dom.volumeLabel.classList.add('visible');

  clearTimeout(state.volumeTimeout);
  state.volumeTimeout = setTimeout(() => {
    dom.volumeLabel.classList.remove('visible');
  }, 1500);
}

// ===== Repeat & Shuffle =====
function toggleRepeat() {
  const modes = ['off', 'all', 'one'];
  const currentIdx = modes.indexOf(state.repeatMode);
  state.repeatMode = modes[(currentIdx + 1) % modes.length];

  // Update button visual
  dom.btnRepeat.classList.toggle('active-mode', state.repeatMode !== 'off');

  // Remove existing badge
  const existingBadge = dom.btnRepeat.querySelector('.repeat-one-badge');
  if (existingBadge) existingBadge.remove();

  if (state.repeatMode === 'one') {
    const badge = document.createElement('span');
    badge.className = 'repeat-one-badge';
    badge.textContent = '1';
    dom.btnRepeat.appendChild(badge);
  }

  // Update aria
  dom.btnRepeat.setAttribute('aria-label', `Repeat ${state.repeatMode}`);

  showToast(`fa-solid fa-repeat`, `Repeat: ${state.repeatMode}`);
}

function toggleShuffle() {
  state.isShuffled = !state.isShuffled;
  dom.btnShuffle.classList.toggle('active-mode', state.isShuffled);

  if (state.isShuffled) {
    // Fisher-Yates shuffle
    state.shuffleOrder = Array.from({ length: songs.length }, (_, i) => i);
    for (let i = state.shuffleOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [state.shuffleOrder[i], state.shuffleOrder[j]] = [state.shuffleOrder[j], state.shuffleOrder[i]];
    }
    // Move current song to front
    const curPos = state.shuffleOrder.indexOf(state.currentIndex);
    if (curPos > 0) {
      [state.shuffleOrder[0], state.shuffleOrder[curPos]] = [state.shuffleOrder[curPos], state.shuffleOrder[0]];
    }
  } else {
    state.shuffleOrder = [];
  }

  showToast('fa-solid fa-shuffle', `Shuffle: ${state.isShuffled ? 'on' : 'off'}`);
}

// ===== Playlist Rendering =====
function renderPlaylist() {
  dom.playlistContainer.innerHTML = '';

  let list;
  if (state.activeTab === 'favorites') {
    list = songs.map((s, i) => ({ song: s, index: i })).filter(item => state.favorites.has(item.index));
  } else if (state.activeTab === 'recent') {
    list = state.recentlyPlayed.map(i => ({ song: songs[i], index: i }));
  } else {
    list = songs.map((s, i) => ({ song: s, index: i }));
  }

  if (list.length === 0) {
    dom.playlistContainer.innerHTML = `
      <div style="text-align:center; padding:40px 20px; color:var(--text-muted); font-size:0.9rem;">
        <i class="fa-solid fa-${state.activeTab === 'favorites' ? 'heart' : 'clock-rotate-left'}" style="font-size:2rem; margin-bottom:12px; display:block; opacity:0.3;"></i>
        No ${state.activeTab === 'favorites' ? 'favorites' : 'recently played tracks'} yet
      </div>`;
    return;
  }

  list.forEach((item, displayIdx) => {
    const { song, index } = item;
    const card = document.createElement('div');
    card.className = 'playlist-card visible';
    card.setAttribute('role', 'listitem');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Play ${song.title} by ${song.artist}`);
    card.dataset.index = index;

    const isFav = state.favorites.has(index);
    const isActive = index === state.currentIndex;

    card.innerHTML = `
      ${isActive
        ? `<div class="mini-eq ${state.isPlaying ? '' : 'paused'}"><span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span></div>`
        : `<span class="card-number">${displayIdx + 1}</span>`
      }
      <img src="${song.cover}" alt="${song.title}" class="card-thumb" loading="lazy" />
      <div class="card-info">
        <div class="card-title">${song.title}</div>
        <div class="card-artist">${song.artist}</div>
      </div>
      <button class="card-fav ${isFav ? 'favorited' : ''}" aria-label="${isFav ? 'Remove from favorites' : 'Add to favorites'}" data-index="${index}">
        <i class="fa-${isFav ? 'solid' : 'regular'} fa-heart"></i>
      </button>
      <span class="card-duration">${song.duration}</span>
    `;

    if (isActive) card.classList.add('active');

    // Click to play
    card.addEventListener('click', (e) => {
      // Don't trigger if clicking favorite button
      if (e.target.closest('.card-fav')) return;

      // Scale-pulse confirmation
      card.style.transform = 'scale(0.96)';
      setTimeout(() => { card.style.transform = ''; }, 150);

      loadSong(index, true);
    });

    // Enter key to play
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        loadSong(index, true);
      }
    });

    // Favorite button
    const favBtn = card.querySelector('.card-fav');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(index, favBtn);
    });

    dom.playlistContainer.appendChild(card);
  });
}

function highlightCurrentSong() {
  document.querySelectorAll('.playlist-card').forEach(card => {
    const idx = parseInt(card.dataset.index);
    card.classList.toggle('active', idx === state.currentIndex);

    // Replace number with equalizer for active track
    const numberEl = card.querySelector('.card-number');
    const eqEl = card.querySelector('.mini-eq');

    if (idx === state.currentIndex) {
      if (numberEl && !eqEl) {
        const eq = document.createElement('div');
        eq.className = `mini-eq ${state.isPlaying ? '' : 'paused'}`;
        eq.innerHTML = '<span class="eq-bar"></span><span class="eq-bar"></span><span class="eq-bar"></span>';
        numberEl.replaceWith(eq);
      }
    } else {
      if (eqEl && !numberEl) {
        const displayIdx = Array.from(dom.playlistContainer.children).indexOf(card);
        const num = document.createElement('span');
        num.className = 'card-number';
        num.textContent = displayIdx + 1;
        eqEl.replaceWith(num);
      }
    }
  });
}

// ===== Search =====
function searchSongs(query) {
  state.searchQuery = query.toLowerCase().trim();

  document.querySelectorAll('.playlist-card').forEach(card => {
    const idx = parseInt(card.dataset.index);
    const song = songs[idx];
    if (!song) return;

    const match = !state.searchQuery ||
      song.title.toLowerCase().includes(state.searchQuery) ||
      song.artist.toLowerCase().includes(state.searchQuery) ||
      song.album.toLowerCase().includes(state.searchQuery);

    if (match) {
      card.classList.remove('hidden');
      card.classList.add('visible');
    } else {
      card.classList.add('hidden');
      card.classList.remove('visible');
    }
  });
}

// ===== Favorites =====
function toggleFavorite(index, btnEl) {
  if (state.favorites.has(index)) {
    state.favorites.delete(index);
    btnEl.classList.remove('favorited');
    btnEl.querySelector('i').className = 'fa-regular fa-heart';
    btnEl.setAttribute('aria-label', 'Add to favorites');
  } else {
    state.favorites.add(index);
    btnEl.classList.add('favorited');
    btnEl.querySelector('i').className = 'fa-solid fa-heart';
    btnEl.setAttribute('aria-label', 'Remove from favorites');
    // Trigger heart pop animation
    btnEl.style.animation = 'none';
    btnEl.offsetHeight; // reflow
    btnEl.style.animation = '';
  }

  saveFavorites();

  // Re-render if on favorites tab
  if (state.activeTab === 'favorites') {
    renderPlaylist();
  }
}

function saveFavorites() {
  try {
    localStorage.setItem('aurora-favorites', JSON.stringify([...state.favorites]));
  } catch (e) { /* localStorage full or unavailable */ }
}

function loadFavorites() {
  try {
    const saved = localStorage.getItem('aurora-favorites');
    if (saved) {
      state.favorites = new Set(JSON.parse(saved));
    }
  } catch (e) { /* ignore */ }
}

// ===== Recently Played =====
function addToRecentlyPlayed(index) {
  // Remove if already present
  state.recentlyPlayed = state.recentlyPlayed.filter(i => i !== index);
  // Add to front
  state.recentlyPlayed.unshift(index);
  // Keep last 10
  if (state.recentlyPlayed.length > 10) {
    state.recentlyPlayed.pop();
  }
  saveRecentlyPlayed();

  // Re-render if on recent tab
  if (state.activeTab === 'recent') {
    renderPlaylist();
  }
}

function saveRecentlyPlayed() {
  try {
    localStorage.setItem('aurora-recent', JSON.stringify(state.recentlyPlayed));
  } catch (e) { /* ignore */ }
}

function loadRecentlyPlayed() {
  try {
    const saved = localStorage.getItem('aurora-recent');
    if (saved) {
      state.recentlyPlayed = JSON.parse(saved);
    }
  } catch (e) { /* ignore */ }
}

// ===== Autoplay (song ended) =====
function handleSongEnd() {
  if (state.repeatMode === 'one') {
    audio.currentTime = 0;
    playSong();
  } else if (state.repeatMode === 'all') {
    nextSong();
  } else {
    // repeat off — stop at end of playlist, or advance
    if (state.isShuffled) {
      const pos = state.shuffleOrder.indexOf(state.currentIndex);
      if (pos < state.shuffleOrder.length - 1) {
        nextSong();
      } else {
        pauseSong();
      }
    } else {
      if (state.currentIndex < songs.length - 1) {
        nextSong();
      } else {
        // Loop back to first
        loadSong(0, true);
      }
    }
  }
}

// ===== Ripple Effect =====
function createRipple(e, btn) {
  const ripple = document.createElement('span');
  ripple.className = 'ripple';

  const rect = btn.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;

  ripple.style.width = ripple.style.height = `${size}px`;
  ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
  ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

  btn.appendChild(ripple);

  ripple.addEventListener('animationend', () => ripple.remove());
}

// ===== Toast Notification =====
function showToast(iconClass, text) {
  dom.toastIcon.className = `toast-icon ${iconClass}`;
  dom.toastText.textContent = text;
  dom.toast.classList.add('visible');

  clearTimeout(state.toastTimeout);
  state.toastTimeout = setTimeout(() => {
    dom.toast.classList.remove('visible');
  }, 600);
}

// ===== Mini Player (scroll-triggered) =====
function handleScroll() {
  const playerRect = dom.player.getBoundingClientRect();
  const threshold = window.innerHeight * 0.4;

  // Show mini player when main player is mostly scrolled out of view
  if (playerRect.bottom < threshold) {
    dom.miniPlayer.classList.add('visible');
  } else {
    dom.miniPlayer.classList.remove('visible');
  }
}

// ===== Web Audio API Visualizer =====
// Attempts to create an AudioContext for real frequency data.
// Falls back to simulated bars if CORS blocks analyser access.
function initAudioContext() {
  if (state.audioContext) return;

  try {
    // Only attempt if audio has crossOrigin set (same-origin or CORS-enabled source)
    if (!audio.crossOrigin) {
      // Can't use Web Audio API with cross-origin audio without CORS headers.
      // The visualizer loop will use the simulated fallback.
      return;
    }
    state.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    state.analyser = state.audioContext.createAnalyser();
    state.analyser.fftSize = 64;
    state.analyser.smoothingTimeConstant = 0.8;

    state.sourceNode = state.audioContext.createMediaElementSource(audio);
    state.sourceNode.connect(state.analyser);
    state.analyser.connect(state.audioContext.destination);
  } catch (e) {
    console.warn('Web Audio API not available for this source:', e);
    state.audioContext = null;
    state.analyser = null;
  }
}

function startVisualizerLoop() {
  if (state.animationFrame) return;

  function loop() {
    state.animationFrame = requestAnimationFrame(loop);

    if (state.analyser) {
      const data = new Uint8Array(state.analyser.frequencyBinCount);
      state.analyser.getByteFrequencyData(data);

      dom.vizBars.forEach((bar, i) => {
        // Map frequency bins to bar heights
        const binIndex = Math.floor((i / dom.vizBars.length) * data.length);
        const value = data[binIndex] || 0;
        const height = Math.max(4, (value / 255) * 40);

        bar.style.height = `${height}px`;
      });
    } else if (state.isPlaying) {
      // Simulated visualizer — smooth, musical-looking motion
      const time = performance.now() / 1000;
      dom.vizBars.forEach((bar, i) => {
        // Use sine waves at different frequencies for organic movement
        const freq1 = 1.2 + i * 0.4;
        const freq2 = 0.8 + i * 0.3;
        const wave = (Math.sin(time * freq1) + Math.sin(time * freq2 + i)) / 2;
        const h = Math.max(4, ((wave + 1) / 2) * 32 + 4);
        bar.style.height = `${h}px`;
      });
    }

    // Update progress
    updateProgress();
  }

  loop();
}

function stopVisualizerLoop() {
  if (state.animationFrame) {
    cancelAnimationFrame(state.animationFrame);
    state.animationFrame = null;
  }

  // Settle bars to idle
  dom.vizBars.forEach(bar => {
    bar.style.height = '4px';
  });
}

// ===== Keyboard Shortcuts =====
function handleKeyboard(e) {
  // Don't trigger if typing in search
  if (document.activeElement === dom.searchInput) return;

  switch (e.code) {
    case 'Space':
      e.preventDefault();
      togglePlay();
      showToast(state.isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play', state.isPlaying ? 'Paused' : 'Playing');
      break;
    case 'ArrowLeft':
      e.preventDefault();
      previousSong();
      showToast('fa-solid fa-backward-step', 'Previous');
      break;
    case 'ArrowRight':
      e.preventDefault();
      nextSong();
      showToast('fa-solid fa-forward-step', 'Next');
      break;
    case 'ArrowUp':
      e.preventDefault();
      {
        const newVol = Math.min(100, parseInt(dom.volumeSlider.value) + 5);
        dom.volumeSlider.value = newVol;
        changeVolume(newVol);
        showToast('fa-solid fa-volume-high', `Volume: ${newVol}%`);
      }
      break;
    case 'ArrowDown':
      e.preventDefault();
      {
        const newVol = Math.max(0, parseInt(dom.volumeSlider.value) - 5);
        dom.volumeSlider.value = newVol;
        changeVolume(newVol);
        showToast('fa-solid fa-volume-low', `Volume: ${newVol}%`);
      }
      break;
  }
}

// ===== Tab Navigation =====
function switchTab(tab) {
  state.activeTab = tab;

  // Update button states
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
    btn.setAttribute('aria-pressed', btn.dataset.tab === tab);
  });

  // Clear search
  dom.searchInput.value = '';
  state.searchQuery = '';

  // Re-render playlist
  renderPlaylist();
}

// ===== Utility: Format Time =====
function formatTime(seconds) {
  if (isNaN(seconds) || !isFinite(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ===== Debounce Utility =====
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

// ===== Event Listeners =====
function setupEventListeners() {
  // --- Playback controls ---
  dom.btnPlay.addEventListener('click', (e) => {
    createRipple(e, dom.btnPlay);
    togglePlay();
  });

  dom.btnNext.addEventListener('click', (e) => {
    createRipple(e, dom.btnNext);
    nextSong();
  });

  dom.btnPrev.addEventListener('click', (e) => {
    createRipple(e, dom.btnPrev);
    previousSong();
  });

  dom.btnShuffle.addEventListener('click', (e) => {
    createRipple(e, dom.btnShuffle);
    toggleShuffle();
  });

  dom.btnRepeat.addEventListener('click', (e) => {
    createRipple(e, dom.btnRepeat);
    toggleRepeat();
  });

  // --- Mini player controls ---
  dom.miniBtnPlay.addEventListener('click', () => togglePlay());
  dom.miniBtnNext.addEventListener('click', () => nextSong());
  dom.miniBtnPrev.addEventListener('click', () => previousSong());

  // --- Volume ---
  dom.volumeSlider.addEventListener('input', (e) => {
    changeVolume(parseInt(e.target.value));
  });

  dom.btnMute.addEventListener('click', (e) => {
    createRipple(e, dom.btnMute);
    toggleMute();
  });

  // --- Progress bar seeking ---
  dom.progressBar.addEventListener('mousedown', (e) => {
    state.isDragging = true;
    dom.progressBar.classList.add('dragging');
    seekSong(e);
  });

  document.addEventListener('mousemove', (e) => {
    if (state.isDragging) {
      seekSong(e);
      showSeekPreview(e);
    }
  });

  document.addEventListener('mouseup', () => {
    if (state.isDragging) {
      state.isDragging = false;
      dom.progressBar.classList.remove('dragging');
    }
  });

  // Touch support for progress bar
  dom.progressBar.addEventListener('touchstart', (e) => {
    state.isDragging = true;
    dom.progressBar.classList.add('dragging');
    const touch = e.touches[0];
    seekSong(touch);
  }, { passive: true });

  dom.progressBar.addEventListener('touchmove', (e) => {
    if (state.isDragging) {
      const touch = e.touches[0];
      seekSong(touch);
      showSeekPreview(touch);
    }
  }, { passive: true });

  dom.progressBar.addEventListener('touchend', () => {
    state.isDragging = false;
    dom.progressBar.classList.remove('dragging');
  });

  // Progress bar hover preview
  dom.progressBar.addEventListener('mousemove', (e) => {
    if (!state.isDragging) {
      showSeekPreview(e);
    }
  });

  // --- Audio events ---
  audio.addEventListener('timeupdate', () => {
    if (!state.isDragging) updateProgress();
  });

  audio.addEventListener('loadedmetadata', () => {
    dom.totalTime.textContent = formatTime(audio.duration);
  });

  audio.addEventListener('ended', handleSongEnd);

  audio.addEventListener('playing', () => {
    if (!state.animationFrame) startVisualizerLoop();
  });

  audio.addEventListener('pause', () => {
    // Settle visualizer bars
    if (!state.isPlaying) {
      setTimeout(() => {
        dom.vizBars.forEach(bar => {
          bar.style.transition = 'height 0.5s ease-out';
          bar.style.height = '4px';
          setTimeout(() => { bar.style.transition = ''; }, 500);
        });
      }, 100);
    }
  });

  // --- Search ---
  dom.searchInput.addEventListener('input', debounce((e) => {
    searchSongs(e.target.value);
  }, 200));

  // --- Tabs ---
  dom.tabAll.addEventListener('click', () => switchTab('all'));
  dom.tabFavorites.addEventListener('click', () => switchTab('favorites'));
  dom.tabRecent.addEventListener('click', () => switchTab('recent'));

  // --- Keyboard shortcuts ---
  document.addEventListener('keydown', handleKeyboard);

  // --- Scroll for mini player ---
  window.addEventListener('scroll', handleScroll, { passive: true });
  // Also detect scroll within the app container on mobile
  dom.player.addEventListener('scroll', handleScroll, { passive: true });

  // --- Volume slider initial fill ---
  updateVolumeSliderFill(dom.volumeSlider.value);

  // --- Initial background ---
  const firstSong = songs[0];
  dom.bgImage1.style.backgroundImage = `url(${firstSong.cover})`;
  dom.bgImage1.classList.add('active');
  dom.artworkGlow.style.backgroundImage = `url(${firstSong.cover})`;
}

// ===== Start =====
document.addEventListener('DOMContentLoaded', init);
