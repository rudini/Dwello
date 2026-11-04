# Fachreview #1098, Schritt 1, Runde 2 (Commit 630d679, Delta c645ad4..630d679)

Geschlossen: V-1

Keine neuen Befunde (kein Blocker, Major oder Minor).

## Nicht bestätigt

- Ob die Seite das Beispiel in einem Browser in fr/it/en richtig zeigt: Ich habe weder E2E noch die Sprach-Bildschirme laufen lassen. Gelesen habe ich nur, dass `formatDate` (`src/lib/utils/format.ts:44-52`) unabhängig von der Sprache immer `de-CH` TT.MM.JJJJ liefert, wie bisher die Vorgabe in `DateInput.svelte:22`.

Geprüft: V-1 ist behoben. `FuelStocks.svelte` übergibt `example={nextPeriodEnd(period)}`, und `+page.svelte:82` reicht `building.accountingPeriod ?? 'calendar'` weiter. `nextPeriodEnd` (`src/lib/accounting-period.ts:41-45`) vergleicht als Text im Format JJJJ-MM-TT mit `localToday()` (Tag in Europe/Zurich, `contract-status.ts:10-11`). Nachgerechnet: Am 04.11.2026 ergibt das 31.12.2026 (Kalenderjahr), 30.06.2027 (Juli – Juni) und 31.10.2027 (November – Oktober). Randfall «heute ist das Periodenende»: Am 31.10.2026 ergibt November – Oktober 31.10.2026, weil heute mitzählt. Am 30.06.2026 ergibt Juli – Juni 30.06.2026, am 01.07.2026 dann 30.06.2027. Jahreswechsel: Am 31.12.2026 ergibt das Kalenderjahr 31.12.2026, am 01.01.2027 dann 31.12.2027. Damit liegt das Beispiel nie in der Vergangenheit, und sein Tag stimmt immer mit dem Stichtag der Hilfe überein (`fuel-stock.service.ts:53-54` sucht genau `periodEnd`). Der Schritt «Und nennt das Beispiel beim Stichtag den Tag "<Stichtag>"» prüft `Beispiel: <TT.MM.>` am Feld `fuel-stock-date-input-help` für alle drei Zeilen. Der DOM-Test deckt dieselben Werte und den Randfall ab. Das `@wip` fällt bei einem neuen Szenario dieses Branches ohne Freigabe weg. Texte: `buildings_fuel_intro_july_june` und `buildings_fuel_intro_november_october` sind in de/fr/it/en byte-gleich zu meinen Entwürfen (`review-1098-fach-drafts.json`), und `buildings_fuel_intro` ist unverändert.
