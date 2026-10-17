# Fachreview W4, Runde 1: #247, #230, #232 (@wip-Szenarien vor der Umsetzung)

Geprüft: Worktree `review-w4-fach`, Commit 9583d04 (`git diff 9583d04~1 9583d04`): `tests/e2e/features/statement-detail.feature`, `tests/e2e/features/heating-profiles.feature`, Steps, Targets, dazu die geplante Umsetzung und die geplanten Texte aus dem Auftrag.
Quellen: `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md` (Regel 5, 6), Code im Worktree (`calculation.service.ts`, `prorating.service.ts`, `heating-profile.service.ts`, `pdf.service.ts`, `src/lib/server/statement.ts`), Fedlex-Filestore (OR Stand 1.1.2026, VMWG Stand 1.10.2025), Nachrechnung mit `scratchpad/rounding.py` (Decimal, kaufmännisch gerundet).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| M-1 | Mietrecht | Major | #230: Wer nur einen Entwurf löscht und neu erstellt, mischt in einer Wohnung zwei Heizprofil-Stände: Die Anteile der Mietverträge ergeben zusammen mehr oder weniger als 100 % |
| M-2 | Mietrecht | Major | #232: Geplant ist «bei einer Periode über ein ganzes Jahr ist der Anteil die gerundete Summe des Mieters». Wegen der Toleranz von ±0.1 Prozentpunkten wird dann ohne Teilung zu viel oder zu wenig verrechnet |
| V-1 | Verwalter | Minor | #247: Der Grund «Monate der Abrechnungsperiode mit 0 % im Heizprofil» liest sich wie «einige Monate haben 0 %» |
| V-2 | Verwalter | Minor | #247 bei Altbeständen: Der Grund lässt sich aus den gespeicherten `rental_start`/`rental_end` herleiten, statt nur «(nicht angewendet)» zu zeigen |
| V-3 | Verwalter | Minor | #247: Eine Abrechnung mit gewähltem Heizprofil, aber ohne Heizkosten, nennt das Profil weiter ohne Zusatz, als wäre es angewendet worden |
| V-4 | Verwalter | Minor | #232: Der PDF-Satz verwendet «Anteil an den Heizkosten»; der Glossarbegriff heisst «Anteil nach Heizprofil» |
| M-3 | Mietrecht | Minor | #232: Der Wert eines angebrochenen Monats («Jan 15.68 %») lässt sich im PDF nicht nachrechnen |
| V-5 | Verwalter | Nit | #230: In «behalten ihre Anteile» ist unklar, welche Anteile gemeint sind; «zu rechnen» passt nicht zum bestehenden «neu zu berechnen» |
| V-6 | Verwalter | Nit | Der bestehende Szenario-Kommentar «70.975 %» stimmt nach #232 nicht mehr; der Halbfall 3.475 muss dezimal aufgerundet werden |
| M-4 | Mietrecht | Nit | Restliche Rundungsdifferenz von ±0.01 Prozentpunkten über alle Mietverträge einer Wohnung (besteht schon, ist geringfügig) |
| V-7 | Verwalter | Nit | #232 löst für neue Abrechnungen den Heizkosten-Fall von #256 V-1; das sollte in #256 vermerkt werden |

---

## M-1 (Major): Hilfetext #230 führt zu gemischten Heizprofil-Ständen in einer Wohnung

**Beleg.** `heating-profiles.feature` (neues @wip-Szenario): «Bestehende Abrechnungen behalten ihre Anteile. Um einen Entwurf mit den neuen Anteilen zu rechnen, löschen Sie ihn und erstellen ihn neu.»
Der Abrechnungslauf erstellt nur für Mietverträge ohne Abrechnung neu (`messages/de.json`, `statements_building_billed_*`, `statements_all_billed`). Der Hilfetext beim Abrechnungslauf verlangt in einem verwandten Fall schon heute, die Entwürfe **aller** Mietverträge der Wohnung zu löschen (`statements_heating_help`: «löschen Sie die Entwürfe aller Mietverträge dieser Wohnung»).

