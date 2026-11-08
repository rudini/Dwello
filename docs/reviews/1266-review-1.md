# Code-Review Slice 1266, Runde 1 (10e0c78..93796c4)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Major | messages/de.json:805 (`contracts_parties_fixed_transfer`), messages/de.json:804 (`contracts_parties_fixed_by_law`); tests/e2e/features/contract-edit.feature:327-330, tests/e2e/steps/contract-form.steps.ts:450-462 | Die neue Anleitung in der Hilfe unter «Bearbeiten» hat kein Szenario. Gemeint sind «Wählen Sie für das Vertragsende «Aufhebungsvereinbarung». … Es genügen Ihre Zustimmung oder das Urteil.» und «… oder wenn Sie mit den Erben eine Aufhebungsvereinbarung getroffen haben». Geprüft wird beides nur im DOM-Test und in `i18n.test.ts`. Alle anderen geänderten Texte prüft ein Schritt. |
| C-2 | Minor | messages/*.json:2409 (`contracts_duration_agreement`), src/routes/contracts/new/PeriodStep.svelte:72 | Der geänderte Text «Unbefristet, beendet (Aufhebungsvereinbarung)» ist in keiner Sprache durch einen Test festgehalten (es gibt keinen Treffer in `src/__tests__` oder `tests/e2e`). Ohne ihn würde kein Test rot. |

## C-1 Sichtbare Änderung der Hilfe unter «Bearbeiten» ohne Szenario

- **Warum falsch:** Nach CLAUDE.md, Workflow 1 und «Done means», braucht jede sichtbare Verhaltensänderung ein Szenario ohne `@wip` oder `No scenario: <reason>`. Die Fachreview 1266-1 stuft die Ergänzung von `contracts_parties_fixed_transfer` als Major ein (V-1): Ohne sie bleibt im Dialog «Kündigung» vorausgewählt, und Regel 4 neu gilt nicht. Das ist also eine Anleitung, der der Liegenschaftsverwalter folgt, nicht nur eine andere Formulierung.
  - Für die Hilfe zum Eintritt eines Dritten gibt es kein Szenario. `grep -rn "Tag vor dem Wechsel\|Geschäftsräume\|Scheidung" tests/e2e` findet nichts.
  - Das Szenario «Beim Tod des Mieters läuft der Mietvertrag weiter» (`contract-edit.feature:328`) prüft in `contract-form.steps.ts:453` und `:460` nur Teile, die unverändert sind. Für den Dialog hat der Diff den neuen Teil ergänzt (`contract-detail.steps.ts:430`, V-5). Das Gegenstück unter «Bearbeiten» (`contracts_parties_fixed_by_law`, V-2) fehlt.
  - Keine der drei Commit-Nachrichten nennt `No scenario`.
- **Wie es sich zeigt:** Setzt man in `messages/de.json` die beiden Keys auf den Stand von 10e0c78 zurück, bleibt `contract-edit.feature` grün. Rot wird nur `contract-edit.dom.test.ts:427-440`.
- **Behebung:** Ein neues Szenario in `contract-edit.feature` zum Eintritt eines Dritten («… erfährt, dass er das Vertragsende als Aufhebungsvereinbarung erfasst»). Ein neues Szenario ist frei. Für den Erben-Teil unter «Bearbeiten» entweder ein neuer Schritt im Szenario `:328` (eine strengere Prüfung, die #1267 für die Erben-Sätze mit abdeckt) oder ein eigenes neues Szenario.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt (der Worktree hat kein `node_modules`):
  - bun run lint, check, fitness und backend type-check grün
  - bunx vitest run: 4575 grün
  - E2E chromium contract-detail und contract-edit samt den gefilterten Zeilen von accessibility und sprachen-bildschirme: 296 grün
  - vor der Textänderung 9 Unit-Tests und 7 Szenarien rot am geänderten Schritt
- Den roten Lauf habe ich nur durch Lesen beurteilt. Jede geänderte oder neue Prüfung verlangt Text, den es auf 10e0c78 nicht gab. Das passt zu der Meldung des Aufrufers.
- Prettier auf den eigenen Zeilen von `i18n.test.ts:322-341` und `contract-status.test.ts:138` (Zeilen über 100 Zeichen, nach `'],` ein Komma bei `trailingComma: none`) konnte ich nicht ausführen. Die Datei hat solche Zeilen schon vorher. Es handelt sich nicht um neue Dateien, der CI-Prettier-Check betrifft sie also nicht.
- Ob die Hilfe unter «Bearbeiten» mit «Wählen Sie … «Aufhebungsvereinbarung»» auf eine Option zeigt, die es dort gibt: Bei einem ungekündigten Vertrag gibt es «Aufhebungsvereinbarung» nur im Dialog «Mietvertrag beenden» auf der Detailseite. Das ist der vom Product Owner entschiedene Wortlaut der Fachreview, also kein Befund dieses Diffs. Nicht weiter verfolgt.

Geprüft:
- Alle 28 Texte (7 Keys × 4 Sprachen) stimmen zeichengenau mit der Tabelle «Wortlaut» in docs/reviews/1266-fachreview-1.md überein, per Skript verglichen. Im fr steht vor «:» und innerhalb von « » überall U+00A0.
- Regel 4 und die Zeilen `:40` und `:104` in docs/anforderungen-vertragsende.md stimmen zeichengenau.
- Drei Glossarzeilen stimmen zeichengenau. Vertragsende weicht nur um den in #1266 entschiedenen Schluss nach V-4 ab.
- Die geänderten Szenariozeilen sind genau die, die #1278 und #1282 freigeben (contract-detail.feature:192, 194, 219, 226, 456; contract-edit.feature:227, 228). Die Schrittdefinitionen prüfen nur mehr, nicht weniger.
- Es bleiben keine alten Texte in src, tests oder docs (ohne archive, reviews und personas) zurück.
- Kein unbenutzter Code, keine Backend-Änderung, keine neuen Bildschirme oder Zustände.
