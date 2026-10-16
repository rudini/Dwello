# Code-Review Runde 1: Glossar #243 (Commit 047d704)

Worktree: `review-g243-code` (detached, 047d704), Bereich `git diff 047d704~1 047d704`.
Geänderte Dateien (alle gelesen): `UBIQUITOUS_LANGUAGE.md`, `backend/src/db/schema.ts`, `backend/src/services/pdf.service.ts`, `implementation_plan.md`.

## Befunde

| ID | Schwere | Ort | Befund |
|----|---------|-----|--------|
| C-1 | Minor | implementation_plan.md:14 | Der PR-Punkt nennt nur `Fixes #243`. Der Diff ändert Dateien unter `backend/src/` (nur Kommentare), deshalb verlangt `tools/open-work/check-issues.mjs:36-43` im PR-Text `No scenario: <reason>`, sonst wird CI rot. Begründung in Plan und PR-Text aufnehmen (z.B. «No scenario: glossary and code comments only, no behaviour change»). |
| C-2 | Nit | implementation_plan.md:5 | Der Diff fügt eine zweite Leerzeile vor `## Session` ein. |
| C-3 | Nit | implementation_plan.md:9-15 | Die Zeile `Skills: …` fehlt. Der Slice ändert nur Kommentare in Code-Dateien, daher ist das grenzwertig. Alternativ im Plan festhalten, dass für einen reinen Kommentar-Slice keine Skills nötig sind. |

Keine Blocker, keine Major.

## Bestätigt

- **Glossar gegen «Decided (product owner)» in #243:** «Abgerechnete Tage», «Mietstage der Position», «Monatsanteil», «Anteil nach Heizprofil» und «Hinweis auf fehlende Abrechnungen» stehen wörtlich wie entschieden in `UBIQUITOUS_LANGUAGE.md`. Ergänzt sind ausserdem «Saldo 0.00: keine Zahlung, kein Zahlteil» und «Im PDF vom Betrag aus gesehen angezeigt». «Zeitanteil» verweist jetzt auf die neuen Begriffe.
- **Code-Spalten:** Die genannten Spalten gibt es im Code (`schema.ts:213`/`224` `january_pct`/`december_pct`, `:437-438` `position_rental_days`/`billed_days`, `heatingShare` in `statement.service.ts:334`).
- **Marker:** Beide `TODO(fachlich prüfen, #75)` sind entfernt (`schema.ts:437`, `pdf.service.ts:32`). `git grep` findet in `src`, `backend`, `tests` und `tools` keinen Marker mehr, der #75 oder #243 nennt. Damit bleibt `check-issues.mjs` bei `Fixes #243` zufrieden. #75 bleibt offen und hat keinen Marker mehr.
- **Kommentare:** Es bleibt kein veralteter Kommentar zurück. Der Kommentar `schema.ts:436` beschreibt die Spalten weiterhin richtig. Der JSDoc in `pdf.service.ts:29-32` ist ohne die Marker-Zeile vollständig.
- **open-work.test.ts:43-45:** Der Plan hat genau eine `## Session`.
- **Workflow 8:** Die Plan-Session hat eine Checkliste und nennt die geänderten Dateien. Die offenen Punkte (Reviews, Archivieren, PR) sind korrekt nicht abgehakt.
- **Hilfetexte («help texts follow»):** In `messages/de.json` kommen von den neuen Begriffen nur «Monatsanteile» vor, und zwar schon im Sinne der neuen Definition (`profiles_shares_help`, `backend_heating_profile_shares_sum`). Kein Text muss angepasst werden, `messages/*.json` bleibt unverändert.
- **Scope:** Nichts im Diff gehört nicht zur Anforderung. Es gibt keine Verhaltensänderung, also braucht es kein Szenario. Der Workflow-Review nach Workflow 7 entfällt, weil nur Dokumente und Kommentare geändert sind.

## Nicht bestätigt

- `bun run lint`, `bun run check`, `bun run test:coverage` (2606), `cd backend && bun run test` (670/0) und `bun run type-check`: vom Aufrufer gemeldet, nicht erneut ausgeführt. Der Diff entfernt nur Kommentarzeilen, deshalb gibt es keinen Anlass zu zweifeln.
- `check-issues.mjs` lief nicht mit GITHUB_TOKEN. Den Zustand der Issues habe ich über `gh api` gelesen: #243, #75 und #232 sind offen.
- Ob die fachliche Wortwahl stimmt, prüft der `fach-reviewer`, nicht dieses Review.
