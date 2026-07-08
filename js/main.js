// =============================================================
//  main.js — WIRING: tutti i listener e l'inizializzazione.
//  Caricato PER ULTIMO: a questo punto ogni funzione/const dei
//  moduli precedenti è già definita (nessun problema di ordine/TDZ).
// =============================================================

// --- Focus: click ovunque = focus sul prompt (solo desktop), senza rubare
//     i click su link/chip/bottoni e senza rompere la selezione del testo. ---
document.addEventListener('click', e => {
  if (isTouch) return;
  if (e.target.closest('a') || e.target.closest('#cmdbar')
    || e.target.closest('[data-copy]') || e.target.closest('.titlebar')) return;
  if (window.getSelection && window.getSelection().toString()) return;
  input.focus();
});

// --- Bottone "copy" (email): delega sul document per sopravvivere ai re-render. ---
let copyResetTimer = null;
document.addEventListener('click', e => {
  const btn = e.target.closest('[data-copy]');
  if (!btn) return;
  e.preventDefault();
  copyText(btn.getAttribute('data-copy') || '')
    .then(() => {
      btn.textContent = 'copied!';
      btn.classList.add('copied');
    })
    .catch(() => {
      btn.textContent = 'press ⌘C';
    })
    .finally(() => {
      clearTimeout(copyResetTimer);
      copyResetTimer = setTimeout(() => {
        btn.textContent = 'copy';
        btn.classList.remove('copied');
      }, 1500);
    });
});

// --- Mouse glow: display:none su touch/reduced-motion, quindi lì non
//     registriamo nemmeno i listener. ---
if (!isTouch && !reduceMotion) {
  document.addEventListener('mousemove', updateMouseGlow);
  document.addEventListener('mouseleave', () => {
    document.body.style.setProperty('--mouse-opacity', '0');
  });
  document.addEventListener('mouseenter', () => {
    document.body.style.setProperty('--mouse-opacity', '1');
  });
}

// --- Cursore: aggiornamenti su input/caret ---
input.addEventListener('input', updateCursor);
input.addEventListener('keyup', () => setTimeout(updateCursor, 0));
input.addEventListener('click', updateCursor);

// Su mobile, quando l'input riceve il focus la tastiera copre l'area:
// riportiamo l'output in fondo dopo l'animazione della tastiera.
input.addEventListener('focus', () => {
  if (isTouch) setTimeout(scrollToBottom, 300);
});

// --- Tastiera: history (↑/↓), autocomplete (Tab), invio (Enter) ---
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    if (cmd) {
      if (history[history.length - 1] !== cmd) history.push(cmd);
      if (history.length > HISTORY_LIMIT) history.shift();
      saveHistory();
    }
    historyIndex = -1;
    runCommand(cmd);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (!history.length) return;
    if (historyIndex === -1) historyIndex = history.length;
    historyIndex = Math.max(0, historyIndex - 1);
    input.value = history[historyIndex] || '';
    setCaretEnd();
  } else if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (historyIndex === -1) return;
    historyIndex++;
    if (historyIndex >= history.length) {
      historyIndex = -1;
      input.value = '';
    } else {
      input.value = history[historyIndex];
    }
    setCaretEnd();
  } else if (e.key === 'Tab') {
    e.preventDefault();
    handleAutocomplete();
  }
});

// Posizione iniziale del cursore
updateCursor();

// --- Avvio ---
window.addEventListener('DOMContentLoaded', () => {
  initTheme();
  buildCmdBar();
  applyContent();
  showWelcomeMessage();
  keepFocus();
});

// Su mobile teniamo l'area del terminale ancorata alla viewport visibile,
// così l'input resta sopra la tastiera quando compare.
if (isTouch && window.visualViewport) {
  const vv = window.visualViewport;
  const applyViewportHeight = () => {
    const terminal = document.querySelector('.terminal');
    if (terminal) terminal.style.height = vv.height + 'px';
    scrollToBottom();
  };
  vv.addEventListener('resize', applyViewportHeight);
}

// Riadatta il banner ASCII e invalida le cache del cursore al resize.
window.addEventListener('resize', () => {
  _promptWidthCache = null;
  _inputFontCache = null;
  const pre = document.getElementById('ascii-art');
  if (pre) fitBanner(pre);
});

// --- Vista leggibile (CV) ---
const cvToggle = document.getElementById('cv-toggle');
if (cvToggle) cvToggle.addEventListener('click', openCv);
const cvBack = document.getElementById('cv-back');
if (cvBack) cvBack.addEventListener('click', closeCv);
const cvPrint = document.getElementById('cv-print');
if (cvPrint) cvPrint.addEventListener('click', () => window.print());
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.body.classList.contains('cv-open')) closeCv();
});

// Focus trap: con la vista CV aperta, Tab/Shift+Tab restano dentro il dialog
// (coerente con aria-modal). Il terminale è già fuori dal tab-order.
document.addEventListener('keydown', e => {
  if (e.key !== 'Tab' || !document.body.classList.contains('cv-open')) return;
  const view = document.getElementById('cv-view');
  if (!view) return;
  const f = Array.from(view.querySelectorAll('button, a[href]')).filter(el => el.offsetParent !== null);
  if (!f.length) return;
  const first = f[0], last = f[f.length - 1], active = document.activeElement;
  if (e.shiftKey && (active === first || !view.contains(active))) { last.focus(); e.preventDefault(); }
  else if (!e.shiftKey && (active === last || !view.contains(active))) { first.focus(); e.preventDefault(); }
});
