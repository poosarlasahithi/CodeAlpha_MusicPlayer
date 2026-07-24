/* ================================================================
   Aurora Music Streaming Platform — Player Engine & Audio Controller
   ================================================================ */

'use strict';

class PlayerEngine {
  constructor() {
    this.audio = new Audio();
    this.audio.preload = 'metadata';

    const savedVol = window.storageManager?.getItem('volume', 0.8);
    const savedSpeed = window.storageManager?.getItem('speed', 1.0);

    this.audio.volume = savedVol !== null ? savedVol : 0.8;
    this.audio.playbackRate = savedSpeed !== null ? savedSpeed : 1.0;

    this.dom = {
      playerBar: document.getElementById('playerBar'),
      artwork: document.getElementById('playerArtwork'),
      title: document.getElementById('playerTitle'),
      artist: document.getElementById('playerArtist'),
      btnPlay: document.getElementById('btnPlay'),
      playIcon: document.getElementById('playIcon'),
      btnPrev: document.getElementById('btnPrev'),
      btnNext: document.getElementById('btnNext'),
      btnShuffle: document.getElementById('btnShuffle'),
      btnRepeat: document.getElementById('btnRepeat'),
      btnMute: document.getElementById('btnMute'),
      volumeSlider: document.getElementById('volumeSlider'),
      volumeIcon: document.getElementById('volumeIcon'),
      progressBar: document.getElementById('progressBar'),
      progressFill: document.getElementById('progressFill'),
      currentTime: document.getElementById('currentTime'),
      remainingTime: document.getElementById('remainingTime'),
      speedSelect: document.getElementById('speedSelect'),
      btnSleepTimer: document.getElementById('btnSleepTimer'),
      btnVinylMode: document.getElementById('btnVinylMode'),
      vinylDisc: document.getElementById('vinylDisc'),
      vinylNeedle: document.getElementById('vinylNeedle'),
      vinylCenterImg: document.getElementById('vinylCenterImg'),
      vizBars: document.querySelectorAll('.viz-bar')
    };

    this.initListeners();
  }

