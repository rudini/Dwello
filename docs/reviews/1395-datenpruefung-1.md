# Datenprüfung #1395, Runde 1

Commit 19903a9d, App: Persona-Stack (DB `dwello_persona`, Backend :3301, Frontend :3300). Es wurde nichts geändert: nur Lesen (psql, GET, Seitenaufrufe mit dem Persona-Cookie). Der Stand der Abrechnungen ist danach unverändert (`updated_at` und `balance` von NK-11111111-2025-0001 und -2024-0001 geprüft).

## Ergebnis

Keine Findings. Alle Beträge stimmen auf den Rappen mit meiner unabhängigen Rechnung überein. Die Tabelle bleibt deshalb leer.

| ID | Schweregrad | Datensatz | Erwartet | Tatsächlich |
|---|---|---|---|---|
| – | – | – | – | – |

Geprüft: NK-11111111-2025-0001, NK-11111111-2024-0001, -0002, -0003, -0004, NK-11111111-2025-0002, -0003, -0004 (Entwürfe, nicht fällig), NK-22222222-2024-0001, -0002, -0003, NK-33333333-2024-0001, -0002, Dashboard-Aufgaben, Seite der Abrechnung auf Deutsch, Französisch, Italienisch und Englisch (NK-11111111-2025-0001 und die vier 2024 des Gebäudes).

## Vorgehen

Skript: `/tmp/claude-0/-home-user-Dwello/e08e296b-4f3e-524c-9f96-1ffc2ac3b5a9/scratchpad/w/recompute.py` (liest Rechnungen, Verteilschlüssel samt Formeln, Wohnungen, Akonto, Tankbestand, vereinbarte Kategorien aus der DB; kein Dwello-Code). Regeln aus `docs/nebenkostenabrechnung-anforderungen.md` («Regeln in Dwello» 1, 3, 5, 8, 9) und `UBIQUITOUS_LANGUAGE.md`:

- Position = Summe der Rechnungen der Kategorie in der Periode (Heizung: plus Anfangsbestand 2650.00 minus Endbestand 2257.20 bei 2025, bzw. 2120.00 minus 2650.00 bei 2024).
- Wohnungsanteil = Formelwert der Wohnung / Summe über alle 6 Wohnungen des Gebäudes (auch leere, 3.02 inklusive). Zeitanteil 1 (ganze Periode, Heizprofil «wholePeriod»).
- Mieteranteil je Position auf 2 Stellen kaufmännisch gerundet, Summe, Verwaltungspauschale 3 % der Summe auf 2 Stellen, minus Akonto, Saldo nur zugunsten des Mieters auf 5 Rappen gerundet (Nachzahlung ab, Rückerstattung auf).

Kontrolle des Modells: Mit 3.02 = 55 m² (alter Stand) reproduziert das Skript alle gespeicherten Positionen, Verwaltungspauschalen und Salden der fünf Abrechnungen des Gebäudes auf den Rappen (Aufruf `python3 -I recompute.py old NK-11111111-2025-0001 NK-11111111-2024-000{1,2,3,4}`).

## (1) NK-11111111-2025-0001 (Hans Müller), 3.02 = 75 m²

Wohnungsflächen 75.5 + 92 + 85 + 65 + 120 + 75 = 512.5 m² (vorher 492.5), Einheiten 6.

| Position | Kosten Gebäude | Anteil neu | Betrag neu | Betrag gespeichert |
|---|---|---|---|---|
| Lift (Pro Einheit) | 1690.00 | 16.6667 % | 281.67 | 281.67 |
| Hauswart (Fläche) | 3680.00 | 14.7317 % | 542.13 | 564.14 |
| Kaltwasser (Fläche) | 3840.00 | 14.7317 % | 565.70 | 588.67 |
| Allgemeinstrom (Fläche) | 762.80 | 14.7317 % | 112.37 | 116.94 |
| Gartenpflege (Fläche) | 935.00 | 14.7317 % | 137.74 | 143.34 |
| Kehricht (Pro Einheit) | 990.00 | 16.6667 % | 165.00 | 165.00 |
| Heizung (70 % Fläche / 30 % Einheit) | 6957.80 | 15.3122 % | 1065.39 | 1094.53 |
| Kaminfeger (Fläche) | 335.00 | 14.7317 % | 49.35 | 51.36 |

Summe 2919.35, Verwaltungspauschale 3 % = 87.58, Kosten 3006.93, Akonto 2880.00, Saldo vor Rundung 126.93, gerundet **126.90**. Alt: 3005.65 / 90.17 / 3095.82 / 215.82 -> 215.80.

Gespeichert/API/Seite: API `recalculated.balance` = 126.90, `difference` = -88.90 (= 126.90 - 215.80), `correctionDue` true, `correctionLowers` true, `correctionDeclinable` false. Seite (de): «Neu berechnet ergibt sich für Hans Müller eine Nachzahlung von CHF 126.90 statt CHF 215.80.» Stimmt.

