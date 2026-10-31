# Review Slice 721, Runde 1 (`7b445c2d5..01aac3cb4`)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | src/__tests__/csp.test.ts:9-20 (zu svelte.config.js:27-28) | Der Test prüft `style-src` und `img-src` nicht. Beide Zeilen braucht die App aber: Die Vorschau der ersten Seite einer hochgeladenen Rechnung ist ein `data:`-JPEG (`src/lib/file-pages.ts:15,32`, angezeigt in `src/routes/invoices/UploadRowFields.svelte:52`), und Svelte schreibt Stil-Attribute zur Laufzeit (`src/lib/ui/ProgressBar.svelte:15`, `HeatingProfileChart.svelte:28`). Kein E2E-Schritt prüft, ob das Vorschaubild wirklich lädt; ein blockiertes `<img>` bleibt sichtbar. Wer `data:` später streicht, macht die Vorschau stumm kaputt, und kein Test schlägt an. Die Konsolenprüfung des Aufrufers war ein einmaliger Lauf. |

Keine Blocker, keine Major.

Geprüft:
- `script-src` in mode `auto` blockiert eingeschleuste Skripte. `src/app.html` hat kein Inline-Skript, es gibt kein `{@html}`, keine Inline-Event-Handler, keine `src/error.html` und keine vorgerenderte Seite.
- Der Browser lädt nichts von fremden Origins:
  - Alle Backend- und Google-/Microsoft-/geo.admin-Aufrufe laufen auf dem Server.
  - Im Client gibt es nur `fetch` an dieselbe Origin (`src/lib/api.ts:182`, `Header.svelte:27`).
  - Externe URLs sind nur Links.
- Es gibt kein iframe, kein embed und kein object. Der pdf.js-Worker kommt per `?url` von der eigenen Origin, also gilt `script-src 'self'`.
- `form-action 'self'`: Alle Formulare posten auf Dwello-Actions. Die einzige Weiterleitung nach aussen (`src/routes/auth/login/+server.ts:49`) ist ein GET über einen Link, keine Weiterleitung nach einem Formular-Submit.
- Die PDF-Ablehnung (`src/lib/server/statement.ts:255-280`) kommt aus einer `+server.ts`-Route und bleibt ohne CSP. Das Blob-Link-Ziel (`UploadRowFields.svelte:40,60`) ist eine Navigation.
- Dev-Server/HMR: Der WebSocket läuft auf demselben Host und Port (`vite.config.ts`, kein eigener `hmr`-Port), `'self'` deckt ihn in CSP3 ab.
- Bestehende Header in `src/hooks.server.ts` setzen keine CSP, es gibt also keinen doppelten Header.
- Der neue Test schlägt ohne die Änderung fehl (`csp` wäre `undefined`).
- Ponytail: Der Diff ist minimal, es bleibt kein ungenutzter Code.
- In der Tabellenzeile A2 von `docs/architecture/utility-tree.md:203` stimmen die vier Spalten, und es steht kein `|` im Text.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main`, E2E in Chromium (hydration, authentication, invoice-new, sicherung, documents, statement-detail; 186 bestanden) und die Playwright-Konsolenprüfung von 11 Seiten des Persona-Builds (Header gesendet, keine CSP-Verletzung).
- Nicht geprüft habe ich, ob pdf.js 6.4 im Hauptthread `eval`/`new Function` oder WebAssembly braucht. Ohne `node_modules` war das im Worktree nicht lesbar; ohne `'wasm-unsafe-eval'` würde das in diesem Fall blockiert. Gesucht habe ich in `src/lib/file-pages.ts` und `package.json`. Ob eine PDF-Vorschau unter der CSP rendert, zeigt nur der gemeldete E2E-Lauf von invoice-new, falls dieser ein PDF hochlädt.
- Ob ein Browser ausser Chromium (Firefox, Safari) den HMR-WebSocket unter `default-src 'self'` erlaubt, habe ich nicht geprüft.
