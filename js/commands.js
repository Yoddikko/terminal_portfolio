// =============================================================
//  commands.js — definizione dei comandi + copia negli appunti
// =============================================================

const hiddenCommands = ['bellaraga'];
// Comandi che richiedono argomenti: non li elenchiamo tra i link/chip cliccabili.
const argCommands = ['echo', 'cat', 'man'];

// "File" mostrati da `ls` e completati da Tab dopo `cat `.
const CAT_FILES = [
  'about.txt', 'skills.txt', 'projects/', 'experience.log', 'education.log',
  'certifications.log', 'awards.log', 'contact.txt', 'cv.pdf'
];

// Descrizioni per `help <comando>` / `man <comando>`.
const commandHelp = {
  about: 'Short intro: who I am, role, location and languages.',
  skills: 'Technical stack grouped by area, plus soft skills.',
  projects: 'Selected projects, with links and AI-usage tags.',
  experience: 'Work experience.',
  education: 'Academic background and programs.',
  certifications: 'Certifications and courses.',
  awards: 'Awards and recognitions.',
  github: 'Live GitHub stats: followers, total stars and top repos.',
  linkedin: 'Link to my LinkedIn profile.',
  contact: 'Email and social links.',
  curriculum: 'Open / download my CV.',
  whoami: 'Print my name, role and location.',
  ls: 'List the "files" you can open with cat.',
  cat: 'Print a file. Usage: cat <file> (e.g. cat about.txt).',
  pwd: 'Print the working directory.',
  date: 'Print the current date and time.',
  echo: 'Echo the given text. Usage: echo <text>.',
  clear: 'Clear the screen.',
  help: 'List commands, or "help <command>" for details.',
  man: 'Show the manual for a command. Usage: man <command>.'
};

function manFor(name) {
  if (!name) return 'usage: man &lt;command&gt;';
  if (hiddenCommands.includes(name) || !(name in commandHelp)) {
    return `<i aria-hidden="true" class="fas fa-times-circle"></i> No manual entry for ${escapeHtml(name)}`;
  }
  return `<span class="field-label">${escapeHtml(name)}</span> — ${escapeHtml(commandHelp[name])}`;
}

// --- Risoluzione CV: usa la versione più alta presente in assets/ ---
// Convenzione: assets/cv-<major>[.<minor>].pdf  (es. cv-2.pdf, cv-2.1.pdf, cv-3.0.pdf).
// Prova dalle versioni più alte alle più basse e usa la prima che esiste (in cache).
// content.js -> cvUrl (se valorizzato) forza un percorso e salta il probe.
const CV_MAX_MAJOR = 6;
const CV_MAX_MINOR = 9;
let _cvUrlCache; // undefined = non ancora risolto

function cvExists(url) {
  return fetch(url, { method: 'HEAD' }).then(r => r.ok).catch(() => false);
}

async function resolveCvUrl() {
  if (_cvUrlCache !== undefined) return _cvUrlCache;
  if (data.cvUrl) { _cvUrlCache = data.cvUrl; return _cvUrlCache; }
  for (let M = CV_MAX_MAJOR; M >= 1; M--) {
    for (let m = CV_MAX_MINOR; m >= 0; m--) {
      const u = `assets/cv-${M}.${m}.pdf`;
      if (await cvExists(u)) { _cvUrlCache = u; return u; }
    }
    const bare = `assets/cv-${M}.pdf`;
    if (await cvExists(bare)) { _cvUrlCache = bare; return bare; }
  }
  if (await cvExists('assets/cv.pdf')) { _cvUrlCache = 'assets/cv.pdf'; return _cvUrlCache; }
  _cvUrlCache = '';
  return _cvUrlCache;
}

