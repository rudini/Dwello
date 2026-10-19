# Slice-Review #435 «Daten eines Mieters exportieren», Runde 2 (Abschlussrunde)

Gegenstand: `bd423e0e..db318be9` (348dd1cf, db318be9), Worktree `review-435-2` (nur gelesen), ohne `docs/reviews`, `docs/design/personas`, `implementation_plan.md`. Gelesen: alle sechs geänderten Dateien vollständig im Diff, dazu `tenant-export.service.ts` (ganz bis Z. 80 und die geänderten Stellen), `today.ts`, `schema.ts:138`, `tests/contracts/tenant-export.json`, `api-contracts.pg.test.ts:267-272`, `tests/e2e/questions/download.ts:40-50`, `tenants.feature:60-75`, `eslint.config.*` (Screenplay-Regeln), `docs/reviews/435-fachreview-1.md`, `435-fachreview-2.md`, `docs/design/personas/weber-435.md`, `i18n-begriffe.md`.

## Status der offenen IDs aus Runde 1 und der Persona

| ID | Schwere | Status | Beleg |
|----|---------|--------|-------|
| C-1 | Major | behoben | `tenant-export.service.ts:133` `toLocaleDateString('sv-SE', { timeZone: 'Europe/Zurich' })`, `:144` `swissToday()`; neuer pg-Test (23:30Z am 1.3. → `2026-03-02`) fiele mit dem alten `toISOString` (→ `2026-03-01`); `today` der pg-Tests jetzt Schweizer Tag, damit stimmen Szenario (`inDays(0)`) und Service überein. |
| C-2 | Minor | behoben | Zeile unter «5. Tenants» verschoben, Inhalt unverändert. |
| C-3 | Minor | behoben (Rest: C-15, C-16) | `:72-74` legt `contractPdf` als `dokumente/<Beginn> <Mietvertrag Wohnung> <Nr>.pdf` bei, `contracts[].file`; pg-Test fiele ohne die Änderung. Begriffe nach `i18n-begriffe.md:13, 27`. |
| C-4 | Minor | offen, bewusst (= F-16) | Kein Code geändert; bleibt im Bericht. |
| C-5 | Minor | Begründung trägt | `435-fachreview-1.md:80` verlangt ausdrücklich «Beschreibungen der Rechnungen» je Position; damit ist die Herausgabe fachlich gedeckt. Zurückgezogen. |
| C-6 | Minor | behoben | pg-Test «überfällig» (Frist 2025-01-31). Pinnt Verhalten von `getStatement`; Rot laut Commit durch Herausnehmen gezeigt, plausibel. |
| C-7 | Minor | offen, bewusst | Kontaktdaten weiter nur über den Namen geprüft; bleibt Minor im Bericht. |
| C-8 | Minor | offen, bewusst | Wie Runde 1 begründet (pg-Test deckt Vormieter derselben Wohnung). |
| C-9 | Minor | teilweise | `level: 0` umgesetzt (`+server.ts:24-27`); die Zeile in `offene-punkte.md` zur unbegrenzten Speicherspitze fehlt weiterhin (nicht im Diff). Minor bleibt offen. |
| C-10 | Minor | behoben | pg-Test 404 mit zufälliger UUID. |
| C-11 | Nit | Ablehnung trägt | `eslint.config.*:32` verbietet Zugriff per Literal-Name (`MemberExpression[computed=true][property.type=Literal]`) ausserhalb der erlaubten Schichten; `['daten.json']` wäre ein Lint-Fehler. |
| C-12 | Nit | behoben | `Buffer` direkt (ist `Uint8Array`), als Tupel mit `{ level: 0 }`. |
| C-13 | Nit | behoben | README-Zeile deutsch. |
| C-14 | Nit | offen, bewusst | Unverändert. |
| Weber P-1 | Major | behoben | `:93-103`: Entwurf mit `statementDate`/`paymentDeadline` `null`; pg-Test erweitert (fiele mit altem Code, da `getStatement` für einen Entwurf Datum und Frist liefert). Saldo und Positionen des Entwurfs bleiben im JSON: das ist der PO-Entscheid «Entwurf nur im JSON ohne PDF» (#435), keine Frist mehr, `status: "draft"` bleibt. Die Warnung im Hilfetext, die die Persona vermisst, ist nicht Teil von P-1s Korrektur; kein Blocker. |

## Neue Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-15 | Minor | `backend/src/services/tenant-export.service.ts:72-74` | `contract_pdf` ist laut Schema «Base64 or URL» (`schema.ts:138`); der Export behandelt jeden Wert als Base64. Eine URL würde zur kaputten `.pdf` und fehlte im JSON. F-18 (a) verlangte «wenn gesetzt und Base64 …; eine URL nur als Text im JSON». Heute füllt keine Oberfläche das Feld, daher Minor. |
| C-16 | Minor | `docs/api-specification.md:83` | Die Spezifikation nennt weder die Vertrags-PDF unter `dokumente/` bzw. `contracts[].file` noch, dass ein Entwurf ohne Abrechnungsdatum und Zahlungsfrist kommt («a draft only here, without a file»). |
| C-17 | Nit | `backend/src/services/tenant-export.service.ts:48-75` | `file()` wird in den `async`-Callbacks von `Promise.all` nach `await categoryNames(...)` aufgerufen; die Reihenfolge der Vertragsdateien in `files` (und ein allfälliger Zähler) hängt damit vom Abschluss der Abfragen ab. Praktisch folgenlos (gleicher Beginn und gleiche Wohnung nötig). |

Keine Blocker, keine Major.

## Weitere Prüfungen

- Konventionen: neue Dateinamen-Wörter stehen nur im Backend (Dateinamen im ZIP, nicht UI); Begriffe nach Glossar/`i18n-begriffe.md`. en `tenants_export_help` geändert (F-22), nur Englisch betroffen; die übrigen Sprachen sagen schon «selbst/lui-même/…» (nicht neu geprüft). Vertrag `tests/contracts/tenant-export.json` ist eine Teilmenge; `drift` prüft nur vorhandene Felder, neue Felder in `data` brauchen keine Anpassung, das BFF reicht `data` unverändert durch.
- Szenario: die Verhaltensänderungen (Schweizer Tag, Entwurf ohne Daten, Vertrags-PDF) gehören zum selben neuen Feature, dessen Szenario ohne `@wip` existiert; Entwurf und Vertrags-PDF kann die Oberfläche bzw. das Szenario nicht sinnvoll herstellen (kein UI für `contract_pdf`), der pg-Test ist die tiefste Schicht. Kein Major.
- Kein neuer Bildschirm/Zustand, keine neuen UI-Texte ausser F-22.
- Ponytail: Diff knapp; einziger Fund C-17 (nicht kürzend). Nichts Ungenutztes.
- Rote Tests (nach Lesen): F-17-Test, Entwurfsdaten und Vertrags-PDF fielen ohne die Änderung; 404 und «überfällig» pinnen vorhandenes Verhalten, im Commit als durch Herausnehmen rot gezeigt genannt.
- Kein fremder Diff.

## Nicht bestätigt

- Alle Checks des Aufrufers (lint 0, check 0, backend type-check 0, `tenant-export.pg.test.ts` 10 pass, `src/__tests__/tenant-export.test.ts` 3, i18n-Test, E2E Chromium 11): vom Aufrufer gemeldet, nicht neu gelaufen (Worktree ohne `node_modules` in Runde 1).
- Ob fflate das Tupel `[Buffer, { level: 0 }]` typisiert und als unkomprimiert schreibt: nur aus der fflate-API (`ZippableFile | [ZippableFile, ZipOptions]`) geschlossen; durch gemeldetes `check` 0 gestützt.
- Die roten Läufe von 404 und «überfällig» (durch Herausnehmen von Code): nur aus der Commit-Nachricht.
- Ob die übrigen drei Sprachen von `tenants_export_help` dieselbe Bedeutung wie das neue en «themselves» haben: nicht neu geprüft (Runde 1 und Fachreview bestätigten de/fr/it).
