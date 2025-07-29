// -----------------------------
// DOM Elements
// -----------------------------
const output = document.getElementById('output');
const input = document.getElementById('input');

function scrollToBottom() {
  output.scrollTop = output.scrollHeight;
}

function keepFocus() {
  input.focus();
}
window.addEventListener('click', keepFocus);

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

function cmdLink(cmd) {
  const icons = {
    github: '<i class="fab fa-github"></i>',
    linkedin: '<i class="fab fa-linkedin"></i>',
    about: '<i class="fas fa-user"></i>',
    projects: '<i class="fas fa-folder-open"></i>',
    skills: '<i class="fas fa-tools"></i>',
    experience: '<i class="fas fa-briefcase"></i>',
    education: '<i class="fas fa-graduation-cap"></i>',
    help: '<i class="fas fa-question-circle"></i>'
  };
  const icon = icons[cmd] || '<i class="fas fa-terminal"></i>';
  return `<a href="#" data-cmd="${cmd}">${icon} ${cmd}</a>`;
}

// -----------------------------
// Portfolio data formatting
// -----------------------------
const data = window.portfolioData || {};

function formatExperience(exp) {
  return exp.map(e => `- ${e.role} @ ${e.company} (${e.period})`).join('\n');
}

function formatEducation(edu) {
  return edu.map(e => `- ${e.degree}, ${e.institution} (${e.year})`).join('\n');
}

function formatProjects(projs) {
  return projs
    .map(p => `- <a href="${p.url}" target="_blank">${p.name}</a>: ${p.description}`)
    .join('\n');
}

// -----------------------------
// Command definitions
// -----------------------------
// commands marked as hidden will not show up in the help output
const hiddenCommands = new Set(['clear', 'secret']);

function helpCommand() {
  const available = Object.keys(commands).filter(
    c => !hiddenCommands.has(c) && c !== 'help'
  );
  return (
    '💡 Available commands:\n' + available.map(c => `- ${cmdLink(c)}`).join('\n')
  );
}

const commands = {
  help: helpCommand,
  about: data.about,
  skills: data.skills,
  projects: () => formatProjects(data.projects || []),
  experience: () => formatExperience(data.experience || []),
  education: () => formatEducation(data.education || []),
  github: () => githubCommand(data.githubUsername),
  linkedin: `🔗 <a href="${data.linkedinUrl}" target="_blank">LinkedIn Profile</a>`
  ,secret: () => "\uD83D\uDD08 You've found the secret command!"
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

  input.value = '';
  await wait(200);

  if (command === 'clear') {
    output.innerHTML = '';
    showWelcomeMessage();
    return;
  }

  const responseLine = document.createElement('div');
  let result = commands[command];

  if (typeof result === 'function') {
    try {
      result = await result();
    } catch (err) {
      result = `❌ Error running command: ${err.message}`;
    }
  }

  if (result) {
    responseLine.innerHTML = result.replace(/\n/g, '<br>');
  } else {
    responseLine.textContent = `❌ Command not found: ${command}`;
  }

  output.appendChild(responseLine);
  attachCmdListeners(responseLine);
  scrollToBottom();
  keepFocus();
}

// -----------------------------
// Welcome message and ASCII art
// -----------------------------
const asciiArtName = `  ___    ___  ________   ________   ________   ___   ___
__     ___  __     ________
 |\\  \\  /  /||\\   __  \\ |\\   ___ \\ |\\   ___ \\ |\\  \\ |\\  \\|\\  \\  |\\  \\|\\  \\  |\\   __  \\
 \\ \\  \\/  / /\\ \\  \\|\\  \\\\ \\  \\_|\\ \\\\ \\  \\_|\\ \\\\ \\  \\\\ \\/  /|_\\ \\  \\/  /|_\\ \\  \\|\\  \\
  \\ \\    / /  \\ \\  \\\\\\  \\\\ \\  \\ \\\\ \\\\ \\  \\ \\\\ \\\\ \\  \\\\ \   ___  \\\\ \\   ___  \\\\ \\  \\\\\\  \\
   \\/  /  /    \\ \\  \\\\\\  \\\\ \\  \\_\\\\ \\\\ \\  \\_\\\\ \\\\ \\  \\\\ \  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\\\  \\
 __/  / /       \\ \\_______\\\\ \\_______\\\\ \\_______\\\\ \\__\\\\ \\__\\\\ \__\\\\ \\__\\\\ \\__\\\\ \\_______\\
|\\___/ /         \\|_______| \\|_______| \\|_______| \\|__| \\|__| \\|__| \\|__| | \\|__| \\|_______|  v0.0.1
\\|___|/`;

function showWelcomeMessage() {
  if (document.getElementById('ascii-art')) return;

  const pre = document.createElement('pre');
  pre.textContent = asciiArtName;
  pre.id = 'ascii-art';
  output.appendChild(pre);

  const lines = [
    '👋 Welcome to my terminal-style portfolio!',
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

window.addEventListener('DOMContentLoaded', () => {
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
    .slice(0, 3);

  const icon = {
    user: '<i class="fas fa-user"></i>',
    star: '<i class="fas fa-star" style="color:yellow;"></i>',
    repo: '<i class="fas fa-folder-open"></i>',
    followers: '<i class="fas fa-users"></i>'
  };

  const link = (url, text) => `<a href="${url}" target="_blank" class="gh-link">${text}</a>`;
  const gray = txt => `<span style="color:gray;">${txt}</span>`;

  let out = `${icon.user} ${link(user.html_url, user.login)} | ${icon.followers} ${user.followers} followers<br>`;
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
    return `❌ Error fetching GitHub info: ${err.message}`;
  }
}

