// =============================================================
//  commands.js — definizione dei comandi + copia negli appunti
// =============================================================

const hiddenCommands = ['bellaraga'];
// Comandi che richiedono argomenti: non li elenchiamo tra i link/chip cliccabili.
const argCommands = ['echo', 'cat'];

const commands = {
  help: () => {
    const available = Object.keys(commands)
      .filter(c => c !== 'clear' && c !== 'help'
        && !hiddenCommands.includes(c) && !argCommands.includes(c));
    return `<i class="fas fa-lightbulb"></i> Available commands:\n` +
      available.map(c => `- ${cmdLink(c)}`).join('\n') +
      `\n\nTips: <strong>Tab</strong> = autocomplete · <strong>↑/↓</strong> = history · try <strong>echo</strong> / <strong>cat &lt;file&gt;</strong>`;
  },
  about: () => data.about || '',
  skills: () => data.skills || '',
  projects: () => formatProjects(data.projects || []),
  experience: () => formatExperience(data.experience || []),
  education: () => formatEducation(data.education || []),
  certifications: () => formatCertifications(data.certifications || []),
  awards: () => formatAwards(data.awards || []),
  github: () => githubCommand(data.githubUsername),
  linkedin: () => ` <a href="${data.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="gh-link"><i class="fab fa-linkedin"></i> LinkedIn Profile</a>`,
  contact: () => {
    let out = `<i class="fas fa-envelope"></i> Email: `
      + `<a href="mailto:${data.email}" class="gh-link">${escapeHtml(data.email)}</a>`
      + ` <button type="button" class="copy-btn" data-copy="${escapeHtml(data.email)}" aria-label="Copy email to clipboard">copy</button>`;
    if (data.phone) {
      out += `<br><i class="fas fa-phone"></i> Phone: `
        + `<a href="tel:${escapeHtml(data.phone.replace(/\s/g, ''))}" class="gh-link">${escapeHtml(data.phone)}</a>`;
    }
    if (data.linkedinUrl && data.linkedinUrl !== '#') {
      out += `<br><i class="fab fa-linkedin"></i> `
        + `<a href="${data.linkedinUrl}" target="_blank" rel="noopener noreferrer" class="gh-link">LinkedIn</a>`;
    }
    if (data.website) {
      out += `<br><i class="fas fa-globe"></i> `
        + `<a href="${data.website}" target="_blank" rel="noopener noreferrer" class="gh-link">Website</a>`;
    }
    if (data.behance) {
      out += `<br><i class="fab fa-behance"></i> `
        + `<a href="${data.behance}" target="_blank" rel="noopener noreferrer" class="gh-link">Behance</a>`;
    }
    return out;
  },
  curriculum: () => {
    if (!data.cvUrl) return `<i class="fas fa-times-circle"></i> No CV configured (set cvUrl in content.js).`;
    return `<i class="fas fa-paperclip"></i> CV: `
      + `<a href="${data.cvUrl}" target="_blank" rel="noopener noreferrer" class="gh-link">open / download</a>`;
  },

  // --- comandi "filesystem" per il feel da terminale ---
  whoami: () => 'alessio',
  pwd: () => '/home/alessio',
  date: () => new Date().toString(),
  echo: (args) => escapeHtml((args || []).join(' ')),
  ls: () => [
    'about.txt', 'skills.txt', 'projects/', 'experience.log',
    'education.log', 'certifications.log', 'awards.log', 'contact.txt', 'cv.pdf'
  ].join('&nbsp;&nbsp;&nbsp;'),
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
