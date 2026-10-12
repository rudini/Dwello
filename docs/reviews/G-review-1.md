# Review G, Runde 1 – Saldo auf 5 Rappen (937df22)

Unabhängige Prüfung von `git show 937df22` (`feat(statements): round the Saldo to 5 Rappen`), Code und Fachlichkeit. Produktentscheid: Der Saldo (Nachzahlung und Rückerstattung) wird kaufmännisch auf 5 Rappen gerundet. Positionen, Zwischensumme, Pauschale und «Ihre Nebenkosten» bleiben auf den Rappen genau. Die Zeile «Rundung auf 5 Rappen» zwischen Akonto und Saldo lässt die Rechnung aufgehen.

Ausgeführt:
- Backend: `bun test --preload ./scripts/test-db.ts` für `statement-pdf-data`, `statement-pdf-render` (30 grün) und `statement-generation.pg` (7 grün).
- Frontend: `bunx vitest run` für `statement-pages.dom` und `statement-wizard` (86 grün).
- Eine eigene Probe als Bun-Test, danach wieder gelöscht. Sie prüft `roundTo5Rappen` an Randwerten, rendert das PDF in de/fr/it/en für Kosten 1000.02 bei Akonto 1000.00 (Saldo 0) und misst die Breite der neuen Bezeichnungen mit pdfkit.
- E2E und `bun run build` wurden wie vorgegeben nicht ausgeführt.

**Kein Finding ist kritisch oder hoch.** Mittel sind vier Punkte:
- Ein Saldo, der durch die Rundung 0 wird, ist im PDF falsch begründet.
- Die italienische Zeile bricht um, und die Platzreserve rechnet nicht damit.
- Der Assistent zeigt «Nachzahlung CHF 0.00».
- Glossar und Hilfe sind nicht nachgeführt, ein Eintrag in `offene-punkte.md` fehlt.

## 1. `roundTo5Rappen` (backend/src/services/pdf-format.ts:19-20)

Die Funktion ist korrekt. Sie rundet den Betrag ohne Vorzeichen halb nach oben und setzt das Vorzeichen danach wieder. Eine Rückerstattung wird damit genau gleich gerundet wie eine Nachzahlung (symmetrisch, «half away from zero»).

| Eingabe | Ergebnis | Beurteilung |
|---|---|---|
| 0.025 / −0.025 | 0.05 / −0.05 | richtig (Mitte, vom Nullpunkt weg) |
| 0.075 / −0.075 | 0.10 / −0.10 | richtig |
| 1.125, 2.675, 12345678.975 | 1.15, 2.70, 12345679.00 | richtig, auch bei Float-Rauschen dank `toPrecision(12)` |
| 0.024999999 | 0 | richtig (liegt wirklich unter der Mitte) |
| 1000000000.025 | 1000000000.05 | richtig, `toPrecision(12)` reicht bis 10⁹ |
| −0, −0.01 | 0 (nicht −0) | richtig: `\|\| 0` macht aus −0 eine 0 |
| 791.03 (1031.03 − 240), −48.97000000000003 | 791.05, −48.95 | richtig |
| NaN | 0 | siehe G-9 |

In `calculateBalance` sind beide Eingaben schon auf den Rappen gerundet (`calculation.service.ts:334, 342`). Die Differenz ist also immer ein ganzes Vielfaches von 1 Rappen. Das Hundertfache endet nie auf ,5, und die Mitte zwischen zwei 5-Rappen-Stufen kommt in der Praxis nicht vor. Der Schutz durch `toPrecision` ist harmlos, wird aber nie gebraucht (siehe G-8). Die Rundungsdifferenz liegt immer zwischen −0.02 und +0.02.

## 2. Wo der Saldo verwendet wird

Alle Stellen lesen den gespeicherten `balance`. Keine rechnet den Saldo selbst und ungerundet nach. Geprüft mit `grep` nach `totalCosts - totalAdvancePayments` und ähnlichen Ausdrücken in `src/` und `backend/src/`.

