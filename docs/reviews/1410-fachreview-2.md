# Fachreview 1410-2 (Commit efc684fe, `git diff origin/main efc684fe`)

Vorheriger Bericht: `docs/reviews/1410-fachreview-1.md`. Entscheid PO: (a) für V-1, V-2, V-3.

Geschlossen: M-1, V-1, V-2, V-3, V-4

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-6 | Verwalter | Major | Die Aufgabe zählt Rechnungen nach einer anderen Regel, als die verlinkte Liste sie zeigt. Eine Rechnung, die nach dem Ende ihres Leistungszeitraums gestellt wurde (typisch: Heizkostenrechnung für 2015 vom Februar 2016), zählt in der Aufgabe für 2016, steht aber nur in der Liste für 2015. Die Aufgabe nennt dann Rechnungen, die ihre Liste nicht zeigt, und endet auch dann nicht, wenn alle Rechnungen der Liste gelöscht sind. |
| V-3a | Verwalter | Minor | Bei einem Leistungszeitraum, der über die Periode der Abrechnung hinausgeht, verlangt die Löschbestätigung «berichtigen». Sie rechnet nämlich mit dem ganzen Leistungszeitraum (`invoice.keepUntil`), `deletedWithinRetention` aber mit dem gespeicherten `end`. Darum erscheint keine Aufgabe «Abrechnung berichtigen». Das ist fachlich vertretbar (siehe unten); Fix: in `DeleteConsequences.svelte` die Abrechnungen nach derselben Regel prüfen oder die Lücke im Kommentar nennen. |
| V-3b | Verwalter | Minor | Glossar «Nicht aktuelle Abrechnung» (`UBIQUITOUS_LANGUAGE.md:206`) sagt «nach Ablauf ihrer Aufbewahrungsfrist gelöscht». `changedInvoices` (`statement-invoices.service.ts:113-116`) nimmt aber jede abgerechnete Rechnung aus, die die Periode verlassen hat, also auch eine, die nicht umlagefähig gemacht oder umdatiert wurde. Fix: den Glossarsatz auf «gelöscht oder nicht mehr abgerechnet» erweitern (dafür braucht es einen Entscheid des PO, denn das Glossar ändert sich) oder den Filter auf gelöschte Rechnungen beschränken. |
| V-5 | Verwalter | Minor | Der Grenztag ist weiter ungetestet. Am Tag «aufbewahren bis» selbst muss `retention()` noch das Datum liefern, am Tag danach `null` (`invoice-retention.ts:49`, `>=`). `retention.test.ts` prüft nur `keepUntil`. Fix: ein Test mit `swissToday` = `keepUntil` und einer mit dem Tag danach. Juli–Juni und November–Oktober sind jetzt abgedeckt. |

## V-6 (Major): Aufgabe und Liste zählen verschieden

**Beleg:**
- `backend/src/services/invoice-retention.ts:20-31, 67`: Die Aufgabe gruppiert nach der Abrechnungsperiode, die das spätere Datum von Rechnungsdatum und Ende des Leistungszeitraums enthält.
- `src/lib/overview.ts:357` (`invoicesOf(p, p.buildingId)`) → `backend/src/services/invoice.service.ts:147` (`inPeriodOf`, Regel 1): Die Liste zeigt die Rechnungen, deren Leistungszeitraum die Periode überschneidet, ohne Leistungszeitraum die mit dem Rechnungsdatum in der Periode.

**Nachgerechnet (Gebäude mit Kalenderjahr):**

| Rechnung | Aufgabe zählt sie in | Liste zeigt sie in | Frist bis |
|---|---|---|---|
| Rechnungsdatum 31.03.2014, ohne Leistungszeitraum | 2014 | 2014 | 31.12.2024 (stimmt überein) |
| Leistungszeitraum 01.01.–31.12.2015, Rechnungsdatum 15.02.2016 | **2016** | **2015** | 31.12.2026 |
| Leistungszeitraum 01.10.2014–30.09.2015, Rechnungsdatum 01.10.2014 | 2015 | 2014 und 2015 | 31.12.2025 (stimmt, die 2015er Liste zeigt sie) |

Ab dem 01.01.2027 nennt die Aufgabe «Rechnungen 2016 von … können gelöscht werden» auch die Heizkostenrechnung aus Zeile 2. Die verlinkte Liste für 2016 zeigt sie nicht. Löscht der Vermieter alles, was die Liste zeigt, bleibt die Aufgabe mit «1 Rechnung» stehen. Er kann sie dann nur mit «Behalten» beenden. Das widerspricht der Regel aus V-4 (die Aufgabe endet, wenn die Rechnungen gelöscht sind) und dem Szenario `dashboard.feature` «Gelöschte Rechnungen nennt die Übersicht nicht mehr zum Löschen». Rechnungen, die nach ihrem Leistungszeitraum gestellt werden, sind bei Heiz- und Nebenkosten die Regel, kein Sonderfall. Mein Satz in Runde 1 (V-1, «die Aufgabe je Gebäude und Abrechnungsperiode bleibt also möglich») hat übersehen, dass die Liste nach Regel 1 zeigt.

