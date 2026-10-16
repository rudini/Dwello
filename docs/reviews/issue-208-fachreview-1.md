# Fachreview #208, Runde 1 (vor der Umsetzung)

Gegenstand: Commit `2fcb254` (Worktree `review-208-fach`), die zwei `@wip`-Szenarien in `tests/e2e/features/statement-detail.feature:190-218` und der Plan in `implementation_plan.md:5-20` (Session 12).
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md` (Regel 1, Regel 5, Thema 2, 3, 6), `docs/anforderungen-vertragsende.md` (keine einschlägige Regel), Fedlex: VMWG (SR 221.213.11, Fassung 01.10.2025), OR (SR 220, Art. 257a/257b), abgerufen über den Fedlex-Filestore (SPARQL-Endpunkt `fedlex.data.admin.ch`).

## Übersicht

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| F-1 | Verwalter / Mietrecht | Major | D-3: Der Nenner von «48/62 Tage» wird im PDF nirgends erklärt; die Erläuterung sagt «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode» und die Kopfzeile «48 Mietstage von 92 Tagen». |
| F-2 | Verwalter | Minor | D-3-Szenario: Mietstage (48) und Mietstage im Leistungszeitraum (48) sind gleich; eine falsche Umsetzung (Mietstage / abgerechnete Tage) besteht das Szenario. |
| F-3 | Verwalter | Minor | Fehlende Begriffe: «Zeitanteil» und die zwei Tageszahlen von D-3; die geplanten Spalten `rented_days`/`billed_days` kollidieren mit «Mietstage» (`rental_days`). |
| F-4 | Mietrecht | Minor | D-2-Szenario prüft nicht, dass der Hinweis nach Art. 8 Abs. 1 VMWG bleibt (das Szenario aus #137 prüft ihn). |
| F-5 | Verwalter | Minor | «Done means» Punkt 2 (Teilperiode behält Prozent und Heizprofil-Hinweis) hat im Plan keinen eigenen Test, obwohl die D-2-Änderung in der gemeinsamen Funktion `handleMidYearMoves` liegt. |
| F-6 | Verwalter | Minor | Plan D-3: Es fehlt die Regel, dass eine nach Heizprofil geteilte Position nie die gespeicherten Tage druckt (Teilperiode mit Leistungszeitraum, #71). |
| F-7 | Verwalter | Minor | Der Plan ändert `docs/nebenkostenabrechnung-anforderungen.md` nicht: Regel 5 sagt nicht, wie der Zeitanteil gedruckt wird. |
| F-8 | Verwalter | Nit | Eine Position mit mehreren Rechnungen über verschiedene Leistungszeiträume (z. B. Hauswart quartalsweise) bleibt bei Prozent. In der Praxis ist das häufig; kein Fehler, aber offene Arbeit. |

## Befunde

### F-1 (Major): Der Nenner des Bruchs bleibt für den Mieter unerklärt

**Beleg.**
- `backend/src/services/pdf.service.ts:87`: `sharesNote`: «… Zeitanteil: Ihre Mietstage in der Abrechnungsperiode{heating}.»
- `backend/src/services/pdf.service.ts:77`: `tenancyLine` «Ihr Mietverhältnis in dieser Periode: {start} – {end} ({days} Mietstage von {total} Tagen)». Im D-3-Szenario steht dort «48 Mietstage von 92 Tagen», in der Zeile Hauswart künftig «48/62 Tage».
- `docs/nebenkostenabrechnung-anforderungen.md:39` (Thema 2): Die Abrechnung muss «den Verteilschlüssel und den Anteil des Mieters nachvollziehbar ausweisen».
- `:94` (Thema 6): «den Zeitanteil als Bruch der Mietstage drucken, damit die Zeile mit dem Taschenrechner aufgeht».

**Warum falsch.** Die Erläuterung nennt als Zeitanteil «Ihre Mietstage in der Abrechnungsperiode», also 48/92. Woher die 62 kommen, steht nirgends: Der Leistungszeitraum der Rechnung erscheint im PDF nicht. Im allgemeinen Fall ist auch der Zähler nicht die Zahl der Mietstage (siehe F-2). Der neue Bruch ist besser als «77.42 %», aber ohne Erklärung nicht nachvollziehbar. Er widerspricht sogar der Erläuterung im selben PDF. Nur Thema 2 ist in der Quelle als unsicher-B eingestuft; ein Fedlex-Wortlaut zur Form der Abrechnung fehlt (Art. 8 VMWG regelt nur den Hinweis und die Einsicht, siehe unten). Major vergebe ich, weil der Plan einen neuen Drucktext einführt, dem der vorhandene Text widerspricht.

**Korrektur.** Die Erläuterung erweitern, in allen vier Sprachen in `pdf.service.ts`, z. B. de: «Zeitanteil: Ihre Mietstage in der Abrechnungsperiode; bei einer Rechnung mit Leistungszeitraum Ihre Mietstage darin von dessen Tagen in der Periode{heating}.» Das ist der Wortlaut von Regel 5: «mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode». Den Satz nur zeigen, wenn eine Position so gedruckt wird. Im D-3-Szenario einen Schritt `Und steht im PDF "von dessen Tagen in der Periode"` ergänzen. Optional (Nit): den Leistungszeitraum in der Zeile nennen («Hauswart, 01.07.–30.09.2025»).

### F-2 (Minor): Das D-3-Beispiel trennt Mietstage und Mietstage im Leistungszeitraum nicht

**Beleg.** `statement-detail.feature:210-218`: Einzug 15.07.2025, Periode 01.06.–31.08., Leistungszeitraum 01.07.–30.09.
- Mietstage (Glossar: «Anzahl Tage, die ein Mietvertrag in der Abrechnungsperiode läuft»): 15.07.–31.08. = 17 + 31 = 48.
- Mietstage im Leistungszeitraum, soweit er in der Periode liegt (01.07.–31.08.): ebenfalls 48.

**Warum falsch.** Eine Umsetzung, die `rentalDays / billed_days` druckt, besteht das Szenario. Für einen anderen Mieter ergäbe sie dann einen falschen Bruch.

**Korrektur.** Das Beispiel so wählen, dass die Zahlen sich unterscheiden: Mietvertrag vom 2025-06-15 bis 2025-07-31, sonst gleich.
- Mietstage: 15.06.–31.07. = 16 + 31 = 47.
- Im Leistungszeitraum in der Periode: 01.07.–31.07. = 31.
- Das PDF zeigt dann «31/62 Tage» und nicht «47/62 Tage».

Oder den Fall zusätzlich im geplanten `statement-pdf.pg.test.ts` abdecken.

### F-3 (Minor): Fehlende Begriffe

**Beleg.**
- `UBIQUITOUS_LANGUAGE.md:137` kennt nur «Mietstage» (`rental_days`) mit der Bedeutung «in der Abrechnungsperiode».
- «Zeitanteil» steht im PDF (`pdf.service.ts:73`, `timeShareColumn`) und im Issue, aber nicht im Glossar.
- Plan, `implementation_plan.md:15`: neue Spalten `rented_days`, `billed_days`.

**Warum.** Nach CLAUDE.md gelten in Code und Szenarien nur Glossarbegriffe. `rented_days` neben `rental_days` lädt zur Verwechslung ein (genau der Fehler aus F-2). «billed days» hat keinen Glossarbegriff.

**Vorschlag für das Issue** (Labels `fachlich`, `entscheiden`):
- **Zeitanteil**: Teil des Wohnungsanteils, den der Mieter einer Abrechnungsposition trägt, für die Zeit seines Mietvertrags. Nach Tagen: seine Mietstage in den Tagen, die die Rechnung in der Abrechnungsperiode abrechnet, von diesen Tagen. Bei Heizkosten und einem Ein- oder Auszug: der Anteil nach dem Heizprofil. Code: `period_share`.
- **Abgerechnete Tage**: die Tage, die eine Rechnung in der Abrechnungsperiode abrechnet. Ohne Leistungszeitraum sind das die Tage der Abrechnungsperiode, mit Leistungszeitraum dessen Tage in der Abrechnungsperiode. Code: `billed_days`.
- **Mietstage der Position** (Code: `position_rental_days` statt `rented_days`): die Mietstage, die in die abgerechneten Tage einer Abrechnungsposition fallen.

Bis zur Entscheidung im Code `TODO(fachlich prüfen, #<issue>)` setzen.

### F-4 (Minor): Im D-2-Szenario fehlt die Prüfung des Hinweises nach Art. 8 Abs. 1 VMWG

**Beleg.** `statement-detail.feature:192-203` prüft nur «366/366 Tage» und nicht «Heizprofil». Das Szenario aus #137 (`:176-188`) prüft zusätzlich `steht im PDF "detaillierte Abrechnung der Heiz- und Warmwasserkosten"`.

Art. 8 Abs. 1 VMWG (Fedlex, verbatim): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.»

**Warum.** Der Plan entfernt für einen Mietvertrag über die ganze Periode den Heizprofil-Hinweis. Der Hinweis nach Art. 8 Abs. 1 muss bleiben. Er hängt heute an `hasHeating` und nicht am Heizprofil, sollte aber genau dort mitgeprüft werden, wo das Heizprofil wegfällt.

**Korrektur.** Im D-2-Szenario `Und steht im PDF "detaillierte Abrechnung der Heiz- und Warmwasserkosten"` ergänzen.

### F-5 (Minor): Kein Regressionstest für die Teilperiode

**Beleg.**
- Issue #208, «Done means», Punkt 2: «Heating shared by the profile for a contract over part of the period keeps its percentage and the note.»
- Plan, `implementation_plan.md:14`: «D-2: test first (`handleMidYearMoves` or calculation)», ohne Test für die Teilperiode.
- Vorhanden sind `prorating.pg.test.ts:96` (Rechnung) und `statement-pdf-render.test.ts:71` (Rendern mit fest gesetztem `byProfile`). Keiner geht durch `heatingOf` → `handleMidYearMoves` → PDF-Text.

**Korrektur.** Im geplanten `statement-pdf.pg.test.ts` neben D-2 einen Fall mit Teilperiode aufnehmen: Mietvertrag 01.01.–30.06.2024, Heizprofil «Winter» aus dem Szenario.
- Monate Januar bis Juni: 18 + 14 + 11 + 5 + 2 + 0 = 50 %, in einer Jahresperiode also 50 / 100.
- Erwartet: «Heizkosten nach Heizprofil «Winter»: 50.00 %», kein «Tage» in der Heizungszeile.

### F-6 (Minor): Vorrang des Heizprofils vor den gespeicherten Tagen

**Beleg.**
- Plan, `implementation_plan.md:7`: «the PDF prints them when the line is a ratio of days (all invoices of the line bill the same days)».
- Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`): Heizkosten einer Teilperiode gehen «nach dem Heizprofil …, auch bei einer Rechnung mit Leistungszeitraum (offen in #71)».

**Warum.** Bei einer Heizkostenposition mit Teilperiode und einer einzigen Rechnung mit Leistungszeitraum sind die Bedingungen des Plans erfüllt (gleiche Tage), der Betrag stammt aber aus dem Heizprofil. Würden Tage gedruckt, stimmte der Bruch nicht mit dem Betrag überein.

**Korrektur.**
- Im Plan festhalten: `byProfile` geht vor; die Tage werden nur gespeichert oder gedruckt, wenn die Position nach Tagen geteilt wurde.
- Dazu ein Test: Teilperiode mit einer Heizkostenrechnung mit Leistungszeitraum druckt Prozent.

### F-7 (Minor): Die Anforderungen beschreiben die Anzeige nicht

**Beleg.**
- Regel 5 (`:145`) sagt zur Anzeige nur für den 0-%-Fall «die Abrechnung zeigt die Mietstage und keinen Heizprofil-Hinweis».
- Thema 2 (`:39`) schreibt «Mietstage x/365».
- Der Plan nennt nur `docs/data-model.md`.

**Korrektur.** Regel 5 ergänzen: Der Zeitanteil nach Tagen wird als «x/y Tage» gedruckt, y = abgerechnete Tage (F-3). Das gilt auch für einen Mietvertrag über die ganze Periode mit Heizprofil (kein Heizprofil-Hinweis). Eine Position aus Rechnungen mit verschiedenen abgerechneten Tagen zeigt Prozent.

### F-8 (Nit): Positionen mit gemischten Leistungszeiträumen

Hauswart, Reinigung oder Strom werden in der Praxis oft quartalsweise in Rechnung gestellt. Liegen zwei Quartalsrechnungen in der Periode und mietet der Mieter nicht die ganze Periode, ist der Zeitanteil ein nach Betrag gewichteter Mittelwert. Dieser ist richtig als Prozent gedruckt (`calculation.service.ts:127-136`). Der Mieter kann ihn aber nur mit der Belegliste nachrechnen (Thema 5, `:76`). Kein Fehler im Umfang von #208; als offene Arbeit festhalten (Belegliste oder ein Bruch je Rechnung).

## Bestätigt

### D-2: Ein Mietvertrag über die ganze Periode trägt die Heizkosten nach Tagen

**Regel.** Bestätigt durch Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`, verbatim): «Kosten einer Heizkosten-Kategorie werden für einen Mietvertrag, der nur einen Teil der Periode läuft (Ein- oder Auszug), nach dem Heizprofil auf die Monate der ganzen Periode verteilt, … alle anderen nach Tagen». Der heutige Code (`prorating.service.ts:188-212`, `calculation.service.ts:302-320`) wendet das Heizprofil auch ohne Ein- oder Auszug an. Der Plan bringt den Code also in Übereinstimmung mit der Regel. Aus Sicht der Verwaltung ist das üblich: Wer das ganze Jahr mietet, trägt den vollen Wohnungsanteil, ausgewiesen als 365/365 bzw. 366/366 oder 100 %.

