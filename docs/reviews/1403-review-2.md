# Code-Review 1403, Runde 2 (Abschlussrunde, Delta d702aced..70ff7679)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-4 | Major | backend/src/services/statement-generation.service.ts:183 | Sichtbare Korrektur ohne Szenario und ohne `No scenario: <reason>`: der Saldo/die Differenz/der offene Betrag, die der Hinweis bei geänderten Rechnungen und «Nicht berichtigen» nennt, ändern sich im Fall «Saldo der Vorperiode nach Versand der nächsten Abrechnung abgeschlossen» |

Geschlossen: keine offenen IDs aus Runde 1 (C-1 abgelehnt, C-2 behoben, C-3 benannt).

## C-4 (Major): Fehlerkorrektur, die der Benutzer sieht, ohne Szenario

Der Commit ändert, was `recalculation()` in diesem Fall liefert: `now.balance`, `now.difference`, `declineCosts` (#546, schon auf `main` im Hinweis und bei «Nicht berichtigen» sichtbar) und `now.open` (#1403, Warnung vor der Mahnung) zählen jetzt den Übertrag von 3.00 mit (310.55 -> 313.55 laut Datenprüfung). Damit ist es eine Fehlerkorrektur, die der Benutzer sieht. `CLAUDE.md`, Workflow 1 und «Done means», verlangen dafür ein Szenario ohne `@wip` in `tests/e2e/features` oder `No scenario: <reason>`. Der Commit fügt kein Szenario hinzu, und die Commit-Nachricht nennt keinen Grund. In `implementation_plan.md` steht ebenfalls keiner, und den Text des Pull Requests kann ich nicht einsehen. Die E2E-Umgebung kann den Zustand herstellen: `statement-minimum-balance.feature:76` baut bereits eine Abrechnung 2024 mit 3.00 und eine Abrechnung 2025 auf. Es fehlt nur die Reihenfolge: 2025 zuerst versenden, dann 2024 abschliessen, danach eine geänderte Rechnung. Zeigen lässt es sich so: `git diff d702aced 70ff7679 -- tests/e2e` ist leer. Behebung: Szenario ergänzen, z. B. in `statement-minimum-balance.feature`. Weil der pg-Test rot gesehen wurde, braucht es keinen eigenen Rotlauf. Alternativ den Grund als `No scenario: …` in den Pull Request schreiben.

## Nicht bestätigt

- Backend-type-check, pg-Test zuerst rot (Expected 103.00, Received 100.00), volles `bun run test` (2303 pass, 97.5 % Zeilen), lint, check, fitness, vitest --changed, Regeltests: vom Aufrufer gemeldet.
- E2E von `statement-minimum-balance.feature` und `dashboard.feature`: laufen laut Aufrufer noch, kein Ergebnis gemeldet.
- Ob Elysia (^1.4.30, Normalisierung voreingestellt) das Feld `replacing` aus dem Body von `/preview` und `/generate` entfernt: `calculationBody` (routes/statements.ts:34) führt es nicht. Würde es durchgereicht, verschöbe ein Client nur seine eigene Vorschau. Der Wert ist als `::uuid` gebunden, also keine Injection. Die Laufzeit-Konfiguration von Elysia habe ich nicht geprüft.
- Ein «Nicht berichtigen», das vor diesem Commit für eine betroffene Abrechnung gespeichert wurde, passt nicht mehr zum neuen `result`, und der Hinweis erscheint wieder. Nur gelesen. Das ist fachlich wohl gewollt, weil die Berichtigung tatsächlich anders rechnet.

Geprüft: SQL-Zusammensetzung von `unreachableOf` (Teile aus `sql.raw` mit unverändertem Text, `replacing` als gebundener Parameter, `null::uuid` als Standardwert, also unverändert für `openCarry`, `openCarryOvers` und `carryChanged`), `generateStatement` und die berichtigte Abrechnung (die ersetzte Abrechnung ist `replaced` und ohnehin ausgeschlossen), `recalculateStatement` eines Entwurfs (`draft` ist ohnehin ausgeschlossen, also keine Änderung), `correctionDue` (setzt weiterhin eine geänderte Rechnung, einen geänderten Tankbestand oder einen Schlüssel voraus; ein Übertrag allein löst keinen Hinweis aus), neuer pg-Test (würde ohne die Änderung rot, prüft `carriedFrom` und den Betrag).
