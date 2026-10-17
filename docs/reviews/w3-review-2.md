# Slice-Review 2 (Abschlussrunde, nur Delta): #250, #254

Gegenstand: Worktree `review-w3-code2` (detached auf 78ee24c), `git diff d51f85e 78ee24c`, Commits c479062, c42b1fb, 83b00fe, 78ee24c. Ich habe alle 14 geänderten Dateien gelesen. Dazu kamen `src/routes/help/+page.svelte:26-35`, `src/routes/help/Glossary.svelte`, `tests/e2e/features/help.feature:28` und `invoice-new.feature:40-42` sowie der eigene Bericht aus Runde 1 (`docs/reviews/w3-review-1.md`).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-6 | Minor | `docs/reviews/w3-fachreview-2.md` (M-1, V-1, V-2, V-4, V-5), `docs/design/personas/weber-w3-leistungszeitraum.md` (P-3 bis P-6), `docs/design/personas/helga-w3-leistungszeitraum.md` (P-1 bis P-3) | Diese Befunde sind weder umgesetzt noch mit Grund abgelehnt, und keine Datei im Delta hält eine Triage fest. Beispiel M-1 (Minor): Der Grund für «umstritten» fehlt, `messages/de.json:723` ist unverändert. Nach «Done means» dürfen Minors in ihrem Bericht bleiben, deshalb blockiert das den Merge nicht. Einen Punkt nennt der fach-reviewer aber ausdrücklich als echtes Risiko: Weber P-4 und Helga P-1, «Umlagefähig» ist bei «Warmwasser» angehakt und es gibt keinen Hinweis zum Wohnungsboiler. Er sollte als Issue (`fachlich`) erfasst werden, oder unter «Found» soll stehen, warum nicht. |
| C-7 | Nit | `src/__tests__/help-page.dom.test.ts:31-33` | Der Glossar-Test prüft nur den Satz «Ohne Leistungszeitraum …». Der Satz, der den Widerspruch aus P-1/P-4 auflöst («Mit Leistungszeitraum zählen dessen Tage …», `messages/de.json:86`), ist nicht festgehalten. Fällt er weg, bleibt der Test grün. |
| C-8 | Nit | `src/__tests__/help-page.dom.test.ts:23` | Der Testname «erklärt Kosten über mehrere Jahre und den Boiler in der Wohnung» erwähnt das Glossar nicht, obwohl der Test es auch prüft. Ein eigener `it`-Block für das Glossar wäre klarer. |

ponytail-review: Lean already. Ship. Das Delta besteht aus Texten, zwei Testergänzungen und einer verschobenen Kommentarzeile. Nichts ist ungenutzt zurückgeblieben.

## Blocker/Major

Keine. C-1 aus Runde 1 (Produktentscheid) ist jetzt das Entscheidungs-Issue #282. Laut «Done means» gehört es unter «Blocked on me» und ist nicht Teil dieses Deltas.

## Bestätigt