**Die 5 Rappen gegenüber 126.95:** Der exakte Saldo ist 126.9296 (ungerundet gerechnet) bzw. 126.93 (mit den auf 2 Stellen gerundeten Positionen). Kaufmännisch auf 5 Rappen gerundet gäbe das 126.95, vermutlich Dr. Webers Schätzung. Dwello rundet nach der Regel «Saldo und Rundung» (Regel 8, #79) eine Nachzahlung nur zugunsten des Mieters ab: 126.93 -> 126.90. CHF 126.90 ist richtig, die Abweichung ist die dokumentierte Rundung, kein Fehler.

Die Positionen der Neuberechnung liefert die API nicht, nur den Saldo; meine Positionswerte sind ohne Gegenstück. Der Saldo, der von allen Positionen abhängt, stimmt aber.

## (2) Abrechnungen 2024 des Gebäudes (alle «bezahlt», 366 Tage, ganzes Jahr)

| Abrechnung | Mieter | Saldo gespeichert | Saldo neu (meine Rechnung) | API `recalculated.balance` | API `difference` | Seite (de/fr/it/en) |
|---|---|---|---|---|---|---|
| NK-11111111-2024-0001 | Müller | 72.55 | -12.40 (roh -12.39) | -12.40 | -84.95 | Rückerstattung 12.40 statt Nachzahlung 72.55 |
| NK-11111111-2024-0002 | Schmidt | -171.70 | -275.20 (roh -275.19) | -275.20 | -103.50 | Rückerstattung 275.20 statt 171.70 |
| NK-11111111-2024-0003 | Dubois | -13.50 | -109.20 (roh -109.16) | -109.20 | -95.70 | Rückerstattung 109.20 statt 13.50 |
| NK-11111111-2024-0004 | Rossi | 35.65 | -99.35 (roh -99.33) | -99.35 | -135.00 | Rückerstattung 99.35 statt Nachzahlung 35.65 |

Jede Abrechnung ändert sich in den sechs flächenbasierten Positionen (Hauswart, Kaltwasser, Allgemeinstrom, Gartenpflege, Heizung, Kaminfeger) und damit in der Verwaltungspauschale; Lift und Kehricht (Pro Einheit) bleiben gleich. Alle vier sind also zu Recht fällig. Die Rückerstattungen werden zugunsten des Mieters aufgerundet (z. B. roh -275.19 -> -275.20, Regel 8), korrekt. Die Sätze wählen die richtige Variante (Nachzahlung/Rückerstattung, «statt einer …» nur beim Vorzeichenwechsel). Alle Salden fallen, darum zeigt die Seite kein «Nicht berichtigen» (`correctionDeclinable` false) und keinen Satz «Den Unterschied … tragen Sie selbst.» (glossarkonform: nur wenn der Saldo nicht sinkt). Die Dashboard-Aufgaben «Abrechnung berichtigen» nennen genau diese fünf Abrechnungen (2025-0001 und die vier 2024), alle von Musterhaus Zentrum.

Die Entwürfe NK-11111111-2025-0002/-0003/-0004 sind laut API nicht berichtigungsfällig (`correctionDue` false, `valuesChanged` true), richtig für Entwürfe («Neu berechnen»).

## (3) Andere Gebäude

Seepark Residenz und Alpenblick: Die Wohnungen wurden seit dem Seed nicht geändert. API: bei allen 11 Abrechnungen `valuesChanged` false, `correctionDue` false, `recalculated` null. Unabhängige Kontrolle: Mein Skript mit den heutigen Daten reproduziert die gespeicherten Positionen, Verwaltungspauschalen und Salden von NK-22222222-2024-0001/-0002/-0003 (mit den Heizrechnungen mit Leistungszeitraum, anteilig nach Tagen) und NK-33333333-2024-0001/-0002 auf den Rappen, die Neuberechnung ergäbe also nichts Neues. Der eigene Verteilschlüssel «Weber Fläche und Zimmer» (`{area} + {rooms} * 10`) wird von keiner Rechnung benutzt (Abfrage auf `invoices.distribution_key_id` und `utility_statement_line_items.distribution_key_id`: je 0 Treffer), löst nichts aus. Die Seiten dieser Abrechnungen (c941d43e…, fcdc5740…) zeigen keinen Hinweis; das Dashboard nennt keine Aufgabe für diese Gebäude.

## Nicht bestätigt

- **PDF und QR-Rechnung:** nicht geprüft. Die Änderung #1395 erzeugt kein PDF und keinen Zahlteil (es gibt nur Hinweise und Aufgaben, keine berichtigte Abrechnung wurde erstellt, das hätte Daten geändert). Es gab keinen QR-Zahlteil zu dekodieren.
- **Berichtigte Abrechnung selbst** («Abrechnung berichtigen» ausgeführt): nicht erstellt, weil das die Daten der Personas ändern würde. Geprüft ist nur die angezeigte Neuberechnung (Saldo), nicht die dann erzeugte Abrechnung mit «Bereits bezahlt» usw.
- **Positionen der Neuberechnung einzeln:** die API gibt nur Saldo und Differenz heraus; meine Positionswerte (Tabelle (1)) habe ich nicht mit einer gespeicherten Neuberechnung verglichen, nur indirekt über den Saldo und über die Reproduktion des alten Stands.
- **Ein Wechsel mit «gilt ab» Tag** oder Teilperioden (Ein-/Auszug, Heizprofil nach Monaten) wurde nicht gerechnet: keiner der betroffenen Datensätze hat das (alle ganze Periode).
