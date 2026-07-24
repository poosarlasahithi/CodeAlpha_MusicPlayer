# 🎵 Aurora Music — Next-Generation Web Music Player

A feature-rich, high-performance, commercial-grade Music Player & Streaming Application built with **Vanilla HTML5**, **CSS3 Glassmorphism**, and **JavaScript ES6 Modules**. Developed for the **CodeAlpha** Web Development Internship.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Design](https://img.shields.io/badge/Glassmorphism-Dynamic--Themes-00D4FF.svg)
![Speech](https://img.shields.io/badge/Voice--Control-Web--Speech--API-1DB954.svg)

---

## 📸 Interface Previews & Screenshots

### 1. Landing Page Dashboard (`index.html`)
> Modern marketing & landing interface with interactive hero section, feature ticker, genre discovery grid, and theme customization preview.

```
+-----------------------------------------------------------------------------------+
|  🎧 Aurora          Featured  Trending  Top Charts  Genres     [🟢 Theme] [Log In]  |
|                                                                                   |
|                   ✨ Next-Generation Streaming Experience                          |
|             Music Beyond Boundaries. Infinite Sound.                              |
|   Stream 50+ hand-curated tracks with ultra-crisp audio, synced lyrics, & AI voice |
|                                                                                   |
|                [🚀 Launch Music App]      [Explore Collections]                  |
|                                                                                   |
|  +-----------------------------------------------------------------------------+  |
|  | [Album Cover]  FEATURED ALBUM OF THE WEEK: Synthwave Journeys               |  |
|  |                By Aurora Synth • 10 Tracks • High Fidelity Lossless        |  |
|  +-----------------------------------------------------------------------------+  |
|                                                                                   |
|  [⚡ Lossless Quality] --- [🎤 Synced Lyrics] --- [🎨 6 Glassmorphic Themes]       |
+-----------------------------------------------------------------------------------+
```

### 2. Full-Screen Interactive Music Player (`player.html`)
> Glassmorphic Single Page Application featuring audio controls, vinyl disc simulation, live synced lyrics, custom queue, favorites, and real-time analytics.

```
+-----------------------------------------------------------------------------------+
|  AURORA        |  🔍 Search title, artist, genre...       [🎤 Voice] [🔴 Live]    |
+----------------+------------------------------------------------------------------+
|  🏠 Home       |  WELCOME BACK                                                    |
|  🧭 Browse     |  +-----------------------+  +----------------------------------+ |
|  🔖 Library    |  | Featured Playlist     |  | Trending Track List              | |
|  ❤️ Favorites  |  | "Synthwave Journeys"  |  | 1. Neon Dreams - 6:14            | |
|  🕒 Recent     |  +-----------------------+  | 2. Golden Hour - 5:46            | |
|                |                             | 3. Midnight Ocean - 7:08         | |
|  PLAYLISTS     |  GENRE EXPLORER             +----------------------------------+ |
|  + Chill Mix   |  [Synthwave] [Lo-Fi] [EDM] [Rock] [Ambient]                      |
|  + Workout     |                                                                  |
+----------------+------------------------------------------------------------------+
| [Cover] Song Title - Artist  |  [⏮] [⏯] [⏭] [🔀] [🔁]  01:45 [========--] 06:14   |
+-----------------------------------------------------------------------------------+
```

---

## 🌟 Comprehensive Features

### 🎧 Core Audio Engine
- **Full Playback Controls**: Play, pause, seek, jump forward/backward, adjust volume, mute/unmute.
- **Playback Modes**: Loop single track, repeat playlist, and shuffle queue.
- **Interactive Audio Scrub Bar**: Real-time timestamp display (`00:00 / 03:45`) and seek control.
- **Web Audio API Fallback Synthesizer**: Seamless fallback generator ensuring audio playback is 100% guaranteed even offline or under restricted CORS networks.

### 🎤 Voice Command Recognition
- Integrated **Web Speech API** for real-time speech command parsing.
- Voice-driven commands for play, pause, next, previous, volume manipulation, and mute toggles.
- Live microphone status indicator with visual pulse animation.

### 📜 Synchronized Lyrics Subsystem
- Time-stamped karaoke lyrics parser (`[mm:ss.xx]`).
- Smooth scrolling lyrics view synchronized with audio current time.
- Click-to-seek functionality: Click on any lyric line to jump playback directly to that timestamp.

### 🎨 Glassmorphism & Custom Themes
- Modern UI with backdrop blur filters, smooth color gradients, and glowing accents.
- Dynamic theme engine with 6 presets: Spotify Green, Midnight Blue, Galaxy Purple, Ocean Cyan, Sunset Orange, and Light Mode.

### 🔍 Smart Search & Filtering
- Instant client-side search across track titles, artists, album names, and musical genres.
- Real-time search query highlighting.
- Category filter pills for rapid genre exploration.

### 📋 Playlist & Queue Management
- **Custom Playlists**: Create, rename, delete, and manage custom user playlists.
- **Up-Next Queue**: View upcoming tracks, reorder queue, and remove items dynamically.

### ❤️ Favorites & Listening History
- **Favorites Collection**: One-click heart toggle to mark/unmark songs.
- **Listening History**: Automatically logs recently played tracks with local persistence.

### 📊 Listening Analytics & Insights
- Interactive charts detailing total listening duration, top played tracks, and favorite genres.

---

## 📂 Project Architecture

```
Music Player/
├── index.html          # Main landing dashboard
├── player.html         # Interactive full-screen music player view
├── style.css           # Global fallback stylesheet & CSS custom properties
├── script.js           # Core application entry point
├── css/
│   ├── style.css       # Design tokens & glassmorphic styles
│   └── animations.css  # Micro-animations & visual transitions
├── js/
│   ├── app.js          # Core app controller
│   ├── player.js       # HTML5 Audio playback manager & Web Audio fallback
│   ├── voice.js        # Voice recognition & command parser
│   ├── lyrics.js       # Synced lyrics engine & karaoke auto-scroll
│   ├── playlist.js     # Playlist management logic
│   ├── queue.js        # Track queue manager
│   ├── search.js       # Search & filter subsystem
│   ├── favorites.js    # Favorites storage & UI state
│   ├── history.js      # Recently played tracking
│   ├── analytics.js    # Listening statistics processor
│   ├── themes.js       # Dynamic theme swapper
│   ├── storage.js      # LocalStorage persistence wrapper
│   ├── data.js         # Music library track catalog & lyrics
│   ├── navigation.js   # SPA navigation controller
│   └── utils.js        # Helper functions & formatters
└── assets/
    └── images/         # Album art and visual assets
```

---

## 🎙️ Voice Commands Reference

| Command | Trigger Words | Action |
| :--- | :--- | :--- |
| **Play** | `"Play"`, `"Start"` | Resume audio playback |
| **Pause** | `"Pause"`, `"Stop"` | Pause current audio playback |
| **Next** | `"Next"`, `"Next song"` | Skip to next track in queue |
| **Previous** | `"Previous"`, `"Back"` | Return to previous track |
| **Mute** | `"Mute"`, `"Silence"` | Toggle audio mute state |
| **Unmute** | `"Unmute"` | Restore audio volume |
| **Volume Up** | `"Volume up"` | Increase playback volume by 10% |
| **Volume Down** | `"Volume down"` | Decrease playback volume by 10% |

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Toggle Play / Pause |
| <kbd>←</kbd> | Rewind 5 seconds |
| <kbd>→</kbd> | Fast forward 5 seconds |
| <kbd>↑</kbd> | Increase volume by 5% |
| <kbd>↓</kbd> | Decrease volume by 5% |
| <kbd>M</kbd> | Toggle Mute |
| <kbd>L</kbd> | Toggle Lyrics View |
| <kbd>F</kbd> | Toggle Favorite Status |
| <kbd>S</kbd> | Toggle Shuffle Mode |
| <kbd>R</kbd> | Toggle Repeat Mode |

---

## 💾 Local Storage Schema

User preferences and state are preserved in `window.localStorage`:

```json
{
  "codealpha_player_theme": "spotify",
  "codealpha_player_favorites": [1, 2, 4],
  "codealpha_player_playlists": [
    {
      "id": "pl-1774360000000",
      "title": "Chill Vibes",
      "description": "Lo-Fi & Ambient Tracks",
      "cover": "assets/images/cover3.png",
      "songs": [2, 3]
    }
  ],
  "codealpha_player_history": [
    { "songId": 1, "timestamp": 1774360000000 }
  ]
}
```

---

## 🌐 Live Demo & Quick Start

### Running Locally
1. **Clone the repository**:
   ```bash
   git clone https://github.com/poosarlasahithi/CodeAlpha_MusicPlayer.git
   cd CodeAlpha_MusicPlayer
   ```
2. **Launch Application**:
   - Open `index.html` in your browser to view the Landing Page.
   - Click **"Launch Music App"** or open `player.html` to launch the Interactive Music Player.
   - Alternatively, start a local HTTP server:
     ```bash
     npx http-server . -p 8080
     ```
     Then navigate to `http://localhost:8080/`.

---

## 👤 Author

Developed by **Sahithi Poosarla** for the **CodeAlpha Web Development Internship**.

- GitHub: [@poosarlasahithi](https://github.com/poosarlasahithi)
- Repository: [poosarlasahithi/CodeAlpha_MusicPlayer](https://github.com/poosarlasahithi/CodeAlpha_MusicPlayer.git)
