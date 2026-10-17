# Fachreview #199 / #211, Runde 1 (Szenarien vor der Umsetzung)

Gegenstand: die `@wip`-Szenarien aus `git diff 87dda97 da2dcef -- tests/e2e/features` und das geänderte Szenario «Erinnerung endet mit der Abrechnung jedes Mietvertrags der Periode». Worktree: `/tmp/claude-0/-home-user-Dwello/c539e8ea-b211-51a3-8d7c-2c40389c0007/scratchpad/review-211-fach` (Commit da2dcef). Gesetzestexte: Fedlex-Filestore, VMWG Fassung 01.10.2025, OR Fassung 01.10.2026.

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| M-1 | Mietrecht | Major | Die kurze Abrechnungsperiode und der Lauf mit Überlappungsregel führen im selben Gebäude zu verschiedenen Abrechnungsperioden für dieselben Tage; Rechnungen ohne Leistungszeitraum werden dann zu über 100 % verteilt (Art. 257b Abs. 1 OR) |
| V-1 | Verwalter | Major | Schritt 2 «Gebäude» zeigt eine Lücke auf Gebäudeebene, sie entsteht aber pro Mietvertrag; das Szenario erwartet einen Text, der die fehlenden Mietstage von Eva Frei (01.01.–31.03.2024) verschweigt |
| V-2 | Verwalter | Major | Teilweise abgerechnete Periode am Mietvertrag: kein Szenario für den Weg in den Assistenten (die volle Periode 2024 erzeugt für Anna nichts) und kein Szenario für den bestehenden Text «… aber noch keine Nebenkostenabrechnung», der dann falsch ist |
| V-3 | Verwalter | Major | Die Übersicht nennt jede beendete Periode seit dem Vertragsbeginn, «Abgerechnet bis» (#133) gibt es aber noch nicht: ausserhalb von Dwello abgerechnete Verträge erzeugen Erinnerungen, die sich nicht abschalten lassen |
| M-2 | Mietrecht | Minor | Die Erinnerung nennt auch Perioden, die über 5 Jahre zurückliegen (in der Grundlage: Seeblick 2020), ohne Hinweis auf die Verjährung |
| V-4 | Verwalter | Minor | Mit der neuen Regel prüft das bestehende Szenario «Erinnerung bleibt, bis jeder Mietvertrag der Periode abgerechnet ist» nicht mehr, was es prüfen soll |
| V-5 | Verwalter | Minor | Der Link zu den Rechnungen filtert nach dem Jahr des Rechnungsdatums, Dwello ordnet Rechnungen der Periode aber nach Leistungszeitraum zu; ältere Jahre fehlen im Filter |
| V-6 | Verwalter | Minor | Die Regel sagt nicht genau, was ein «Teil» ist (zusammenhängendes Intervall oder nur Mietstage); kein Szenario für zwei Lücken in einer Periode |
| M-3 | Mietrecht | Minor | Der Entscheid in #199 («not for every period since the Vertragsbeginn») lässt sich auch gegen #211 lesen |
| V-7 | Verwalter | Minor | Fehlende oder veraltete Begriffe: «Hinweis auf fehlende Abrechnungen» (UL), «Nebenkostenabrechnung» = «jährlich», neu «Tage ohne Abrechnung», «kurze Abrechnungsperiode», «Bestehende Abrechnungen» |
| V-8 | Verwalter | Nit | Der Schritt «… die Periode "2023"» passt auf jedes Datum mit 2023 |

---

## M-1 (Major): Gemischte Abrechnungsperioden in einem Gebäude verteilen Rechnungen zu über 100 %

**Beleg.**
- `statement-generate.feature`, Szenarien «Tage ohne Abrechnung bei der Wahl der Gebäude» und «Kürzere Abrechnungsperiode für die Tage ohne Abrechnung». In der Grundlage hat Eva Frei 3.01 vom 01.01. bis 31.03.2024 gemietet, Marc Huber 3.01 seit 01.05.2024. Nur Marc hat eine Abrechnung vom 01.07.2023 bis 30.06.2024.
- Regel 1 in `docs/nebenkostenabrechnung-anforderungen.md:141`: eine Rechnung ohne Leistungszeitraum zählt in der Periode ihres Rechnungsdatums. Regel 5 (`:145`): sie wird nach Mietstage / Tage der Periode verteilt.
- `docs/PRD-Dwello.md:510`: «Global setting applies to all statements». `:596–601`: bei einem Mieterwechsel teilen sich beide Mietverträge dieselben Tage der Periode (200/365 + 165/365).
- Art. 257b Abs. 1 OR (Fedlex): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, …»

**Nachrechnung.** Der geführte Weg sieht so aus: Lauf 2024 für Lindenhof. Eva wird über 01.01.–31.12.2024 abgerechnet, Marc wird übersprungen, weil seine Abrechnung die Periode überlappt. Danach folgt die kurze Periode 01.07.–31.12.2024 für Marc. Das ist die Konstellation in den Szenarien. Wohnungsanteil 3.01 = 100 % (einzige Wohnung).
1. Rechnung CHF 1'000, Rechnungsdatum 15.11.2024, ohne Leistungszeitraum. Eva (2024, 366 Tage): 91 Mietstage → 1'000 × 91/366 = **248.63**. Marc (01.07.–31.12.2024, 184 Tage): 184/184 → **1'000.00**. Zusammen **1'248.63 für Kosten von 1'000.00**.
2. Gleiche Rechnung mit Leistungszeitraum 01.11.–30.11.2024: Eva 0/30 → 0.00, Marc 30/30 → 1'000.00, zusammen 1'000.00. Mit Leistungszeitraum stimmt es.
3. Rechnung CHF 600, Rechnungsdatum 15.03.2024, ohne Leistungszeitraum: Marc (alte Abrechnung 01.07.2023–30.06.2024, 366 Tage) 61/366 → 100.00. Eva 91/366 → 149.18. Die kurze Periode enthält die Rechnung nicht. Zusammen 249.18 ≤ 600, das stimmt.
4. Heizkosten mit Heizprofil: Eva trägt den Anteil der Monate Jan.–März an den Heizrechnungen 2024 (je nach Profil rund 35–45 %). Marc trägt in der kurzen Periode 100 % der Heizrechnungen von Juli bis Dezember. Eine Öllieferung im Oktober wird so zu rund 140 % verteilt.

**Warum falsch.** Zusammen bezahlen die Mieter mehr als die tatsächlichen Aufwendungen. Für sich ist jeder Anteil nach Dwellos Regel richtig berechnet; falsch wird es, weil zwei Abrechnungsperioden dieselben Tage desselben Gebäudes abdecken. Das gab es mit der Überlappungsregel im Lauf schon vorher, aber erst die angebotene kurze Periode macht es zum geführten Weg.

**Korrektur (Produktentscheid, Issue `fachlich` + `entscheiden`).** Vorschlag: Ein Gebäude hat für jeden Tag nur eine Abrechnungsperiode. Tage ohne Abrechnung, die in der Periode einer bestehenden Abrechnung des Gebäudes liegen, rechnet Dwello in dieser Periode ab: Eva über 01.07.2023–30.06.2024, wie Marc. Die kurze Periode schlägt Dwello nur für die Tage vor, die keine Abrechnung des Gebäudes abdeckt, und dann für alle Mietverträge des Gebäudes. Ein Lauf, dessen Periode die einer anderen Abrechnung desselben Gebäudes schneidet, aber nicht gleich ist, warnt oder wird abgelehnt. Ein zusätzliches Szenario sollte den Mieterwechsel mit gemischten Perioden zeigen.

## V-1 (Major): Die Lücke im Schritt 2 gehört zu einem Mietvertrag, nicht zum Gebäude

**Beleg.** `statement-generate.feature`, «Tage ohne Abrechnung bei der Wahl der Gebäude»: erwartet exakt (`toBe`, `statement-generate.steps.ts`) «Bestehende Abrechnungen: 01.07.2023 – 30.06.2024. Noch ohne Abrechnung: 01.07.2024 – 31.12.2024.» Nach der geplanten Regel fehlen aber für 2024:
- Eva: P = 01.01.–31.12.2024, keine Abrechnung → ganz ungedeckt, Mietstage 01.01.–31.03.2024 → fehlt.
- Marc: ungedeckt 01.07.–31.12.2024, Mietstage → fehlt.

Der erwartete Text nennt nur Marcs Lücke und sagt nicht, für wen sie gilt. Wählt der Verwalter den Link «Abrechnungsperiode 01.07.2024 – 31.12.2024 wählen», entsteht für Eva nichts, und er glaubt das Gebäude abgerechnet. Wann die Lücke für das Gebäude gilt, sagt die Regel nicht (Vereinigung über die Verträge? nur Verträge mit überlappender Abrechnung?). Der Target `buildingShortPeriodLink` mit `.first()` deutet auf mehrere Lücken hin, ohne dass ein Szenario sie beschreibt.

**Korrektur.** Die Regel für das Gebäude festlegen: die Vereinigung der fehlenden Teile aller Mietverträge, und der Text nennt die Mieter, z. B. «Marc Huber: Bestehende Abrechnung 01.07.2023 – 30.06.2024, noch ohne Abrechnung 01.07.2024 – 31.12.2024.» Oder im Szenario eine Abrechnung 01.07.2023–30.06.2024 auch für Eva anlegen: Das ist der realistische Fall eines Wechsels der Einstellung, denn alle Verträge haben dann die alte Periode. Den gemischten Fall regelt M-1.

## V-2 (Major): Teilweise abgerechnete Periode am Mietvertrag, Weg und Text fehlen

**Beleg.** `contract-detail.feature`, «Teilweise abgerechnete Periode am Mietvertrag» prüft nur, dass «01.10.2024 – 31.12.2024» im Hinweis steht. Heute verlinkt `missingStatements` (`src/routes/contracts/[id]/+page.server.ts:69–86`) die ganze Periode (`wizardLink(building, start, end)`). Für die volle Periode 2024 überspringt der Lauf Anna (ihre Abrechnung 01.04.–30.09.2024 überlappt) und sagt «Alle Mietverträge haben in dieser Periode schon eine Abrechnung …» (`messages/de.json`, `statements_all_billed`): Der Verwalter steckt fest. Ausserdem sagt `contracts_statement_missing_text` (`messages/de.json:1393`): «Der Mietvertrag hat Mietstage in dieser Abrechnungsperiode, aber noch keine Nebenkostenabrechnung.» Bei teilweiser Deckung stimmt das nicht. #199 (Entscheid): «Dwello names the uncovered days and the period of the existing statement … and offers a short Abrechnungsperiode for the uncovered days.»

**Korrektur.** Ein Szenario «Wenn der Liegenschaftsverwalter die fehlende Abrechnung "01.10.2024 – 31.12.2024" erstellen will, dann ist er im Abrechnungsassistenten für "Ahornhof" und die Periode "2024-10-01" bis "2024-12-31"». Ein eigener Text für den Teilfall, z. B. «Die bestehende Abrechnung deckt 01.04.2024 – 30.09.2024 ab. Noch ohne Abrechnung: 01.10.2024 – 31.12.2024.» (alle vier Sprachen).

## V-3 (Major): Übersicht über alle Perioden seit Vertragsbeginn, ohne «Abgerechnet bis»

**Beleg.** `dashboard.feature`, «Erinnerung nennt eine ältere Periode ohne Abrechnung». #211: «depends on #133». UL `UBIQUITOUS_LANGUAGE.md:46–47`: «Abgerechnet bis … geplant (#133)». #133 ist offen und noch nicht umgesetzt.

**Warum falsch.** Wer Dwello mit bestehenden Mietverträgen beginnt (Vertragsbeginn z. B. 2015, abgerechnet ausserhalb von Dwello), sieht auf der Startseite «Noch nicht abgerechnet: … (2015, 2016, …, 2025)» und kann die Erinnerung nur loswerden, indem er falsche Entwürfe erstellt. Am Mietvertrag gibt es das schon seit #142. Die Übersicht ist aber die Seite, die jeder zuerst sieht, und die Aufgabe verlangt eine Handlung. Für die Zielgruppe (selten in der App, wenig Erfahrung) ist das eine falsche Anweisung.

**Korrektur.** #133 vor oder mit dieser Änderung umsetzen. Sonst muss der Product Owner entscheiden, wie weit die Übersicht bis dahin zurückschaut (z. B. erst ab der ältesten Abrechnung des Gebäudes in Dwello). Gehört unter «Blocked on me».

## M-2 (Minor): Perioden über 5 Jahre ohne Hinweis

**Beleg.** In der Grundlage von `dashboard.feature` mietet Anna seit 2020-01-01 und hat keine Abrechnung. Heute (16.10.2026) nennt die Aufgabe damit Seeblick mit 2020, 2021, …, 2025. `docs/nebenkostenabrechnung-anforderungen.md:78`: «Abrechnungen nicht für Perioden erstellen lassen, die über 5 Jahre zurückliegen (Warnung).» Art. 128 OR (Fedlex): «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen; …» Art. 130 Abs. 1 OR: «Die Verjährung beginnt mit der Fälligkeit der Forderung.» Wann die Nebenkostenforderung fällig wird, ist **unsicher** (UL `:161`: «nicht einheitlich geklärt»).

**Korrektur.** Perioden, die vor über 5 Jahren endeten, mit einem Hinweis nennen, oder als Folge-Issue nach der Anforderung `:78`. Kein Blocker für dieses Szenario.

## V-4 (Minor): Bestehendes Szenario verliert seine Aussage

**Beleg.** `dashboard.feature`, «Erinnerung bleibt, bis jeder Mietvertrag der Periode abgerechnet ist». Bruno und Carla mieten beide vom 01.04.2024 bis 30.09.2025 (`dashboard.steps.ts:61–68`, lastYear = 2025). Nur Bruno hat die Abrechnung 2025. Mit der neuen Regel fehlt Bruno auch 2024, also nennt die Übersicht Ahornhof, auch wenn Carla abgerechnet wäre. Das Szenario würde einen Fehler «pro Gebäude statt pro Mietvertrag» nicht mehr finden. Die Änderung am Szenario «Erinnerung endet …» (Abrechnungen beider Jahre) stimmt dagegen: Vertrag 01.04.2024–30.09.2025, Abrechnungen 2024 und 2025 decken alle Mietstage ab.

**Korrektur.** Im Szenario «Erinnerung bleibt …»: «"Bruno Meier" hat die Abrechnungen der letzten beiden Jahre …» und Carla 2024, aber nicht 2025.

## V-5 (Minor): Rechnungslink nach Rechnungsdatum

**Beleg.** `contract-detail.feature`, «Rechnungen der fehlenden Periode anzeigen»: Filter Gebäude + Jahr. `src/routes/invoices/+page.server.ts:18–20`: das Jahr filtert `dateFrom/dateTo` auf das Rechnungsdatum. Regel 1 (`docs/nebenkostenabrechnung-anforderungen.md:141`) und `statementPeriods` (`src/lib/server/invoice.ts:120–122`) ordnen eine Rechnung mit Leistungszeitraum nach diesem zu. Typisch ist eine Q4-Rechnung (Strom, Heizöl) mit Datum Januar 2025 und Leistungszeitraum Okt.–Dez. 2024: Sie fehlt in «2024». Der Verwalter hält sie für nicht erfasst und erfasst sie womöglich doppelt. Zudem bietet `filterYears` (`:25–28`) nur das laufende Jahr und die fünf davor an (2026–2021); fehlende Perioden seit Vertragsbeginn können älter sein (Seeblick 2020).

**Korrektur.** Die Beschriftung darf nicht «Rechnungen dieser Periode» sagen, sondern z. B. «Rechnungen 2024 anzeigen (nach Rechnungsdatum)». Das geplante Folge-Issue soll einen Periodenfilter mit Leistungszeitraum vorsehen, nicht nur Perioden über den Jahreswechsel.

## V-6 (Minor): «Teil» der Regel genauer fassen

**Beleg.** Geplante Regel: «uncovered days = P minus the union …; a part of that is missing only where the contract has rent days».

**Nachrechnung.**
- Anna, P = 2024, Abrechnung 01.04.–30.09.2024, Mietbeginn 01.04.2024: ungedeckt 01.01.–31.03. und 01.10.–31.12. Mietstage hat nur der zweite Teil → «01.10.2024 – 31.12.2024». Stimmt mit dem Szenario.
- Bruno, P = 2023, Abrechnung 01.07.2022–30.06.2023: ungedeckt 01.07.–31.12.2023 → stimmt. P = 2022: überlappt, aber keine Mietstage → nichts. Stimmt.
- Randfall Null: eine Abrechnung = P → nichts fehlt. Vertrag endet am 30.06.2024 bei einer Abrechnung 01.07.2023–30.06.2024 → für P = 2024 keine Mietstage im ungedeckten Teil → nichts fehlt. Stimmt.
- Unklar: Abrechnung 01.06.–30.09.2024, Mietbeginn 01.04.2024. Ist der fehlende Teil «01.01.2024 – 31.05.2024» (zusammenhängendes Intervall) oder «01.04.2024 – 31.05.2024» (nur Mietstage)? Für die kurze Periode des Gebäudes ist das Intervall richtig: Andere Mietverträge und der Leerstand teilen sich diese Tage.

**Korrektur.** Die Regel festhalten: «fehlend ist jedes zusammenhängende ungedeckte Intervall von P mit mindestens einem Mietstag; angezeigt und als kurze Periode angeboten wird das Intervall». Ein Unit-Test für zwei Lücken in einer Periode; der Text muss dann beide nennen.

## M-3 (Minor): Lesart von #199 und #211

**Beleg.** #199 (Entscheid): «The dashboard and the contract page report a period as missing only for those uncovered days, not for every period since the Vertragsbeginn (comment from #142).» #211 (Entscheid): «The dashboard counts missing statements over the same periods as the contract page», also seit Vertragsbeginn.

**Warum.** Der Satz in #199 lässt sich als «nicht jede Periode seit Vertragsbeginn» lesen, und dann widerspricht das neue Szenario «Erinnerung nennt eine ältere Periode ohne Abrechnung» #199. Gemeint ist wohl «nur die ungedeckten Tage statt der ganzen Periode», und #211 ist der neuere, ausdrückliche Entscheid.

**Korrektur.** Einen Satz zur Klärung als Kommentar in #199; keine Änderung an den Szenarien.

## V-7 (Minor): Begriffe

**Beleg.** `UBIQUITOUS_LANGUAGE.md:46`: «Hinweis auf fehlende Abrechnungen | Warnung, die die beendeten Abrechnungsperioden nennt, in denen der Mietvertrag Mietstage, aber keine Abrechnung hat». Nach #199 nennt er ungedeckte Tage, auch bei teilweiser Abrechnung. `:148`: «Nebenkostenabrechnung | Jährliche Abrechnung …», eine kurze Periode ist nicht jährlich. Neue Wörter ohne Eintrag: «Noch ohne Abrechnung», «Bestehende Abrechnungen» (Schritt 2), «Tage ohne Abrechnung» (Szenario-Kommentare und Schritte), die kurze Periode. Die Anforderungen sagen «Rumpfperiode beim Wechsel» (`docs/nebenkostenabrechnung-anforderungen.md:31`). «Abrechnung fehlt» (Badge) passt zum bestehenden Hinweis. «Lücke» steht nur im Schritttext und nicht in der Oberfläche.

**Vorschläge** (Issue `fachlich` + `entscheiden`, UL ändert nur der Product Owner):
- **Tage ohne Abrechnung:** «Zusammenhängende Tage einer beendeten Abrechnungsperiode, die keine Abrechnung des Mietvertrags abdeckt und an denen der Mietvertrag Mietstage hat.»
- **Kurze Abrechnungsperiode** (in der Praxis «Rumpfperiode»): «Abrechnungsperiode unter zwölf Monaten für Tage ohne Abrechnung, z. B. nach einem Wechsel der Einstellung «Abrechnungsperiode». Erfüllt Art. 4 Abs. 1 VMWG («jährlich mindestens einmal»).»
- **Hinweis auf fehlende Abrechnungen** (neu): «Warnung, die die Tage ohne Abrechnung nennt: eine ganze Abrechnungsperiode mit ihrem Namen (z. B. 2023), sonst mit den Daten, seit Vertragsbeginn (seit «Abgerechnet bis»: geplant, #133).»
- **Nebenkostenabrechnung:** «Abrechnung … pro Mietvertrag, mindestens jährlich» statt «Jährliche Abrechnung».

## V-8 (Nit): Schwache Prüfung im Übersichtsschritt

**Beleg.** `dashboard.steps.ts`, `nennt die Aufgabe … für das Gebäude … die Periode`: Der Regex `Ahornhof \([^)]*2023` passt auch auf «Ahornhof (01.07.2023 – 31.12.2023)». **Korrektur:** das Ende des Eintrags verankern, z. B. `[(, ]${period}[,)]`.

---

## Bestätigt

- **Art. 4 Abs. 1 VMWG** (Fedlex): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» Eine kurze Periode für die ungedeckten Tage ist zulässig, denn häufiger als jährlich ist erlaubt. Ohne sie bliebe Marcs Juli–Dezember 2024 ohne Abrechnung (Beispiel in #199). Der Entscheid erfüllt die Pflicht.
- **Überlappungsregel gegen Doppelabrechnung pro Mietvertrag:** Eine Abrechnung, die die Periode schneidet, zählt, und nur ungedeckte Tage fehlen. So rechnet Dwello dieselben Mietstage desselben Vertrags nie zweimal ab (Beispiele V-6). Das Problem über mehrere Verträge eines Gebäudes steht in M-1.
- **Art. 257a Abs. 2 OR** (Fedlex): «Der Mieter muss die Nebenkosten nur bezahlen, wenn er dies mit dem Vermieter besonders vereinbart hat.» Die Szenarien berühren das nicht.
- **Szenario-Daten nachgerechnet:** «Teilweise abgerechnete Periode» (01.10.–31.12.2024), «Rechnungen der fehlenden Periode» (Anna fehlt 2024, 2025 abgerechnet), «Erinnerung nennt eine ältere Periode» (Bruno 2023; 2024 und 2025 ohne Mietstage), «Erinnerung nennt nur die Tage ohne Abrechnung» (01.07.–31.12.2023), Mietvertragsliste (Anna ohne Abrechnung → «Abrechnung fehlt»; Ben 2024 mit Abrechnung 2024 → kein Hinweis), geänderte «Erinnerung endet …» (01.04.2024–30.09.2025 mit 2024 und 2025).
- **Entwürfe zählen als abgerechnet:** passt zu UL «Entwurf» (`:169`). Die Vorlage nach Art. 4 Abs. 1 VMWG sichert die eigene Aufgabe «Abrechnungen prüfen und versenden» (`dashboard.feature`, «Entwürfe als Aufgabe»).
- **Rechnungsformular «Rechnung schon abgerechnet»:** nutzt schon die Überlappung (`src/lib/server/invoice.ts:120–122`, Leistungszeitraum oder Rechnungsdatum gegen die Periode der Abrechnung). Keine Änderung nötig.
- **Text der Übersicht** «Noch nicht abgerechnet: Ahornhof (2023, 01.07.2024 – 31.12.2024), Seeblick (2025). Erfassen Sie zuerst alle Rechnungen dieser Perioden …»: Die Begriffe stimmen mit der UL überein. Die Benennung einer ganzen Periode mit dem Jahr und sonst mit den Daten entspricht `periodOf` in `src/routes/contracts/[id]/MissingStatement.svelte:12–17`.

## Nicht bestätigt

- **Wechsel der Abrechnungsperiode als Vertragsänderung:** Steht die Periode im Mietvertrag, könnte ihr Wechsel eine einseitige Vertragsänderung sein. Art. 269d Abs. 3 OR (Fedlex): «Die Absätze 1 und 2 gelten auch, wenn der Vermieter beabsichtigt, sonstwie den Mietvertrag einseitig zu Lasten des Mieters zu ändern, …». Ob eine kurze Periode «zu Lasten des Mieters» geht, ist **unsicher**; keine Quelle gefunden (gesucht: Fedlex OR, `docs/nebenkostenabrechnung-anforderungen.md`). Nicht Gegenstand der Szenarien.
- **Beginn der Verjährung** der Nebenkostenforderung (Periodenende oder Zustellung): **unsicher**, siehe M-2 und `docs/nebenkostenabrechnung-anforderungen.md:160`.
- **Erinnerung erst 6 Monate nach Periodenende** (`docs/nebenkostenabrechnung-anforderungen.md:44`): Die Übersicht erinnert sofort nach dem Periodenende. Das ist unverändert und nicht Gegenstand dieser Änderung; nicht geprüft, ob es ein Issue dazu gibt.
- **`docs/PRD-Dwello.md`:** enthält nichts zu «Noch nicht abgerechnet», zur Mietvertragsliste mit Hinweis oder zu kurzen Perioden (gesucht nach «abgerechnet», «Periode», «Dashboard»; §6.1 und §5 Proration gelesen). Nur `:510` und `:596–601` stützen M-1.
- **Wortlaut des Badges und der Links** in fr/it/en: noch nicht vorhanden (vor der Umsetzung), nicht geprüft.
