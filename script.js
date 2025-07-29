const output = document.getElementById("output");
const input = document.getElementById("input");

const commands = {
  help: function () {
    const available = Object.keys(commands).filter(cmd => cmd !== "clear" && cmd !== "help");
    return "💡 Available commands:\n" + available.map(c => `- ${cmdLink(c)}`).join("\n");
  },
  about: "👤 Hi! I'm Alessio, a developer passionate about building terminal UIs.",
  skills: "🛠️ Languages: JavaScript, Python, HTML/CSS\nFrameworks: React, Node.js, Express\nTools: Git, Docker, VS Code",
  projects: "📂 Visit my GitHub or type a project name (e.g. 'project1') to get more info.",
  experience: "💼 Software Developer @ XYZ Corp (2022–Now)\nIntern @ ABC Studio (2021)",
  education: "🎓 BSc Computer Science, University of X (2018–2021)",
  github: async function() {
    return await githubCommand();
  },
  linkedin: '🔗 <a href="https://linkedin.com/in/yourusername" target="_blank">LinkedIn Profile</a>',
};

// Handle input
input.addEventListener("keydown", async function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim();
    runCommand(command);
  }
});


async function runCommand(command) {
    // 1. Mostra il comando digitato con prompt
    const commandLine = document.createElement("div");
    commandLine.classList.add("line");
    commandLine.innerHTML = `<span class="prompt">welcome@portfolio:~$</span> ${command}`;
    output.appendChild(commandLine);
  
    // 2. Resetta input
    input.value = "";
  
    // 3. Attendi leggermente (effetto terminale)
    await wait(200);
  
    // 4. Se il comando è 'clear', resetta l'output e mostra la welcome screen
    if (command === "clear") {
      output.innerHTML = "";
      showWelcomeMessage();
      return;
    }
  
    // 5. Calcola il contenuto della risposta (può essere stringa o funzione)
    const responseLine = document.createElement("div");
    let result = commands[command];
  
    if (typeof result === "function") {
      try {
        result = await result();
      } catch (err) {
        result = `❌ Error running command: ${err.message}`;
      }
    }
  
    // 6. Mostra risultato o errore
    if (result) {
      responseLine.innerHTML = result.replace(/\n/g, "<br>");
    } else {
      responseLine.textContent = `❌ Command not found: ${command}`;
    }
  
    output.appendChild(responseLine);
  
    // 7. Scrolla in fondo
    setTimeout(() => {
      document.getElementById("scroll-anchor").scrollIntoView({ behavior: "smooth" });
    }, 30);
  }
  

function cmdLink(cmd) {
  const icons = {
    github: `<i class="fab fa-github"></i>`,
    linkedin: `<i class="fab fa-linkedin"></i>`,
    about: `<i class="fas fa-user"></i>`,
    projects: `<i class="fas fa-folder-open"></i>`,
    skills: `<i class="fas fa-tools"></i>`,
    experience: `<i class="fas fa-briefcase"></i>`,
    education: `<i class="fas fa-graduation-cap"></i>`,
    help: `<i class="fas fa-question-circle"></i>`,
  };

  const icon = icons[cmd] || `<i class="fas fa-terminal"></i>`;
  return `<a href="#" data-cmd="${cmd}">${icon} ${cmd}</a>`;
}

function showWelcomeMessage() {
  if (document.getElementById("ascii-art")) return;

  const pre = document.createElement("pre");
  pre.textContent = asciiArtName;
  pre.id = "ascii-art";
  output.appendChild(pre);

  const lines = [
    "👋 Welcome to my terminal-style portfolio!",
    `Try these commands: ${cmdLink("about")}, ${cmdLink("projects")}, ${cmdLink("github")}, ${cmdLink("help")}`,
    "",
  ];

  lines.forEach((line) => {
    const div = document.createElement("div");
    div.innerHTML = line;
    output.appendChild(div);
  });

  document.querySelectorAll("a[data-cmd]").forEach(link => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const cmd = e.target.getAttribute("data-cmd");
      runCommand(cmd);
    });
  });
}

