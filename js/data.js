// =============================================================
//  data.js — mapping di window.PORTFOLIO -> `data` + formatter
//  Tutto il contenuto proveniente da content.js viene "escapato"
//  al rendering (escapeHtml) per non rompere l'HTML con < & " ecc.
// =============================================================

const data = {};

// Legge window.PORTFOLIO (definito in content.js) e popola `data`, in modo
// difensivo: se un campo manca o è scritto male, il resto continua a funzionare.
function applyContent() {
  const P = window.PORTFOLIO || {};
  data.name = P.name || '';
  data.title = P.title || '';
  data.location = P.location || '';

  // about: paragrafo + meta (titolo, location, lingue, interessi)
  const aboutLines = [];
  if (P.about) aboutLines.push(`<i aria-hidden="true" class="fas fa-user"></i> ${escapeHtml(P.about)}`);
  const meta = [];
  if (P.title) meta.push(`<i aria-hidden="true" class="fas fa-briefcase"></i> ${escapeHtml(P.title)}`);
  if (P.location) meta.push(`<i aria-hidden="true" class="fas fa-location-dot"></i> ${escapeHtml(P.location)}`);
  if (Array.isArray(P.languages) && P.languages.length) {
    meta.push(`<i aria-hidden="true" class="fas fa-language"></i> ${escapeHtml(P.languages.join(', '))}`);
  }
  if (Array.isArray(P.interests) && P.interests.length) {
    meta.push(`<span class="muted">Interests: ${escapeHtml(P.interests.join(', '))}</span>`);
  }
  if (meta.length) aboutLines.push(meta.join('<br>'));
  data.about = aboutLines.join('<br><br>');

  // skills: tech stack per categorie + soft skills
  const skillLines = (Array.isArray(P.skills) ? P.skills : []).map(c => {
    const items = Array.isArray(c.items) ? c.items.join(', ') : '';
    return `<span class="field-label">${escapeHtml(c.category)}:</span> ${escapeHtml(items)}`;
  });
  if (Array.isArray(P.softSkills) && P.softSkills.length) {
    skillLines.push(`<span class="field-label">Soft skills:</span> ${escapeHtml(P.softSkills.join(', '))}`);
  }
  data.skills = skillLines.join('\n');

  // dati "grezzi": l'escaping avviene nei formatter, così `data` resta pulito
  data.projects = (Array.isArray(P.projects) ? P.projects : []).map(p => ({
    name: p.name || '',
    description: p.description || '',
    aiUsed: p.aiUsed === true,
    aiLevel: p.aiLevel || 'low',
    year: p.year || '',
    links: Array.isArray(p.links)
      ? p.links.filter(l => l && l.url)
      : (p.url ? [{ name: 'link', url: p.url }] : [])
  }));
  data.experience = (Array.isArray(P.experience) ? P.experience : []).map(e => ({
    role: e.role || '',
    company: e.company || '',
    period: e.period || '',
    description: e.details || e.description || ''
  }));
  data.education = (Array.isArray(P.education) ? P.education : []).map(e => ({
    degree: e.degree || '',
    institution: e.institution || '',
    year: e.year || '',
    details: e.details || ''
  }));
  data.certifications = (Array.isArray(P.certifications) ? P.certifications : []).map(c => ({
    title: c.title || '',
    url: c.url || ''
  }));
  data.awards = (Array.isArray(P.awards) ? P.awards : []).map(a => ({
    title: a.title || '',
    detail: a.detail || '',
    url: a.url || ''
  }));
  data.linkedinUrl = P.linkedin || '#';
  data.githubUsername = P.github || 'Yoddikko';
  data.email = P.email || '';
  data.behance = P.behance || '';
  data.cvUrl = P.cvUrl || '';
}

function formatExperience(experiences) {
  return experiences.map(exp => {
    return [
      `<span class="field-label">- Role:</span> <strong>${escapeHtml(exp.role)}</strong>`,
      `<span class="field-label">  Company:</span> ${escapeHtml(exp.company)}`,
      `<span class="field-label">  Period:</span> ${escapeHtml(exp.period)}`,
      `<span class="field-label">  Details:</span> ${escapeHtml(exp.description)}`
    ].join('<br>');
  }).join('<br><br>');
}

function formatEducation(edu) {
  return edu.map(e => {
    const head = e.degree && e.degree.trim()
      ? `- <strong>${escapeHtml(e.degree)}</strong>, ${escapeHtml(e.institution)} (${escapeHtml(e.year)})`
      : `- <strong>${escapeHtml(e.institution)}</strong> (${escapeHtml(e.year)})`;
    return e.details ? `${head}<br>  <span class="muted">${escapeHtml(e.details)}</span>` : head;
  }).join('<br><br>');
}

function projectLinks(links) {
  if (!links || !links.length) return '';
  return links
    .map(l => `[<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener noreferrer" class="gh-link">${escapeHtml(l.name)}</a>]`)
    .join(' ');
}

function formatProjects(projs) {
  return projs
    .map(p => {
      let aiIndicator = '';
      if (p.aiUsed) {
        const aiLabels = {
          none: '<span class="ai-tag ai-none">No AI</span>',
          low: '<span class="ai-tag ai-low">Low AI</span>',
          medium: '<span class="ai-tag ai-medium">Medium AI</span>',
          high: '<span class="ai-tag ai-high">High AI</span>',
          vibecoded: '<span class="ai-tag ai-vibecoded">Vibecoded</span>'
        };
        aiIndicator = ` ${aiLabels[p.aiLevel] || aiLabels.low}`;
      } else {
        aiIndicator = ' <span class="ai-tag ai-none">No AI</span>';
      }

      const yearTag = p.year ? ` <span class="project-year">[${escapeHtml(p.year)}]</span>` : '';
      const first = p.links && p.links.length ? escapeHtml(p.links[0].url) : '';
      const title = first
        ? `<a href="${first}" target="_blank" rel="noopener noreferrer" class="gh-link">${escapeHtml(p.name)}</a>`
        : `<strong>${escapeHtml(p.name)}</strong>`;
      const linksLine = p.links && p.links.length
        ? `<br>  ${projectLinks(p.links)}`
        : '';

      const desc = p.description ? `: ${escapeHtml(p.description)}` : '';
      return `- ${title}${yearTag}${desc}${aiIndicator}${linksLine}`;
    })
    .join('\n\n');
}

function formatCertifications(list) {
  return list.map(c => c.url
    ? `- <i aria-hidden="true" class="fas fa-certificate"></i> <a href="${escapeHtml(c.url)}" target="_blank" rel="noopener noreferrer" class="gh-link">${escapeHtml(c.title)}</a>`
    : `- <i aria-hidden="true" class="fas fa-certificate"></i> ${escapeHtml(c.title)}`
  ).join('\n');
}

function formatAwards(list) {
  return list.map(a => {
    const title = a.url
      ? `<a href="${escapeHtml(a.url)}" target="_blank" rel="noopener noreferrer" class="gh-link">${escapeHtml(a.title)}</a>`
      : `<strong>${escapeHtml(a.title)}</strong>`;
    return `<i aria-hidden="true" class="fas fa-trophy" style="color:gold;"></i> ${title}`
      + (a.detail ? `<br>  <span class="muted">${escapeHtml(a.detail)}</span>` : '');
  }).join('<br><br>');
}
