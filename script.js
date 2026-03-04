// -----------------------------
// DOM Elements
// -----------------------------
const output = document.getElementById('output');
const input = document.getElementById('input');
const cursor = document.querySelector('.cursor');

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function keepFocus() {
  input.focus();
}
window.addEventListener('click', keepFocus);

// Mouse glow effect
let mouseGlow = null;

function createMouseGlow() {
  mouseGlow = document.body.querySelector('::after');
}

function updateMouseGlow(e) {
  if (document.body.style.setProperty) {
    document.body.style.setProperty('--mouse-x', e.clientX + 'px');
    document.body.style.setProperty('--mouse-y', e.clientY + 'px');
  }
}

// Track mouse movement for glow effect
document.addEventListener('mousemove', updateMouseGlow);

// Hide glow when mouse leaves window
document.addEventListener('mouseleave', () => {
  if (document.body.style.setProperty) {
    document.body.style.setProperty('--mouse-opacity', '0');
  }
});

// Show glow when mouse enters window
document.addEventListener('mouseenter', () => {
  if (document.body.style.setProperty) {
    document.body.style.setProperty('--mouse-opacity', '1');
  }
});

// Update cursor position
function updateCursor() {
  const span = document.createElement('span');
  span.style.visibility = 'hidden';
  span.style.position = 'absolute';
  span.style.font = window.getComputedStyle(input).font;
  span.textContent = input.value || '';
  document.body.appendChild(span);
  
  const promptWidth = document.querySelector('.input-line .prompt').offsetWidth;
  const gapWidth = 8; // 0.5rem gap
  const textWidth = span.offsetWidth;
  
  document.body.removeChild(span);
  
  cursor.style.left = (promptWidth + gapWidth + textWidth) + 'px';
}

input.addEventListener('input', updateCursor);
input.addEventListener('keydown', () => setTimeout(updateCursor, 0));
input.addEventListener('keyup', () => setTimeout(updateCursor, 0));
input.addEventListener('click', updateCursor);

// Initialize cursor position
updateCursor();

// -----------------------------
// Utility helpers
// -----------------------------
function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Attach click listeners to command links inside a container
function attachCmdListeners(container = document) {
  container.querySelectorAll('a[data-cmd]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      runCommand(link.getAttribute('data-cmd'));
    });
  });
}

function triggerDownload(url, filename) {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
    contact: '<i class="fas fa-envelope"></i>'
  };
  const icon = icons[cmd] || '<i class="fas fa-terminal"></i>';
  return `<a href="#" data-cmd="${cmd}">${icon} ${cmd}</a>`;
}

// -----------------------------
// Portfolio data formatting
// -----------------------------
const DB_BASE_URL =
  'https://raw.githubusercontent.com/Yoddikko/portfolio_database/main/';
const DATA_URL = `${DB_BASE_URL}Portfolio.json`;
const CV_URL = `${DB_BASE_URL}CV.pdf`;

const data = {};

function mapSkillBullet(bullet) {
  const mappings = {
    '⚡': 'bolt',
    '🤖': 'robot',
    '🛸': 'rocket'
  };
  const iconKey = Object.keys(mappings).find(e => bullet.trim().startsWith(e));
  const icon = iconKey
    ? `<i class="fas fa-${mappings[iconKey]}"></i>`
    : '<i class="fas fa-check"></i>';
  return `${icon} ${bullet.replace(iconKey, '').trim()}`;
}

function transformPortfolio(json) {
  const skillsText = (json.skillsSection.skills || [])
    .map(mapSkillBullet)
    .join('\n');

  const projects = (json.bigProjects.projects || []).map(p => ({
    name: p.projectName,
    description: p.projectDesc,
    url: p.footerLink && p.footerLink[0] ? p.footerLink[0].url : '#',
    aiUsed: p.aiUsed !== undefined ? p.aiUsed : false,
    aiLevel: p.aiLevel || 'low',
    year: p.year || '2024'
  }));

  const experience = (json.workExperiences.experience || []).map(e => ({
    role: e.role,
    company: e.company,
    period: e.date,
    description: e.desc
  }));

  const education = (json.educationInfo.schools || []).map(e => ({
    degree: e.subHeader || '',
    institution: e.schoolName,
    year: e.duration
  }));

  return {
    about: `<i class="fas fa-user"></i> ${json.greeting.title}. ${json.greeting.subTitle.replace('🚀', '').trim()}`,
    skills: skillsText,
    projects,
    experience,
    education,
    linkedinUrl: json.socialMediaLinks.linkedin,
    githubUsername: (json.socialMediaLinks.github || '').split('github.com/').pop()
  };
}