**Betrag** (nachgerechnet).
- Heizprofil heute: `tenant.percentage / period.percentage` mit identischem Zeitraum = 1, also 100 %.
- Nach Tagen ohne Leistungszeitraum: 366/366 = 1. Beispiel Wohnungsanteil CHF 500.00 → CHF 500.00 in beiden Fällen.
- Nach Tagen mit Leistungszeitraum (z. B. 01.10.–31.12.2024): 92/92 = 1.
- Randfall 0: Heizkosten CHF 0.00 → 0 in beiden Fällen.
- Mieterwechsel in der Periode (A bis 30.06., B ab 01.07.): beide Verträge laufen nur einen Teil der Periode, bleiben also beim Heizprofil (Winter: A 50 %, B 50 %, zusammen 100 %). Unverändert.

Die Beträge ändern sich nicht. Bedingung: «ganze Periode» wird an den effektiven Daten gemessen (Beginn ≤ Periodenbeginn und Ende leer oder ≥ Periodenende), wie es `effectiveStart`/`effectiveEnd` heute schon tun.

**Szenario.** «366/366 Tage» ist für 01.01.–31.12.2024 (Schaltjahr) richtig. In der Grundlage gibt es in Lindenhof 2024 nur die Heizkostenrechnung (`statement-detail.feature:24`, `tests/e2e/fixtures/backend.ts:252-255`). Die Prüfung trifft also wirklich die Heizungszeile und nicht eine andere Position.

