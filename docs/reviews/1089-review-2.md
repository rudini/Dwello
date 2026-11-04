# Code-Review #1089, Runde 2 (Abschlussrunde, 0c0871525)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | tests/e2e/screenplay/questions.ts:216 | Bleibt offen wie in Runde 1: Der Platz für den Text wird mit `clientWidth - paddingLeft - paddingRight` gerechnet. Der Pfeil des nativen Selects ist darin nicht abgezogen, darum fällt eine knappe Kürzung (weniger als die Pfeilbreite) nicht auf. |

Geschlossen: C-2

## Nicht bestätigt

- Lint: vom Aufrufer gemeldet.
- Chromium-Szenario «Die Wahl des Heizprofils passt auf Italienisch aufs Telefon» nach der Änderung grün: vom Aufrufer gemeldet.
- Ob Firefox und WebKit die zusammengesetzte Schrift so annehmen und das Szenario dort besteht: nicht ausgeführt, kein Browser im Worktree. Das zeigt erst der CI-Lauf auf dem PR mit allen Browsern.

Geprüft: Delta (1 Datei, 2+/1-). Die Werte `fontStyle`, `fontWeight`, `fontSize` und `fontFamily` aus getComputedStyle sind nie leer und ergeben in dieser Reihenfolge eine gültige Canvas-Kurzform. Die Zuweisung fällt darum nicht mehr still auf `10px sans-serif` zurück. Der Kommentar stimmt mit der Änderung überein. Nichts ohne Bezug zur Anforderung.
