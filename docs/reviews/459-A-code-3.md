# Code-Review #459 Slice A, Runde 3 (Abschlussrunde)

Bereich: `git diff f5a62e2 d8b1314 -- . ':!docs/reviews' ':!implementation_plan.md' ':!docs/design/personas'` (nur `src/__tests__/tenant-detail-page.dom.test.ts`, +3 Zeilen).

## Status der offenen IDs aus `docs/reviews/459-A-code-2.md`

| ID | Status |
|----|--------|
| C-3 | Behoben. `tenant-detail-page.dom.test.ts:366-368` prüft, dass `aria-describedby` des Knopfs `tenant-former-documents-check` gleich der `id` des Hilfesatzes `tenant-former-documents-check-help` ist. Fehlt das Attribut (`null`) oder zeigt es auf eine andere id, schlägt der Test fehl; der Hilfesatz hat in `TenantDocumentsCard.svelte:91` eine feste id, die Prüfung kann also nicht über zwei leere Werte grün werden. Das Muster entspricht dem bestehenden bei `tenant-export-help`. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine. |

Geprüft: Assertion gegen `TenantDocumentsCard.svelte:91-103` (id des Hilfesatzes, `describedby` am `Button` mit derselben testid); kein fremder Inhalt im Diff.

## Nicht bestätigt

- Roter Lauf ohne `describedby` und grüner Lauf danach: vom Aufrufer gemeldet; nicht wiederholt (beim Lesen schlüssig: ohne Attribut liefert `getAttribute` `null` statt der id).
