# Code-Review persona-kit, Runde 1 (cf7825e)

Bereich: `git diff origin/main..cf7825e` (4 Dateien, +18/−4). Alle geänderten Dateien gelesen.

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
| --- | --- | --- | --- |
| C-1 | Minor | `docs/archive/implementation-plan-verlauf.md:9-12` | Punkte «Checks», «code-reviewer round(s)» und «Archive session, push, PR» sind schon abgehakt, obwohl der Lauf der Checks noch läuft, diese Review-Runde die erste ist und noch kein PR besteht. Wie in #209 (C-3 von `issue-209-review-3.md`) erst mit dem Ergebnis abhaken, die Zahlen der Checks und die Review-Runde (`docs/reviews/…`) unter dem Punkt eintragen. |
| C-2 | Minor | `docs/archive/implementation-plan-verlauf.md:3-14` | Der Slice ändert Code (`persona-kit.mjs`), aber es fehlt eine `Skills:`-Zeile. Entweder `Skills: ponytail, ponytail-review` mit Ergebnis, oder kurz begründen, warum tdd entfällt (Werkzeug ohne Test, belegt durch den Smoke-Lauf). |

Keine Blocker, keine Major.

## Bestätigt durch den Code

- `persona-kit.mjs:8`: `createRequire(new URL('../../../package.json', import.meta.url))` zeigt von `docs/design/tools/` auf die Wurzel des Repos; `createRequire` nimmt eine `file:`-URL an. Nachgeprüft mit `node` im Worktree: `@playwright/test` und `jose` werden aufgelöst (über den Symlink `node_modules` → Haupt-Checkout). Kein anderer fester Pfad `/home/user/Dwello` mehr in der Datei.
- `/* global … URL … */` passt zur Benutzung von `URL`; nichts Unbenutztes.
- `.claude/agents/persona.md:11` und `docs/design/arbeitsregeln.md:80`: beide sagen «import in place, do not copy», die alte Kopier-Anweisung ist an beiden Stellen weg. Sonst keine Stelle im Repo (ausser alten Reviews und Persona-Berichten), die zum Kopieren auffordert.
- Kein Szenario nötig: reines Werkzeug der Persona-Läufe, keine Verhaltensänderung für Nutzer; keine UI-Texte, keine E2E-Dateien.
- Nichts im Diff ohne Bezug zur Anforderung.

## Nicht bestätigt

- Smoke-Lauf (`/login` → 200, Anmeldung, `/dashboard` «Übersicht - Dwello», auch aus `…/lc/dwello`): vom Aufrufer gemeldet; App nicht gestartet (Vorgabe).
- eslint/prettier sauber auf `persona-kit.mjs`, fallow- und deepcheck-Gates: vom Aufrufer gemeldet.
- lint, check, test:coverage, backend test, type-check: vom Aufrufer gemeldet als laufend, Ergebnis offen.
