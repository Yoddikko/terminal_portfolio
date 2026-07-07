// =============================================================
//  core.js — riferimenti DOM condivisi e utility di base
//  Caricato per primo (dopo content.js). Solo dichiarazioni.
// =============================================================

const output = document.getElementById('output');
const input = document.getElementById('input');
const cursor = document.querySelector('.cursor');
const srAnnounce = document.getElementById('sr-announce');

const PROMPT = 'welcome@portfolio:~$';

// Media queries usate in più punti
const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}

function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Annuncia agli screen reader SOLO il testo finale di una risposta (una volta),
// evitando il flood delle stringhe parziali generate dal typewriter/printResult.
function announce(html) {
  if (!srAnnounce) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = String(html);
  srAnnounce.textContent = tmp.textContent || '';
}

// Su dispositivi touch non forziamo il focus: eviterebbe di far comparire
// la tastiera a ogni tap (impedendo scroll/lettura/selezione). L'utente
// tocca esplicitamente l'input quando vuole scrivere.
function keepFocus() {
  if (isTouch) return;
  input.focus();
}

// Aggancia i listener ai link-comando (data-cmd) dentro un contenitore.
function attachCmdListeners(container = document) {
  container.querySelectorAll('a[data-cmd]').forEach(link => {
    if (link.dataset.bound) return;
    link.dataset.bound = '1';
    link.addEventListener('click', e => {
      e.preventDefault();
      runCommand(link.getAttribute('data-cmd'));
    });
  });
}

function cmdLink(cmd) {
  const icons = {
    github: '<i class="fab fa-github"></i>',
    linkedin: '<i class="fab fa-linkedin"></i>',
    about: '<i class="fas fa-user"></i>',
    projects: '<i class="fas fa-folder-open"></i>',
    skills: '<i class="fas fa-tools"></i>',
    experience: '<i class="fas fa-briefcase"></i>',
    education: '<i class="fas fa-graduation-cap"></i>',
    help: '<i class="fas fa-question-circle"></i>',
    curriculum: '<i class="fas fa-file"></i>',
    contact: '<i class="fas fa-envelope"></i>',
    certifications: '<i class="fas fa-certificate"></i>',
    awards: '<i class="fas fa-trophy"></i>',
    whoami: '<i class="fas fa-id-badge"></i>',
    ls: '<i class="fas fa-list"></i>',
    pwd: '<i class="fas fa-folder"></i>',
    date: '<i class="fas fa-clock"></i>'
  };
  const icon = icons[cmd] || '<i class="fas fa-terminal"></i>';
  return `<a href="#" data-cmd="${cmd}">${icon} ${cmd}</a>`;
}
