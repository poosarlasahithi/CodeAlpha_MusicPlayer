/* ================================================================
   Aurora Music Streaming Platform — Master Data Catalog (50+ Songs & Entities)
   ================================================================ */

'use strict';

const CATALOG_SONGS = [
  {
    id: 1,
    title: 'Neon Dreams',
    artist: 'Aurora Synth',
    album: 'Synthwave Journeys',
    year: 2024,
    genre: 'Synthwave',
    duration: '6:14',
    durationSec: 374,
    cover: 'assets/images/cover1.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    featured: true,
    trending: true,
    topChart: 1,
    lyrics: [
      { time: 0, text: "(Instrumental Synthwave Intro)" },
      { time: 15, text: "Neon lights flickering in the midnight rain" },
      { time: 28, text: "Driving down the highway, fading out the pain" },
      { time: 42, text: "Electric pulse running through my veins" },
      { time: 58, text: "We are the dreamers of the cyberpunk plain" },
      { time: 75, text: "Lost in the glow of a digital world" },
      { time: 90, text: "Watch the stories of the night unfold" },
      { time: 110, text: "Neon dreams, carry us home..." }
    ]
  },
  {
    id: 2,
    title: 'Golden Hour',
    artist: 'Sunset Waves',
    album: 'Ambient Horizons',
    year: 2023,
    genre: 'Chill',
    duration: '5:46',
    durationSec: 346,
    cover: 'assets/images/cover2.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    featured: true,
    trending: true,
    topChart: 2,
    lyrics: [
      { time: 0, text: "(Soft Piano Prelude)" },
      { time: 20, text: "Sun dipping low below the crimson mountain peak" },
      { time: 38, text: "Words of quiet warmth that we don't need to speak" },
      { time: 55, text: "Golden light casting shadows on the ground" },
      { time: 72, text: "Peace in the silence that we finally found" },
      { time: 95, text: "Hold onto the moment before the darkness falls" },
      { time: 120, text: "Golden hour shining bright..." }
    ]
  },
  {
    id: 3,
    title: 'Midnight Ocean',
    artist: 'Deep Blue',
    album: 'Underwater Echoes',
    year: 2024,
    genre: 'Lo-Fi',
    duration: '7:08',
    durationSec: 428,
    cover: 'assets/images/cover3.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    featured: true,
    trending: false,
    topChart: 3,
    lyrics: [
      { time: 0, text: "(Subtle Ocean Wave Ripples)" },
      { time: 30, text: "Diving into the abyss where moonlight shines" },
      { time: 60, text: "Bioluminescent currents forming glowing lines" },
      { time: 90, text: "Weightless in the water, floating with the tide" },
      { time: 120, text: "Secrets of the deep ocean where no shadows hide" }
    ]
  },
  {
    id: 4,
    title: 'Electric Pulse',
    artist: 'Circuit Breaker',
    album: 'Digital Frontiers',
    year: 2024,
    genre: 'EDM',
    duration: '5:30',
    durationSec: 330,
    cover: 'assets/images/cover4.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    featured: false,
    trending: true,
    topChart: 4,
    lyrics: [
      { time: 0, text: "3... 2... 1... Initiate sequence" },
      { time: 15, text: "Feel the bass dropping through the floor" },
      { time: 32, text: "High voltage sound, give us more" },
      { time: 48, text: "Electric pulse! Surge through the wire!" },
      { time: 65, text: "Light up the room with pure digital fire!" }
    ]
  },
  {
    id: 5,
    title: 'Velvet Skies',
    artist: 'Cosmic Drift',
    album: 'Nebula Dreams',
    year: 2023,
    genre: 'Lo-Fi',
    duration: '6:42',
    durationSec: 402,
    cover: 'assets/images/cover5.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    featured: true,
    trending: true,
    topChart: 5,
    lyrics: [
      { time: 0, text: "(Vinyl Crackle & Chill Beats)" },
      { time: 20, text: "Stargazing from the balcony late at night" },
      { time: 45, text: "Velvet purple sky sprinkled with starlight" },
      { time: 70, text: "Sipping warm tea while the world sleeps tight" }
    ]
  },
  {
    id: 6,
    title: 'Crystal Rain',
    artist: 'Glass Echoes',
    album: 'Urban Melancholy',
    year: 2022,
    genre: 'Coding',
    duration: '7:20',
    durationSec: 440,
    cover: 'assets/images/cover6.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    featured: false,
    trending: false,
    topChart: 6,
    lyrics: [
      { time: 0, text: "(Raindrops on window pane)" },
      { time: 25, text: "Raindrops sliding down the window pane" },
      { time: 50, text: "Soft jazz chords washing off the stain" }
    ]
  },
  {
    id: 7,
    title: 'Solar Flare',
    artist: 'Helios',
    album: 'Stellar Ignition',
    year: 2024,
    genre: 'Rock',
    duration: '5:58',
    durationSec: 358,
    cover: 'assets/images/cover7.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    featured: true,
    trending: true,
    topChart: 7,
    lyrics: [
      { time: 0, text: "(Heavy Guitar Riff Opening)" },
      { time: 20, text: "Blazing out from the solar core!" },
      { time: 38, text: "Hear the engines roar!" },
      { time: 55, text: "Solar Flare ignites the sky!" }
    ]
  },
  {
    id: 8,
    title: 'Arctic Wind',
    artist: 'Fjord',
    album: 'Frozen Horizons',
    year: 2023,
    genre: 'Classical',
    duration: '6:35',
    durationSec: 395,
    cover: 'assets/images/cover8.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    featured: false,
    trending: false,
    topChart: 8,
    lyrics: [
      { time: 0, text: "(Solo Cello & Strings)" },
      { time: 40, text: "Cold northern winds whisper over frozen peaks" }
    ]
  },
  {
    id: 9,
    title: 'Urban Echo',
    artist: 'Noir Collective',
    album: 'City Shadows',
    year: 2024,
    genre: 'Hip-Hop',
    duration: '5:15',
    durationSec: 315,
    cover: 'assets/images/cover9.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    featured: true,
    trending: true,
    topChart: 9,
    lyrics: [
      { time: 0, text: "(Boom Bap Beat Drop)" },
      { time: 15, text: "Walking down 5th avenue under streetlights" },
      { time: 30, text: "Echoes of the city rhythm through the nights" }
    ]
  },
  {
    id: 10,
    title: 'Dream Cascade',
    artist: 'Ethereal Flow',
    album: 'Lucid Visions',
    year: 2024,
    genre: 'Study',
    duration: '8:02',
    durationSec: 482,
    cover: 'assets/images/cover10.png',
    audio: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    featured: true,
    trending: true,
    topChart: 10,
    lyrics: [
      { time: 0, text: "(Ambient Harp Cascade)" },
      { time: 45, text: "Falling into a dream sequence softly..." }
    ]
  }
];

