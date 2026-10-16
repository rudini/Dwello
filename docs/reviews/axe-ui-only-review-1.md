# Code-Review: axe-Check nur bei UI-Änderungen (Runde 1)

Anforderung: «Accessibility axe ci test soll nur laufen, wenn wirklich was am UI verändert wurde»; Pushes auf `main` laufen weiterhin vollständig.
Geprüft: `git diff origin/main 35c743f` im Worktree `review-axe-code-reviewer` (`.github/workflows/ci.yml`, `docs/test-pyramid.md`, `implementation_plan.md`), alle drei Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Nit | .github/workflows/ci.yml:39 | Der Filter nennt die Ordner unter `tests/e2e/` einzeln (`fixtures|screenplay|targets|tasks|questions|steps`). Kommt ein neuer Ordner dazu, fehlt er stillschweigend. `^tests/e2e/` ohne `features/` ausser `accessibility.feature` (und ohne `.md`) wäre robuster und kürzer. |
| C-2 | Nit | .github/workflows/ci.yml:39 | Der axe-Lauf lädt alle Steps (`playwright.config.ts`: `require: tests/e2e/steps/**/*.ts`), und `tests/e2e/questions/download.ts:3` importiert `backend/src/__tests__/helpers/pdf-text`. Wegen `__tests__/` und `^backend` startet eine Änderung dort den axe-Check nicht, obwohl sie das Laden des axe-Laufs brechen kann. Geringes Risiko: der Job «E2E tests» lädt dieselben Steps und läuft bei `app=true` immer. |
| C-3 | Nit | .github/workflows/ci.yml:39 | `tsconfig.json` (u. a. `verbatimModuleSyntax`, das Vite/esbuild beim Build liest) fehlt im Filter; ebenso andere Feature-Dateien, die `bddgen` mitübersetzt. Beides deckt «E2E tests» bzw. «Build» ab; nur der Vollständigkeit halber. |
| C-4 | Nit | .github/workflows/ci.yml:33 | `git diff --name-only` meldet bei einer Umbenennung nur den neuen Pfad (Rename-Erkennung ist Standard). Wird eine Datei aus `src/` in einen ausgenommenen Pfad verschoben, bleibt `ui=false`. Theoretisch; `--no-renames` würde beide Pfade liefern. Gilt auch für die bestehenden Filter `backend`/`app`. |
| C-5 | Nit | .github/workflows/ci.yml:153 | Beim übersprungenen axe-Job startet der Postgres-Service trotzdem (rund 20 s Runner-Zeit). Ein leeres `image` startet keinen Service-Container; bewusst einfach gehalten ist auch vertretbar. |
| C-6 | Nit | docs/test-pyramid.md:106 | Die Zeile zählt auf, was den Check auslöst, nennt aber nicht ausdrücklich, dass reine Backend-Änderungen (auch `backend/scripts/e2e-db.ts`, das die Daten der geprüften Bildschirme anlegt) ihn überspringen. Das ist der vom Benutzer gewählte Kompromiss; ein Halbsatz würde ihn für spätere Leser sichtbar machen. `project.inlang/` fehlt in der Aufzählung, steht aber im Filter. |

Keine Blocker, keine Major.

## Bestätigt

