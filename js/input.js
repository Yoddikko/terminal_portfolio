// =============================================================
//  input.js — history, autocomplete, esecuzione comandi
// =============================================================

const HISTORY_LIMIT = 100;
const HISTORY_KEY = 'portfolio.history';

function loadHistory() {
  try {
    const arr = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    if (!Array.isArray(arr)) return [];
    return arr.filter(x => typeof x === 'string').slice(-HISTORY_LIMIT);
  } catch (e) {
    return [];
  }
}

function saveHistory() {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(-HISTORY_LIMIT)));
  } catch (e) { /* localStorage non disponibile: ignora */ }
}

const history = loadHistory();
let historyIndex = -1; // -1 = riga corrente (non sto navigando la history)

function setCaretEnd() {
  const end = input.value.length;
  input.setSelectionRange(end, end);
  updateCursor();
}

function longestCommonPrefix(arr) {
  if (!arr.length) return '';
  let prefix = arr[0];
  for (const s of arr) {
    while (!s.startsWith(prefix)) prefix = prefix.slice(0, -1);
  }
  return prefix;
}

function handleAutocomplete() {
  const typed = input.value.trim().toLowerCase();
  if (!typed) return;
  const names = Object.keys(commands).filter(c => !hiddenCommands.includes(c));
  const matches = names.filter(c => c.startsWith(typed));

  if (matches.length === 1) {
    input.value = matches[0];
    setCaretEnd();
  } else if (matches.length > 1) {
    // Come una vera shell: mostra i candidati e completa il prefisso comune.
    echoPrompt(input.value.trim());
    const line = document.createElement('div');
    line.innerHTML = matches.map(cmdLink).join('&nbsp;&nbsp;');
    output.appendChild(line);
    attachCmdListeners(line);
    input.value = longestCommonPrefix(matches);
    setCaretEnd();
    scrollToBottom();
  }
}

async function runCommand(rawCommand) {
  const command = (rawCommand || '').trim();
  echoPrompt(command);
  scrollToBottom();

  input.value = '';
  updateCursor();

  // Enter a vuoto: solo un nuovo prompt, nessun errore.
  if (!command) {
    keepFocus();
    return;
  }

  const [name, ...args] = command.split(/\s+/);
  const key = name.toLowerCase();

  if (key === 'clear') {
    output.innerHTML = '';
    showWelcomeMessage();
    keepFocus();
    return;
  }

  await wait(reduceMotion ? 0 : 180);

  const responseLine = document.createElement('div');
  output.appendChild(responseLine);

  const fn = commands[key];

  if (typeof fn !== 'function') {
    responseLine.innerHTML =
      `<i class="fas fa-times-circle"></i> Command not found: ${escapeHtml(name)}. ` +
      `Type <a href="#" data-cmd="help">help</a> for the list.`;
    attachCmdListeners(responseLine);
    announce(`Command not found: ${name}`);
    scrollToBottom();
    keepFocus();
    return;
  }

  let result;
  try {
    result = await fn(args);
  } catch (err) {
    result = `<i class="fas fa-times-circle"></i> Error running command: ${escapeHtml(err.message)}`;
  }

  if (result === undefined || result === null || result === '') {
    responseLine.innerHTML = `<span class="muted">(no data available — try again online)</span>`;
    announce('No data available');
    scrollToBottom();
  } else {
    await printResult(responseLine, String(result).replace(/\n/g, '<br>'));
    announce(result);
  }

  keepFocus();
}