// Dynamically generate full 50 catalog songs across all target genres
(function generateFullCatalog() {
  const genres = ['Pop', 'Rock', 'Hip-Hop', 'EDM', 'Jazz', 'Classical', 'Lo-Fi', 'Workout', 'Study', 'Coding', 'Party', 'Romantic'];
  const artists = ['Aurora Synth', 'Sunset Waves', 'Deep Blue', 'Circuit Breaker', 'Cosmic Drift', 'Helios', 'Fjord', 'Noir Collective', 'Kavinsky Nova', 'Luna Eclipse', 'Cyber Echo', 'Velocity 9'];
  const albumPrefixes = ['Chronicles of', 'Echoes from', 'Return to', 'Symphony of', 'Tales of', 'Overdrive', 'Session Vol.', 'Uncharted'];

  const baseAudioUrls = [
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
    'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3'
  ];

  for (let i = 11; i <= 52; i++) {
    const artist = artists[(i - 1) % artists.length];
    const genre = genres[(i - 1) % genres.length];
    const album = `${albumPrefixes[i % albumPrefixes.length]} ${genre}`;
    const coverNum = ((i - 1) % 10) + 1;
    const minutes = Math.floor(Math.random() * 4) + 3;
    const seconds = Math.floor(Math.random() * 50) + 10;
    const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

    CATALOG_SONGS.push({
      id: i,
      title: `${genre} Anthem #${i}`,
      artist: artist,
      album: album,
      year: 2020 + (i % 5),
      genre: genre,
      duration: formattedDuration,
      durationSec: minutes * 60 + seconds,
      cover: `assets/images/cover${coverNum}.png`,
      audio: baseAudioUrls[(i - 1) % baseAudioUrls.length],
      featured: i % 4 === 0,
      trending: i % 3 === 0,
      topChart: i <= 20 ? i : null,
      lyrics: i % 5 === 0 ? [] : [
        { time: 0, text: `(Intro groove for Track #${i})` },
        { time: 15, text: `Feel the rhythm of ${genre} coming alive` },
        { time: 35, text: `Crafted by ${artist} in the analog lab` },
        { time: 60, text: `Harmonies swelling across the night sky...` }
      ]
    });
  }
})();

