# Code-Review Slice 2, #84 (F-20b, Option B): Mietertexte fr/it/en

Worktree: `review-s2-code` (detached, aa7ff20). Bereich: `git diff c200811 aa7ff20` (mit f158f67, Fix von C-1 aus Slice 1).
Gelesen: alle 15 Dateien im Diff. Dazu die Triage `w4d-84-triage.md`, die Muttersprachen-Berichte `docs/reviews/w4d-native-{fr,it,en}.md`, die Fachreview `docs/reviews/w4d-tenanttexts-fachreview-1.md`, `printable`/`winAnsi`/`formatFloor`/`formatShare` in `backend/src/services/pdf.service.ts`, `.claude/skills/slice-review/SKILL.md` (Triage) und `.claude/skills/ponytail-review/SKILL.md`. Mit grep geprüft: `messages/`, `src/`, `tests/` und `backend/src` auf alten Wortlaut.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | backend/src/services/pdf.service.ts:456 | FR-7 fügt einen Zweig hinzu (`n === 1 ? '1er sous-sol' : …`). Das ist keine reine Textänderung, sondern die Korrektur einer falschen Ordinalzahl, die der Mieter sieht. Kein Test zeigt sie: Im Backend prüft kein Test `formatFloor`, `étage` oder `sous-sol`. Ohne die Änderung wäre also kein Test rot. Die Ausnahme in slice-review gilt für den «Wortlaut einer Übersetzung», nicht für diese Logik. Vorschlag: in `statement-pdf-render.test.ts` ein fr-PDF mit Stockwerk -1 rendern und `1er sous-sol` erwarten, dazu -2 → `2e sous-sol`. |
| C-2 | Nit | messages/en.json:1076 | Die Oberfläche sagt weiter `{percent} by heating profile`. Das PDF sagt jetzt «share under the heating profile» (EN-5, EN-14). i18n-begriffe.md:5 verlangt, dass die Oberfläche die Übersetzung des PDFs übernimmt. Es geht nur um eine Präposition, nicht um einen Fachbegriff. |
| C-3 | Nit | pdf.service.ts:296, :332 / messages/en.json:76 | Das englische PDF setzt jetzt ‘ ’ (EN-2, EN-3, EN-15), die englische Oberfläche dagegen «» («Under «Utility cost statements» …»). Die Zeile «Style» in i18n-begriffe.md:7 regelt Englisch nicht. Eine Ergänzung dort (z. B. «English: ‘ ’ in the PDF») würde die Abweichung als gewollt festhalten. |
| C-4 | Nit | backend/src/services/pdf.service.ts:435 | `formatShare` setzt in allen Sprachen ein normales Leerzeichen vor «%», also auch in den fr-Spalten «Part du logement» und «Part temporelle». Das war schon vor der Änderung so und liegt ausserhalb der Liste von FR-8 (siehe EN-22). Ich nenne es nur, damit FR-8 nicht als vollständig gilt. |

Keine Blocker und keine Majors.

## Geprüft und bestätigt

- **Jede angewendete Zeile entspricht dem Vorschlag im Bericht.** Ich habe sie Zeichen für Zeichen verglichen:
  - fr: FR-1 bis FR-7, FR-15 bis FR-20. Bei FR-8 sind `colon`, `heatingNote`, `heatingMonths`, `heatingPeriodSums`, `heatingPeriodMonths`, `feeOwn`, `sharesNote`, `sharesNoteRounded`, `sharesNoteFuel` (mit « Frais de chauffage et d’eau chaude ») und `fuelInvoices` umgesetzt.
  - it: IT-1 bis IT-6 und IT-9 bis IT-11.
  - en: EN-2 bis EN-5, EN-10, EN-11, EN-14 bis EN-21 und EN-23.
