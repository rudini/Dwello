# Review 746, Runde 2 (Delta e229395d..e75ea126)

Geschlossen: C-1, C-3, C-5, C-7

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Minor | tests/e2e/tasks/audit-log.ts:11-16 | `throughAuditPages` blättert mit Offset, während parallele Szenarien oben neue Einträge schreiben. Zwischen zwei Seitenaufrufen rutschen dann die untersten Einträge einer Seite oben auf die nächste und werden zweimal gezählt. Steht dort ein Export von heute, zählt «vorher» zu viel. «Nachher» kann dann gleich gross sein, und `toBeGreaterThan` schlägt fehl. Auf `main` war das Zählen ein einziger Seitenaufruf. Das Fenster ist klein (es braucht einen Export genau an einer Seitengrenze), deshalb Minor wie C-2 |
| C-9 | Minor | src/__tests__/audit-log-actions.test.ts:79 | Der neue Test baut die Backend-Antwort von Hand (`{ data: [], total: 6 }`) und nimmt sie nicht aus `tests/contracts/audit-log.json` (CLAUDE.md, Gotchas, «API contracts»). Mit dem Vertrag wäre das `{ ...auditLog, data: [] }` |

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run` (230 Dateien, 4818 Tests), E2E chromium `-g "audit-log |Einstellungen|Alle Daten exportieren"` (91 bestanden, darin die axe- und Sprachzeilen `paged` und `paged-older`, settings.feature und datenexport.feature).
- Ob der neue Test zu C-3 zuerst rot war: nach dem Lesen ja. Ohne die Weiterleitung gibt `load` Daten zurück, und `rejects` schlägt fehl. Ausgeführt habe ich ihn nicht.
- C-1 gilt als Testkorrektur, die beibehaltenes Verhalten festhält, und braucht deshalb keinen roten Lauf (so steht es in der Commit-Nachricht). Der Schritt zählt wieder über das ganze Protokoll wie auf `main` (27f55a16, dort eine einzige Seite) und prüft nicht weniger. Gelesen, nicht ausgeführt.
- Ob ein ganzer paralleler Lauf C-8 tatsächlich auslöst: nicht gemessen.

Geprüft: Weiterleitung hinter der letzten Seite (+page.server.ts:17, `redirect` importiert); Re-Export `nextPageLink` und neues Ziel `previousPageLink`; Zustand `paged-older` (Klick und Warten auf «Vorherige Seite»), `stateMeanings`, Zeilen in beiden a11y-Features, Seeding mit `startsWith('paged')` (kein anderer Zustand beginnt mit `paged`); `auditEntryCountOn` entfernt, ohne dass noch etwas darauf verweist; der Schritt ruft nur Tasks und Questions auf.