  initListeners() {
    this.audio.addEventListener('timeupdate', () => this.onTimeUpdate());
    this.audio.addEventListener('ended', () => this.onEnded());
    this.audio.addEventListener('loadedmetadata', () => {
      if (this.dom.remainingTime) {
        this.dom.remainingTime.textContent = window.formatTime(this.audio.duration);
      }
    });

    // Control buttons
    this.dom.btnPlay?.addEventListener('click', () => this.togglePlay());
    this.dom.btnNext?.addEventListener('click', () => this.next());
    this.dom.btnPrev?.addEventListener('click', () => this.previous());
    this.dom.btnShuffle?.addEventListener('click', () => this.toggleShuffle());
    this.dom.btnRepeat?.addEventListener('click', () => this.toggleRepeat());
    this.dom.btnMute?.addEventListener('click', () => this.toggleMute());

    // Volume Slider
    if (this.dom.volumeSlider) {
      this.dom.volumeSlider.value = Math.round(this.audio.volume * 100);
      this.dom.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.audio.volume = val / 100;
        this.updateVolumeIcon(val);
        window.storageManager?.setItem('volume', this.audio.volume);
      });
    }

    // Progress Seek
    this.dom.progressBar?.addEventListener('click', (e) => {
      const rect = this.dom.progressBar.getBoundingClientRect();
      const pct = (e.clientX - rect.left) / rect.width;
      this.audio.currentTime = pct * (this.audio.duration || 0);
    });

    // Speed Selector
    if (this.dom.speedSelect) {
      this.dom.speedSelect.value = (window.storageManager?.getItem('speed', 1.0) || 1.0).toString();
      this.dom.speedSelect.addEventListener('change', (e) => {
        const speed = parseFloat(e.target.value);
        this.audio.playbackRate = speed;
        window.storageManager?.setItem('speed', speed);
        window.showToast('fa-solid fa-gauge-high', `Speed: ${speed}x`);
      });
    }

    // Sleep Timer
    this.dom.btnSleepTimer?.addEventListener('click', () => this.toggleSleepTimer());

    // Vinyl Mode Toggle
    this.dom.btnVinylMode?.addEventListener('click', () => this.toggleVinylMode());

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  playTrack(song) {
    if (!song) return;
    const isSameTrack = window.appState?.currentTrack?.id === song.id;

    window.appState.currentTrack = song;
    window.appState.currentIndex = CATALOG_SONGS.findIndex(s => s.id === song.id);
    window.storageManager?.setItem('current_track', song);

    this.audio.src = song.audio;
    this.audio.playbackRate = parseFloat(this.dom.speedSelect?.value || 1.0);

    if (this.dom.artwork) this.dom.artwork.src = song.cover;
    if (this.dom.vinylCenterImg) this.dom.vinylCenterImg.src = song.cover;
    if (this.dom.title) this.dom.title.textContent = song.title;
    if (this.dom.artist) this.dom.artist.textContent = `${song.artist} • ${song.album}`;

    this.play();
    window.showToast('fa-solid fa-compact-disc', `Playing "${song.title}"`);
    window.dispatchEvent(new CustomEvent('trackChanged', { detail: song }));
  }

  play() {
    this.audio.play().then(() => {
      window.appState.isPlaying = true;
      this.updatePlayIcon(true);
      this.startVisualizer();
      this.toggleSpin(true);
      if (this.synthInterval) { clearInterval(this.synthInterval); this.synthInterval = null; }
    }).catch(err => {
      console.warn('[PlayerEngine] Play stream fallback activated:', err);
      window.appState.isPlaying = true;
      this.updatePlayIcon(true);
      this.startVisualizer();
      this.toggleSpin(true);
      this.startSynthFallback();
    });
  }

  startSynthFallback() {
    if (this.synthInterval) clearInterval(this.synthInterval);
    if (!this.synthCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.synthCtx = new AudioContext();
    }
    if (this.synthCtx && this.synthCtx.state === 'suspended') {
      this.synthCtx.resume();
    }
    
    // Virtual timer fallback
    let fakeTime = this.audio.currentTime || 0;
    const duration = window.appState.currentTrack?.durationSec || 200;

    this.synthInterval = setInterval(() => {
      if (!window.appState.isPlaying) {
        clearInterval(this.synthInterval);
        return;
      }
      fakeTime += 1;
      this.audio.currentTime = fakeTime;
      this.onTimeUpdate();

      // Play soft ambient tone
      if (this.synthCtx) {
        try {
          const osc = this.synthCtx.createOscillator();
          const gain = this.synthCtx.createGain();
          osc.type = 'sine';
          const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00];
          osc.frequency.value = notes[Math.floor(Math.random() * notes.length)];
          gain.gain.setValueAtTime(0.04 * (this.audio.volume || 0.8), this.synthCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, this.synthCtx.currentTime + 0.8);
          osc.connect(gain);
          gain.connect(this.synthCtx.destination);
          osc.start();
          osc.stop(this.synthCtx.currentTime + 0.8);
        } catch (e) {}
      }

      if (fakeTime >= duration) {
        clearInterval(this.synthInterval);
        this.onEnded();
      }
    }, 1000);
  }

  pause() {
    this.audio.pause();
    window.appState.isPlaying = false;
    this.updatePlayIcon(false);
    this.stopVisualizer();
    this.toggleSpin(false);
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  togglePlay() {
    if (window.appState.isPlaying) this.pause();
    else this.play();
  }

  next() {
    if (window.queueManager && window.queueManager.queue.length > 0) {
      let nextIdx = window.queueManager.currentIndex + 1;
      if (nextIdx >= window.queueManager.queue.length) nextIdx = 0;
      const nextSong = window.queueManager.queue[nextIdx];
      this.playTrack(nextSong);
      return;
    }

    let nextIdx = (window.appState.currentIndex + 1) % CATALOG_SONGS.length;
    this.playTrack(CATALOG_SONGS[nextIdx]);
  }

  previous() {
    if (this.audio.currentTime > 3) {
      this.audio.currentTime = 0;
      return;
    }

    if (window.queueManager && window.queueManager.queue.length > 0) {
      let prevIdx = window.queueManager.currentIndex - 1;
      if (prevIdx < 0) prevIdx = window.queueManager.queue.length - 1;
      const prevSong = window.queueManager.queue[prevIdx];
      this.playTrack(prevSong);
      return;
    }

    let prevIdx = (window.appState.currentIndex - 1 + CATALOG_SONGS.length) % CATALOG_SONGS.length;
    this.playTrack(CATALOG_SONGS[prevIdx]);
  }

  toggleShuffle() {
    window.appState.isShuffled = !window.appState.isShuffled;
    this.dom.btnShuffle?.classList.toggle('active-mode', window.appState.isShuffled);
    window.showToast('fa-solid fa-shuffle', `Shuffle: ${window.appState.isShuffled ? 'On' : 'Off'}`);
  }

  toggleRepeat() {
    const modes = ['off', 'all', 'one'];
    const idx = modes.indexOf(window.appState.repeatMode);
    window.appState.repeatMode = modes[(idx + 1) % modes.length];
    this.dom.btnRepeat?.classList.toggle('active-mode', window.appState.repeatMode !== 'off');
    window.showToast('fa-solid fa-repeat', `Repeat: ${window.appState.repeatMode}`);
  }

  toggleMute() {
    this.audio.muted = !this.audio.muted;
    this.updateVolumeIcon(this.audio.muted ? 0 : this.audio.volume * 100);
    window.showToast(this.audio.muted ? 'fa-solid fa-volume-xmark' : 'fa-solid fa-volume-high', this.audio.muted ? 'Muted' : 'Unmuted');
  }

  adjustVolume(delta) {
    let newVol = Math.max(0, Math.min(1, this.audio.volume + delta / 100));
    this.audio.volume = newVol;
    if (this.dom.volumeSlider) this.dom.volumeSlider.value = Math.round(newVol * 100);
    this.updateVolumeIcon(newVol * 100);
    window.storageManager?.setItem('volume', newVol);
  }

  updatePlayIcon(isPlaying) {
    if (!this.dom.playIcon) return;
    this.dom.playIcon.className = `fa-solid ${isPlaying ? 'fa-pause' : 'fa-play'}`;
  }

  updateVolumeIcon(val) {
    if (!this.dom.volumeIcon) return;
    if (val === 0 || this.audio.muted) this.dom.volumeIcon.className = 'fa-solid fa-volume-xmark';
    else if (val < 40) this.dom.volumeIcon.className = 'fa-solid fa-volume-low';
    else this.dom.volumeIcon.className = 'fa-solid fa-volume-high';
  }

  onTimeUpdate() {
    if (!this.audio.duration) return;
    const cur = this.audio.currentTime;
    const dur = this.audio.duration;
    const pct = (cur / dur) * 100;

    if (this.dom.progressFill) this.dom.progressFill.style.width = `${pct}%`;
    if (this.dom.currentTime) this.dom.currentTime.textContent = window.formatTime(cur);
    if (this.dom.remainingTime) this.dom.remainingTime.textContent = `-${window.formatTime(dur - cur)}`;

    window.dispatchEvent(new CustomEvent('timeUpdate', { detail: cur }));
  }

  onEnded() {
    if (window.appState.repeatMode === 'one') {
      this.audio.currentTime = 0;
      this.play();
    } else {
      this.next();
    }
  }

  toggleVinylMode() {
    window.appState.isVinylMode = !window.appState.isVinylMode;
    this.dom.btnVinylMode?.classList.toggle('active-mode', window.appState.isVinylMode);
    if (this.dom.vinylDisc) this.dom.vinylDisc.classList.toggle('playing', window.appState.isVinylMode && window.appState.isPlaying);
    if (this.dom.vinylNeedle) this.dom.vinylNeedle.classList.toggle('playing', window.appState.isVinylMode && window.appState.isPlaying);
    window.showToast('fa-solid fa-compact-disc', `Vinyl Mode: ${window.appState.isVinylMode ? 'On' : 'Off'}`);
  }

  toggleSpin(isPlaying) {
    if (this.dom.artwork) {
      if (isPlaying) this.dom.artwork.classList.add('spinning');
      else this.dom.artwork.classList.remove('spinning');
    }
    if (this.dom.vinylDisc) this.dom.vinylDisc.classList.toggle('playing', isPlaying && window.appState.isVinylMode);
    if (this.dom.vinylNeedle) this.dom.vinylNeedle.classList.toggle('playing', isPlaying && window.appState.isVinylMode);
  }

  toggleSleepTimer() {
    window.showPrompt('Sleep Timer', 'Set sleep duration (minutes):', '30', (mins) => {
      if (!mins) return;
      const num = parseInt(mins);
      if (isNaN(num) || num <= 0) return;

      window.showToast('fa-solid fa-bed', `Sleep timer set for ${num} minutes`);
      clearTimeout(this._sleepTimer);
      this._sleepTimer = setTimeout(() => {
        this.pause();
        window.showToast('fa-solid fa-moon', 'Sleep timer elapsed. Music paused.');
      }, num * 60 * 1000);
    });
  }

  startVisualizer() {
    if (this._vizTimer) return;
    this._vizTimer = setInterval(() => {
      if (!window.appState.isPlaying) return;
      this.dom.vizBars?.forEach((bar) => {
        const h = Math.max(6, Math.random() * 26 + 4);
        bar.style.height = `${h}px`;
      });
    }, 120);
  }

  stopVisualizer() {
    clearInterval(this._vizTimer);
    this._vizTimer = null;
    this.dom.vizBars?.forEach(bar => bar.style.height = '4px');
  }

  handleKeyboard(e) {
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;
    switch (e.code) {
      case 'Space':
        e.preventDefault();
        this.togglePlay();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this.previous();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.next();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.adjustVolume(10);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this.adjustVolume(-10);
        break;
      case 'KeyM':
        this.toggleMute();
        break;
      case 'KeyR':
        this.toggleRepeat();
        break;
      case 'KeyS':
        this.toggleShuffle();
        break;
      case 'KeyF':
        if (window.appState.currentTrack) {
          window.favoritesManager?.toggle(window.appState.currentTrack.id);
        }
        break;
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.playerEngine = new PlayerEngine();
});
