# Slice-Review «oldaddr» (#114), Runde 3 (letzte Runde)

Worktree: `review-oldaddr-code-3`, Commit `6ee33f2`, Bereich `git diff a454fa4 6ee33f2`. Gelesen habe ich alle 12 Dateien. `docs/reviews/oldaddr-review-2.md` und `docs/reviews/w3c-datenpruefung-1.md` habe ich als Berichte gelesen. Sie ändern kein Verhalten.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-16 | Major | `tests/e2e/features/statement-detail.feature:235-244`, `backend/src/services/statement.service.ts:494-495` | Der Fix von C-9 ist ein Fehler, den der Benutzer sieht: Nach «Als versendet markieren» zeigt das PDF die neue Adresse. Dafür gibt es kein Szenario und keinen Vermerk `No scenario: <reason>`. Das neue Szenario prüft nur den Download eines Entwurfs. Es bleibt grün, auch wenn Zeile 495 fehlt |
| C-17 | Minor | `backend/src/__tests__/statement-pdf.pg.test.ts:705-712` | Der neue Test lässt die gemeinsame Abrechnung `statementId` als versendet zurück. Danach schlägt `deleteStatement` in `afterAll` (Z. 52) fehl, ohne einen Fehler zu werfen (`STATEMENT_NOT_DRAFT`). Darum bleiben auch Vertrag, Mieter, Wohnung und Gebäude in `dwello_test` liegen. Die anderen Tests der Datei setzen vor dem Löschen zuerst `status: 'draft'` (Z. 663, 675) |
| C-18 | Minor | `docs/api-specification.md:225`, `backend/src/services/statement.service.ts:494` | «so the PDF as sent is made at that moment» bzw. «made with the tenant and settings of this moment» stimmt nicht genau. Das PDF entsteht erst beim ersten Abruf nach dem Versand (`getStatementPdf`, `!result.pdfBlob`). Was sich zwischen Versand und erstem Abruf ändert (Adresse, IBAN), steht also im «PDF as sent». Das war bei einem Versand an einem anderen Tag schon vorher so (`pdfOutdated`). Neu gilt es für jeden Versand |
| C-19 | Nit | `tests/e2e/features/statement-detail.feature:235` | Der Kommentar nennt Helga P-2 (IBAN). Das Szenario prüft aber nur die Adresse. Die IBAN prüft allein der pg-Test «nennt die IBAN, die jetzt in den Einstellungen steht» |

ponytail-review: Der Fix ist eine Zeile (`...(sentToday && { pdfBlob: null, pdfGeneratedAt: null })`). Die Spalte `statementDate` ist gestrichen (C-13), weiter ist nichts zu kürzen. net: 0.

## C-16 (Major): Kein Szenario für den Versand nach einer Adressänderung

**Warum falsch:** `CLAUDE.md`, Workflow Schritt 1, und die Pflichtliste verlangen für jede Verhaltensänderung ein Szenario in `tests/e2e/features`, ohne `@wip`. Das gilt auch für einen Fix, den der Benutzer sieht. C-9 ist so ein Fix. Das ist der zweite Teil von Anna P-1: Sie lädt das PDF, trägt die neue Adresse ein, markiert «als versendet» und lädt das PDF wieder. Ohne den Fix steht darin die alte Adresse. Die Commit-Nachricht nennt für C-9 kein Szenario und keinen Vermerk `No scenario: <reason>`. Der E2E-Stack kann den Zustand erzeugen, alle Schritte gibt es schon:
- «für die Abrechnung 2024 von … gibt es ein PDF» (`statements.steps.ts:137`, ruft `generate-pdf` im Backend auf)
- «die Korrespondenzadresse von … ist …, … in …»
- «der Liegenschaftsverwalter die Abrechnung versendet» (`statement-detail.steps.ts:111`)
- «… das PDF der Abrechnung herunterlädt»
- «steht im PDF …»

**So zeigt man es:** Man nimmt in `statement.service.ts:495` die Zeile `...(sentToday && { pdfBlob: null, pdfGeneratedAt: null })` heraus. Danach ist der pg-Test «versendet das PDF mit der Adresse beim Versand» rot, jedes E2E-Szenario bleibt aber grün. Das neue Szenario versendet nicht, und im Szenario «im Ausland» wird die Adresse vor dem PDF gesetzt.

**Behebung:** Das neue Szenario um den Versand erweitern oder ein zweites Szenario anlegen: PDF vorhanden, neue Korrespondenzadresse, «Wenn der Liegenschaftsverwalter die Abrechnung versendet», «Und … das PDF der Abrechnung herunterlädt», «Dann steht im PDF "Marktstätte 3 78462 Konstanz DEUTSCHLAND"». Das neue Szenario muss rot sein, solange Zeile 495 fehlt.

## Runde-2-Befunde, abgeglichen

