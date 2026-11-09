# Code-Review 1409-5: Fixes aus der Fallback-Review von PR #1421 (f5c4283e..cebe0f0f)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | tests/e2e/features/analytics.feature; Commit cebe0f0f | Die zwei Fixes, die man sieht: der Hinweis `analytics_utility_outside`, wenn «Abgerechnet bis» nach dem Periodenende liegt, und der Apostroph vor einem Namen, der wie eine Formel aussieht, in der CSV. Für beide gibt es weder ein Szenario noch `No scenario: <Grund>`. |
| C-2 | Minor | backend/src/services/annual-report.service.ts:105-117 | `billedOutside` prüft das Vertragsende nicht. `checkBilledUntil` begrenzt «Abgerechnet bis» nicht durch `endDate`. Ein Vertrag, der vor der Periode endet und dessen «Abgerechnet bis» in oder nach der Periode liegt, zeigt den Hinweis deshalb, obwohl er keinen Tag in der Periode hat. Der Fix vergrössert diesen Fall: Vorher zählte nur ein Datum innerhalb der Periode, jetzt jedes Datum ab ihrem Beginn. Der Doc-Kommentar («a contract of the building in the period») sagt etwas Falsches. |
| C-3 | Minor | backend/src/services/annual-report.service.ts:116; backend/src/__tests__/annual-report.pg.test.ts:282-296 | Die neue Bedingung `lte(rentalContracts.startDate, period.end)` hat keinen Test. Nimmt man sie heraus, bleiben alle Tests grün. Ein Vertrag, der erst nach der Periode beginnt und ein «Abgerechnet bis» hat, würde dann den Hinweis für die Vorperiode auslösen. Vorher war das durch `billedUntil <= period.end` (und `billedUntil >= startDate`) gedeckt. |

## C-1 (Major): Für die sichtbaren Fixes fehlt ein Szenario

CLAUDE.md, Workflow 1 und «Done means», verlangt für eine Verhaltensänderung, die der Benutzer sieht, ein Szenario in `tests/e2e/features` oder im PR `No scenario: <Grund>`. In `analytics.feature` prüft kein Szenario den Hinweis «ausserhalb von Dwello abgerechnet» (grep «ausserhalb», «Abgerechnet» in analytics.feature und in den annual-report-Steps/Tasks: keine Treffer). Kein Szenario prüft die Formel-Sicherung der CSV. Die Commit-Nachricht nennt keinen Grund für «No scenario». Die E2E-Umgebung kann beide Zustände herstellen:
- (1) ein eigenes Gebäude mit einem Mietvertrag, dessen «Abgerechnet bis» nach dem Periodenende liegt; Hinweis auf der Seite oder in der CSV;
- (3) eine eigene Kategorie, deren Name mit «=» beginnt, und eine nicht umlagefähige Rechnung; CSV-Zeile.

Für (3) kann ein globaler Kategoriename andere Szenarien stören (Isolation). Das wäre ein Grund für `No scenario`, aber nur, wenn der PR ihn nennt.

So zeigt man es: `grep -n "ausserhalb\|Formel\|'=" tests/e2e/features/analytics.feature` findet nichts. `git log -1 --format=%B cebe0f0f` enthält kein «No scenario».

Geschlossen: keine (erste Runde dieses Slices).

Geprüft: Die Ablehnung von Punkt (2) hält. `ensureNameIsFree` vergleicht `name` und `nameDE` ohne Gross-/Kleinschreibung (`ilike`) mit den bestehenden Namen. Eine vordefinierte Kategorie behält ihren Schlüssel `name` (`updateCategory`). Weiter geprüft:
- `text()` lässt leere Strings, Beträge und negative Beträge unverändert;
- der CSV-Test wäre ohne den Fix rot;
- der pg-Test mit «Abgerechnet bis» 2026-01-31 wäre auf der Basis rot (`lte(billedUntil, period.end)`);
- `t.Integer` behält Minimum und Maximum, und der Test mit 2025.5 wäre auf der Basis rot (Wert erreicht den Service);
- die BFF macht aus 422 die vorhandene 404-Seite;
- das Neuformatieren des Inserts im pg-Test gehört zu einer Datei, die in diesem PR neu ist (CI prüft sie mit Prettier);
- Kontrakt `report-annual.json` unverändert, die Antwort ist gleich geblieben.

## Nicht bestätigt

- bun run lint, cd backend && bun run type-check, bun run fitness -- --base origin/main --structure, bunx vitest run src/__tests__/annual-report.test.ts (12 bestanden), cd backend && bun test annual-report.pg.test.ts (15 bestanden), die Rot-Läufe der drei neuen Tests, CI grün auf f5c4283e: vom Aufrufer gemeldet.
- Dass Elysia 1.4 `t.Integer` in der Query aus dem String umwandelt (sonst würde jedes Jahr abgelehnt): nur aus dem gemeldeten grünen pg-Lauf geschlossen, der gültige Jahre abfragt. Andere Routen verwenden `t.Integer` in der Query nicht (grep in backend/src/routes).
