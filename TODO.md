# TODO — miglioramenti struttura/codice

## ✅ Tutto completato
- [x] **(15) Modularizzato `script.js`** → `content.js` (dati, root) + 8 moduli in `js/`:
      `core.js` (DOM/utility), `data.js` (mapping+formatter), `github.js`,
      `commands.js`, `terminal.js` (cursore/glow/banner/output), `input.js`
      (history/autocomplete/runCommand), `theme.js`, `main.js` (tutto il wiring).
      Script **classici** in ordine di dipendenza (no build, `file://`-safe: niente
      ES module). `main.js` carica per ultimo → nessun problema di ordine/TDZ.
- [x] (16) Rimosso codice morto (`createMouseGlow`, `triggerDownload`).
- [x] (17) Email/contatti in `content.js`.
- [x] (18) `rel="noopener noreferrer"` sui link esterni.
- [x] (19) Cache GitHub API (localStorage TTL 1h) + timeout + fallback rate-limit.
- [x] (20) SEO/social: title, description, Open Graph, Twitter card, favicon SVG.

## Note
- Dati editabili SOLO in `content.js` (`window.PORTFOLIO`).
- Verifica split fatta con harness Node (DOM finto + concat in ordine): nessuna
  ridichiarazione, nessun TDZ, comandi eseguiti, dati reali presenti.
