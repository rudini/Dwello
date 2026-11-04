# Code review #1094, Runde 2 (Schlussrunde vor dem Push)

Bereich: `git diff 6deeed60f 865389790` (Worktree `review-1094-cr2`, detached bei 865389790). Vorheriger Bericht: `docs/reviews/1094-review-1.md`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-3 | Minor | src/routes/statements/[id]/SendDialog.svelte:133 | Unverändert offen (bewusst belassen): «PDF ansehen» im Versanddialog gibt `list` nicht mit; die Fehlerseite einer inzwischen gelöschten Abrechnung führt von dort zur ungefilterten Liste |

Geschlossen: C-1, C-2

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (433 grün), `bunx vitest run src/__tests__/pdf-refusal.test.ts` (neue Tests rot ohne die Behebung bzw. ohne die Prüfung), `bunx fallow audit` sauber, E2E Chromium statements, statement-detail, invoice-detail, tenant-documents (182 grün). Selbst ausgeführt habe ich nichts.
- Die Beschriftung «Zu den Rechnungen» (`documents_to_invoices`, jetzt im Load statt in der Seite) hat weiterhin keinen Test; das war schon auf dem Basis-Commit so (gesucht in `src/__tests__`, `tests/e2e`), daher kein Befund.

Geprüft: C-1 – `way` im Load nennt die Liste, wenn `back` der Pfad der Liste eines verschwundenen Datensatzes ist, sonst «Zurück»; der Unit-Test (`pdf-refusal.test.ts:105`) fällt ohne die Behebung (`way` fehlt). Die Regel greift auch für die Fehlerseite, die aus der Liste selbst kommt (statements.feature:84, Rechnungsliste): dort heisst der Knopf jetzt ebenfalls nach der Liste statt «Zurück»; das ist zutreffend, nutzt nur bestehende Texte (alle vier `messages/*.json`) und fügt keinen Bedienzustand hinzu. C-2 – der neue Test (`pdf-refusal.test.ts:50`) fällt ohne `startsWith(\`${list}?\`)` für alle drei Werte. Herkunftsprüfung von `back` unverändert (nur herausgezogen nach `own`); `m` in `+page.svelte` weiter benutzt; ponytail-review: nichts zu kürzen.
