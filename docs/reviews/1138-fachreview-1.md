# Fachreview #1138, Runde 1 (vor der Umsetzung)

Gegenstand: @wip-Szenarien in `tests/e2e/features/statement-cost-reconciliation.feature` (Z. 90–123) und `tests/e2e/features/reports.feature` (Z. 115–129), geänderte Zeile Z. 41 (Verwaltungspauschale), Commit 9a47fcd. Anforderung: «Decided (product owner)» von #1138 (06.11.2026).

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-1 | Verwalter | Minor | Tankbestand-Satz bei Anfangsbestand 0 und Endbestand 0 (Tank stillgelegt, `periodReadings` liefert beide Stichtage, `fuel-stock.service.ts:50–60`) behauptet eine Veränderung, die es nicht gibt. Fix: Satz zeigen, sobald die Position einen Eintrag «Veränderung Tankbestand» enthält (`fuelStockChange`, `fuel-stock.service.ts:90–119`), auch bei Veränderung 0 (z.B. 600/600), ausser beide Werte sind 0. |
| V-2 | Verwalter | Minor | Reihenfolge der Wohnungen: nicht nur nach Wohnungsnummer, sondern wie auf der Gebäudeseite nach Stockwerk, dann Wohnungsnummer (`backend/src/services/apartment.service.ts:136`; numerisch wie `src/lib/server/building-register.ts:113`), damit der Vermieter die Liste wiedererkennt. |
| V-3 | Verwalter | Minor | Beide Sätze nur, wenn die Tabelle Positionen zeigt, wie der Hilfetext (`CostReconciliation.svelte:84`); sonst steht ein Leerstand-Satz ohne Kosten, die er erklärt (Periode ohne umlagefähige Rechnung). |
| V-4 | Verwalter | Minor | Kein Test für die entschiedenen Regeln Einzahl («1 Tag»), Summe mehrerer Lücken einer Wohnung, mehrere Wohnungen (Trennung mit Komma, Reihenfolge) und aufgehobene Wohnung. Fix: Backend-Test (`*.pg.test.ts`) mit den Beispielen unten, DOM-Test für Einzahl/Mehrzahl und Trennung. |

## Entscheide (fachlich)

**Leerstand-Tage.** Vorschlag des Callers bestätigt: je Wohnung des Gebäudes die Tage der Abrechnungsperiode (beide Enden eingeschlossen), an denen sie noch zählt (vor «Aufgehoben ab», `countingOn`, `prorating.service.ts:314`) und kein Mietvertrag läuft (Vertragsbeginn bis Vertragsende, wie `handleVacancy`, `prorating.service.ts:202–249`, und damit wie die Abrechnung rechnet). Tage bis «Abgerechnet bis» sind vermietet, ebenso die Tage eines übergangenen Mietvertrags und (unter «Berichte») eines Mietvertrags ohne Abrechnung: diese Gründe nennt die Kostenabstimmung getrennt (UBIQUITOUS_LANGUAGE.md Z. 185). Eine Wohnung mit Mietstatus «Gesperrt» ohne Mietvertrag ist Leerstand (Z. 209: «keinen laufenden Mietvertrag»). Ab «Aufgehoben ab» zählt die Wohnung nicht mehr und hat keinen Leerstand. Grundlage für Heizkosten Art. 7 Abs. 1 VMWG (Stand 1. Oktober 2025): «Die Heizungskosten für nicht vermietete Wohn- und Geschäftsräume trägt der Vermieter.»

Nachgerechnet (Tage inkl. beider Enden):
- Lindenhof 2024: Eva Frei 01.01.–31.03. = 91, Marc Huber ab 01.05. = 245, 366 − 91 − 245 = 30 = 01.–30.04. Bestätigt (Vorschau und Berichte; unter «Berichte» hat Marc keine Abrechnung, seine Tage bleiben trotzdem vermietet, das Szenario prüft das mit).
- Zwei Lücken: Vertragsende 15.03., Nachmieter ab 01.05., Auszug 31.10. in 2024 → 16.03.–30.04. (46) + 01.11.–31.12. (61) = «Wohnung … (107 Tage)».
- Randfall: Wohnung aufgehoben ab 01.07.2024, Mietvertrag bis 31.05. → nur 01.–30.06. = «(30 Tage)»; Wohnung ohne Mietvertrag, aufgehoben ab 02.01. → «(1 Tag)».
- Keine Lücke (Birkenhof, Lea Graf ab 01.01.2024 unbefristet) → kein Satz. Bestätigt.

