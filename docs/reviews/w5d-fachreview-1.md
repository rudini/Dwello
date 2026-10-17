# Fachreview #133 «Abgerechnet bis»: @wip-Szenarien (Commit fde5afc), Runde 1

Gegenstand: `git show fde5afc` im Worktree `review-w5d-fach`: die Szenarien in `statement-generate.feature`, `contract-detail.feature` und `contract-edit.feature`, ihre Steps und die geplante Umsetzung samt Texten (Auftrag).
Quellen: `UBIQUITOUS_LANGUAGE.md:46-47, 155, 156, 160, 162`, `docs/nebenkostenabrechnung-anforderungen.md`, `docs/anforderungen-vertragsende.md:86`, `docs/PRD-Dwello.md:394, 440-460`, Issues #133 (mit Kommentar vom 16.10.2026), #199, #211, #281, Code im Worktree, Fedlex (siehe unten).

Fedlex-Fassungen, abgerufen am 16.10.2026 aus dem Fedlex-Filestore:
- VMWG, SR 221.213.11, Stand 1.10.2025: `https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/1990/835_835_835/20251001/de/html/fedlex-data-admin-ch-eli-cc-1990-835_835_835-20251001-de-html.html`
- OR, SR 220, Stand 1.10.2026: `https://fedlex.data.admin.ch/filestore/fedlex.data.admin.ch/eli/cc/27/317_321_377/20261001/de/html/fedlex-data-admin-ch-eli-cc-27-317_321_377-20261001-de-html-3.html`

