# Code-Review W9d, Runde 1 (f900e5b..3eee2a6)

Worktree: `review-w9d-code` (detached, 3eee2a6). Gelesen: alle 8 Dateien im Diff, dazu `backend/src/services/statement-pdf.service.ts` (`generateStatementPdf`, `getStatementPdf`, `changeStatementStatus`), `pdf.service.ts` (Spalten, Kopfblock), die verwendeten E2E-Steps (`statements.steps.ts:137`, `tenant-form.steps.ts:36`, `statement-detail.steps.ts:241/253`) und `.claude/skills/ponytail-review/SKILL.md`.

Ergebnis: kein Blocker, kein Major.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Nit | docs/nebenkostenabrechnung-anforderungen.md:60 | Dieselbe Zelle sagt jetzt «… rechnet mit allen Einheiten der Liegenschaft …» und gleich danach «Einheiten total des Gebäudes»; im Umsetzungstext entweder beides «Gebäude» oder den ersten Teil als Praxis-/Gesetzeskontext stehen lassen, aber nicht gemischt im selben Satzpaar. |
| C-2 | Nit | implementation_plan.md:10, backend/src/__tests__/statement-pdf-render.test.ts:276-285 | Die fr/it/en-Fälle von «sagt auf %s die Worte der App» sind gegen den Basis-Commit schon grün (fr/it/en in `pdf.service.ts` unverändert); «seen red» kann nur durch eine Mutation gelten. Sie halten den Ist-Zustand fest, was hier gewollt ist; die Planzeile sollte das so sagen. |

Ponytail-Review: Lean already. Ship. (Zwei Wortlaute in `pdf.service.ts`, kein neuer Code; die Tests verwenden die vorhandenen Helfer `textOf`, `readPdf`, `sendJson`; das Szenario #351 verwendet nur vorhandene Steps.)

## Bestätigt

- **#351, Entwurf:** `getStatementPdf` (`statement-pdf.service.ts:302`) erzeugt das PDF bei `status === 'draft'` immer neu, `generateStatementPdf` nimmt ohne Sprachparameter die Sprache des Mieters (`:257`). Der pg-Test «folgt der geänderten Sprache des Mieters, auch am selben Tag» (`statement-pdf.pg.test.ts:704`) erzeugt zuerst auf Deutsch (Mieter `de`), wechselt am selben Tag auf `fr` und erwartet «Décompte des charges»; mit der alten Bedingung `if (!result.pdfBlob)` liefert er das gespeicherte deutsche PDF und fällt. Die Sprache wird vor dem `expect` zurückgesetzt, wie bei den Nachbartests.
- **#351, versendet:** `changeStatementStatus` (`:311-317`) erzeugt das PDF beim Versand mit der dann gültigen Sprache; Test «versendet das PDF in der Sprache des Mieters beim Versand» (`:714`) prüft das über die echte Route `PUT /status` und setzt Status und Sprache zurück.
- **#351, Szenario** «PDF eines Entwurfs folgt der geänderten Sprache des Mieters» (`statement-detail.feature:448`): ohne `@wip`, nur vorhandene Steps (Seed über die API: PDF erzeugen, dann Sprache ändern, dann herunterladen), keine Screenplay-Verletzung, Feature-Sprache fachlich («die Korrespondenz an … ist auf …»). Der Kommentar nennt die Ausgangssprache Deutsch (Fach-Review V-4 übernommen).
- **#249, Deutsch:** `building: 'Gebäude'`, `totalAmount`, `sharesNote`, `sharesNoteFuel` sagen «Kosten des Gebäudes»; Wohnungsanteil-Satz nach V-1. In `backend/src` steht «Liegenschaft» in keinem PDF-Text mehr (grep: nur LLM-Prompt und Testkommentare ausserhalb des Diffs). Render-Tests (`statement-pdf-render.test.ts:260, 270-275`) fallen mit dem alten Text (sie verlangen «Gebäude Seepark», «Kosten des Gebäudes: …» und kein «Liegenschaft»).
- **#249, fr/it/en:** «Immeuble/Coûts de l’immeuble», «Immobile/Costi immobile», «Building/Building costs» stimmen mit `docs/design/i18n-begriffe.md` überein; durch Render-Tests festgehalten (C-2).
- **Szenario** «Das PDF erklärt die Verteilung und den Heizölverbrauch»: neue Zeilen «steht im PDF "Kosten des Gebäudes"» und «steht im PDF nicht "Liegenschaft"», ohne `@wip`; mit dem alten Text fallen beide.
- **Spaltenbreite:** Kopf «Kosten des Gebäudes» in der 62-pt-Spalte (`pdf.service.ts:597`) bricht wie bisher «Coûts de l’immeuble» um; `tableHeader` rechnet die Höhe mit `heightOfString`, kein Überlauf.
- **Konventionen:** keine UI-Texte, also keine `messages/*.json`-Änderung nötig; keine neue Ansicht (kein a11y-Eintrag nötig); keine API-Antwort geändert (keine Vertragsänderung); keine fachfremden Änderungen im Diff. «Kosten des Gebäudes» fehlt im Glossar, vom Product Owner in #249 entschieden, Glossarpflege als #374 im Plan unter «Blocked on me».
- **Docs:** `i18n-begriffe.md:62` und die PDF-Umsetzungsspalten in `nebenkostenabrechnung-anforderungen.md` folgen (V-3 umgesetzt; C-1 als Nit).

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `cd backend && bun run test` (821 pass, Coverage OK), `bunx vitest run src/__tests__/open-work.test.ts src/__tests__/i18n.test.ts`, E2E `statement-detail.feature` (57 passed): vom Aufrufer gemeldet, nicht wiederholt (Backend-Tests und E2E laut Auftrag nicht gestartet).
- Rot-Beobachtung des E2E-Szenarios #351 und des pg-Entwurfstests mit der alten Bedingung: vom Aufrufer gemeldet; nach Lesen von `getStatementPdf` plausibel, nicht ausgeführt.
- Ob der pg-Test für das versendete PDF ohne die Erzeugung in `changeStatementStatus` fällt: nicht ausgeführt; nach dem Code würde `getStatementPdf` dann das gespeicherte deutsche PDF liefern, sofern der Versand es nicht verwirft (`datedToday` bei gleichem Tag lässt es stehen), also rot.
- Gerendertes Aussehen des PDF (Umbruch, Layout): nur aus dem Code beurteilt; gehört zum daten-pruefer.
