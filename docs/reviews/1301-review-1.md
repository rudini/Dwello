# Code-Review #1301 «Fläche und Zimmeranzahl ab einem Tag», Runde 1

Gegenstand: `git diff origin/main 83ecc9e` (a90a731 @wip-Szenario, 83ecc9e Umsetzung), Worktree `review-1301-code`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | `backend/src/services/pdf.service.ts:225` (Wert aus `statement.service.ts:175`, `:281` `apartments.area`) | Der Kopf des Abrechnungs-PDFs druckt die heutige Fläche der Wohnung. Bei einer Abrechnung, deren Tage vor dem Tag der Änderung liegen, widerspricht er dem gedruckten Bruch: «Wohnung 1.02, 140.00 m²» neben «70.00 / 210.00 m²». |
| C-2 | Minor | `backend/src/services/apartment.service.ts:268-270` | Nur ein Speichern mit `sizeFrom` prüft V-8. Wer «Aufgehoben ab» auf einen Tag vor einer erfassten Änderung oder genau auf ihren Tag setzt, wird nicht abgelehnt (z. B. Änderung ab 01.08.2025, danach aufgehoben ab 01.07.2025). Die Detailseite zeigt dann eine Änderung nach «Aufgehoben ab», also genau den Zustand, den V-8 ausschliessen soll. Es gibt keinen Test dazu. |
| C-3 | Minor | `src/lib/server/apartment.ts:128`, `backend/src/routes/apartments.ts:165` | Kein Test deckt die Fehlerzweige des Entfernens ab. Weder das `fail(…, { sizeChangeError })` des BFF noch die 404-Antwort von `DELETE /apartments/:id/size-change` ist getestet. `apartment.test.ts` prüft nur den Erfolg. Damit fehlt auch der Test der unteren Schicht für den Zustand «No scenario» (nur ein Fehler zwischen Serverteilen). |
| C-4 | Minor | `src/routes/apartments/[id]/SizeChanges.svelte:20-22` | Kopie von `dayAfter` aus `src/lib/swiss-date.ts:27`. Gleicher Ausdruck, `Date.parse(…) + 86_400_000`. |
| C-5 | Minor | `tests/contracts/statement.json:83` | Das neue Feld `changed` im Vertrag wird nie gegen die echte API geprüft. Die Abrechnung in `api-contracts.pg.test.ts` hat keine Zeiträume, und `drift` gibt bei `segments: null` `[]` zurück (`api-contracts.pg.test.ts:43`). `statement-mapping.test.ts` liest `changed` also aus einem Vertrag, den nichts bestätigt. Bei `discontinued` (#1284) besteht dieselbe Lücke schon; der Diff erweitert sie. |

## C-1: Der Kopf des PDFs zeigt die Fläche von heute

**Warum falsch.** Seit #1301 hat eine Wohnung je Tag ihre eigene Fläche. Der Verteilschlüssel und `keyValues` rechnen mit der Fläche des Tages (`countingWith`, `keyValuesOf(…, rentalStart)`). Der Kopf des PDFs liest dagegen `apartments.area` (`getStatement` → `apartmentOf` in `statement-pdf.service.ts:50-53` → `pdf.service.ts:225`), und das ist immer der letzte Wert.

Ein Beispiel aus dem Testgebäude: Marc Huber, Wohnung 1.02, 140 m² ab 01.07.2025. Seine Abrechnung 2024 wird nach der Änderung erstellt oder berichtigt. Der Kopf zeigt «Wohnung 1.02, 1. OG, 140.00 m²». Die Position druckt aber «Ihr Anteil 70.00 / 210.00 m²», denn `key_values` wurde am 01.01.2024 mit 70 gespeichert. Für 2024 erklärt keine Einleitung den Unterschied.

Vor #1301 entstand der Widerspruch nur nach einer Korrektur ohne Tag. Jetzt entsteht er bei jeder Abrechnung einer Periode vor der Änderung, also im Normalfall der Funktion. V-5 der Fachreview verlangt, dass das PDF die Werte zeigt, mit denen es gerechnet hat. Liest das PDF sie bei jedem neuen Erstellen aus der Wohnung, verletzt es V-5.

**Wie zeigen.** In `apartment-size-from-day.pg.test.ts` die Abrechnung `statementOf(tenantB, 2024)` erzeugen und ihr PDF rendern. Der Text enthält dann «1.02, … 140.00 m²» und zugleich «70.00 / 210.00 m²». Oder in `statement-pdf-render.test.ts` eine Abrechnung mit `apartment.area: '140.00'` und `keyValues.area: [70, 210]`: der Kopf übernimmt 140.

**Lösungsweg.** Den Kopf mit der Fläche am ersten abgerechneten Tag drucken (`key_values.area[0]`, gespeichert wie V-5 es will), ältere Abrechnungen ohne `key_values` wie bisher. Liegt eine Änderung in den abgerechneten Tagen, nennt die Einleitung beide Werte. Ob dann die Fläche am ersten oder am letzten Tag in den Kopf gehört, entscheidet `fach-reviewer`.

## Nicht bestätigt

- Vom Aufrufer gemeldet, von mir nicht ausgeführt: `bun run lint`, `bun run check`, `bun run fitness`, `cd backend && bun run type-check`; `bunx vitest run` (221 Dateien, 4666 Tests); backend `apartment-size-from-day.pg.test.ts`, `apartment-discontinued.pg.test.ts` mit den Tests für Anteile, Berechnung und Abrechnung, `api-contracts.pg.test.ts`, `statement-pdf-render.test.ts`; E2E `apartment-size-from-day.feature` (chromium und api); axe- und Sprachzeilen von `apartment-detail-resized`, `apartment-edit`, `apartment-detail`; Prettier; die Commit-Hooks. Ebenso vom Aufrufer gemeldet: jeder neue Test wurde rot gesehen.
- Die volle Backend-Suite (`bun run test`) ist nicht gelaufen (Aufrufer).
- `tests/e2e/fixtures/screens.ts:147-150` legt Gebäude «Umbauhof» und Wohnung «U.01» für jede Bildschirmzeile an, die `seedFor` mit Daten befüllt, nicht nur für `apartment-detail-resized`. Gelaufen sind nur drei Zeilen. Ob die übrigen Zeilen von `accessibility.feature` und `sprachen-bildschirme.feature` weiter bestehen, ist offen: Gebäudelisten, Vorschau, «buildings-billed» und die Sprachprüfung mit dem Namen «Umbauhof» in fr/it/en. Gelesen habe ich nur den Fixture-Code.
- Wohin der Fokus geht, wenn die einzige Änderung entfernt ist: `SizeChanges` wird ausgehängt, mit dem Knopf, der den Dialog geöffnet hat. Wie `src/lib/ui/Dialog.svelte` den Fokus zurückgibt, habe ich nicht gelesen.
- Ob die Issues #1327 (TODO-Marker in `src/routes/apartments/[id]/edit/+page.svelte:42`) und #1328 existieren und ihre Labels stimmen: nicht auf GitHub geprüft. Das prüfen `open-work.test.ts` und CI.

Geprüft: Teile an den Tagen der Änderung, nur in den Mietstagen (`prorating.service.ts:338-342`). Die Werte des Tages, an dem ein Teil beginnt, und am ersten abgerechneten Tag, auch für eine Periode vor einer späteren Änderung (`sizeOn`, älteste zuerst). `changed` wird im Teil gespeichert (V-5). `segmentNote` steht einmal (V-4). Die Ablehnungen V-3, V-8 und «zu früh» kommen als Codes mit Vertrag. Die Korrektur ohne Tag behält die früheren Werte (V-2). Das Entfernen stellt die früheren Werte wieder her (V-1). Alle neuen Texte stehen in allen vier `messages/*.json` und `pdf-texts/*.ts`, wortgleich mit der Fachreview, fr mit U+00A0. Der Zwischentext `merge_note` ist überall entfernt. Die Zeilen in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature` sind da. Die Screenplay-Schichten der neuen Steps, Tasks und Fragen halten. Kein bestehender Step prüft weniger. Docs (`api-specification.md`, `data-model.md`) stimmen. ponytail-review: ausser C-4 nichts zu kürzen.