## Befunde

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Akonto-Regel (Akontobeiträge erst ab dem Tag danach) prüft kein Szenario. Das Akonto steht im Seed auf 0, und kein Saldo wird geprüft |
| M-1 | Mietrecht | Major | Das PDF (und die Detailseite der Abrechnung) würde «Ihr Mietverhältnis in dieser Periode: 01.03.2024 – 31.03.2024» drucken. Das ist für den Mieter falsch, und der Plan nennt das PDF nicht |
| V-2 | Verwalter | Major | Ein Ändern von «Abgerechnet bis» bei bestehenden Abrechnungen ist nicht geregelt. Die bestehende Sperre für abgerechnete Mietstage (#141) würde ausserdem jede spätere Änderung der Vertragsdaten fälschlich ablehnen |
| V-3 | Verwalter | Minor | Szenario 1 trifft die Regel «Periode endet bis dahin» nicht. Eva hat einfach keine Tage nach dem 31.03. Die Grenze «Periodenende = Abgerechnet bis» prüft im Lauf kein Szenario |
| V-4 | Verwalter | Minor | Der Hinweis auf fehlende Abrechnungen ist nur für die übergangene Periode geprüft, nicht für eine Periode, die über «Abgerechnet bis» hinausreicht (sie muss weiter fehlen) |
| V-5 | Verwalter | Minor | Der Hilfetext ist zum Teil unklar («bis zu einem Tag», «Abrechnungsperioden … erhalten keine Abrechnung»). Ein Beispiel für den Wechsel der Abrechnungsperiode fehlt |
| V-6 | Verwalter | Minor | Die Vorschau sagt nicht, warum ein Mietvertrag fehlt oder kürzer abgerechnet wird. Sind alle Mietverträge übergangen, meldet sie fälschlich «keine Mietverträge» |
| V-7 | Verwalter | Minor | Das Feld gibt es nur im Bearbeiten, nicht im Assistenten «Neuer Mietvertrag», wo bestehende Verträge beim Wechsel zu Dwello erfasst werden. Der Zusatzsatz im Hinweis ist durch kein Szenario abgedeckt |
| V-8 | Verwalter | Minor | Das Glossar und die App-Hilfe «Mietstage» und «Geleistete Akontobeiträge» sprechen weiter von der ganzen Abrechnungsperiode. Für «Abgerechnet bis» fehlt ein Eintrag in `i18n-begriffe.md` |
| V-9 | Verwalter | Nit | Szenario 2 prüft nicht, dass der Anteil von Marc Huber gleich bleibt. Ein Szenario mit Heizprofil fehlt |

---

### V-1 (Major): Akonto ab dem Tag danach ist nicht abgedeckt

**Beleg.** `UBIQUITOUS_LANGUAGE.md:47`: «… zählen Mietstage und geleistete Akontobeiträge erst ab dem Tag danach.» Das Szenario «Nach «Abgerechnet bis» zählen die Mietstage ab dem Tag danach» (`statement-generate.feature`, neu, Z. 130-136) prüft nur «kostet die Abrechnung» (`totalCostsOf`, `statement-generate.steps.ts:248`). Eva Frei wird mit «mietete … für "950" Franken» angelegt. Der Seed setzt dann `monthlyAdvancePayment: '0'` (`tests/e2e/fixtures/backend.ts:158`).

**Warum falsch.** Der Saldo ist der Betrag, den der Mieter bezahlt oder zurückerhält. Rechnet Dwello das Akonto weiter ab Vertragsbeginn, erhält Eva die Akontobeiträge für Januar und Februar ein zweites Mal zurück, obwohl die Abrechnung ausserhalb von Dwello sie schon verrechnet hat. Das ist genau die Doppelabrechnung, die der Entscheid vom 16.10.2026 verhindern soll. Bliebe `calculateTotalAdvancePayments` (`calculation.service.ts:228`, heute ab `contractOverlap.overlapStart`) unverändert, bliebe das Szenario trotzdem grün.

**Nachgerechnet** (Hauswart 732.00 für 2024 = 2.00 pro Tag, 3 % Verwaltungspauschale, Akonto 120.00 pro Monat):
- Abgerechnet bis 29.02.2024: 31 Mietstage, 62.00 + 1.86 = 63.86. Akonto nur März: 120.00. Saldo 63.86 − 120.00 = −56.14, auf 5 Rappen −56.15 (Rückerstattung). Ohne die Regel wären es 3 × 120.00 = 360.00 und der Saldo −296.15.
- Grenzfall mitten im Monat, abgerechnet bis 15.03.2024: 16.03.–31.03. = 16 Mietstage, 32.00 + 0.96 = 32.96. Akonto 120.00 × 16/31 = 61.94. Saldo −28.98, auf 5 Rappen −29.00.
- Grenzfall null: abgerechnet bis 31.03.2024 = Vertragsende, 0 Mietstage, keine Abrechnung (Szenario 1).

**Behebung.** Im Szenario 2 mit «"Eva Frei" mietete die Wohnung "3.01" von "2024-01-01" bis "2024-03-31" für "950" Franken mit "120" Franken Akonto» anlegen (der Step besteht, `contracts.steps.ts:35`). Dann zusätzlich «Und beträgt der Saldo von "Eva Frei" "-56.15"» prüfen (Vorzeichen wie in `statement-rounding.feature:20`). Ein Unit- oder pg-Test für den Fall mitten im Monat (−29.00).

### M-1 (Major): Das PDF nennt ein falsches Mietverhältnis

**Beleg.** `backend/src/services/pdf.service.ts:82`: `tenancyLine: 'Ihr Mietverhältnis in dieser Periode: {start} – {end} ({days} Mietstage von {total} Tagen)'`, befüllt mit `rentalStart`/`rentalEnd` der Abrechnung (`pdf.service.ts:539`, `statement-pdf.service.ts:177`). Der Plan setzt den ersten abgerechneten Tag als Beginn der Mietstage. Im Beispiel speichert die Abrechnung dann `rental_start = 2024-03-01`, und das PDF druckt «Ihr Mietverhältnis in dieser Periode: 01.03.2024 – 31.03.2024 (31 Mietstage von 366 Tagen)». Das Mietverhältnis lief aber ab 01.01.2024. Die Anforderung `docs/nebenkostenabrechnung-anforderungen.md:41` verlangt «Abrechnungsperiode und Mietdauer in der Periode» (unsicher-B).

**Warum falsch.** Für den Mieter ist das eine falsche Angabe über seinen eigenen Vertrag, und ohne Erklärung kann er sie nicht nachvollziehen. Er vergleicht mit seinem Mietvertrag und der früheren Abrechnung, oder er verlangt Einsicht. Art. 257b Abs. 2 OR: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.» Die Belege der Periode decken das ganze Jahr. Ob eine solche Angabe die Abrechnung rechtlich mangelhaft macht, ist **unsicher**: Fedlex enthält keinen Wortlaut zur Nachvollziehbarkeit. Für einen Verwalter ist es klar ein Fehler im Dokument an den Mieter. Dasselbe gilt für die Detailseite der Abrechnung in der App (`src/lib/server/statement.ts:78-79`).

**Behebung.** Den Plan um das PDF und die Detailseite ergänzen. Das ist ein PDF-Text, deshalb auch `daten-pruefer`. Vorschlag (Begriff aus dem Glossar):
«Ihr Mietverhältnis in dieser Periode: 01.01.2024 – 31.03.2024. Abgerechnet bis 29.02.2024; diese Abrechnung umfasst 01.03.2024 – 31.03.2024 (31 Mietstage von 366 Tagen).»
Bei «Geleistete Akontobeiträge» denselben Zeitraum nennen («ab 01.03.2024»). Den Wortlaut in FR/IT/EN muss der Produktverantwortliche entscheiden, siehe «Fehlende Begriffe». Dazu ein Szenario oder einen PDF-Test, der die Zeile prüft.

### V-2 (Major): Ändern von «Abgerechnet bis» und die Sperre der abgerechneten Mietstage

**Beleg.** `backend/src/services/contract.service.ts:313-331` (`statementsChanged`) vergleicht `greatest(period_start, startDate)` mit dem gespeicherten `rental_start` jeder Abrechnung. `docs/anforderungen-vertragsende.md:86`: «Das Backend lehnt neue Vertragsdaten ab, die diese Tage ändern würden, kürzer oder länger». Der Plan sagt «No validation beyond being a date».

**Warum falsch.** Hier gibt es zwei Folgen.
1. Wird `rental_start` neu der Tag nach «Abgerechnet bis» (01.03.2024), ist `greatest(2024-01-01, 2024-01-01) = 2024-01-01 ≠ 2024-03-01`. Die Abrechnung 2024 von Eva gilt dann bei jeder späteren Änderung von Vertragsbeginn oder -ende als geändert, und Dwello lehnt zum Beispiel ein korrigiertes Vertragsende ab («… lässt sich nicht speichern»), obwohl sich nichts an ihren Mietstagen ändert.
2. Trägt der Liegenschaftsverwalter «Abgerechnet bis» nachträglich ein oder verschiebt es, nachdem Dwello für eine betroffene Periode schon eine Abrechnung erstellt hat (Entwurf, versendet, bezahlt), widerspricht die gespeicherte Abrechnung der neuen Regel. Beispiel: Die Abrechnung 2024 ab 01.01. ist versendet, dann folgt «Abgerechnet bis 31.12.2024». Die Abrechnung bleibt, und der Mieter ist für 2024 zweimal abgerechnet, ohne dass Dwello etwas sagt. Für Vertragsdaten hat der Produktverantwortliche genau das gesperrt (#141, `anforderungen-vertragsende.md:86`).

**Behebung.** `statementsChanged` mit demselben ersten abgerechneten Tag rechnen (der Helper des Plans, also auch im Backend). Ein neues oder geändertes «Abgerechnet bis», das die Mietstage einer gespeicherten Abrechnung ändert, gleich behandeln wie neue Vertragsdaten: bei einem Entwurf den Entwurf nennen, bei einer versendeten oder bezahlten Abrechnung ablehnen. Dazu je ein Szenario (bzw. `*.pg.test.ts`). Wird das nicht in #133 gelöst: ein Issue `fachlich`, `entscheiden`, und bis dahin mindestens Punkt 1 beheben, sonst blockiert die neue Spalte bestehende Abläufe.

### V-3 (Minor): Szenario 1 prüft die Grenze der Regel nicht

**Beleg.** `statement-generate.feature` neu: «Ein ausserhalb von Dwello abgerechneter Mietvertrag erhält keine Abrechnung». Eva hat abgerechnet bis 31.03.2024, die Periode endet am 31.12.2024. Die Periode endet also nicht «bis dahin» (`UBIQUITOUS_LANGUAGE.md:47`). Eva fällt nur weg, weil nach dem 31.03. keine Mietstage bleiben (Vertragsende 31.03.2024).

**Warum.** Mit dem geplanten Helper (erster Tag = später von Vertragsbeginn und Tag nach «Abgerechnet bis») sind beide Fälle dieselbe Regel. Das ist **bestätigt**: «Periode endet am oder vor dem Datum» heisst dasselbe wie «keine Tage ab dem Tag danach in der Periode». Das Szenario prüft aber nicht den Fall aus dem Entscheid, nämlich einen laufenden Vertrag und eine Periode, die genau an «Abgerechnet bis» endet. Ein Fehler mit `<` statt `<=` an der Grenze bliebe unentdeckt.

**Behebung.** Das Szenario so ändern, dass Marc Huber bis "2024-12-31" ausserhalb von Dwello abgerechnet ist und die Vorschau nur die Abrechnung von Eva Frei enthält (Grenze = Periodenende). Oder ein zweites Beispiel dazu. Der Grenzfall bis "2024-12-30" ergäbe für Marc 1 Mietstag.

### V-4 (Minor): Hinweis auf fehlende Abrechnungen bei einer Periode über das Datum hinaus

**Beleg.** `contract-detail.feature` neu: Nur der Fall «Abgerechnet bis = Ende 2024» ist geprüft. `UBIQUITOUS_LANGUAGE.md:46`: «… Abrechnungsperioden …, in denen der Mietvertrag Mietstage, aber keine Abrechnung hat … seit «Abgerechnet bis»».

**Warum.** Der wahrscheinlichste Fall beim Wechsel zu Dwello ist eine andere Abrechnungsperiode, zum Beispiel ausserhalb abgerechnet Juli 2023 – Juni 2024 und in Dwello das Kalenderjahr. Dann muss 2024 weiter als fehlend erscheinen, weil 01.07.–31.12.2024 offen sind. Ein Helper, der Perioden schon übergeht, sobald sie *beginnen* vor «Abgerechnet bis», würde die Lücke verstecken, und der Mieter erhielte für diese Tage nie eine Abrechnung (Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»).

**Behebung.** Ein zweites Beispiel: Anna Keller ist bis "2024-06-30" ausserhalb von Dwello abgerechnet, und der Mietvertrag meldet die fehlende Abrechnung 2024 (Step besteht, `contract-detail.feature:231`).

### V-5 (Minor): Hilfetext

**Beleg.** Vorgeschlagener Text (Auftrag): «Nur ausfüllen, wenn Sie die Nebenkosten dieses Mietvertrags bis zu einem Tag ausserhalb von Dwello abgerechnet haben, … Abrechnungsperioden, die bis dahin enden, erhalten keine Abrechnung. Reicht eine Abrechnungsperiode darüber hinaus, zählen Mietstage und Akonto erst ab dem Tag danach.»

**Warum.**
- «bis zu einem Tag» lässt sich als «höchstens einen Tag» lesen. Gemeint ist der letzte Tag der letzten Abrechnung ausserhalb von Dwello. Das ist die Angabe, die ein Verwalter auf seiner alten Abrechnung findet («Abrechnungsperiode 01.07.2023 – 30.06.2024»).
- Nicht die Abrechnungsperiode erhält eine Abrechnung, sondern der Mietvertrag.
- «Akonto» ist im Glossar der monatliche Vorschuss (`UBIQUITOUS_LANGUAGE.md`, «Akonto»). Gezählt werden die «geleisteten Akontobeiträge» (`:47`, `:155`).
- Ein Vorbesitzer als Beispiel fehlt (#133 nennt «by the previous owner»).

**Vorschlag.**
«Nur ausfüllen, wenn die Nebenkosten dieses Mietvertrags schon ausserhalb von Dwello abgerechnet sind, zum Beispiel von Ihnen vor dem Wechsel zu Dwello oder vom früheren Eigentümer. Tragen Sie den letzten Tag der letzten solchen Abrechnung ein, zum Beispiel 30.06.2024 bei einer Abrechnungsperiode Juli 2023 – Juni 2024. Dwello rechnet erst ab dem Tag danach ab: Für Abrechnungsperioden, die bis dahin enden, erstellt Dwello keine Abrechnung. Reicht eine Abrechnungsperiode darüber hinaus, zählen Mietstage und geleistete Akontobeiträge erst ab dem Tag danach.»
Der Step prüft «erst ab dem Tag danach» (`contract-form.steps.ts`, neu), und der Vorschlag enthält diese Worte. Den Zusatzsatz im Hinweis auf fehlende Abrechnungen bestätige ich so («Haben Sie eine dieser Perioden ausserhalb von Dwello abgerechnet? Tragen Sie beim Bearbeiten des Mietvertrags «Abgerechnet bis» ein.»).

### V-6 (Minor): Die Vorschau erklärt das Übergehen nicht

**Beleg.** Szenario 1 erwartet in der Vorschau nur «genau 1 Abrechnung». Eva fehlt ohne Hinweis. `statement-generate.feature:117-119`: «meldet die Vorschau, dass es in der Periode keine Mietverträge gibt».

**Warum.** Ein Liegenschaftsverwalter, der Dwello wenige Male im Jahr braucht, sieht in der Vorschau einen fehlenden Mieter oder einen auffällig tiefen Betrag (63.86 statt 187.46) und hält das für einen Fehler. Sind alle Mietverträge eines Gebäudes übergangen, meldet die Vorschau «keine Mietverträge in der Periode». Das stimmt nicht, denn es gibt sie, nur sind sie schon abgerechnet.

**Behebung.** In der Vorschau je betroffenen Mietvertrag eine Zeile, zum Beispiel «Eva Frei: abgerechnet bis 29.02.2024, Mietstage ab 01.03.2024» bzw. «Eva Frei: abgerechnet bis 31.03.2024, keine Abrechnung». Wenn alle übergangen sind, einen eigenen Text statt «keine Mietverträge». Dazu je ein Szenario. Gehört das nicht zu #133: ein Issue (`fachlich`).

### V-7 (Minor): Feld nur im Bearbeiten

**Beleg.** Plan: «only in the edit form of a contract (not in the new-contract wizard)». Der neue Satz im Hinweis auf fehlende Abrechnungen führt zum Bearbeiten, aber kein Szenario prüft ihn.

**Warum.** Beim Wechsel zu Dwello erfasst der Liegenschaftsverwalter seine laufenden Mietverträge im Assistenten, mit einem Vertragsbeginn in der Vergangenheit. Genau dann weiss er, bis wann er abgerechnet hat. Ohne das Feld dort sieht er danach auf der Vertragsseite zuerst «Abrechnungen fehlen» (#133, Kommentar vom 15.10.2026: Personas Helga und Anna, Major) und muss den Vertrag nochmals öffnen. Mit dem Zusatzsatz im Hinweis ist der Weg auffindbar, deshalb nur Minor.

**Behebung.** Entweder den Zusatzsatz mit einem Szenario prüfen («meldet der Mietvertrag … und erklärt, wo «Abgerechnet bis» einzutragen ist»), oder das Feld im Assistenten zeigen, wenn der Vertragsbeginn vor der letzten beendeten Abrechnungsperiode liegt. Das zweite ist eine Produktentscheidung, also ein Issue `produkt`, `entscheiden`.

### V-8 (Minor): Mietstage und geleistete Akontobeiträge im Glossar und in der App-Hilfe

**Beleg.** `UBIQUITOUS_LANGUAGE.md:162` «Mietstage: Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft», `:155` «Geleistete Akontobeiträge: Summe der monatlichen Vorauszahlungen des Mieters während der Abrechnungsperiode», `messages/de.json:100` (`glossary_days_text`) sagt dasselbe. `docs/design/i18n-begriffe.md` hat keine Zeile für «Abgerechnet bis».

**Warum.** Mit «Abgerechnet bis» stimmen beide Definitionen für eine Periode über das Datum hinaus nicht mehr. Die PDF-Erklärung und die App-Hilfe würden dem Mieter bzw. dem Verwalter das Gegenteil von dem sagen, was Dwello rechnet. Das Glossar darf ich nicht ändern, das tut der Produktverantwortliche (schon in `glossary-decisions-fachreview-2.md` V-20 als optional vorgeschlagen).

**Behebung.** Siehe «Fehlende Begriffe». `glossary_days_text` in vier Sprachen ergänzen, sobald der Glossareintrag steht.

### V-9 (Nit): Szenario 2 prüft nicht, dass die anderen Anteile gleich bleiben, und es fehlt ein Heizprofil

**Beleg.** Plan: «the other tenants' shares do not change». Szenario 2 prüft nur Eva.

**Nachgerechnet.** Marc Huber 01.05.–31.12.2024 = 245 Mietstage, 490.00 + 14.70 = **504.70**, mit und ohne «Abgerechnet bis» von Eva. Die Tage vom 01.01. bis 29.02. trägt in Dwello niemand. Das ist richtig, weil sie ausserhalb abgerechnet sind (keine Überverteilung, Art. 257b Abs. 1 OR: «die tatsächlichen Aufwendungen des Vermieters»).
Heizprofil «Heizung + Warmwasser» (Jan 13.60, Feb 12.10, Mär 11.50 %, `0002_stammdaten.sql:65`), Heizungsrechnung 1000.00, eine Wohnung: ohne «Abgerechnet bis» Eva 37.2 % = 372.00 + 11.16 = 383.16. Abgerechnet bis 29.02.2024: nur März 11.5 % = 115.00 + 3.45 = **118.45**.

**Behebung.** Optional «Und kostet die Abrechnung von "Marc Huber" "CHF 504.70"». Für den Heizanteil einen pg-Test mit 118.45. Wer `handleMidYearMoves` (`prorating.service.ts:188`) ohne den neuen ersten Tag aufruft, rechnet sonst 383.16.

---

## Fehlende Begriffe (Issue mit `fachlich`, `entscheiden`)

1. **«Abgerechnet bis» in FR/IT/EN** (`docs/design/i18n-begriffe.md` hat keine Zeile). Vorschlag: FR «Décompté jusqu'au», IT «Conteggiato fino al», EN «Billed until». Hilfe nach V-5.
2. **PDF-Zeile für den Mieter** (M-1). Vorschlag: «Abgerechnet bis {Datum}; diese Abrechnung umfasst {Tag danach} – {Ende} ({n} Mietstage von {total} Tagen)». FR «Décompté jusqu'au {date} ; ce décompte couvre …», IT «Conteggiato fino al {data}; questo conteggio comprende …», EN «Billed until {date}; this statement covers …».
3. **Glossar «Mietstage» und «Geleistete Akontobeiträge»** (V-8). Vorschlag: «Mietstage: Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft, ab dem Tag nach «Abgerechnet bis», wenn es in die Periode fällt.» «Geleistete Akontobeiträge: Summe der monatlichen Vorauszahlungen des Mieters während seiner Mietstage in der Abrechnungsperiode.»

## Bestätigt

- **Regel und Helper:** Erster abgerechneter Tag = später von Vertragsbeginn und Tag nach «Abgerechnet bis». «Periode endet am oder vor dem Datum» ist damit dasselbe wie «keine Mietstage ab dem ersten Tag». Das passt zu #133 («skip periods that end on or before it») und zum Kommentar vom 16.10.2026 («bills only the days after that date»). Ein Datum vor dem Vertragsbeginn hat keine Wirkung. Das ist richtig, weil der Vertragsbeginn der spätere Tag ist.
- **Formel Szenario 2:** 732.00 / 366 = 2.00, 31 Tage (01.–31.03.2024) = 62.00, plus 3 % = 1.86, zusammen 63.86. Ohne die Regel 91 Tage = 182.00 + 5.46 = 187.46, das Szenario unterscheidet also. Die Grundlage hat keine weiteren Rechnungen, und Lindenhof hat in diesem Szenario nur Wohnung 3.01 (Wohnungsanteil 100 %).
- **Andere Mieter:** Anteile werden je Mietvertrag gerechnet (Wohnungsanteil × eigene Mietstage / abgerechnete Tage, `calculation.service.ts:134-142`) und nicht unter den Mietern normiert. Die Tage vor dem ersten Tag ändern also keinen anderen Anteil. Heizprofil gleich (`prorating.service.ts:209-227`, je Vertrag).
- **Heizprofil:** Mit dem ersten Tag als `contractStart` greift der Heizprofil-Anteil, sobald der Tag nach «Abgerechnet bis» in der Periode liegt (keine «wholePeriod»). Das ist richtig wie bei einem Einzug.
- **Akonto je Kalendermonat, Teilmonat nach Tagen** (`calculation.service.ts:228-247`): Mit dem ersten Tag als `rentalStart` ergibt sich 16/31 im Beispiel von V-1. Richtig.
- **Vertragsseite:** «Abgerechnet bis» nur zeigen, wenn gesetzt, Datum «31.12.2024». Das passt. Das Szenario der Vertragsseite ist bei Anna Keller (seit 01.04.2024, Abrechnung des letzten Jahres vorhanden) ohne das Datum rot (2024 fehlt, `contract-detail.feature:231`) und mit dem Datum grün. Es unterscheidet also.
- **Mietrecht:** Eine kürzere Abrechnung für den Rest der Periode ist zulässig. Art. 4 Abs. 1 VMWG verlangt die Abrechnung «jährlich mindestens einmal», keine bestimmte Periode. Nebenkosten nur bei Vereinbarung, Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Daran ändert #133 nichts. Keine Überverteilung, weil Dwello die bereits abgerechneten Tage niemandem verrechnet (Art. 257b Abs. 1 OR).
- **Abgrenzung:** #199 (Überlappung zählt als abgerechnet) und #281 ändern das Ergebnis der Szenarien nicht. #211 (Dashboard, Vertragsliste) ist entschieden und nennt #133 ausdrücklich als Grundlage. Der Helper sollte deshalb dort wiederverwendbar sein.

## Nicht bestätigt

- **Rechtliche Folge einer falschen Mietdauer im PDF** (M-1): Auf Fedlex gibt es keinen Wortlaut zur Nachvollziehbarkeit, gesucht in OR Art. 257a–257b und VMWG Art. 4–8. Das ist **unsicher**. Gestützt ist M-1 auf die Anforderung (unsicher-B) und die Praxis.
- **Wechsel der vertraglichen Abrechnungsperiode:** Ob der Vermieter die Abrechnungsperiode wechseln darf, wenn der Mietvertrag sie nennt (zum Beispiel Juli – Juni), ist nicht geprüft. Auf Fedlex habe ich nichts dazu gefunden (OR Art. 257a–257c, VMWG Art. 4). Es betrifft #133 nur am Rand.
- **Heizöl mit Tankbestand** (VMWG Art. 8 Abs. 2: «… über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen»): Bei «Abgerechnet bis» mitten in der Periode verteilt Dwello den Jahresverbrauch nach Heizprofil. Den Bestand am Tag von «Abgerechnet bis» kennt Dwello nicht. Ob die Abrechnung ausserhalb von Dwello denselben Verbrauch angesetzt hat, lässt sich nicht prüfen. Das ist üblich wie bei einem Mieterwechsel, aber nicht mit einer Quelle bestätigt.
- **Teilmonat im Heizprofil:** Wie `calculateHeatingShare` einen angebrochenen Monat (zum Beispiel ab 16.03.) gewichtet, habe ich nicht nachgerechnet. Nur ganze Monate sind geprüft (V-9).
- **Einzelne Abrechnung ausserhalb des Laufs:** Ob das Backend eine Abrechnung für eine ganz abgerechnete Periode ablehnt, wenn sie nicht über den Lauf des BFF kommt (zum Beispiel über den Link «Abrechnung erstellen» oder die API), steht nicht im Plan. Heute würde `CONTRACT_NOT_IN_PERIOD` (`calculation.service.ts:300`) nur greifen, wenn die Überlappung mit dem ersten Tag rechnet. Empfehlung: Die Regel im Backend durchsetzen, mit einem Code und einer Meldung `backend_<code>`.
- **«Rechnung schon abgerechnet» im Rechnungsformular** (#211, Kommentar aus #226) und das Dashboard: Beide nutzen «Abgerechnet bis» noch nicht und sind laut Auftrag in #211 ausserhalb. Bis dahin meldet das Dashboard eine Periode als «Noch nicht abgerechnet», die die Vertragsseite nicht mehr nennt. Diesen Widerspruch gibt es schon (#211). Er wird sichtbarer, ist aber dort entschieden.
- **Status der Glossarzeile:** Dass der Produktverantwortliche den Code-Vermerk «geplant (#133)» in `UBIQUITOUS_LANGUAGE.md:46-47` nach der Umsetzung anpasst, liegt nicht bei diesem Review.