- **Eine Abweichung ist begründet.** In `sharesNoteRounded` steht nur das NBSP aus FR-8. «figurant» (FR-14) gehört zu #256, wie die Triage sagt.
- **Was ausgeschlossen ist, bleibt unverändert.** Das sind EN-1 (`FLOORS.en`), EN-24 («further steps», reminder-letter.ts:85), die Rechenzeilen `part*` (#256) sowie `tenancyLine` in fr und it (#325). Ausserhalb der Liste hat sich im Code und in den messages nichts geändert. Einzige Ausnahme ist `statements_balance_settled` in fr und en, das die Fachreview V-1 verlangt. Die Zeile «Ausgeglichen» in i18n-begriffe.md stimmt mit V-1 überein. Die it-Oberfläche hatte schon «In pareggio» (it.json:937) und «Arrotondamento a 5 centesimi» (it.json:1081). PDF und Oberfläche stimmen jetzt überein.
- **Die geschützten Leerzeichen im Französischen** sind als ` ` geschrieben, also U+00A0 und nicht U+202F. Ein grep über den fr-Block (pdf.service.ts:100–190) findet vor « : ; % » und innerhalb von « » kein normales Leerzeichen mehr. Einzige Ausnahme ist `tenancyLine` (Z. 159), die absichtlich unverändert bleibt. In it und en wurde kein NBSP eingefügt.
- **Die PDF-Schriften (WinAnsi) können die neuen Zeichen drucken.** `printable` (pdf.service.ts:440) lässt U+00A0 durch (Bereich `\xa0–\xff`). ‘ und ’ stehen in `WIN_ANSI` (Z. 438). In fr «1er» und it «né» kommen nur Latin-1-Zeichen dazu. `winAnsi` ersetzt also nichts.
- **Die angepassten Tests wären ohne die Änderung rot gewesen.** `statements-i18n.test.ts` erwartet «Solde nul», die Basis hatte «Soldé». `statement-pdf-render.test.ts` erwartet «Arrotondamento a 5 centesimi + 0.02», die Basis hatte «Arrotondamento». `i18n.test.ts` mit `\bricezione\b` hätte auf c200811 it.json:1472 («Tra la ricezione …») gefunden.
- **Alter Wortlaut ist nirgends mehr gepinnt.** Ich habe in `src`, `tests` (Features, Contracts) und `backend/src` nach «Soldé», «Settled», «Saldato», «Avvertenze», «virons», «avec la section paiement», «n’est … payé», «ce courrier», «due solleciti», «inspect the receipts» und weiteren gesucht. Treffer gibt es nur noch in älteren Persona-Berichten unter `docs/` und in `PRD` («Settled» als Statusbeschreibung, ein anderer Sinn).
- **Prettier:** `bunx prettier … | diff` meldet für `pdf.service.ts` und `reminder-letter.ts` keine Abweichung.
- **ponytail-review:** Der Diff ist die kürzeste Form. Er ersetzt nur Strings und fügt einen Ternary hinzu, der dem bestehenden Muster in `above` folgt. Es gibt keinen Helfer, keinen toten Code und nichts Unbenutztes. Keine Befunde.
- **No scenario:** Der Grund ist für die Textänderungen tragfähig, denn die Ausnahme in slice-review, Triage, gilt für geprüften Übersetzungswortlaut. Für den Ordinalzweig siehe C-1. Es gibt keinen neuen Bildschirm und keinen neuen Zustand.
- **Gerechnet:** `bunx vitest run src/__tests__/statements-i18n.test.ts src/__tests__/i18n.test.ts` lief mit 2 Dateien und 30 Tests grün. `bun test` im Backend für `statement-pdf-render`, `pdf-translations`, `reminder-letter` und `pdf-text` lief mit 4 Dateien und 62 Tests grün.

## Nicht bestätigt

- **Vom Aufrufer gemeldet:** `bun run lint`, `bun run check`, `cd backend && bun run type-check`, `bunx vitest run` (2779 Tests) und die Backend-Tests `statement-pdf-data`, `statement-pdf.pg`, `swiss-today.pg` und `reminders.pg`. Selbst ausgeführt habe ich nur die Tests, die unter «Gerechnet» stehen.
- **Achtung, Nebenwirkung:** Mein Backend-Lauf hat über das Preload von `pdf-text.test.ts` die Datenbank `dwello_test` neu aufgesetzt («Datenbank dwello_test neu aufgesetzt (15 Migrationen)»). Falls zur selben Zeit ein anderer pg-Lauf die Datenbank benutzt hat, kann er deshalb fehlgeschlagen sein. Dann bitte erneut ausführen.
- **Ob pdfkit am U+00A0 tatsächlich nicht umbricht und es als Leerzeichen zeichnet,** habe ich nicht sichtbar geprüft. Ich schliesse es aus `printable` und daraus, dass `heatingPeriodSums` und der Mahnbrief (`NBSP`, reminder-letter.ts:23) schon vorher U+00A0 verwendet haben.
- **Die muttersprachliche Richtigkeit der Vorschläge** habe ich nicht selbst beurteilt. Ich stütze mich auf die Berichte und die Fachreview.
