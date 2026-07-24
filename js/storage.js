/* ================================================================
   Aurora Music Streaming Platform — Storage Manager
   ================================================================ */

'use strict';

class StorageManager {
  constructor() {
    this.PREFIX = 'aurora_';
  }

  getItem(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`[StorageManager] Failed to get ${key}:`, e);
      return defaultValue;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(this.PREFIX + key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn(`[StorageManager] Failed to set ${key}:`, e);
      return false;
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(this.PREFIX + key);
      return true;
    } catch (e) {
      console.warn(`[StorageManager] Failed to remove ${key}:`, e);
      return false;
    }
  }

  clear() {
    try {
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith(this.PREFIX)) {
          localStorage.removeItem(k);
        }
      });
    } catch (e) {
      console.warn('[StorageManager] Failed to clear storage:', e);
    }
  }
}

window.storageManager = new StorageManager();