async function loadPortfolioData() {
  try {
    const resp = await fetch(DATA_URL);
    if (!resp.ok) throw new Error('fetch error');
    const json = await resp.json();
    const mapped = transformPortfolio(json);
    Object.assign(data, mapped);
    window.workExperience = mapped.experience;
    window.projectList = mapped.projects;
    window.educationList = mapped.education;
    window.skillList = json.skillsSection.softwareSkills || [];
    console.log('Using remote portfolio data');
  } catch (err) {
    console.error('Failed to load portfolio data', err);
    // Fallback to local data if remote fetch fails
    if (window.portfolioData) {
      Object.assign(data, window.portfolioData);
      console.log('Using local portfolio data as fallback');
    }
  }
}

function formatExperience(experiences) {
  return experiences.map(exp => {
    return [
      `<span style="color:#4CAF50;">- Role:</span> <strong>${exp.role}</strong>`,
      `<span style="color:#4CAF50;">  Company:</span> ${exp.company}`,
      `<span style="color:#4CAF50;">  Period:</span> ${exp.period}`,
      `<span style="color:#4CAF50;">  Details:</span> ${exp.description}`
    ].join('<br>');
  }).join('<br><br>');
}

function formatEducation(edu) {
  return edu.map(e => {
    if (e.degree && e.degree.trim()) {
      return `- ${e.degree}, ${e.institution} (${e.year})`;
    } else {
      return `- ${e.institution} (${e.year})`;
    }
  }).join('\n');
}

function formatProjects(projs) {
  return projs
    .map(p => {
      let aiIndicator = '';
      if (p.aiUsed) {
        // Show only the AI level tag when AI is used
        const aiLabels = {
          low: '<span class="ai-tag ai-low">Low AI</span>',
          medium: '<span class="ai-tag ai-medium">Medium AI</span>',
          high: '<span class="ai-tag ai-high">High AI</span>',
          vibecoded: '<span class="ai-tag ai-vibecoded">Vibecoded</span>'
        };
        aiIndicator = ` ${aiLabels[p.aiLevel] || aiLabels.low}`;
      } else {
        // Show "No AI" when AI is not used
        aiIndicator = ' <span class="ai-tag ai-none">No AI</span>';
      }
      
      const yearTag = p.year ? ` <span class="project-year">[${p.year}]</span>` : '';
      
      return `- <a href="${p.url}" target="_blank" class="gh-link">${p.name}</a>${yearTag}: ${p.description}${aiIndicator}`;
    })
    .join('\n');
}

// -----------------------------
// Command definitions
// -----------------------------
const hiddenCommands = ['bellaraga'];

const commands = {
  help: () => {
    const available = Object.keys(commands)
      .filter(c => c !== 'clear' && c !== 'help' && !hiddenCommands.includes(c));
    return `<i class="fas fa-lightbulb"></i> Available commands:\n` +
      available.map(c => `- ${cmdLink(c)}`).join('\n');
  },
  about: () => data.about || '',
  skills: () => data.skills || '',
  projects: () => formatProjects(data.projects || []),
  experience: () => formatExperience(data.experience || []),
  education: () => formatEducation(data.education || []),
  github: () => githubCommand(data.githubUsername),
  linkedin: () => ` <a href="${data.linkedinUrl}" <i class="fas fa-link"></i>target="_blank" class="gh-link">LinkedIn Profile</a>`,
  contact: () => `<i class="fas fa-envelope"></i> Email: <a href="mailto:alessioiodiceuni@gmail.com" class="gh-link">alessioiodiceuni@gmail.com</a>`,
  curriculum: () => {
    triggerDownload(CV_URL, 'cv.pdf');
    return `<i class="fas fa-paperclip"></i> Downloading <a href="${CV_URL}" target="_blank" class="gh-link">cv.pdf</a>`;
  },
  bellaraga: () => {
    return `<img src="assets/bellaraga.png" alt="bellaraga" style="width: 300px; max-width: 100%; image-rendering: pixelated;">`;
  }
};

// -----------------------------
// Command execution
// -----------------------------
input.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const cmd = input.value.trim();
    runCommand(cmd);
  }
});

async function runCommand(command) {
  const line = document.createElement('div');
  line.classList.add('line');
  line.innerHTML = `<span class="prompt">welcome@portfolio:~$</span> ${command}`;
  output.appendChild(line);
  scrollToBottom(); // Scroll dopo aver aggiunto il comando

  input.value = '';
  updateCursor();

  if (command === 'clear') {
    output.innerHTML = '';
    showWelcomeMessage();
    return;
  }

  await wait(500); // Ritardo di 0.5 secondi prima della risposta

  const responseLine = document.createElement('div');
  let result = commands[command];

  if (typeof result === 'function') {
    try {
      result = await result();
    } catch (err) {
      result = `<i class="fas fa-times-circle"></i> Error running command: ${err.message}`;
    }
  }

  if (result) {
    responseLine.innerHTML = result.replace(/\n/g, '<br>');
  } else {
    responseLine.innerHTML = `<i class="fas fa-times-circle"></i> Command not found: ${command}`;
  }

  output.appendChild(responseLine);
  attachCmdListeners(responseLine);
  
  // Piccolo delay per assicurarsi che il DOM sia aggiornato prima dello scroll
  setTimeout(() => {
    scrollToBottom();
  }, 50);
  
  keepFocus();
}

