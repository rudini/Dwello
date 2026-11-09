# Code-Review #1328, Slice 3, Runde 1

Worktree: `review-1328-code3` (59f129e), Bereich `51a6205..59f129e`.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| – | – | – | keine Befunde |

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: lint, check, fitness, backend type-check, `bunx vitest run --changed origin/main` (1445) samt i18n/open-work/statements-i18n, backend `bun test` apartment*.pg, building*.pg, statement-outdated-values, statement-invoices, cost-reconciliation, api-contracts (269), E2E chromium+api für statement-detail, reports, dashboard, apartment-detail, statement-generate (359 grün, 1 rot: dashboard «Ein Entwurf mit geändertem Übertrag ist nicht aktuell», nach der Änderung an Zeile 161 grün wiederholt).
- Rot ohne die Änderung nur durch Lesen beurteilt: der pg-Test «meldet eine danach gelöschte leere Wohnung des Gebäudes» und das Szenario «Entwurf weist auf eine danach gelöschte Wohnung hin» schlagen auf 51a6205 fehl, weil `max(apartments.updated_at)` nach dem Löschen nur Zeiten vor dem Entwurf kennt; das Kostenabstimmungs-Szenario hält Verhalten aus Slice 1 fest (Commit-Text nennt es).
- dashboard.feature:161: der Aufrufer meldet die Freigabe als offen; der Issue-Text #1328 «Decided (product owner)» enthält sie inzwischen («Spec change approved (#1328): `dashboard.feature:161` … checks «der Übertrag aus einer früheren Abrechnung» … (replaces an earlier «no»)»). Die Zeile prüft weiter per Teiltext den Übertrag-Grund des festen Aufgabentexts, gleich streng wie vorher; `Spec change approved: #1328` im Pull-Request-Text noch nicht prüfbar.
- fr/it/en der drei geänderten Texte sind in keinem Test festgehalten (nur de in `overview.test.ts`, `reports-pages.dom.test.ts`); sie stimmen Zeichen für Zeichen mit `docs/reviews/1328-fachreview-1.md` und `-2.md` überein (per Skript verglichen).
- Fachreview 1328-2 V-1 (Löschen einer Wohnung nur stillschweigend in «geändert») wartet auf den Product Owner; nicht Gegenstand dieses Reviews.

Geprüft: `deleteApartment` setzt `buildings.updated_at` in derselben Transaktion und nur nach dem Löschen (einziger Löschpfad für Wohnungen); `apartmentsChangedAt` nimmt das Maximum aus Wohnungen und Gebäude, ein Gebäude ohne Wohnung fällt auf dessen Zeit zurück, eine Gebäudeänderung kostet nur die Neuberechnung, die entscheidet (`valuesChanged: touched && !!check?.changes`); C-7 aus Runde 2 behoben (Status 200 des Schlüssel-PUT geprüft); Texte in allen vier `messages/*.json` nach Entscheid und Fachreview; Szenarien ohne UI-Wörter, Schritte rufen nur Fixtures/Fragen; keine neuen Bildschirme oder Zustände; nichts Fremdes im Diff.
