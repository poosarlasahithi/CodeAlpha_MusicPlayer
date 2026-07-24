/* ================================================================
   Aurora Music Streaming Platform — Analytics Engine & Dashboard
   ================================================================ */

'use strict';

class AnalyticsEngine {
  constructor() {
    this.stats = window.storageManager?.getItem('analytics', null) || {
      songsPlayedToday: 18,
      totalMinutes: 245,
      favoriteGenre: 'Synthwave',
      favoriteArtist: 'Aurora Synth',
      listeningStreak: 7,
      completionPercentage: 94,
      genreCounts: { Synthwave: 24, EDM: 18, 'Lo-Fi': 15, Rock: 12, Jazz: 8, Classical: 6 },
      artistCounts: { 'Aurora Synth': 24, 'Circuit Breaker': 18, 'Sunset Waves': 15, 'Helios': 12 },
      songPlayCounts: { 1: 14, 4: 10, 2: 8, 7: 6 },
      recentActivity: [
        { songTitle: 'Neon Dreams', time: Date.now() - 300000 },
        { songTitle: 'Golden Hour', time: Date.now() - 1800000 },
        { songTitle: 'Electric Pulse', time: Date.now() - 3600000 }
      ]
    };

    this.init();
  }

  init() {
    window.addEventListener('trackChanged', (e) => {
      const song = e.detail;
      this.recordPlay(song);
    });

    this.renderDashboard();
  }

  recordPlay(song) {
    if (!song) return;
    this.stats.songsPlayedToday++;
    const durationMins = Math.round((song.durationSec || 240) / 60);
    this.stats.totalMinutes += durationMins;

    // Track Genre
    this.stats.genreCounts[song.genre] = (this.stats.genreCounts[song.genre] || 0) + 1;
    let topG = this.stats.favoriteGenre;
    let maxG = 0;
    for (const [g, c] of Object.entries(this.stats.genreCounts)) {
      if (c > maxG) { maxG = c; topG = g; }
    }
    this.stats.favoriteGenre = topG;

    // Track Artist
    this.stats.artistCounts[song.artist] = (this.stats.artistCounts[song.artist] || 0) + 1;
    let topA = this.stats.favoriteArtist;
    let maxA = 0;
    for (const [a, c] of Object.entries(this.stats.artistCounts)) {
      if (c > maxA) { maxA = c; topA = a; }
    }
    this.stats.favoriteArtist = topA;

    // Track Song
    this.stats.songPlayCounts[song.id] = (this.stats.songPlayCounts[song.id] || 0) + 1;

    // Activity Log
    this.stats.recentActivity.unshift({ songTitle: song.title, time: Date.now() });
    if (this.stats.recentActivity.length > 10) this.stats.recentActivity.pop();

    this.save();
    this.renderDashboard();
  }

  getMostPlayedSong() {
    let topId = 1;
    let maxCount = 0;
    for (const [id, count] of Object.entries(this.stats.songPlayCounts)) {
      if (count > maxCount) {
        maxCount = count;
        topId = parseInt(id);
      }
    }
    return CATALOG_SONGS.find(s => s.id === topId) || CATALOG_SONGS[0];
  }

  save() {
    window.storageManager?.setItem('analytics', this.stats);
  }

  renderDashboard() {
    const elSongs = document.getElementById('statSongsToday');
    const elMins = document.getElementById('statMinutesTotal');
    const elGenre = document.getElementById('statFavGenre');
    const elStreak = document.getElementById('statStreak');
    const panelStats = document.getElementById('panelStats');

    if (elSongs) elSongs.textContent = this.stats.songsPlayedToday;
    if (elMins) elMins.textContent = `${this.stats.totalMinutes}m`;
    if (elGenre) elGenre.textContent = this.stats.favoriteGenre;
    if (elStreak) elStreak.textContent = `${this.stats.listeningStreak} Days`;

    if (!panelStats) return;

    // Render detailed stats panel content
    const mostPlayedSong = this.getMostPlayedSong();

    panelStats.innerHTML = `
      <h4 style="font-size:0.9rem; color:var(--text-secondary); margin-bottom:16px; font-weight:700; text-transform:uppercase; letter-spacing:0.5px;">Listening Analytics</h4>

      <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:20px;">
        <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); text-align:center; border:1px solid var(--card-border);">
          <div style="font-size:1.4rem; font-weight:700; color:var(--accent);" id="statSongsToday">${this.stats.songsPlayedToday}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Played Today</div>
        </div>
        <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); text-align:center; border:1px solid var(--card-border);">
          <div style="font-size:1.4rem; font-weight:700; color:var(--accent2);" id="statMinutesTotal">${this.stats.totalMinutes}m</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Total Minutes</div>
        </div>
        <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); text-align:center; border:1px solid var(--card-border);">
          <div style="font-size:1.1rem; font-weight:700; color:var(--text); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" id="statFavGenre">${this.stats.favoriteGenre}</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Top Genre</div>
        </div>
        <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); text-align:center; border:1px solid var(--card-border);">
          <div style="font-size:1.1rem; font-weight:700; color:#F97316;" id="statStreak">${this.stats.listeningStreak} Days</div>
          <div style="font-size:0.75rem; color:var(--text-secondary);">Streak</div>
        </div>
      </div>

      <!-- Top Highlights -->
      <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); margin-bottom:16px; border:1px solid var(--card-border);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Most Played Track</div>
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${mostPlayedSong.cover}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;" />
          <div style="min-width:0; flex:1;">
            <div style="font-size:0.85rem; font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${mostPlayedSong.title}</div>
            <div style="font-size:0.75rem; color:var(--text-secondary);">${mostPlayedSong.artist}</div>
          </div>
        </div>
      </div>

      <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); margin-bottom:16px; border:1px solid var(--card-border);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:8px;">Favorite Artist</div>
        <div style="font-size:0.95rem; font-weight:700; color:var(--accent);">${this.stats.favoriteArtist}</div>
      </div>

      <!-- Listening Breakdown Bar Charts -->
      <div style="background:var(--card); padding:14px; border-radius:var(--radius-xs); margin-bottom:16px; border:1px solid var(--card-border);">
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:12px;">Genre Distribution</div>
        ${Object.entries(this.stats.genreCounts).slice(0, 4).map(([genre, count]) => {
          const pct = Math.min(100, Math.round((count / (this.stats.songsPlayedToday || 1)) * 100));
          return `
            <div style="margin-bottom:8px;">
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:4px;">
                <span>${genre}</span>
                <span style="color:var(--text-secondary);">${count} plays</span>
              </div>
              <div style="height:6px; background:rgba(255,255,255,0.08); border-radius:3px; overflow:hidden;">
                <div style="height:100%; width:${pct}%; background:linear-gradient(90deg, var(--accent), var(--accent2)); border-radius:3px;"></div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Recent Activity Log -->
      <div>
        <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase; margin-bottom:10px;">Recent Activity</div>
        ${this.stats.recentActivity.slice(0, 5).map(act => `
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:0.75rem; padding:6px 0; border-bottom:1px solid var(--card-border);">
            <span style="color:var(--text);">${act.songTitle}</span>
            <span style="color:var(--text-muted);">${window.formatTimestamp ? window.formatTimestamp(act.time) : 'Recently'}</span>
          </div>
        `).join('')}
      </div>
    `;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.analyticsEngine = new AnalyticsEngine();
});
