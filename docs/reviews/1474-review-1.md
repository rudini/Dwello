# Code-Review #1474, Runde 1 (mit Nachprüfung von 1474-v3-review-1 C-1)

Bereich: `3d86e9f..1321234`, begutachtet wird 1321234 (Worktree review-1474-code2). `implementation_plan.md` und `docs/reviews` habe ich nicht begutachtet.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | Keine neuen Befunde. |

Geschlossen: C-1 (aus 1474-v3-review-1). `statement-generate.feature:317-326` setzt den vorgeschlagenen Fall um: geliefert am 20.12.2024, verrechnet am 20.01.2025, erwartet «Pro Fläche (m²)». Auf ca6fc32 nennt die Vorschau «Pro Einheit». Commit 3cee5a2 begründet, warum kein eigener roter Lauf nötig ist: Der pg-Test des Fixes war rot (CLAUDE.md, Workflow 2).

## Nicht bestätigt

- Vom Aufrufer gemeldet:
  - `llm-extraction.test.ts`: 16 pass, jeder Parser-Guard rot gesehen.
  - `fuel-stock.pg.test.ts`: 56 pass, rot gesehen ohne die Guards Brennstoff-Kategorie, `noTank` und `servicePeriodStart`.
  - Backend `bun run test`: 2437 pass mit Coverage.
  - `bun run type-check`, `bun run lint`.
  - `bun run check`, Fitness und Prettier, nur auf 8e6578b.
  - E2E chromium `-g "Tank|Lieferung|Verteilschlüssel"`: 111 passed. Das neue Szenario in `statement-detail.feature` war als `@wip` rot («1/1 Tage 450.00»).
  - llm:eval Leistungszeitraum: vorher 4/6, nachher 7/7 in zwei Läufen.

  Beim Lesen sind die roten Läufe plausibel:
  - Ohne `answeredAs` fehlt `confidence.servicePeriodStart`, dann ist auch `unsure(0.9)` nicht leer.
  - Ohne den Guard `!!invoice.servicePeriodStart` gilt `isDelivery(null, null)`, dann bekommt die Rechnung ohne Zeitraum `delivery: true`.
  - Ohne die Prüfung von Kategorie und `noTank` zählt die eintägige Rechnung 365 statt 1 Tag.
- Kein Szenario für die Prompt-Änderung (`llm.ts`): Der Plan (Z. 29) begründet `No scenario` damit, dass der KI-Double im E2E nach dem Dateinamen liest, nicht nach dem Bild. Ob der Pull-Request-Text das so nennt, kann ich noch nicht prüfen, es gibt noch keinen PR.
- Inhalt der Eval-Bilder `heizoel-bestelldatum.png`, `pellets-zwei-lieferungen.png` und `salz-lieferdatum.png`: nicht selbst angesehen. Fachreview 1474-2 und 1474-3 haben Beträge und Daten geprüft.
- Text von Issue #1474 und die drei Entscheide: nicht auf GitHub gelesen. Grundlage sind die Wiedergabe des Aufrufers und die Fachreviews 1474-1 bis 1474-3.
- V-8 (`sharesNoteDelivery` sagt «fehlt der Anfangs- oder der Endbestand», das gilt jetzt auch für ein Gebäude ganz ohne Tankbestand, über `statement-pdf.service.ts:123` → `pdf-cost-table.ts:235`) und V-9: vom Aufrufer bewusst offen gelassen, nicht neu gewertet.

Geprüft:
- Parser `llm.ts:373-405`: genau ein gültiger Tag nur mit `heatingMaterial === true`; ein ungültiger Eintrag ergibt null; ein genannter Zeitraum hat Vorrang; die Sicherheit kommt aus `deliveryDates`.
- `untrackedFuelCategories` greift nur, wenn `periodReadings` null gibt und das Gebäude `noTank = false` hat. Das heisst gar kein Tankbestand, wie Glossar Z. 163 sagt.
- `kind()` und der Filter nach dem Periodenende bleiben ohne Tank unverändert, auch im Kostenabgleich (`cost-reconciliation.service.ts:56`).
- Der Glossar-Satz steht wörtlich wie in V-7 am Ende der Zeile.
- Keine UI-Texte, keine API-Verträge, keine Sicherheitsfläche betroffen.
- Die Umformatierungen in `llm-eval.ts` und `fuel-stock.pg.test.ts:373` betreffen Zeilen dieses Branches (caa5465, 3d86e9f).
- Ponytail: nichts Ungenutztes, keine Kopie eines Helfers.
