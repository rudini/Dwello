# Review I, Runde 6 – Abgerechnete Mietstage, Ansage der Bestätigung

Unabhängiges Review von fa6f5df «fix(contracts): review I-5 and personas I4» gegen seinen Vorgänger d502b4a. Die Änderung beantwortet `I-review-5.md` (M-1 bis M-9) und die Persona-Berichte `helga-i4.md`, `sven-i4.md` und `anna-i3.md`. Entscheide des Product Owners: Nur ein Mietvertrag, der noch nicht begonnen hat, lässt sich löschen. Ein vergangenes Vertragsende braucht eine Bestätigung (Dialog «Beenden» und «Bearbeiten»). Vertragsdaten, die einer gespeicherten Nebenkostenabrechnung abgerechnete Mietstage wegnehmen, werden abgelehnt. «Beenden» und «Löschen» sind getrennte Aktionen.

Gelesen: `git show fa6f5df` vollständig. Dazu `contract.service.ts` (`statementsOutside`, `BilledDaysError`, `checkNewDates`, `updateContract`), `routes/contracts.ts`, `calculation.service.ts` (`rentalDays` aus `overlapDays`), `prorating.service.ts` (`calculateProrationDays`, `calculateOverlap`, `calculateDaysBetween`), `statement-pdf.service.ts` (`rentalDatesOf`, `heatingOf`, `getStatementPdf`), `pdf.service.ts` (`tenancyLine`), `schema.ts` (`utility_statements`). Im Frontend `contract-status.ts`, `PastEndConfirm.svelte`, `ContractForm.svelte`, `contracts/[id]/+page.svelte` und `+page.server.ts`, `Checkbox.svelte`, `Panel.svelte`, `Dialog.svelte`, `ActionDialog.svelte`, `contract-form.ts`. Tests: `contract-status`, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`, `contract-end.pg.test.ts`, `statement-pdf.pg.test.ts`, `helpers/pdf-text.ts`, die Szenarien in `contract-detail.feature` und `contract-edit.feature`. Dokumente: `CLAUDE.md`, `backend/CLAUDE.md`, `UBIQUITOUS_LANGUAGE.md`, `I-review-5.md`, die drei Persona-Berichte, `anforderungen-vertragsende.md` (A-2, A-7, A-10), `offene-punkte.md` (Session 12), `design-decisions.md`, `api-specification.md`, `implementation_plan.md`.

Ausgeführt:
- `bunx vitest run` für `contract-status`, `contract-actions`, `contract-detail-page.dom`, `contract-edit.dom`: 66 Tests grün.
- Backend `bun test --preload ./scripts/test-db.ts` für `contract-end.pg.test.ts` (7 grün) und `api-contracts.pg.test.ts` (11 grün). `bun run type-check`: sauber.
- Zwei Sonden als temporäre pg-Tests im Scratchpad (danach gelöscht):
  1. Vertrag ab 01.03.2025, unbefristet, Abrechnung 2025 erzeugt: `rental_days` 306 (01.03.–31.12.). `PUT { startDate: '2025-02-01' }` → 200. Danach `PUT { endDate: '2025-12-15' }` → **200**, obwohl die Abrechnung bis 31.12. rechnet. `PUT { startDate: '2025-02-15' }` → **409**, obwohl die Abrechnung erst ab 01.03. rechnet. Auch `PUT { startDate: '2025-03-01' }`, also zurück auf den abgerechneten Beginn, → **409**.
  2. Vertrag 01.01.2023–30.06.2025, Abrechnung 2025 erzeugt, PDF: «Ihr Mietverhältnis in dieser Periode: 01.01.2025 – 30.06.2025 (181 Mietstage von 365 Tagen)». `PUT { endDate: '2025-08-31' }` → 200. Neues PDF: «01.01.2025 – **31.08.2025** (181 Mietstage von 365 Tagen)».
- `grep` nach `contractExists`, `checkContractOverlap`, `StatementsAfterEndError`, `statementsAfterEndError` in allen `.ts`, `.js`, `.svelte`: Treffer nur noch in `contract.service.ts` selbst und in Dokumenten.
- `bunx eslint` auf den geänderten `.ts`/`.svelte`-Dateien: sauber. `bunx prettier --check` auf den geänderten Dateien: `contract-detail-page.dom.test.ts` nicht formatiert (Zeilen 192 und 208, beide neu).
- E2E, volle Suiten und Server nicht ausgeführt.

**Ergebnis:** Der Hauptfall aus Runde 5 ist behoben. Ein beendeter Mietvertrag mit Schlussabrechnung lässt sich wieder speichern, ein früheres Ende und ein späterer Beginn werden abgelehnt. Die Formel stimmt aber nur, solange der Vertragsbeginn seit dem Erstellen der Abrechnung gleich geblieben ist. Ein früherer Beginn wird angenommen und verschiebt danach den berechneten Bereich. Dann werden falsche Daten angenommen und richtige abgelehnt (N-1, mittel). Ein späteres Vertragsende wird angenommen, das PDF der Abrechnung zeigt danach das neue Ende mit den alten Mietstagen (N-2, mittel, bestand schon, wird jetzt aber getestet und dokumentiert). Dazu vier Findings «niedrig».

Die Live-Region ist jetzt korrekt gebaut. Sie steht immer im DOM, auch im Formular vor «Befristet». Sie enthält nur einen kurzen Satz mit Aufforderung. Kästchen und Fehler liegen ausserhalb. Der Fehler am Kästchen verschwindet bei einem neuen Datum. Vor dem Vertragsbeginn erscheint keine Bestätigung mehr.

## Prüfung der Formel für die abgerechneten Mietstage

`rental_days` entsteht beim Erstellen der Abrechnung als Schnitt von Vertrag und Periode: `max(Vertragsbeginn, period_start)` bis `min(Vertragsende ?? period_end, period_end)`, beide Tage mitgezählt (`calculation.service.ts:262`, `prorating.service.ts:59-108`). Das Heizprofil ändert `rental_days` nicht, es gewichtet nur die Heizkosten. Die Prüfung rechnet zurück: `greatest(period_start, <gespeicherter Vertragsbeginn>) + rental_days − 1` (`contract.service.ts:295-296`).

| Fall | Ergebnis |
|---|---|
| Vertrag beginnt vor der Periode, endet in der Periode (01.01.2023–30.06.2025, Abrechnung 2025) | Richtig: 01.01.–30.06.2025 (getestet) |
| Vertrag beginnt in der Periode, unbefristet (01.03.2025) | Richtig: 01.03.–31.12.2025 |
| Beginn und Ende in der Periode (01.03.–30.06.2025) | Richtig: 01.03.–30.06.2025 |
| Ende verlängert, danach wieder gekürzt | Richtig, solange der Beginn gleich bleibt: `rental_days` hängt nicht am heutigen Ende (getestet) |
| Ältere Abrechnung über ein ganzes Jahr, Beginn danach verschoben | Richtig: `greatest` nimmt `period_start` |
| Heizprofil | Ohne Einfluss auf `rental_days` |
| Beginn nach dem Erstellen der Abrechnung **vorverlegt** | **Falsch**, siehe N-1 |
| Gleicher Request mit früherem Beginn und Ende | Richtig: Geprüft wird mit dem noch gespeicherten Beginn |
| Unbefristet (`endDate: null`) | Prüft nur den Beginn, richtig |

## Stand der früheren Findings (Runde 5)

| # | Schwere | Stand |
|---|---|---|
| M-1 | hoch | Behoben für alle Fälle mit unverändertem Vertragsbeginn. Getestet: gleiches Ende mit neuer Miete → 200, früheres Ende → 409. Rest bei vorverlegtem Beginn (N-1). Der Vorschlag, den abgerechneten Tag in der Antwort zu liefern, ist nicht umgesetzt. Die Meldung nennt keinen Tag mehr, das ist damit erledigt |
| M-2 | mittel | Behoben. `PastEndConfirm` steht immer im Formular, die Live-Region ist vorher leer da (`contract-edit.dom.test.ts`, neuer Test) |
| M-3 | mittel | Behoben: Ein Beginn nach dem ersten abgerechneten Tag gibt 409 (getestet). Rest: N-1 |
| M-4 | mittel | Behoben. A-7 ohne «dieselbe Wohnung», Szenario mit zweiter Wohnung, erfassbar |
| M-5 | niedrig | Behoben über einen `$effect` in `PastEndConfirm`. Nur im Dialog getestet (N-6) |
| M-6 | niedrig | Teilweise. Mehrzahl, «versendet» und «(Entwurf)» sind da. «mit diesem Datum» bleibt im Formular ohne Bezug, die versendete Abrechnung bleibt ohne Ausweg bei richtigem Datum (N-3) |
| M-7 | niedrig | Teilweise. Kurze Ansage ausserhalb des Kästchens, Jahres-Warnung in der fetten Zeile, Fehler nur einmal angesagt. Die Hilfe hat noch 31 Wörter vor dem Fehler, «der Vermieter» statt «Sie» bleibt (N-3) |
| M-8 | niedrig | Behoben: `json().catch()` und `Array.isArray`, Test mit einer Antwort ohne JSON |
| M-9 | niedrig | Grösstenteils behoben: Ansage im Formular getestet und verankert, Testdaten ohne `periodEnd`, A-2 nennt «nur der Browser». Neu unformatiert sind zwei Zeilen im Dialog-Test (N-6) |

## Stand der Persona-Befunde, die `offene-punkte.md` als behoben nennt

| Befund | Stand |
|---|---|
| Helga I4 M1 (rote Meldung mit altem Datum) | Behoben, im Dialog getestet. Im Formular wirkt derselbe `$effect`, dort ungetestet |
| Helga I4 m1 (Jahres-Warnung unauffällig) | Behoben: in der fetten Zeile «… über ein Jahr zurück. Prüfen Sie das Jahr.» |
| Sven I4 1 (Ansage ohne Aufforderung) | Behoben: «Bestätigen Sie das Vertragsende mit dem Kästchen.» |
| Sven I4 2 (Fehler doppelt) | Behoben: Kästchen und Fehler ausserhalb der Live-Region |
| Sven I4 3 (Fehler erst nach 37 Wörtern Hilfe) | Teilweise: Die Hilfe hat jetzt 31 Wörter, `Checkbox.svelte:35` liest weiter Hilfe vor Fehler (N-3) |
| Sven I4 8 (Kästchen vor dem Vertragsbeginn) | Behoben, getestet. Den Fehler am Feld gibt es weiter erst beim Absenden, das war ein Vorschlag, kein Anspruch |
| Anna I3 M1–M3 | Als A-10 aufgeschrieben, nicht umgesetzt. So auch in `offene-punkte.md` |

## Übersicht neue Findings

| # | Schwere | Finding |
|---|---|---|
| N-1 | mittel | Die Formel nimmt den heutigen Vertragsbeginn statt des Beginns beim Erstellen der Abrechnung. Nach einem vorverlegten Beginn (vom Formular vorgesehen) nimmt das Backend ein Vertragsende an, das abgerechnete Mietstage wegnimmt, und lehnt einen korrekten Beginn ab |
| N-2 | mittel | Ein späteres Vertragsende (jetzt ausdrücklich getestet und in A-2 beschrieben) lässt die Abrechnung unverändert. Ihr PDF druckt danach das neue Ende neben den alten Mietstagen, die Heizmonate werden mit dem neuen Ende gerechnet |
| N-3 | niedrig | Copy-Reste aus M-6 und M-7: «mit diesem Datum» ohne Bezug, versendete Abrechnung ohne Ausweg, «der Vermieter» statt «Sie», Fehler am Kästchen nach 31 Wörtern Hilfe. `offene-punkte.md` führt M-6, M-7 und Sven 3 als behoben |
| N-4 | niedrig | Die leere Live-Region ist ein Flex-Kind: 16 px zusätzlicher Abstand im Dialog «Beenden» und im Panel «Vertragsdauer», auch ohne Hinweis |
| N-5 | niedrig | A-10: Das Szenario nennt keinen Entwurf, «die Folge bestätigt» ist doppeldeutig, das Löschen des Entwurfs wird nicht geprüft. Der Weg über «Bearbeiten» fehlt |
| N-6 | niedrig | Tests und Formales: Prettier (2 neue Zeilen), ein veralteter Kommentar, M-5 im Formular ungetestet, Negativprüfung im Dialog-Test ohne Anker, kein Szenario für die neue Regel zum Vertragsbeginn |

## Findings

### N-1 (mittel) Ein vorverlegter Vertragsbeginn verschiebt die abgerechneten Mietstage

`backend/src/services/contract.service.ts:295-296`. `billedFrom` nimmt `current.startDate`, also den Vertragsbeginn **heute**. `rental_days` wurde aber mit dem Beginn **beim Erstellen der Abrechnung** gerechnet. Ein späterer Beginn wird abgelehnt, ein früherer angenommen (`contract.service.ts:308`, nur `startDate > billedFrom`). Nach einem früheren Beginn stimmt die Rückrechnung nicht mehr. Das Formular «Bearbeiten» sieht das Vorverlegen ausdrücklich vor (`ContractForm.svelte:58-59`, «Only a start moved before the saved one … is questioned»).

Mit Sonde 1 geprüft: Vertrag ab 01.03.2025, Entwurf 2025 mit 306 Mietstagen (01.03.–31.12.2025). Beginn auf 01.02.2025 vorverlegt → 200. Danach rechnet die Prüfung 01.02. + 306 − 1 = 03.12.2025.

Fehlerszenario: Frau Huber ist schon am 01.02.2025 eingezogen, erfasst war der 01.03. Der Verwalter korrigiert den Vertragsbeginn unter «Bearbeiten». Im Dezember zieht sie aus, er beendet den Vertrag auf den 15.12.2025. Dwello nimmt das an, obwohl der Entwurf bis 31.12. rechnet. Ein Nachmieter ab 16.12. bekommt in seiner Abrechnung dieselben 16 Tage noch einmal. Genau das soll die Regel verhindern. Umgekehrt: Merkt der Verwalter, dass der 01.03. doch stimmte, und stellt zurück, lehnt Dwello mit 409 ab und rät, einen korrekten Entwurf zu löschen. Das Gleiche gilt für Verträge, deren Beginn vor dieser Änderung ungeprüft verschoben wurde.

Fix, eine von zwei Varianten:
- Den abgerechneten Bereich beim Erstellen speichern (`rental_start`, `rental_end` in `utility_statements`, bis zur ersten Installation in `0001_schema.sql`, dazu `schema.ts` und `data-model.md`). Die Prüfung vergleicht direkt damit. Das behebt auch N-2, weil das PDF dann den gespeicherten Bereich druckt.
- Minimal ohne Schemaänderung: Jede Änderung des Beginns ablehnen, wenn eine Abrechnung des Vertrags den heutigen Beginn enthält (`period_start <= current.startDate <= period_end`). Dann bleibt der gespeicherte Beginn der Beginn beim Erstellen, und die Formel stimmt. Der Entwurf rechnet bei einem früheren Beginn ohnehin zu wenig ab und muss neu erstellt werden.
- Test zuerst in `contract-end.pg.test.ts`: Vertrag ab 01.03.2025, Abrechnung 2025, Beginn 01.02.2025, danach Ende 15.12.2025 → 409.

### N-2 (mittel) Nach einem späteren Vertragsende druckt die Abrechnung falsche Daten

`backend/src/services/statement-pdf.service.ts:129-139,185-188`, `pdf.service.ts:484`. Das PDF liest Ein- und Auszug aus dem **heutigen** Mietvertrag, die Mietstage aus der Abrechnung. Ein späteres Vertragsende nimmt das Backend an (`contract-end.pg.test.ts:102`, «nimmt ein späteres Vertragsende an»). A-2 und `offene-punkte.md` beschreiben das als gewollt («a later end is accepted»). Das PDF eines Entwurfs wird jeden Tag neu erzeugt (`getStatementPdf`, `stale`). Das einer versendeten Abrechnung beim Markieren als bezahlt.

Mit Sonde 2 geprüft: Vor der Änderung «01.01.2025 – 30.06.2025 (181 Mietstage von 365 Tagen)», nach `endDate: 2025-08-31` «01.01.2025 – 31.08.2025 (181 Mietstage von 365 Tagen)». `heatingOf` rechnet Monate und Prozent des Heizprofils mit dem neuen Ende, die Beträge bleiben die alten.

Fehlerszenario: Der Verwalter trägt den Auszug zuerst auf den 30.06. ein und erstellt die Schlussabrechnung. Dann erfährt er, dass der Mieter bis 31.08. bleibt, und korrigiert das Ende. Dwello nimmt das ohne Hinweis an. Der Mieter erhält eine Abrechnung über acht Monate Mietverhältnis mit den Kosten von sechs. Juli und August trägt still der Vermieter. Die Abrechnung ist für den Mieter nicht nachvollziehbar.

Fix: Variante 1 aus N-1 (gespeicherter Bereich) behebt das PDF. Fachlich zusätzlich entscheiden: Ein Vertragsdatum, das einer Abrechnung Mietstage **hinzufügt**, macht den Entwurf ebenso falsch wie eines, das Tage wegnimmt. Entweder mit gleicher 409 ablehnen («Löschen Sie zuerst den Entwurf …»), oder annehmen und den Entwurf als veraltet markieren. A-2 und den Test «nimmt ein späteres Vertragsende an» entsprechend anpassen. Bis zum Entscheid als offenen Punkt in `offene-punkte.md` eintragen.

### N-3 (niedrig) Copy-Reste aus M-6 und M-7

- `src/lib/contract-status.ts:72-76`: «… rechnet Mietstage ab, die **mit diesem Datum** wegfallen.» Im Formular steht die Meldung unten in «Der Mietvertrag wurde nicht gespeichert». Das Formular sendet Beginn und Ende, welches Datum gemeint ist, bleibt offen. Fix: «mit dem neuen Vertragsende» bzw. «mit dem neuen Vertragsbeginn», je nachdem, was sich geändert hat, oder den Tag nennen.
- Versendete Abrechnung: «Dwello ändert eine versendete Abrechnung nicht. Prüfen Sie das Datum.» Ist der Mieter wirklich früher ausgezogen, gibt es keinen Weg. `offene-punkte.md:206` sagt «correct it outside Dwello». Fix: «Stimmt das Datum, berichtigen Sie die Abrechnung ausserhalb von Dwello.» Wie man danach den Vertrag trotzdem korrigiert, als offenen Punkt eintragen.
- `src/routes/contracts/PastEndConfirm.svelte:53`: «Die Nebenkosten dieser Zeit trägt **der Vermieter**». CLAUDE.md verlangt «Sie», M-7 schlug «… tragen Sie» vor. Helga (I4, Schritt 11) musste es übersetzen: «Aha, das zahle also ich.» Fix: «Die Nebenkosten dieser Zeit tragen Sie.»
- `src/lib/ui/Checkbox.svelte:35`: Hilfe vor Fehler in `aria-describedby`, die Hilfe hat 31 Wörter. Sven I4 (3) hört den Fehler weiter erst danach. Fix: Fehler zuerst (`…-error …-help`) oder `aria-errormessage`.
- `offene-punkte.md` (Session 12, Runde 5) nennt M-6, M-7 und «Sven 1–3» als behoben. Fix: als teilweise führen oder die Punkte oben umsetzen.

### N-4 (niedrig) Die leere Live-Region braucht Platz

`src/routes/contracts/PastEndConfirm.svelte:40`. Das `<p aria-live>` steht immer im DOM und ist direktes Kind eines Flex-Containers mit `gap-4`: im Dialog `Dialog.svelte:128`, im Formular `Panel.svelte:14`. Ein leeres Flex-Kind erhält trotzdem einen Abstand. Ohne Hinweis stehen im Dialog zwischen Feld «Vertragsende» und dem Satz «Prüfen Sie Frist und Termin …» 32 statt 16 px. Im Panel «Vertragsdauer» stehen unter dem letzten Feld 40 statt 24 px, auf jedem Formular «Bearbeiten».

Fehlerszenario: Kein Funktionsfehler. Der Abstand bleibt im 8-px-Raster, wirkt aber wie ein fehlendes Element. Er ist in beiden Ansichten anders als in den übrigen Panels.

Fix: Live-Region und Kästchen in ein Element ohne eigenen Abstand legen, z. B. `<div>` mit der Region und darunter `{#if past}<div class="mt-4">…</div>{/if}` als einziges Flex-Kind. `display: none` für die leere Region ist keine Lösung, weil Screenreader eine Region nicht zuverlässig ansagen, die eben noch nicht dargestellt war.

### N-5 (niedrig) A-10 ist noch nicht eindeutig prüfbar

`docs/anforderungen-vertragsende.md:268-289`.
- Das Szenario sagt «gibt es die Abrechnung 2025». A-10.2 gilt nur für «genau einen Entwurf». Ist die Abrechnung versendet, gibt es die Aktion nicht. Fix: «gibt es den Entwurf der Abrechnung 2025».
- «und die Folge bestätigt» ist im bestehenden Schritt die Bestätigung des vergangenen Endes. Danach kommt in A-10.2 eine zweite Bestätigung («Der Entwurf NK-… wird gelöscht …»). Welche Bestätigung welcher Schritt meint, bleibt offen. Fix: eigener Schritt «Und bestätigt, dass der Entwurf gelöscht wird».
- Geprüft wird nur das Vertragsende und der Assistent. Dass der Entwurf weg ist, prüft kein `Dann`. Fix: «Und gibt es für "Anna Keller" keine Abrechnung 2025».
- Seit dieser Änderung lehnt Dwello auch unter «Bearbeiten» und bei einem späteren Vertragsbeginn ab. A-10 nennt nur «geänderten Vertragsende» und eine Aktion «… und Mietvertrag beenden». Fix: A-10.1 für beide Wege. Für «Bearbeiten» festhalten, ob es die Aktion gibt («Entwurf löschen und speichern») oder nur den Link.

A-7 ist jetzt widerspruchsfrei und mit einer zweiten Wohnung erfassbar. A-7.3 stimmt für Verträge mit Abrechnung, solange N-1 nicht greift.

### N-6 (niedrig) Tests und Formales

- `bunx prettier --check`: `src/__tests__/contract-detail-page.dom.test.ts:192` und `:208` sind neu und nicht formatiert.
- `src/__tests__/contract-status.test.ts:81`: Der alte Kommentar «… nach dem neuen Vertragsende ab» steht noch über dem neuen in Zeile 82.
- `contract-detail-page.dom.test.ts:197-209` «nimmt die Meldung am Kästchen zurück» prüft nach dem neuen Datum nur `not.toContain('Bitte bestätigen Sie')`. Kein positiver Anker, dass das Kästchen für 30.09.2026 da ist und ohne `aria-invalid`. Der Test bliebe grün, wenn das Kästchen ganz verschwände. Fix: `expect(byTestId('contract-end-past-confirm')!.getAttribute('aria-invalid')).toBeNull()`.
- M-5 im Formular «Bearbeiten» ist ungetestet. Dort läuft der Fehler über den Setter `errors.pastConfirmed`, nicht über `pastError`. Fix: denselben Test in `contract-edit.dom.test.ts`.
- Die neue Regel «späterer Vertragsbeginn wird abgelehnt» ist eine Verhaltensänderung, die der Verwalter im Formular sieht. Es gibt sie nur als pg-Test, ohne Szenario in `contract-edit.feature` (CLAUDE.md, Workflow 1 und 4). Die Kommentare der beiden Szenarien zur Ablehnung («enthält schon Mietstage bis Ende Jahr») stimmen weiter.

## Ohne Befund

- **Entfernte und un-exportierte Funktionen:** `contractExists` und `checkContractOverlap` haben ausserhalb von `contract.service.ts` keinen Aufrufer. Demo-Daten, Skripte und Tests sind nicht betroffen. `createContract` nutzt `checkContractOverlap` im selben Modul. Typecheck sauber.
- **`checkNewDates`:** Gleiches Verhalten wie vorher für Überschneidungen (400 vor 409). Ein `PUT` ohne Datumsfelder prüft nichts. `endDate: null` prüft nur den Beginn. `startDate` ohne Änderung ist nie grösser als `billedFrom`. 404 kommt vor der Prüfung.
- **`$effect` in `PastEndConfirm`:** Beim ersten Rendern gilt `errorFor === endDate`, nichts wird geleert. Derselbe Tag noch einmal ändert das Signal nicht, der Effekt läuft nicht. Der Dialog setzt den Fehler nach `flushSync` bei gleichem `endDate`, der Effekt läuft deshalb nicht und löscht ihn nicht. Im Formular gilt dasselbe für `save()`. `normalizeAmounts` setzt gleiche Strings, ein `$state`-Proxy meldet dann keine Änderung. `errorFor` ist kein Signal, es entsteht keine Schleife.
- **Live-Ansage (WCAG 4.1.3):** Der Text hängt nur an `past` und `longAgo`, nicht am Tag. `DateInput` liefert bis zum vollständigen Datum `''`, die Region leert sich beim Korrigieren und füllt sich einmal pro vollständigem Datum. Kein Ansagen bei jedem Tastendruck. Zwischen zwei vergangenen Tagen ändert sich der Text nur, wenn die Jahres-Warnung kommt oder geht.
- **`''` im Formular bei unverändertem Ende:** `past` ist dann `false`, die Region bleibt leer, ein gesetzter Fehler wird geleert. Wechsel auf «Unbefristet» leert ebenso.
- **Vor dem Vertragsbeginn:** `startDate.slice(0, 10)` verträgt einen ISO-Wert mit Zeit. Das Backend liefert `date` als `YYYY-MM-DD`, die Detailseite nutzt dieselbe Kürzung für `min`. Gleicher Tag wie der Beginn zählt wie in `contractEndError` nicht als «davor».
- **Aktion `end`:** 409 mit `statements` → Meldung, 409 ohne JSON oder ohne Array → allgemeine Meldung im Dialog, kein Absturz (getestet).
- **Copy:** «versendet» und «Entwurf» wie im Glossar, Mehrzahl korrekt («Die Nebenkostenabrechnungen … und … (Entwürfe) rechnen …»). Kurze Ansage mit Verb. Schweizer «ss», «Sie»-Form in den neuen Sätzen.
- **Vertrag `contract-end-refused.json`:** Form unverändert (`periodEnd` bleibt in der Antwort), nur `error` neu, gegen die echte API geprüft.
- **Tests schlagen ohne die Änderung fehl:** Gleiches Ende mit neuer Miete (vorher 409), früheres Ende, späterer Beginn (vorher 200), Region im Formular vor «Befristet», kein Kästchen vor dem Beginn, Fehler weg nach neuem Datum.
- **Formales:** Conventional Commit mit 42 Zeichen im Subject. `implementation_plan.md`, `design-decisions.md`, `api-specification.md` und `offene-punkte.md` sind nachgeführt. ESLint und Backend-Typecheck sind sauber.
