const output = document.getElementById("output");
const input = document.getElementById("input");

const commands = {
  help: "Available commands: help, about, projects, github, clear",
  about: "Hi! I'm [Your Name], a developer passionate about building terminal UIs.",
  projects: "Coming soon...",
  github: "https://github.com/yourusername",
};

input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const command = input.value.trim();
    output.innerHTML += `<p>welcome@portfolio:~$ ${command}</p>`;
    if (commands[command]) {
      output.innerHTML += `<p>${commands[command]}</p>`;
    } else if (command === "clear") {
      output.innerHTML = "";
    } else {
      output.innerHTML += `<p>Command not found: ${command}</p>`;
    }
    input.value = "";
    window.scrollTo(0, document.body.scrollHeight);
  }
});
