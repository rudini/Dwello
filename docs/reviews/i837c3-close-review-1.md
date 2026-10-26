# Closing review i837c3-close, Runde 1 (3a418f64..e51996a9)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine Befunde |

Geprüft: `src/__tests__/no-german-in-code.test.ts:53`. Der Eintrag in der Allowlist ist die richtige Korrektur. `'beleg'` in `src/lib/types.ts:228` ist der Feldname der Backend-API (`backend/src/api/invoice.ts:24`), kein UI-Text. Jede Typform, die das Feld aus `ApiInvoice` bezieht (`Pick<…, 'beleg'>`, `ApiInvoice['beleg']`, `Omit`), braucht das Wort als String-Literal, und `texts()` liest jedes String-Literal im Code. Den Literal vermeiden ginge nur mit einem wieder von Hand deklarierten Feld, also genau der Kopie, die Zyklus 3 entfernt hat. Der Kommentar folgt der Konvention der Datei (Herkunft wie bei «contract status of the API», Issue-Verweis wie bei #101) und nennt dasselbe Issue #233 wie der Kommentar an `types.ts:228`. Die Allowlist greift pro Datei wie die übrigen Einträge, eine engere Prüfung gibt es dort nicht. Der Diff enthält keine Änderung ausserhalb der Anforderung. Commit-Subject: 46 Zeichen, Typ und Scope gültig.

## Nicht bestätigt

- Der Rot-Lauf auf 3a418f64, der Grün-Lauf auf e51996a9 (418 Tests), `bun run test:coverage` (3694) und das Backend-`bun run test` (1644): vom Aufrufer gemeldet. Mein erneuter Lauf von `bunx vitest run src/__tests__/no-german-in-code.test.ts` im Review-Worktree ist mit `ERR_MODULE_NOT_FOUND` abgebrochen: Der Worktree hat kein `node_modules`, und das `node_modules` des Haupt-Checkouts ist per Deny-Regel gesperrt.
