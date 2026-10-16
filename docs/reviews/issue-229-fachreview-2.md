# Fachreview #229, Runde 2 (Feature-Review nach der Umsetzung)

Gegenstand: `git diff aa36a10a fc20902b` im Worktree `review-229-fach2` (Commits `9dbc4816`, `7afac56b`, `fc20902b`): PDF-Zusatz `heatingPeriodSums` (de/fr/it/en, `backend/src/services/pdf.service.ts:68, :138, :207, :276`, Logik `:644–656`), gespeichertes `periodPercent` (`calculation.service.ts:404–424`, `prorating.service.ts:216–217`, `schema.ts:326`), ältere Abrechnungen (`statement-pdf.service.ts:133–165`), Detailseite mit gespeichertem Profilnamen (`src/lib/server/statement.ts:24–29`), Erläuterung und Position aus einem gerundeten Wert, drei Szenarien in `tests/e2e/features/statement-detail.feature:246–307`.

Quellen: `UBIQUITOUS_LANGUAGE.md` (Z. 111–137), `docs/design/i18n-begriffe.md` (Z. 5, 49, 54), `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 5, 6, Thema 6), Vorbericht `docs/reviews/issue-229-fachreview-1.md`, Issue #232 (offen, `fachlich`, `entscheiden`), Fedlex VMWG SR 221.213.11.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Abrechnungen, die unter #209 (vor diesem Commit) erstellt wurden, haben einen gespeicherten Anteil ohne `periodPercent` und mit der alten Rundung: ihr PDF nennt bei einer kurzen Periode keine Summen, und im Halbwert-Fall weichen Erläuterung und Position weiter um 0.01 % ab |
| V-2 | Verwalter | Nit | en «together 43.00 %» ist kein idiomatisches Englisch; «in total» (wie fr «au total», it «in totale») |

Keine Blocker, keine Major.

## V-1 (Minor): Unter #209 gespeicherte Anteile

**Beleg.** `statement-pdf.service.ts:257–260` (Diff-Zeilen): Ist `heating_share` gespeichert, nimmt das PDF `stored.percent` und `stored.periodPercent` unverändert. Unter #209 schrieb `heatingOfRun` `percent: twoPlaces(result.percentage)` und kein `periodPercent` (alte Zeile `calculation.service.ts:421`, `-` im Diff). Neu ist `percent = Math.round((result.percentage / 100) * 10000) / 100`, gleich wie `period_share` der Position (`calculation.service.ts:355`).

Nachgerechnet (Profil «Halbwert» aus dem Szenario, Einzug 22.02.2025, Jahr 2025): Februar 13.9 × 7/28 = 3.475, März bis Dezember 11.2 + 6.1 + 2.3 + 0 + 0 + 0.08 + 1.8 + 7.7 + 13.4 + 24.92 = 67.5, zusammen 70.975 %. `period_share` = 0.7098 → Position «70.98 %». Mit der alten Rundung (Gleitkomma 7097.4999…) steht in der Erläuterung «70.97 %»; genau das zeigte der rote Test «nennt in der Erläuterung denselben Anteil wie in der Position» (Plan Z. 30). Für eine unter #209 erstellte Abrechnung bleibt dieser Unterschied, wenn das PDF neu erstellt wird. Bei einer kurzen Periode (z. B. Eva Frei, 01.01.–30.06.2024, «Winter») fehlt dort zudem der neue Zusatz: «86.00 %» und «Jan 18.00 %, Feb 14.00 %, Mär 11.00 %» ohne «zusammen 43.00 % … 50.00 %», also genau der Zustand, den #229 behebt.

**Warum.** Gewicht gering: nur Abrechnungen aus dem kurzen Zeitraum zwischen dem Merge von #231 und diesem Pull Request, und nur Halbwert-Anteile bzw. kurze Perioden mit Ein- oder Auszug. Die Beträge stimmen (sie stehen in der Position). Aber ein Mieter, der eine solche Abrechnung neu ausgedruckt erhält, sieht zwei verschiedene Prozentsätze für denselben Anteil.

**Lösung.** Im gespeicherten Pfad den Prozentsatz wie bei den älteren Abrechnungen aus `period_share` der Heizposition nehmen, wenn sie da ist (`lineShare` ist in `heatingOf` schon vorhanden): `percent: lineShare == null ? stored.percent : parseFloat(lineShare) * 100`. Für das fehlende `periodPercent` reicht es, es weiter wegzulassen (kein falscher Text); sonst die Periode wie in `recomputedHeating` neu rechnen und nur nennen, wenn der Anteil passt. Alternativ als bekannte Einschränkung in #232 vermerken.

## V-2 (Nit): Englisch «together»

**Beleg.** `pdf.service.ts:276`: «Shares of the months of your tenancy: Jan 18.00 %, Feb 14.00 %, Mar 11.00 %; together 43.00 %. The months of the billing period total 50.00 % in the heating profile». (Die Formulierung stammt aus meinem Vorschlag in Runde 1, F-1.)

**Warum.** «together 43.00 %» ist als Summenangabe ungewöhnlich; im Englischen heisst es «in total» oder «a total of». fr «au total» und it «in totale» sind richtig.

**Lösung.** «; in total {tenant} %. The months of the billing period total {period} % in the heating profile». Der Begriff steht nicht in `i18n-begriffe.md` und braucht dort keinen Eintrag (kein Fachbegriff).

## Bestätigt (Fixes aus Runde 1)

- **F-1 (Major) behoben.** Neuer Wortlaut ohne «x % von y %»: de «; zusammen {tenant} %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen {period} %», fr/it/en entsprechend (`pdf.service.ts:68, :138, :207, :276`). Die Fehllesungen «43 % × 50 %» und «halbe Periode» sind weg: «Die Monate der Abrechnungsperiode haben im Heizprofil …» sagt, dass die 50 % aus dem Heizprofil kommen, nicht aus der Dauer. Die Division «= {percent} %» fehlt bewusst, bis #232 entschieden ist (Option «Calculate from the rounded months» nennt sie dort ausdrücklich); das entspricht der Empfehlung aus F-2 der Runde 1.
- **Begriffe.** «Abrechnungsperiode» (Glossar Z. 129), «Heizprofil» (Z. 115); fr «période de décompte», «profil de chauffage», it «periodo di conteggio», «profilo di riscaldamento», en «billing period», «heating profile» genau nach `i18n-begriffe.md:49`, `:54`. «Mietverhältnis»/«bail»/«locazione»/«tenancy» steht schon im bestehenden Schlüssel `heatingMonths`, ist nicht neu. fr «totalisent … %» wie in `messages/fr.json:1074` und `:1191` (Monatsanteile «totalisent 100 %»). Kein fehlender Begriff.
- **Typografie.** Geschütztes Leerzeichen vor «%» in allen vier Sprachen (F-6 behoben). fr mit normalem Leerzeichen vor «;» wie die bestehenden PDF-Texte (« : » in `heatingMonths`, `heatingNote`); Stil des PDF, kein Befund (wie Runde 1).
- **F-2 (Teil) behoben.** {tenant} ist die Summe der gedruckten, auf zwei Stellen gerundeten Monate (`pdf.service.ts:653`, in ganzen Hundertsteln addiert, kein Gleitkommafehler). Nachgerechnet: Einzug 06.01., Periode 01.01.–15.05.2024, «Winter»: gedruckt 15.10 + 14.00 + 11.00 + 5.00 + 0.97 = 46.07, Zusatz «zusammen 46.07 %» (vorher wäre 46.06 gestanden). {period} ist die Summe der Periode auf zwei Stellen (`twoPlaces(result.periodPercentage)`); ihre Monate stehen nicht im PDF (F-7), daher gibt es keine gedruckten Werte, gegen die sie aufgehen müsste. Der Rest (Prozentsatz aus ungerundeten Monaten, 0.01 % bei Einzug 05.01.) ist in #232 beschrieben.
- **F-3 behoben.** Zusatz, sobald `periodPercent !== 100` (`pdf.service.ts:654`), nicht nur darunter. Beispiele: eigenes Profil mit 100.05 % über ein Jahr, Mieter Jan–Mär: «zusammen 43.00 % … 100.05 %» bei «42.98 %» (43 / 100.05 = 42.978): richtig erklärt. Ganzes Jahr mit Profil 100 % (Summe als Gleitkomma 99.99999… oder 100.00000…1): `twoPlaces` ergibt genau 100, kein Zusatz.
- **F-4 behoben.** `statement-pdf.pg.test.ts:83`: Jahresperiode ohne «Die Monate der Abrechnungsperiode».
- **F-5 behoben.** Szenariotitel «PDF nennt bei einer Periode unter einem Jahr die Summen der Monatsanteile» (`statement-detail.feature:248`).
- **F-7, F-8 und der Rest von F-2** stehen in #232 (offen, `fachlich`, `entscheiden`), mit Optionen und Beispiel.
- **Szenarien nachgerechnet.**
  - `statement-detail.feature:246–256`: «Winter» 01.01.–30.06.2024, Eva Frei 01.01.–31.03.: 18 + 14 + 11 = 43, Periode 18 + 14 + 11 + 5 + 2 + 0 = 50, 43 / 50 = 86.00 %. Gegenprobe Marc Huber ab 01.05.: 2 / 50 = 4 %, Leerstand April 5 / 50 = 10 % beim Vermieter, 86 + 4 + 10 = 100.
  - `:272–277` (Umbenennen): Detailseite nennt «Winter» aus dem gespeicherten Namen (`statement.ts:24–29`); PDF und Detailseite nennen damit dasselbe Profil wie beim Erstellen. Fachlich richtig: die Abrechnung dokumentiert die Grundlage, mit der sie gerechnet wurde.
  - `:279–307` (Halbwert): «Halbwert» summiert 18.6 + 13.9 + 11.2 + 6.1 + 2.3 + 0 + 0 + 0.08 + 1.8 + 7.7 + 13.4 + 24.92 = 100.00, Anteil 70.975 % (Rechnung unter V-1), Erläuterung und Position «70.98 %». Zwei gleich grosse Wohnungen (3.01, 3.02), CHF 1000 für 2025 (die Rechnung 2024 der Grundlage fällt nicht in die Periode): Wohnungsanteil CHF 500.00, also «500.00 70.98 %».
  - pg-Tests: Einzug 01.03., Periode Jan–Jun, Profil 10/10/10/10/10/0/…: 30 / 50 = 60 % (`statement-pdf.pg.test.ts:278–297`); ältere Abrechnung Halbjahr: 18.6 + 13.9 + 11.2 + 6.1 + 2.3 + 0 = 52.10 (`:353`).
- **Randfälle.** Mieter mit 0 % in einer kurzen Periode (nur Juni im «Winter»): «Jun 0.00 %; zusammen 0.00 % … 50.00 %», Prozentsatz 0.00 %: richtig. Mieter, der alle Monate mit Anteil trägt (Periode Jul–Dez, Einzug 01.09., Jul/Aug 0 %): Prozentsatz 100 %, keine Monatsliste und kein Zusatz (`pdf.service.ts:649`): richtig, es gibt nichts aufzuteilen. Periode, deren Monate 0 % tragen: Verteilung nach Tagen, kein Zusatz (`prorating.service.ts:214`).
- **Ältere Abrechnungen (vor #209, ohne `heating_share`).** Prozentsatz aus `period_share` der Heizposition, Monate und Summen nur, wenn die Neuberechnung gleich gerundet denselben Wert ergibt (`statement-pdf.service.ts:283–288`, gleiche Rundung wie `calculation.service.ts:355`). Erfüllt «never prints months that do not give the share its amounts were calculated with»; Profil geändert → nur «50.00 % der Heizkosten» ohne Monate (`statement-pdf.pg.test.ts:362–380`).
- **Recht (Fedlex, VMWG SR 221.213.11; Wortlaut wie in Runde 1 aus dem Filestore, heute über `mmx search` auf fedlex.admin.ch/eli/cc/1990/835_835_835/de wiedergefunden):**
  - Art. 7 Abs. 1 VMWG: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.» Die Rechnung Monate des Mieters / Monate der Periode lässt den Leerstand beim Vermieter; der Zusatz macht das sichtbar (50 % der Periode, davon 43 % beim Mieter).
  - Art. 8 Abs. 1 VMWG: «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Der Zusatz ergänzt die Aufteilung; nichts darin ist unzulässig oder irreführend.

## Fehlende Begriffe

Keine.

## Nicht bestätigt

- **fr/it/en im gerenderten PDF:** Kein Test erstellt ein PDF mit `heatingPeriodSums` in fr, it oder en (Grep nach «totalisent», «totalizzano», «billing period total» in `backend/src`, `src`, `tests`: nur die Definitionen). Geprüft habe ich die Texte im Code, nicht im PDF der laufenden App (http://localhost:3300 nicht bedient: Login über OAuth). Zeilenumbruch und Lesbarkeit sind Sache der Persona (Dr. Weber).
- **Wie viele Abrechnungen unter #209 erstellt wurden** (Gewicht von V-1): nicht geprüft, keine Produktionsdaten.
- **Nachvollziehbarkeit als Rechtspflicht:** wie in Runde 1 **unsicher**; Art. 8 VMWG verlangt eine «detaillierte Abrechnung und Aufteilung», nicht ausdrücklich eine nachrechenbare.
- **Perioden über ein Jahr:** ob Dwello sie zulässt, weiter nicht geprüft; der Zusatz wäre dort richtig («… zusammen 150.00 %»).