### Braucht das PDF bei einem Mietvertrag über die ganze Periode einen Hinweis auf das Heizprofil (Art. 8 VMWG)?

Nein. Das gilt mit der Einschränkung zur Auslegung unten.
- Art. 8 Abs. 1 VMWG verlangt nur den Hinweis auf die detaillierte Abrechnung (Wortlaut in F-4).
- Art. 8 Abs. 2 VMWG (verbatim): «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
- Art. 257b Abs. 2 OR (verbatim): «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»

Keine dieser Normen verlangt, ein Heizprofil zu nennen. Das Heizprofil ist kein Verteilschlüssel zwischen Wohnungen, sondern teilt nur die Zeit zwischen aufeinanderfolgenden Mietern auf. Bei einem Mietvertrag über die ganze Periode wird es nicht angewendet. Ein Hinweis darauf («100.00 %») würde eine Berechnung nennen, die nicht stattfand. Der Hinweis nach Art. 8 Abs. 1 bleibt (F-4).

**unsicher:** dass das Heizprofil keine Angabe zur «Aufteilung» im Sinne von Art. 8 Abs. 1 ist, ist meine Auslegung; einen Fedlex-Wortlaut zum Heizprofil oder zu Heizgradtagen gibt es nicht.

### D-3: «48/62 Tage» ist der richtige Bruch (y = Tage, die die Rechnung in der Periode abrechnet)