| Stelle | Ergebnis |
|---|---|
| QR-Rechnung: Betrag (`qr-bill.service.ts:336-337`, `pdf.service.ts:703`) | gespeicherter Saldo, `toFixed(2)`; Zahlteil und QR-Code stimmen überein. Die Referenz hängt nur an der Abrechnungs-ID (`statementQRReference`), nicht am Betrag. In Ordnung. |
| Mahnung (`reminder.service.ts:77, 87`, `reminder-letter.ts:42`) | gespeicherter Saldo, «Offener Betrag» ist damit gerundet. In Ordnung. |
| Bezahlt / überfällig (`statement-actions.ts:25`, `updateStatementStatus`) | Es wird nur `paidDate` gesendet, kein Betrag. Damit gibt es keinen Konflikt mit dem gerundeten Saldo. (Vorbestehend: `paid_amount` schreibt das Frontend nie, siehe G-11.) |
| Liste, Zeile, Detail, Zahlungsbereich (`StatementRow.svelte:43-44`, `+page.svelte:91-92`, `PaymentPanel.svelte:9-16`, `ReminderModal.svelte:37`) | gespeicherter Saldo. In Ordnung. |
| Dashboard (`backend/src/routes/dashboard.ts:128-129`) | Summen über `balance > 0` (gespeichert). In Ordnung. |
| Vorschau im Assistenten (`statement-generation.ts:80`, `PreviewStep.svelte:36-37, 112`) | Saldo aus `/statements/preview`, gerundet. Beim Saldo 0 steht «Nachzahlung», siehe G-3. |
| Akonto-Hinweis (`statement-wizard.ts:152-153`) | rechnet `totalCosts − totalAdvancePayments` selbst, also ungerundet. Inhaltlich richtig, weil er Kosten mit Akonto vergleicht und nicht den Saldo nennt. Siehe G-10. |
| Bearbeiten (`edit/+page.server.ts`, PUT `/statements/:id` in `routes/statements.ts:144-172`) | Das Body-Schema lässt nur `notes` und `paymentDeadline` zu. Beträge lassen sich auch bei einem Entwurf nicht bearbeiten, Saldo und Summen können nicht auseinanderlaufen. Bei versandten Abrechnungen sperrt `updateStatement` die Beträge zusätzlich (`statement.service.ts:375`). |
| API-Verträge (`tests/contracts/statement*.json`) | Der Vertragstest prüft nur JSON-Typen, deshalb ist keine Änderung nötig. (Vorbestehend: `statement-preview.json` hat `balance` 1045 bei Akonto 1800, das passt inhaltlich nicht, siehe G-8.) |
| Demodaten (`demo-data.ts`) | werden über `generateStatement` erzeugt und sind damit gerundet. `demo-data.sql` enthält keine Abrechnungen. In Ordnung. |
| Bestehende Abrechnungen | Vor 937df22 erzeugte Entwürfe in lokalen Datenbanken behalten ihren ungerundeten Saldo. `rounding()` ergibt dann 0, es erscheint keine Zeile, die Rechnung bleibt in sich stimmig. Eine Migration ist vor der ersten Installation nicht nötig. Lokale Entwürfe sollten neu erzeugt werden. |

## 3. Findings

### Mittel

**G-1 (mittel) Saldo 0 nach Rundung: Das PDF sagt, Kosten und Akonto seien gleich hoch**
`backend/src/services/pdf.service.ts:82, 145, 208, 271` (Text `balancedNote`) und `:480`.
- Fehler: Bei Kosten 1000.02 und Akonto 1000.00 ist der Saldo 0. Das PDF zeigt dann im Kasten oben, gemessen:
  > «Ausgeglichen CHF 0.00 – Ihre Nebenkosten und Ihre Akontobeiträge sind gleich hoch. Sie müssen nichts bezahlen. Ihre Nebenkosten CHF 1'000.02 – Geleistete Akontobeiträge CHF 1'000.00, Rundung auf 5 Rappen – 0.02»
- Der erste Satz widerspricht der Zeile darunter, und zwar in allen vier Sprachen («sont égaux», «sono uguali», «equal»). Bisher galt das nur bei genau gleichen Beträgen. Neu betrifft es jede Differenz von −0.02 bis +0.02.
- Die Tabelle selbst ist stimmig: «Rundung auf 5 Rappen – 0.02 / Ausgeglichen 0.00».
- Fix: Den Satz nur verwenden, wenn `rounding(data) === 0`. Sonst einen eigenen Text, z.B. «Der Unterschied von CHF 0.02 liegt unter 5 Rappen und wird nicht verrechnet. Sie müssen nichts bezahlen.» Das gilt für alle vier Sprachen. Oder neutral für beide Fälle: «Sie müssen nichts bezahlen, und Sie erhalten nichts zurück.» Dazu einen Render-Test mit `totalCosts: 1000.02, totalAdvancePayments: 1000, balance: 0`.

