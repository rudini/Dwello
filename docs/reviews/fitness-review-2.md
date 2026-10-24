# Code-Review Fitness Functions Phase 2a, Runde 2 (Delta e761305e..dd831384)

## Status der offenen IDs aus Runde 1

| ID | Status | Beleg |
|---|---|---|
| C-1 | beantwortet, mit Rest (siehe C-5) | (a) `tools/fitness/fitness.ts:92-96, 239`: Warnung `technical`, Test `tools/fitness/fitness.test.ts:185-190` (wächst → Warnung, gleich/schrumpft → keine). (b) Grenze der zählenden Regel in `docs/architecture/fitness-functions.md` §5 benannt. |
| C-2 | erledigt | `.github/workflows/ci.yml:171-174`: Upgrade-Schritt nach den Backend-Unit-Tests, `!cancelled()`; vor «Frontend unit tests» steht nur noch `bun install`. |
| C-3 | erledigt | `.github/workflows/ci.yml:337`: `continue-on-error: true` am Job `ci-duration`; kein anderer Job hat ihn in `needs`. |
| C-4 | erledigt | `docs/architecture/fitness-functions.md:20`: `pr-size` läuft auf PR und Push auf `main`. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Minor | tools/fitness/fitness.ts:239; docs/architecture/fitness-functions.md:19, 73 | `technicalAdded` ist die Differenz der Listenlängen. Die Doku sagt aber «**Warnung** bei jedem neuen Eintrag» und «Ein neuer Eintrag erzeugt die Warnung `technical`». Ersetzt ein PR einen Eintrag (Altlast entfernt, neue fachliche Entscheidung als `technical` eingetragen), bleibt die Länge gleich und es kommt keine Warnung. Genau diesen Weg sollte C-1 (a) abdecken. Die Doku ist an dieser Stelle falsch. Abhilfe: Einträge zählen, deren Schlüssel `path\tline` in der Basis fehlt (das `decisionKey`-Muster aus `fitness.ts:130`), oder die Doku auf «wenn die Liste wächst» ändern. Nachweis: In `ratchet.json` den ersten `technical`-Eintrag durch einen erfundenen Eintrag ersetzen und `bun run fitness -- --base origin/main` laufen lassen. Ergebnis: keine Warnung `technical`. |

Geprüft: Diff aller fünf Dateien. Doku-Verweise auf #781/#782 (§3, §4) sind stimmig. `baseRatchet` fehlt → `technicalAdded` 0. Die neue Testzeile schlägt ohne den Guard fehl.

## Nicht bestätigt

- Gemeldet vom Aufrufer, nicht neu ausgeführt: `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run tools/fitness src/__tests__/open-work.test.ts tools/open-work tools/claude-hooks/commit-msg-gate.test.ts`, `bun run fitness -- --base origin/main`, `prettier --check`, lokale Anzeige der Warnung `technical`.
- C-3: `continue-on-error` auf Job-Ebene hält den Workflow-Lauf grün. Ich habe nicht nachgeprüft, ob GitHub den Check «CI duration» am PR trotzdem als fehlgeschlagen (rotes X) zeigt. Nach meiner Kenntnis tut es das bei `continue-on-error` auf Job-Ebene. Auf Schritt-Ebene bliebe der Job grün. Nur in CI zu sehen (Schritt mit `exit 1` versuchsweise). Geprüft habe ich `.github/workflows/ci.yml:330-355`.
- Reihenfolge und `if` der CI-Schritte (C-2) nur gelesen, nicht in CI laufen gesehen.
