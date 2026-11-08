# Code-Review #1301 «Fläche und Zimmeranzahl ab einem Tag», Runde 2 (Abschlussrunde vor dem Push)

Gegenstand: `git diff 83ecc9e 8d44290` (a93e158, e66c154, 8d44290) ohne Reports, Plan, Archiv und Personas. Dazu der Merge 74c6613 (`--remerge-diff` leer) und `git diff 8d44290 9441ed4`. Worktree `review-1301-code2`, HEAD 9441ed4. Vorbericht: `docs/reviews/1301-review-1.md`.

Geschlossen: C-1, C-4

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-6 | Major | `src/lib/apartment.ts:44`, `tests/e2e/features/apartment-size-from-day.feature:13` | Neu sind 7 bis 10 Zimmer wählbar. Das ist eine sichtbare Änderung und die Behebung eines Fehlers, den eine Persona gefunden hat (Helga P-1). Kein Szenario zeigt sie, alle Szenarien bleiben bei höchstens 6.5 Zimmern. Nur ein Unit-Test deckt sie ab (`apartment.test.ts:382-387`). |
| C-2 | Minor | `backend/src/services/apartment.service.ts:268-270` | Unverändert offen (Runde 1). V-8 wird nur geprüft, wenn mit `sizeFrom` gespeichert wird. Ein «Aufgehoben ab» am Tag einer erfassten Änderung oder davor wird nicht abgelehnt. Kein Test. |
| C-3 | Minor | `backend/src/routes/apartments.ts:165` | Zum Teil behoben. Der Fehlerzweig des BFF ist jetzt getestet (`apartment.test.ts:512-516`). Die 404-Antwort von `DELETE /apartments/:id/size-change` (Wohnung ohne Änderung oder unbekannte Wohnung) testet weiterhin kein Test. In `apartment-size-from-day.pg.test.ts` gibt es nur den Erfolgsfall (`:148`). |
| C-5 | Minor | `tests/contracts/statement.json:83` | Unverändert offen (Runde 1). Das Feld `changed` im Vertrag wird nie gegen die echte API geprüft. |

## C-6: Kein Szenario für mehr als 6.5 Zimmer

**Warum falsch.** `CLAUDE.md`, Workflow 1, verlangt ein Szenario für jede Verhaltensänderung, auch für die Behebung eines Fehlers, den der Benutzer sieht. Bis a93e158 ging die Auswahl der Zimmeranzahl nur bis 6.5. Wer eine Wohnung mit 3.5 und eine mit 4 Zimmern zusammenlegt, konnte die neue Zimmeranzahl nicht speichern. Persona Helga hat deshalb 5.5 stehen lassen. Die Werte waren damit falsch gespeichert, und sie gehen über den Verteilschlüssel «Zimmer» in die Beträge ein. Die Liste wird jetzt neu erzeugt (`Array.from({ length: 19 }, …)`), und das gilt auch für «Neue Wohnung». Ein Szenario mit 7 Zimmern oder mehr gibt es nicht: `grep -rnE 'Zimmeranzahl "([7-9]|10)' tests/e2e/features` findet nichts. Der Unit-Test prüft nur, was `roomOptions()` zurückgibt. Er zeigt nicht, dass das Formular den Wert anbietet und dass Speichern und Detailseite ihn übernehmen (`decimal(3,1)`, Anzeige «7.5 Zimmer»).

**Wie zeigen.** Auf a93e158^ das Szenario «Die neue Fläche ab einem Tag erfassen» mit der Zimmeranzahl «7.5» statt «5.5» laufen lassen (Zeilen 13 und 15). Auf chromium scheitert `Select.option('7.5')` in `changeSizeFrom` (`tests/e2e/tasks/apartment-form.ts:49`), weil die Option fehlt. Auf HEAD läuft es durch. Die Feature-Datei ist neu in diesem Pull Request und nicht auf `main`, das Ändern des Werts braucht also keine Freigabe.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, backend `bun run type-check`; `bunx vitest run` (222 Dateien, 4670 Tests); backend `bun run test` (2177 bestanden, Abdeckung 97.3 % Zeilen); E2E `apartment-size-from-day.feature` und `apartment-discontinued.feature` auf chromium und api (27 bestanden); die axe- und Sprachzeilen von `apartment-detail-resized`, `apartment-edit`, `apartment-new` und `apartment-detail` (18 bestanden). Ebenso vom Aufrufer gemeldet: Jeder neue Test wurde rot gesehen, der C-3-Test durch Herausnehmen seines Zweigs.
- Rot nach Lesen beurteilt. `statement-pdf-data.test.ts` «druckt die Fläche, mit der die Abrechnung rechnet» scheitert auf der Basis: Sie druckte `apartment.area` «85.00». Der Test ohne gespeicherte Werte prüft Verhalten, das bleibt. `apartment.test.ts` «bietet bis 10 Zimmer» scheitert auf der Basis: Die Liste endete bei 6.5 mit 12 Werten. Ob jede Commit-Nachricht den Test benennt, der bestehendes Verhalten festhält, habe ich nicht geprüft.
- Dass #1327 die Zeilen in `UBIQUITOUS_LANGUAGE.md` und `docs/design/i18n-begriffe.md` entscheidet («Gültig ab (Fläche und Zimmeranzahl)», «Zusammenlegung»), habe ich nicht auf GitHub geprüft. Ich habe nur die Begründung des Aufrufers und den entfernten Marker gesehen.
- Ob der Kopf der Detailseite einer Abrechnung im Frontend auch die Fläche zeigt, und welche: nicht gelesen. C-1 betraf nur das PDF.

Geprüft: `apartmentOf` druckt `key_values.area[0]` und für Abrechnungen ohne gespeicherte Werte die Fläche der Wohnung. Das stimmt mit `keySharesOf` (`statement-pdf.service.ts:330`) und mit Fachreview 1301-2 C-1 überein, denn `keyValuesOf(…, rentalStart)` speichert die Werte am ersten abgerechneten Tag. `segmentLineProfile` und `apartments_form_size_from_help` sind in allen vier Sprachen wortgleich mit Fachreview 1301-2, in fr mit U+00A0, und als Test festgehalten. `SizeChanges` nutzt `dayAfter` aus `$lib/swiss-date`. `seedFor` erhält die Adresse mit Platzhaltern (`screens.ts:114-115`), legt «Umbauhof» also nur für `apartment-detail-resized` an. ponytail-review: nichts zu kürzen.
