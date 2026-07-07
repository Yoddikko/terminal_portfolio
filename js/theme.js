// =============================================================
//  theme.js — tema verde / ambra, persistito in localStorage
// =============================================================

const THEME_KEY = 'portfolio.theme';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme === 'amber' ? 'amber' : 'green');
}

function initTheme() {
  let saved = 'green';
  try { saved = localStorage.getItem(THEME_KEY) || 'green'; } catch (e) {}
  applyTheme(saved);
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'amber' ? 'amber' : 'green';
    const next = cur === 'amber' ? 'green' : 'amber';
    applyTheme(next);
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
  });
}
