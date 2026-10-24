# Review Slice 803, Runde 1 (20a7b16)

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-1 | Minor | tools/deepcheck/src/render.ts:25 | `cell()` setzt den Wert in einen Code-Span (`` `…` ``). In Code-Spans gelten keine Backslash-Escapes (CommonMark), nur GFM-Tabellen entfernen `\|` vorab. Ein Pfad mit `\` erscheint jetzt als `\\` (in Tabellen und in der G4-Liste, Zeile 114), vorher stimmte die Ausgabe. Weil `cli.ts:112` und `graph.ts:109` die Pfade auf `/` normalisieren, kommt das nur bei einem POSIX-Dateinamen mit `\` vor. Kein Test für den neuen Fall (`cli.test.ts:211` prüft nur `|`). In `07-tables.ts:10` (Zellen ohne Code-Span) ist das Escapen dagegen richtig. |
| C-2 | Minor | .github/workflows/security-alerts.yml:48 | #803 «Decided»: «Only a false positive that cannot be written differently is dismissed. `SECURITY.md` and the issue text of the nightly workflow change accordingly.» Der neue «Done means»-Text verlangt nur «fixed» und nennt keinen Weg für einen Fehlalarm, den der Code nicht vermeiden kann. Der frühere Weg (dismiss) ist gestrichen. Die Regel steht nur in SECURITY.md:29, auf die der Text bloss mit «(SECURITY.md)» bei der Frist verweist. |

Keine Blocker/Major.

Geprüft:
- `SIGNS` hat 32 verschiedene Zeichen. `SIGNS[b & 31] === SIGNS[b % 32]` gilt für alle 256 Bytes (per Node nachgerechnet).
- `withoutComments` (`<!--[\s\S]*?-->`) entfernt jeden Treffer des alten `<!--[^>]*-->` an derselben Stelle gleich weit (beide enden am ersten `-->`). Mehr wird nur bei `>` im Kommentar entfernt, was in den Svelte-Ankern nicht vorkommt. In no-german-in-code war das Muster schon vorher so.
- `textOf`: Svelte-SSR maskiert `<` im Text. Deshalb ist die Wiederholung nach dem ersten Durchgang wirkungslos. `<[^>]*>` statt `<[^>]+>` (building-form) ändert bei gerenderten Labels nichts.
- `escapeRegExp` maskiert eine Obermenge der alten Zeichen ([/?] bzw. `.`). Damit sind die Prüfungen in dashboard-page und in den drei Step-Dateien gleich streng oder strenger, aber nicht schwächer.
- graph.ts und no-german-in-code: Keine getrackte `.svelte`-Datei enthält `<Script…`/`<Style…`, `<script`/`<style` mit angehängten Zeichen oder `</script …>`/`</style …>`-Varianten. Die Treffermenge bleibt im Repo gleich, und deepcheck sieht dieselben Imports.
- 05-knowledge: Die erste Regex beschreibt dieselbe Sprache (Leerraum ohne Komma geht in die nächste Wiederholung oder ins `\s*\]`). Nur `m[1]` verliert hinten Leerraum, die Literale daraus bleiben gleich. Die zweite Regex trennt `\\.` und Zeichenklasse jetzt disjunkt.
- Ablage der Helfer: `src/__tests__/helpers/` gibt es schon. `tests/e2e/questions/` darf von `steps/` genutzt werden, und lint ist laut Aufrufer grün.
- Prettier: In den src-Dateien weicht keine geänderte Zeile ab, die verbleibenden Abweichungen sind Altbestand. `tests/` und `tools/` prüft Prettier nach `.prettierignore` nicht.
- Commit-Nachricht nennt beibehaltenes Verhalten («No scenario», kein Rot-Lauf nötig). SECURITY.md entspricht dem Entscheid.
- Keine fremden Änderungen: Die Neueinrückung in buildings-i18n kommt vom `textOf(...)`-Umschlag.

## Nicht bestätigt

- Lokaler CodeQL-Lauf (keiner der 26 übrig): vom Aufrufer gemeldet, nicht wiederholt.
- `bunx vitest run src/__tests__ tools` (3425 grün), `cd backend && bun test src/__tests__/setup*.ts`, `bun run lint`, `bun run check`, `bun run type-check`: vom Aufrufer gemeldet.
- E2E statement-detail/-edit/-send (117 grün): vom Aufrufer gemeldet. Ob eine Meldung in den Features Regex-Sonderzeichen ausser `.` enthält, die vorher als Regex-Syntax galten, habe ich nicht einzeln nachgesehen. Falls ja, prüft der Step jetzt strenger.
- Gleiche Treffer der beiden 05-knowledge-Regexes über alle getrackten Dateien: vom Aufrufer gemeldet. Ich habe nur die Äquivalenz der Muster durch Lesen beurteilt.
