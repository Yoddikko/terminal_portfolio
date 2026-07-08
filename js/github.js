// =============================================================
//  github.js — comando `github`: cache localStorage, TTL,
//  timeout e fallback su rate-limit
// =============================================================

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

// --- Cache localStorage per l'API GitHub (evita il rate-limit di 60 req/h) ---
const GH_TTL = 60 * 60 * 1000; // 1 ora
function ghCacheKey(u) { return `gh-cache:v1:${u}`; }

function readGhCache(u) {
  try {
    const obj = JSON.parse(localStorage.getItem(ghCacheKey(u)) || 'null');
    if (!obj || typeof obj.t !== 'number' || typeof obj.html !== 'string') return null;
    return obj;
  } catch (e) {
    return null;
  }
}

function writeGhCache(u, html) {
  try {
    localStorage.setItem(ghCacheKey(u), JSON.stringify({ t: Date.now(), html }));
  } catch (e) { /* ignora */ }
}

// fetch JSON con timeout; segnala i rate-limit (403/429) su err.rateLimited.
async function fetchJson(url, ms = 9000) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), ms);
  try {
    const resp = await fetch(url, { signal: ctrl.signal });
    if (!resp.ok) {
      const err = new Error(resp.status === 403 || resp.status === 429
        ? 'GitHub rate limit reached' : 'GitHub API error');
      if (resp.status === 403 || resp.status === 429) err.rateLimited = true;
      throw err;
    }
    return await resp.json();
  } finally {
    clearTimeout(timer);
  }
}

function renderGitHubInfo(user, repos) {
  const totalStars = repos.reduce((sum, r) => sum + (r.stargazers_count || 0), 0);
  const topRepos = repos
    .filter(r => !r.fork)
    .sort((a, b) => b.stargazers_count - a.stargazers_count)
    .slice(0, 4);

  const icon = {
    user: '<i aria-hidden="true" class="fas fa-user"></i>',
    star: '<i aria-hidden="true" class="fas fa-star" style="color:yellow;"></i>',
    repo: '<i aria-hidden="true" class="fas fa-folder-open"></i>',
    followers: '<i aria-hidden="true" class="fas fa-users"></i>'
  };

  const link = (url, text) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="gh-link">${text}</a>`;
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

async function fetchFreshGitHub(username) {
  const user = await fetchJson(`https://api.github.com/users/${username}`);
  const repos = await fetchJson(`${user.repos_url}?per_page=100`);
  if (!Array.isArray(repos)) throw new Error('GitHub API error');
  return renderGitHubInfo(user, repos);
}

async function fetchGitHubInfo(username) {
  const cached = readGhCache(username);
  if (cached && (Date.now() - cached.t) < GH_TTL) return cached.html;
  try {
    const html = await fetchFreshGitHub(username);
    writeGhCache(username, html);
    return html;
  } catch (err) {
    // Se abbiamo dati in cache (anche scaduti), mostriamoli invece dell'errore.
    if (cached) {
      return cached.html + '<br><span class="muted">(cached — GitHub unavailable right now)</span>';
    }
    throw err;
  }
}

async function githubCommand(username) {
  username = username || 'Yoddikko';
  const loadingDiv = document.createElement('div');
  loadingDiv.textContent = 'Loading GitHub info ';
  output.appendChild(loadingDiv);
  const stop = startSpinner(loadingDiv);
  try {
    const info = await fetchGitHubInfo(username);
    stop();
    loadingDiv.remove();
    return info;
  } catch (err) {
    stop();
    loadingDiv.remove();
    return `<i aria-hidden="true" class="fas fa-times-circle"></i> Error fetching GitHub info: ${escapeHtml(err.message)}`;
  }
}
