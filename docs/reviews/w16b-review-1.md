# Code-Review W16b, Runde 1 (232adab3)

Keine Blocker, keine Major.

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | tests/e2e/tasks/accessibility.ts:124 | `restoreDraft` hakt im Statement-Wizard weiterhin `firstGenerateBuilding` an, nicht `example.building`. Seit dem Fix gibt es zwar sicher ein Gebäude, aber das erste der Liste kann das eines parallelen Szenarios sein, das dessen cleanUp vor dem Reload löscht (dieselbe Gefahr, die die Kommentare in Z. 147 und 392 nennen). Dann käme statt «wiederhergestellt» der Hinweis zu verworfenen Angaben. Das ist ein Rest-Flake derselben Zeilen und keine Regression. |
| C-2 | Nit | backend/src/services/config.service.ts:201-206 | Das `select` dient jetzt nur noch dem Audit-Wert `before`, läuft aber bei jedem Schlüssel. Der Kommentar «Check if config exists» ist veraltet. Er wäre nur für `management_fee_pct` nötig (ponytail: eine Abfrage weniger, die Absicht klarer). |
| C-3 | Nit | backend/src/__tests__/config.pg.test.ts:27-36 | Der Test ist ein Wettlauf und deshalb nicht deterministisch rot ohne den Fix. Laut Aufrufer war er mit angewärmtem Pool rot. Beim Lesen ist das plausibel (Pool 20 ≥ 10, select-then-insert pro Verbindung), aber ein grüner Zufallslauf auf der Basis bleibt möglich. Für einen Race-Fix ist das vertretbar. |
| C-4 | Nit | docs/design/offene-punkte.md | Die O-37-Zeile gibt es nur auf dem Branch von #417. Beim geplanten Merge von main in #417 muss sie dort von Hand entfernt werden, sonst bleibt sie neben dem Archiveintrag stehen (Plan, letzter Punkt). |

## Geprüft und in Ordnung

- O-36: Das Upsert mit `onConflictDoUpdate` auf `configuration.key` setzt `value` und `updatedAt` wie der frühere Update-Zweig. Beim Insert bleibt `updatedAt` auf dem Default, wie vorher. Kein Aufrufer hat sich auf Insert oder Update verlassen: `existing` wird nur noch für `before` gelesen.
- Audit von `management_fee_pct`: `before` wird weiterhin vor dem Schreiben gelesen (Z. 209–212). In `setMultipleConfig` geschieht das in derselben Transaktion. Bei zwei gleichzeitigen ersten Änderungen könnten beide Schreiber den Default lesen und je einen Eintrag protokollieren. Das war vorher genauso (bzw. der zweite brach mit 500 ab) und ist daher keine Regression.
- O-37: `contract-new` (Pfad mit `{tenant}`) wurde schon geseedet, die Ergänzung wirkt also nur für `statement-generate`. Die Zustände sind bereits in `screens.json`, `accessibility.feature` und `sprachen-bildschirme.feature`. Es gibt keine neuen Texte oder UI-Zustände. `No scenario` ist begründet (ein Test-Race, ein Verhalten ändert sich für den Nutzer nicht sichtbar).
- Commit-Betreff: 39 Zeichen, Conventional Commits. Der Plan und das Archiv sind nachgeführt, die O-36-Zeile ist entfernt. Es gibt keine fremden Änderungen im Diff.

## Nicht bestätigt

- `bun run lint`, `bun run check`, Backend-`bun run type-check`, Backend `bun run test` (955), `open-work.test.ts`, die E2E-Läufe (`draft-(dropped|discard-dialog)` vorher rot und nachher grün, 8 Draft-Zeilen grün) und das Rot des pg-Tests mit angewärmtem Pool: vom Aufrufer gemeldet, von mir nicht wiederholt (Backend und E2E laut Auftrag nicht gestartet).
- Die Ursache von O-37 (0 Gebäude in der E2E-Datenbank) kenne ich nur aus der Beschreibung des Aufrufers. Den Mechanismus (`startDraft` hakt das erste Gebäude an, `seedFor` hat vorher nichts geseedet) habe ich im Code bestätigt.
