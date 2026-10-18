# Slice-Review #348, Runde 2 (Abschluss, 8a5a570..153746f)

Worktree: `review-w3e-close` (153746f). Alle 9 Dateien des Deltas gelesen: `messages/{de,fr,it,en}.json` (de unverändert), `src/__tests__/i18n.test.ts`, `src/__tests__/contracts-i18n.test.ts`, `src/lib/statement-wizard.ts`, `implementation_plan.md`, `docs/archive/implementation-plan-verlauf.md`, `docs/reviews/w3e-review-1.md`.

Abgleich mit den Befunden aus Runde 1:

| Befund R1 | Ergebnis |
|---|---|
| C-2 (Regel nur de/en) | behoben: `i18n.test.ts:32` läuft über `languages` (de, fr, it, en) |
| C-5 (V-6 nur in de) | behoben: `contracts_error_end_required` in en «fixed-term rental contract», fr «contrat de bail de durée déterminée», it «contratto di locazione a tempo determinato» (`messages/*.json:611`); Begriffe wie `docs/design/i18n-begriffe.md:30` und `glossary_fixed_term_text` derselben Sprache; it-Pin in `contracts-i18n.test.ts:49` nachgeführt |
| C-6 (`joined`) | behoben: `statement-wizard.ts:128-132`, `joined` entfernt, kein weiterer Aufrufer; Verhalten gleich (reduce ohne Startwert wie vorher) |
| C-1, C-3, C-4 | stehen gelassen mit Begründung (Plan-Archiv, Aufrufer); keine Blocker/Major, nicht erneut zu beurteilen |

Plan: Sitzung W3e vollständig aus `implementation_plan.md` entfernt und unverändert plus Abschlusszeilen in `docs/archive/implementation-plan-verlauf.md:1056-1067` angehängt; offener Punkt «PR `Fixes #348`, CI, merge» bleibt wie vorgesehen (CLAUDE.md, Workflow 8: Archiv vor dem letzten Commit).

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-7 | Nit | messages/en.json:611, messages/fr.json:611 | Geänderter Text in en und fr ohne Pin; nur it ist in `contracts-i18n.test.ts:49` festgehalten. Gleiche Lage wie C-1 (Wortlaut-Änderung, Regeltests decken Form, nicht Wortlaut) |

Keine Blocker, keine Majors.

Pflichtpunkte:
- Szenario: keines nötig (Wortlaut bestehender Texte, «No scenario» im Plan); Delta ändert kein E2E.
- Neue Bildschirme/Zustände: keine.
- Jeder geänderte Text in allen vier `messages/*.json`: de war schon in Runde 1 geändert, fr/it/en jetzt nachgezogen.
- Nichts Fremdes im Diff: Bericht Runde 1 und Plan-Archiv gehören zum Workflow.
- ponytail-review: Delta kürzt (-4 Zeilen in `statement-wizard.ts`); keine weiteren Funde.
- Rote Tests: Die erweiterte Regel (C-2) wäre auf der Basis nicht rot gewesen (fr/it hatten schon keine `"`), sie schützt nur künftig; der it-Pin wäre gegen den alten Text rot. Beides beurteilt durch Lesen.

## Nicht bestätigt

- `bunx vitest run` (2816 bzw. nach Merge 2832 bestanden), `bun run lint`, `bun run check`, Backend `type-check`: vom Aufrufer gemeldet. Selbst wiederholt: `bunx vitest run src/__tests__/i18n.test.ts src/__tests__/contracts-i18n.test.ts src/__tests__/statement-wizard.test.ts`: 61 bestanden.
- Merge mit `origin/main` nicht Teil dieses Worktrees (153746f); «kein Konflikt in App-Code» vom Aufrufer gemeldet.
- E2E «187 + 242 passed» (Plan-Archiv): vom Aufrufer gemeldet, nicht gesehen.
- fr/it-Formulierungen nicht muttersprachlich geprüft (#342); nur gegen `i18n-begriffe.md` und bestehende Texte abgeglichen.