**Warum falsch.** Beim Mieterwechsel teilt das Heizprofil die Heizkosten der Wohnung unter dem alten Mieter, dem neuen Mieter und dem Leerstand auf. Wird nur ein Entwurf mit den neuen Monatsanteilen neu erstellt, rechnet ein Mietvertrag mit dem alten und der andere mit dem neuen Stand.
Beispiel mit «Winter» aus `statement-detail.feature` und dem geänderten Stand aus dem Szenario «PDF zeigt den Anteil nach dem Heizprofil, mit dem die Abrechnung erstellt wurde» (Jan 30, Feb 20, Mär 10, …):
- Eva Frei (Januar bis März) neu: 30 + 20 + 10 = 60 %.
- Marc Huber (ab Mai) bleibt beim alten Stand: 52 %.
- Zusammen 112 % der Heizkosten der Wohnung, dazu der Leerstand im April.

Die Mieter tragen dann zusammen mehr als die tatsächlichen Kosten. Art. 257b Abs. 1 OR (Fedlex): «Bei Wohn- und Geschäftsräumen sind die Nebenkosten die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen, wie Heizungs-, Warmwasser- und ähnliche Betriebskosten, …». Ebenso Art. 5 Abs. 1 VMWG: «Als Heizungs- und Warmwasserkosten anrechenbar sind die tatsächlichen Aufwendungen, die mit dem Betrieb der Heizungsanlage oder der zentralen Warmwasseraufbereitungsanlage direkt zusammenhängen.»

**Korrektur.** Der Text ist ein Entscheid des Product Owners, also muss er entscheiden. Vorschlag:
«Bestehende Abrechnungen behalten die Monatsanteile, mit denen sie erstellt wurden. Um Entwürfe neu zu berechnen, löschen Sie die Entwürfe aller Mietverträge der betroffenen Wohnungen in dieser Abrechnungsperiode und erstellen Sie die Abrechnungen erneut. Versendete Abrechnungen lassen sich nicht neu berechnen.»
Der letzte Satz ist wörtlich aus `statements_all_billed` übernommen. Diese Fassung erledigt auch V-5. Das Szenario ist entsprechend anzupassen.

## M-2 (Major, falls so gemeint): Abkürzung bei einer Periode über ein ganzes Jahr ignoriert die Toleranz von ±0.1

**Beleg.** Geplante Umsetzung: «For a full-year period the share is the tenant's rounded sum.»
Das Glossar sagt unter **Monatsanteil**: «die zwölf Monatsanteile ergeben 100 % (auf ±0.1 Prozentpunkte genau)». Der Code lässt das zu (`heating-profile.service.ts:143`, `tolerance = 0.1`). Heute teilt `handleMidYearMoves` immer durch die Summe der Periode, und das PDF druckt beide Summen, sobald die Summe der Periode nicht 100 ist (`pdf.service.ts:736`, `periodPercent === 100`). Das Glossar beschreibt den **Anteil nach Heizprofil** als «… geteilt durch die Summe der Monatsanteile über die Abrechnungsperiode».

**Warum falsch.** Rechenbeispiel mit einem eigenen Heizprofil, das zusammen 100.10 % ergibt («Winter», aber Dezember 26.1), Abrechnungsperiode 2024, Mieterwechsel am 1. Juli:
- Mieter A (Januar bis Juni): 50.00 %.
- Mieter B (Juli bis Dezember): 50.10 %.
- Mit der geplanten Abkürzung zusammen 100.10 %, also CHF 1.00 zu viel bei CHF 1'000.
- Mit der Teilung (50.00 / 100.10 = 49.95 %; 50.10 / 100.10 = 50.05 %) zusammen 100.00 %.

Bei einem Profil mit zusammen 99.90 % trägt umgekehrt der Vermieter 0.1 % selbst. Das Zuviel verstösst gegen Art. 257b Abs. 1 OR (Zitat bei M-1).

