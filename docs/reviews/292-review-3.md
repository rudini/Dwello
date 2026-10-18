# Code-Review #292, Runde 3 (Abschluss, Delta b1ef918f..2cb38d4d)

Worktree: `/tmp/claude-0/-home-user-Dwello/885a1125-b6db-5975-8e5c-ec01f947f577/scratchpad/review-292-close` (2cb38d4d). Ich habe alle 10 geänderten Dateien des Deltas gelesen. Dazu gelesen: `tests/e2e/fixtures/backend.ts:75-84` (`invoice()` setzt standardmässig «Per Area (m²)»), `backend/src/routes/invoices.ts:57` (`distributionKeyId: t.Optional(t.Nullable(t.String()))`) und `backend/src/services/invoice.service.ts:236-241, 312-342` (`updateInvoice` mit `applyCategory`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | tests/e2e/questions/invoice-detail.ts:7-8 | Der Import `distributionKeyRow` steht vor `distributionKey`. Die übrige Liste ist alphabetisch sortiert |
| C-2 | Nit | tests/e2e/steps/invoice-detail.steps.ts:95 | Der Kommentar sagt «for an invoice nobody pays». Eine nicht umlagefähige Rechnung zahlt aber der Eigentümer. Genauer wäre «an invoice not distributed to the tenants» |
| C-3 | Nit | docs/archive/implementation-plan-verlauf.md:1458 | Der Eintrag verweist auf `docs/reviews/292-review-3.md`. Die Datei liegt im Worktree noch nicht vor, dieser Bericht steht im Scratchpad. Vor dem Push übernehmen |

Keine Blocker und keine Majors.

Ponytail-review: Das Delta hat eine Seed-Funktion, eine Question, ein Target und zwei Schritte, alle einzeilig und alle benutzt. Dazu kommen ein `data-testid` und ein Kommentar. Nichts ist unbenutzt. net: +17 Zeilen Testcode, 0 Zeilen App-Logik.

## Bestätigt (Anforderung → Code und Test)

- **C-1 aus Runde 2 (Major) ist geschlossen.** Meine Annahme aus Runde 2 war falsch: Die Seed-Rechnung bekommt in `backend.ts:84` «Per Area (m²)». Ohne die neue Vorbedingung hätte der Schritt also nichts gezeigt. Jetzt gilt:
  - Die Vorbedingung `invoiceWithoutKey` (backend.ts:486-488) setzt `distributionKeyId: null` per PUT. Die Route lässt `null` zu.
  - `updateInvoice` ruft `applyCategory` mit der bestehenden Kategorie «Reparaturen» auf. Damit bleibt `isValidUtilityCost` auf `false`, und die Rechnung bleibt nicht umlagefähig.
  - Der Zustand «nicht umlagefähig, ohne Schlüssel» entsteht also wirklich.
- **Rot beim Lesen geprüft:**
  - Ohne `{#if showsKey}` erscheint `invoice-key-row` mit «Keiner – …». `Count` liefert dann 1 statt 0, der Schritt schlägt fehl.
  - Mit dem Guard liefert `Count` 0. Das deckt sich mit dem Rot und Grün, das der Aufrufer gemeldet hat.
- **Screenplay:**
  - Der Then-Schritt fragt nur die Question `distributionKeyRows` ab. Die Question nutzt nur das Target, das Target nutzt `getByTestId`. Der Given-Schritt ruft nur den `seed` auf, wie die bestehenden Vorbedingungen (`invoiceAllocable` u. a.).
  - Die Question liefert eine Anzahl, keinen Ja/Nein-Wert.
  - Die Negativprüfung steht nach positiven Ankern («ist die Rechnung nicht umlagefähig», «nennt … als Grund …»).
- **Feature-Sprache:** Beide neuen Schritte sagen, was der Verwalter will, und nennen kein UI-Element. Die Begriffe «Verteilschlüssel» und «Rechnung» kommen aus `UBIQUITOUS_LANGUAGE.md`.
- **`data-testid` `invoice-key-row`:** in kebab-case und mit Komponentenkontext, wie `invoice-distribution-key`.
- **C-2 und C-3 aus Runde 2:**
  - Der Kommentar in CategorizationPanel.svelte:25-26 hält die Grenze jetzt fest: Ein gewählter Schlüssel bleibt, weil er wieder gilt, sobald die Rechnung zählt.
  - «next to the reason» ist entfernt.
  - Das Verhalten ist unverändert, so wie es in der Triage angenommen wurde.
- **C-4 aus Runde 2:** In der Dateiliste des Archiveintrags steht jetzt `help-page.dom`.
- **Plan und Archiv:**
  - Die Session ist aus `implementation_plan.md` entfernt und ans Ende von `docs/archive/implementation-plan-verlauf.md` angefügt.
  - Offen ist nur noch der Punkt Pull Request.
  - `open-work.test.ts` ist grün (selbst ausgeführt).
- **Workflow-Notizen** (`docs/reviews/workflow-notes-issue-292.md`): vier Zeilen im Tabellenformat «Rule / What happened / Proposed change». Die Datei enthält nur Text, kein Verhalten.
- **Kein neuer Text und kein neuer Bildschirm:** Am Svelte-Code ändern sich nur ein Attribut und ein Kommentar. `messages/*.json` und `tests/a11y/screens.json` müssen deshalb nicht geändert werden.
- **Nichts Fremdes im Delta:** Alle Änderungen gehören zu den Befunden aus Runde 2 oder zum Abschluss der Session.

## Nicht bestätigt

- Selbst ausgeführt: `bunx vitest run src/__tests__/invoice-pages.dom.test.ts src/__tests__/open-work.test.ts` (2 Dateien, 85 Tests bestanden).
- Vom Aufrufer gemeldet, nicht wiederholt:
  - `bun run lint`
  - E2E chromium für `invoice-detail.feature`, dazu die axe- und Sprachzeilen von invoice-detail (21 bestanden)
  - Rot des neuen Schritts bei entferntem Guard (die Seite zeigte «Keiner – die Kosten werden gleichmässig pro Wohnung verteilt»)
- E2E habe ich laut Auftrag nicht ausgeführt. Rot und Grün habe ich nur durch Lesen geprüft, siehe oben.
- `bun run check` und `cd backend && bun run type-check` meldet der Aufrufer für 2cb38d4d nicht. Das Delta ändert keine Typen. `invoiceWithoutKey` übergibt ein Objektliteral an `put`, wie die Nachbarfunktionen auch.
