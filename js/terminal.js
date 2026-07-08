// =============================================================
//  terminal.js — rendering: cursore, glow, banner, output "stampa"
//  (solo dichiarazioni; i listener sono in main.js)
// =============================================================

// --- Mouse glow: le scritture del CSS var sono raggruppate con rAF ---
let pendingMouse = null;
let glowScheduled = false;

function flushMouseGlow() {
  glowScheduled = false;
  if (!pendingMouse) return;
  document.body.style.setProperty('--mouse-x', pendingMouse.x + 'px');
  document.body.style.setProperty('--mouse-y', pendingMouse.y + 'px');
}

function updateMouseGlow(e) {
  pendingMouse = { x: e.clientX, y: e.clientY };
  if (!glowScheduled) {
    glowScheduled = true;
    requestAnimationFrame(flushMouseGlow);
  }
}

// --- Cursore a blocco: segue il caret reale (anche a metà testo). ---
// Riusa una span di misura e memorizza font/larghezza-prompt (invalidati
// al resize da main.js) per evitare reflow costosi a ogni tasto.
let _measSpan = null;
let _promptWidthCache = null;
let _inputFontCache = null;

function updateCursor() {
  if (!_measSpan) {
    _measSpan = document.createElement('span');
    _measSpan.style.visibility = 'hidden';
    _measSpan.style.position = 'absolute';
    _measSpan.style.top = '-9999px';
    _measSpan.style.whiteSpace = 'pre';
    document.body.appendChild(_measSpan);
  }
  if (_inputFontCache == null) _inputFontCache = window.getComputedStyle(input).font;
  _measSpan.style.font = _inputFontCache;

  const caret = input.selectionStart == null ? input.value.length : input.selectionStart;
  _measSpan.textContent = input.value.slice(0, caret);

  if (_promptWidthCache == null) {
    const p = document.querySelector('.input-line .prompt');
    _promptWidthCache = p ? p.offsetWidth : 0;
  }
  const gapWidth = 8; // 0.5rem gap
  cursor.style.left = (_promptWidthCache + gapWidth + _measSpan.offsetWidth) + 'px';
}

function echoPrompt(command) {
  const line = document.createElement('div');
  line.classList.add('line');
  line.innerHTML = `<span class="prompt">${PROMPT}</span> ${escapeHtml(command)}`;
  output.appendChild(line);
}

// Rivela una risposta HTML riga per riga, per un effetto "stampa" da terminale.
async function printResult(container, html) {
  const lines = html.split('<br>');
  if (reduceMotion || lines.length <= 1) {
    container.innerHTML = html;
    attachCmdListeners(container);
    scrollToBottom();
    return;
  }
  for (let i = 0; i < lines.length; i++) {
    container.innerHTML = lines.slice(0, i + 1).join('<br>');
    attachCmdListeners(container);
    scrollToBottom();
    await wait(35);
  }
}

// Digita una riga di solo testo carattere per carattere.
async function typeLine(div, text) {
  for (let i = 0; i <= text.length; i++) {
    div.textContent = text.slice(0, i);
    scrollToBottom();
    await wait(12);
  }
}

// --- Quick command bar (chips) ---
function buildCmdBar() {
  const bar = document.getElementById('cmdbar');
  if (!bar) return;
  const primary = [
    'about', 'projects', 'experience', 'skills', 'certifications', 'github', 'contact', 'help'
  ];
  bar.innerHTML = '';
  primary.forEach(c => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cmd-chip';
    btn.textContent = c;
    btn.addEventListener('click', () => runCommand(c));
    bar.appendChild(btn);
  });
}

// --- Welcome message e ASCII art ---
const asciiArtName = `  ___    ___  ________   ________   ________   ___   ___  __     ___  __     ________
 |\\  \\  /  /||\\   __  \\ |\\   ___ \\ |\\   ___ \\ |\\  \\ |\\  \\|\\  \\  |\\  \\|\\  \\  |\\   __  \\
 \\ \\  \\/  / /\\ \\  \\|\\  \\\\ \\  \\_|\\ \\\\ \\  \\_|\\ \\\\ \\  \\\\ \\  \\/  /|_\\ \\  \\/  /|_\\ \\  \\|\\  \\
  \\ \\    / /  \\ \\  \\\\\\  \\\\ \\  \\ \\\\ \\\\ \\  \\ \\\\ \\\\ \\  \\\\ \\   ___  \\\\ \\   ___  \\\\ \\  \\\\\\  \\
   \\/  /  /    \\ \\  \\\\\\  \\\\ \\  \\_\\\\ \\\\ \\  \\_\\\\ \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\\\  \\
 __/  / /       \\ \\_______\\\\ \\_______\\\\ \\_______\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\_______\\
|\\___/ /         \\|_______| \\|_______| \\|_______| \\|__| \\|__| \\|__| \\|__| \\|__| \\|_______|  v1.0.0
\\|___|/

`;

// Banner compatto e leggibile per schermi stretti (l'ASCII grande diventa
// illeggibile sotto i ~600px).
const asciiArtCompact = `╔══════════════════════════╗
║   Yoddikko · portfolio   ║
╚══════════════════════════╝   v1.0.0`;

// Scala il font dell'ASCII banner così che entri SEMPRE nella larghezza
// disponibile, senza scroll orizzontale (misura a 16px e riduce se serve).
function fitBanner(pre) {
  const container = pre.parentElement || document.body;
  const avail = container.clientWidth - 8;
  if (avail <= 0) return;
  pre.style.fontSize = '16px';
  const w = pre.scrollWidth;
  if (w > avail) {
    const size = Math.max(4, Math.floor((16 * avail) / w));
    pre.style.fontSize = size + 'px';
  }
}

async function showWelcomeMessage() {
  if (document.getElementById('ascii-art')) return;

  const pre = document.createElement('pre');
  pre.id = 'ascii-art';
  pre.setAttribute('role', 'img');
  pre.setAttribute('aria-label', 'Yoddikko — terminal portfolio');
  if (window.innerWidth < 700) {
    pre.textContent = asciiArtCompact;
    pre.classList.add('banner-compact');
  } else {
    pre.textContent = asciiArtName;
  }
  output.appendChild(pre);
  fitBanner(pre);

  const lines = [
    '<i aria-hidden="true" class="fas fa-hand-peace"></i> Welcome to my terminal-style portfolio!',
    `Try these commands: ${cmdLink('about')}, ${cmdLink('projects')}, ${cmdLink('github')}, ${cmdLink('help')}`,
    isTouch
      ? 'Tip: tap a command below, or tap here to type.'
      : 'Tip: use Tab to autocomplete and ↑/↓ for history.',
    ''
  ];

  for (const line of lines) {
    const div = document.createElement('div');
    output.appendChild(div);
    const hasHtml = /<[a-z!/]/i.test(line);
    if (reduceMotion || hasHtml || !line) {
      div.innerHTML = line;
    } else {
      await typeLine(div, line); // solo le righe di testo semplice vengono "digitate"
    }
    attachCmdListeners(div);
    scrollToBottom();
  }
}
