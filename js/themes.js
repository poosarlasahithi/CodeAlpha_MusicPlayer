/* ================================================================
   Aurora Music Streaming Platform — Dynamic Theme Engine (6 Themes)
   ================================================================ */

'use strict';

const THEMES = {
  spotify: {
    name: 'Spotify Green',
    bg: '#0D1117',
    bgElevated: '#161B22',
    cardBg: 'rgba(255, 255, 255, 0.06)',
    cardHover: 'rgba(255, 255, 255, 0.10)',
    cardBorder: 'rgba(255, 255, 255, 0.08)',
    accent: '#1DB954',
    accentDim: 'rgba(29, 185, 84, 0.25)',
    accentSecondary: '#00D4FF',
    textPrimary: '#FFFFFF',
    textSecondary: '#8B949E',
    textMuted: '#484F58',
    isDark: true
  },
  midnight: {
    name: 'Ocean Blue',
    bg: '#0A0F1D',
    bgElevated: '#111A2E',
    cardBg: 'rgba(59, 130, 246, 0.08)',
    cardHover: 'rgba(59, 130, 246, 0.15)',
    cardBorder: 'rgba(59, 130, 246, 0.15)',
    accent: '#3B82F6',
    accentDim: 'rgba(59, 130, 246, 0.25)',
    accentSecondary: '#60A5FA',
    textPrimary: '#F0F6FF',
    textSecondary: '#93C5FD',
    textMuted: '#475569',
    isDark: true
  },
  galaxy: {
    name: 'Galaxy Purple',
    bg: '#0F0919',
    bgElevated: '#1B112B',
    cardBg: 'rgba(139, 92, 246, 0.08)',
    cardHover: 'rgba(139, 92, 246, 0.15)',
    cardBorder: 'rgba(139, 92, 246, 0.15)',
    accent: '#8B5CF6',
    accentDim: 'rgba(139, 92, 246, 0.25)',
    accentSecondary: '#EC4899',
    textPrimary: '#FAF5FF',
    textSecondary: '#C4B5FD',
    textMuted: '#581C87',
    isDark: true
  },
  cyan: {
    name: 'Ocean Cyan',
    bg: '#06131A',
    bgElevated: '#0C212C',
    cardBg: 'rgba(6, 182, 212, 0.08)',
    cardHover: 'rgba(6, 182, 212, 0.15)',
    cardBorder: 'rgba(6, 182, 212, 0.15)',
    accent: '#06B6D4',
    accentDim: 'rgba(6, 182, 212, 0.25)',
    accentSecondary: '#10B981',
    textPrimary: '#ECFEFF',
    textSecondary: '#67E8F9',
    textMuted: '#155E75',
    isDark: true
  },
  sunset: {
    name: 'Sunset Orange',
    bg: '#180B07',
    bgElevated: '#28130B',
    cardBg: 'rgba(249, 115, 22, 0.08)',
    cardHover: 'rgba(249, 115, 22, 0.15)',
    cardBorder: 'rgba(249, 115, 22, 0.15)',
    accent: '#F97316',
    accentDim: 'rgba(249, 115, 22, 0.25)',
    accentSecondary: '#FACC15',
    textPrimary: '#FFF7ED',
    textSecondary: '#FDBA74',
    textMuted: '#7C2D12',
    isDark: true
  },
  black: {
    name: 'Midnight Black',
    bg: '#000000',
    bgElevated: '#121212',
    cardBg: 'rgba(255, 255, 255, 0.04)',
    cardHover: 'rgba(255, 255, 255, 0.08)',
    cardBorder: 'rgba(255, 255, 255, 0.06)',
    accent: '#1DB954',
    accentDim: 'rgba(29, 185, 84, 0.2)',
    accentSecondary: '#38BDF8',
    textPrimary: '#FFFFFF',
    textSecondary: '#A1A1AA',
    textMuted: '#52525B',
    isDark: true
  },
  light: {
    name: 'Light Mode',
    bg: '#F8FAFC',
    bgElevated: '#FFFFFF',
    cardBg: 'rgba(0, 0, 0, 0.04)',
    cardHover: 'rgba(0, 0, 0, 0.08)',
    cardBorder: 'rgba(0, 0, 0, 0.08)',
    accent: '#1DB954',
    accentDim: 'rgba(29, 185, 84, 0.15)',
    accentSecondary: '#0284C7',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    textMuted: '#94A3B8',
    isDark: false
  }
};

class ThemeEngine {
  constructor() {
    this.currentTheme = window.storageManager?.getItem('theme', 'spotify') || 'spotify';
    this.applyTheme(this.currentTheme);
  }

  applyTheme(themeKey) {
    if (!THEMES[themeKey]) themeKey = 'spotify';
    this.currentTheme = themeKey;
    const t = THEMES[themeKey];

    const root = document.documentElement;
    root.style.setProperty('--bg', t.bg);
    root.style.setProperty('--bg-elevated', t.bgElevated);
    root.style.setProperty('--card', t.cardBg);
    root.style.setProperty('--card-hover', t.cardHover);
    root.style.setProperty('--card-border', t.cardBorder);
    root.style.setProperty('--accent', t.accent);
    root.style.setProperty('--accent-dim', t.accentDim);
    root.style.setProperty('--accent2', t.accentSecondary);
    root.style.setProperty('--text', t.textPrimary);
    root.style.setProperty('--text-secondary', t.textSecondary);
    root.style.setProperty('--text-muted', t.textMuted);

    if (t.isDark) {
      document.body.classList.remove('light-theme');
    } else {
      document.body.classList.add('light-theme');
    }

    window.storageManager?.setItem('theme', themeKey);
    window.showToast('fa-solid fa-palette', `Theme: ${t.name}`);

    // Broadcast theme change event
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: themeKey }));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.ThemeEngine = new ThemeEngine();
  window.THEMES = THEMES;
});
