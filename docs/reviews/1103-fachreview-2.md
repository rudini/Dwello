# Fachreview #1103, Runde 2 (Schritt 1, Commit f3bf90b, Delta a715164..f3bf90b)

Geschlossen: V-1, V-2, V-3, V-4

Keine offenen und keine neuen Befunde.

## Nicht bestätigt

- Einen E2E-Lauf des Szenariogrundrisses (`building-detail.feature:95-107`) und der Unit-Tests habe ich nicht gemacht. Die Prüfung beruht auf dem Lesen des Deltas: `period-types.ts:26-29`, `period-types.test.ts:35-50`, `questions/building-detail.ts:29-45`, `building-detail.steps.ts:183-196`.

Geprüft: V-1: Der neue Schritt prüft «Beispiel: <Ende>» (Tag und Monat der Zeile), Datum ≤ heute und Datum + 1 Jahr > heute, beides mit Europe/Zurich (`inDays(0)`). Eine Umsetzung mit dem nächsten Periodenende fällt damit durch. V-2: `stockPeriods` = `lastCompletedPeriod(type, heute + 1)`, `next` beginnt am Tag nach `ended.end`. Nachgerechnet: Am 04.11.2026 ergibt sich 2025/2026 bzw. 01.07.2025 – 30.06.2026/01.07.2026 – 30.06.2027 bzw. 01.11.2025 – 31.10.2026/01.11.2026 – 31.10.2027. Am 30.10.2026 ergibt November – Oktober 31.10.2025, am 31.10.2026 dann 31.10.2026 (heute zählt mit). Am 30.06.2026 ergibt Juli – Juni 01.07.2025 – 30.06.2026/01.07.2026 – 30.06.2027, am 31.12.2026 ergibt Kalenderjahr 2026/2027 und am 01.01.2027 ebenfalls 2026/2027. «Endbestand 2026 und Anfangsbestand 2026» kommt also nicht mehr vor. V-3: In `buildings_fuel_intro` steht in de/fr/it/en die Wording-Tabelle aus Runde 1 («bei diesem Gebäude am 31.12.»). Die Platzhalter {end}/{ended}/{next} stehen in allen drei Schlüsseln und vier Sprachen gleich, `periodName` nennt das Kalenderjahr als Zahl und die anderen Perioden mit ihren zwei Tagen. V-4: Der erste Schritt prüft zuerst, dass das Beispiel ein Datum TT.MM.JJJJ nennt (`fuelStockDateExampleDay` nicht null). Hilfe und Feldbeispiel kommen aus derselben Quelle (`stockPeriods.ended.end`), und der 1098-Grundriss (Stichtag 31.12./30.06./31.10., nicht der andere Tag) hält mit den neuen Texten weiter.
