# Code-Review Runde 5 (Abschluss, nur Delta) – PR #783, 0045f91f..b8738569

## Befunde

| ID | Schwere | Datei:Zeile | Befund |
|----|---------|-------------|--------|
| – | – | – | keine neuen Befunde |

Offene IDs aus fitness-review-1.md bis -4.md: in diesem Delta nicht berührt; der Aufrufer nannte keine offene ID.

Geprüft: Die sechs entfernten `bffDecisions`-Einträge (tools/fitness/ratchet.json, vorher Z. 46–87) kommen in `src/` auf b8738569 nicht mehr vor (grep je Zeile ohne Treffer); der verbleibende Eintrag (Regex `validFrom`) steht weiter in `src/routes/contracts/[id]/+page.server.ts:351`; der Ratchet-Diff besteht nur aus diesen 36 gelöschten Zeilen, sonst nichts geändert. `bun tools/fitness/fitness.ts --base 0045f91f` im Worktree selbst ausgeführt: grün, «BFF decisions 8», alle anderen Werte unverändert (6/19/60, 14 Listen, 57 Spiegel, 2 Zyklen, 0 Grenzimporte), Worktree danach sauber. `permissions: contents: read` (.github/workflows/ci.yml:317–318) reicht: der Job checkt nur aus, führt git und `fitness.ts` aus und schreibt Annotationen über stdout (`--format github`), braucht kein Token. Die Doku-Zeile (docs/architecture/fitness-functions.md:15) nennt 8 Fundstellen, 7 technisch, 1 Altlast, und das stimmt mit Ratchet und Lauf überein.

## Nicht bestätigt

- Der saubere Merge 0045f91f (`git show --remerge-diff` leer): vom Aufrufer gemeldet, nicht selbst geprüft.
- `bun run fitness -- --base origin/main`, `prettier --check` auf den geänderten Dateien, YAML-Parse und das grüne CI auf 73495701: vom Aufrufer gemeldet. Selbst ausgeführt habe ich nur den Fitness-Lauf gegen 0045f91f (siehe oben).
- Ob der CodeQL-Kommentar nach dem Push verschwindet: zeigt erst die CI auf dem PR.
