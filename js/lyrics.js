/* ================================================================
   Aurora Music Streaming Platform — Karaoke Lyrics Engine
   ================================================================ */

'use strict';

class LyricsEngine {
  constructor() {
    this.container = document.getElementById('panelLyrics');
    this.currentLyrics = [];
    this.init();
  }

  init() {
    window.addEventListener('trackChanged', (e) => {
      const song = e.detail;
      this.loadLyrics(song);
    });

    window.addEventListener('timeUpdate', (e) => {
      const currentTime = e.detail;
      this.syncLyrics(currentTime);
    });
  }

  loadLyrics(song) {
    if (!this.container) return;
    this.container.innerHTML = '';
    this.currentLyrics = song.lyrics || [];

    if (!this.currentLyrics || this.currentLyrics.length === 0) {
      this.container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--text-muted); text-align:center; padding:40px 20px;">
          <i class="fa-solid fa-microphone-slash" style="font-size:2.5rem; margin-bottom:16px; opacity:0.4;"></i>
          <p style="font-size:1rem; font-weight:600;">No lyrics available.</p>
          <p style="font-size:0.8rem; margin-top:6px;">Enjoy the instrumental vibes of "${song.title}"!</p>
        </div>
      `;
      return;
    }

    this.currentLyrics.forEach((lineData) => {
      const lineEl = document.createElement('div');
      lineEl.className = 'lyric-line';
      lineEl.dataset.time = lineData.time;
      lineEl.textContent = lineData.text;

      lineEl.addEventListener('click', () => {
        if (window.playerEngine) {
          window.playerEngine.audio.currentTime = lineData.time;
          window.playerEngine.play();
        }
      });

      this.container.appendChild(lineEl);
    });
  }

  syncLyrics(currentTime) {
    if (!this.container || !this.currentLyrics || this.currentLyrics.length === 0) return;
    const lineElements = this.container.querySelectorAll('.lyric-line');
    let activeIndex = -1;

    for (let i = 0; i < this.currentLyrics.length; i++) {
      if (currentTime >= this.currentLyrics[i].time) {
        activeIndex = i;
      } else {
        break;
      }
    }

    lineElements.forEach((el, idx) => {
      if (idx === activeIndex) {
        if (!el.classList.contains('active')) {
          lineElements.forEach(l => l.classList.remove('active'));
          el.classList.add('active');
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.lyricsEngine = new LyricsEngine();
});
