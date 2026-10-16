# Fach-Review 1: Hinweise der Rechnungsprüfung (#130, #131, #134)

Gegenstand: `git diff HEAD~1 HEAD -- tests/e2e/features/statement-generate.feature` im Worktree `review-hints-fach` (Commit 89d87f2), dazu Schritte/Targets desselben Commits, `backend/src/services/invoice-completeness.service.ts`, `backend/src/services/invoice.service.ts:526–548`, `src/lib/statement-wizard.ts:221–233`, `UBIQUITOUS_LANGUAGE.md`, `docs/nebenkostenabrechnung-anforderungen.md`, Issues #130, #131, #134 (per `gh api`).

| ID | Rolle | Schwere | Befund |
|----|-------|---------|--------|
| V-1 | Verwalter | Major | Die Rhythmus-Regel von #130 wörtlich angewandt verschweigt ein fehlendes Quartal (4 → 3 Rechnungen): kein `gap`, keine `deviation`, keine Bestätigung |
| V-2 | Verwalter | Minor | Eine einzelne Rechnung ist nach der Regel nie ein `gap` (auch mit Teiler-Bedingung); bei kleinen Beträgen bleibt eine fehlende Rechnung ganz stumm |
| V-3 | Verwalter | Minor | Pluraltext #130 grammatikalisch falsch («{count} Rechnungen … ihr Leistungszeitraum reicht») |
| V-4 | Verwalter | Minor | #130: Unklar, ob die Zahl nur Rechnungen dieser Abrechnungsperiode zählt; die Abweichung kann auch aus dem Vorjahr kommen |
| V-5 | Verwalter | Minor | Szenarien #131/#134 prüfen nicht, dass der Hinweis keine Bestätigung verlangt; #134 ohne Gegenprobe «Abrechnungsperiode ein Jahr: kein Hinweis» |
| V-6 | Verwalter | Minor | Linkname «Rechnung von {Lieferant} bearbeiten» ist bei zwei Rechnungen desselben Lieferanten doppelt |
| V-7 | Verwalter | Nit | «Jahresrechnung» ist kein Begriff des Glossars; «zählen deshalb ganz» / «nur der Teil dieser Abrechnungsperiode» ungenau |
| V-8 | Verwalter | Nit | #131: das Fenster von 90 Tagen erfasst auch normale Rechnungen der neuen Periode (z. B. Monatsrechnungen Januar–März) |

Bestätigt ohne Befund: geändertes Szenario «Hinweis auf fehlende Rechnungen einer Kategorie» (echte Lücke, siehe unten), Szenario #130 «Kein Hinweis, wenn der Lieferant seltener, aber regelmässig abrechnet», Szenarien #131 und #134 (Daten, Datums- und Betragsformat), Plan zu Frage (2), Titel und Haupttexte #131/#134 inhaltlich.

---

## V-1 (Major): fehlendes Quartal wird verschwiegen

**Beleg.** Entschiedene Regel #130: «when the category's invoices of the period (credit notes excluded) are fewer than the year before but each slice of the period split into their own count holds exactly one of them (e.g. one per quarter), the check reports no `gap`; the comparison of the totals still runs.» Aufteilung: `slices()` in `invoice-completeness.service.ts:73–88` (ganze Monate, wenn teilbar, sonst nach Tagen); Abweichung nur bei `Math.abs(change) > previous.total * 0.25` und `>= 100` (Zeilen 138); Bestätigung nur für `missing`, `gap`, `stock` (`statement-wizard.ts:221–222`).

