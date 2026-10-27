# Fachreview #770, Runde 1 (537cda82 gegen 0ab8f915)

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Major (besteht vor der Änderung, braucht einen Produktentscheid) | Eine Brennstoff-Kategorie mit Lieferungen nach verschiedenen Verteilschlüsseln in einer Periode: Die Veränderung Tankbestand folgt nur einem davon, und welcher es ist, hängt bei Rechnungen vom selben Tag nun an der Reihenfolge der Erfassung. Der Betrag des Mieters ändert sich damit, und Dwello weist nicht darauf hin. |
| M-1 | Mietrecht | Minor | `statement-detail.feature:1108–1110`: Der Kommentar nennt die 500 Franken «der Verbrauch aus dem Tank», der Szenariotitel spricht von «für den Tankbestand». Das Glossar (`UBIQUITOUS_LANGUAGE.md:153`) nennt Anfangsbestand − Endbestand «Veränderung Tankbestand». Verbrauch ist das erst zusammen mit den Lieferungen. Fix: «die Veränderung Tankbestand (500 Franken: Anfangsbestand − Endbestand)» und im Titel «… nennt für die Veränderung Tankbestand den Verteilschlüssel …». |

## V-1

**Beleg.** `backend/src/services/fuel-stock.service.ts:62–77` (`keyFor`): Die Veränderung Tankbestand bekommt den Schlüssel einer einzigen Rechnung, jetzt den der zuletzt erfassten vom letzten Rechnungsdatum. Die Lieferungen selbst behalten ihre eigenen Schlüssel. Das Szenario hält das als gewollt fest: Heizung steht im PDF unter zwei Schlüsseln, nämlich Wohnfläche (Grundlage 1'000 + erste Rechnung 500) und Pro Einheit (zweite Rechnung 500 + Veränderung 500 = «1'000.00»). Eine Prüfung oder einen Hinweis auf gemischte Schlüssel einer Kategorie gibt es nicht. Gesucht habe ich in `backend/src/services` und `tests/e2e/features`.

**Nachgerechnet.** Zwei Wohnungen A/B mit 80/20 m². Lieferung 1'000 nach Fläche, Lieferung 500 nach Einheit, beide am selben Tag.
- Veränderung −500 (Endbestand höher): nach Einheit trägt A 800 + 250 − 250 = 800 und B 200. Nach Fläche trägt A 800 + 250 − 400 = 650 und B 350. Gesamt in beiden Fällen 1'000.
- Veränderung +500: nach Einheit trägt A 1'300, nach Fläche 1'450.
- Szenario (eine Wohnung, 1 / 1): unabhängig vom Schlüssel 2'500 = 600 + 2'000 − 100. Das PDF unterscheidet nur den Schlüsselnamen. Die erwartete Zeile «Heizung Pro Einheit 1 / 1 Wohnungen 1'000.00» stimmt.

Beim Gesamtbetrag ist das Gesetz eingehalten. VMWG Art. 5 Abs. 2 lit. a (Stand 1. Oktober 2025): «die Brennstoffe und die Energie, die verbraucht wurden». OR Art. 257b Abs. 1 (Stand 1. Oktober 2026): «die tatsächlichen Aufwendungen des Vermieters». Wie der Verbrauch auf die Mieter verteilt wird, hängt aber an einer Erfassungsreihenfolge, die der Mieter nicht sehen kann.

**Warum falsch.** Ein Verwalter verteilt den Brennstoff eines Tanks nach einem einzigen Heizkostenschlüssel. Ein zweiter Schlüssel in derselben Kategorie ist ein Erfassungsfehler oder ein Schlüsselwechsel. Für einen Wechsel braucht es eine Vertragsänderung: `docs/nebenkostenabrechnung-anforderungen.md:104` verlangt «Wechsel des Schlüssels in der App nur mit Hinweis auf Vertragsänderung», das ist dort unsicher-B. Als Regel für den Gleichstand ist «zuletzt erfasst» vertretbar. Sie ist deterministisch und deckt sich mit dem Vorschlag im Rechnungsformular (`invoice.service.ts:244–253`, `latestKeys`: Rechnungsdatum, dann `createdAt`). Den Konflikt löst sie aber stillschweigend.

**Fix (Produktentscheid, Issue mit `domain`, `needs-decision`).** Die Vorschau des Abrechnungslaufs weist darauf hin, wenn die umlagefähigen Rechnungen einer Kategorie mit Tankbestand in der Periode verschiedene Verteilschlüssel haben. Der Hinweis nennt den Schlüssel, nach dem die Veränderung Tankbestand verteilt wird, und die abweichenden Rechnungen. Vorschlag für den Text: «Die Lieferungen der Kategorie {category} haben verschiedene Verteilschlüssel. Die Veränderung Tankbestand wird nach «{key}» verteilt. Prüfen Sie die Verteilschlüssel der Rechnungen.» Die Alternative wäre, die Veränderung im Verhältnis der Lieferbeträge auf die Schlüssel aufzuteilen. Das ist für Laien schwerer nachzuvollziehen. Die Änderung #770 selbst bleibt richtig.

Geprüft: Gleichstand nach `createdAt`, dann `id`, in `keyFor` und im Hinweis auf Rechnungen nach der Abrechnungsperiode (`invoice-completeness.service.ts:286`, ohne Einfluss auf Beträge). Es gibt nur einen Insert-Pfad pro Rechnung (`invoice.service.ts:294`), also ist «zuletzt erfasst» zutreffend. Szenario `statement-generate.feature` «… in der Reihenfolge ihrer Erfassung»: Wortlaut und Erwartung (295.00 vor 470.00) stimmen. Die PDF-Zeile im Szenario `statement-detail.feature` stimmt mit der Rechnung oben überein. VMWG Art. 5 Abs. 2 lit. a und Art. 8 Abs. 2 sowie OR 257a/257b schreiben keinen Schlüssel vor und stehen der Regel nicht entgegen.

## Nicht bestätigt

- Ob ein Schlüsselwechsel innerhalb einer Kategorie während des Mietverhältnisses eine Vertragsänderung nach OR 269d Abs. 3 braucht: Auf Fedlex steht dazu nichts Ausdrückliches. Die Grundlage sind Praxisquellen (`docs/nebenkostenabrechnung-anforderungen.md:104`, unsicher-B), daher **unsicher**.
- Die offenen Issues zu gemischten Verteilschlüsseln konnte ich nicht durchsuchen, weil die GitHub-Suche aus dieser Sitzung gesperrt ist (HTTP 403). Gelesen habe ich nur Issue #770 über die REST-API.
