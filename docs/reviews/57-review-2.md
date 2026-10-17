# Code-Review #57, Runde 2 (Delta bd6d3e4e..31d173ba)

Gegenstand: Schlussrunde vor dem Push. Geprüft im Worktree `review-57-close` (detached 31d173ba). Gelesen habe ich alle 11 Dateien von `git show 31d173ba` und den Merge 487a64d5 auf Folgen für #57.

Ergebnis: kein Blocker, kein Major. Die Befunde C-1 bis C-4 aus `docs/reviews/57-review-1.md` sind erledigt.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | `src/__tests__/i18n.test.ts:23-29` | Der fr-Guard prüft nur das U+00A0 innerhalb der Guillemets. Ein fehlendes Leerzeichen davor («de« Saisir», alter C-1) fände er nicht. Die Korrektur ohne Test ist nach `slice-review`, Triage, zulässig (geprüfter Übersetzungswortlaut). Mit `/\S«|»\p{L}/u` als zweiter Bedingung würde der Guard den Fehler künftig selbst finden. |
| C-2 | Nit | `implementation_plan.md` (Session #57, «Files changed») | Die Liste nennt `tests/e2e/questions/wizard.ts`, `docs/design/offene-punkte.md`, `docs/design/personas/dr-weber-57.md` und `docs/reviews/57-review-1.md` nicht. Die Punkte «Slice review» und «feature review» sind noch offen. Vor dem letzten Commit nachführen und die Session ins Archiv verschieben (Workflow Schritt 8). |

## Blocker/Major

Keine.

## Bestätigt

- **Alter C-1 (fr-Typografie):** In `messages/fr.json:163` steht jetzt «de « Saisir …» und «avec « Se déconnecter »». Laut `od -c`: normales Leerzeichen (0x20) vor «, U+00A0 innen (302 240) und vor ». Selbst ausgeführt: `src/__tests__/i18n.test.ts` grün.
- **Alter C-2:** Der Verweis auf #57 ist aus U-25 entfernt. U-16 nennt den heutigen Statusvermerk «Noch nicht gespeichert: … Stand: {time}» und vermerkt den alten Text als «before #57». Helga H8 bleibt damit offen und ist richtig zugeordnet. `open-work.test.ts` ist grün (selbst ausgeführt).
- **Alter C-3:** Der Step heisst jetzt «… bis zum Speichern oder Erstellen, Verwerfen oder Abmelden …». Feature (`privacy.feature:27`) und Step-Definition (`app-frame.steps.ts:109`) stimmen wörtlich überein. Der geprüfte Teilstring ist unverändert, die Strenge also gleich.
- **Alter C-4:** Die neue Datei `tests/e2e/questions/wizard.ts` enthält `restoredDraftText`, `restoredDraftShown` und `saveStatusText`. Sie liegt neben `targets/wizard.ts` und ist im Questions-Layer (Import nur aus `screenplay/questions` und `targets`). Aus `questions/contract-form.ts` und `questions/statement-generate.ts` sind die Fragen samt der nicht mehr gebrauchten Imports (`saveStatusLine`, `draftRestored`) entfernt. `Visibility` wird in `questions/statement-generate.ts` weiter gebraucht (Z. 56 ff.). Per grep importiert keine Datei unter `tests/e2e` mehr die alten Exporte, beide Step-Dateien importieren aus `questions/wizard`. Das Verhalten ist unverändert: Die Fragen sind dieselben, nur verschoben.
- **Persona-Bericht `dr-weber-57.md`:** Er bestätigt die Anforderung aus Sicht des Nutzers. «Entwurf» erscheint nur noch beim Abrechnungsstatus, der Assistent spricht von «Angaben». Statuszeile und Meldung sagen «nur in diesem Browser … noch nicht gespeichert». P-1 bis P-5 sind Minor/Nit und bleiben laut «Done means» im Bericht. Der Dateiname folgt dem bestehenden Muster `dr-weber-<n>.md`.
- **Merge 487a64d5:** `git diff --stat 600f25e5 487a64d5` zeigt dieselben 24 Dateien mit denselben Zeilenzahlen wie `83994214..bd6d3e4e`. Abweichend ist nur `implementation_plan.md` (+1 Zeile, die Session #57 über dem leeren Plan von main). Der Merge hat also keine Änderung von #57 verloren oder verändert.
- **Nichts Fremdes im Delta:** Es enthält die Review-Korrekturen, den Persona-Bericht und den Bericht von Runde 1. Keine Formatierung oder Umbauten an unberührtem Code.
- Keine neuen UI-Texte ausser der fr-Korrektur. Kein neuer Bildschirm oder Zustand, keine API-Antwort und keine Klassen geändert. Sicherheit, Tokens und Verträge sind nicht betroffen.

## Nicht bestätigt

- Selbst neu ausgeführt: `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/privacy-page.dom.test.ts src/__tests__/open-work.test.ts`, 3 Dateien, 70 Tests grün.
- Vom Aufrufer gemeldet, auf 31d173ba: eslint `tests/e2e` sauber, bddgen ok, E2E chromium der Szenarien privacy, restore, discard, «noch nicht gespeichert» und draft-dropped (10 grün). Auf bd6d3e4e: lint, check, ganzes vitest (3025), die vier Features (126), a11y- und Sprachzeilen der Draft-Zustände (16).
- Nicht gelaufen auf 31d173ba: `bun run lint` und `bun run check` über das ganze Repo. Das umbenannte Step-Muster habe ich nur gelesen (Feature und Step stimmen überein), nicht ausgeführt.
- Ob nach dem Persona-Review noch ein `fach-reviewer` als Feature-Review nötig ist (Workflow Schritt 5): Seit Runde 1 hat sich nur die fr-Typografie geändert, kein Fachtext. Ich habe nicht geprüft, ob der Aufrufer das so entschieden hat.