const commands = {
  help: (args) => {
    const target = ((args && args[0]) || '').toLowerCase();
    if (target) return manFor(target);
    const available = Object.keys(commands)
      .filter(c => c !== 'clear' && c !== 'help'
        && !hiddenCommands.includes(c) && !argCommands.includes(c));
    return `<i aria-hidden="true" class="fas fa-lightbulb"></i> Available commands:\n` +
      available.map(c => `- ${cmdLink(c)}`).join('\n') +
      `\n\nTips: <strong>Tab</strong> = autocomplete · <strong>↑/↓</strong> = history · ` +
      `<strong>help &lt;cmd&gt;</strong> / <strong>man &lt;cmd&gt;</strong> for details · try <strong>cat &lt;file&gt;</strong>`;
  },
  man: (args) => manFor(((args && args[0]) || '').toLowerCase()),
  about: () => data.about || '',
  skills: () => data.skills || '',
  projects: () => formatProjects(data.projects || []),
  experience: () => formatExperience(data.experience || []),
  education: () => formatEducation(data.education || []),
  certifications: () => formatCertifications(data.certifications || []),
  awards: () => formatAwards(data.awards || []),
  github: () => githubCommand(data.githubUsername),
  linkedin: () => ` <a href="${escapeHtml(data.linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="gh-link"><i aria-hidden="true" class="fab fa-linkedin"></i> LinkedIn Profile</a>`,
  contact: () => {
    let out = `<i aria-hidden="true" class="fas fa-envelope"></i> Email: `
      + `<a href="mailto:${escapeHtml(data.email)}" class="gh-link">${escapeHtml(data.email)}</a>`
      + ` <button type="button" class="copy-btn" data-copy="${escapeHtml(data.email)}" aria-label="Copy email to clipboard">copy</button>`;
    if (data.linkedinUrl && data.linkedinUrl !== '#') {
      out += `<br><i aria-hidden="true" class="fab fa-linkedin"></i> `
        + `<a href="${escapeHtml(data.linkedinUrl)}" target="_blank" rel="noopener noreferrer" class="gh-link">LinkedIn</a>`;
    }
    if (data.behance) {
      out += `<br><i aria-hidden="true" class="fab fa-behance"></i> `
        + `<a href="${escapeHtml(data.behance)}" target="_blank" rel="noopener noreferrer" class="gh-link">Behance</a>`;
    }
    return out;
  },
  curriculum: async () => {
    const url = await resolveCvUrl();
    if (!url) return `<i aria-hidden="true" class="fas fa-times-circle"></i> CV not found — add it to assets as cv-&lt;major&gt;.&lt;minor&gt;.pdf (e.g. assets/cv-2.1.pdf).`;
    return `<i aria-hidden="true" class="fas fa-paperclip"></i> CV: `
      + `<a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="gh-link">open / download</a>`;
  },

  // --- comandi "filesystem" per il feel da terminale ---
  whoami: () => {
    const head = [data.name, data.title].filter(Boolean).join(' — ');
    const full = head + (data.location ? ` · ${data.location}` : '');
    return escapeHtml(full) || 'alessio';
  },
  pwd: () => '/home/alessio',
  date: () => new Date().toString(),
  echo: (args) => escapeHtml((args || []).join(' ')),
  ls: () => CAT_FILES.join('&nbsp;&nbsp;&nbsp;'),
  cat: (args) => {
    const map = {
      'about.txt': 'about',
      'skills.txt': 'skills',
      'experience.log': 'experience',
      'education.log': 'education',
      'certifications.log': 'certifications',
      'awards.log': 'awards',
      'contact.txt': 'contact',
      'cv.pdf': 'curriculum'
    };
    const target = (args && args[0]) || '';
    const cmd = map[target.toLowerCase()];
    if (cmd && typeof commands[cmd] === 'function') return commands[cmd]();
    return `cat: ${escapeHtml(target)}: No such file or directory`;
  },

  bellaraga: () => {
    return `<img src="assets/bellaraga.png" alt="bellaraga" style="width: 300px; max-width: 100%; image-rendering: pixelated;">`;
  }
};

// Copia testo negli appunti (con fallback per browser vecchi/file://).
function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  }
  return new Promise((resolve, reject) => {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, text.length);
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      if (ok) resolve();
      else reject(new Error('copy failed'));
    } catch (err) {
      reject(err);
    }
  });
}
