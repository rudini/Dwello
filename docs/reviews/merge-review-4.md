# Re-Review Slice «merge-2», Runde 3 (Fix bbfe59c)

Worktree `review-merge-4`, detached auf `bbfe59c`. Delta `git diff 9b56c86 bbfe59c` vollständig gelesen (7 Dateien, Commits `40fad43`, `bbfe59c`). Ausserdem gelesen: `docs/reviews/merge-review-3.md`, `src/routes/dashboard/+page.server.ts:87-127` (`later`, `expired`), `src/routes/contracts/[id]/+page.server.ts:58-88` (`successorAfter`, `nextStepsDue`, `fixedTermCheckDue`), der ganze `backend/src/__tests__/old-address.pg.test.ts`, die Grundlagen von `statement-detail.feature:20-30` und `statement-generate.feature:5-16`, `dashboard.feature:168-188` sowie `git diff 926da71 9b56c86 -- tests/e2e/features/`.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | erledigt | `backend/src/services/old-address.ts:18-20` | Bleibt behoben: Ohne späteren Mietvertrag, ohne Kündigung und ohne «Mieter ist ausgezogen» gibt es keine Warnung (pg-Test, `dashboard.feature:180-188`) |
| C-2 | erledigt | `docs/archive/implementation-plan-verlauf.md:890` | Die Leerzeile vor der Session ist ergänzt |
| C-3 | Nit, offen | `backend/migrations/0015_tenant_country.sql` | Kommt laut Aufrufer in den PR-Text; nicht im Delta |
| C-4 | erledigt | `backend/src/services/old-address.ts:18-20` | Die Bedingung ist jetzt das genaue Gegenstück zu A-6: `terminated or moved_out or` ein Mietvertrag derselben Wohnung mit `start_date > end_date`. Das ist dieselbe Regel wie `later` (`dashboard/+page.server.ts:87-88`) und `successorAfter` (`contracts/[id]/+page.server.ts:61-68`), also auch strikt `>`, gleiche Wohnung, jeder Mieter. Die beiden #114-Szenarien stehen wieder genau wie auf `926da71` |
| C-5 | erledigt | `docs/anforderungen-vertragsende.md:173` | Der «Umgesetzt»-Absatz nennt die Regel von A-6 mit allen drei Fällen. Der entschiedene Satz von #114 bleibt unverändert |
| C-6 | Nit | `docs/anforderungen-vertragsende.md:173` | «vorher läuft der Mietvertrag vielleicht unbefristet weiter»: Gemeint ist «sonst» (keiner der drei Fälle), nicht ein Zeitpunkt. Der Code-Kommentar in `old-address.ts:11` hat dieselbe Formulierung («before, …») |
| C-7 | Nit | `backend/src/__tests__/old-address.pg.test.ts:104-108` | Schlägt eine der inneren `expect` in `oldAddress()` fehl (Liste und Abrechnung weichen ab), läuft das Aufräumen nicht. Dann bleiben `later` und `terminated: false` stehen, und der nächste Test scheitert als Folgefehler. Das trifft nur den Fehlerfall, die Hauptprüfung läuft wie verlangt erst nach dem Aufräumen |

ponytail-review: Der Fix ist eine `exists`-Bedingung, die in derselben Form wie bei A-6 geschrieben ist, dazu ein Test. Die Szenario-Zeilen sind genau zurückgenommen, nichts Ungenutztes bleibt. `createTenant` und `deleteTenant` werden nur im neuen Test verwendet und sind beide nötig. Schon schlank genug.

Keine Blocker oder Majors offen.

## Bestätigt

- **Neuer pg-Test (Wohnung wieder vermietet):** Er setzt `terminated: false` und legt einen Mietvertrag einer anderen Mieterin in derselben Wohnung an, Beginn `2024-05-01`, also nach dem Ende am `2024-03-31`. Auf `9b56c86` ergibt das SQL `false` (weder `terminated` noch `moved_out`), der Test ist also rot ohne den Fix. Der spätere Mietvertrag gehört einer anderen Mieterin. Die Klausel `not exists … r.tenant_id = c.tenant_id` greift deshalb nicht, und der Test prüft genau den neuen Zweig. Danach setzt er `terminated: true` zurück, damit «warnt nicht, solange der Mietvertrag läuft» weiter mit `true` beginnt. `deleteContract(…, true)` und `deleteTenant` räumen die Datensätze auf.
- **#114-Szenarien:** `statement-detail.feature:60-61` und `statement-generate.feature:122-123` sind Zeile für Zeile wieder wie auf `926da71` (verglichen mit `git diff 926da71 9b56c86 -- tests/e2e/features/`). In ihrer Grundlage mietet Marc Huber 3.01 seit `2024-05-01`. Damit zeigen sie den Fall C-4 in der Vorschau und auf der Detailseite. Auf `9b56c86` wären sie ohne die Zeile mit der Kündigung rot gewesen, durch Lesen des SQL erschlossen. Damit sind dieselben Szenarien so streng wie vor dem Merge.
- **`dashboard.feature`:** Das Szenario bei `:170-177` behält die Kündigung, denn Bruno Meier hat in 1.02 keinen Nachmieter. Das Szenario `:180-188` bleibt gültig, denn 1.02 hat dort keinen späteren Mietvertrag.
- **Andere Stellen:** Wer `oldAddress` liest (Mietvertrag, Liste, Abrechnung, Übersicht, Vorschau), bekommt nur einen anderen Wert. Es gibt keinen neuen Text, keinen neuen Bildschirm und keinen geänderten API-Vertrag. `nextStepsDue` setzt `terminated` weiterhin voraus. Die Detailseite eines nicht gekündigten, wieder vermieteten Mietvertrags zeigt deshalb keinen Schritt «Neue Adresse». Das war schon vor diesem Slice so und kommt nicht durch das Delta.
- **Unbeteiligtes:** `docs/reviews/merge-review-3.md` ist der Bericht aus Runde 2. Der Eintrag im Plan-Archiv betrifft diesen Slice. Sonst ist nichts dazugekommen.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht neu ausgeführt: Backend `bun test` (794 bestanden, `old-address.pg.test.ts` 7), `bun run lint`, `bun run check`, E2E chromium+api `statement-detail`, `statement-generate`, `dashboard`, `contract-detail` (177 bestanden).
- Backend `bun run type-check` auf `bbfe59c` meldet der Aufrufer nicht, und ich habe es nicht ausgeführt. Die Typen des neuen Tests (`createTenant({ firstName, lastName })`, `createContract(...)`) habe ich nur an `tenant.service.ts:262` und an den bestehenden Aufrufen im selben Test geprüft.
- Dass der neue pg-Test und die beiden Szenarien auf `9b56c86` rot sind, habe ich aus dem SQL geschlossen und nicht mit einem Lauf gezeigt.
- Die Issues #114 und #115 habe ich nicht gelesen. Die Regel für «befristet mit Nachmieter» habe ich aus `docs/anforderungen-vertragsende.md:173` und dem A-6-Code abgeleitet.
