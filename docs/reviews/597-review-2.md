# Code-Review 597-2 (Delta 4874c0f..b8b2a62)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | geschlossen | tests/e2e/features/sprachen.feature:33, statement-detail.feature:290 | Beide Szenarien ohne `@wip` vorhanden und schlagen auf 562443c fehl (siehe unten). |
| C-2 | Major | tests/e2e/features/apartment-new.feature:12 (fehlt) | Sichtbare Verhaltensänderung aus P-1 (#597 Punkt 6): die Auswahl des Stockwerks bietet neu «2. UG» an. Kein Szenario zeigt das; das neue Szenario in `sprachen.feature` legt die Wohnung auf −2 über den Seed an, nicht über das Formular. |

## C-1: geschlossen

- Bildschirm: «Stockwerke unter dem Erdgeschoss» legt eine Wohnung auf −2 an und erwartet «2. UG». Auf 562443c zeigt die Detailseite dort «UG» (`apartments_floor_basement`), das Szenario schlägt also fehl.
- PDF: Die Wohnung «UG» auf −1 bekommt vom Step 70 m² (`apartment-detail.steps.ts:118-121`). Auf 562443c heisst −1 im PDF «1. UG», `namedByFloor` erkennt «UG» nicht, und das PDF druckt das Stockwerk zusätzlich. Damit schlagen «Wohnung UG, 70.00 m²» und «nicht "1. UG"» fehl. Mit `formatFloor(-1)` = «UG» trifft `startsWithFloor`, und die Zeile steht einmal.

## C-2 (Major): Kein Szenario für «2. UG» in der Auswahl des Stockwerks

`CLAUDE.md`, Workflow 1: Jede Verhaltensänderung, die ein Benutzer sieht, braucht ein Szenario ohne `@wip`, auch die Korrektur eines Persona-Befunds. Vorher konnte der Liegenschaftsverwalter eine Wohnung im 2. UG nur über das Gebäuderegister erfassen. Jetzt geht es im Formular «Neue Wohnung» / «Wohnung bearbeiten» (`ApartmentForm.svelte:109`) und in den Registerzeilen (`RegisterApartments.svelte:75`). Den Unit-Test `apartment.test.ts:290-294` gibt es, aber er ersetzt das Szenario nicht. `tests/e2e/CLAUDE.md`, «No scenario», trifft hier nicht zu: Der E2E-Stack kann diesen Zustand herstellen.
So zeigt man den Fehler: Ein Szenario nach dem Muster von «Wohnung erfassen» (`apartment-new.feature:12-21`) mit `| Stockwerk | -2 |` und «im Stockwerk "2. UG"» schlägt auf 4874c0f über den UI-Pfad fehl, weil die Option −2 fehlt. Mit b8b2a62 läuft es grün. Dafür reichen die vorhandenen Steps.

## Nicht bestätigt

- lint, check, Unit-Tests apartment, apartment-form und buildings-i18n (53), E2E-Features sprachen, statement-detail, apartment-detail und apartments (chromium und api, 148), axe- und Sprachzeilen der Wohnung (55): vom Aufrufer gemeldet, nicht wiederholt. Ebenfalls nur gemeldet: der Rot-Lauf der beiden Szenarien auf 562443c. Ich habe ihn nur durch Lesen geprüft (oben).
- Rot des neuen Unit-Tests `floorOptions` nur durch Lesen geprüft: Die Basis liefert `['UG', 'EG', '1. OG']`.

Geprüft: #597 Punkt 6 (über die REST-API gelesen) deckt die Änderung von `floorOptions`. In `RegisterApartments` zeigt die Auswahl −2 jetzt doppelt-frei über `Set`. Es gibt keine neuen Texte, Bildschirme oder testids. Ponytail: kein Befund.
