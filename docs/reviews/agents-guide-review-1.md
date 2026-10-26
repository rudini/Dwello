# Code-Review G-1 bis G-3 (Agenten nach «Getting the most out of Opus 5.5»), Runde 1

Bereich: `git diff origin/main d525d7fd -- . ':!implementation_plan.md' ':!docs/reviews/agent-effort'` (Commits da07929e, d525d7fd)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | .claude/skills/slice-review/SKILL.md:42 | Dort steht weiter «fixes of Minors/Nits get no round of their own». Nach G-3 meldet kein Reviewer mehr Nits (code-reviewer, fach-reviewer und jetzt daten-pruefer: «Report no Nits»; persona: nur Blocker/Major/Minor). Damit nennt `slice-review` Nit weiter als Art von Befund, und die Anforderung «slice-review no longer names Nit as a severity» ist nur in Z. 38 umgesetzt. Dieselbe überholte Klasse steht in `.claude/skills/pull-request/SKILL.md:20` («Minor/Nit fixes») und in `CLAUDE.md:56,73` («Minor/Nit»). Eine Änderung an `CLAUDE.md` braucht die Zustimmung des Nutzers. |
| C-2 | Minor | .claude/agents/daten-pruefer.md:18 | «Report no Nits: a format or wording point that changes no amount stays out» widerspricht dem Satz davor («A Minor is a real wrong value or text») und Schritt 4 der Datei: Bei einer QR-Rechnung ändern IBAN, Referenzformat, Mitteilung und Schuldner keinen Betrag. Nach dem Wortlaut darf ein falscher Text oder ein falsches Format im PDF oder in der QR-Rechnung wegfallen. code-reviewer und fach-reviewer grenzen enger ab («… that change nothing»). |

Geprüft: alle sechs geänderten Dateien. Persona-Bericht: «Ablauf» nur bei Abweichung; Verwirrung und Fehlerrisiken gehen in die Tabelle oder in «Beobachtungen»; «Nicht geprüft» mit dem, was versucht wurde. Ein Hinweis zum Code passt hier nicht, weil die Persona keinen Code liest. daten-pruefer: keine Nits, eine «Geprüft»-Zeile, «where you looked». Der `effort`-Schlüssel steht in allen vier Agenten. Die Tabellen A–D und der Entscheid des Benchmarks stimmen mit den Laufberichten `docs/reviews/agent-effort/*.md` und mit `233-review-3.md` überein: C-11 bis C-16, C-15 in C-1 von low, R-2 als `recipient` in V-3 von high, Fedlex nur bei high, Marco P-1 bis P-7. `docs/design/personas/README.md` nennt keine Gliederung des Berichts und widerspricht nicht. `docs/design/arbeitsregeln.md:64,81` beschreibt noch die alte Gliederung, ist laut Kopfzeile aber nicht mehr in Gebrauch.

## Nicht bestätigt

- `bunx vitest run src/__tests__/open-work.test.ts` und Prettier --check auf den neuen Dateien: vom Aufrufer gemeldet. Ich habe sie nicht erneut ausgeführt, weil der Zugriff auf `node_modules` in der Review-Worktree durch eine Deny-Regel gesperrt ist.
- Die Zahlen zu Tokens, Tool-Aufrufen und Laufzeit in `agent-effort-benchmark.md` (Z. 21, 33, 46, 62) stehen in keinem Laufbericht. Dort habe ich gesucht (`grep token|tool call` in `docs/reviews/agent-effort/`).
- Der Schlüssel `effort` und seine Werte sowie die Aussage «Overrides the session effort level» stammen aus code.claude.com/docs/en/sub-agents.md, das ich nicht abgerufen habe. Das sind Angaben des Aufrufers.
- Die Referenz in Benchmark D («Opus at the session's effort found 6») stammt aus `agent-models-benchmark.md` in der Git-History (94082bd7). Diese Datei habe ich nicht gelesen.
