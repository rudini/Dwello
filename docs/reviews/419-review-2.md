# Review 419, Runde 2 (Abschlussrunde PR #421): KI-Wartezeit 120 s / BFF 300 s

Geprüft: `git diff be454eb6 21a6515b -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/archive'` im Worktree `review-419-code2` (detached, 21a6515b). Alle 7 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | PR #421 (Beschreibung), `tests/e2e/features/` | Sichtbare Fehlerbehebung (`fix(config)`: Kategorisieren schlug nach 30 s fehl) ohne Szenario; das «No scenario» der PR («configuration and docs only; no behaviour of the app a test can show») stimmt für diesen Slice nicht mehr, und der KI-Platzhalter des E2E-Stacks kann den Zustand erzeugen (`delay`). |
| C-2 | Minor | `backend/scripts/llm-stub.ts:24-25` | Kommentar «25 s, below the backend's LLM_TIMEOUT of 30 s» ist durch den Slice veraltet (jetzt 120 s). |
| C-3 | Nit | `tests/unit/api-proxy.test.ts:205` | Testname «wartet bei GET /invoices auf die KI so lange, wie sie braucht (30000 ms)» ist für die zwei 30-s-Zeilen falsch: dort wartet niemand auf die KI. Besser zwei Namen oder neutral «bricht bei %s %s nach %i ms ab». |
| C-4 | Nit | `src/lib/server/api-proxy.ts:50-51` | `KI_TIMEOUT` fest 300 s: ein Betreiber, der `LLM_TIMEOUT` über 150 s setzt, wird beim Auslesen (zwei KI-Aufrufe) vom BFF abgebrochen; ein `BACKEND_API_TIMEOUT` über 300 s gilt für KI-Pfade nicht. Doku (`docs/tech-stack.md`) nennt die 300 s, `.env.example` (`BACKEND_API_TIMEOUT=30000`) sagt nicht, dass KI-Anfragen ausgenommen sind. Für ein MVP vertretbar. |
| C-5 | Nit | `src/lib/server/api-proxy.ts:118-120` | ponytail `shrink:` `method.toUpperCase()` wird in `forwardRequest` dreimal berechnet; eine lokale Konstante genügt. Sonst: Lean already. |
| C-6 | Nit | `backend/src/__tests__/llm-recipient.test.ts:40-52` | Test der Wartezeit liegt in der Datei «Empfänger der Rechnungsdaten» (`llm-recipient`); passt fachlich eher in einen eigenen Test zur `llmConfig`. Kein Defekt. |

## C-1 (Major): Sichtbare Fehlerbehebung ohne Szenario

**Warum falsch:** `CLAUDE.md`, Workflow 1: jede für den Benutzer sichtbare Fehlerbehebung beginnt mit einem Szenario; `No scenario: <reason>` nur, wenn der E2E-Stack den Zustand nicht erzeugen kann. Der Slice behebt, dass Kategorisieren und Auslesen auf einem Server ohne GPU abbrechen (Commit-Typ `fix`, Anforderung: «the old 30 s timeout made categorization fail»). Der KI-Platzhalter `backend/scripts/llm-stub.ts` kann Antworten verzögern (`delay`, Zeile 20/30/101; bestehend: «langsam» mit 25 s). Eine Antwort mit z. B. 35 s Verzögerung auf `/invoices/categorize` oder `/invoices/:id/recategorize` zeigt den Unterschied: auf be454eb6 bricht das Backend nach 30 s ab (`llm.service.ts:78`), und der BFF nach 30 s (`api-proxy.ts`, alter Code), der Verwalter sieht «Die KI ist nicht erreichbar …»; auf 21a6515b erscheint der Vorschlag. Die PR-Beschreibung von #421 sagt weiterhin «No scenario: configuration and docs only» und erwähnt die Timeout-Änderung nicht.

**Wie zeigen:** Szenario (z. B. in `invoice-detail.feature`: «Die KI braucht über eine halbe Minute» → Neu kategorisieren → Vorschlag erscheint) mit einer Platzhalter-Antwort von ~35 s und erhöhtem Testtimeout; auf be454eb6 rot, auf 21a6515b grün. Alternative, falls die Laufzeit (~35 s pro Lauf) nicht tragbar ist: PR-Beschreibung um eine zutreffende Begründung `No scenario: <reason>` ergänzen (z. B. E2E-Laufzeit; Abdeckung durch `tests/unit/api-proxy.test.ts` und `llm-recipient.test.ts`) — das ist dann eine bewusste Entscheidung, die genannt sein muss. In beiden Fällen die PR-Beschreibung um die Timeout-Änderung ergänzen.

## Bestätigt

