# Code-Review 1103, Runde 2 (Delta f3bf90b..83ae8a4, ohne docs)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde im Delta. |

Geschlossen: C-1

C-1: `fuelStockDateExampleDay` und `fuelStocksHelpDay` (tests/e2e/questions/building-detail.ts:30-35) antworten jetzt mit dem Tag selbst. Die Abstände `daysBeforeToday` und `daysAfterTodayAYearLater` (:38-46) antworten mit einer Zahl. Ein fehlschlagender Check zeigt damit, was die Seite sagt (`tests/e2e/CLAUDE.md:44`). Der Schritt (tests/e2e/steps/building-detail.steps.ts:185-194) prüft beide Werte auf `^<Ende>\d{4}$`, bevor er die Abstände rechnet. Deshalb schlägt ein fehlendes Datum (`null`) schon bei `toMatch` fehl und nicht erst beim `day!` in `daysFromToday`.

Geprüft:
- Die Grenzen sind dieselben wie vorher: Ende ≤ heute, und dasselbe Ende ein Jahr später liegt nach heute.
- `inDays(0)` und `Date.UTC` rechnen beide in UTC um Mitternacht. Kein Ende in den Beispielen fällt auf den 29.02.
- «Der Wert vom {end}» steht in allen drei deutschen Varianten von `buildings_fuel_intro*` (messages/de.json:385-387).
- Das Szenario fehlt auf `origin/main` (e9436d5). Seine geänderten Zeilen brauchen deshalb keine Freigabe.
- Kein entfernter Export und kein entfernter Schritt wird noch verwendet.
- Der geänderte Kommentar beim Schritt «nennt das Beispiel beim Stichtag den Tag» gehört zu #1103: Der alte sprach vom nächsten Ende, das stimmt jetzt nicht mehr.
- Die Steps rufen nur Questions auf (Screenplay).

## Nicht bestätigt

- `bun run lint` grün auf 83ae8a4: vom Aufrufer gemeldet.
- building-detail.feature in Chromium, 18 bestanden: vom Aufrufer gemeldet.
- Rot mit herausgenommenem Code (Backend `ended` auf die kommende Periode gesetzt), Meldungen «Expected: >= 0, Received: -361» und «-238»: vom Aufrufer gemeldet. Beim Lesen bestätigt: Ein künftiges Ende ergibt einen negativen Wert bei `daysBeforeToday`, der Schritt schlägt also fehl.