- **C-2 (Runde 1) behoben:** `help-page.dom.test.ts:22-39` setzt die Systemzeit auf 2027-03-01 und prüft auf der Hilfeseite «Geben Sie dann 01.04.2027 bis 31.03.2032 ein.» und den Boiler-Absatz. Ohne `{ year, end: year + 5 }` oder ohne `m.invoices_service_period_boiler()` in `help/+page.svelte:33-34` schlägt der Test fehl, also deckt er genau die Lücke aus C-2 ab. Die Uhr wird im `finally` zurückgesetzt.
- **C-3 behoben:** In `InvoiceDataFields.svelte:45-47` steht die Konstante `year` jetzt vor dem Kommentar «ISO dates compare as text …». Dieser Kommentar steht wieder direkt über `byServicePeriod`. Das Verhalten ist unverändert.
- **C-4 behoben:** fr «qu’à intervalles de plusieurs années», it «a intervalli di alcuni anni» (`messages/fr.json:722`, `it.json:722`).
- **C-5 behoben:** In `implementation_plan.md:7-19` sind die erledigten Punkte abgehakt und die Dateien unter «Files:» aufgeführt. Offen sind nur die Abschlussrunde und der Merge.
- **Weber P-2 / Helga P-5:** In allen vier Sprachen heisst es jetzt «endet am Tag, bevor die Arbeit das nächste Mal gemacht wird» und «Der Boiler der zentralen Warmwasseranlage» (`messages/*.json:722`). Der DOM-Test `invoice-pages.dom.test.ts:507-510` prüft das. Auf d51f85e schlägt er fehl, weil dort noch «endet am Tag vor der nächsten. Ein Beispiel: Der Boiler wird …» steht. Die Jahreszahlen-Prüfung `['2027','2027','2027','2027','2032']` bleibt gültig, denn der neue Text enthält keine weitere Jahreszahl.
- **Weber P-1 / Helga P-4:** `glossary_period_text` nennt den Leistungszeitraum in allen vier Sprachen (`messages/*.json:86`) und entspricht inhaltlich `invoices_date_help`. Der Text erscheint nur in `Glossary.svelte` auf der Hilfeseite. Der DOM-Test `help-page.dom.test.ts:31-33` schlägt auf d51f85e fehl.
- **Fach-Review 2:** V-3 umgesetzt, en «water heater» in `_years` und `_boiler` (`messages/en.json:722-723`). V-6 umgesetzt, `docs/nebenkostenabrechnung-anforderungen.md:141` sagt jetzt dasselbe wie die UI.
- **Texte vollständig:** Alle vier `messages/*.json` sind gültiges JSON mit je 1'458 Schlüsseln. `invoices_service_period_years` enthält überall `{year}` und `{end}` (mit `node` geprüft). Jeder geänderte Schlüssel ist in allen vier Sprachen geändert.
- **E2E-Szenarien bleiben passend:** `help.feature:28` und `invoice-new.feature:42` prüfen den ersten Satz von `_years`. Der ist unverändert. Es gibt keinen neuen Bildschirm und keinen neuen Zustand, also nichts für `screens.json`, `accessibility.feature` oder `sprachen-bildschirme.feature`. Das Delta ändert weder `tests/e2e/` noch die API-Verträge.
- **Szenario:** Das Delta präzisiert Texte, die neuen Inhalte sind mit DOM-Tests festgehalten. Für Szenarien gilt dasselbe wie in Runde 1 (`invoice-new.feature:41`, `help.feature`). Kein neues Verhalten braucht ein eigenes Szenario.
- **Workflow-Notizen** (`docs/reviews/workflow-notes-issue-250-254.md`) und Berichte: nur Dokumentation, passend zum Plan-Eintrag «Workflow note». Im Delta steht nichts, was nicht zur Anforderung gehört.
- **Sicherheit/Design:** Es gibt keine Änderung an BFF, Auth, Markup oder Klassen.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2623 Tests): vom Aufrufer gemeldet. Ich wollte `help-page.dom.test.ts` und `invoice-pages.dom.test.ts` neu ausführen. Das ging nicht, weil `node_modules` im Worktree auf `/home/user/Dwello/node_modules` zeigt und eine Deny-Regel diesen Pfad sperrt.
- Rot-Nachweis der neuen DOM-Assertions: nur durch Lesen bestätigt (Vergleich mit den Texten auf d51f85e). Selbst ausgeführt habe ich ihn nicht. Bei den ersten beiden Assertions in `help-page.dom.test.ts` (Jahr, Boiler) muss man zum Nachweis den Code entfernen, denn die Texte standen schon auf d51f85e.
- E2E der geänderten Texte (`help`, `invoice-new`, `sprachen-bildschirme`, `accessibility`): laut Aufrufer erst nach diesem Review. Nicht gelaufen.
- Ob die fr/it/en-Fassungen sprachlich gut klingen: nur gelesen. Bestätigt sind sie durch Fach-Review 2 («die vier Sprachen sagen dasselbe»).
