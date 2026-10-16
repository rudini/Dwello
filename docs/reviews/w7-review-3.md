# Code-Review W7, Runde 3 (Abschlussrunde vor dem Push): Delta ca3f3ba..9fabf88

Worktree: `review-w7-code3` (9fabf88). Geprüft habe ich `git diff ca3f3ba 9fabf88 -- src tests`, also zwei Dateien. Den Rest des Deltas habe ich gelesen. Er enthält nur Doku: die Archivierung der Session, den Persona-Bericht `helga-w7-2.md`, `docs/reviews/w7-review-2.md` und die Workflow-Notizen. App-Code ändert er nicht.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-13 | erledigt | tests/e2e/features/contract-detail.feature:88 | Das Szenario prüft jetzt auch den Satz `contracts_delete_billed_drafts`. Der Seed `statements/generate` legt einen Entwurf an. `nennt der Dialog` prüft über `deleteDialogText` mit `toContain`. Ohne die Änderung aus ca3f3ba fehlt der Satz, und die Zeile schlägt fehl |
| C-17 | erledigt | src/__tests__/contract-detail-page.dom.test.ts:615-623 | Die Datei ist Prettier-sauber: `prettier --stdin-filepath` mit dem Repo-Prettier zeigt keinen Unterschied |
| C-14, C-15, C-16, C-18, C-19 | Minor/Nit | siehe Runde 2 | Durch das Delta unverändert, weiter offen bzw. zurückgestellt |
| C-4, C-5, C-6, C-10, C-11 | Minor/Nit | siehe Runde 1 | Durch das Delta unverändert |

Kein Blocker und kein Major offen.

## Nicht bestätigt

- Diese Prüfungen hat der Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt: lint, check, backend type-check, die volle Vitest-Suite (2631), die vollen Backend-Tests (691), E2E contract-detail, contract-edit und statement-detail (78), sowie die axe- und Sprachzeilen (20) auf dem Merge-Kopf 68dfaaf. Den Merge 68dfaaf habe ich nicht angesehen, geprüft habe ich nur 9fabf88.
- Dass die neue Szenariozeile im Browser grün läuft, habe ich nur durch Lesen von Schritt, Frage und Seed bestätigt. E2E habe ich nicht gestartet.