**Nachgerechnet** (Beispiel des Koordinators, bestätigt):
- Vorjahr 4 × 900 (31.03., 30.06., 30.09., 31.12.) = 3 600. Periode 2024: 31.03., 30.06., 30.09. = 2 700.
- 12 Monate / 3 sind ganze Monate: Teile Jan–Apr, Mai–Aug, Sep–Dez. 31.03. → Teil 1, 30.06. → Teil 2, 30.09. → Teil 3: je genau eine → kein `gap`.
- Änderung −900; Schwelle 3 600 × 0,25 = 900; −900 ist nicht > 900 → keine `deviation`. Bei gleichen Quartalsbeträgen ergibt 3 von 4 **immer genau −25 %**, also nie eine Abweichung.
- Fehlt Q3 statt Q4 (31.03., 30.06., 31.12.): 31.12. → Teil 3; wieder je eine → still.
- Heute: `gap` «Rechnung für das 4. Quartal fehlt» mit Bestätigung.

**Warum falsch.** In der Praxis ist genau das der häufigste Fall: Die Q4-Rechnung (Wasser, Strom, Hauswart) kommt im Januar/Februar, der Verwalter erstellt die Abrechnung vorher. Die Abrechnung wäre zu tief, die Kosten fehlen; Nachforderung nur über eine berichtigte Abrechnung. Das widerspricht auch dem Zweck in #130 «Done means»: «a supplier who changed to a **regular coarser** rhythm gets no `gap`». 3 Rechnungen statt 4 sind kein gröberer Kalenderrhythmus.