**G-2 (mittel) Italienische Rundungszeile bricht um, die Platzreserve unterschätzt sie**
`backend/src/services/pdf.service.ts:174` (Text), `:570` (Reserve), `:580` (Zeile).
- Die Bezeichnung steht in Spalte 0, die 112 pt breit ist (`COLUMNS[0]`). «Arrotondamento a 5 centesimi» misst bei Helvetica 8.5 pt 113.4 pt und bricht deshalb auf zwei Zeilen um (Höhe 19.7 statt 9.8 pt).
- Die anderen Sprachen passen knapp: de 87.9 pt, fr 77.9 pt, en 89.3 pt.
- Die Reserve rechnet `5 * (heightOfString(t.subtotal) + 8)`, also mit einzeiligen Zeilen. Rund 10 pt fehlen.
- Folge: Steht der Block knapp vor dem Seitenende, rutscht die Saldozeile allein auf die nächste Seite. Genau das soll der Kommentar in Zeile 565 verhindern («the balance alone on the next page lost its derivation»). Auch sonst sieht die umbrochene Zeile unruhig aus.
- Fix, am einfachsten: «Arrotondamento» oder «Arrotondamento 5 cts.» als Text (unsicher, ob üblich; «Arrotondamento» allein ist unmissverständlich). Robuster: die Reserve mit `heightOfString(t.rounding, { width: COLUMNS[0].width })` rechnen. Dazu einen Render-Test auf `it` mit einer Abrechnung, die gerade noch auf Seite 1 passt.

**G-3 (mittel) Assistent zeigt «Nachzahlung CHF 0.00»**
`src/routes/statements/generate/PreviewStep.svelte:36-37`.
- `saldo()` wählt das Wort mit `balance >= 0`. Dadurch heisst ein Saldo 0 «Nachzahlung CHF 0.00». Der Fehler ist vorbestehend.
- Bisher kam er nur bei exakt gleichen Beträgen vor. Seit 937df22 tritt er bei jeder Differenz bis ±0.02 auf.
- Detail, Liste und PDF sagen in diesem Fall «Ausgeglichen» (`$lib/statement.ts:20-24`). Für Gelegenheitsnutzer ist «Nachzahlung CHF 0.00» irreführend.
- Fix: `balanceLabel` aus `$lib/statement` verwenden: `` `${balanceLabel(balance)} ${formatCurrency(Math.abs(balance))}` ``. Test: Vorschauzeile mit `balance: 0`.

**G-4 (mittel) Saldo-Begriff in Glossar und Hilfe nicht nachgeführt, kein offener Punkt erfasst**
`UBIQUITOUS_LANGUAGE.md:124`, `src/routes/help/Glossary.svelte:44-45`, `docs/design/offene-punkte.md` (kein Eintrag).
- Beide Stellen definieren den Saldo als «Kostenanteil … minus geleistete Akontobeiträge». Das stimmt jetzt bis auf ±2 Rappen nicht mehr.
- Auch «Rundung auf 5 Rappen» ist kein Begriff aus `UBIQUITOUS_LANGUAGE.md`.
- Nach CLAUDE.md («Design-Regeln», Copy) bekommen fehlende Begriffe `TODO(fachlich prüfen)` und einen Eintrag in `offene-punkte.md`. `UBIQUITOUS_LANGUAGE.md` selbst darf nicht bearbeitet werden. Beides fehlt.
- Fix:
  - Hilfe-Glossar ergänzen: «… Der Saldo ist auf 5 Rappen gerundet.»
  - `TODO(fachlich prüfen)` an der neuen Bezeichnung (`pdf.service.ts:47`, `CostTable.svelte:92`) setzen.
  - Einen Eintrag in `offene-punkte.md` anlegen: Saldo-Definition im Glossar, Begriff «Rundung auf 5 Rappen», Rundung zulasten oder zugunsten des Mieters (siehe Abschnitt 4).

### Niedrig