- **C-9 (Major), im Code behoben:** `updateStatementStatus` verwirft das gespeicherte PDF bei jedem Übergang auf `sent` (`sentToday` ist nur dann ein Objekt). Danach entsteht es in `getStatementPdf` neu, über `!result.pdfBlob`. Der Ablauf ab dem Bezahlen bleibt: Der pg-Test «behält nach der Zahlung das PDF, wie es versendet wurde» erzeugt das PDF jetzt nach dem Versand neu und vergleicht danach weiter mit dem gespeicherten PDF. Rot ohne Fix, aus dem Code gelesen: `generateStatementPdf` datiert den Entwurf auf heute. Beim Versand am selben Tag liefert `datedToday` deshalb dieselben Werte für `statementDate` und `paymentDeadline`, und `pdfOutdated` ist falsch. Das gespeicherte PDF mit «Testgasse 5» bliebe stehen, und `toContain('Endgasse 9')` wäre rot. Offen: C-16, C-17, C-18. Saldo 0: Die Abrechnung ist beim Versand gleich bezahlt, und ihr PDF entsteht jetzt mit «Bezahlt am». An einem anderen Tag war das schon vorher so, und `resetPayment` verwirft dieses PDF folgerichtig (`pdfGeneratedAt >= paymentRecordedAt`). Ich werte das nicht als Befund. `demo-data.ts:51-55` erzeugt das PDF erst nach dem Versand und ist nicht betroffen.
- **C-10 (Major), behoben:** Das Szenario «Das PDF eines Entwurfs nennt die neue Korrespondenzadresse» legt das PDF vor der neuen Adresse an (`seed.statementPdf` → `POST generate-pdf`, Systemcode). Danach lädt es das PDF herunter und prüft den Adressblock. Ohne `|| result.status === 'draft'` in `getStatementPdf` käme das gespeicherte PDF mit der alten Adresse, und das Szenario wäre rot. Die Steps rufen nur `seed`, Tasks und Questions auf, und es gibt kein `@wip`. Die Formulierung ist fachlich, ohne «klickt» oder «Button».
- **C-11, behoben:** Die Spezifikation beschreibt das neu erstellte PDF eines Entwurfs und das Verwerfen beim Versand. Der Wortlaut ist ungenau, siehe C-18.
- **C-12, behoben:** Der Schritt heisst jetzt «nennt die Bestätigung die Korrespondenzadresse», in der Feature-Datei und in den Steps gleich. `grep "Postadresse" tests/` findet nichts mehr.
- **C-13, behoben:** `storedPdf` liest `statementDate` nicht mehr. `datedToday` wird in der Datei weiter gebraucht (Z. 254).
- **C-14, behoben:** Der Kommentar stimmt jetzt mit der Prüfung überein. Das ist nur ein Kommentar, die Prüfung ist unverändert.
- **C-15, behoben:** fr «dans la fiche du locataire», it «nella scheda dell’inquilino», in `contracts_parties_fixed_by_law` und `contracts_end_death`. In fr.json und it.json kommen «chez le locataire» und «presso l’inquilino» nicht mehr vor. de und en sind unverändert. Das ist eine Änderung am Wortlaut einer Übersetzung, für die nach der Triage-Ausnahme kein roter Test nötig ist.

## Weiteres in der Diff

- `implementation_plan.md`: Runde 2 ist abgehakt, Runde 3 offen, `daten-pruefer` abgehakt. Der Bericht `w3c-datenpruefung-1.md` lief aber auf `a454fa4`, vor dem Fix von C-9. Er bestätigt dort ausdrücklich, dass das PDF einer versendeten Abrechnung unverändert bleibt. Ob nach `6ee33f2` neu geprüft werden muss, weil sich beim Versand ändert, wann das PDF entsteht (`CLAUDE.md` Schritt 5), entscheidet der Aufrufer. Das ist hier kein Befund.
- Sicherheit: keine neue Route und keine neue Eingabe.
- Texte: Neue Schlüssel gibt es nicht. Die zwei geänderten Texte betreffen nur fr und it, die übrigen Sprachen brauchen keine Änderung.

## Nicht bestätigt

- Vom Aufrufer gemeldet: Backend `bun test` (749 bestanden), Backend `bun run type-check`, `bun run lint`, `bun run check`, vitest contract-edit und contract-detail DOM (85), E2E chromium `statement-detail.feature` (42), Sprachzeilen «contract|statement-old» (31). Ich habe nichts davon neu laufen lassen. Das Backend schreibt in die Testdatenbank, und E2E darf ich nicht starten. Bei den vitest-Dateien hat sich nur ein Kommentar geändert.
- Dass der pg-Test zu C-9 ohne den Fix rot ist und das Szenario zu C-10 ohne die Bedingung für Entwürfe rot ist, habe ich nur aus dem Code geschlossen, nicht ausgeführt.
- Ob die liegengebliebenen Datensätze aus C-17 einen späteren Test in derselben Testdatenbank stören, habe ich nicht gemessen. Mögliche Kandidaten wären Zählungen versendeter Abrechnungen, etwa in `dashboard.pg.test.ts` und `reminders.pg.test.ts`. Nach dem gemeldeten Lauf sind alle 749 Tests grün.
- Die Übersetzungen in fr und it hat niemand muttersprachlich geprüft.