// -----------------------------
// Welcome message and ASCII art
// -----------------------------
const asciiArtName = `  ___    ___  ________   ________   ________   ___   ___  __     ___  __     ________     
 |\\  \\  /  /||\\   __  \\ |\\   ___ \\ |\\   ___ \\ |\\  \\ |\\  \\|\\  \\  |\\  \\|\\  \\  |\\   __  \\    
 \\ \\  \\/  / /\\ \\  \\|\\  \\\\ \\  \\_|\\ \\\\ \\  \\_|\\ \\\\ \\  \\\\ \\  \\/  /|_\\ \\  \\/  /|_\\ \\  \\|\\  \\   
  \\ \\    / /  \\ \\  \\\\\\  \\\\ \\  \\ \\\\ \\\\ \\  \\ \\\\ \\\\ \\  \\\\ \\   ___  \\\\ \\   ___  \\\\ \\  \\\\\\  \\  
   \\/  /  /    \\ \\  \\\\\\  \\\\ \\  \\_\\\\ \\\\ \\  \\_\\\\ \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\\\  \\ 
 __/  / /       \\ \\_______\\\\ \\_______\\\\ \\_______\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\_______\\
|\\___/ /         \\|_______| \\|_______| \\|_______| \\|__| \\|__| \\|__| \\|__| \\|__| \\|_______|  v0.0.1
\\|___|/                                                                                   

`;
function showWelcomeMessage() {
  if (document.getElementById('ascii-art')) return;

  const pre = document.createElement('pre');
  pre.textContent = asciiArtName;
  pre.id = 'ascii-art';
  output.appendChild(pre);

  const lines = [
    '<i class="fas fa-hand-peace"></i> Welcome to my terminal-style portfolio!',
    `Try these commands: ${cmdLink('about')}, ${cmdLink('projects')}, ${cmdLink('github')}, ${cmdLink('help')}`,
    ''
  ];

  lines.forEach(line => {
    const div = document.createElement('div');
    div.innerHTML = line;
    output.appendChild(div);
  });

  attachCmdListeners(output);
  scrollToBottom();
}

window.addEventListener('DOMContentLoaded', async () => {
  await loadPortfolioData();
  showWelcomeMessage();
  keepFocus();
});

// -----------------------------
// GitHub API logic
// -----------------------------
const spinnerFrames = ['|', '/', '-', '\\'];
function startSpinner(elem) {
  let i = 0;
  elem.textContent = spinnerFrames[i++];
  const id = setInterval(() => {
    elem.textContent = spinnerFrames[i % spinnerFrames.length];
    i++;
  }, 100);
  return () => clearInterval(id);
}

async function fetchGitHubInfo(username) {
  const userResp = await fetch(`https://api.github.com/users/${username}`);
  if (!userResp.ok) throw new Error('GitHub API error');

  const user = await userResp.json();
  const reposResp = await fetch(`${user.repos_url}?per_page=100`);
  const repos = await reposResp.json();

  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const topRepos = repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  const icon = {
    user: '<i class="fas fa-user"></i>',
    star: '<i class="fas fa-star" style="color:yellow;"></i>',
    repo: '<i class="fas fa-folder-open"></i>',
    followers: '<i class="fas fa-users"></i>'
  };

  const link = (url, text) => `<a href="${url}" target="_blank" class="gh-link">${text}</a>`;
  const gray = txt => `<span style="color:gray;">${txt}</span>`;

  let out = `${link(user.html_url, `${icon.user} ${user.login}`)} | ${icon.followers} ${user.followers} followers<br>`;
  out += `${icon.star} Total stars: ${totalStars}<br>`;
  out += `${icon.repo} Top repos:<br>`;

  topRepos.forEach(repo => {
    out += ` - ${link(repo.html_url, repo.name)} ${icon.star} ${repo.stargazers_count}<br>`;
    if (repo.description) out += `${gray('   ' + repo.description)}<br>`;
  });

  return out;
}

async function githubCommand(username = 'Yoddikko') {
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = 'Loading GitHub info ';
  output.appendChild(loadingDiv);
  const stop = startSpinner(loadingDiv);
  try {
    const info = await fetchGitHubInfo(username);
    stop();
    return info;
  } catch (err) {
    stop();
    return `<i class="fas fa-times-circle"></i> Error fetching GitHub info: ${err.message}`;
  }
}