**Tankbestand.** Kosten des Gebäudes = Lieferungen + Anfangsbestand − Endbestand (UBIQUITOUS_LANGUAGE.md Z. 160; Art. 5 Abs. 2 lit. a VMWG: «die Brennstoffe und die Energie, die verbraucht wurden»). Nachgerechnet: Lindenhof 1’000 + 600 − 100 = 1’500.00, bestätigt; Alpenblick 4’880 + 1’792 − 1’494 = 5’178.00, bestätigt; Endbestand höher: 1’000 + 0 − 400 = 600.00, Satz «Anfangsbestand CHF 0.00, Endbestand CHF 400.00» bleibt richtig. Ohne Anfangs- oder Endbestand und bei einer nicht umlagefähigen Brennstoff-Kategorie entsteht kein Eintrag (`fuel-stock.service.ts:92,98`), also kein Satz. {position} ist die Beschriftung der Zeile, bei mehreren Verteilschlüsseln mit Schlüssel (`src/lib/server/cost-reconciliation.ts:28–31`). Zeigen bei Veränderung 0: siehe V-1.

**Trennung der Liste:** in allen vier Sprachen «, » (Komma und Leerschlag), kein «und»/«et»/«e»/«and» vor dem letzten Eintrag, wie im Beispiel des PO; eine Aufzählung nach Doppelpunkt, für alle Sprachen gleich, kein `Intl.ListFormat`.

## Texte

| key | de | fr | it | en |
|---|---|---|---|---|
| reconciliation_fuel_stock | In «{position}» ist die Veränderung des Tankbestands enthalten: Anfangsbestand {opening}, Endbestand {closing}. | La variation du stock de combustible est comprise dans « {position} » : stock initial {opening}, stock final {closing}. | La variazione della scorta di combustibile è compresa in «{position}»: scorta iniziale {opening}, scorta finale {closing}. | «{position}» includes the change in fuel stock: opening stock {opening}, closing stock {closing}. |
| reconciliation_vacancy | Leerstand in dieser Abrechnungsperiode: {apartments}. | Vacance pendant cette période de décompte : {apartments}. | Sfitto in questo periodo di conteggio: {apartments}. | Vacancy in this billing period: {apartments}. |
| reconciliation_vacancy_apartment_one | Wohnung {number} ({days} Tag) | appartement {number} ({days} jour) | appartamento {number} ({days} giorno) | apartment {number} ({days} day) |
| reconciliation_vacancy_apartment_many | Wohnung {number} ({days} Tage) | appartement {number} ({days} jours) | appartamento {number} ({days} giorni) | apartment {number} ({days} days) |
| reconciliation_fee_row | Verwaltungspauschale (bezahlen die Mieter zusätzlich zu «davon Mieter», sie steht Ihnen zu) | Frais d’administration (payés par les locataires en plus de « dont locataires », ils vous reviennent) | Spese amministrative (pagate dagli inquilini in aggiunta a «di cui inquilini», spettano a Lei) | Management fee (paid by the tenants on top of «of which tenants», it is yours) |

`_one` gilt für {days} = 1, `_many` für alle anderen (0 kommt nicht vor). Im Französischen steht vor «:» und innerhalb « » ein U+00A0. «sie steht Ihnen zu» stimmt: Art. 4 Abs. 3 VMWG (Stand 1. Oktober 2025): «Die für die Erstellung der Abrechnung entstehenden Verwaltungskosten dürfen nach Aufwand oder im Rahmen der üblichen Ansätze angerechnet werden.» Es sind die Kosten des Vermieters, der die Abrechnung selbst erstellt.

## Nicht bestätigt

- Ob Nicht-Heizkosten (z.B. Hauswart) bei Leerstand von Gesetzes wegen der Vermieter trägt: die VMWG regelt nur die Heizkosten (Art. 7); die Regel kommt aus UBIQUITOUS_LANGUAGE.md Z. 209 und aus der Praxis, eine Fedlex-Stelle dafür habe ich nicht gefunden (**unsicher**). Für die Sätze ändert das nichts, sie nennen keine Beträge.
- Wie das Front-End zwei Sätze für denselben Gebäude-Datensatz mit mehreren Brennstoff-Kategorien zeigen würde: `fuelStockChange` liefert je Gebäude höchstens einen Eintrag (Kategorie der letzten Ablesung, `fuel-stock.service.ts:57`); «ein Satz je Position» tritt deshalb heute höchstens einmal auf.

Geprüft: Zahlen der Szenarien (30 Tage, CHF 1’500.00, CHF 600.00/100.00), Negativ-Szenarien ohne Tankbestand und ohne Leerstand, Begriffe Tankbestand, Anfangsbestand, Endbestand, Veränderung Tankbestand, Leerstand, Abrechnungsperiode, Verwaltungspauschale (UBIQUITOUS_LANGUAGE.md, docs/design/i18n-begriffe.md Z. 89, 95, 119, 135–137), Wortlaut des PO in Z. 41 und den neuen Szenarien.
