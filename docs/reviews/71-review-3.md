# Code-Review 3 (abschliessend) zu #71: Merge 0888c42 und Fix 7e2c765

Geprüft im Worktree `review-71-code3` (detached auf 7e2c765). Gelesen habe ich `git show 0888c42 --cc`, `git diff f8ef41c 0888c42 -- backend/src`, `git diff 8f77372 0888c42 -- backend/src/services/calculation.service.ts` und `git diff 0888c42 7e2c765`. Dazu im Umfeld: `fuel-stock.service.ts`, `invoice-completeness.service.ts` (`stockFinding`), `statement-invoices.service.ts`, `statement-pdf.service.ts` (`heatingOf`, `runDetailsOf`), `fuel-stock.pg.test.ts` (Tests zu #72) und `heating-distribution.pg.test.ts` (Tank-Test).

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Major | backend/src/services/calculation.service.ts:385-386, :219 | Die Tank-Ausnahme erkennt den Tank an irgendeiner Ablesung des Gebäudes (`listFuelStocks(buildingId)`), egal wann sie war. Main hat mit #72/#321 den stillgelegten Tank eingeführt (`noTank`, `periodReadings().covered`). Für die Perioden nach der Stilllegung, etwa nach dem Wechsel auf Fernwärme, gilt die Kategorie damit weiter als Tankkategorie. Eine Heizrechnung mit Leistungszeitraum wird dann über die ganze Periode geteilt statt nach #71. |
| C-2 | Nit | backend/src/services/calculation.service.ts:386 | ponytail `shrink:` Es gibt nur einen Tank pro Gebäude (`otherTankCategory`). Statt einer Menge aller Ablesekategorien reicht die eine Kategorie aus `periodReadings`. Das ergibt sich von selbst, wenn C-1 behoben wird. |

## C-1 (Major): Ein stillgelegter Tank hebt #71 für alle späteren Perioden auf

**Warum falsch.** Seit dem Merge kennt das System den stillgelegten Tank.

- `fuel-stock.pg.test.ts:173` nennt ausdrücklich den Fall «Tank stillgelegt (z.B. Wechsel auf Fernwärme)». Für die Jahre nach der Stilllegung verlangt es keinen Stand mehr (`periodReadings` → `covered: false`).
- `fuelStockChange` bucht für solche Perioden keine «Veränderung Tankbestand».
- `calculateStatementForContract` baut `tankCategories` aber aus allen Ablesungen des Gebäudes, ohne Bezug zur Periode (Z. 386).
- `shareOfGroup` setzt deshalb `ownDays = false` (Z. 219). Die Fernwärmerechnung derselben Kategorie «Heating» wird dann nach dem Heizprofil des Laufs über die ganze Periode geteilt, nicht nach den Monaten in ihrem Leistungszeitraum.

Ein Mieter mit Einzug im Mai trägt so einen Teil einer Rechnung für Januar bis März. Genau das schliesst Regel 5 aus («ein Einzug im Mai trägt nichts von einer Rechnung für Januar bis März»). Regel 5 nimmt nur «Lieferungen in einer Kategorie mit Tankbestand des Gebäudes» aus, und nach der Stilllegung hat das Gebäude keinen Tankbestand mehr in der Periode.

Vor dem Merge gab es diesen Zustand nicht. Erst die Kombination beider Stände ergibt den Widerspruch.

**Wie man zeigt, dass es fehlschlägt.** Ein pg-Test in `heating-distribution.pg.test.ts`, gebaut wie der Tank-Test Z. 327:

- Ablesungen `2023-12-31` 700.00 und `2024-12-31` 0.00 in `heatingId`, Gebäude mit `noTank: true`;
- Rechnung 1000.00 für `2025-01-01` bis `2025-03-31`;
- Periode 2025, Einzug am `2025-05-01`.

Erwartet sind `tenantShare: 0` und `invoiceParts` mit `profile.percent: 0`. Heute kommt `invoiceParts: null` mit dem Anteil des Laufs heraus (Mai bis Dezember im Profil, z. B. 0.52).

**Abhilfe (kurz).** Den Tank an der Periode erkennen, wie die Vollständigkeitsprüfung es tut:

```ts
const tank = await periodReadings(buildingId, start, end);
const tankCategory = tank?.covered ? tank.categoryId : undefined;
```

`ownDays` vergleicht dann gegen `tankCategory`. Das Jahr der Stilllegung bleibt Tank (`covered`, weil der Anfangsbestand > 0 ist), und der bestehende Tank-Test bleibt grün (Anfangsbestand 500).

## Weitere Prüfungen ohne Befund

- **Merge, Import-Konflikt:** `BilledInvoice` und `HeatingProfile` werden beide importiert und beide benutzt (Z. 15, `byProfile`, `invoices` am Posten).
- **#96 `invoices` am Posten:** Sie werden aus `group.invoices` mit dem Zeitraum in der Periode gebaut, unabhängig von `invoiceParts`/`profile`. `billedAsIs` in `statement-invoices.service.ts` vergleicht `amount`, `start` und `end` in der Periode, das passt. `statement.service.ts:365` speichert `invoices`.
- **`hasFuelStocks`:** Main hat es entfernt, der Branch benutzt es nicht (grep leer).
- **7e2c765, C-1 aus Runde 2:** `runDetailsOf` überspringt eine Heizposition mit `totalAmount` 0 (`statement-pdf.service.ts:179`). `heatingOf` fällt dann auf `stored.percent` zurück. Der neue Test (`statement-pdf.pg.test.ts:390-404`) schlägt ohne die Änderung fehl, nach Lesen: Die Position hat `periodShare` 0 und `invoiceParts: null`, also stünde «0.00 % der Heizkosten» statt 50 %. Der Fix ist minimal.
- **7e2c765, Kommentar (C-2 aus Runde 2):** `pdf.service.ts:723` beschreibt jetzt beide Fälle von `ownProfileDays`.
- **Regel 5:** Die Satzkorrektur «Ohne Heizprofil werden auch die Heizkosten nach Tagen verteilt» ändert keinen Inhalt.
- **`implementation_plan.md`:** Die Punkte sind passend abgehakt. «Pull request» ist offen, richtig so.
- **Nicht verwandte Änderungen:** Die Dateien in `docs/reviews/` sind Berichte der Reviews dieses Tasks, gehören also dazu. Sonst habe ich in 7e2c765 nichts Fremdes gefunden.

## Nicht bestätigt

- Backend `bun run test` auf 0888c42 (806 bestanden, Abdeckung 94.4 %): vom Aufrufer gemeldet. Laut Auftrag nicht erneut ausgeführt.
- `bun run lint`, `bun run check` und `bun run type-check` auf 0888c42 und 7e2c765: vom Aufrufer gemeldet.
- `bunx vitest run` auf 0888c42 (einmal 1 Fehler, beim zweiten Lauf 157/157): vom Aufrufer gemeldet. Welcher Test fehlschlug, ist nicht bekannt; ich habe ihn nicht nachgestellt.
- `statement-pdf.pg.test.ts` auf 7e2c765 (39 bestanden, neuer Test zuerst rot): vom Aufrufer gemeldet. Das Rot habe ich nur durch Lesen bestätigt.
- Ob C-1 genau 0.52 ergibt, habe ich nicht ausgeführt. Der Wert hängt vom Profil im Test ab. Dass der Lauf-Anteil statt #71 greift, folgt aus `shareOfGroup` Z. 217-221.
