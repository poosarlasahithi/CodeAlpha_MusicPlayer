# 🎵 CodeAlpha - Modern Interactive Music Player

A feature-rich, high-performance, web-based Music Player application built with Vanilla HTML5, CSS3 (Glassmorphic Design), and JavaScript (ES6 Modules). Developed as part of the **CodeAlpha** web development internship program.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Responsive](https://img.shields.io/badge/Design-Responsive-success.svg)

---

## 🌟 Comprehensive Features

### 🎧 Core Audio Engine
- **Full Playback Controls**: Play, pause, seek, jump forward/backward, adjust volume, mute/unmute.
- **Playback Modes**: Loop single track, repeat playlist, and shuffle queue.
- **Audio Progress Bar**: Interactive scrub bar with real-time timestamp display (`00:00 / 03:45`).
- **Smooth Track Transition**: Automatic queuing and playback of next track upon completion.

### 🎤 Hands-Free Voice Control
- Integrated **Web Speech API** for real-time speech recognition.
- Voice-driven commands for play, pause, next, previous, volume manipulation, and mute toggles.
- Visual microphone indicator with live listening status feedback.

### 📜 Synchronized Lyrics Subsystem
- Real-time lyrics parser supporting time-stamped text sync.
- Smooth scrolling lyrics view synchronized with audio current time.
- Click-to-seek functionality: Click on any lyric line to jump playback directly to that timestamp.

### 🎨 Glassmorphism & Custom Themes
- Modern UI with backdrop blur filters, smooth color gradients, and glowing accents.
- Dynamic theme selector: Dark Mode, Light Mode, Neon Synthwave, Cyberpunk, and Sunset Minimalist.
- Customizable accent color picker for personalized UI branding.

### 🔍 Search, Filter & Discovery
- Instant client-side search across track titles, artists, album names, and musical genres.
- Category filters to quickly narrow down pop, rock, electronic, lo-fi, and classical tracks.
- Instant auto-complete search query highlighting.

### 📋 Playlist & Queue Management
- **Custom Playlists**: Create, rename, delete, and manage custom user playlists.
- **Up-Next Queue**: View upcoming tracks, drag-and-drop reordering, and remove tracks from queue.
- **Quick-Add**: One-click addition of songs from search or library into active queues.

### ❤️ Favorites & Listening History
- **Favorites Collection**: Quick heart toggle on any track to add/remove from favorites.
- **Listening History**: Automatically logs recently played songs with timestamps.
- **Persistent Storage**: Retains all favorites, custom playlists, listening history, and user settings using `localStorage`.

### 📊 Listening Analytics & Insights
- Interactive charts detailing total listening time, top played tracks, and favorite genres.
- Daily/weekly playback statistics breakdown.

---

## 📂 Project Architecture & File Breakdown

```
Music Player/
├── index.html          # Main landing dashboard & library interface
├── player.html         # Interactive full-screen music player interface
├── style.css           # Global fallback stylesheet & CSS custom properties
├── script.js           # Core application entry point & initialization script
├── css/
│   ├── style.css       # Design system, glassmorphism tokens, & layout components
│   └── animations.css  # CSS keyframe animations, hover states, & pulse effects
├── js/
│   ├── app.js          # Main app orchestrator initializing sub-modules
│   ├── player.js       # HTML5 Audio API controller & playback state logic
│   ├── voice.js        # Web Speech API recognition listener & command parser
│   ├── lyrics.js       # Timestamp-synced lyrics parser & auto-scroll engine
│   ├── playlist.js     # Custom playlist creator, editor, & manager
│   ├── queue.js        # Up-next track queue state & reordering
│   ├── search.js       # Search indexing, query filter, & DOM renderer
│   ├── favorites.js    # Favorites collection management & UI state
│   ├── history.js      # Listening history logger & view renderer
│   ├── analytics.js    # Statistics processor & listening metrics engine
│   ├── themes.js       # Theme engine, CSS variables manipulator, & switcher
│   ├── storage.js      # LocalStorage helper wrapper for JSON serialization
│   ├── data.js         # Track database catalog (titles, artists, audio URLs, lyrics)
│   ├── navigation.js   # Single Page Application (SPA) view router
│   └── utils.js        # Formatting utilities (time formatters, sanitizers, debouncers)
└── assets/
    └── images/         # Album art covers & visual assets
```

---

## 🎙️ Supported Voice Commands

| Command Prompt | Action Executed |
| :--- | :--- |
| `"Play"` / `"Start"` | Resume audio playback |
| `"Pause"` / `"Stop"` | Pause current audio playback |
| `"Next"` / `"Next song"` | Skip to next track in queue |
| `"Previous"` / `"Back"` | Return to previous track |
| `"Mute"` / `"Silence"` | Toggle audio mute state |
| `"Unmute"` | Restore audio volume |
| `"Volume up"` | Increase playback volume by 10% |
| `"Volume down"` | Decrease playback volume by 10% |

---

## ⌨️ Keyboard Shortcuts

| Shortcut Key | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Toggle Play / Pause |
| <kbd>←</kbd> (Left Arrow) | Rewind 5 seconds |
| <kbd>→</kbd> (Right Arrow) | Fast forward 5 seconds |
| <kbd>↑</kbd> (Up Arrow) | Increase volume by 5% |
| <kbd>↓</kbd> (Down Arrow) | Decrease volume by 5% |
| <kbd>M</kbd> | Mute / Unmute audio |
| <kbd>L</kbd> | Toggle Lyrics drawer |
| <kbd>F</kbd> | Toggle Favorite status on current track |
| <kbd>S</kbd> | Toggle Shuffle mode |
| <kbd>R</kbd> | Toggle Repeat mode |

---

## 💾 Local Storage Schema

All user preferences and state persistence are stored safely in `window.localStorage` under key namespaces:

```json
{
  "codealpha_player_theme": "dark-glass",
  "codealpha_player_favorites": ["track_01", "track_04", "track_07"],
  "codealpha_player_playlists": [
    {
      "id": "pl_01",
      "name": "Chill Vibes",
      "tracks": ["track_02", "track_05"]
    }
  ],
  "codealpha_player_history": [
    { "trackId": "track_01", "timestamp": 1774360000000 }
  ],
  "codealpha_player_settings": {
    "volume": 0.8,
    "repeat": "all",
    "shuffle": false
  }
}
```

---

## 🌐 Browser Compatibility Matrix

| Browser | Audio Engine | Voice Controls | Local Storage | Glassmorphism |
| :--- | :---: | :---: | :---: | :---: |
| **Google Chrome** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |
| **Microsoft Edge** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |
| **Mozilla Firefox** | ✅ Supported | ⚠️ Polyfill required | ✅ Supported | ✅ Supported |
| **Apple Safari** | ✅ Supported | ⚠️ WebKit Speech | ✅ Supported | ✅ Supported |
| **Opera** | ✅ Supported | ✅ Supported | ✅ Supported | ✅ Supported |

---

## 🚀 Installation & Running Locally

### Step 1: Clone Repository
```bash
git clone https://github.com/poosarlasahithi/CodeAlpha_MusicPlayer.git
cd CodeAlpha_MusicPlayer
```

### Step 2: Launch Application
Because the application is built entirely using native Web standards (HTML5/CSS3/ES6 JS), no build tool or `npm install` is required!

Simply open `index.html` or `player.html` in your browser, or launch using VS Code Live Server:
```bash
# Optional: using http-server if installed globally
npx http-server . -p 8080
```

---

## 🛣️ Future Roadmap

- [ ] **Spotify / YouTube API Integration**: Fetch real-time streaming metadata and audio streams.
- [ ] **Custom Audio Equalizer (EQ)**: 10-band Web Audio API EQ preset visualizer (Bass Boost, Treble Boost, Vocal).
- [ ] **PWA Offline Support**: Progressive Web App manifest and Service Worker caching for offline music playback.
- [ ] **Social Sharing**: Share current active playlist via custom URL query params.

---

## 🛠️ Built With

- **HTML5**: Semantic web architecture (`<audio>`, `<canvas>`, `<section>`, `<nav>`).
- **CSS3**: CSS Grid, Flexbox, backdrop-filter glassmorphism, variable tokens, micro-interactions.
- **JavaScript (ES6+)**: Modular JS pattern (`async/await`, EventEmitters, SpeechRecognition).
- **Web APIs**: Web Speech API, HTML5 Audio API, LocalStorage API.

---

## 👤 Author & Acknowledgments

Developed with ❤️ by **Poosarla Sahithi** for the **CodeAlpha Frontend Development Internship**.

- GitHub: [@poosarlasahithi](https://github.com/poosarlasahithi)
- Project Repository: [CodeAlpha_MusicPlayer](https://github.com/poosarlasahithi/CodeAlpha_MusicPlayer)

---
*License: [MIT License](LICENSE)*
