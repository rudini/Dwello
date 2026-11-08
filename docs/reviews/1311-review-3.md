# Code-Review #1311 / #1312, Runde 3 (Delta 90b2374..ad6009d)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-5 | Minor | Commit 49e9783 (Message) | Weiterhin offen: Keine Commit-Message nennt das Szenario «Vor dem Tag steht die aufgehobene Wohnung noch leer» als Pin, auch ad6009d nicht. Einen Pull-Request-Text gibt es noch nicht. |

Geschlossen: C-6, C-7, C-8, C-9.

## Nicht bestätigt

- Vom Aufrufer gemeldet: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`, die Backend-pg-Tests apartment-status, dashboard und api-contracts (142), E2E chromium+api von dashboard.feature (54), die axe- und Sprachzeilen dashboard default, old-address-task und discontinued-figure (6). Ebenso der Rot-Lauf des C-8-pg-Tests (44.4 statt 50) und der DOM-Test aus c348f7e, der laut Aufrufer für die neue Szenariozeile von C-6 rot war.
- Ob die Zeile «Und erklärt die Übersicht bei den Kennzahlen "Aufgehoben" …» ohne die Änderung rot wird, habe ich nur durch Lesen geprüft. `statusExplained("Aufgehoben")` liest `stat-help-discontinued`, und das gibt es nur bei `discontinuedApartments > 0` (BuildingFigures.svelte:64). Gelaufen ist dieser Fall nicht.

Geprüft: C-6: Die Szenariozeile prüft Begriff und Erklärung. Der Text stimmt wörtlich mit `apartments_status_help_discontinued` (messages/de.json:255) überein. Der Eintrag in `statuses` ändert auch `statusFilterShown` stimmig. Die Begründung, im Grundriss auf `main` keine Beispielzeile anzulegen, hält: Dessen Grundlage hat keine aufgehobene Wohnung. C-7: `discontinued-figure` ist in `seedFor` aufgenommen, wo Ahornweg 8.01 ab 2026-01-01 aufgehoben ist. Dazu gibt es die stateMeaning, je eine Zeile in beiden Features und das Warten auf die übersetzte Erklärung über `say`. C-8: `occupancyRate` teilt durch `countApartments(existing)`, passend zur Belegung und zu docs/api-specification.md:75. Der pg-Test ist ohne die Änderung rot, weil 1.11 aufgehoben und `rental.apartment` vermietet ist. Der Filtertest prüft wegen 1.11 jetzt richtig mit «enthält und alle aufgehoben». C-9: Der Kommentar stimmt jetzt. ponytail-review: nichts Unbenutztes und keine fremden Änderungen im Delta.
