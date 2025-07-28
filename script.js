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
  github: '🌐 <a href="https://github.com/yourusername" target="_blank">GitHub Profile</a>',
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
  const commandLine = document.createElement("div");
  commandLine.classList.add("line");
  commandLine.innerHTML = `<span class="prompt">welcome@portfolio:~$</span> ${command}`;
  output.appendChild(commandLine);

  input.value = "";

  await wait(200);

  if (command === "clear") {
    output.innerHTML = "";
    showWelcomeMessage();
  } else {
    const responseLine = document.createElement("div");
    const result = typeof commands[command] === "function" ? commands[command]() : commands[command];
    if (result) {
      responseLine.innerHTML = result.replace(/\n/g, "<br>");
    } else {
      responseLine.textContent = `❌ Command not found: ${command}`;
    }
    output.appendChild(responseLine);
  }

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
|\\___/ /         \\|_______| \\|_______| \\|_______| \\|__| \\|__| \\|__| \\|__| \\|__| \\|_______|
\\|___|/                                                                                   
`;

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
