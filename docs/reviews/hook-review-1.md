# Code-Review: commit-msg-gate prüft `-F -` mit Heredoc (9b119f51)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| C-1 | Minor | .claude/hooks/commit-msg-gate.mjs:63 | Bei `-F -` sucht der Regex den ersten Heredoc irgendwo im Rest des Befehls, nicht nur direkt an diesem `git commit`. Kommt die Nachricht aus einer Pipe oder Umleitung und folgt später ein Heredoc eines anderen Befehls, wird dessen Inhalt als Betreff geprüft. Ein gültiger Befehl wird dann blockiert (auf der Basis lief er durch). Nachgestellt: `git log -1 --format=%B \| git commit --amend -F - && cat > notes.txt <<'EOF'\nsome notes here\nEOF` endet mit Exit 2 und «some notes here»: write type(scope)… Abhilfe: den Heredoc nur in der eigenen Zeile des Aufrufs suchen (`<<` vor dem ersten `\n`, `;`, `&&` oder `\|`), zusammen mit einem Durchlass-Fall im Test. |
| C-2 | Minor | tools/claude-hooks/commit-msg-gate.test.ts:93 | Der Kommentar sagt weiterhin «a subject given with -F or a heredoc file passes the commit unchecked». Für `-F -` mit Heredoc stimmt das seit dieser Änderung nicht mehr; es gilt nur noch für `-F <file>`. |
| C-3 | Minor | tools/claude-hooks/commit-msg-gate.test.ts:28 | Der neue Durchlass-Fall (`-F -` mit gültigem Betreff und langer Body-Zeile) besteht schon auf der Basis, wird ohne die Änderung also nicht rot. Die Commit-Message nennt ihn nicht als Test, der bestehendes Verhalten festhält (CLAUDE.md, Workflow 2). Für sich wertvoll ist er trotzdem: Er fängt eine Implementierung ab, die die Body-Zeile statt des Betreffs prüft. |

Keine Blocker oder Major.

Geprüft: Diff vollständig gelesen (2 Dateien). Den neuen Blockier-Fall habe ich durch Lesen als rot ohne die Änderung bestätigt: Auf der Basis liefert `messageOf` `undefined`, und der Push-Check sieht nur den gültigen Betreff von HEAD. Gegen den Hook liefen von Hand: `<<EOF`, `<<"EOF"`, `<<-EOF` mit Tabs, `-qF -` und `--file -` blockieren den 51-Zeichen-Betreff. Eine führende Leerzeile im Heredoc und ein abschliessendes `\n` lassen einen gültigen Betreff durch. `-F <file>`, `-F-` und `--file=-` bleiben ungeprüft, wie die Anforderung es für Nicht-Heredoc-Fälle zulässt. Kopfkommentar des Hooks und Skill `commit-gates` widersprechen der Änderung nicht. Ponytail: Lean already. Kein App-Verhalten betroffen, daher keine Pflicht für Szenario, a11y oder i18n.

## Nicht bestätigt

- `bun run lint` und Prettier ohne Diff auf beiden Dateien: vom Aufrufer gemeldet, nicht neu ausgeführt.
- Dass der Blockier-Fall vor der Hook-Änderung rot war: vom Aufrufer gemeldet. Durch Lesen bestätigt (siehe oben). Ein Lauf des Basis-Hooks aus einer Kopie ausserhalb des Repos ist nicht aussagekräftig, weil die Kopie das Projekt nicht als Repository erkennt.
- `bunx vitest run tools/claude-hooks/commit-msg-gate.test.ts`: von mir neu ausgeführt, 28 Tests bestanden.
