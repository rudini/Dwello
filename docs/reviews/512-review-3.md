# Code-Review #512, Runde 3 (a86fcd8..a676075, ohne docs/reviews, implementation_plan.md, docs/design/personas)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-5 | Minor | backend/src/services/period-types.ts:32 | Bei einem kurzen Zwischenwechsel bleibt zwar der frühere Typ gespeichert, aber der Tag springt auf heute statt auf den Tag des ursprünglichen Wechsels. Ein Beispiel: am 28.10.2026 von «Kalenderjahr» auf «Juli – Juni», am 01.03.2027 auf «November – Oktober». Gespeichert wird dann `2027-03-01:calendar`, und `switched` wird 2027-01-01 statt 2026-01-01. Das Kalenderjahr 2026 endete nach dem Wechsel, gilt aber trotzdem als ganze Periode des früheren Typs. Fällig wäre nach dem Entscheid der Teil 01.01.–31.10.2026 nach «November – Oktober». Das betrifft nur den Wechsel auf einen dritten Typ, wenn in der Zwischenzeit eine Periode des früheren Typs endete. Behebung: `brief ? stored : \`${today}:${before}\``. Diesen Pfad deckt kein Test ab. |
| C-6 | Minor | backend/src/services/period-types.ts:15 | `month` ist eine Kopie des Helfers, der in `accounting-period.ts:15` bleibt. Den Helfer exportieren und dort importieren. |

Geschlossen: C-4.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt:
  - `cd backend && bun run test` (1664 pass, Abdeckung 96,6 %)
  - der neue pg-Test «nimmt einen Wechsel an einem späteren Tag zurück, wenn in der Zwischenzeit keine Periode endete» vor dem Fix rot
  - `bun run lint`, Backend type-check, Prettier auf der neuen Datei
  - Commit-Hooks (fallow, deepcheck, testcheck)
- Durch Lesen nachgerechnet:
  - Der neue pg-Test ist auf a86fcd8 rot, für jedes heutige Datum. Dort wird `<heute>:july-june` gespeichert, und `switched` wird der Beginn der laufenden Juli-Juni-Periode. Das Jahr 2025 wird dann ab 2025-07-01 geschnitten.
  - Mit dem Fix bleibt `calendar` gespeichert. `earlierType` übergeht den Eintrag (`from === type`), und es gilt die Regel nach den Abrechnungen des Gebäudes.
  - Der Rückwechsel am selben Tag verhält sich wie bisher (`on === today` ergibt `brief`).
- Weiterhin wird nur ein Wechsel gespeichert. Endete nach einem echten Wechsel eine Periode und folgt danach ein zweiter Wechsel, so überschreibt dieser den ersten. Alle älteren Perioden folgen dann dem Zwischentyp. Das ergibt sich aus dem Wortlaut des Entscheids («the day of the change and the earlier type») und stand schon vor dieser Runde so. Ob das gewollt ist, habe ich nicht entschieden.
- Der Weg über `DELETE /config/accounting_period` speichert weiterhin keinen Wechsel (wie in Runde 2). Die UI kann ihn nicht auslösen.

Geprüft: `changeOnSave`/`storePeriodChange` (Grenze «keine Periode beendet» über `lastCompletedPeriod(before, on)` gleich `lastCompletedPeriod(before, today)`), die verschobenen Typen und ihre Re-Exporte (alle Importeure kompilieren über `accounting-period`), keine geänderte API-Form, keine neuen Texte, nichts ausserhalb der Anforderung.