**G-5 (niedrig) Kasten oben: Die Herleitung des Saldos mischt Schreibweisen**
`backend/src/services/pdf.service.ts:500-501`.
- Die Zeile lautet «Ihre Nebenkosten CHF 1'031.03 – Geleistete Akontobeiträge CHF 240.00, Rundung auf 5 Rappen + 0.02».
- Die Rundung hängt mit Komma an und hat kein «CHF», die anderen Beträge schon.
- Fix: `signed` mit `formatCurrency` oder als Rechenschritt ohne Komma: «… – Geleistete Akontobeiträge CHF 240.00 + Rundung auf 5 Rappen CHF 0.02».

**G-6 (niedrig) Web und PDF verwenden verschiedene Schwellen**
`src/routes/statements/[id]/CostTable.svelte:12-15` und `backend/src/services/pdf.service.ts:487-490`.
- Das PDF rundet die Differenz zuerst auf Rappen und vergleicht dann mit `< 0.05`. Das Web vergleicht die ungerundete Float-Differenz mit `>= 0.005 && < 0.05`.
- Bei stimmigen Daten (Differenz höchstens 0.02) ist das Ergebnis gleich.
- Bei inkonsistenten Daten unterscheidet es sich: Eine Differenz von genau 5 Rappen, als Float 0.0499999, zeigt das Web als Rundung, das PDF nicht. Dann geht die Rechnung in beiden still nicht auf.
- Erreichbar ist das heute nicht, weil die Beträge nicht editierbar sind (Abschnitt 2).
- Fix: die gleiche Regel verwenden, im Web also `Math.round(difference * 100) / 100` vor dem Vergleich. Alternativ liefert das Backend die Rundung als Feld. `rounding(data)` wird im PDF dreimal berechnet (`:500, :570, :580`); das ist unschön, aber korrekt.

**G-7 (niedrig) Testlücken**
- PDF (`statement-pdf-render.test.ts`): Beide neuen Fälle haben das Vorzeichen «+». Das Minus («– 0.02», z.B. 784.12 → 784.10) prüft kein Test, den Zweig von `signed` mit «–» also auch nicht. Ebenfalls ungetestet sind der Saldo 0 nach Rundung (G-1), fr/it/en und das Seitenende (G-2).
- Web (`statement-pages.dom.test.ts:491-499`): Auch hier gibt es nur «+», kein «−» und keinen Saldo 0.
- `roundTo5Rappen` (`statement-pdf-data.test.ts:95-109`): Es fehlen −0.025 (Symmetrie in der Mitte) und −0.01 → 0 (nicht −0).
- Alle neuen Tests würden ohne die Änderung scheitern: der Import von `roundTo5Rappen`, die erwarteten Salden in `statement-generation.pg.test.ts`, die Zeile «Rundung» im PDF, `statement-rounding` im DOM und das Szenario `statement-rounding.feature` mit 791.05 statt 791.03.

**G-8 (niedrig) Irreführender Testname und Testdaten mit unmöglichem Saldo**
- `statement-pdf-data.test.ts:97`: Der Name «auch knapp unter der Grenze als Fliesskommazahl» passt nicht zu den Werten. 791.03 und 0.025 liegen nicht knapp unter einer Grenze; der `toPrecision`-Schutz wird nicht gebraucht (Abschnitt 1). Fix: Namen anpassen oder einen echten Fall wie `1.075` mit Float-Rauschen aufnehmen.
- `src/__tests__/statement-pages.dom.test.ts:502, 776`: Der Fixture-Saldo −83.43 ist seit 937df22 nicht mehr möglich. Fix: −83.45.
- Vorbestehend: `tests/contracts/statement-preview.json` hat `balance` 1045 bei `totalCosts` 1045 und Akonto 1800. Richtig wäre −755.

**G-9 (niedrig) `|| 0` verschluckt NaN**
`backend/src/services/pdf-format.ts:20`.
- `roundTo5Rappen(NaN)` ergibt 0. Ein Rechenfehler würde damit still zum Saldo «Ausgeglichen».
- Mit validierten Eingaben ist das heute nicht erreichbar.
- Fix ohne Mehraufwand: `+ 0` statt `|| 0`. −0 + 0 ergibt 0, NaN bleibt NaN und fällt dann beim Speichern in `DECIMAL` auf.

