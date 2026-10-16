# Code-Review W4, Runde 2 (Abschluss vor dem Push): #247, #230, #232

Geprüft: Worktree `review-w4-code2` (detached, 5e61fe4), `git diff ae75ecc 5e61fe4` (20c36f0 Rundung/C-1, C-2, C-4, C-7; 5e61fe4 M-5, V-8). Alle 17 geänderten Dateien gelesen. Dazu die Umgebung: `pdf-format.ts` (`roundToRappen`), `calculation.service.ts` (`heatingOfRun`, `periodShare`, `rentalShare`, `daysOf`), `pdf.service.ts` (`timeShare`, `sharesNote`), `schema.ts` (`period_share` mit 4 Stellen, nullable), `docs/reviews/w4-fachreview-2.md` (M-5, V-8), `.claude/skills/ponytail-review/SKILL.md`.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-8 | Minor | backend/src/services/statement-pdf.service.ts:76-77 | `byDaysRented` setzt ein fehlendes `period_share` mit `?? '1'` gleich 1. Bei einer alten Abrechnung mit Heizprofil, ohne `period_share` (Spalte nullable) und mit einem Mietvertrag unter der ganzen Periode gilt die Heizposition dann als `byProfile`. Das PDF druckt in der Spalte «–» (`timeShare`), sagt aber «Bei Heizkosten ist der Zeitanteil der Anteil nach dem Heizprofil.». Ein `null` müsste als «nicht nach Profil» zählen (`item.periodShare == null \|\| …`). Neue Abrechnungen speichern den Wert immer (`statement.service.ts:350`). Ob es Abrechnungen ohne `period_share` gibt, habe ich nicht geprüft. |
| C-9 | Minor | backend/src/services/statement-pdf.service.ts:76-77 | Die Herleitung für Altbestände erkennt eine Position nach Tagen nur an `billedDays` oder `period_share = Mietstage / Tage`. Eine Heizposition nach Tagen mit Rechnungen über verschiedene Leistungszeiträume (`invoiceParts`, #226) hat weder das eine noch das andere und würde als «nach Heizprofil» gelten. Laut Git-Verlauf kam #226 nach #209, also hat keine Abrechnung vor #209 `invoiceParts`. Heute ist das kein Fehler, aber `!!item.invoiceParts` mitzuprüfen kostet nur einen Ausdruck. |
| C-10 | Nit | backend/src/services/statement-pdf.service.ts:77, backend/src/services/pdf.service.ts:483 | ponytail `reuse:` Der Vergleich `Math.abs(periodShare - rentalDays / periodDays) < 0.00005` steht jetzt an zwei Stellen. Eine Hilfsfunktion für beide Stellen würde verhindern, dass die beiden Toleranzen auseinanderlaufen. |
| C-11 | Nit | backend/src/__tests__/prorating.pg.test.ts:172-175 | ponytail `shrink:` Der Test baut die Monatsanteile mit einer eigenen Monatsliste und einem Cast `as Parameters<…>[0]`. `statement-pdf.pg.test.ts` hat dafür schon die Hilfe `shares([...])`. Man könnte sie teilen oder den Cast weglassen. |

Lean otherwise. Die Closure aus C-4 ist aufgelöst. Die Ausgabe ist gleich geblieben: `period` wird nur in den Zweigen mit `periodPercent` verwendet.

## Bestätigt durch Code und Test (durch Lesen)

- **C-1:**
  - `calculateHeatingShare` rundet jeden Monat und die laufende Summe mit `roundToRappen` (`heating-profile.service.ts:368-369`).
  - `handleMidYearMoves` rundet die Teilung ebenso (`prorating.service.ts:223`). Der Import war schon da.
  - Der neue Unit-Test 2.3 × 7/28 ist ohne die Änderung rot. Nachgerechnet: `2.3*7*100/28` = 57.4999… ergibt 0.57. Mit der Änderung ergibt `toPrecision(12)` 57.5 und damit 0.58.
  - Für die Teilung gibt es keinen eigenen Test mit einem Halbfall. Der Test aus C-2 (50.1 / 100.1) liefert mit der alten und mit der neuen Rundung 50.05. Die Teilung nutzt dieselbe Funktion wie die Monate und ist darüber mitgedeckt. Kein Befund.
- **C-2:**
  - Das Profil hat eine Summe von 100.10, die Periode ist ein ganzes Jahr, der Mietvertrag beginnt am 1.7. Erwartet: 50.10 / 100.10 = 50.05 % und `periodPercentage` 100.1.
  - Ohne die Teilung wäre der Wert 50.1, der Test also rot.
- **C-4, C-7:** Erledigt.
  - C-4: `pdf.service.ts:749-756`.
  - C-7: Die `statements_profile_*`-Schlüssel stehen jetzt im Block `statements_*`, in allen vier Dateien mit unverändertem Text.
- **M-5:**
  - `legacyProfile` greift bei Abrechnungen ohne `heating_share` und mit `heatingProfileId`.
  - `byProfile` wirkt nur auf Heizpositionen (`lineItemOf`, `heating && byProfile`), also löst es nur dort den Satz `sharesNoteHeating` aus.
  - Neue Abrechnungen speichern `heating_share`, sobald ein Profil und Heizkosten da sind (`heatingOfRun`). Ohne Heizkosten gibt es keine Heizposition. Neue Abrechnungen sind also nicht betroffen.
  - Ein ganzer Zeitraum (Anteil 1 = Tage 1) und der Ausweichfall «0 % in der Periode» (Anteil nach Tagen) zählen weiterhin als «nach Tagen».
  - Der angepasste Test ist ohne die Änderung rot: Ohne `legacyProfile` fehlt der Satz.
  - Zur Prüfung auf «kein Heizprofil-Abschnitt»: Der Test sucht jetzt nur noch nach «Heizkosten nach Heizprofil», nicht mehr nach «Heizprofil». Das ist enger als vorher, folgt aber zwangsläufig daraus, dass der allgemeine Satz das Wort enthält.
- **V-8:**
  - Der Wortlaut entspricht der Korrektur im Fachreview, in de/fr/it/en.
  - Das Szenario in `heating-profiles.feature:49` ist angepasst.
  - Der alte Wortlaut kommt sonst nirgends vor (grep in `src`, `tests`, `messages`, `backend/src`).
- **Keine fremden Änderungen:** Neben dem Code kamen nur Berichte dazu (`docs/reviews/w4-review-1.md`, `w4-fachreview-2.md`, `docs/design/personas/*-w4.md`) und der Plan (`implementation_plan.md`, «daten-pruefer» noch offen).

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt:
  - `cd backend && bun run type-check`
  - die Backend-Tests heating-profile.service, prorating.pg, statement-pdf.pg und statement-pdf-render
  - `bun run lint`
  - vitest statement-mapping, heating-profiles-pages, backend-codes und open-work
  - der volle E2E-Lauf (773) auf ae75ecc, nicht auf 5e61fe4. Seither geändert: das Szenario aus V-8 und Halbfälle in den Heizbeträgen. Ich habe nicht geprüft, ob ein bestehendes E2E-Szenario einen Halbfall trifft. Die Szenarien aus Runde 1 (Rosenhof 15.68 / 95.36, Eva Frei 86.00) sind keine Halbfälle.
  - «neue Tests rot gesehen». Durch Lesen bestätigt, siehe oben.
- `bun run check` (svelte-check) ist für 5e61fe4 nicht gemeldet.
- Für M-5 gibt es kein E2E-Szenario. Eine Abrechnung vor #209 lässt sich im E2E-Stack nur durch einen Eingriff in die Datenbank herstellen. Der Test auf unterer Ebene (`statement-pdf.pg.test.ts`) deckt den Fall ab. Der Pull Request braucht dafür die Zeile `No scenario: <reason>`. In den Commit-Texten steht sie nicht. Ob sie im PR-Text vorgesehen ist, konnte ich nicht prüfen.
- Ob Abrechnungen ohne `period_share` existieren (C-8): nicht geprüft. Eine Migration, die die Spalte einführt, habe ich nicht gesucht.
- Prettier-Abweichungen der geänderten Zeilen: `bunx prettier` lieferte keine Abweichung. Ob Prettier im Worktree tatsächlich lief, habe ich nicht geprüft (stderr unterdrückt).
- Fachlich offene Punkte aus Fachreview 2: M-6 ist durch C-1 erledigt, M-8 durch C-2. M-7, V-9 und V-10 betreffen nicht diesen Code und bleiben beim Aufrufer.
