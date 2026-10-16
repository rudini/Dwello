# Code-Review #209, Runde 1: gespeicherter Heizanteil im PDF

Gegenstand: `git diff f106ec6b 67053378` (25dcc583 Szenario `@wip` mit Schritt und Seed, 67053378 Fix, Migration, Doku, `@wip` entfernt). Worktree `review-209-code`. Alle 12 geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/statement-pdf.service.ts:137-151 | Der Rückgriff für Abrechnungen ohne `heating_share` (vor der Migration erstellt, mit Heizprofil) hat keinen Test mehr. Alle PDF-Tests erzeugen ihre Abrechnungen mit `generateStatement`, das jetzt immer speichert. Kein Test setzt `heatingShare = null` bei gesetztem `heatingProfileId` (gesucht in `backend/src/__tests__`). Der Pfad ist unverändert, kann aber unbemerkt brechen. Ein pg-Test, der `heating_share` auf null setzt und den Hinweis aus dem aktuellen Profil erwartet, würde ihn abdecken. |
| C-2 | Minor | docs/api-specification.md:210 | `POST /statements/preview` liefert jetzt zusätzlich `heating` (`...calculation`, `backend/src/routes/statements.ts:100-104`). Die Spezifikation zählt die Felder vollständig auf, `heating` fehlt dort. Ein Vertrag ist nicht nötig, weil das Frontend das Feld nicht liest (`statement-preview.json` ist eine Teilmenge). |
| C-3 | Nit | backend/src/services/statement.service.ts:583-584 | `profileId!` und `(await getHeatingProfile(...))!` gelten nur, weil `heatingOfRun` kurz vorher ein Profil gefunden hat. Wird das Profil dazwischen gelöscht, kommt ein TypeError statt eines Fehlers mit Code. Das Profil wird pro Lauf ausserdem mehrmals gelesen (pro Heizgruppe, in `heatingOfRun` und hier). Liest `heatingOfRun` die Namen selbst mit, fallen beide Assertions weg. Im Einbenutzer-MVP praktisch nicht erreichbar. |
| C-4 | Nit | backend/src/services/statement.service.ts:579-580 | Zwei Leerzeilen vor der neuen Funktion (eine davon neu). |

Keine Blocker, keine Major.

## Geprüft und bestätigt

- **Anforderung („Done means“):** Die Abrechnung speichert beim Erstellen Anteil, Monatsliste und Profilnamen bzw. `{ byDays: true }` (`statement.service.ts:336`, `calculation.service.ts:403-416`). Das PDF druckt diese Werte, solange eine Heizposition vorhanden ist (`statement-pdf.service.ts:134-136`). Der verlangte Test steht in `statement-pdf.pg.test.ts:239-323`: eigenes Profil, danach geändert, PDF zeigt 50 % statt 40 %. Dazu kommen F-1 (umbenannt und gelöscht, Name bleibt) und F-2 (Periode mit 0 %, bleibt bei «62/92 Tage»). Der Plan vermerkt für jeden Test `Test red:`, ausserdem `Scenario red:` und `Skills: tdd, ponytail, ponytail-review`.
- **Beträge unverändert:** `heatingOfRun` ruft `handleMidYearMoves` mit 100 als Kosten auf. `percentage` und `monthBreakdown` hängen nicht von den Kosten ab (`prorating.service.ts:209-217`, `heating-profile.service.ts:338-378`). Die Rückgabe enthält also dieselben Werte wie der Aufruf pro Gruppe, mit denselben Vertragsdaten. Die Schleife über die Positionen bleibt unverändert. Ein Profil, das nicht gefunden wird, und ein Vertrag über die ganze Periode ergeben `{ byDays: true }`, genau wie in der Schleife. Ohne Profil oder ohne Heizposition ist das Ergebnis null.
- **Alter Pfad:** Bei `null` greift die bisherige Neuberechnung, unverändert (siehe aber C-1). Ohne `heatingProfileId` ergibt sie `{}`, wie bisher.
- **Typ und Migration:** Neue Datei `0004_statement_heating_share.sql`, nur `ADD COLUMN ... JSONB`, nullable, im Stil von 0003. Der Migrator wendet sie nach dem Dateinamen an. Der Typ `HeatingShare` in `schema.ts` passt zu dem, was geschrieben und gelesen wird. `localName` akzeptiert die gespeicherten Namen.
- **API und Sicherheit:** Die Statement-Detailantwort enthält jetzt `heatingShare`. Das sind nur die eigenen Profildaten des Nutzers. `statement.json` ist eine Teilmenge, wie bei `keyValues` und `fuelStock`. Das Frontend liest das Feld nicht, also braucht es keinen Vertrag. Auth und XSRF sind nicht berührt.
- **Szenario:** `statement-detail.feature:220-244` ohne `@wip`. Es nutzt das «Winter»-Profil aus der Grundlage (18+14+11 = 43 %), ändert es danach auf 30/20/10 (Summe 100) und prüft Anteil, Monatsliste und Betrag. Der Schritt ruft nur `seed` auf (Regeln in `tests/e2e/CLAUDE.md`). `changeHeatingProfile` setzt die Vorbedingung über die API, genau wie `heatingProfile`. Der Feature-Text beschreibt keine UI-Bedienung.
- **Texte und UI:** Kein neuer UI- oder PDF-Text, keine `messages/*.json`, kein neuer Bildschirmzustand. Deshalb gibt es keine Einträge in `screens.json` und den a11y- und Sprachen-Features.
- **Umfang:** Keine fremden Änderungen. `docs/data-model.md` beschreibt die neue Spalte. Der Fachreview-Bericht und die Planzeilen gehören zur Aufgabe.

## Nicht bestätigt

- Frontend `bun run test:coverage` (2486 grün, Floors), `bun run lint`, `bun run check`, `bun run deepcheck:audit`, `bunx fallow audit`: vom Aufrufer gemeldet.
- Backend `bun run test` (628 grün) und `bun run type-check`: vom Aufrufer gemeldet. Nicht selbst gestartet, die Regeln für den Reviewer erlauben nur Vitest. Ob die drei neuen pg-Tests grün sind und vor dem Fix rot waren, steht damit nur im Plan.
- E2E chromium und api (120 grün, Szenario vorher rot an «43.00 % der Heizkosten»): vom Aufrufer gemeldet.
- Ob der Rückgriff für alte Abrechnungen (C-1) auf echten Bestandsdaten noch funktioniert: Kein Test vorhanden, nur am Code gelesen (`statement-pdf.service.ts:137-151`).