- **Filter:** Selbst nachgerechnet mit Einzelpfaden: `src/lib/ui/Button.svelte`, `src/lib/server/x.ts`, `src/app.css`, `messages/fr.json`, `project.inlang/settings.json`, `tests/a11y/screens.json`, `tests/e2e/questions/download.ts`, `tailwind.config.js` → `true`; `src/lib/foo.test.ts`, `src/__tests__/x.dom.test.ts`, `tests/mocks/env.ts` (nur Vitest), `tests/e2e/CLAUDE.md`, `tests/e2e/features/demo.feature`, `backend/scripts/e2e-db.ts`, `tsconfig.json` → `false`. Alles, was der axe-Lauf liest, ist erfasst: `tests/e2e/fixtures/screens.ts` liest `tests/a11y/screens.json`, `tests/e2e/questions/language.ts` liest `messages/*.json`, `tests/e2e/tasks/accessibility.ts` importiert `src/lib/wizard-draft`, `tests/e2e/tasks/statement-generate-api.ts` importiert `src/lib/server/…` (alle im Filter), ausser C-2. Kein `{@html}` in `src/`, d. h. das Backend liefert kein Markup, das axe prüft. `@a11y` steht nur in `accessibility.feature`.
- **`grep … || true`:** Der Standard-Shell ist `bash -e` ohne `pipefail`; `|| true` deckt die ganze Pipeline ab. Eine leere Liste ergibt `ui=false`, ohne dass der Schritt abbricht.
- **Job-`env` mit `matrix` und `needs`:** `jobs.<job_id>.env` erlaubt laut GitHub-Kontexttabelle `github, needs, strategy, matrix, vars, secrets, inputs`. Der Ausdruck liefert einen booleschen Wert, als Umgebungsvariable `'true'`/`'false'`. Für `e2e-reports` gilt `false && …` → `'false'`, der E2E-Job wird also nie übersprungen. Fehlt die Ausgabe `ui`, ist `'' != 'true'` → übersprungen; auf `main` setzt Zeile 31 `ui=true`.
- **Step-`if: env.SKIP …`:** Der Kontext `env` ist in `jobs.<job_id>.steps.if` erlaubt; die Job-Variable ist dort sichtbar.
- **Upload-Schritt:** `if: failure()` greift bei übersprungenen Schritten nicht; der Job endet erfolgreich.
- **Prüfstatus:** Die Matrix-Einträge bleiben bestehen, der Job heisst weiter `Accessibility (axe)` und endet mit Erfolg, wenn nur der Hinweis-Schritt läuft. Ein Job-`if` hätte `matrix` nicht lesen können und die Matrix-Namen nicht aufgelöst.
- **Plan:** Nur die aktuelle Session; «No scenario: CI only» passt, weil sich das Verhalten der App nicht ändert. `.github/` ist nach CLAUDE.md Schritt 6 kein Code, also sind keine Zeilen `Skills:`/`Test red:` nötig. Commit-Betreff gültig (43 Zeichen).
- **Umfang:** Nichts ausserhalb der Anforderung geändert.

## Nicht bestätigt

- **Tatsächliches Verhalten auf GitHub Actions:** Ob der Check «Accessibility (axe)» bei übersprungenen Schritten als bestanden (grün) gemeldet wird und ob er in den Branch-Regeln als Pflicht-Check steht. `gh api repos/rudini/Dwello/branches/main/protection/required_status_checks` → 403 «Resource not accessible by integration»; `rules/branches/main` → `[]` (keine Rulesets sichtbar). Belegt erst ein CI-Lauf des Pull Requests mit einer Änderung ohne UI-Bezug. Dieser PR selbst ändert `ci.yml` und setzt damit `ui=true`.
- **Vom Aufrufer gemeldet:** YAML-Parse mit `yaml.safe_load` und die Filterproben des Aufrufers (Backend, Unit-Tests, andere Feature-Datei, docs/tools/.claude → false; Seite, messages, Steps, accessibility.feature, bun.lock → true). Den YAML-Parse habe ich nicht wiederholt, den Filter mit eigenen Pfaden schon (siehe oben).
- **Absicht des Benutzers:** Dass Backend-Änderungen bewusst ausgenommen sind, kenne ich nur vom Aufrufer. Restrisiko: Eine reine Backend-Änderung, etwa neue Seed-Daten in `backend/scripts/e2e-db.ts` oder ein neuer Status aus `backend/src/services`, kann auf einem geprüften Bildschirm einen Zustand zeigen, den axe nie gesehen hat. Siehe C-6.
- Lint, Unit-Tests, `check` und `deepcheck:audit` liefen nicht (keine App-Code-Änderung); der Aufrufer will sie vor dem Push laufen lassen.