**Fix (ohne Entscheid PO, die Frist je Rechnung bleibt wie entschieden):** Die Aufgabe gruppiert nach der Periode, in der die Liste die Rechnung zeigt: bei einem Leistungszeitraum die letzte Periode, die er überschneidet, sonst die Periode des Rechnungsdatums. Sie zählt eine Rechnung erst, wenn ihr eigenes `keepUntil` abgelaufen ist. `{date}` ist das späteste `keepUntil` der gezählten Rechnungen. Dann steht jede gezählte Rechnung in der verlinkten Liste. Rechnungen der Liste, deren Frist noch läuft, deckt der Satz «Muss eine Rechnung der Liste länger aufbewahrt werden, nennt Dwello das beim Löschen» ab. Test: `invoice-retention.pg.test.ts` mit der Rechnung aus Zeile 2. Sie zählt in der Periode 2015, sobald ihre Frist abgelaufen ist, und erscheint nie in einer Aufgabe für 2016.

## Zu Frage 3 (V-3, gespeicherter Stand)

Vertretbar. `deletedWithinRetention` rechnet mit den Daten, die die Abrechnung gespeichert hat. Das ergibt nie ein späteres Datum als das echte `keepUntil` der Rechnung, also nie eine Aufgabe «Abrechnung berichtigen», die die Löschbestätigung nicht ankündigt. Früher kann das Datum nur bei einem Leistungszeitraum über das Periodenende hinaus liegen, oder bei einer alten Abrechnung ohne gespeichertes `invoiceDate` (Rückfall auf `end`). Die Abrechnung ist dann über 10 Jahre alt, und die Forderungen daraus sind verjährt. OR (SR 220), Stand 01.10.2026, Art. 128: «Mit Ablauf von fünf Jahren verjähren die Forderungen: 1. für Miet-, Pacht- und Kapitalzinse sowie für andere periodische Leistungen». Eine Berichtigung bringt dem Mieter dann nichts mehr. Offen bleibt nur der Widerspruch zur Löschbestätigung (V-3a).

## Nicht bestätigt

- Ob die Lieferung in den Tank (`fuelStock`, ausgenommen in `changedInvoices`) und die Tankbestände alter Abrechnungen von der Frist betroffen sein sollten, habe ich nicht geprüft. Der Diff ändert daran nichts; geschaut habe ich nur in `statement-invoices.service.ts:111-116`.
- Die fr/it-Begriffe des StHG sind weiter nicht auf Fedlex FRA/ITA nachgelesen (wie in Runde 1).
- Ob der Zeitpunkt des Abzugs von Unterhaltskosten (Fälligkeit oder Zahlung) das Rechnungsdatum als Stichtag stützt, ist weiter **unsicher** (Runde 1, nur im DBG geschaut).

Geprüft: Die Regel `retentionPeriod`/`keepUntil` gibt in allen Fällen der Tabelle V-1 aus Runde 1 dasselbe wie der Vorschlag (Kalenderjahr, Juli–Juni 31.03./01.07.2024, November–Oktober 15.10./01.11.2024, Rechnung nach dem Leistungszeitraum, Leistungszeitraum nach dem Rechnungsdatum; `lastCompletedPeriod` mit dem Tag plus ein Jahr, auch am 29.02.). Die SQL-Vorauswahl in `expiredInvoicePeriods` ist eine Obermenge der abgelaufenen Rechnungen. Wertvermehrende Investitionen: `'sale'`, Hinweis beim Löschen, nicht in der Aufgabe (auch ohne Kategorie richtig dank `is distinct from`); der Name der vordefinierten Kategorie lässt sich nicht ändern (`category.service.ts:180-187`). Ohne Frist entfällt in `DeleteConsequences` die Aufforderung zur Berichtigung. Glossarzeile im Übrigen geprüft. Alle 8 Texte in de/fr/it/en stimmen wörtlich mit dem Wortlaut aus Runde 1 überein, ebenso ihre Verwendung in Übersicht, `RetentionHint` und Löschbestätigung. Szenarien: 31.12.2024 für 2014, 31.12.2034 für 2024 und «keine Frist» für den 30.06.2015 am 09.11.2026 stimmen. Fedlex: OR Art. 958f Abs. 1 (Stand 01.10.2026) und DBG Art. 152 Abs. 1 (Stand 02.09.2026) sind unverändert gegenüber Runde 1.
