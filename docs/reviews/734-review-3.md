# Code-Review 734, Runde 3 (Abschlussrunde)

Delta: `git diff 134c73951 e6a6933d2` (ohne docs/reviews, implementation_plan.md)

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | Keine offenen und keine neuen Befunde. |

Geschlossen: C-1, C-5

- C-1: `URL.parse(back, url)` normalisiert Punkt-Segmente, Tabs, Zeilenumbrüche und `\` wie der Browser; danach verwirft `pathname.startsWith('//')` jeden Pfad, der als `//host` gelesen würde. Ein `\` kann im serialisierten `pathname` nicht mehr vorkommen, `%2F`/`%5C` bleiben kodiert und werden vom Browser nicht als Trenner gelesen. Die neuen Fälle `/.//evil.example` und `/x/..//evil.example` lieferten auf 3b5faf4f9 `//evil.example` (rot), jetzt `null`.
- C-5: `URL.parse` gibt bei `http://[` `null` statt zu werfen; auf 3b5faf4f9 warf `new URL` (rot).
- `pdfRefusal` (src/lib/server/statement.ts:261-264) kann einen Referer gleicher Herkunft mit Pfad `//x` als `back` setzen; die Seite verwirft ihn und zeigt «Zu den Abrechnungen» mit `/statements`. Das ist sicher und kein Fehler (ein solcher Pfad ist keine Dwello-Seite).

Geprüft: Delta beider Dateien, `+page.svelte` (`href={data.back ?? '/statements'}`), `pdfRefusal`, Red-Wirkung der neuen Testfälle durch Lesen.

## Nicht bestätigt

- bun run lint, bun run check, vitest pdf-refusal und statement-endpoints (28): vom Aufrufer gemeldet.
- `URL.parse` setzt Node ≥ 22.1 voraus, `package.json` nennt `engines.node >=20.0.0`; die Laufzeit ist node:26 (Dockerfile) und `statement.ts` nutzte `URL.parse` schon vor dieser Runde. Nicht geprüft, ob CI eine ältere Node-Version fährt.