**Regel.**
- Regel 5 (`:145`, verbatim): «mit Leistungszeitraum seine Mietstage darin / Tage des Leistungszeitraums in der Periode».
- Regel 1 (`:141`): «Mit Leistungszeitraum zählt vom Betrag nur der Teil, der nach Tagen in die Periode fällt».

**Code.** `invoice.service.ts:420-430` (`inPeriod`) schneidet den Leistungszeitraum auf die Periode zu. `calculation.service.ts:127-136` (`rentalShare`) teilt durch dessen Tage.

**Nachgerechnet.**
- Leistungszeitraum 01.07.–30.09.2025 = 92 Tage, davon in der Periode 01.07.–31.08. = 62 Tage.
- Kosten Liegenschaft: 900 × 62/92 = 606.5217 → CHF 606.52.
- Mieter ab 15.07.: 15.07.–31.08. = 48 Tage → 48/62 = 0.774194 (gespeichert gerundet 0.7742 = «77.42 %»).

**Randfälle.**
- Mieter über die ganze Periode: 62/62 = 1.
- Auszug am 30.06.: 0/62, Betrag 0.
- Gutschrift (negativer Betrag) mit gleichem Leistungszeitraum: gleicher Bruch, negativer Betrag. Die Rechnung geht auf.

**Bruch statt Prozent.** Bei einem Wohnungsanteil von CHF 606.52 rechnet Dwello 606.52 × 48/62 = 469.5639 → CHF 469.56. Mit dem gedruckten «77.42 %» käme der Mieter auf 606.52 × 0.7742 = 469.5678 → CHF 469.57. Der Prozentwert ergibt also 1 Rappen Differenz; der Bruch geht mit dem Taschenrechner auf (Thema 6, `:94`). Das bestätigt die Absicht von D-3.

