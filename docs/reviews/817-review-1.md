# Code-Review 817, Runde 1 (6a096f1..ea476e3)

| ID | Schwere | Ort | Befund |
|---|---|---|---|
| C-1 | Major | backend/src/routes/mcp.ts:26-31, 40-90 | Die Listen-Werkzeuge geben nur die erste Seite der API zurück (Gebäude, Rechnungen, Abrechnungen 20; Wohnungen, Mieter, Mietverträge 50). Sie kennen weder `limit` noch `offset`, `additionalProperties: false` sperrt beides, und `query()` gibt nur die genannten Filter weiter. «Rechnungen nach Gebäude und Abrechnungsperiode» ist damit ab der 21. Rechnung unvollständig, und das KI-Programm kann die übrigen nicht abrufen |
| C-2 | Major | src/routes/config/access-keys/+page.server.ts:36, 44; tests/a11y/screens.json:796-804 | Es gibt keine Szenarien, keine Zeilen in a11y und Sprachen und keinen Test für die Ablehnungen im Dialog: ein leerer Name (`backend_access_key_name_missing`), «nicht erstellt» und «nicht widerrufen». Auch die Aktionen `create` und `revoke` sind nicht getestet (Fallback-Text, 404 gilt als erledigt) |
| C-3 | Major | src/routes/config/access-keys/+page.svelte:19, 109 | Die Erfolgsmeldung nach dem Widerrufen nennt keinen Namen («Zugangsschlüssel «» widerrufen»). `ActionDialog` setzt zuerst `open = false` (ActionDialog.svelte:67), das setzt `toRevoke = null`; erst danach liest `onsuccess` `revoking.name`, und das ist inzwischen der leere Ersatzwert |
| C-4 | Minor | tests/e2e/screenplay/abilities.ts:57 | `CallTheMcp` ruft das Backend direkt auf (Port 3101). Die Szenarien prüfen also nicht den Weg, den ein KI-Programm wirklich nimmt: über `/mcp` der Web-App, also Hooks und Weiterleitung (ADR 0007, Punkt 4). Diesen Weg zeigen nur Unit-Tests mit gestubbtem `fetch` |
| C-5 | Minor | backend/src/routes/mcp.ts:84-87 | Das Werkzeug `statements` mit `id` (Abrechnung mit Mahnungen und Mahnstufe) hat keinen Test. Die Zeile der Anforderung «statements and reminders with … Mahnstufe» und der Zweig, der mehrere Antworten zusammenführt (Zeilen 113-118), sind ungeprüft |
| C-6 | Minor | backend/src/routes/mcp.ts:82 | Die Beschreibung von `status` nennt nur «draft, sent, paid oder overdue». Die gespeicherten Status `settled` (#448) und `replaced` (schema.ts:95) fehlen, deshalb erfragt das KI-Programm abgerechnete oder ersetzte Abrechnungen nicht |
| C-7 | Minor | backend/src/services/contract.service.ts:54 (über mcp.ts, Werkzeug `contracts`) | «Keine Dateien» setzt der Code nicht durch. Die Antworten von `GET /contracts` und `GET /contracts/:id` enthalten `contractPdf` («Base64 or URL», schema.ts:156). Ein Mietvertrag, dessen PDF über die API gesetzt wurde, geht so über das MCP hinaus. Ein Test, der «keine Dateien» prüft, fehlt |
| C-8 | Minor | backend/src/routes/access-keys.ts:23; src/routes/config/access-keys/+page.svelte (TextInput ohne `maxlength`) | Ein Name mit mehr als 100 Zeichen wird mit `VALIDATION_ERROR` abgelehnt. Die Seite sagt dann nur allgemein «nicht erstellt» und nicht, dass der Name zu lang ist; das Feld begrenzt die Länge nicht |
| C-9 | Minor | docs/architecture/adr/0007-zugangsschluessel-fuer-ki-programme.md:16 | Das ADR nennt den MCP-Server unter `backend/src/mcp/`; der Code liegt in `backend/src/routes/mcp.ts` |
| C-10 | Minor | UBIQUITOUS_LANGUAGE.md:262 | Die neue Zeile hat drei Zellen («\| `access_keys` Tabelle \|»), die Tabelle aber nur zwei Spalten (Begriff, Definition) |

## C-1 (Major): MCP-Listen abgeschnitten

**Warum falsch:** #817, «Done means», verlangt «invoices by building and period with category and allocability» und Listen von Stammdaten und Abrechnungen. `listInvoices` (invoice.service.ts:102) und `listStatements` (statement.service.ts:139) geben ohne `limit` 20 Einträge zurück, `listBuildings` ebenfalls 20, Wohnungen, Mieter und Mietverträge 50. Ein Werkzeug kann `limit` und `offset` nicht weitergeben. Ein KI-Programm, das die Heizkosten einer Periode zusammenzählt, rechnet so mit 20 von N Rechnungen. Die Antwort enthält zwar `total`, das Programm kommt aber an den Rest nicht heran. Die UI hat dieses Problem nicht: Sie blättert oder fragt mit eigenem `limit`.

**Zeigen:** Im `access-key.pg.test.ts` 21 Rechnungen für ein Gebäude in einer Periode anlegen und dann `callTool(key, 'invoices', { buildingId, periodStart, periodEnd })` aufrufen. `dataOf(result).data.data.length` ist 20, `total` ist 21, und kein Argument liefert die 21. Rechnung.

## C-2 (Major): Ablehnungen auf der Seite ohne Szenario und ohne Test

**Warum falsch:** `CLAUDE.md`, Workflow 1, und `tests/e2e/CLAUDE.md`, «Rules» (failure states), verlangen ein Szenario auch für einen Zustand, den nur eine fehlschlagende Anfrage erreicht. Hier gibt es drei solche Zustände:
- Leerer Name: Der Dialog sendet ihn ab (kein `check`, kein `disabled`), das Backend lehnt mit `ACCESS_KEY_NAME_MISSING` ab, und der Dialog zeigt `backend_access_key_name_missing`. Das lässt sich ohne Mock im E2E erreichen.
- «Nicht erstellt» und «nicht widerrufen»: erreichbar mit `FailRequests.to('/config/access-keys', { '/create': '' })` bzw. `'/revoke'`.

Keiner dieser Zustände hat ein Szenario oder eine Zeile in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` (CLAUDE.md, «Design-Regeln», Process). Es gibt auch keinen Test der Aktionen in `+page.server.ts`.

**Zeigen:** `grep -rn "name_missing\|not_created\|not_revoked\|createError\|revokeError" tests src/__tests__` findet nichts. Würde man in `+page.server.ts:43` die Ausnahme für 404 entfernen, bliebe jeder Test grün.

## C-3 (Major): Erfolgsmeldung nach dem Widerrufen ohne Namen

**Warum falsch:** Das Callback in `ActionDialog.svelte:66-68` führt zuerst `open = false` und dann `onsuccess?.()` aus. `open` ist mit Getter und Setter an die Seite gebunden (`+page.svelte:96-101`). Deshalb setzt die Zuweisung sofort `toRevoke = null`. Das `$derived` `revoking` fällt danach auf `{ name: '' }` zurück, und die Meldung lautet bei jedem Widerrufen «Zugangsschlüssel «» widerrufen». Kein Test prüft die Meldung: Der DOM-Test bestätigt nicht, das Szenario prüft nur die Liste.

**Zeigen:** Im DOM-Test die Form-Aktion mit Erfolg auflösen lassen (oder `addToast` mocken), widerrufen und bestätigen. `addToast` wird dann mit `'Zugangsschlüssel «» widerrufen'` aufgerufen. Abhilfe: den Namen vor dem Schliessen merken oder `name` im `onsuccess` aus `form` lesen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `cd backend && bun run test` (1702 pass, 96.6 % Zeilen), `bunx vitest run --changed origin/main` (623 pass), open-work-, backend-codes- und i18n-Tests, E2E chromium+api für zugangsschluessel, privacy, terms und settings (vor dem letzten Refactoring von LegalHeader und AccessKeyRow), axe- und Sprachzeilen von access-keys, config, privacy, terms und audit-log (28 passed), Prettier auf den neuen Dateien, fallow audit.
- Dass jede neue Prüfung rot war, belegt nur die Commit-Nachricht von ea476e3. Beim Lesen fällt jede neue Prüfung ohne die Änderung durch; das gilt auch für den geänderten DOM-Test der Datenschutzerklärung und für `/mcp` in `auth-guard.test.ts`.
- Dass Svelte den Setter einer Funktionsbindung synchron aufruft (Grundlage von C-3), habe ich aus der Bindungssemantik von Svelte 5 gelesen und nicht ausgeführt.
- Wortlaut und Fachlichkeit der Texte, die keine Fachprüfung gesehen hat (`ai_keys_address`, `ai_keys_link`, `ai_keys_revoke_label`, `ai_keys_not_created`, `ai_keys_not_revoked`, `backend_access_key_name_missing`), und «disattivare» im Italienischen: Das ist Sache von `fach-reviewer` und Personas. Gelesen habe ich nur, dass jeder neue Schlüssel in allen vier `messages/*.json` steht.
- Wie das Protokoll ein `mcp_call` mit einem unbekannten `tool` zeigt (`KINDS[...]()` wirft dann einen Fehler): Das Backend schreibt nur bekannte Werkzeuge ins Protokoll (mcp.ts:153). Ich habe es nicht als Befund geführt.
- Ob echte MCP-Clients (Claude Desktop, mcp-remote) mit 401 ohne `WWW-Authenticate` und mit 405 auf GET zurechtkommen: nicht geprüft. Gelesen habe ich nur `src/routes/mcp/+server.ts` und `mcp-proxy.test.ts`.

Geprüft: Hash und einmalige Anzeige; Ablauf nach Schweizer Kalendertag einschliesslich des letzten Tags; einmaliger Eintrag des Ablaufs mit dem Zeitpunkt (das `UPDATE … RETURNING` ist nebenläufig sicher); Schlüssel nur an `/mcp`, Sitzung dort abgelehnt; JWT nur im Prozess, nur GET-Pfade, IDs mit `encodeURIComponent`; Protokoll ohne Inhalte; Weiterleitung ohne Cookie; Szenarien `privacy.feature:43` und `terms.feature:30` unverändert (die alten Sätze stehen noch im Text); Stand 20.10.2026 unverändert; Verträge und `api-contracts`-Test; Screenplay-Schichten; LegalHeader und die entfernten ungenutzten Exporte in `auth.ts` als kleine Korrekturen aus den Commit-Gates ohne Verhaltensänderung; Glossar und i18n-begriffe.