window.addEventListener("DOMContentLoaded", () => {
  showWelcomeMessage();
});

const asciiArtName = `  ___    ___  ________   ________   ________   ___   ___  __     ___  __     ________     
 |\\  \\  /  /||\\   __  \\ |\\   ___ \\ |\\   ___ \\ |\\  \\ |\\  \\|\\  \\  |\\  \\|\\  \\  |\\   __  \\    
 \\ \\  \\/  / /\\ \\  \\|\\  \\\\ \\  \\_|\\ \\\\ \\  \\_|\\ \\\\ \\  \\\\ \\  \\/  /|_\\ \\  \\/  /|_\\ \\  \\|\\  \\   
  \\ \\    / /  \\ \\  \\\\\\  \\\\ \\  \\ \\\\ \\\\ \\  \\ \\\\ \\\\ \\  \\\\ \\   ___  \\\\ \\   ___  \\\\ \\  \\\\\\  \\  
   \\/  /  /    \\ \\  \\\\\\  \\\\ \\  \\_\\\\ \\\\ \\  \\_\\\\ \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\ \\  \\\\\\  \\ 
 __/  / /       \\ \\_______\\\\ \\_______\\\\ \\_______\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\__\\\\ \\_______\\
|\\___/ /         \\|_______| \\|_______| \\|_______| \\|__| \\|__| \\|__| \\|__| \\|__| \\|_______|  v0.0.1
\\|___|/                                                                                   

`;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function attachCmdListeners() {
    document.querySelectorAll("a[data-cmd]").forEach(link => {
      link.onclick = (e) => {
        e.preventDefault();
        const cmd = e.target.getAttribute("data-cmd");
        runCommand(cmd);
      };
    });
  }
  

const spinnerFrames = ["|", "/", "-", "\\"];
function startSpinner(elem) {
  let i = 0;
  elem.textContent = spinnerFrames[i++];
  const id = setInterval(() => {
    elem.textContent = spinnerFrames[i % spinnerFrames.length];
    i++;
  }, 100);
  return () => clearInterval(id);
}

async function fetchGitHubInfo(username = "Yoddikko") {
    const userResp = await fetch(`https://api.github.com/users/${username}`);
    if (!userResp.ok) throw new Error("GitHub API error");
  
    const user = await userResp.json();
    const reposResp = await fetch(`${user.repos_url}?per_page=100`);
    const repos = await reposResp.json();
  
    const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
    const topRepos = repos
      .filter(r => !r.fork)
      .sort((a, b) => b.stargazers_count - a.stargazers_count)
      .slice(0, 3);
  
    const icon = {
      user: `<i class="fas fa-user"></i>`,
      star: `<i class="fas fa-star" style="color:yellow;"></i>`,
      repo: `<i class="fas fa-folder-open"></i>`,
      followers: `<i class="fas fa-users"></i>`,
    };
  
    const cyanLink = (url, text) =>
      `<a href="${url}" target="_blank" class="gh-link">${text}</a>`;
    const gray = txt => `<span style="color:gray;">${txt}</span>`;
  
    let output = `${icon.user} ${cyanLink(user.html_url, user.login)} | ${icon.followers} ${user.followers} followers<br>`;
    output += `${icon.star} Total stars: ${totalStars}<br>`;
    output += `${icon.repo} Top repos:<br>`;
  
    topRepos.forEach(repo => {
      output += ` - ${cyanLink(repo.html_url, repo.name)} ${icon.star} ${repo.stargazers_count}<br>`;
      if (repo.description) {
        output += `${gray("   " + repo.description)}<br>`;
      }
    });
  
    return output;
  }
  
      
  async function githubCommand() {
    const loadingDiv = document.createElement("div");
    loadingDiv.textContent = "Loading GitHub info ";
    output.appendChild(loadingDiv);
    const stop = startSpinner(loadingDiv);
    try {
      const info = await fetchGitHubInfo("Yoddikko");
      stop();
      return info;
    } catch (err) {
      stop();
      return `❌ Error fetching GitHub info: ${err.message}`;
    }
  }
  