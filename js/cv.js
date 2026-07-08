// =============================================================
//  cv.js — vista "leggibile" (CV) del portfolio.
//  Stessa fonte dati (window.PORTFOLIO): rende tutto in un
//  documento chiaro e stampabile, per chi non ama il terminale.
//  Tutto il contenuto autore è escapato (escapeHtml da core.js).
// =============================================================

function cvContactHtml(P) {
  const items = [];
  if (P.email) items.push(`<a href="mailto:${escapeHtml(P.email)}">${escapeHtml(P.email)}</a>`);
  if (P.phone) items.push(`<a href="tel:${escapeHtml(String(P.phone).replace(/\s/g, ''))}">${escapeHtml(P.phone)}</a>`);
  if (P.linkedin) items.push(`<a href="${escapeHtml(P.linkedin)}" target="_blank" rel="noopener noreferrer">LinkedIn</a>`);
  if (P.github) items.push(`<a href="https://github.com/${escapeHtml(P.github)}" target="_blank" rel="noopener noreferrer">GitHub</a>`);
  if (P.behance) items.push(`<a href="${escapeHtml(P.behance)}" target="_blank" rel="noopener noreferrer">Behance</a>`);
  return items.join('<span class="cv-sep">·</span>');
}

function cvAiTag(p) {
  if (!p || !p.aiUsed) return '<span class="cv-tag">No AI</span>';
  const label = { none: 'No AI', low: 'Low AI', medium: 'Medium AI', high: 'High AI', vibecoded: 'Vibecoded' }[p.aiLevel] || 'AI';
  return `<span class="cv-tag">${escapeHtml(label)}</span>`;
}

function buildCvView() {
  const el = document.getElementById('cv-content');
  if (!el) return;
  const P = window.PORTFOLIO || {};
  let h = '';

  // Header
  h += '<header class="cv-header">';
  if (P.name) h += `<h1>${escapeHtml(P.name)}</h1>`;
  if (P.title) h += `<p class="cv-role">${escapeHtml(P.title)}</p>`;
  if (P.location) h += `<p class="cv-sub">${escapeHtml(P.location)}</p>`;
  const contact = cvContactHtml(P);
  if (contact) h += `<p class="cv-contact">${contact}</p>`;
  h += '</header>';

  if (P.about) h += `<section class="cv-section"><h2>About</h2><p>${escapeHtml(P.about)}</p></section>`;

  // Skills + languages
  const skills = Array.isArray(P.skills) ? P.skills : [];
  const soft = Array.isArray(P.softSkills) ? P.softSkills : [];
  const langs = Array.isArray(P.languages) ? P.languages : [];
  if (skills.length || soft.length || langs.length) {
    h += '<section class="cv-section"><h2>Skills</h2>';
    skills.forEach(c => {
      const items = Array.isArray(c.items) ? c.items.map(escapeHtml).join(', ') : '';
      h += `<p class="cv-skill"><strong>${escapeHtml(c.category)}:</strong> ${items}</p>`;
    });
    if (soft.length) h += `<p class="cv-skill"><strong>Soft skills:</strong> ${soft.map(escapeHtml).join(', ')}</p>`;
    if (langs.length) h += `<p class="cv-skill"><strong>Languages:</strong> ${langs.map(escapeHtml).join(', ')}</p>`;
    h += '</section>';
  }

  // Experience
  const exp = Array.isArray(P.experience) ? P.experience : [];
  if (exp.length) {
    h += '<section class="cv-section"><h2>Experience</h2>';
    exp.forEach(e => {
      const title = escapeHtml(e.role || '') + (e.company ? ` — ${escapeHtml(e.company)}` : '');
      h += '<div class="cv-entry"><div class="cv-entry-head">'
        + `<span class="cv-entry-title">${title}</span>`
        + (e.period ? `<span class="cv-date">${escapeHtml(e.period)}</span>` : '')
        + '</div>';
      const d = e.details || e.description;
      if (d) h += `<p>${escapeHtml(d)}</p>`;
      h += '</div>';
    });
    h += '</section>';
  }

  // Education
  const edu = Array.isArray(P.education) ? P.education : [];
  if (edu.length) {
    h += '<section class="cv-section"><h2>Education</h2>';
    edu.forEach(e => {
      const title = e.degree
        ? `${escapeHtml(e.degree)} — ${escapeHtml(e.institution || '')}`
        : escapeHtml(e.institution || '');
      h += '<div class="cv-entry"><div class="cv-entry-head">'
        + `<span class="cv-entry-title">${title}</span>`
        + (e.year ? `<span class="cv-date">${escapeHtml(e.year)}</span>` : '')
        + '</div>';
      if (e.details) h += `<p>${escapeHtml(e.details)}</p>`;
      h += '</div>';
    });
    h += '</section>';
  }

  // Projects
  const proj = Array.isArray(P.projects) ? P.projects : [];
  if (proj.length) {
    h += '<section class="cv-section"><h2>Projects</h2>';
    proj.forEach(p => {
      const links = (Array.isArray(p.links) ? p.links.filter(l => l && l.url) : [])
        .map(l => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.name)}</a>`)
        .join('<span class="cv-sep">·</span>');
      h += '<div class="cv-entry"><div class="cv-entry-head"><span class="cv-entry-title">'
        + `${escapeHtml(p.name || '')}`
        + (p.year ? ` <span class="cv-year">(${escapeHtml(p.year)})</span>` : '')
        + ` ${cvAiTag(p)}</span></div>`;
      if (p.description) h += `<p>${escapeHtml(p.description)}</p>`;
      if (links) h += `<p class="cv-links">${links}</p>`;
      h += '</div>';
    });
    h += '</section>';
  }

  // Certifications
  const certs = Array.isArray(P.certifications) ? P.certifications : [];
  if (certs.length) {
    h += '<section class="cv-section"><h2>Certifications</h2><ul class="cv-list">';
    certs.forEach(c => {
      h += '<li>' + (c.url
        ? `<a href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.title)}</a>`
        : escapeHtml(c.title)) + '</li>';
    });
    h += '</ul></section>';
  }

  // Awards
  const awards = Array.isArray(P.awards) ? P.awards : [];
  if (awards.length) {
    h += '<section class="cv-section"><h2>Awards</h2><ul class="cv-list">';
    awards.forEach(a => {
      const t = a.url
        ? `<a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(a.title)}</a>`
        : escapeHtml(a.title);
      h += '<li>' + t + (a.detail ? ` — ${escapeHtml(a.detail)}` : '') + '</li>';
    });
    h += '</ul></section>';
  }

  el.innerHTML = h;
}

function openCv() {
  buildCvView();
  const view = document.getElementById('cv-view');
  if (!view) return;
  view.hidden = false;
  document.body.classList.add('cv-open');
  view.scrollTop = 0;
  const back = document.getElementById('cv-back');
  if (back) back.focus();
}

function closeCv() {
  const view = document.getElementById('cv-view');
  if (view) view.hidden = true;
  document.body.classList.remove('cv-open');
  // Riporta il focus al pulsante che ha aperto la vista (pattern ARIA dialog).
  const trigger = document.getElementById('cv-toggle');
  if (trigger) trigger.focus();
  else if (typeof keepFocus === 'function') keepFocus();
}
