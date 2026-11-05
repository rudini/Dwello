# Fachreview 1126-4: Hinweis auf Entwürfe mit Mietern (Commit 680357f)

Re-Review zu `docs/reviews/1126-fachreview-3.md`. Geprüft: nur Wortlaut, Begriffe und Übersetzungen von `reports_note_drafts_one`/`_many` sowie die Fixes zu V-14 und V-15 (`git diff 0e38ec3 680357f -- messages UBIQUITOUS_LANGUAGE.md`).

Geschlossen: V-14, V-15

| ID | Rolle | Schwere | Befund |
|---|---|---|---|
| V-16 | Verwalter | Minor | `messages/*.json:1809–1810` `reports_note_drafts_one`/`_many`: Die Namen stehen jetzt mitten im Text, direkt vor dem Satz mit dem Pronomen. Gerendert (`src/__tests__/reports-pages.dom.test.ts:77`) heisst es «1 Abrechnung ist noch ein Entwurf: Lea Graf. Sie zählt schon mit, ist aber noch nicht versendet.» «Sie» bezieht sich so scheinbar auf die Mieterin oder, bei mehreren («… Marc Huber. Sie zählen schon mit …»), auf die Anrede des Vermieters. Dasselbe in fr («Lea Graf. Il est déjà compté»), it («Lea Graf. È già compreso») und en («Lea Graf. It already counts»). Fix: Liste ans Ende setzen, wie bei `reports_note_not_current_*` (Text unten). Danach den Schritt `tests/e2e/features/reports.feature:59` («1 Abrechnung ist noch ein Entwurf:») an den neuen Text anpassen (das Szenario ist neu auf dem Branch, auf `main` steht nur `@coming-soon`, also frei) und ebenso die DOM-Erwartung in `reports-pages.dom.test.ts:77`. |

## Wortlaut

fr: vor «:» steht ein geschütztes Leerzeichen (U+00A0), hier als «␣» dargestellt, wie in V-14.

| key | de | fr | it | en |
|---|---|---|---|---|
| reports_note_drafts_one | 1 Abrechnung ist noch ein Entwurf. Sie zählt schon mit, ist aber noch nicht versendet: {statements}. | 1 décompte est encore un brouillon. Il est déjà compté, mais pas encore envoyé␣: {statements}. | 1 conteggio è ancora una bozza. È già compreso, ma non è ancora stato inviato: {statements}. | 1 statement is still a draft. It already counts here but has not been sent yet: {statements}. |
| reports_note_drafts_many | {count} Abrechnungen sind noch Entwürfe. Sie zählen schon mit, sind aber noch nicht versendet: {statements}. | {count} décomptes sont encore des brouillons. Ils sont déjà comptés, mais pas encore envoyés␣: {statements}. | {count} conteggi sono ancora bozze. Sono già compresi, ma non sono ancora stati inviati: {statements}. | {count} statements are still drafts. They already count here but have not been sent yet: {statements}. |

Geprüft: «Entwurf»/«brouillon»/«bozza»/«draft» und «versendet» wie im Glossar (`UBIQUITOUS_LANGUAGE.md:210`) und in den übrigen Texten; U+00A0 vor «:» in allen vier fr-Hinweisen (V-14); Glossarzeile «Kostenabstimmung» (`UBIQUITOUS_LANGUAGE.md:179`) entspricht wörtlich dem Vorschlag aus Runde 3 (V-15); Placeholder `{statements}`/`{count}` in allen vier Sprachen vorhanden; die Umsetzung entspricht dem Entscheid des Product Owners vom 05.11.2026 (Issue #1126, «Drafts on «Berichte»»).

## Nicht bestätigt

Nichts. Keine Rechtsfrage berührt (reiner Hinweistext für den Vermieter); Fedlex nicht nötig. Tests liefen nicht (Auftrag).