**Korrektur.** Nicht nach der Länge der Periode verzweigen, sondern nach der Summe: Ist die Summe der Periode aus den gerundeten Monaten genau 100.00, ist der Anteil die Summe des Mieters. Sonst gilt Summe des Mieters / Summe der Periode, und das PDF druckt die Teilung, auch bei einem ganzen Jahr. Das entspricht dem heutigen `periodPercent === 100` in `pdf.service.ts:736`. Dafür einen Test auf unterer Ebene ergänzen, z. B. mit dem Profil oben.

## V-1 (Minor): Wortlaut des zweiten Grunds in #247

**Beleg.** Szenario «Abrechnung nennt ihr Heizprofil als nicht angewendet, wenn die Monate der Periode 0 % haben»: «(nicht angewendet: Monate der Abrechnungsperiode mit 0 % im Heizprofil)».
Das Glossar sagt unter **Zeitanteil**: «ausser die Monate der Abrechnungsperiode haben darin zusammen 0 % (dann nach Tagen)». Regel 5 sagt: «wenn die Monate der Periode im Heizprofil zusammen 0 % haben».

**Warum.** Als Substantivgruppe fehlt «alle» oder «zusammen». Ein Verwalter mit einer Periode von Juni bis November (Juni bis August 0 %) könnte meinen, das gelte auch für ihn. In der Sache stimmt die Regel: Da kein Monatsanteil negativ sein darf (`backend_heating_profile_share_negative`), bedeutet «zusammen 0 %» dasselbe wie «jeder Monat 0 %».

**Korrektur.** Den Glossarwortlaut verwenden: «(nicht angewendet: die Monate der Abrechnungsperiode haben im Heizprofil zusammen 0 %)». Der Grund wird dabei kleingeschrieben, weil er hinter dem Doppelpunkt als Satz steht. Den ersten Grund «Mietvertrag über die ganze Periode» bestätige ich: Er ist Glossarwortlaut (`UBIQUITOUS_LANGUAGE.md:158`) und entspricht Regel 5.

## V-2 (Minor): Altbestände ohne gespeicherten Grund

**Geplant.** Bei einer Abrechnung «nach Tagen» ohne gespeicherten Grund wird der aktuelle Name des Heizprofils mit «(nicht angewendet)» gezeigt, ohne Grund.

**Urteil.** Den aktuellen Namen zu zeigen ist vertretbar, denn einen gespeicherten Namen gibt es nicht (`HeatingShare` `{ byDays: true }`, `schema.ts:346`). Ein umbenanntes Profil erscheint dann mit dem neuen Namen. Das ist eine bekannte Grenze.

Der Grund lässt sich aber herleiten. Die Abrechnung speichert die abgerechneten Miettage (`rental_start`, `rental_end`, `schema.ts:373–374`; laut Kommentar ändern spätere Vertragsdaten sie nicht).
- Ist `rental_start = period_start` und `rental_end = period_end`, war der Grund nach Regel 5 «Mietvertrag über die ganze Periode» (`prorating.service.ts:209`).
- Sonst bleibt bei gespeichertem `byDays` nur der Fall mit zusammen 0 % (`prorating.service.ts:214`). Ein fehlendes Profil ist bei einem Altbestand mit verknüpftem Profil ausgeschlossen.

**Korrektur.** Den Grund für Altbestände aus diesen Feldern herleiten oder begründen, warum nicht. «(nicht angewendet)» ohne Grund wirft beim Verwalter genau die Frage auf, die #247 beantworten soll.

## V-3 (Minor): Heizprofil gewählt, aber keine Heizkosten

**Beleg.** `calculation.service.ts:424`: Ohne Heizkosten-Rechnung ist `heating` null. `src/lib/server/statement.ts:25–29` zeigt dann den Namen aus der Verknüpfung, ohne Zusatz. `CostTable.svelte:73–76` gibt ihn aus.

