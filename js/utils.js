/* ================================================================
   Aurora Music Streaming Platform — Shared Utilities & UI Helpers
   ================================================================ */

'use strict';

// ===== Toast Notification Utility =====
window.showToast = function(iconClass, text) {
  let toastEl = document.getElementById('globalToast');
  if (!toastEl) {
    toastEl = document.createElement('div');
    toastEl.id = 'globalToast';
    toastEl.className = 'toast';
    toastEl.innerHTML = `<i class="toast-icon" id="toastIcon"></i><span id="toastText"></span>`;
    document.body.appendChild(toastEl);
  }

  const icon = toastEl.querySelector('#toastIcon');
  const txt = toastEl.querySelector('#toastText');
  if (icon) icon.className = `toast-icon ${iconClass || 'fa-solid fa-info-circle'}`;
  if (txt) txt.textContent = text;

  toastEl.classList.add('visible');
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => {
    toastEl.classList.remove('visible');
  }, 2200);
};

// ===== Confetti Particle Burst Animation =====
window.triggerConfetti = function() {
  const colors = ['#1DB954', '#00D4FF', '#8B5CF6', '#F97316', '#EC4899', '#FACC15'];
  for (let i = 0; i < 35; i++) {
    const particle = document.createElement('div');
    particle.className = 'confetti-particle';
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    particle.style.left = `${Math.random() * 100}vw`;
    particle.style.top = `${Math.random() * 40 + 20}vh`;

    const dx = (Math.random() - 0.5) * 350;
    const dy = (Math.random() - 0.5) * 350 - 80;
    particle.style.setProperty('--dx', `${dx}px`);
    particle.style.setProperty('--dy', `${dy}px`);

    document.body.appendChild(particle);
    setTimeout(() => particle.remove(), 1200);
  }
};

// ===== Time Formatting Utilities =====
window.formatTime = function(seconds) {
  if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

window.formatTimestamp = function(timestampMs) {
  if (!timestampMs) return 'Recently';
  const now = Date.now();
  const diffSec = Math.floor((now - timestampMs) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} mins ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)} hours ago`;
  if (diffSec < 172800) return 'Yesterday';
  return `${Math.floor(diffSec / 86400)} days ago`;
};

// ===== Glassmorphic Modal Dialog System =====
window.showModal = function({ title, bodyHtml, confirmText = 'Save', cancelText = 'Cancel', onConfirm, onCancel }) {
  let modalOverlay = document.getElementById('globalModalOverlay');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'globalModalOverlay';
    modalOverlay.className = 'modal-overlay';
    modalOverlay.innerHTML = `
      <div class="modal-box">
        <div class="modal-header">
          <h3 id="modalTitle"></h3>
          <button class="modal-close-btn" id="modalCloseBtn">&times;</button>
        </div>
        <div class="modal-body" id="modalBody"></div>
        <div class="modal-footer">
          <button class="btn btn-ghost" id="modalCancelBtn">Cancel</button>
          <button class="btn btn-primary" id="modalConfirmBtn">Confirm</button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);
  }

  const titleEl = modalOverlay.querySelector('#modalTitle');
  const bodyEl = modalOverlay.querySelector('#modalBody');
  const confirmBtn = modalOverlay.querySelector('#modalConfirmBtn');
  const cancelBtn = modalOverlay.querySelector('#modalCancelBtn');
  const closeBtn = modalOverlay.querySelector('#modalCloseBtn');

  if (titleEl) titleEl.textContent = title || 'Notice';
  if (bodyEl) bodyEl.innerHTML = bodyHtml || '';
  if (confirmBtn) confirmBtn.textContent = confirmText;
  if (cancelBtn) cancelBtn.textContent = cancelText;

  modalOverlay.classList.add('active');

  const closeModal = () => {
    modalOverlay.classList.remove('active');
  };

  confirmBtn.onclick = () => {
    closeModal();
    if (typeof onConfirm === 'function') onConfirm(modalOverlay);
  };

  cancelBtn.onclick = closeBtn.onclick = () => {
    closeModal();
    if (typeof onCancel === 'function') onCancel();
  };

  modalOverlay.onclick = (e) => {
    if (e.target === modalOverlay) {
      closeModal();
      if (typeof onCancel === 'function') onCancel();
    }
  };
};

window.showPrompt = function(title, label, defaultValue, callback) {
  const bodyHtml = `
    <div style="margin-bottom:16px;">
      <label style="display:block; font-size:0.85rem; color:var(--text-secondary); margin-bottom:8px;">${label}</label>
      <input type="text" id="modalPromptInput" value="${defaultValue || ''}" style="width:100%; padding:10px 14px; border-radius:var(--radius-xs); background:var(--card); border:1px solid var(--card-border); color:var(--text); font-size:0.95rem;" autocomplete="off" />
    </div>
  `;

  window.showModal({
    title: title,
    bodyHtml: bodyHtml,
    confirmText: 'Submit',
    onConfirm: () => {
      const val = document.getElementById('modalPromptInput')?.value.trim();
      if (typeof callback === 'function') callback(val);
    }
  });

  setTimeout(() => {
    const input = document.getElementById('modalPromptInput');
    if (input) {
      input.focus();
      input.select();
    }
  }, 100);
};
