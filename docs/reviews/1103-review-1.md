# Code-Review #1103, Runde 1 (origin/main..f3bf90b, ohne docs/reviews)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | tests/e2e/questions/building-detail.ts:370-376, 382-385 | Die zwei neuen Fragen `fuelStockDateExampleRecent` und `fuelStocksHelpNamesExample` antworten ja/nein und verbergen dabei den Wert. Das widerspricht `tests/e2e/CLAUDE.md:44` |

## C-1 (Major): Ja/Nein-Fragen verbergen den Stichtag

`tests/e2e/CLAUDE.md:44`: «A question answers the value itself (a text, an amount in francs, a count), never a yes/no that hides it: a failing check then shows what the page says. Yes/no only for real states (shown, enabled, checked).» Keine der beiden Fragen fragt einen Zustand ab. Beide rechnen eine Regel über den Text der Seite aus und liefern nur `true` oder `false`:

- `fuelStocksHelpNamesExample` (Schritt «nennt die Hilfe zum Tankbestand den Stichtag aus dem Beispiel beim Stichtag», steps:406-409)
- `fuelStockDateExampleRecent` (Schritt «ist das Beispiel beim Stichtag der … der zuletzt abgelaufenen Abrechnungsperiode», steps:412-418, Fachreview V-1)

So zeigt sich der Fehler: Man gibt die Rückwärtsrechnung ein Jahr zu früh aus, also `lastCompletedPeriod(type, today)` statt `daysAfter(today, 1)` in `backend/src/services/period-types.ts:27` an einem Tag, an dem die Periode endet. Oder man setzt die Hilfe auf ein festes Jahr zurück. Das Szenario wird dann zwar rot, meldet aber nur «expected true, received false». Welchen Tag die Seite nennt und was die Hilfe sagt, steht nicht in der Meldung. Genau diese Diagnose soll die Regel sicherstellen.

Korrektur:
- Hilfe: Der Schritt holt den Tag mit `fuelStockDateExampleDay` (liefert schon den Wert) und prüft dann `sees(fuelStocksHelp).toContain(day)`. Bei einem Fehler steht so der Hilfetext in der Meldung.
- Regel aus V-1: Eine Frage liefert, wie viele Tage der Beispiel-Tag vor heute liegt (eine Zahl, `null` ohne Beispiel). Der Schritt prüft `>= 0` und `< 365` bzw. `< 366`, wenn im Jahr ein 29.02. liegt. Einfacher geht es auch so: Die Frage gibt den Tag als ISO-Datum zurück, und der Schritt vergleicht ihn mit `inDays(0)` und dem Tag ein Jahr davor.

`fuelStockDateExampleRecent` wird damit überflüssig und fällt weg.

Nicht bestätigt:
- bun run lint, bun run check (0 Fehler), bun run fitness, Backend-type-check: vom Aufrufer gemeldet.
- Backend `period-types.test.ts` (11), `building.routes.pg.test.ts` (14), `api-contracts.pg.test.ts` (101): vom Aufrufer gemeldet.
- `bunx vitest run --changed origin/main` (1259) und `buildings-pages.dom.test.ts` (35): vom Aufrufer gemeldet.
- E2E Chromium `building-detail.feature` (18) und die axe- und Sprachzeilen zu «building-detail» (26): vom Aufrufer gemeldet.
- Rote Läufe von Szenario, Unit-, Route- und DOM-Test: vom Aufrufer gemeldet. Nach dem Lesen fallen alle auf dem Basis-Commit:
  - Szenario: Das Beispiel nennt dort das kommende Periodenende, die Hilfe ein festes 2024/2025.
  - Unit-Test: `stockPeriods` fehlt.
  - Route-Test: Das Feld fehlt.
  - DOM-Test: Die Hilfe nennt dort 30.06.2025, nicht 30.06.2031.
- Ob ein Platzhalter-Test die gleichen Platzhalter `{end}`, `{ended}`, `{next}` in allen vier Sprachen verlangt, habe ich nicht gesucht. Gelesen: alle vier `messages/*.json` haben dieselben drei.

Geprüft:
- `stockPeriods`: Eine Periode, die heute endet, gilt als abgelaufen (V-2). `next` beginnt am Tag nach `ended.end`. Die Unit-Tests decken das ab, mit den Zeilen 30.10./31.10. und dem Jahreswechsel.
- Kalendertext «bei diesem Gebäude am 31.12.» steht in allen vier Sprachen (V-3). Mit `periodName` ergibt er «Endbestand 2025 und Anfangsbestand 2026».
- Der Guard im Schritt (V-4) ist da.
- Contract `building.json` und `docs/api-specification.md` sind angepasst.
- Es gibt keine Reste von `nextPeriodEnd` und keinen ungenutzten Code.
- Der bestehende #1098-Szenariogrundriss ist unverändert und hält weiter («Beispiel: 31.12.» usw.).
- Keine neue Ansicht und kein neuer Zustand, also keine Einträge in `screens.json` nötig.
- Tokens und a11y sind unberührt. Die Diff enthält nichts, was nicht zur Anforderung gehört.
- Ponytail: nichts zu kürzen ausser der Frage aus C-1.