### Weitere Prüfungen

- **Begriffe in den Szenarien:** Liegenschaftsverwalter, Mieter, Mietvertrag, Nebenkostenabrechnung, Heizprofil, Mietstage, Leistungszeitraum, Rechnung, Heizkosten (Kategorie) stehen im Glossar. «Periode» in Titel und Kommentar steht kurz für Abrechnungsperiode; das ist zulässig, die Regeln verwenden es ebenso. «Hauswart» ist eine Kategorie der Demo- und Testdaten.
- **Art. 257a Abs. 2 OR** (verbatim): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Die Änderung berührt das nicht.
- **Art. 4 VMWG und Art. 5 Abs. 2 lit. a VMWG** («die Brennstoffe und die Energie, die verbraucht wurden»): nicht berührt. Der Tankbestand bildet eine eigene Kostenposition; bei einem Mietvertrag über die ganze Periode ergibt er einen Zeitanteil von 1.
- **Art. 7 VMWG** (Leerstand): nicht berührt. Ein Mietvertrag über die ganze Periode hat keinen Leerstand; Leertage bleiben beim Vermieter wie bisher.
- **`docs/anforderungen-vertragsende.md`:** enthält keine Regel zum Zeitanteil oder zum Heizprofil im PDF (nur Mietstage als Grundlage, `:225`, `:251`).

## Nicht bestätigt

- **Ein Bruch statt Prozent als Anforderung:** Für «nachvollziehbar» (Thema 2) und den Bruch als Zeitanteil (Thema 6) gibt es keinen Fedlex-Wortlaut. Die Quellen der Anforderungen sind dort unsicher-B (Mobiliar, Betterhomes, Mieterverband). Gesucht habe ich mit `mmx search` (VMWG Art. 8) und im Text von VMWG und OR auf Fedlex.
- **Ob das Heizprofil eine «Aufteilung» im Sinne von Art. 8 Abs. 1 VMWG ist:** keine Norm und kein Entscheid gefunden; siehe Auslegung oben.
- **Ob die Praxis die Tage eines Leistungszeitraums nach Tagen auf eine Teilperiode aufteilt:** Für nicht verbrauchsabhängige Kosten gibt es keine Schweizer Primärquelle (`docs/nebenkostenabrechnung-anforderungen.md:161`, Unsicherheit 7). Dwello wendet die Regel bereits an; #208 ändert nur die Anzeige.
- **E2E-Stand:** Die Szenarien habe ich nicht ausgeführt. Dass sie aus dem richtigen Grund fehlschlagen, übernehme ich aus dem Plan (`implementation_plan.md:12`). Dass das Hauswart-Szenario nur die eine Position hat, habe ich an der Grundlage nachvollzogen: Die Heizkostenrechnung ist datiert auf den 30.06.2024 und liegt damit ausserhalb der Periode 2025.