**Zur Teiler-Verfeinerung.** Die Regel nur anwenden, wenn die Zahl der Periode die des Vorjahres teilt (12→6, 12→4, 12→3, 12→2, 4→2, 2→1, …), deckt sich mit dem Zweck («regular coarser rhythm», Beispiel «one per quarter») und löst 4→3. Sie fügt aber eine Bedingung hinzu, die der entschiedene Regeltext nicht nennt, und ändert dessen Ergebnis. Nach CLAUDE.md («any other change to a decided text or value is mine») braucht das die Bestätigung des Product Owners: **Blocked on me**, Kommentar in #130 mit dem Rechenbeispiel. Prüfung der Verfeinerung:
- 4→3 (Q4 fehlt): 3 teilt 4 nicht → alte Regel → `gap` 4. Quartal. Richtig.
- 12→4 vierteljährlich (Szenario #130): teilt → Quartale je eine → kein `gap`; 1 200 vs 1 200 → nichts. Richtig.
- 4→2, nur Q1 und Q3 (31.03., 30.09.): teilt; Halbjahre je eine → kein `gap`; 1 800 vs 3 600 = −50 % → `deviation`, aber **ohne Bestätigung**. Grenze der Verfeinerung, mit den Daten allein nicht von einem echten Halbjahresrhythmus zu unterscheiden; vom Product Owner so in Kauf genommen («the comparison of the totals still runs»).
- 12→1 / 4→1: 1 teilt alles → siehe V-2.

Mein Vorschlag an den Product Owner: Regel nur, wenn die Zahl der Periode **mindestens 2** ist **und** die Zahl des Vorjahres teilt. Weitergehend (nicht nötig für #130): einen Teil als abgedeckt zählen, wenn der Leistungszeitraum einer Rechnung ihn abdeckt.

## V-2 (Minor): eine einzelne Rechnung ist nie ein `gap`

**Beleg.** Zu Ihrer Frage (1): Mit einer Rechnung gibt es einen Teil (die ganze Periode), und der hat trivial genau eine. Das folgt wörtlich aus der Regel, das Beispiel des Product Owners («one per quarter») meint es aber nicht ausdrücklich.
- Vierteljährlich 4 × 900, jetzt nur Q1: kein `gap`; 900 vs 3 600 = −75 % → `deviation` ohne Bestätigung (heute: `gap` mit Bestätigung).
- Kleine Kategorie, 4 × 30 (z. B. TV/Kabelanschluss), jetzt nur Q1: kein `gap`; Änderung −90 < 100 → **gar kein Befund**. Heute: `gap`.
- Wechsel auf eine Jahresrechnung (Rechnungsdatum 31.12., ohne Leistungszeitraum): kein `gap`, Summe ähnlich → nichts. Das ist ein gewollter Fall.

**Fix.** Mit der Bedingung «mindestens 2» aus V-1 entsteht für eine einzelne Rechnung wieder ein `gap` (mit Bestätigung, die der Verwalter bei einem echten Wechsel auf eine Jahresrechnung bestätigt). Gehört in dieselbe Rückfrage an den Product Owner. Ohne Entscheid: Unit-Test, der das Verhalten festhält, und Hinweis im Pull Request.

**Ihr geändertes Szenario** (Frage 1, zweiter Teil), nachgerechnet:
- Vorjahr: 4 × 230 am 31.03., 30.06., 30.09., 31.12.2023 (Schritt `RHYTHM.Quartal = 3`, letzter Tag des Quartals) = 920. Periode: 235 am 31.03. und 15.06.2024 = 470.
- Zahl 2 < 4. Halbjahre: Jan–Jun hat beide, Jul–Dez keine → nicht je genau eine → alte Regel mit 4 Teilen: Vorjahr Q1–Q4, jetzt Q1, Q2 → fehlen Q3, Q4 → «Rechnungen für das 3. Quartal und das 4. Quartal fehlen». Bestätigung verlangt. **Richtig, echte Lücke**, auch unter der Teiler-Verfeinerung (2 teilt 4, aber Jan–Jun hat zwei).
- Kaminfeger: Vorjahr 290, jetzt keine → `missing`. Richtig.
- Die alten Daten (2 Rechnungen 2023, 1 Rechnung 2024) wären unter der neuen Regel stumm geworden (V-2); die Änderung war nötig.

Szenario #130 «Kein Hinweis …»: 12 × 100 (Monatsende 2023) gegen 4 × 300 (Quartalsende 2024). Quartale je eine → kein `gap`; 1 200 = 1 200 → keine `deviation`. Erste Rechnung des Gebäudes am 31.01.2023 liegt vor 01.01.2023 + 92 Tage → Vorjahr gilt als erfasst. Keine anderen Gründe für eine Bestätigung (keine Abrechnungen, Rechnungen vorhanden). **Bestätigt.**

## V-3 (Minor): Pluraltext #130

**Beleg.** Geplant: «{count} Rechnungen zählen nur teilweise: ihr Leistungszeitraum reicht über die Abrechnungsperiode hinaus.»
**Warum falsch.** Bei mehreren Rechnungen hat jede ihren eigenen Leistungszeitraum; «ihr … reicht» passt nur im Singular.
**Fix.** «{count} Rechnungen zählen nur teilweise: ihre Leistungszeiträume reichen über die Abrechnungsperiode hinaus.» Singular unverändert. «Reicht über … hinaus» deckt auch einen Leistungszeitraum ab, der vor der Periode beginnt; das passt. Die Begriffe Rechnung, Leistungszeitraum, Abrechnungsperiode stehen im Glossar (Zeilen 60, 64, 150). Nachgerechnet: 1 200 für 01.11.2024–31.01.2025, Periode 2024: 61 von 92 Tagen → 795.65 (gleich wie `nebenkostenabrechnung-anforderungen.md`, Regel 5); Rechnung ganz in der Periode → zählt nicht.

## V-4 (Minor): welche Rechnungen werden gezählt

**Beleg.** #130: «names how many of the category's invoices count only in part because their Leistungszeitraum reaches beyond the period». Eine `deviation` vergleicht zwei Perioden; auch eine Vorjahresrechnung kann nur teilweise zählen (z. B. 01.11.2022–31.01.2023 in 2023) und die Summe des Vorjahres senken, also eine Steigerung vortäuschen.
**Fix.** Zählt der Plan nur die Rechnungen dieser Periode (so lese ich den Text, und das reicht für #130), dann soll der Text das sagen: «1 Rechnung dieser Abrechnungsperiode zählt nur teilweise: …». Das Vorjahr mitzuzählen wäre eine Erweiterung; ohne Issue nicht nötig.

## V-5 (Minor): Szenarien prüfen den Kern «nur ein Hinweis» nicht

**Beleg.** #131 «It is a hint, not a reason for the confirmation»; #134 «A hint only, never blocking». In den Szenarien «Hinweis auf eine Rechnung ohne Leistungszeitraum kurz nach der Abrechnungsperiode» und «Hinweis auf Rechnungen ohne Leistungszeitraum in einer Abrechnungsperiode unter einem Jahr» fehlt der Schritt dazu. #134 hat keine Gegenprobe, dass in einer Abrechnungsperiode von einem Jahr kein Hinweis erscheint (die Regel gilt nur für «shorter than a year»).
**Fix.** In beiden Szenarien `Und verlangt die Vorschau keine Bestätigung` ergänzen (die Daten haben sonst keinen Grund für eine Bestätigung: kein Vorjahr, keine Abrechnungen). Die Gegenprobe für #134 als Unit- oder `*.pg.test.ts` (Periode 2024 ganz: Rechnung vom 15.02.2024 nicht genannt; Grenze: 01.03.2024–28.02.2025 ist ein ganzes Jahr, 01.01.2024–30.12.2024 kürzer).

## V-6 (Minor): doppelter Linkname

**Beleg.** Geplant: Link «Rechnung von {Lieferant} bearbeiten». Ein Lieferant mit mehreren Rechnungen im Fenster (z. B. Monatsrechnungen des Elektrizitätswerks) ergibt gleich lautende Links; ein Screenreader kann sie nicht unterscheiden. `billing_entity_name` ist `notNull` (`backend/src/db/schema.ts:241`), ein leerer Name ist also nicht zu befürchten.
**Fix.** «Rechnung von {Lieferant} vom {Rechnungsdatum} bearbeiten». Gleich in beiden Hinweisen.

## V-7 (Nit): Wortwahl #134

**Beleg.** «Jahresrechnung» steht nicht in `UBIQUITOUS_LANGUAGE.md`. «zählen deshalb ganz» und «Dann zählt nur der Teil dieser Abrechnungsperiode» lassen offen, was ganz oder teilweise zählt (der Betrag).
**Vorschlag** (ohne neuen Begriff): «Die Abrechnungsperiode ist kürzer als ein Jahr. Diese Rechnungen haben keinen Leistungszeitraum und zählen deshalb mit dem ganzen Betrag. Gilt eine für mehr als diese Abrechnungsperiode, zum Beispiel für ein ganzes Jahr, erfassen Sie ihren Leistungszeitraum. Dann zählt nur der Teil des Betrags, der auf diese Abrechnungsperiode fällt.» «Gilt für» greift die Definition des Leistungszeitraums auf («Zeitraum, für den eine Rechnung gilt»), gut so. Falls «Jahresrechnung» bleiben soll: Begriff vorschlagen, «Jahresrechnung (eines Rechnungsstellers): Rechnung über die Leistungen eines ganzen Jahres», Issue mit den Labels `fachlich`, `entscheiden`.

## V-8 (Nit): Rauschen im Fenster von 90 Tagen

**Beleg.** Fenster 01.01.–31.03.2025 bei Periodenende 31.12.2024. Eine Monatsrechnung vom 31.01.2025 für Januar 2025 oder eine Quartalsrechnung vom 31.03.2025 für Q1 2025 wird in der Vorschau 2024 genannt, obwohl sie zu 2025 gehört. Der Text («Gehört eine davon zu dieser Abrechnungsperiode, …») fängt das ab. Das Fenster ist entschieden, kein Handlungsbedarf; erwähnt, damit Personas es nicht als Fehler melden.

---

## Ihre Fragen

1. **Einzelne Rechnung / geändertes Szenario:** Das stimmt wörtlich mit dem Entscheid überein, ist aber eine Schwäche (V-2). Zusammen mit V-1 empfehle ich eine Rückfrage an den Product Owner. Das geänderte Szenario prüft weiterhin eine echte Lücke, nach der wörtlichen Regel und nach der Verfeinerung.
2. **#134 nur umlagefähige Rechnungen, die in der Periode zählen:** Einverstanden. «Umlagefähige Rechnung» heisst im Glossar «fliesst in die Nebenkostenabrechnung ein» (`is_valid_utility_cost`, Zeile 69), und `getInvoicesForStatement` (`invoice.service.ts:531–534`) wählt genau diese, ohne Leistungszeitraum nach Rechnungsdatum in der Periode. Nicht umlagefähige Rechnungen betreffen den Mieter nicht. Das stimmt mit #131 überein («umlagefähige invoices»). Ein Leistungszeitraum, den der Verwalter nachträgt, nimmt die Rechnung über die zweite Bedingung (Überschneidung) in die richtige Periode, gleich wie es die Hinweistexte versprechen. **Bestätigt.**
3. **Begriffe und Texte:** #131-Titel und Text sind richtig und halten sich an die Regel in `docs/nebenkostenabrechnung-anforderungen.md:141` («Eine Rechnung ohne Leistungszeitraum zählt in der Abrechnungsperiode, in der ihr Rechnungsdatum liegt»). Lieferant, Rechnungsdatum, Betrag stehen im Glossar (Zeilen 61, 63, 65). Der Betrag kommt über `formatCHF` als «CHF 1’200.00» (`src/lib/utils/format.ts:26–29`); die Erwartung «1’200.00» im Szenario passt. Befunde: V-3, V-4, V-6, V-7.

## Recht

Kein Befund. Ein Hinweis ohne Sperre (#134, Option 1) ist zulässig: Die Pflicht trifft den Vermieter, das Werkzeug muss nichts erzwingen. Er senkt die Gefahr, einem Mieter in einer kurzen Periode eine ganze Jahresrechnung zu belasten. Art. 4 Abs. 1 VMWG (Fedlex, https://www.fedlex.admin.ch/eli/cc/1990/835_835_835/de, Suchauszug): «Erhebt der Vermieter die Nebenkosten aufgrund einer Abrechnung, muss er diese jährlich mindestens einmal erstellen und dem Mieter vorlegen.» V-1 hat eine rechtliche Seite: Fehlende Kosten führen zu einer zu tiefen Abrechnung; Nachforderung siehe Glossar «Berichtigte Abrechnung». Das ist ein Nachteil für den Vermieter, nicht für den Mieter.

## Fehlende Begriffe

- «Jahresrechnung» (nur wenn der Text sie behält, V-7): Vorschlag oben.
- Kein weiterer: «Hinweis auf Rechnungen nach der Abrechnungsperiode» / «… ohne Leistungszeitraum» erscheinen nur als Namen von Test-Targets, nicht in der Oberfläche.

## Nicht bestätigt

- **Art. 257b Abs. 1 OR im Fedlex-Wortlaut:** Fedlex lädt nur per JavaScript (WebFetch auf `eli/cc/27/317_321_377/de#art_257_b` lieferte nur die Hinweisseite). Der Wortlaut «die tatsächlichen Aufwendungen des Vermieters für Leistungen, die mit dem Gebrauch zusammenhängen» stammt aus #134 und aus einer Nicht-Fedlex-Quelle (mmx-Suche: schweizerischer-mieterschutz.ch). **Unsicher**, für diesen Review aber nicht tragend.
- Art. 4 Abs. 1 VMWG: nur aus dem Suchauszug der Fedlex-Seite (mmx), die Seite selbst konnte ich nicht öffnen.
- Ob die Schwellen der Abweichung (25 % / CHF 100, `TODO(fachlich prüfen, #65)`) in der Praxis passen: offen in #65, nicht Gegenstand.
- Die Umsetzung der neuen Schritte (`hintedInvoiceLink` sucht ohne Bezug zum Hinweis auf der ganzen Seite) habe ich nur gelesen, nicht ausgeführt. Kein E2E-Lauf (Review vor der Umsetzung).