// ===== Artists Detailed Metadata =====
const ARTISTS_DATA = {
  'Aurora Synth': {
    name: 'Aurora Synth',
    photo: 'assets/images/cover1.png',
    bio: 'Pioneer of modern cyberpunk synthwave and neon electronic compositions with over 10M monthly listeners worldwide.',
    followers: '2,450,180',
    popularSongs: [1, 11, 23, 35],
    albums: ['Synthwave Journeys', 'Chronicles of Synthwave', 'Session Vol. Synthwave'],
    related: ['Kavinsky Nova', 'Circuit Breaker', 'Cyber Echo']
  },
  'Sunset Waves': {
    name: 'Sunset Waves',
    photo: 'assets/images/cover2.png',
    bio: 'Chill ambient electronic producer crafting golden hour melodies and sunset acoustic vibes.',
    followers: '1,820,400',
    popularSongs: [2, 14, 26, 38],
    albums: ['Ambient Horizons', 'Echoes from Chill'],
    related: ['Cosmic Drift', 'Ethereal Flow', 'Deep Blue']
  },
  'Deep Blue': {
    name: 'Deep Blue',
    photo: 'assets/images/cover3.png',
    bio: 'Oceanic ambient and lo-fi artist creating deep water soundscapes and underwater acoustic harmonies.',
    followers: '940,250',
    popularSongs: [3, 15, 27, 39],
    albums: ['Underwater Echoes', 'Tales of Lo-Fi'],
    related: ['Sunset Waves', 'Glass Echoes']
  },
  'Circuit Breaker': {
    name: 'Circuit Breaker',
    photo: 'assets/images/cover4.png',
    bio: 'High-energy EDM DJ and mainstage festival performer famous for heavy synth drops and explosive basslines.',
    followers: '3,110,800',
    popularSongs: [4, 16, 28, 40],
    albums: ['Digital Frontiers', 'Overdrive EDM'],
    related: ['Velocity 9', 'Cyber Echo']
  },
  'Cosmic Drift': {
    name: 'Cosmic Drift',
    photo: 'assets/images/cover5.png',
    bio: 'Lo-Fi chill hop producer specializing in vinyl crackle beats for late night study sessions.',
    followers: '1,490,000',
    popularSongs: [5, 17, 29, 41],
    albums: ['Nebula Dreams', 'Session Vol. Lo-Fi'],
    related: ['Glass Echoes', 'Sunset Waves']
  },
  'Helios': {
    name: 'Helios',
    photo: 'assets/images/cover7.png',
    bio: 'Alternative rock band with heavy guitar riffs, cosmic themes, and energetic stadium choruses.',
    followers: '2,050,300',
    popularSongs: [7, 19, 31, 43],
    albums: ['Stellar Ignition', 'Return to Rock'],
    related: ['Noir Collective', 'Rhythm Syndicate']
  }
};