- **Backend-Standard 120 s:** `backend/src/config/llm.ts:25` `'120000'`; `llm.service.ts:78` nutzt `llmConfig.timeout` je KI-Aufruf. Test `llm-recipient.test.ts:41-51` lädt die Konfiguration ohne `LLM_TIMEOUT` neu und erwartet 120 000; mit `'30000'` rot (gelesen). Selbst ausgeführt: 5 pass.
- **BFF-Pfade, die auf die KI warten** (alle über `forwardRequest`, POST):
  - `/invoices` (JSON und Multipart des Uploads, `src/routes/api/invoices/+server.ts:36-46`; Backend `createInvoice` ruft `categorizeWithKi` ohne Kategorie, `invoice.service.ts:252`), Aufrufer `invoices/new/+page.svelte:100`, `InvoiceUploadDialog.svelte:171`;
  - `/invoices/extract` (`routes/api/invoices/extract/+server.ts:18`; Backend `extractFromFile` = Auslesen + Kategorisieren, zwei Aufrufe ≤ 240 s < 300 s);
  - `/invoices/categorize` (`routes/api/invoices/categorize/+server.ts:19`);
  - `/invoices/:id/recategorize` (`routes/api/invoices/[id]/recategorize/+server.ts:17`).
  - Regex `^\/invoices(\/extract|\/categorize|\/[^/]+\/recategorize)?$` trifft genau diese vier; Test `api-proxy.test.ts:198-215` deckt alle vier plus GET `/invoices` und POST `/buildings` (30 s); mit dem alten Code für die vier KI-Zeilen rot (gelesen). Selbst ausgeführt: 44 pass.
- **«Von der KI prüfen lassen»** (`src/lib/server/category.ts:110`, Action `config/categories/new/+page.server.ts:8`): SvelteKit-`fetch` über `handleFetch` (`hooks.server.ts:55-61`) ohne Abbruchsignal; Node 20 (`Dockerfile`, `node build`) wartet bis zum undici-`headersTimeout` von 300 s, also länger als die 120 s des Backends. Kein BFF-Eingriff nötig.
- **Keine anderen KI-Aufrufer:** Backend-Routen mit KI nur `categories.ts:70` (`/propose`) und `invoices.ts` (`/categorize`, `/extract`, `/:id/recategorize`, POST `/`); PUT `/invoices/:id` und PUT `/invoices/:id/document` rufen keine KI (`invoice.service.ts:284-330`). Clientseitig (`src/lib/api.ts`, Upload-Dialog, Kategorieformular) kein Abbruch durch Zeitlimit.
- **Nichts anderes verlangsamt:** Nur die vier POST-Pfade bekommen 300 s; alle übrigen Anfragen behalten `getBackendTimeout()` (30 s). POST `/invoices` mit gesetzter Kategorie ruft keine KI, hat nur eine höhere Obergrenze, wird aber nicht langsamer.
- **Bun-Leerlaufzeit des Backends:** `app.listen` ohne `idleTimeout` (`backend/src/index.ts:20`); mit Bun 1.4.2 im Scratchpad geprüft, dass ein Elysia-Handler mit 14 s Wartezeit nicht nach Buns Standard-Leerlauf von 10 s abgebrochen wird (Status 200 nach 14 s).
- **Doku:** `.env.example:64`, `README.md:305`, `docs/tech-stack.md:272` nennen 120 000 ms und die CPU-Messwerte; tech-stack nennt die 300 s des BFF.
- **Konventionen:** keine UI-Texte, keine neuen Bildschirme, keine API-Antwort geändert (keine Verträge betroffen), keine fachfremden Änderungen im Diff.
- **Ponytail:** `KI_PATH` + `KI_TIMEOUT` sind minimal; einzig C-5. net: -1 line possible.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, Backend-`bun test` von `llm-prompt` und `llm-extraction`, volle `bunx vitest run` (3030 pass): vom Aufrufer gemeldet. Selbst wiederholt nur `bunx vitest run tests/unit/api-proxy.test.ts` (44 pass) und `bun test src/__tests__/llm-recipient.test.ts` (5 pass).
- Rot-Sehen der neuen Tests nur durch Lesen beurteilt (alter Code liefert 30 000 für alle Pfade bzw. als Standard), nicht durch Zurücknehmen der Änderung.
- Ende-zu-Ende-Verhalten mit echtem langsamem Modell (37–90 s) nicht geprüft; ein Reverse-Proxy vor dem Frontend: `deploy/demo/Caddyfile` (`reverse_proxy` ohne Lese-Zeitlimit) gelesen, der auskommentierte nginx in `docker-compose.prod.yml:118-130` hat keine `nginx.conf` im Repo (nginx-Standard `proxy_read_timeout` 60 s würde das Auslesen abbrechen, betrifft aber nur eine optionale, nicht ausgelieferte Konfiguration).
- `docker-compose.prod.yml` reicht `LLM_TIMEOUT` und `BACKEND_API_TIMEOUT` nicht in die Container durch (bestand schon vorher); der Standard 120 s greift dort, ein Wert aus `.env` würde aber ignoriert. Nicht Teil des Slices.
