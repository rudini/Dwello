# Fachreview #229, Runde 1 (vor der Umsetzung)

Gegenstand: Commit `9dbc4816` (Worktree `review-229-fach`): `@wip`-Szenario «PDF nennt bei einer Periode unter einem Jahr die Monatsanteile der Periode» (`tests/e2e/features/statement-detail.feature:246–257`), Plan in `implementation_plan.md:5–22` (Session 14), geplanter PDF-Text (vom Aufrufer, vier Sprachen), Issue #229 mit Kommentar (Rundungsfall C-1).

Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/design/i18n-begriffe.md`, `docs/nebenkostenabrechnung-anforderungen.md` (Regeln 5, 6, Themen 3, 4, 6), Fedlex-Filestore VMWG (SR 221.213.11, Stand 1.10.2025) und OR (SR 220, Stand 1.1.2026), Code in `backend/src/services/{pdf,statement-pdf,prorating,heating-profile}.service.ts`.

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| F-1 | Verwalter / Mietrecht | Major | «zusammen 43.00 % von 50.00 % der Abrechnungsperiode» ist missverständlich: «x % von y %» heisst x × y (21.5 %), und «50 % der Abrechnungsperiode» liest sich als «die halbe Periode» (de, en; fr/it zum Teil) |
| F-2 | Verwalter | Minor | Rundung: Die gedruckten Summen ergeben den gedruckten Prozentsatz nicht immer (Einzug 05.01.: 47.68 / 50.00 = 95.36 %, gedruckt 95.35 %), und die gedruckten Monate ergeben nicht immer die gedruckte Summe |
| F-3 | Verwalter | Minor | Bedingung «unter 100 %» deckt Heizprofile mit 100.1 % (Toleranz Regel 6) und Perioden über ein Jahr nicht ab; dort gehen Monate und Prozentsatz ohne Hinweis auseinander |
| F-4 | Verwalter | Minor | Dass eine Periode von einem ganzen Jahr keinen Zusatz bekommt, prüft kein Test und kein Szenario |
| F-5 | Verwalter | Nit | Der Szenariotitel verspricht «die Monatsanteile der Periode», das PDF nennt nur ihre Summe |
| F-6 | Verwalter | Nit | Geschütztes Leerzeichen zwischen Zahl und «%» auch im Zusatz, wie bei den Monaten |
| F-7 | Verwalter | Nit | Die Summe der Periode ({period}) kann der Mieter nicht nachprüfen, weil die übrigen Monate der Periode nicht im PDF stehen |
| F-8 | Verwalter | Nit | F-3 (ältere Abrechnungen): Der Vergleich nur des Ergebnisses lässt bei einem Profil, das innerhalb der Monate des Mieters umverteilt wurde, andere Monate durch |

## F-1 (Major): Wortlaut «von … % der Abrechnungsperiode» ist missverständlich

**Beleg.** Geplanter Text de «; zusammen {tenant} % von {period} % der Abrechnungsperiode», en «; together {tenant} % of {period} % of the billing period»; Szenario `statement-detail.feature:257` (`steht im PDF "zusammen 43.00 % von 50.00 % der Abrechnungsperiode"`). Im Kontext druckt das PDF:

> Heizkosten nach Heizprofil «Winter»: 86.00 % der Heizkosten Ihrer Wohnung in der Abrechnungsperiode
> Anteile der Monate Ihres Mietverhältnisses: Jan 18.00 %, Feb 14.00 %, Mär 11.00 %; zusammen 43.00 % von 50.00 % der Abrechnungsperiode

**Warum falsch.**
1. «43 % von 50 %» bedeutet im Deutschen (und «43 % of 50 %» im Englischen) rechnerisch 0.43 × 0.50 = 21.5 %. Gemeint ist das Verhältnis 43 / 50 = 86 %. Der Mieter, der nachrechnen will (Ziel von F-6 im Issue), wird so gerade in die falsche Rechnung geführt. Bei den Tagen hat Dwello dafür bewusst die Bruchform «31/62 Tage» bzw. «{days} Mietstage von {total} Tagen» (`pdf.service.ts:74`, `:77`): «von» steht dort zwischen ganzen Zahlen, nicht zwischen Prozentsätzen.
2. «50.00 % der Abrechnungsperiode» liest sich als «die Hälfte der Abrechnungsperiode» (eine Zeitangabe). Gemeint ist: Die Monate der Periode tragen im Heizprofil zusammen 50 %. Im Beispiel Januar bis Juni fällt beides zufällig zusammen (6 von 12 Monaten), was die Fehllesung noch stützt; bei einer Periode Juli bis Dezember stünde «von 50.00 % der Abrechnungsperiode» (2+0+0+0+2+8+14+26 = 52 %, also nicht einmal das).
3. fr «sur» und it «su» sind als «von … (Bruch)» besser lesbar, aber «de la période de décompte» / «del periodo di conteggio» haben dasselbe Problem wie Punkt 2.

Anforderung: Thema 6, Betragsformat: «den Zeitanteil als Bruch der Mietstage drucken, damit die Zeile mit dem Taschenrechner aufgeht» (`docs/nebenkostenabrechnung-anforderungen.md:92`); Regel 5 (Zeile 145) zeigt den Anteil nach Heizprofil in Prozent. Rechtlich verlangt Art. 8 Abs. 1 VMWG eine «detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten» (Wortlaut unten); dass die Aufteilung für den Mieter rechnerisch nachvollziehbar sein muss, steht so nicht im Gesetz (**unsicher**, siehe «Nicht bestätigt»), ist aber Praxis und Ziel des Issues.

**Lösung (Vorschlag, alle Platzhalter mit geschütztem Leerzeichen vor «%»):** die Summe der Periode als eigenen Satzteil nennen und die Rechnung ausschreiben, mit «/» wie beim Bruch der Tage:

- de: «; zusammen {tenant} %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen {period} %: {tenant} % / {period} % = {percent} %»
- fr: « ; au total {tenant} %. Les mois de la période de décompte totalisent {period} % dans le profil de chauffage : {tenant} % / {period} % = {percent} %»
- it: «; in totale {tenant} %. I mesi del periodo di conteggio totalizzano {period} % nel profilo di riscaldamento: {tenant} % / {period} % = {percent} %»
- en: «; together {tenant} %. The months of the billing period total {period} % in the heating profile: {tenant} % / {period} % = {percent} %»

Beispiel: «… Mär 11.00 %; zusammen 43.00 %. Die Monate der Abrechnungsperiode haben im Heizprofil zusammen 50.00 %: 43.00 % / 50.00 % = 86.00 %». {percent} ist derselbe Wert wie in der Zeile darüber (Plan, Rundung). Die Gleichung ist nur ehrlich, wenn F-2 gelöst ist. Szenariozeile 257 entsprechend anpassen (z. B. `steht im PDF "50.00 %: 43.00 % / 50.00 % = 86.00 %"`). Alle Begriffe (Abrechnungsperiode, Heizprofil; fr «période de décompte», «profil de chauffage»; it «periodo di conteggio», «profilo di riscaldamento»; en «billing period», «heating profile») stehen im Glossar bzw. in `docs/design/i18n-begriffe.md:49`, `:54`. Ein neuer Begriff ist nicht nötig.

## F-2 (Minor): Rundung, die Rechnung geht nicht immer auf

**Beleg.** Nachgerechnet mit dem Verfahren von `calculateHeatingShare` (`heating-profile.service.ts:338–368`, Monat anteilig nach Tagen) und `handleMidYearMoves` (`prorating.service.ts:212–216`, Prozentsatz = Mieter / Periode × 100, ungerundet), Heizprofil «Winter» aus der Grundlage (`statement-detail.feature:11–24`):

| Fall | Monate (exakt) | {tenant} | {period} | gedruckter Prozentsatz | {tenant}/{period} gerundet |
|---|---|---|---|---|---|
| Szenario: Periode 01.01.–30.06.2024, Mietvertrag 01.01.–31.03. | 18, 14, 11 | 43.00 | 50.00 | 86.00 | 86.00 (stimmt) |
| Marc Huber, Einzug 01.05.2024, gleiche Periode | 2, 0 | 2.00 | 50.00 | 4.00 | 4.00 (stimmt) |
| Randfall Leerstand: April | 5 | – | 50.00 | 10 % trägt der Vermieter (Art. 7 Abs. 1 VMWG) | 86 + 4 + 10 = 100 (stimmt) |
| Einzug 05.01.2024, Periode 01.01.–30.06. | 15.6774, 14, 11, 5, 2, 0 | 47.68 | 50.00 | 95.35 | 95.36 (Abweichung 0.01) |
| Einzug 06.01.2024, Periode 01.01.–15.05. | 15.0968, 14, 11, 5, 0.9677 | 46.06 | 48.97 | – | gedruckte Monate 15.10+14+11+5+0.97 = 46.07 ≠ 46.06 |

Bei der Periode 01.01.–30.06. weichen 218 Einzugs- bzw. Auszugstage der drei geprüften Perioden um 0.01 ab (Skript im Scratchpad, `calc/r.py`). Bei CHF 1000 Heizkosten: 95.3548 % ergibt CHF 953.55, gerechnet mit 95.36 % CHF 953.60.

**Warum falsch.** Ziel von F-6 ist, dass der Mieter nachrechnen kann; mit der Gleichung aus F-1 stünde sogar eine falsche Gleichung im PDF. Ein- und Auszüge im Monat sind in der Schweiz eher die Ausnahme (Termine meist Monatsende), der Fall kommt aber vor (Szenario `statement-detail.feature:206–219` mit Einzug am 15.06.).

**Lösung.** {tenant} als Summe der gedruckten, auf zwei Stellen gerundeten Monate und {period} ebenso aus den gerundeten Monaten der Periode. Ob der Anteil, mit dem die Beträge gerechnet werden, dann auch aus diesen gerundeten Summen kommt (ändert Beträge um wenige Rappen), ist eine Produktentscheidung: dafür ein Issue (Labels `fachlich`, `entscheiden`), Vorschlag «Der Anteil nach Heizprofil wird aus den auf zwei Stellen gerundeten Monatsanteilen gerechnet, damit {tenant} % / {period} % den gedruckten Prozentsatz ergibt». Bis zur Entscheidung zumindest nicht «=» drucken, sondern die beiden Summen ohne Gleichung (oder «≈»). Das passt zum Rundungspunkt des Plans («note and line show one value»): dann zeigen Hinweis, Zeile und Zusatz denselben Wert.

## F-3 (Minor): Bedingung «unter 100 %» zu eng

**Beleg.** Plan und Auftrag: Zusatz «only when the period's months carry less than 100 %». Regel 6: «Zwölf Monatsanteile, zusammen 100 % (Dwello lässt ±0,1 Prozentpunkte Rundungsdifferenz zu)» (`nebenkostenabrechnung-anforderungen.md:146`; Code `heating-profile.service.ts:142–144`, `tolerance = 0.1`). Perioden über ein Jahr sieht der Code vor (`invoice-completeness.service.ts:157–158`, «A period over a year …»).

**Warum falsch.** Rechenbeispiele:
- Ganzes Jahr, eigenes Heizprofil mit Summe 100.05 %, Mieter Jan–Mär mit 43.00 %: Prozentsatz 43.00 / 100.05 × 100 = 42.98 %, die Monate ergeben 43.00 %, und weil 100.05 nicht «unter 100» liegt, fehlt der Zusatz. Bei Summe 99.95 erscheint er dagegen (43.02 %), was richtig ist.
- Periode über 12 Monate (z. B. 01.01.2024–30.06.2025 beim Wechsel der Periode): die Monate der Periode haben zusammen über 100 %, der Zusatz fehlt, Monate und Prozentsatz gehen auseinander.

**Lösung.** Zusatz drucken, wenn die (auf zwei Stellen gerundete) Summe der Periode ≠ 100.00 ist, nicht nur wenn sie kleiner ist. Die bestehende Bedingung für die Monatsliste (`percent < 100`, `pdf.service.ts:646`) betrifft den Mieter und bleibt.

## F-4 (Minor): «Ganzes Jahr ohne Zusatz» nicht abgesichert

**Beleg.** Der Plan (`implementation_plan.md:12`) und der Auftrag setzen voraus, dass eine Periode von einem Jahr keinen Zusatz bekommt. Das Szenario für das ganze Jahr (`statement-detail.feature:222–244`) prüft nur, was im PDF steht, nicht was fehlt.

**Bestätigt in der Sache.** Bei einer Periode von 12 ganzen Monaten und einem Heizprofil mit 100.00 % ist {period} = 100 und Prozentsatz = {tenant} / 100 × 100 = {tenant}: die gedruckten Monate ergeben den Prozentsatz schon allein (Beispiel 18 + 14 + 11 = 43 % → «43.00 % der Heizkosten», Zeile 242). Der Zusatz wäre dort nur Wiederholung; ihn wegzulassen ist richtig (mit der Ausnahme aus F-3).

**Lösung.** Im Szenario Zeile 222–244 einen Schritt `Und steht im PDF nicht "Abrechnungsperiode haben"` (bzw. das Kennwort des neuen Texts) oder einen Test in `statement-pdf-render.test.ts`/`statement-pdf.pg.test.ts`, rot vor der Umsetzung nicht nötig (er bleibt grün), aber er schützt die Regel.

## F-5 (Nit): Szenariotitel

**Beleg.** `statement-detail.feature:249`: «PDF nennt bei einer Periode unter einem Jahr die Monatsanteile der Periode». Das PDF nennt nur die Summe der Monatsanteile der Periode, nicht die einzelnen.

**Lösung.** «PDF zeigt bei einer Periode unter einem Jahr, wie sich der Anteil aus den Monaten ergibt» oder «… nennt die Summe der Monatsanteile der Periode».

## F-6 (Nit): Geschütztes Leerzeichen

**Beleg.** Die Monate werden mit ` %` gedruckt, damit «Jun 3.70 %» nicht umbricht (`pdf.service.ts:645–647`). Der Zusatz hängt an derselben Zeile, die bei kleinen Schriftgrössen umbricht.

**Lösung.** In allen vier Sprachen `{tenant} %` und `{period} %` (und `{percent} %` bei der Gleichung aus F-1). Das französische Leerzeichen vor «;» und «:» folgt dem bestehenden Stil des PDF (`pdf.service.ts:115`, `:156`, normales Leerzeichen); kein Befund.

## F-7 (Nit): Summe der Periode nicht nachprüfbar

**Beleg.** Das PDF druckt die Monate des Mieters, aber nicht die übrigen Monate der Periode (im Beispiel Apr 5, Mai 2, Jun 0). Anforderungen Thema 4: «Dwello-«Heizprofil» = Monatsanteile; im PDF ausweisen … Quelle der verwendeten Tabelle … im PDF nennen» (`nebenkostenabrechnung-anforderungen.md:67`, unsicher-B).

**Warum.** Mit dem Zusatz kann der Mieter 43 / 50 rechnen, die 50 aber nur über die Belegeinsicht (Art. 8 Abs. 2 VMWG, Art. 257b Abs. 2 OR) prüfen. Für das Issue genügt das («so the tenant can recompute 43 / 50»); ein Treuhänder würde die Monatstabelle der Periode beilegen.

**Lösung (optional, nicht in diesem Issue).** Später alle Monate der Periode drucken, die des Mieters hervorgehoben. Kein Issue nötig, falls der Produktverantwortliche es nicht will; sonst `fachlich`.

## F-8 (Nit): F-3 vergleicht nur das Ergebnis

**Beleg.** Plan: «prints the month list only when the recomputed share equals its heating position's `period_share`».

**Warum.** Wurde ein eigenes Heizprofil nach dem Erstellen so geändert, dass die Monate des Mieters zusammen gleich bleiben (z. B. Jan 18 → 20, Feb 14 → 12 bei einer Jahresperiode), ist der Anteil gleich, die gedruckten Monate sind aber nicht die, mit denen gerechnet wurde. Das «Done means» («never prints months that do not give the share its amounts were calculated with») ist trotzdem erfüllt: die Monate ergeben den Anteil. Akzeptabel; nur zur Kenntnis.

## Bestätigt

- **Arithmetik des Szenarios:** Profil «Winter» (Grundlage, Zeile 11–24) ergibt 18+14+11+5+2+0+0+0+2+8+14+26 = 100. Periode 01.01.–30.06.2024: 18+14+11+5+2+0 = 50. Eva Frei (01.01.–31.03.): 18+14+11 = 43; 43 / 50 = 0.86 → «86.00 % der Heizkosten» (Zeile 255) und «Jan 18.00 %, Feb 14.00 %, Mär 11.00 %» (Zeile 256) sind richtig. Gegenprobe mit zweitem Mieter: Marc Huber ab 01.05.: 2 / 50 = 4 %; April leer: 5 / 50 = 10 % beim Vermieter; 86 + 4 + 10 = 100.
- **Leerstand beim Vermieter (Regel 5 mit Heizprofil, Art. 7 Abs. 1 VMWG):** Fedlex: «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.» Die Rechnung «Monate des Mieters / Monate der Periode» lässt den April beim Vermieter; das entspricht der Norm.
- **Regel 5 (Heizprofil nur bei Ein- oder Auszug):** Ein Mietvertrag über die ganze kurze Periode wird nach Tagen verteilt (`prorating.service.ts:208–209`), dann gibt es keinen Heizprofil-Hinweis und keinen Zusatz. Ebenso bei einer Periode, deren Monate 0 % haben (`:214`, #137). Randfall Mieter mit 0 % in einer kurzen Periode (z. B. nur Juni): «zusammen 0.00 % … 0.00 % / 50.00 % = 0.00 %» ist richtig.
- **Ganzes Jahr ohne Zusatz:** richtig (F-4), Ausnahme F-3.
- **Begriffe:** Abrechnungsperiode, Heizprofil (Glossar Zeilen 115, 129), Mietverhältnis und Monatsanteile wie in den bestehenden PDF-Texten bzw. Regel 6. Übersetzungen entsprechen `i18n-begriffe.md:49`, `:54`. Kein fehlender Begriff.
- **F-3 (Plan):** Prozentsatz aus `period_share` der Heizposition, Monate nur bei Übereinstimmung: deckt «Done means» ab (siehe F-8).
- **F-7 (Plan):** Detailseite mit dem gespeicherten Profilnamen: fachlich richtig, PDF und Detailseite nennen dann dasselbe Profil.
- **Rundung (Plan):** ein Wert für Hinweis und Zeile: richtig, ergänzt durch F-2.
- **Gesetz, vom Vorhaben nicht berührt** (Fedlex-Wortlaut):
  - Art. 4 Abs. 1 VMWG: «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.»
  - Art. 5 Abs. 1 VMWG: «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.»
  - Art. 6 VMWG: «Nicht als Heizungs- und Warmwasseraufbereitungskosten anrechenbar sind die Aufwendungen für: a. die Reparatur und Erneuerung der Anlagen; b. die Verzinsung und Abschreibung der Anlagen.»
  - Art. 8 Abs. 1 VMWG: «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Abs. 2: «Der Mieter oder sein bevollmächtigter Vertreter ist berechtigt, die sachdienlichen Originalunterlagen einzusehen und über den Anfangs- und Endbestand von Heizmaterialien Auskunft zu verlangen.»
  - Art. 257a Abs. 2 OR: «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.»
  - Art. 257b Abs. 1 OR: «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, sowie für öffentliche Abgaben, die sich aus dem Gebrauch der Sache ergeben.» Abs. 2: «Der Vermieter muss dem Mieter auf Verlangen Einsicht in die Belege gewähren.»

## Fehlende Begriffe

Keine. Für F-2 ein Entscheid-Issue (Labels `fachlich`, `entscheiden`), Vorschlag siehe F-2.

## Nicht bestätigt

- **Nachvollziehbarkeit als Rechtspflicht:** Art. 8 Abs. 1 VMWG verlangt eine «detaillierte Abrechnung und Aufteilung», sagt aber nichts dazu, dass der Mieter den Prozentsatz nachrechnen können muss. Gesucht in VMWG Art. 4–8 und OR Art. 257a–257b (Fedlex-Filestore). Die Begründung von F-1 und F-2 stützt sich deshalb auf Praxis und Thema 6; rechtlich **unsicher**.
- **Verteilung der Heizkosten einer Rumpfperiode nach den Monatsanteilen der Periode** (Mieter / Periode statt Mieter / Jahr): in der Praxis (HEV-Heizgradtagtabellen, Thema 4, unsicher-B) üblich, auf Fedlex keine Norm; nicht im Wortlaut bestätigt.
- **Perioden über ein Jahr:** ob Dwello beim Erstellen eine Periode über 12 Monate zulässt, nicht geprüft (nur der Hinweis in `invoice-completeness.service.ts:157`). Art. 4 Abs. 1 VMWG («jährlich mindestens einmal») spricht gegen solche Perioden; F-3 gilt, soweit sie möglich sind.
- **Auszüge und Einzüge mitten im Monat:** wie häufig sie vorkommen (Gewicht von F-2), nicht recherchiert.
