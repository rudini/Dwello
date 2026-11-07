# Code-Review #1195, Slice 1, Runde 1

Bereich: `git diff 33ca44a f37071e` (Worktree review-1195-code, f37071e).

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine Befunde |

Geprüft: `InvoiceCategoryFields.svelte:139` zeigt `reasonOf(selectedCategory)`, sonst den neuen allgemeinen Satz. Das gilt für Neue Rechnung, Rechnung bearbeiten und den Upload-Dialog, denn alle drei bekommen die Kategorien aus `invoiceChoices` → `localCategory` → `toCategory`, und dieser Mapper setzt `key` und `predefined`. Eine vordefinierte Kategorie mit geänderter Umlagefähigkeit hat keinen Grund. Das deckt `reasonOf` ab (getestet in `categories-page.dom.test.ts:788`). Der neue Satz steht wörtlich wie in V-1 in allen vier `messages/*.json`, und der Schlüssel wird sonst nirgends gebraucht.

Zum Typ: `Category` deklariert `key` und `predefined` nicht. Weil `Shown` beide optional hat, prüft der Typ hier nichts. Im Moment verbirgt das keinen Fehler: Der DOM-Test liefert die beiden Felder ausdrücklich mit, und das E2E-Szenario prüft den echten Datenweg. Darum ist es vertretbar und kein Befund.

Rot ohne die Änderung: Der neue DOM-Test (Begründung «Reparaturen») und das Szenario «Nicht umlagefähige Kategorie wählen» schlagen fehl, denn sie prüfen den Text jetzt exakt statt nur einen Teil davon. Das Szenario «Nicht umlagefähige eigene Kategorie wählen» hält gleichbleibendes Verhalten fest, und der Commit a3c6e84 nennt das in seiner Nachricht.

Das Szenario auf `main` ist geändert, aber strenger (exakt statt `toContain`), und `Spec change approved: #1195` steht in der Commit-Nachricht. Den Schritt von #687 gibt es auf `main` noch nicht, er ist also frei änderbar. Kein anderes Feature nutzt die alten Schritte. Die Schritte rufen nur Fragen und Tasks auf, und für die Isolation läuft der Kategoriename über `names`. Neue Bildschirme oder Zustände gibt es nicht. Die Diff enthält nichts, was nicht zur Anforderung gehört.

## Nicht bestätigt

- Die folgenden Prüfungen hat der Aufrufer gemeldet, ich habe sie nicht selbst ausgeführt. Alle waren laut ihm grün:
  - `bun run lint`, `bun run check` und `bun run fitness` (vom Aufrufer gemeldet)
  - `cd backend && bun run type-check` (vom Aufrufer gemeldet)
  - `bunx vitest run --changed origin/main` sowie die Tests design-guard, open-work und i18n (vom Aufrufer gemeldet)
  - E2E auf Chromium für die Features invoice-new, invoice-edit, invoices, invoice-detail und categories, dazu die axe- und Sprachzeilen von invoice-new und invoice-edit (vom Aufrufer gemeldet)
- Dass der DOM-Test und das E2E-Szenario vor dem Code rot waren, meldet der Aufrufer. Ich habe es nur beim Lesen nachvollzogen.