**Warum.** #247 verlangt «says when it was not applied». In diesem dritten Fall wurde das Profil auch nicht angewendet, die Seite deutet aber das Gegenteil an. Gleiches gilt für Abrechnungen vor #209 (C-5), deren Wirkung unbekannt ist.

**Korrektur.** Entweder «(nicht angewendet: keine Heizkosten in der Abrechnungsperiode)» oder das Profil in diesem Fall nicht nennen. Das ist ein neuer Text, also ein Issue (siehe «Fehlende Begriffe»). Für diese Aufgabe blockiert es nicht.

## V-4 (Minor): Begriff im neuen PDF-Satz

**Beleg.** Geplant ist «Anteil an den Heizkosten: 43.00 % / 50.00 % = 86.00 %.» (Szenarien «PDF nennt bei einer Periode unter einem Jahr …» und «PDF rechnet den Anteil nach dem Heizprofil …»). Das Glossar führt **Anteil nach Heizprofil** (`UBIQUITOUS_LANGUAGE.md:134`) und nennt genau diese Teilung.

**Warum.** «Anteil an den Heizkosten» ist kein Glossarbegriff. Im PDF stehen dazu «Wohnungsanteil», «Zeitanteil» und «Ihr Anteil» (Mieteranteil). Ein weiterer «Anteil» ohne Glossarbezug verwischt, dass es um den Zeitanteil geht und nicht um den Betrag.

**Korrektur.** «Anteil nach Heizprofil: 43.00 % / 50.00 % = 86.00 %.» (fr/it/en nach `docs/design/i18n-begriffe.md`). Die Szenariozeilen entsprechend anpassen.

## M-3 (Minor): Angebrochener Monat im PDF nicht nachrechenbar

**Beleg.** Szenario «PDF rechnet den Anteil nach dem Heizprofil aus den gedruckten Monatsanteilen»: «Jan 15.68 %, Feb 14.00 %». Das Heizprofil hat im Januar 18 %. Das PDF erklärt das nicht (`pdf.service.ts:725–739`, kein Text zu angebrochenen Monaten).
Die Anforderungen (Zeile 39) verlangen, dass der Anteil des Mieters «nachvollziehbar» ausgewiesen wird (unsicher-B). Art. 8 Abs. 1 VMWG (Fedlex): «Erhält der Mieter mit der jährlichen Heizungskostenrechnung nicht eine detaillierte Abrechnung und Aufteilung der Heizungs- und Warmwasseraufbereitungskosten, so ist auf der Rechnung ausdrücklich darauf hinzuweisen, dass er die detaillierte Abrechnung verlangen kann.» Den Hinweis druckt das PDF schon; deshalb nur Minor.

**Warum.** #232 soll erreichen, dass Anteil und Betrag aus den gedruckten Werten folgen. Für die Teilung gelingt das, der Wert 15.68 selbst ist aber für den Mieter eine unerklärte Zahl.

