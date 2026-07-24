/* ================================================================
   Aurora Music Streaming Platform — Web Speech API Voice Controller
   ================================================================ */

'use strict';

class VoiceController {
  constructor() {
    this.recognition = null;
    this.isListening = false;
    this.badgeEl = null;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';

      this.recognition.onresult = (e) => this.handleResult(e);
      this.recognition.onend = () => this.stop();
      this.recognition.onerror = (e) => {
        console.warn('[VoiceController] Speech recognition error:', e.error);
        this.stop();
      };
    }
  }

  toggle() {
    if (!this.recognition) {
      window.showToast('fa-solid fa-triangle-exclamation', 'Speech Recognition not supported in this browser');
      return;
    }
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  start() {
    try {
      this.recognition.start();
      this.isListening = true;
      this.showBadge();
      window.showToast('fa-solid fa-microphone', 'Listening for Voice Commands...');
    } catch (e) {
      this.stop();
    }
  }

  stop() {
    try {
      if (this.recognition && this.isListening) {
        this.recognition.stop();
      }
    } catch (e) { /* ignore */ }
    this.isListening = false;
    this.hideBadge();
  }

  showBadge() {
    if (!this.badgeEl) {
      this.badgeEl = document.createElement('div');
      this.badgeEl.className = 'voice-badge';
      this.badgeEl.innerHTML = `<i class="fa-solid fa-microphone-lines"></i> Listening for command...`;
      document.body.appendChild(this.badgeEl);
    }
    this.badgeEl.style.display = 'flex';
  }

  hideBadge() {
    if (this.badgeEl) this.badgeEl.style.display = 'none';
  }

  handleResult(e) {
    if (!e.results || !e.results[0] || !e.results[0][0]) return;
    const transcript = e.results[0][0].transcript.toLowerCase().trim();
    window.showToast('fa-solid fa-microphone', `Voice: "${transcript}"`);

    if (transcript.includes('play')) {
      window.playerEngine?.play();
    } else if (transcript.includes('pause') || transcript.includes('stop')) {
      window.playerEngine?.pause();
    } else if (transcript.includes('next')) {
      window.playerEngine?.next();
    } else if (transcript.includes('previous') || transcript.includes('back')) {
      window.playerEngine?.previous();
    } else if (transcript.includes('volume up')) {
      window.playerEngine?.adjustVolume(15);
    } else if (transcript.includes('volume down')) {
      window.playerEngine?.adjustVolume(-15);
    } else if (transcript.includes('mute')) {
      window.playerEngine?.toggleMute();
    } else if (transcript.includes('shuffle')) {
      window.playerEngine?.toggleShuffle();
    } else if (transcript.includes('repeat')) {
      window.playerEngine?.toggleRepeat();
    } else if (transcript.startsWith('search')) {
      const query = transcript.replace('search', '').trim();
      if (query && window.searchEngine) {
        const searchInput = document.getElementById('appSearchInput');
        if (searchInput) searchInput.value = query;
        window.searchEngine.performSearch(query);
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.voiceController = new VoiceController();
});
