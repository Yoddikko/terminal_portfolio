// test/verify.js — verifica che i moduli (script classici, scope globale
// condiviso) si carichino nell'ordine reale senza errori di riferimento/TDZ,
// che DOMContentLoaded parta e che ogni comando produca output.
// Modella i browser concatenando i file in un unico programma in un contesto vm
// con un DOM finto minimale. Nessuna dipendenza esterna.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const ORDER = [
  'content.js',
  'js/core.js', 'js/data.js', 'js/github.js', 'js/commands.js',
  'js/terminal.js', 'js/input.js', 'js/theme.js', 'js/main.js',
];

function makeEl() {
  return {
    _attrs: {}, children: [], parentElement: null,
    style: { setProperty() {}, removeProperty() {} },
    classList: { add() {}, remove() {}, contains() { return false; } },
    dataset: {},
    textContent: '', innerHTML: '', value: '', type: '', className: '', id: '',
    selectionStart: 0, offsetWidth: 10, scrollWidth: 120, clientWidth: 600,
    appendChild(c) { this.children.push(c); if (c) c.parentElement = this; return c; },
    removeChild(c) { const i = this.children.indexOf(c); if (i >= 0) this.children.splice(i, 1); return c; },
    remove() { if (this.parentElement) this.parentElement.removeChild(this); },
    setAttribute(k, v) { this._attrs[k] = String(v); },
    getAttribute(k) { return k in this._attrs ? this._attrs[k] : null; },
    addEventListener() {}, removeEventListener() {},
    querySelector() { return null; }, querySelectorAll() { return []; },
    select() {}, setSelectionRange() {}, focus() {}, closest() { return null; },
  };
}

const ids = {};
['output', 'input', 'cursor', 'sr-announce', 'cmdbar', 'theme-toggle'].forEach(id => { ids[id] = makeEl(); ids[id].id = id; });
const domReady = [];
const doc = {
  body: makeEl(), documentElement: makeEl(),
  getElementById(id) { return id in ids ? ids[id] : null; },
  createElement() { return makeEl(); },
  querySelector(sel) {
    if (sel === '.cursor') return ids.cursor;
    if (sel === '.input-line .prompt') { const e = makeEl(); e.offsetWidth = 120; return e; }
    if (sel === '.terminal') return makeEl();
    return null;
  },
  querySelectorAll() { return []; },
  addEventListener(t, fn) { if (t === 'DOMContentLoaded') domReady.push(fn); },
  execCommand() { return true; },
};
const store = {};
const win = {
  PORTFOLIO: undefined, innerWidth: 1200,
  matchMedia(q) { return { matches: /reduced-motion/.test(q) }; },
  addEventListener(t, fn) { if (t === 'DOMContentLoaded') domReady.push(fn); },
  getComputedStyle() { return { font: '16px monospace' }; },
  getSelection() { return { toString() { return ''; } }; },
  visualViewport: undefined,
};
const sandbox = {
  document: doc, window: win, navigator: { clipboard: undefined },
  localStorage: { getItem(k) { return k in store ? store[k] : null; }, setItem(k, v) { store[k] = String(v); }, removeItem(k) { delete store[k]; } },
  requestAnimationFrame(fn) { return setTimeout(fn, 0); },
  fetch() { return Promise.reject(new Error('no network')); },
  AbortController, setTimeout, clearTimeout, setInterval, clearInterval,
  console, JSON, Math, Object, Array, Promise, Date, String, Number, Boolean, RegExp, Error,
};
sandbox.globalThis = sandbox;

let src = '';
for (const f of ORDER) src += `\n;// ${f}\n` + fs.readFileSync(path.join(ROOT, f), 'utf8') + '\n';
src += '\n;__result = { commands, data, runCommand };\n';

try { vm.runInContext(src, vm.createContext(sandbox), { filename: 'concat.js' }); }
catch (e) { console.error('LOAD ERROR:', e && e.message); process.exit(1); }

let failed = 0;
const assert = (c, m) => { if (!c) { console.error('FAIL:', m); failed++; } else console.log('ok  ', m); };

(async () => {
  for (const fn of domReady) { try { await fn(); } catch (e) { console.error('DOMContentLoaded error:', e.message); process.exit(1); } }
  const R = sandbox.__result;

  assert(typeof R.runCommand === 'function', 'runCommand defined');
  ['about', 'skills', 'projects', 'experience', 'education', 'certifications', 'awards',
   'github', 'linkedin', 'contact', 'curriculum', 'whoami', 'pwd', 'date', 'ls', 'cat',
   'echo', 'help', 'man'].forEach(k => assert(typeof R.commands[k] === 'function', `command "${k}" defined`));

  ['projects', 'experience', 'education', 'certifications', 'awards'].forEach(k =>
    assert(Array.isArray(R.data[k]), `data.${k} is an array`));

  // Ogni comando senza argomenti produce output senza errori.
  for (const c of ['about', 'skills', 'projects', 'experience', 'education', 'certifications',
    'awards', 'contact', 'curriculum', 'whoami', 'pwd', 'ls', 'help']) {
    try { const out = R.commands[c](); assert(typeof out === 'string' && out.length > 0, `${c}() returns text`); }
    catch (e) { assert(false, `${c}() threw: ${e.message}`); }
  }
  // Comandi con argomenti.
  assert(typeof R.commands.help(['projects']) === 'string' && /projects/i.test(R.commands.help(['projects'])), 'help <cmd> works');
  assert(typeof R.commands.man(['about']) === 'string', 'man <cmd> works');
  assert(/who I am|intro/i.test(R.commands.cat(['about.txt'])) || R.commands.cat(['about.txt']).length > 0, 'cat about.txt works');
  assert(/No such file/.test(R.commands.cat(['nope.txt'])), 'cat unknown file handled');

  // Percorso completo runCommand (async) senza errori.
  for (const c of ['about', 'projects', 'help projects', 'cat skills.txt', 'whoami']) {
    try { await R.runCommand(c); assert(true, `runCommand("${c}") ok`); }
    catch (e) { assert(false, `runCommand("${c}") threw: ${e.message}`); }
  }

  console.log(failed ? `\nRESULT: ${failed} FAILURE(S)` : '\nRESULT: ALL PASS');
  process.exit(failed ? 1 : 0);
})();