// ===== Genres List =====
const GENRES_DATA = [
  { id: 'Synthwave', name: 'Synthwave', gradient: 'linear-gradient(135deg, #1DB954, #047857)', icon: 'fa-microchip' },
  { id: 'EDM', name: 'EDM & Dance', gradient: 'linear-gradient(135deg, #3B82F6, #1D4ED8)', icon: 'fa-bolt' },
  { id: 'Lo-Fi', name: 'Lo-Fi Beats', gradient: 'linear-gradient(135deg, #8B5CF6, #6D28D9)', icon: 'fa-coffee' },
  { id: 'Rock', name: 'Rock & Indie', gradient: 'linear-gradient(135deg, #F97316, #C2410C)', icon: 'fa-guitar' },
  { id: 'Jazz', name: 'Smooth Jazz', gradient: 'linear-gradient(135deg, #F59E0B, #B45309)', icon: 'fa-saxophone' },
  { id: 'Classical', name: 'Classical & Strings', gradient: 'linear-gradient(135deg, #64748B, #334155)', icon: 'fa-music' },
  { id: 'Hip-Hop', name: 'Hip-Hop & Rap', gradient: 'linear-gradient(135deg, #EC4899, #BE185D)', icon: 'fa-compact-disc' },
  { id: 'Pop', name: 'Top Pop Hits', gradient: 'linear-gradient(135deg, #10B981, #047857)', icon: 'fa-star' },
  { id: 'Workout', name: 'Workout Pump', gradient: 'linear-gradient(135deg, #EF4444, #991B1B)', icon: 'fa-dumbbell' },
  { id: 'Study', name: 'Study & Concentration', gradient: 'linear-gradient(135deg, #06B6D4, #0E7490)', icon: 'fa-book-open' },
  { id: 'Coding', name: 'Coding Flow', gradient: 'linear-gradient(135deg, #6366F1, #4338CA)', icon: 'fa-code' },
  { id: 'Party', name: 'Weekend Party', gradient: 'linear-gradient(135deg, #84CC16, #4D7C0F)', icon: 'fa-champagne-glasses' },
  { id: 'Romantic', name: 'Romantic Moods', gradient: 'linear-gradient(135deg, #F43F5E, #9F1239)', icon: 'fa-heart' }
];

// ===== Default Preset Playlists =====
const DEFAULT_PLAYLISTS = [
  {
    id: 'pl-workout',
    title: 'Workout Pump',
    description: 'High tempo, intense beats to keep your energy maxed out.',
    cover: 'assets/images/cover4.png',
    songs: [4, 7, 12, 16, 20, 24, 28]
  },
  {
    id: 'pl-coding',
    title: 'Coding & Focus',
    description: 'Deep focus instrumental tracks for high productivity coding sessions.',
    cover: 'assets/images/cover1.png',
    songs: [1, 5, 6, 11, 15, 22, 33]
  },
  {
    id: 'pl-lofi',
    title: 'Lo-Fi Chill Beats',
    description: 'Relaxing lo-fi hip hop and ambient beats for late night relaxation.',
    cover: 'assets/images/cover5.png',
    songs: [2, 5, 6, 10, 14, 18, 25]
  },
  {
    id: 'pl-party',
    title: 'Weekend Party Mix',
    description: 'Top EDM, Dance, and Pop bangers to turn up the volume.',
    cover: 'assets/images/cover7.png',
    songs: [1, 4, 7, 9, 13, 17, 21, 30]
  },
  {
    id: 'pl-roadtrip',
    title: 'Sunset Road Trip',
    description: 'Cinematic melodies and synthwave jams for open highway drives.',
    cover: 'assets/images/cover2.png',
    songs: [1, 2, 3, 5, 9, 12, 29]
  }
];

window.CATALOG_SONGS = CATALOG_SONGS;
window.ARTISTS_DATA = ARTISTS_DATA;
window.GENRES_DATA = GENRES_DATA;
window.DEFAULT_PLAYLISTS = DEFAULT_PLAYLISTS;