**Korrektur.** Einen angebrochenen Monat mit seiner Rechnung drucken, z. B. «Jan 15.68 % (18.00 % × 27/31 Tage)», oder einen Satz anfügen: «Ein angebrochener Monat zählt mit dem Teil seiner Tage.» Das ist neuer Wortlaut, also ein Issue (passt zu #256).

## V-5 (Nit): Wortlaut #230

«ihre Anteile» ist mehrdeutig, denn eine Abrechnung hat Wohnungsanteil, Zeitanteil und Anteil nach Heizprofil. Besser: «die Monatsanteile, mit denen sie erstellt wurden». Statt «zu rechnen» besser «neu zu berechnen», wie in `statements_all_billed`. Die Fassung bei M-1 deckt beides ab.

## V-6 (Nit): Bestehendes Szenario «70.975 %»

**Beleg.** Szenario «PDF nennt in der Erläuterung denselben Anteil nach dem Heizprofil wie in der Position», Kommentar: «ein Anteil genau zwischen zwei Hundertsteln (70.975 %)».

Nach #232 ist der Anteil die Summe der gerundeten Monate (ganzes Jahr, Profil «Halbwert» = 100.00). Februar 13.9 × 7/28 = 3.475 ergibt aufgerundet 3.48. Die Summe ist dann 70.98, wie erwartet. Der Halbfall liegt jetzt aber im Monat und nicht mehr im Anteil.
- Rundet die Umsetzung binär mit `Math.round(x * 100) / 100`, kann 3.475 als 3.47 enden, und das Szenario erwartet dann zu Recht 70.98 und schlägt fehl.

**Korrektur.** Den Kommentar anpassen: «Februar 13.9 × 7/28 = 3.475 %, gerundet 3.48 %; zusammen 70.98 %». Die Monatsrundung dezimal kaufmännisch umsetzen und dafür einen Unit-Test schreiben.

## M-4 (Nit): Restliche Rundungsdifferenz über alle Mietverträge

Nachgerechnet mit «Winter», Periode 2024, drei Mietverträge vom 1. bis 8. Januar, 9. bis 16. Januar und ab 17. Januar:
- 18 × 8/31 = 4.645, gerundet 4.65.
- 18 × 8/31 = 4.645, gerundet 4.65.
- 18 × 15/31 = 8.71, dazu 82.00, ergibt 90.71.
- Zusammen 100.01 %, also CHF 0.10 zu viel bei CHF 1'000.

Umgekehrt ergibt der 2. bis 8. Januar 99.99 %. Ungerundete Monate mit gerundetem Endanteil liefern im gleichen Fall auch 100.01. Die Differenz besteht also schon und wird durch #232 nicht grösser (Suche über alle Wechselpaare 2024: höchstens ±0.01). Ich halte das für geringfügig; eine Änderung ist nicht nötig. Zur Kenntnis wegen Art. 257b Abs. 1 OR.

## V-7 (Nit): Bezug zu #256

#256 V-1 bemängelt, dass bei Heizpositionen der gerundete Prozentwert gedruckt, aber mit dem ungerundeten Anteil gerechnet wird (38.87 % gedruckt, 932.98 statt 932.88). Mit «amount = apartment share × that percent» aus #232 folgt der Betrag bei neuen Abrechnungen aus dem gedruckten Prozentwert. Das in #256 vermerken, damit der dort vorgeschlagene Rundungssatz für Heizpositionen neu entschieden wird.

---

## Bestätigt (mit Quelle)

- **Szenario Rosenhof (#232):** Rechnung vom 30.06.2024 (`backend.ts:271`), also in der Periode; eine einzige Wohnung, Wohnungsanteil CHF 1'000.
  - Einzug am 5. Januar: 27 Tage. 18 × 27/31 = 15.677, gerundet 15.68.
  - Summe des Mieters: 15.68 + 14 + 11 + 5 + 2 + 0 = 47.68. Summe der Periode: 50.00.
  - 47.68 / 50.00 = 95.36 %, also CHF 953.60.
  - Ungerundet: 47.677 / 50 = 95.35 % und CHF 953.55, wie im Kommentar.
  - Leerstand vom 1. bis 4. Januar: 2.32 / 50 = 4.64 %. Zusammen 100.00 %.
- **Szenario Eva Frei, Januar bis Juni:** 43 / 50 = 86.00 %. Marc Huber (Mai und Juni) 2 / 50 = 4 %, Leerstand im April 5 / 50 = 10 %. Zusammen 100 %. Der erwartete PDF-Satz ist mit der geplanten Vorlage vollständig und in sich stimmig.
- **Bestehende Szenarien bei einem ganzen Jahr** («43.00 % 430.00», «70.98 %») bleiben gültig, unter der Bedingung aus V-6.
- **#247, Szenario mit Mietvertrag über die ganze Periode:** Regel 5 (`docs/nebenkostenabrechnung-anforderungen.md:145`; `prorating.service.ts:209`). Die Umbenennung prüft den beim Erstellen gespeicherten Namen.
- **#247, Szenario Sommer:** Juni bis August haben im «Winter» 0 % (`prorating.service.ts:214`). Einzug am 15.07. ist kein Mietvertrag über die ganze Periode, also greift der zweite Grund.
- **#232, Abrechnungen unter #229** (Summe der Periode gespeichert, Monate der Periode nicht) behalten den alten Text ohne Teilung. Das halte ich für richtig: Eine aus gerundeten Werten gedruckte Teilung würde ihren gespeicherten, ungerundet gerechneten Anteil nicht immer ergeben.
- **C-5:** Ohne gespeicherten Anteil kein Heizprofil-Hinweis. Das entspricht `pdf.service.ts:727` (`if (!data.heating) return []`).
- **Begriffe im Glossar:** Heizprofil, Monatsanteil, Abrechnungsperiode, Entwurf (`:169`), Eigenes Heizprofil, Mietvertrag über die ganze Periode (`:158`), Mietstage. «Mietverhältnis» im PDF-Satz besteht schon und steht in den Glossardefinitionen (`:36–37`).
- **Rechtsgrundlagen (Fedlex):** Art. 257a, 257b OR (Stand 1.1.2026); Art. 4 Abs. 1, Art. 5 Abs. 1, Art. 8 Abs. 1 VMWG (Stand 1.10.2025), wörtlich zitiert oben. Dass die Teilung nach Monatsanteilen bei einem Mieterwechsel zulässig ist, regelt weder OR noch VMWG ausdrücklich. Siehe «Nicht bestätigt».

## Fehlende Begriffe und Texte (Issue mit Labels `fachlich`, `entscheiden`)

1. **V-3:** Wortlaut für «Heizprofil gewählt, keine Heizkosten», Vorschlag «(nicht angewendet: keine Heizkosten in der Abrechnungsperiode)», oder das Profil dann nicht nennen.
2. **M-3:** Darstellung eines angebrochenen Monats im PDF, Vorschlag «Jan 15.68 % (18.00 % × 27/31 Tage)», oder als Satz «Ein angebrochener Monat zählt mit dem Teil seiner Tage.». Allenfalls als Ergänzung zu #256.
3. **M-1:** kein neuer Begriff, sondern eine Änderung an einem entschiedenen Text, also Entscheid des Product Owners. Wortlaut siehe M-1.

## Nicht bestätigt

- **Fachpraxis der Rundung je Monat auf zwei Stellen:** Weder in der Fachliteratur noch in den Anforderungen (Zeile 67: HEV-Heizgradtage, unsicher-B) habe ich eine Quelle gefunden, die die Rundung je Monat vorschreibt oder ausschliesst. Ich halte sie für praxisüblich (Tabellen mit Prozentwerten je Monat, Tagesanteil), belegt ist das nicht. **unsicher.**
- **Zulässigkeit der Verteilung nach Heizgradtagen/Heizprofil beim Mieterwechsel:** In OR und VMWG auf Fedlex nicht geregelt (Art. 4–8 VMWG und Art. 257a–257b OR gelesen). In den Anforderungen nur mit HEV/mietrecht.ch belegt (unsicher-B).
- **fr/it/en des neuen PDF-Satzes und des Hilfetexts #230:** Nur «analogous» angekündigt, nicht vorgelegt, deshalb nicht geprüft.
- **«Bestehende Abrechnungen behalten ihre Beträge» (#232, Altbestände):** Für diesen Zustand gibt es kein Szenario (E2E kann ihn kaum herstellen). Zu prüfen ist ein Test auf unterer Ebene in der Umsetzung.
- **Verhalten bei Profilen mit zusammen ≠ 100.00 bei einem ganzen Jahr:** Abhängig davon, wie die geplante Umsetzung gemeint ist (M-2). Nur gegen den heutigen Code geprüft.
- **Halbfall-Rundung in JavaScript (V-6):** Nicht ausgeführt, nur als Risiko benannt.
