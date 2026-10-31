# Code-Review #528, Runde 3 (Delta `git diff 23f44db ad27732`, Commit ad27732)

Geschlossen: C-11, C-12, C-14.

| ID | Schwere | Datei:Zeile | Befund |
|---|---|---|---|
| C-13 | Minor | backend/src/services/statement.service.ts:343 | Weiterhin offen, wie in 528-2 beschrieben: Der Hinweis des Entwurfs nennt die gespeicherten Rechnungen der Positionen. Ist eine davon seit dem Erstellen gelöscht, steht sie trotzdem im Hinweis, und ihr Link führt auf «nicht gefunden». Das Delta ändert daran nichts. |

Das Delta bringt keine neuen Befunde.

## Nicht bestätigt

- Vom Aufrufer gemeldet, nicht selbst ausgeführt: `bun run lint`, `bun run check`, `bunx vitest run --changed origin/main` (1102), E2E chromium `-g "Verteilschlüssel"` (29 passed), der Rotlauf des neuen DOM-Tests ohne die Gebäude-Zuordnung in PreviewChecks.
- Das neue Szenario hat keinen eigenen Rotlauf. Beim Lesen wäre es auf 7e22d79 rot: Dort kam der Hinweis aus den Rechnungen, wie sie jetzt sind, also wäre er bei «Pro Einheit» sichtbar gewesen. Die Ausnahme in CLAUDE.md, Workflow 2, gilt, weil die Tests darunter (pg-Test und DOM-Test zu P-1) laut Aufrufer rot gesehen wurden. Diese Rotläufe sind nicht selbst bestätigt.
- docs/reviews/528-datenpruefung-1.md ist ein Bericht und kein Code, deshalb nicht inhaltlich geprüft.

Geprüft: C-11 mit dem neuen Szenario in statement-detail.feature:863-873. Die Positionen stimmen beim Erstellen überein, die Rechnung wird danach über `seed.invoiceKey` geändert. Der negative Schritt hat einen positiven Anker (Status «Entwurf»), und die Frage nennt die Rechnung mit «Pro Einheit». Die Steps rufen nur Questions auf. C-12 mit dem DOM-Test in statement-wizard.dom.test.ts:1051-1060: Ohne die `map` in PreviewChecks.svelte:56-60 fehlt der Gebäudename, dann wäre der Test rot. C-14: api-specification.md:293 stimmt mit `withOtherKeys` überein. Das Delta braucht keine neuen Texte, keinen neuen Bildschirm und keinen neuen Zustand.
