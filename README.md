# 🎵 CodeAlpha - Modern Interactive Music Player

A feature-rich, high-performance, web-based Music Player application built with Vanilla HTML5, CSS3 (Glassmorphic Design), and JavaScript (ES6 Modules). Developed for the CodeAlpha web development internship.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)

---

## 🌟 Key Features

- **🎧 Audio Playback Engine**: Smooth play/pause, volume control, track seeking, repeat, and shuffle modes.
- **🎤 Voice Command Recognition**: Hands-free music playback control powered by the Web Speech API.
- **📜 Synchronized Lyrics Display**: Dynamic real-time scrolling lyrics view for actively playing tracks.
- **🎨 Custom Theme Manager**: Dark mode, light mode, glassmorphism gradients, and customizable accent color schemes.
- **🔍 Smart Search & Filtering**: Instant search across song titles, artists, albums, and genres.
- **📋 Playlists & Queue Control**: Create custom playlists, reorder track queues, and save custom collections.
- **❤️ Favorites & Listening History**: Mark favorite tracks and access recently played history with local persistence.
- **📊 Listening Analytics**: Track top played songs, total playback duration, and listening statistics.
- **📱 Fully Responsive UI**: Flawless design tuned for desktops, tablets, and mobile devices.

---

## 📂 Project Architecture

```
Music Player/
├── index.html          # Main dashboard interface
├── player.html         # Interactive full-screen music player view
├── style.css           # Core stylesheet & UI themes
├── script.js           # Main application bootstrap script
├── css/
│   ├── style.css       # Design tokens & glassmorphic styles
│   └── animations.css  # Micro-animations & visual transitions
├── js/
│   ├── app.js          # Core app controller
│   ├── player.js       # HTML5 Audio playback manager
│   ├── voice.js        # Voice recognition & command parser
│   ├── lyrics.js       # Synced lyrics engine
│   ├── playlist.js     # Playlist management logic
│   ├── queue.js        # Track queue manager
│   ├── search.js       # Search & filter subsystem
│   ├── favorites.js    # Favorites storage & UI state
│   ├── history.js      # Recently played tracking
│   ├── analytics.js    # Listening statistics processor
│   ├── themes.js       # Dynamic theme swapper
│   ├── storage.js      # LocalStorage persistence wrapper
│   ├── data.js         # Music library track database
│   ├── navigation.js   # Navigation controller
│   └── utils.js        # Helper functions & formatters
└── assets/
    └── images/         # Album art and visual assets
```

---

## 🚀 Getting Started

### Prerequisites
No external build tools or framework installation required! Runs directly in any modern web browser.

### Installation & Running Locally
1. **Clone the repository**:
   ```bash
   git clone https://github.com/poosarlasahithi/CodeAlpha_MusicPlayer.git
   ```
2. **Open the application**:
   - Navigate into the project folder.
   - Open `index.html` or `player.html` directly in your web browser.

---

## 🎙️ Voice Commands

Control music playback using your microphone with commands like:
- `"Play"` / `"Pause"`
- `"Next track"` / `"Previous track"`
- `"Mute"` / `"Unmute"`
- `"Volume up"` / `"Volume down"`

---

## 🛠️ Built With

- **HTML5 & Semantic Elements**
- **Vanilla CSS3** (Flexbox, CSS Grid, Glassmorphism, Custom Properties)
- **Vanilla JavaScript (ES6+)**
- **Web Speech API** for voice interaction
- **HTML5 Audio API** for media playback handling
- **HTML5 LocalStorage API** for persistent user data

---

## 👤 Author

Developed by **Sahithi Poosarla** for **CodeAlpha**.

- GitHub: [@poosarlasahithi](https://github.com/poosarlasahithi)
