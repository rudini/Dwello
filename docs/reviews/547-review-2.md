# Code-Review #547, Runde 2 (Abschlussrunde, fc52082..b213c28)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine neuen Befunde. |

Status der offenen Punkte aus Runde 1 (`docs/reviews/547-review-1.md`):

- **C-1 (Minor): geschlossen.** Die Message von b213c28 sagt, dass der Test «warnt beim Versand eines aktuellen Entwurfs nicht» aus fc52082 bewahrtes Verhalten pinnt.
- **Nicht bestätigt, Fokus beim Wechsel Versanddialog -> «Entwurf neu berechnen»: geschlossen.** `src/__tests__/statement-pages.dom.test.ts:633-636` prüft jetzt, dass der Fokus im Bestätigungsdialog auf `dialog-cancel` steht. Die Commit-Message von b213c28 nennt den Test als Pin von bewahrtem Verhalten; das passt, denn fc52082 hat den Wechsel eingeführt und der Fokus war dort nach meiner Lesart schon richtig. Ich habe es neu laufen lassen: 183/183 grün.

Geprüft: it.json:284 und :1260 «recapitarle»/«recapitarla» entsprechen V-1 aus `docs/reviews/547-fachreview-1.md` und stimmen mit `statements_send_text_1` und dem Glossar überein («consegna» = Übergabe, i18n-begriffe.md:109). `dashboard_task_outdated_drafts_text` stammt aus #454 und wurde auf ausdrückliche Bitte des fach-reviewers mitgeändert, gehört also zum Auftrag. Die anderen drei Sprachen sind nicht betroffen, weil nur der italienische Wortlaut geändert wurde. Commit-Subjects sind konform. Sonst enthält das Delta nichts, was nicht zum Auftrag gehört.

## Nicht bestätigt

- `dashboard_task_drafts_text_one`/`_many` (it.json:279-280) sagen noch «lo consegni / li consegni all’inquilino» für «zustellen». Das stand schon so im Basis-Commit, gehört nicht zum Diff und ist kein Befund. Ob es nachgezogen wird, entscheidet der fach-reviewer.
- Message-Tests (519) und Persona Anna ohne Blocker/Major: vom Aufrufer gemeldet, nicht wiederholt.