**G-10 (niedrig) Akonto-Hinweis exakt neben gerundetem Saldo**
`src/lib/statement-wizard.ts:153`.
- In derselben Vorschauzeile stehen z.B. «Nachzahlung CHF 791.05» und «Kosten CHF 791.03 (330 %) über dem Akonto».
- Fachlich ist das richtig, denn der Hinweis vergleicht Kosten und Akonto. Für Gelegenheitsnutzer wirken die 2 Rappen Unterschied aber wie ein Fehler.
- Wenn das stört: Prozent und Betrag runden («rund CHF 790») oder den Betrag weglassen. Ein Fix ist nicht zwingend.

**G-11 (niedrig, vorbestehend, ausserhalb des Commits) `paid_amount` wird nie geschrieben**
- «Als bezahlt markieren» sendet nur `paidDate` (`src/lib/server/statement-actions.ts:25`).
- `paidThisMonth` im Dashboard (`backend/src/routes/dashboard.ts:130-133`) ist deshalb immer 0. Im UI wird es aber nicht angezeigt.
- Für die Rundung ohne Belang, nur der Vollständigkeit halber.

## 4. Fachlich: Schweizer Praxis

- **Rundung auf 5 Rappen:** Die kleinste Münze ist seit der Ausserkurssetzung des 1-Räpplers (2007) das 5-Rappen-Stück. Kaufmännisches Runden des Endbetrags auf 0.05 ist in Rechnungen und Kassen verbreitet; vorgeschrieben ist es für Überweisungen nicht. **unsicher** (aus allgemeinem Wissen, keine Primärquelle geprüft; das Jahr 2007 ist nicht verifiziert). Positionen und Summen bleiben bei 937df22 exakt, gerundet wird nur der Zahlbetrag. Das entspricht der üblichen Praxis.
- **Mietrecht (OR 257a/257b):** Nebenkosten sind das Entgelt für die tatsächlichen Aufwendungen. Die Rundung verschiebt den Saldo um höchstens 2 Rappen, symmetrisch in beide Richtungen. Das ist praktisch bedeutungslos und wegen der offengelegten Rundungszeile transparent. Ob eine Rundung zulasten des Mieters (z.B. 133.03 → 133.05) streng genommen zulässig ist oder stets zugunsten des Mieters gerundet werden sollte, ist **unsicher**: keine Lehrmeinung oder Rechtsprechung geprüft. Das gehört als Frage in `offene-punkte.md` (G-4).
- **QR-Rechnung (SIX Implementation Guidelines):** Der Betrag ist laut Spezifikation 0.01 bis 999 999 999.99, mit zwei Nachkommastellen und Punkt als Dezimaltrennzeichen. Eine 5-Rappen-Vorgabe gibt es nicht. **unsicher**: aus der IG v2.x in Erinnerung, nicht im Wortlaut geprüft. Ein Betrag wie 0.05 ist gültig. Dwello druckt den Zahlteil nur bei `balance > 0` (`pdf.service.ts:757`), Betrag 0 oder negativ kommt also nicht in den QR-Code. Betrag im Text, im Zahlteil und im QR-Code stammen aus derselben Zahl.
- **Kleinstbeträge:** Nach der Rundung kann eine Nachzahlung von CHF 0.05 entstehen, mit Zahlteil und später Mahnung. Der Fall bestand schon vorher bei 0.01 bis 0.04. Eine Bagatellgrenze, unter der nichts eingefordert wird, ist weder vorgegeben noch Teil des Entscheids. Sie ist ein möglicher offener Punkt, kein Fehler.
- **Übersetzungen:** «Arrondi à 5 centimes» und «Arrotondamento a 5 centesimi» sind korrekt und in der Schweiz verständlich. Für Italienisch siehe G-2 wegen der Länge. «Rounding to 5 centimes» ist verständlich; «Rounding to CHF 0.05» wäre für Englischsprachige vielleicht klarer (Geschmackssache). «Ausgeglichen», «Soldé», «Saldato» und «Settled» passen zum Saldo 0. Nur der Begleitsatz ist falsch (G-1).

## 5. Fazit

- Die Rundung ist korrekt umgesetzt und an einer einzigen Stelle berechnet (`calculateBalance`). Gespeichert wird sie in `balance`, und von dort lesen sie alle Verbraucher: QR-Rechnung, Mahnung, Liste, Dashboard und Vorschau.
- Einen Pfad, auf dem Saldo und Summen auseinanderlaufen, gibt es nicht.
- Nachbessern sollte man die Texte rund um den Saldo 0 (G-1, G-3), die italienische Zeile (G-2) und die Begriffspflege (G-4).
